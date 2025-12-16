import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "Admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "ShopOwner") return <Navigate to="/shop/dashboard" replace />;
    if (role === "Customer") return <Navigate to="/user/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
