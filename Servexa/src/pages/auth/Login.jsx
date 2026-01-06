import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Attempting login...");
      const data = await login(emailOrPhone, password);
      console.log("Login Payload Received:", data); // DEBUG: Check for token
      console.log("Login successful!");

      // Login action updates store. 
      // We accept the store state which is now set synchronously/optimistically in login()
      const { role, isAuthenticated } = useAuthStore.getState();
      console.log("Post-login State:", { role, isAuthenticated });

      if (isAuthenticated && role) {
        // Role based redirect if no specific 'from' location
        if (from === "/" || from === "/login") {
          if (role === "Admin") navigate("/admin");
          else if (role === "ShopOwner") navigate("/shop");
          else navigate("/dashboard");
        } else {
          navigate(from);
        }
      } else {
        // Fallback if state update failed (shouldn't happen with new store logic)
        setError("Login succeeded but role was not found. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Handle axios error or generic error
      // Check for 400 specifically to give better hint if needed, though generic message is fine
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Servexa
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new customer account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text" // changed from email to allow phone
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">Are you a shop owner? </span>
            {/* Shop owner registration link usually separate or handled via same register with toggle */}
            <Link to="/register?role=shop" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Register your shop
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
