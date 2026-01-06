import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const UserDashboard = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">Logout</button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
                    <p className="text-gray-500">No bookings yet.</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
