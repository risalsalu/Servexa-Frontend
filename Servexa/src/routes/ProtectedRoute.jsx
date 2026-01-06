import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  console.log("ProtectedRoute State:", { isAuthenticated, role, isLoading, path: location.pathname });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading... (Auth State)</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Optional: Redirect to a dedicated "Unauthorized" page or dashboard based on actual role
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
