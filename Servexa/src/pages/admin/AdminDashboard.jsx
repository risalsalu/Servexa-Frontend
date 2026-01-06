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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-wider">SERVEXA <span className="text-blue-400 text-sm">ADMIN</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-2">Management</div>
          <Link to="/admin/categories" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('categories') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <span className="mr-3">📂</span> Categories
          </Link>
          <Link to="/admin/customers" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('customers') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <span className="mr-3">👥</span> Customers
          </Link>
          <Link to="/admin/shops" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('shops') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <span className="mr-3">🏪</span> Shop Owners
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">A</div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Mobile Header */}
        <header className="bg-slate-800 text-white p-4 md:hidden flex justify-between items-center shadow-lg">
          <h1 className="font-bold">SERVEXA ADMIN</h1>
          <button onClick={handleLogout} className="text-sm text-red-300">Logout</button>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isActive('categories') && "Category Management"}
              {isActive('customers') && "Customer Database"}
              {isActive('shops') && "Shop Owner Validation"}
            </h2>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/admin/categories" replace />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/customers" element={<CustomerManager />} />
            <Route path="/shops" element={<ShopManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
