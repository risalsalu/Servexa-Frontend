import axiosClient from "../api/axiosClient";

const bookingService = {
    createDraft: async (bookingData) => {
        // POST /api/bookings/draft
        const response = await axiosClient.post("/bookings/draft", bookingData);
        return response.data?.data;
    },

    updateAddress: async (bookingId, addressId) => {
        // PUT /api/bookings/{bookingId}/address
        const response = await axiosClient.put(`/bookings/${bookingId}/address`, { addressId });
        return response.data?.data;
    },

    updateSlot: async (bookingId, slotId) => {
        // PUT /api/bookings/{bookingId}/slot
        const response = await axiosClient.put(`/bookings/${bookingId}/slot`, { slotId });
        return response.data?.data;
    },

    getSummary: async (bookingId) => {
        const response = await axiosClient.get(`/bookings/${bookingId}/summary`);
        return response.data?.data;
    },

    getMyBookings: async () => {
        const response = await axiosClient.get("/bookings/my");
        return response.data?.data;
    },

    cancelBooking: async (bookingId) => {
        const response = await axiosClient.delete(`/bookings/${bookingId}`); // Verify if DELETE is cancel
        return response.data?.data;
    }
};

export default bookingService;
