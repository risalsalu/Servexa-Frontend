import useAuth from "../../hooks/useAuth";

export default function ShopOwnerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shop Owner Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm"
          >
            Logout
          </button>
        </div>
        <p className="mb-3 text-gray-600">
          Welcome, {user?.name || user?.email}
        </p>
        <p className="text-gray-500">
          Here you can manage your shop, services and bookings.
        </p>
      </div>
    </div>
  );
}
