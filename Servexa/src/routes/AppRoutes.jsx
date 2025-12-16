import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserDashboard from "../pages/user/UserDashboard";
import Categories from "../pages/user/Categories";
import Shops from "../pages/user/Shops";
import ShopServices from "../pages/user/ShopServices";

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
          <ProtectedRoute allowedRoles={["Customer"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/categories"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <Categories />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/shops/:categoryId"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <Shops />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/shops/:shopId/services"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <ShopServices />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
