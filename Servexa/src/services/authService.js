import axiosClient from "../api/axiosClient";

const login = async (emailOrPhone, password) => {
  const res = await axiosClient.post("/api/auth/login", {
    emailOrPhone,
    password
  });
  return res.data;
};

const registerUser = async ({ fullName, email, phone, password }) => {
  const res = await axiosClient.post("/api/auth/register-user", {
    fullName,
    email,
    phone,
    password,
    role: "Customer"
  });
  return res.data;
};

const registerShopOwner = async (formData) => {
  const res = await axiosClient.post("/api/auth/register-shopowner", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

const logout = async (userId) => {
  await axiosClient.post("/api/auth/logout", { userId });
};

export default { login, registerUser, registerShopOwner, logout };
