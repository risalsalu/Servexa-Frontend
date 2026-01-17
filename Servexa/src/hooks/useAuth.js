import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { ROLES } from "../utils/roles";

export default function useAuth() {
  const {
    isAuthenticated,
    user,
    role,
    userId,
    isLoading,
    login,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    // Only check auth if we haven't initialized or if explicitly requested
    // checkAuth handles the hydration logic internally
    checkAuth();
  }, [checkAuth]);

  const hasRole = (allowedRoles = []) => {
    if (!role) return false;
    // Normalize input roles to ensure matching works
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    return normalizedAllowed.includes(role.toLowerCase());
  };

  return {
    isAuthenticated,
    user: { id: userId, role }, // Derived simple user object
    role,
    userId,
    isLoading,
    login,
    logout,
    hasRole,
  };
}
