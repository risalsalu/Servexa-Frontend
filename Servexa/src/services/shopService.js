import axiosClient from "../api/axiosClient";

export const getShops = async (categoryId) => {
  const res = await axiosClient.get("/api/user-services/shops", {
    params: { categoryId },
  });
  return res.data.data;
};
