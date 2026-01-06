import axiosClient from "../api/axiosClient";

const userService = {
    // --- User Profile (Me) ---
    getProfile: async () => {
        const response = await axiosClient.get("/users/me");
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await axiosClient.put("/users/me", userData);
        return response.data;
    },
    updateContact: async (contactData) => {
        const response = await axiosClient.patch("/users/me/contact", contactData);
        return response.data;
    },
    uploadProfileImage: async (formData) => {
        const response = await axiosClient.post("/users/me/profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },
    deleteProfileImage: async () => {
        const response = await axiosClient.delete("/users/me/profile-image");
        return response.data;
    },

    // --- Admin Endpoints ---
    getCustomers: async () => {
        const response = await axiosClient.get("/admin/user-management/customers");
        return response.data;
    },

    getShopOwners: async () => {
        const response = await axiosClient.get("/admin/user-management/shopowners");
        return response.data;
    },

    updateCustomerStatus: async (id, status) => {
        // status: e.g., 'Active', 'Inactive' or boolean
        // Endpoint: PUT /api/admin/user-management/customers/{id}/status
        const response = await axiosClient.put(`/admin/user-management/customers/${id}/status`, null, {
            params: { status } // Passing as query param or body? Usually body or query. 
            // If it's a PUT with simple status, it might be a query string or a simple body wrapper.
            // Let's assume query or check conventions. Often Clean Arch uses Body for PUT.
            // Let's safe bet: send as Body object { status }.
        });
        return response.data;
    },

    updateShopOwnerStatus: async (id, status) => {
        const response = await axiosClient.put(`/admin/user-management/shopowners/${id}/status`, null, {
            params: { status }
        });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await axiosClient.delete(`/admin/user-management/${id}`);
        return response.data;
    }
};

export default userService;
