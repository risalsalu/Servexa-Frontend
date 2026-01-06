import { useAuthStore } from "../../store/authStore";

export default function ShopOwnerDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const dummyStats = [
    { label: "Total Bookings", value: "156", change: "+12%", color: "blue" },
    { label: "Active Services", value: "24", change: "+3", color: "green" },
    { label: "Pending Reviews", value: "8", change: "-2", color: "yellow" },
    { label: "Revenue", value: "$8,420", change: "+18%", color: "purple" }
  ];

  const recentBookings = [
    { id: 1, customer: "John ", service: "Haircut & Style", time: "10:30 AM", status: "confirmed" },
    { id: 2, customer: "Emma Wilson", service: "Manicure", time: "11:45 AM", status: "pending" },
    { id: 3, customer: "Michael Brown", service: "Beard Trim", time: "2:15 PM", status: "confirmed" },
    { id: 4, customer: "Sarah Davis", service: "Full Grooming", time: "4:00 PM", status: "cancelled" }
  ];

  const topServices = [
    { name: "Premium Haircut", bookings: 42, revenue: "$2,100" },
    { name: "Beard Grooming", bookings: 38, revenue: "$1,520" },
    { name: "Luxury Manicure", bookings: 31, revenue: "$1,860" },
    { name: "Spa Treatment", bookings: 25, revenue: "$2,000" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Shop Owner Dashboard</h1>
                <p className="text-blue-100">
                  Welcome back, <span className="font-semibold text-white">{user?.name || user?.email}</span>
                </p>
                <p className="text-blue-100 mt-1">
                  Manage your shop, services and bookings efficiently
                </p>
              </div>
              <button
                onClick={logout}
                className="mt-4 md:mt-0 px-6 py-3 rounded-xl bg-white text-red-600 font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dummyStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
              <div className={`mt-3 text-sm font-medium px-3 py-1 rounded-full inline-block ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                stat.color === 'green' ? 'bg-green-100 text-green-800' :
                stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                  <div>
                    <div className="font-semibold text-gray-800">{booking.customer}</div>
                    <div className="text-sm text-gray-600">{booking.service}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{booking.time}</div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Top Services</h2>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 text-green-600 font-medium hover:from-green-100 hover:to-green-200 transition-all duration-300">
                Add Service
              </button>
            </div>
            <div className="space-y-5">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{service.revenue}</div>
                    <div className="text-sm text-green-600 font-medium">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg mb-1">📅</div>
              Manage Schedule
            </button>
            <button className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 font-semibold hover:from-green-100 hover:to-green-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg mb-1">➕</div>
              Add New Service
            </button>
            <button className="p-5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-700 font-semibold hover:from-purple-100 hover:to-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg mb-1">📊</div>
              View Analytics
            </button>
            <button className="p-5 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-700 font-semibold hover:from-orange-100 hover:to-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg mb-1">👥</div>
              Manage Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
