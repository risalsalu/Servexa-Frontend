import axiosClient from "../api/axiosClient";

const favoriteService = {
    getAll: async () => {
        const response = await axiosClient.get("/favorites");
        return response.data;
    },

    addFavorite: async (shopId) => {
        const response = await axiosClient.post("/favorites", { shopId });
        return response.data;
    },

    removeFavorite: async (shopIdOrFavId) => {
        // Method usually depends on backend (DELETE /favorites/{id} or /favorites?shopId=)
        // Spec says: DELETE /api/favorites
        // Assuming query param or body. Let's send body or query params.
        const response = await axiosClient.delete("/favorites", { data: { shopId: shopIdOrFavId } });
        return response.data;
    }
};

export default favoriteService;
