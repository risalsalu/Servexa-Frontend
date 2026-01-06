import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import userCategoryService from "../../services/userCategoryService";
import userShopService from "../../services/userShopService";
import userService from "../../services/userService";

const EMOJI_MAP = {
    "Hair": "💇",
    "Haircut": "💇‍♂️",
    "Massage": "💆",
    "Spa": "🧖",
    "Facial": "🧖‍♀️",
    "Makeup": "💄",
    "Nails": "💅",
    "Manicure": "💅",
    "Pedicure": "🦶",
    "Waxing": "🔥",
    "Cleaning": "🧹",
    "Repair": "🔧",
    "Painting": "🎨",
    "Plumbing": "🚰",
    "Default": "✨"
};

const UserDashboard = () => {
    const { logout, user } = useAuthStore(); // Assuming user might be stored in authStore, otherwise fetch profile
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [catsData, shopsData, profileData] = await Promise.all([
                    userCategoryService.getAll(),
                    userShopService.getNearbyShops(),
                    userService.getProfile()
                ]);

                setCategories(Array.isArray(catsData) ? catsData : []);
                setShops(Array.isArray(shopsData) ? shopsData : []);
                setProfile(profileData);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const getCategoryEmoji = (name) => {
        // Simple fuzzy match or direct lookup
        const key = Object.keys(EMOJI_MAP).find(k => name.toLowerCase().includes(k.toLowerCase()));
        return EMOJI_MAP[key] || EMOJI_MAP["Default"];
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Hero */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Servexa
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-gray-500">Welcome,</p>
                            <p className="font-semibold text-gray-900">{profile?.fullName || "Guest"}</p>
                        </div>
                        {/* Profile Dropdown Placeholder - for now just logout/profile links */}
                        <div className="flex space-x-2">
                            <button onClick={() => navigate("/profile")} className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </button>
                            <button onClick={handleLogout} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* Categories Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Explore Categories</h2>
                        <button className="text-sm text-blue-600 hover:underline">View All</button>
                    </div>
                    {isLoading ? (
                        <div className="flex space-x-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-24 h-32 bg-gray-200 rounded-lg animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex-shrink-0 w-24 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-3xl group-hover:border-blue-300">
                                        {getCategoryEmoji(cat.name)}
                                    </div>
                                    <span className="mt-2 text-sm font-medium text-gray-700 text-center truncate w-full px-1">{cat.name}</span>
                                </div>
                            ))}
                            {categories.length === 0 && <p className="text-gray-500 text-sm">No categories found.</p>}
                        </div>
                    )}
                </section>

                {/* Nearby Shops Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Shops Near You</h2>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            📍 {profile?.address && profile.address.length > 20 ? profile.address.substring(0, 20) + "..." : (profile?.address || "Location not set")}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <>
                            {shops.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                                    <div className="text-6xl mb-4">🏪</div>
                                    <h3 className="text-lg font-bold text-gray-900">No shops found nearby</h3>
                                    <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                                        We couldn't find any active shops in your current location area. Try updating your address to see more options.
                                    </p>
                                    <button
                                        onClick={() => navigate("/profile/addresses")}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                    >
                                        Change Address
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {shops.map(shop => (
                                        <div
                                            key={shop.shopId}
                                            onClick={() => navigate(`/shop/${shop.shopId}`)}
                                            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col ${!shop.isActive ? 'opacity-75 grayscale' : ''}`}
                                        >
                                            <div className="h-40 bg-gray-100 relative">
                                                {shop.imageUrl ? (
                                                    <img src={shop.imageUrl} alt={shop.shopName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                        Create Image
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    {shop.isActive ? (
                                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                                                            OPEN
                                                        </span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full border border-red-200">
                                                            BSU
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="font-bold text-lg text-gray-900 mb-1">{shop.shopName}</h3>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{shop.address}</p>

                                                {/* Footer / Distance / Rating placeholder */}
                                                <div className="mt-auto flex justify-between items-center text-sm">
                                                    <span className="text-blue-600 font-medium">View Services →</span>
                                                    {/* Placeholder for rating */}
                                                    <span className="flex items-center text-amber-500">
                                                        ★ 4.8
                                                    </span>
                                                </div>

                                                {!shop.isActive && shop.offlineReason && (
                                                    <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                        Currently Unavailable: {shop.offlineReason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </section>

                {/* Quick Links / Dashboard content */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={() => navigate("/profile/addresses")}
                            className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                        >
                            <h3 className="font-bold text-blue-900 mb-2">Manage Addresses</h3>
                            <p className="text-sm text-blue-700">Add or update your delivery locations.</p>
                        </div>
                        <div
                            onClick={() => navigate("/profile")}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 cursor-pointer hover:border-purple-300 transition-colors"
                        >
                            <h3 className="font-bold text-purple-900 mb-2">Edit Profile</h3>
                            <p className="text-sm text-purple-700">Update your personal information and photo.</p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default UserDashboard;
