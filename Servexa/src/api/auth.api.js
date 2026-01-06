import axiosClient from "./axiosClient";

const authApi = {
  registerUser: (data) =>
    axiosClient.post("/api/auth/register-user", {
      ...data,
      role: "Customer"
    }),

  registerShopOwner: (data) =>
    axiosClient.post("/api/auth/register-shopowner", {
      ...data,
      role: "ShopOwner"
    }),

  login: (data) =>
    axiosClient.post("/api/auth/login", data),

  logout: (userId) =>
    axiosClient.post("/api/auth/logout", { userId }),

  forgotPassword: (data) =>
    axiosClient.post("/api/auth/forgot-password", data),

  resetPassword: (data) =>
    axiosClient.post("/api/auth/reset-password", data)
};

export default authApi;
