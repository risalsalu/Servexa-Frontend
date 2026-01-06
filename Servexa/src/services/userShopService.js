import axiosClient from "../api/axiosClient";

const userShopService = {
    // Get all shops (optionally filtered by location if backend supports it)
    getNearbyShops: async () => {
        // According to prompt: GET /api/user-services/shops
        const response = await axiosClient.get("/user-services/shops");
        return response.data?.data || [];
    },

    // Get specific shop details with services
    getShopDetails: async (shopId) => {
        // According to prompt: GET /api/user-services/shops/{shopId}
        const response = await axiosClient.get(`/user-services/shops/${shopId}`);
        return response.data?.data;
    }
};

export default userShopService;
