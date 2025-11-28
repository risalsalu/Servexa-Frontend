import authService from "../services/authService";
import { useAuthStore } from "../store/authStore";

export default function useAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const login = async (emailOrPhone, password) => {
    const res = await authService.login(emailOrPhone, password);
    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", data.role);

    setAuth({
      token: data.token,
      role: data.role,
      userId: data.userId
    });

    return data.role;
  };

  const logout = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) await authService.logout(userId);

    localStorage.clear();
    clearAuth();
  };

  return { login, logout };
}
