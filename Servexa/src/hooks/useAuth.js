import { useState } from "react";
import authService from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (emailOrPhone, password) => {
    const result = await authService.login(emailOrPhone, password);
    const data = result.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", data.role);
    setUser(data);
  };

  const logout = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) await authService.logout(userId);
    localStorage.clear();
    setUser(null);
  };

  return { user, login, logout };
}
