export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">1,240</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Shop Owners</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">85</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">3,200</p>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <button className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Manage Users
          </button>

          <button className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
            Manage Shop Owners
          </button>

          <button className="bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Manage Bookings
          </button>

        </div>
      </div>
    </div>
  );
}
