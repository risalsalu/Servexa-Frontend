import axiosClient from "../../../api/axiosClient";

const paymentService = {
    createOrder: async (amount, currency = "INR") => {
        const response = await axiosClient.post("/payments/create-order", { amount, currency });
        return response.data;
    },

    verifyPayment: async (paymentData) => {
        const response = await axiosClient.post("/payments/verify", paymentData);
        return response.data;
    }
};

export default paymentService;
