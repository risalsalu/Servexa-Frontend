import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { ROLES } from "../../utils/roles";

const AccessDenied = ({ requiredRoles = [] }) => {
    const { role, logout } = useAuthStore();

    let dashboardLink = "/dashboard";
    if (role === ROLES.SHOP_OWNER) dashboardLink = "/shop/dashboard";
    if (role === ROLES.ADMIN) dashboardLink = "/admin/dashboard";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        You do not have permission to view this page.
                    </p>
                    {role && (
                        <p className="mt-2 text-xs text-gray-400">
                            Current Role: <span className="font-mono">{role}</span>
                        </p>
                    )}
                </div>
                <div className="flex flex-col space-y-4">
                    <Link
                        to={dashboardLink}
                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go to My Dashboard
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
