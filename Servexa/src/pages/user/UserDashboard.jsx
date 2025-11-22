import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [profile, setProfile] = useState(null);
  
useEffect(() => {
  const load = async () => {
    try {
      const res = await axiosPrivate.get("/api/users/me");
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  load();
}, [axiosPrivate]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
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
        {profile && (
          <pre className="bg-gray-100 p-4 rounded-xl text-xs overflow-x-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
