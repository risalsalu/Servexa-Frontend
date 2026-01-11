import React, { useEffect, useState } from "react";
import slotService from "../services/slotService";

const SlotSelector = ({ shopId, onSelect, selectedSlotId }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        fetchSlots();
    }, [shopId]);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await slotService.getShopSlots(shopId);
            setSlots(data.filter(s => !s.isBooked));

            if (data.length > 0 && !selectedDate) {
                // Auto-select first date available (logic handled in next effect if dates exist)
            }
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedSlots = slots.reduce((acc, slot) => {
        const date = slot.date.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    const dates = Object.keys(groupedSlots).sort();

    useEffect(() => {
        if (dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[0]);
        }
    }, [dates, selectedDate]);

    if (loading) return <div>Loading slots...</div>;
    if (slots.length === 0) return <div className="text-gray-500">No slots available for this shop.</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">Select a Time Slot</h3>

            <div className="flex space-x-2 overflow-x-auto pb-4">
                {dates.map(date => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedDate === date
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {selectedDate && groupedSlots[selectedDate]?.map(slot => (
                    <button
                        key={slot.id}
                        onClick={() => onSelect(slot.id)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${selectedSlotId === slot.id
                            ? "bg-blue-600 text-white ring-2 ring-blue-300"
                            : "bg-white border border-gray-200 text-gray-800 hover:border-blue-500 hover:text-blue-600"
                            }`}
                    >
                        {slot.startTime} - {slot.endTime}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlotSelector;
