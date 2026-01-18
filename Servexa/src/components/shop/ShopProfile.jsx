import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shopService from "../../services/shopService";
import { useAuthStore } from "../../store/authStore";

const ShopProfile = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [profile, setProfile] = useState({
        shopName: "",
        description: "",
        address: "",
        images: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await shopService.getProfile();
            setProfile(data || {});
        } catch (err) {
            console.error("Failed to load profile", err);

            // 404 = Valid "New Shop" State -> Redirect to Create Flow
            if (err.response && err.response.status === 404) {
                console.log("Shop not found (404), redirecting to creation...");
                navigate("/shop/create", { replace: true });
                return;
            }

            // 403 = Access Denied
            else if (err.response && err.response.status === 403) {
                setError("Access Denied: You do not have permission to view this shop profile.");
            }
            // 401 = Auth Token Invalid
            else if (err.response && err.response.status === 401) {
                setError("Session expired.");
            }
            else {
                setError("Failed to load shop profile. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            await shopService.updateProfile({
                shopName: profile.shopName,
                description: profile.description,
                address: profile.address
            });
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
            fetchProfile(); // Refresh data
        } catch (err) {
            console.error(err);
            setMessage("Failed to update profile.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            await shopService.uploadImage(formData);
            fetchProfile();
        } catch (err) {
            alert("Image upload failed");
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm("Delete this image?")) return;
        try {
            await shopService.deleteImage(imageId);
            fetchProfile();
        } catch (err) {
            alert("Failed to delete image");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading shop profile...</div>;

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center bg-white shadow rounded-lg mt-8">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700 mb-6">{error}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={fetchProfile} className="text-blue-600 hover:text-blue-800 underline">Try Again</button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => logout().then(() => navigate("/login"))} className="text-gray-500 hover:text-gray-700">Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Shop Profile</h2>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
            </div>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.shopName || ""}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Elegant Styles Salon"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.description || ""}
                            onChange={handleChange}
                            placeholder="Tell customers about your services..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.address || ""}
                            onChange={handleChange}
                            required
                            placeholder="Full address"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4 text-gray-800">Shop Images</h3>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {profile.images && profile.images.map((img) => (
                        <div key={img.id} className="relative group">
                            <img src={img.url} alt="Shop" className="h-32 w-full object-cover rounded" />
                            <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                title="Delete"
                                type="button"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50">
                        <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-sm font-medium">Upload Image</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Upload images to showcase your shop to customers.</p>
            </div>
        </div>
    );
};

export default ShopProfile;
