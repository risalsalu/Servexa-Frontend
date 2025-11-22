import axiosClient from "../api/axiosClient";

const getCurrentUser = async () => {
  const res = await axiosClient.get("/api/users/me");
  return res.data;
};

export default { getCurrentUser };
