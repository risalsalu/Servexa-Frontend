import axiosClient from "../api/axiosClient";

const adminUserService = {
    // --- Customers ---
    getCustomers: async () => {
        const response = await axiosClient.get("/admin/user-management/customers");
        return response.data?.data || [];
    },

    // --- Shop Owners ---
    getShopOwners: async () => {
        const response = await axiosClient.get("/admin/user-management/shopowners");
        return response.data?.data || [];
    },

    // --- Common Management ---
    // Status update: backend expects query param ?isActive=true|false
    updateCustomerStatus: async (id, isActive) => {
        const response = await axiosClient.put(`/admin/user-management/customers/${id}/status?isActive=${isActive}`);
        return response.data?.data;
    },

    updateShopOwnerStatus: async (id, isActive) => {
        const response = await axiosClient.put(`/admin/user-management/shopowners/${id}/status?isActive=${isActive}`);
        return response.data?.data;
    },

    deleteUser: async (id) => {
        const response = await axiosClient.delete(`/admin/user-management/${id}`);
        return response.data?.data;
    }
};

export default adminUserService;
