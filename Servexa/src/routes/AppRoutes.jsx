import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";

// Shop Pages
import ShopOwnerDashboard from "../pages/shop/ShopOwnerDashboard";

// User Pages
import Landing from "../pages/user/Landing";
import UserDashboard from "../pages/user/UserDashboard";
import Categories from "../pages/user/Categories";
import Shops from "../pages/user/Shops";
import ShopServices from "../pages/user/ShopServices";
import BookingFlow from "../pages/user/BookingFlow";
import Addresses from "../pages/user/Addresses";
import CustomerProfile from "../pages/user/CustomerProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/shops" element={<Shops />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

      {/* Shop Owner Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ShopOwner"]} />}>
        <Route path="/shop/*" element={<ShopOwnerDashboard />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/profile/addresses" element={<Addresses />} />
        <Route path="/shop/:id" element={<ShopServices />} />
        <Route path="/booking/:bookingId" element={<BookingFlow />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
