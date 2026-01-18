import { useState } from "react";
import { useNavigate } from "react-router-dom";
import shopService from "../../services/shopService";
import { useAuthStore } from "../../store/authStore";

const CreateShop = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [formData, setFormData] = useState({
        shopName: "",
        description: "",
        address: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await shopService.registerShop(formData);
            // Refresh auth logic or just navigate? 
            // Better to re-check auth or update store if needed, but nav to profile will trigger a fetch which should now succeed.
            navigate("/shop/profile", { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create shop. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Servexa!</h1>
                <p className="text-gray-600">
                    You haven’t created your shop yet. Please set up your business profile to start receiving bookings.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop / Business Name
                    </label>
                    <input
                        type="text"
                        name="shopName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Luxe Salon & Spa"
                        value={formData.shopName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Tell customers what you offer..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Full business address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => logout().then(() => navigate("/login"))}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Sign Out
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? "Creating..." : "Create Shop"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateShop;
