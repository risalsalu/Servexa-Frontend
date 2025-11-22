import axiosClient from "../api/axiosClient";

const login = async ({ email, password, role }) => {
  const res = await axiosClient.post("/api/Auth/login", {
    email,
    password,
    role
  });
  return res.data;
};

const register = async ({ fullName, email, phone, password, role }) => {
  const res = await axiosClient.post("/api/Auth/register", {
    fullName,
    email,
    phone,
    password,
    role
  });
  return res.data;
};

const logout = async (userId) => {
  await axiosClient.post("/api/Auth/logout", { userId });
};

export default { login, register, logout };
