import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  const location = useLocation();

  console.log("ProtectedRoute State:", {
    isAuthenticated,
    role,
    allowedRoles,
    path: location.pathname,
    hasAccess: allowedRoles.length === 0 || (role && allowedRoles.includes(role))
  });

  // Normalize role for check if needed, though Store should handle it now.
  // We assume 'allowedRoles' in routes are strict (e.g. "Customer").

  if (allowedRoles.length > 0) {
    const userRoleLower = role ? role.toLowerCase() : "";
    const allowedLower = allowedRoles.map(r => r.toLowerCase());

    if (!allowedLower.includes(userRoleLower)) {
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
  }

  return <Outlet />;
};

export default ProtectedRoute;
