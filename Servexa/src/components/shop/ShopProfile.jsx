import { useState, useEffect } from "react";
import shopService from "../../services/shopService";

const ShopProfile = () => {
    const [profile, setProfile] = useState({
        shopName: "",
        description: "",
        address: "",
        images: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await shopService.getProfile();
            // Assuming data contains: shopName, description, address, images (array of objs)
            setProfile(data || {});
        } catch (err) {
            console.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await shopService.updateProfile({
                shopName: profile.shopName,
                description: profile.description,
                address: profile.address
            });
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Failed to update profile.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file); // Check backend param name, usually 'file'

        try {
            await shopService.uploadImage(formData);
            fetchProfile(); // Refresh to see new image
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

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Shop Profile</h2>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.shopName || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.description || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={profile.address || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Shop Images</h3>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {profile.images && profile.images.map((img) => (
                        <div key={img.id} className="relative group">
                            <img src={img.url} alt="Shop" className="h-32 w-full object-cover rounded" />
                            <button
                                onClick={() => handleDeleteImage(img.id)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <div className="h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500">
                        <label className="cursor-pointer flex flex-col items-center">
                            <span>+ Upload</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfile;
