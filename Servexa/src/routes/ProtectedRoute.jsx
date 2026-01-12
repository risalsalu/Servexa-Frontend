import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    // Or a spinner component
    return <div className="p-4">Loading...</div>;
  }

  // 1. Primary Check: Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Secondary Check: Role (Optional but recommended)
  // If allowedRoles is provided, user must match one.
  if (allowedRoles.length > 0) {
    // Normalize user role
    const userRoleLower = role ? role.toLowerCase() : "";

    // Normalize allowed roles
    const allowedLower = allowedRoles.map(r => r.toLowerCase());

    // Check match
    if (!allowedLower.includes(userRoleLower)) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
            <p className="text-sm text-gray-400">Current Role: {role}</p>
            <p className="text-xs text-gray-300">Required: {allowedRoles.join(", ")}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
