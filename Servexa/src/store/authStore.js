import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  role: null,
  userId: null,
  loading: true,

  initialize: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    set({
      token: token || null,
      role: role || null,
      userId: userId || null,
      loading: false
    });
  },

  setAuth: (data) =>
    set({
      token: data.token,
      role: data.role,
      userId: data.userId
    }),

  clearAuth: () =>
    set({
      token: null,
      role: null,
      userId: null
    })
}));
