import axiosClient from "../api/axiosClient";

const userCategoryService = {
    getAll: async () => {
        const response = await axiosClient.get("/categories");
        return response.data?.data || [];
    }
};

export default userCategoryService;
