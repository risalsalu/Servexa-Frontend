import axiosClient from "../api/axiosClient";

const shopService = {
    // --- Shop Profile ---
    getProfile: async () => {
        const response = await axiosClient.get("/shop");
        return response.data;
    },

    registerShop: async (shopData) => {
        const response = await axiosClient.post("/shop/register", shopData);
        return response.data;
    },

    updateProfile: async (shopData) => {
        const response = await axiosClient.put("/shop/update", shopData);
        return response.data;
    },

    updateStatus: async (status) => {
        const response = await axiosClient.patch("/shop/status", { status });
        // Assuming body {status} or query param based on typical behavior, but PATCH usually body.
        return response.data;
    },

    // --- Shop Images ---
    uploadImage: async (formData) => {
        const response = await axiosClient.post("/shop/images", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    deleteImage: async (imageId) => {
        const response = await axiosClient.delete(`/shop/images/${imageId}`);
        return response.data;
    },

    // --- Shop Services ---
    getMyServices: async () => {
        const response = await axiosClient.get("/shop/services");
        return response.data;
    },

    addService: async (serviceData) => {
        // serviceData: { categoryId, serviceName, price, duration, ... }
        const response = await axiosClient.post("/shop/services", serviceData);
        return response.data;
    },

    updateService: async (serviceId, serviceData) => {
        const response = await axiosClient.put(`/shop/services/${serviceId}`, serviceData);
        return response.data;
    },

    deleteService: async (serviceId) => {
        const response = await axiosClient.delete(`/shop/services/${serviceId}`);
        return response.data;
    },

    // --- Categories (for selection) ---
    getCategories: async () => {
        const response = await axiosClient.get("/shop/categories");
        return response.data;
    },

    // --- Bookings ---
    getBookings: async () => {
        const response = await axiosClient.get("/bookings/shop");
        // Fix: Backend returns ApiResponse { data: [...], success: true }
        // We need to return the inner array directly to the component
        return response.data?.data || response.data || [];
    },

    updateBookingStatus: async (bookingId, status) => {
        const response = await axiosClient.put("/bookings/status", { bookingId, status });
        return response.data;
    }
};

export default shopService;
