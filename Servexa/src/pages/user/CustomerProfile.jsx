import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userService from "../../services/userService";
import ProfileImageUploader from "../../components/user/ProfileImageUploader";
import EditProfileForm from "../../components/user/EditProfileForm";

const CustomerProfile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getProfile();
            setUser(data);
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center">Failed to load profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">← Back to Dashboard</Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Header / Cover (Optional) */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                            <div className="mb-4 md:mb-0">
                                <ProfileImageUploader
                                    currentImageUrl={user.profileImageUrl}
                                    onUpdate={fetchProfile}
                                />
                            </div>
                            <div className="md:ml-6 text-center md:text-left flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                {!isEditMode && (
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {isEditMode ? (
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                                <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
                                <EditProfileForm
                                    user={user}
                                    onCancel={() => setIsEditMode(false)}
                                    onSuccess={() => {
                                        setIsEditMode(false);
                                        fetchProfile();
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                                    <div>
                                        <label className="text-sm text-gray-500">Full Name</label>
                                        <p className="font-medium">{user.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Gender</label>
                                        <p className="font-medium">{user.gender || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Date of Birth</label>
                                        <p className="font-medium">
                                            {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Bio</label>
                                        <p className="text-gray-700 mt-1">{user.bio || "No bio added."}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
                                    <div>
                                        <label className="text-sm text-gray-500">Email</label>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Phone</label>
                                        <p className="font-medium">{user.phone || user.phoneNumber || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Address</label>
                                        <p className="font-medium">{user.address || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t">
                            <Link to="/profile/addresses" className="text-blue-600 hover:text-blue-800 font-medium">
                                Manage Saved Addresses →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;
