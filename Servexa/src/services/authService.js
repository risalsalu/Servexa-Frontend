import axiosClient from "../api/axiosClient";

const authService = {
    login: async (emailOrPhone, password) => {
        // Strict payload match: { emailOrPhone, password }
        const response = await axiosClient.post("/auth/login", { emailOrPhone, password });
        return response.data; // Expected: { userId, role, ... }
    },

    registerUser: async (userData) => {
        const response = await axiosClient.post("/auth/register-user", userData);
        return response.data;
    },

    registerShopOwner: async (shopData) => {
        // shopData might include general user info + shop specifics
        // Adjust payload structure as per typical backend requirement, assuming flat or nested
        const response = await axiosClient.post("/auth/register-shopowner", shopData);
        return response.data;
    },

    refreshToken: async () => {
        return await axiosClient.post("/auth/refresh-token");
    },

    logout: async (userId) => {
        // Strict payload: { userId: "..." } to match LogoutRequestDto
        return await axiosClient.post("/auth/logout", { userId });
    }
};

export default authService;
