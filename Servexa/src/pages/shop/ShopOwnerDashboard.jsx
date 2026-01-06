import { Link, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Sub-components
import ShopProfile from "../../components/shop/ShopProfile";
import ShopServiceManager from "../../components/shop/ShopServiceManager";
import ShopBookingManager from "../../components/shop/ShopBookingManager";

const ShopOwnerDashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Shop Panel</h1>
        </div>
        <nav className="mt-6 flex-1">
          <Link to="/shop/profile" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('profile') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Profile</Link>
          <Link to="/shop/services" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('services') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Services</Link>
          <Link to="/shop/bookings" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('bookings') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Bookings</Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/shop/profile" replace />} />
          <Route path="/profile" element={<ShopProfile />} />
          <Route path="/services" element={<ShopServiceManager />} />
          <Route path="/bookings" element={<ShopBookingManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default ShopOwnerDashboard;
