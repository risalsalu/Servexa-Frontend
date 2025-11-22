import { create } from "zustand";
import authService from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  initialize: async () => {
    try {
      const data = await authService.refresh();
      set({
        user: data.user,
        accessToken: data.accessToken,
        loading: false,
      });
    } catch {
      set({ user: null, accessToken: null, loading: false });
    }
  },

  login: async (email, password, role) => {
    const data = await authService.login({ email, password, role });
    set({
      user: data.user,
      accessToken: data.accessToken,
    });
    return data;
  },

  register: async (email, password, role) => {
    const data = await authService.register({ email, password, role });
    return data;
  },

  refreshAccessToken: async () => {
    const data = await authService.refresh();
    set((state) => ({
      user: data.user || state.user,
      accessToken: data.accessToken,
    }));
    return data.accessToken;
  },

logout: async () => {
  try {
    await authService.logout();
  } catch (err) {
    console.error("Logout error:", err);
  }
  set({ user: null, accessToken: null });
},
}));
