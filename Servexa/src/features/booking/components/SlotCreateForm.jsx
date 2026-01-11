import React, { useState } from "react";
import slotService from "../services/slotService";
import { useAuthStore } from "../../../store/authStore";

const SlotCreateForm = ({ onSlotCreated }) => {
    const { user } = useAuthStore(); // Assuming user has shopId or we get it from props
    // Wait, ShopOwnerDashboard usually has shopId. 
    // Let's assume we pass shopId as prop or get it from store if available.
    // For now, let's accept shopId as prop or assume user.shopId exists.

    // Actually, usually user object might have id, but shopId might be separate.
    // Let's stick to props for flexibility.
    // But wait, user request says "Shop Owner navigates to /shop/slots".
    // I need to ensure I have the shopId.
    // I'll assume it's passed in.

    // Re-reading user request: "Shop Owner Slot Creation API... { shopId: uuid }"

    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to get shopId from props or store is needed.
    // I will accept it as a prop.

    const handleSubmit = async (e, shopId) => {
        e.preventDefault();
        if (!shopId) {
            setError("Shop ID missing.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await slotService.createSlot({
                shopId,
                ...formData
            });
            setFormData({ date: "", startTime: "", endTime: "" });
            if (onSlotCreated) onSlotCreated();
            alert("Slot created successfully!");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Add New Slot</h3>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                        type="time"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                        type="time"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                </div>
            </div>

            <button
            // We'll attach the submit handler in the parent with the shopId usually,
            // OR we export a component that takes shopId.
            // I'll make this a proper component that exposes the 'onSubmit' event properly or takes shopId from parent.
            // Let's rely on props.
            // Wait, JSX form onSubmit.
            >
                {/* Helper layout */}
            </button>
        </form>
    );
};

// Refactoring to be a clean component
const CleanSlotCreateForm = ({ shopId, onSlotCreated }) => {
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await slotService.createSlot({
                shopId,
                ...formData
            });
            // Reset form
            setFormData({ date: "", startTime: "", endTime: "" });
            if (onSlotCreated) onSlotCreated();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create slot");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4">Create New Slot</h2>
            {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        required
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                            type="time"
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Creating...' : 'Create Slot'}
                </button>
            </form>
        </div>
    );
};

export default CleanSlotCreateForm;
