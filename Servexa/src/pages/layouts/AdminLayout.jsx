import { Link, useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Servexa Admin</h2>

        <nav className="space-y-4 flex-1">
          <Link to="/admin/dashboard" className="block hover:text-blue-400">
            Dashboard
          </Link>
          <Link to="/admin/users" className="block hover:text-blue-400">
            Users
          </Link>
          <Link to="/admin/shopowners" className="block hover:text-blue-400">
            Shop Owners
          </Link>
          <Link to="/admin/bookings" className="block hover:text-blue-400">
            Bookings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 w-full py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
