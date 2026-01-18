import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { ROLE_DASHBOARD_MAP } from "../../utils/roles";

const GoogleLoginButton = ({ text = "signin_with" }) => {
    const { googleAuth, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        if (isLoading) return;
        try {
            await googleAuth(credentialResponse.credential);
            // On success, state is updated by store
            const userRole = localStorage.getItem("auth_role");

            // Normalize just in case, or trust storage matches constants due to authStore normalization
            const dashboardPath = ROLE_DASHBOARD_MAP[userRole] || "/dashboard";
            navigate(dashboardPath);

        } catch (error) {
            console.error("Google Auth Failed", error);
            alert(`Google Authentication Failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleError = () => {
        console.error("Google Login Failed (Component Error)");
        alert("Google Login connection failed. Please check your internet or try again.");
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center mt-4">
                <button disabled className="px-4 py-2 border rounded-full text-gray-400 bg-gray-100 flex items-center gap-2 cursor-not-allowed">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center mt-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false} // explicit click is better for "Register" flows
                theme="outline"
                size="large"
                width="100%"
                text={text}
                shape="pill"
                auto_select={false}
            />
        </div>
    );
};

export default GoogleLoginButton;
