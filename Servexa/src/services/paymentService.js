import axiosClient from "../api/axiosClient";

const paymentService = {
    createOrder: async (bookingId) => {
        // POST /api/payments/create-order
        const response = await axiosClient.post("/payments/create-order", { bookingId });
        return response.data;
    },

    verifyPayment: async (paymentData) => {
        // POST /api/payments/verify
        const response = await axiosClient.post("/payments/verify", paymentData);
        return response.data;
    },

    retryPayment: async (bookingId) => {
        const response = await axiosClient.post("/payments/retry", { bookingId });
        return response.data;
    }
};

export default paymentService;
