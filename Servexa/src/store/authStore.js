import { create } from "zustand";
import authService from "../services/authService";
import userService from "../services/userService";

export const useAuthStore = create((set, get) => ({
  role: null,
  userId: null,
  isAuthenticated: false,
  isLoading: true, // Start loading by default to prevent premature redirect

  checkAuth: async () => {
    // Optimization: Check for session hint in localStorage
    const hasSessionHint = localStorage.getItem("has_session");
    const storedRole = localStorage.getItem("auth_role");
    const storedUserId = localStorage.getItem("auth_userId");

    if (!hasSessionHint) {
      set({
        role: null,
        userId: null,
        isAuthenticated: false,
        isLoading: false
      });
      return;
    }

    set({ isLoading: true });

    // Restore state from storage first (fast load)
    if (storedRole && storedUserId) {
      set({
        role: storedRole,
        userId: storedUserId,
        isAuthenticated: true,
        // Don't set isLoading: false yet, we might want to verify
      });
    }

    try {
      // Only call /users/me if we are a Customer, or if we don't know the role yet (first load blank)
      // If we are Admin/ShopOwner, /users/me returns 403, so SKIP IT if we already know our role.
      if (!storedRole || storedRole === "Customer") {
        const user = await userService.getProfile();
        set({
          role: user.role,
          userId: user.id || user.userId,
          isAuthenticated: true,
          isLoading: false
        });
        // Update storage with fresh data
        localStorage.setItem("auth_role", user.role);
        localStorage.setItem("auth_userId", user.id || user.userId);
      } else {
        // For Admin/ShopOwner, rely on the stored session for now to avoid 403.
        // In a real app, we'd have /admin/me or /shop/me.
        set({ isLoading: false });
      }
    } catch (error) {
      // If 401, clear everything.
      // If 403 (Forbidden) and we thought we were a Customer, maybe we aren't? 
      // But if we are Admin/ShopOwner and accidentally called this, treat as "Authorized but wrong endpoint", don't logout.
      if (error.response && error.response.status === 403) {
        console.warn("CheckAuth: 403 Forbidden. User is likely authenticated but not a Customer. Keeping session.");
        set({ isLoading: false }); // Keep existing state (if any)
        return;
      }

      // If 401 or other error, clear session
      console.error("CheckAuth failed", error);
      localStorage.removeItem("has_session");
      localStorage.removeItem("auth_role");
      localStorage.removeItem("auth_userId");
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

      // Optimistically set state from login response
      if (response && response.data) {
        const { role, userId } = response.data;
        set({
          role: role,
          userId: userId,
          isAuthenticated: true,
          isLoading: false
        });

        // Persist critical auth data
        localStorage.setItem("has_session", "true");
        localStorage.setItem("auth_role", role);
        localStorage.setItem("auth_userId", userId);
      } else {
        localStorage.setItem("has_session", "true");
        await get().checkAuth();
      }

      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    const { userId } = get();
    set({ isLoading: true });

    // Clear all session data
    localStorage.removeItem("has_session");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_userId");

    try {
      if (userId) {
        // Attempt backend logout, but don't block UI on it
        await authService.logout(userId).catch(err => console.warn("Backend logout failed", err));
      }
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      set({
        role: null,
        userId: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }
}));
