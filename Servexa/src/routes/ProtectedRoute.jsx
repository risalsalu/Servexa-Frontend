import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AccessDenied from "../components/common/AccessDenied";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a global loader while auth is initializing
    // This prevents premature "Access Denied" or redirects
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 1. Primary Check: Must be authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Secondary Check: Role (Optional but recommended)
  // If allowedRoles is provided, user must match one.
  if (allowedRoles.length > 0) {
    // Normalize input roles using the helper from useAuth if needed, 
    // but here we just do a direct comparison since we trust the hook's normalization or simple string match if consistent.
    // Ideally, pass roles as constants.

    // Check match specifically
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    const userRoleLower = role ? role.toLowerCase() : "";

    if (!normalizedAllowed.includes(userRoleLower)) {
      return <AccessDenied requiredRoles={allowedRoles} />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
