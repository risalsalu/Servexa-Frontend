import axiosClient from "../api/axiosClient";

const addressService = {
    getAll: async () => {
        const response = await axiosClient.get("/customers/addresses");
        return response.data;
    },

    create: async (addressData) => {
        const response = await axiosClient.post("/customers/addresses", addressData);
        return response.data;
    },

    update: async (id, addressData) => {
        const response = await axiosClient.put(`/customers/addresses/${id}`, addressData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(`/customers/addresses/${id}`);
        return response.data;
    }
};

export default addressService;
