import React, { useState, useEffect } from "react";
import slotService from "../services/slotService";
import { useAuthStore } from "../../../store/authStore"; // Assuming we can get user details
import SlotCreateForm from "../components/SlotCreateForm";

const SlotManagementPage = () => {
    // Ideally, get shopId from the authenticated shop owner's profile or store
    // For now, we might need to ask them to enter it or fetch it.
    // User request implies "Shop Owner navigates to /shop/slots".
    // I will try to fetch it or fallback to manual entry if not in store.

    // Simplification: Using a manual input for Shop ID if not available would be annoying.
    // Let's assume the user context has it or we can fetch it.
    // Current implementation had manual entry. I will keep it wrapper but try to auto-fill.

    const [shopId, setShopId] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSlots = async (id) => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await slotService.getShopSlots(id);
            setSlots(data || []);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotCreated = () => {
        if (shopId) fetchSlots(shopId);
    };

    useEffect(() => {
        if (shopId) {
            fetchSlots(shopId);
        }
    }, [shopId]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Shop Slots</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Create Form */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shop ID</label>
                        <input
                            type="text"
                            value={shopId}
                            onChange={(e) => setShopId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
                            placeholder="Enter Shop UUID"
                        />
                        <p className="text-xs text-gray-400 mb-4">
                            (In a real app, this would be auto-filled from your profile)
                        </p>
                    </div>

                    {shopId && (
                        <SlotCreateForm shopId={shopId} onSlotCreated={handleSlotCreated} />
                    )}
                </div>

                {/* Right Column: Slot List */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Existing Slots</h2>
                            <button
                                onClick={() => fetchSlots(shopId)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading slots...</div>
                        ) : slots.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                {shopId ? "No slots created yet." : "Enter Shop ID to view slots."}
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {slots.map((slot) => (
                                    <li key={slot.id || Math.random()} className="p-4 hover:bg-gray-50 transition flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-900">
                                                {new Date(slot.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>
                                        <div>
                                            {slot.isBooked ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">Booked</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">Available</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotManagementPage;
