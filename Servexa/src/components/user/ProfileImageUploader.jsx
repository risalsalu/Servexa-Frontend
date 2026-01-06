import { useState, useRef } from "react";
import userService from "../../services/userService";

const ProfileImageUploader = ({ currentImageUrl, onUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File size must be less than 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setIsUploading(true);
            await userService.uploadProfileImage(formData);
            onUpdate(); // Trigger refresh
        } catch (err) {
            console.error(err);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Remove profile photo?")) return;
        try {
            setIsUploading(true);
            await userService.deleteProfileImage();
            onUpdate();
        } catch (err) {
            alert("Failed to delete image.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                    {currentImageUrl ? (
                        <img
                            src={currentImageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold bg-gray-200">
                            ?
                        </div>
                    )}
                </div>
                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">...</span>
                    </div>
                )}
            </div>

            <div className="flex space-x-3">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Change Photo
                </button>
                {currentImageUrl && (
                    <button
                        onClick={handleDelete}
                        disabled={isUploading}
                        className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                        Remove
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};

export default ProfileImageUploader;
