import { create } from "zustand";
import { ROLES } from "../utils/roles";
import authService from "../services/authService";
import userService from "../services/userService";
import shopService from "../services/shopService"; // Import shop service

const normalizeRole = (role) => {
  if (!role) return null;
  const roleMap = {
    "customer": ROLES.CUSTOMER,
    "shopowner": ROLES.SHOP_OWNER,
    "shop_owner": ROLES.SHOP_OWNER,
    "shop owner": ROLES.SHOP_OWNER, // Handle spaced variant just in case
    "admin": ROLES.ADMIN
  };
  const lowerRole = role.toLowerCase();
  // Return mapped role or original if no match (to avoid breaking unknown roles)
  return roleMap[lowerRole] || role;
};

export const useAuthStore = create((set, get) => ({
  role: null,
  userId: null,
  shopId: null, // Add shopId to state
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    // 1. Hydrate from localStorage
    const hasSession = localStorage.getItem("has_session");
    const storedRole = localStorage.getItem("auth_role");
    const storedUserId = localStorage.getItem("auth_userId");
    const storedShopId = localStorage.getItem("auth_shopId");

    if (hasSession && storedRole && storedUserId) {
      // TRUST local storage immediately for UI responsiveness
      const normalizedRole = normalizeRole(storedRole);

      set({
        role: normalizedRole,
        userId: storedUserId,
        shopId: storedShopId,
        isAuthenticated: true,
        isLoading: false
      });

      // 2. Background Refresh
      try {
        let user = null;
        let fetchedShopId = storedShopId;

        // Try getting user profile first
        try {
          user = await userService.getProfile();
        } catch (error) {
          // If 403 and we are a Shop Owner, this might be expected if the endpoint is restricted
          if (error.response?.status === 403 && normalizedRole === ROLES.SHOP_OWNER) {
            console.warn("/users/me denied for Shop Owner. Attempting shop profile fetch...");
          } else {
            throw error; // Re-throw other errors
          }
        }

        // If we are a Shop Owner & (user fetch failed OR we want to confirm shop details)
        if (normalizedRole === ROLES.SHOP_OWNER) {
          try {
            const shopProfile = await shopService.getProfile();
            // If successful, we are valid.
            // We can also extract shopId if available in the profile
            if (shopProfile && shopProfile.id) {
              fetchedShopId = shopProfile.id;
              localStorage.setItem("auth_shopId", fetchedShopId);
            }
            // Use shop profile details to augment user if user fetch failed?
            // For now, just confirming validity is enough to keep session.
          } catch (shopError) {
            if (shopError.response?.status === 404) {
              // Shop not created yet. Valid logic. User is authenticated but has no shop.
              console.log("Shop Owner authenticated but no shop created yet.");
            } else {
              // Real auth error on shop profile too?
              console.warn("Shop profile fetch failed:", shopError);
            }
          }
        }

        if (user) {
          const freshRole = normalizeRole(user.role);

          set({
            role: freshRole,
            userId: user.id || user.userId,
            shopId: fetchedShopId,
            isAuthenticated: true,
            isLoading: false
          });
          // Update storage
          localStorage.setItem("auth_role", freshRole);
          localStorage.setItem("auth_userId", user.id || user.userId);
        } else if (normalizedRole === ROLES.SHOP_OWNER) {
          // We didn't get 'user' but we didn't crash, update shopId if we found it
          set({ shopId: fetchedShopId });
        }

      } catch (error) {
        console.warn("Background auth check failed, but keeping session active:", error);
        set({ isLoading: false });
      }
    } else {
      set({
        role: null,
        userId: null,
        shopId: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  login: async (emailOrPhone, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(emailOrPhone, password);

      if (response && response.data) {
        const { role, userId, shopId } = response.data; // Extract shopId if present

        const userRole = normalizeRole(role);

        localStorage.setItem("has_session", "true");
        localStorage.setItem("auth_role", userRole);
        localStorage.setItem("auth_userId", userId);
        if (shopId) localStorage.setItem("auth_shopId", shopId);

        set({
          role: userRole,
          userId: userId,
          shopId: shopId || null,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error("Invalid response from login");
      }

      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  googleAuth: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      if (!idToken) throw new Error("No Google Credentials");

      const response = await authService.googleAuth(idToken);

      if (response && response.data) {
        const { role: rawRole, userId, shopId } = response.data;

        const userRole = normalizeRole(rawRole);

        localStorage.setItem("has_session", "true");
        localStorage.setItem("auth_role", userRole);
        localStorage.setItem("auth_userId", userId);
        if (shopId) localStorage.setItem("auth_shopId", shopId);

        set({
          role: userRole,
          userId: userId,
          shopId: shopId || null,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        throw new Error("Invalid response from Google login");
      }
      return response;
    } catch (error) {
      console.error("Google Auth Error:", error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    const { userId } = get();
    set({ isLoading: true });

    localStorage.removeItem("has_session");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_userId");
    localStorage.removeItem("auth_shopId");

    set({
      role: null,
      userId: null,
      shopId: null,
      isAuthenticated: false,
      isLoading: false
    });

    try {
      if (userId) {
        await authService.logout(userId).catch(console.warn);
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  }
}));

