import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import UserDashboard from "../pages/user/UserDashboard";
import ShopOwnerDashboard from "../pages/shop/ShopOwnerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/user/login" element={<Login />} />
      <Route path="/user/register" element={<Register />} />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["User"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/shop/login" element={<Login />} />
      <Route path="/shop/register" element={<Register />} />
      <Route
        path="/shop/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ShopOwner"]}>
            <ShopOwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
