import axiosClient from "../api/axiosClient";

const serviceService = {
    // Public Shop & Service Endpoints
    getAllShops: async (params) => {
        // params like ?search=... or ?lat=&lng=
        const response = await axiosClient.get("/api/user-services/shops", { params });
        return response.data;
    },

    getShopDetails: async (shopId) => {
        const response = await axiosClient.get(`/api/user-services/shops/${shopId}`);
        return response.data;
    },

    // Note: Backend might provide services nested in shop details or separate endpoint. 
    // Requirement says: GET /api/user-services/shops/{shopId} usually returns details + services.

    // Slots logic often goes here or booking service. 
    // Requirement: GET /api/slots/shop/{shopId}?date=
    getSlots: async (shopId, date) => {
        const response = await axiosClient.get(`/api/slots/shop/${shopId}`, {
            params: { date }
        });
        return response.data;
    }
};

export default serviceService;
