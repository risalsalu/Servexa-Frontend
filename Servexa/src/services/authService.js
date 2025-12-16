import authApi from "../api/auth.api";

const login = async (emailOrPhone, password) => {
  const res = await authApi.login({ emailOrPhone, password });
  return res.data.data;
};

const registerUser = async (data) => {
  const res = await authApi.registerUser(data);
  return res.data.data;
};

const registerShopOwner = async (formData) => {
  const res = await authApi.registerShopOwner(formData);
  return res.data.data;
};

const refreshToken = async () => {
  const res = await authApi.refreshToken();
  return res.data.data;
};

const logout = async () => {
  await authApi.logout({});
};

export default {
  login,
  registerUser,
  registerShopOwner,
  refreshToken,
  logout
};
