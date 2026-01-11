import axiosClient from "../../../api/axiosClient";

const bookingService = {
    createDraft: async (data) => {
        // STRICT PAYLOAD CONSTRUCTION
        const payload = {
            shopId: String(data.shopId),
            serviceMode: Number(data.serviceMode || 1),
            serviceIds: Array.isArray(data.serviceIds)
                ? data.serviceIds.map(String)
                : [String(data.serviceId)]
        };

        if (!payload.shopId || payload.serviceIds.length === 0) {
            throw new Error("Invalid booking data: Missing shopId or serviceIds");
        }

        const response = await axiosClient.post("/bookings/draft", payload);
        return response.data.data || response.data;
    },

    addAddress: async (bookingId, addressId) => {
        if (!bookingId) throw new Error("Booking ID is required for addAddress");
        const response = await axiosClient.put(`/bookings/${bookingId}/address`, { addressId });
        return response.data.data || response.data;
    },

    selectSlot: async (bookingId, slotId) => {
        if (!bookingId) throw new Error("Booking ID is required for selectSlot");
        const response = await axiosClient.put(`/bookings/${bookingId}/slot`, { slotId });
        return response.data.data || response.data;
    },

    getSummary: async (bookingId) => {
        if (!bookingId) throw new Error("Booking ID is required for getSummary");
        const response = await axiosClient.get(`/bookings/${bookingId}/summary`);
        return response.data.data || response.data;
    },

    getMyBookings: async () => {
        const response = await axiosClient.get("/bookings/my");
        return response.data.data || response.data;
    },

    getShopBookings: async () => {
        const response = await axiosClient.get("/bookings/shop");
        return response.data.data || response.data;
    },

    updateStatus: async (data) => {
        const response = await axiosClient.put("/bookings/status", data);
        return response.data.data || response.data;
    },

    deleteDraft: async (bookingId) => {
        if (!bookingId) return;
        await axiosClient.delete(`/bookings/${bookingId}`);
    }
};

export default bookingService;
