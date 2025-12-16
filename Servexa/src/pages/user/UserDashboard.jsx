import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";

export default function UserDashboard() {
  const logout = useAuthStore((s) => s.logout);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get("/api/users/me");
        setProfile(res.data.data);
        setAuthenticated("Customer");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-rose-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back to Servexa
            </p>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Profile Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Name</span>
                <span>{profile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span>{profile.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Explore Services
              </h2>
              <p className="text-sm text-white/80">
                Browse categories, shops and services
              </p>
            </div>

            <button
              onClick={() => navigate("/user/categories")}
              className="mt-6 w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition font-semibold"
            >
              Browse Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
