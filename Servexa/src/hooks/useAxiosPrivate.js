import { useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuthStore } from "../store/authStore";

export default function useAxiosPrivate() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const reqInt = axiosClient.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInt = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosClient.interceptors.request.eject(reqInt);
      axiosClient.interceptors.response.eject(resInt);
    };
  }, [accessToken, logout]);

  return axiosClient;
}
