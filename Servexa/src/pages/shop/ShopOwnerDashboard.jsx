import { useState } from "react";
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

  // Placeholder data for dashboard summary (In real app, fetch these)
  const [metrics] = useState({
    bookingsToday: 3,
    activeServices: 5,
    rating: 4.8
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
            Shop Panel
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-2">Menu</div>
          <Link to="/shop/profile" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('profile') ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="mr-3">🏪</span> Shop Profile
          </Link>
          <Link to="/shop/services" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('services') ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="mr-3">🛠️</span> Services
          </Link>
          <Link to="/shop/bookings" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('bookings') ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span className="mr-3">📅</span> Bookings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-green-600 font-semibold uppercase">Shop Status</p>
            <div className="flex items-center mt-2">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm font-bold text-green-800">Online</span>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay would go here in fully responsive app */}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Shop Panel</h1>
            <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* Top Metrics Row - Only show on root or dashboard home, but here we keep it sticky or always present can clutter. 
                        Let's show it only if path is exactly /shop or we can render it above the routes. 
                        Actually, let's keep the main area clean for the active module.
                    */}

          <div className="mb-6">
            {/* Breadcrumb or Header */}
            <h2 className="text-2xl font-bold text-gray-800">
              {isActive('profile') && "Manage Shop Details"}
              {isActive('services') && "Service Menu"}
              {isActive('bookings') && "Booking Management"}
            </h2>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/shop/profile" replace />} />
            <Route path="/profile" element={<ShopProfile />} />
            <Route path="/services" element={<ShopServiceManager />} />
            <Route path="/bookings" element={<ShopBookingManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default ShopOwnerDashboard;
