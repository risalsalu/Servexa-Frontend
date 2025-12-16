import axiosClient from "./axiosClient";

const authApi = {
  registerUser: (data) =>
    axiosClient.post("/api/Auth/register-user", {
      ...data,
      role: "Customer"
    }),

  registerShopOwner: (data) =>
    axiosClient.post("/api/Auth/register-shopowner", data),

  login: (data) =>
    axiosClient.post("/api/Auth/login", data),

  socialLogin: (data) =>
    axiosClient.post("/api/Auth/social-login", data),

  refreshToken: (refreshToken) =>
    axiosClient.post("/api/Auth/refresh-token", {
      refreshToken
    }),

  logout: (userId) =>
    axiosClient.post("/api/Auth/logout", {
      userId
    }),

  forgotPassword: (data) =>
    axiosClient.post("/api/Auth/forgot-password", data),

  resetPassword: (data) =>
    axiosClient.post("/api/Auth/reset-password", data)
};

export default authApi;
