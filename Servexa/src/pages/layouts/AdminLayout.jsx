import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminLayout({ children }) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/shopowners", label: "Shop Owners", icon: "🏪" },
    { path: "/admin/bookings", label: "Bookings", icon: "📅" },
    { path: "/admin/services", label: "Services", icon: "💼" },
    { path: "/admin/analytics", label: "Analytics", icon: "📈" },
    { path: "/admin/settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold">S</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Servexa</h2>
              <p className="text-gray-400 text-sm">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-300 hover:translate-x-1"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center space-x-4 p-4 bg-gray-800 bg-opacity-50 rounded-xl mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">A</span>
            </div>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-4">
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <span className="text-gray-600">Last updated: Today</span>
                </div>
                <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}