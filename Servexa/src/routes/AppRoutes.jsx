import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";

// Shop Pages
import ShopOwnerDashboard from "../pages/shop/ShopOwnerDashboard";

// User Pages
import Landing from "../pages/Landing";
import UserDashboard from "../pages/user/UserDashboard";
import Categories from "../pages/user/Categories";
import Shops from "../pages/user/Shops";
import ShopServices from "../pages/user/ShopServices";
import Addresses from "../pages/user/Addresses";
import CustomerProfile from "../pages/user/CustomerProfile";

// Booking Pages
import {
  CreateBookingPage,
  MyBookingsPage,
  ShopBookingsPage,
  SlotManagementPage,
  ServiceModePage,
  AddressSelectionPage,
  SlotSelectionPage,
  BookingSummaryPage,
  PaymentPage
} from "../features/booking";

import { BookingProvider } from "../features/booking/context/BookingContext";

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
        {/* Booking Management */}
        <Route path="/shop/bookings" element={<ShopBookingsPage />} />
        <Route path="/shop/slots" element={<SlotManagementPage />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Customer", "ShopOwner"]} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/profile/addresses" element={<Addresses />} />
        <Route path="/shop/:id" element={<ShopServices />} />

        {/* Booking Flow - Wrapped in Provider */}
        <Route path="/booking" element={<BookingProvider><Outlet /></BookingProvider>}>
          <Route path="create" element={<CreateBookingPage />} /> {/* Entry Point / Mode */}
          <Route path="address" element={<AddressSelectionPage />} />
          <Route path="slot" element={<SlotSelectionPage />} />
          <Route path="summary" element={<BookingSummaryPage />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
