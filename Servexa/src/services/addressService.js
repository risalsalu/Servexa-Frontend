import axiosClient from "../api/axiosClient";

const addressService = {
    getAddresses: async () => {
        const response = await axiosClient.get("/customers/addresses");
        return response.data?.data || [];
    },

    addAddress: async (payload) => {
        // Payload: { label, line1, city, pincode, lat, lng }
        const response = await axiosClient.post("/customers/addresses", payload);
        return response.data?.data;
    },

    updateAddress: async (id, payload) => {
        const response = await axiosClient.put(`/customers/addresses/${id}`, payload);
        return response.data?.data;
    },

    deleteAddress: async (id) => {
        const response = await axiosClient.delete(`/customers/addresses/${id}`);
        return response.data?.data;
    }
};

export default addressService;
