import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);

  if (!token || !role) return <Navigate to="/user/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "Admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "ShopOwner") return <Navigate to="/shop/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
