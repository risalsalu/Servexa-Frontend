import { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Sub-components (we'll implement these next)
import CategoryManager from "../../components/admin/CategoryManager";
import CustomerManager from "../../components/admin/CustomerManager";
import ShopManager from "../../components/admin/ShopManager";

const AdminDashboard = () => {
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
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Servexa Admin</h1>
        </div>
        <nav className="mt-6 flex-1">
          <Link to="/admin/categories" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('categories') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Categories</Link>
          <Link to="/admin/customers" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('customers') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Customers</Link>
          <Link to="/admin/shops" className={`block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${isActive('shops') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>Shop Owners</Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/categories" replace />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/customers" element={<CustomerManager />} />
          <Route path="/shops" element={<ShopManager />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
