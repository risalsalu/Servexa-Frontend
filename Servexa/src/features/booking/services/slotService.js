import axiosClient from "../../../api/axiosClient";

const slotService = {
    createSlot: async (data) => {
        // data: { shopId, date, startTime, endTime }
        const response = await axiosClient.post("/slots", data);
        return response.data;
    },

    getShopSlots: async (shopId) => {
        const response = await axiosClient.get(`/slots/shop/${shopId}`);
        return response.data;
    }
};

export default slotService;
