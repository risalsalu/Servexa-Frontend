import axiosClient from "../api/axiosClient";

export const getServicesByShop = async (shopId) => {
  const res = await axiosClient.get(`/api/user-services/shops/${shopId}`);
  return res.data.data;
};
