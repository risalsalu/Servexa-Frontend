import axiosClient from "../api/axiosClient";

const categoryService = {
    getAll: async () => {
        const response = await axiosClient.get("/admin/category");
        return response.data?.data || [];
    },

    create: async (formData) => {
        const response = await axiosClient.post("/admin/category", formData);
        return response.data?.data;
    },

    update: async (id, data) => {
        const response = await axiosClient.put(`/admin/category/${id}`, data);
        return response.data?.data;
    },

    delete: async (id) => {
        const response = await axiosClient.delete(`/admin/category/${id}`);
        return response.data?.data;
    }
};

export default categoryService;
