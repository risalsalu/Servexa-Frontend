import axiosClient from "../api/axiosClient";

const cartService = {
    getCart: async (shopId) => {
        const response = await axiosClient.get("/cart", { params: { shopId } });
        return response.data;
    },

    addItem: async (itemData) => {
        // itemData: { shopId, serviceId, slotId (if immediate?) or just service needed? }
        // Spec says: POST /api/cart
        const response = await axiosClient.post("/cart", itemData);
        return response.data;
    },

    updateItem: async (cartItemId, quantity) => {
        // PATCH /api/cart/{cartItemId}
        // Assuming body { quantity } or similar
        const response = await axiosClient.patch(`/cart/${cartItemId}`, { quantity });
        return response.data;
    },

    removeItem: async (cartItemId) => {
        const response = await axiosClient.delete(`/cart/${cartItemId}`);
        return response.data;
    },

    clearCart: async (shopId) => {
        const response = await axiosClient.delete("/cart/clear", { params: { shopId } });
        return response.data;
    }
};

export default cartService;
