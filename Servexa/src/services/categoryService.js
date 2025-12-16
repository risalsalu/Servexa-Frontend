import axiosClient from "../api/axiosClient";

export const getCategories = async () => {
  const res = await axiosClient.get("/api/shop/categories");
  return res.data.data;
};
