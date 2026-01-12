import { create } from "zustand";
import authService from "../services/authService";
import userService from "../services/userService";

export const useAuthStore = create((set, get) => ({
  role: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true, // Start loading by default

  checkAuth: async () => {
    // 1. Hydrate from localStorage (Single Source of Truth for "Session Exists")
    const hasSession = localStorage.getItem("has_session");
    const storedRole = localStorage.getItem("auth_role");
    const storedUserId = localStorage.getItem("auth_userId");

    if (hasSession && storedRole && storedUserId) {
      // TRUST the local storage immediately
      set({
        role: storedRole,
        userId: storedUserId,
        isAuthenticated: true,
        isLoading: false // App is ready to render protected routes
      });

      // 2. Background Refresh (Optional: Keep data fresh)
      try {
        const user = await userService.getProfile();
        // If successful, update with fresh data (e.g. if role changed)
        if (user) {
          const roleMap = {
            "customer": "Customer",
            "shopowner": "ShopOwner",
            "shop_owner": "ShopOwner",
            "admin": "Admin"
          };
          const lowerRole = user.role ? user.role.toLowerCase() : "";
          const normalizedRole = roleMap[lowerRole] || user.role;

          set({
            role: normalizedRole,
            userId: user.id || user.userId,
            isAuthenticated: true
          });
          // Update storage
          localStorage.setItem("auth_role", normalizedRole);
          localStorage.setItem("auth_userId", user.id || user.userId);
        }
      } catch (error) {
        // SILENT FAILURE: Do NOT log out here.
        // We assume the cookie might still be valid or this is just a network glitch.
        // The user stays "Authenticated" in the UI. 
        console.warn("Background auth check failed, but keeping session active:", error);
      }
    } else {
      // No session found
      set({
        role: null,
        userId: null,
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
        const { role, userId } = response.data;

        // Normalize Role
        const roleMap = {
          "customer": "Customer",
          "shopowner": "ShopOwner",
          "shop_owner": "ShopOwner", // Handle snake_case just in case
          "admin": "Admin"
        };
        const rawRole = role;
        const lowerRole = rawRole ? rawRole.toLowerCase() : "";
        const userRole = roleMap[lowerRole] || rawRole;

        // Persist critical auth data BEFORE setting state
        localStorage.setItem("has_session", "true");
        localStorage.setItem("auth_role", userRole);
        localStorage.setItem("auth_userId", userId);

        set({
          role: userRole,
          userId: userId,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        // Fallback usually not hit if service throws on error
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
        const { role: rawRole, userId } = response.data;

        // Normalize Role
        const roleMap = {
          "customer": "Customer",
          "shopowner": "ShopOwner",
          "shop_owner": "ShopOwner",
          "admin": "Admin"
        };
        const lowerRole = rawRole ? rawRole.toLowerCase() : "";
        const userRole = roleMap[lowerRole] || rawRole;

        // Persist
        localStorage.setItem("has_session", "true");
        localStorage.setItem("auth_role", userRole);
        localStorage.setItem("auth_userId", userId);

        set({
          role: userRole,
          userId: userId,
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

    // Clear all session data immediately
    localStorage.removeItem("has_session");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_userId");

    // Update state immediately
    set({
      role: null,
      userId: null,
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

