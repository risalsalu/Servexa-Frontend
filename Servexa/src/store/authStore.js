import { create } from "zustand";
import authService from "../services/authService";

export const useAuthStore = create((set) => ({
  role: null,
  userId: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (emailOrPhone, password) => {
    set({ isLoading: true });
    const data = await authService.login(emailOrPhone, password);
    set({
      role: data.role,
      userId: data.userId,
      isAuthenticated: true,
      isLoading: false
    });
    return data;
  },

  logout: async () => {
    await authService.logout();
    set({
      role: null,
      userId: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  setAuthenticated: (role) =>
    set({
      role,
      isAuthenticated: true
    })
}));
