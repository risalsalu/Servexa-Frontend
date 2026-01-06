import axiosClient from "../api/axiosClient";

const userService = {
    // --- User Profile (Me) ---
    getProfile: async () => {
        const response = await axiosClient.get("/users/me");
        return response.data?.data;
    },
    updateProfile: async (userData) => {
        const response = await axiosClient.put("/users/me", userData);
        return response.data?.data;
    },
    updateContact: async (contactData) => {
        const response = await axiosClient.patch("/users/me/contact", contactData);
        return response.data?.data;
    },
    uploadProfileImage: async (formData) => {
        const response = await axiosClient.post("/users/me/profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data?.data;
    },
    deleteProfileImage: async () => {
        const response = await axiosClient.delete("/users/me/profile-image");
        return response.data?.data;
    }
};

export default userService;
