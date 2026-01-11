import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authService from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get("role") === "shop" ? "ShopOwner" : "Customer";

    const [role, setRole] = useState(initialRole);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        // Shop specific fields
        shopName: "",
        shopDescription: "",
        address: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {

            let response;
            if (role === "Customer") {
                response = await authService.registerUser({
                    fullName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: "Customer"
                });
            } else {
                response = await authService.registerShopOwner({
                    ownerName: formData.name,
                    businessName: formData.shopName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: "ShopOwner"
                    // Removed extra fields (description, address) as they are not in the DTO.
                    // These should be updated via profile update AFTER login.
                });
            }

            // Auto login or redirect to login? 
            // Often registration just returns success or token. If token, we setAuth.
            // Assuming register returns { userId, role, ... } logs them in implicitly or requires login
            // For safety, let's redirect to login with a success message or if API logs them in:

            // If the backend auto-logs in (sets cookie), we can redirect to dashboard.
            // But typically register might just create account. Let's assume redirect to login for clean flow unless specified.
            // However, user usually expects auto-login.
            // Let's try to login immediately or use returned data if it has token (cookie set).

            // Check if response suggests success
            navigate("/login", { state: { message: "Registration successful. Please login." } });

        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Try again.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an Account
                    </h2>
                    <div className="mt-4 flex justify-center space-x-4">
                        <button
                            type="button"
                            onClick={() => setRole("Customer")}
                            className={`px-4 py-2 rounded ${role === "Customer" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("ShopOwner")}
                            className={`px-4 py-2 rounded ${role === "ShopOwner" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Shop Owner
                        </button>
                    </div>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-2">
                        <input
                            name="name"
                            type="text"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            name="email"
                            type="email"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="show-password"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
                                Show Password
                            </label>
                        </div>

                        {role === "ShopOwner" && (
                            <>
                                <input
                                    name="shopName"
                                    type="text"
                                    required
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Shop Name"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                />
                                <textarea
                                    name="shopDescription"
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Shop Description"
                                    value={formData.shopDescription}
                                    onChange={handleChange}
                                />
                                <input
                                    name="address"
                                    type="text"
                                    required
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Shop Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        {isLoading ? "creating..." : "Create Account"}
                    </button>


                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or register with</span>
                        </div>
                    </div>

                    <GoogleLoginButton text="signup_with" />

                    <div className="text-center mt-4">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default Register;
