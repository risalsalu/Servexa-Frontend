import React, { useEffect, useState } from "react";
import bookingService from "../services/bookingService";

const BookingSummary = ({ bookingId }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, [bookingId]);

    const fetchSummary = async () => {
        try {
            const data = await bookingService.getSummary(bookingId);
            setSummary(data);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading summary...</div>;
    if (!summary) return <div>Order not found</div>;

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold border-b pb-4">Booking Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-500 text-sm">Services</p>
                    <ul className="list-disc list-inside mt-1">
                        {summary.services?.map((s) => (
                            <li key={s.id || s} className="text-gray-800 font-medium">{s.name || s}</li>
                        )) || <li>Service IDs: {summary.serviceIds.join(", ")}</li>}
                    </ul>
                </div>

                <div>
                    <p className="text-gray-500 text-sm">Amount</p>
                    <p className="text-2xl font-bold text-blue-600">${summary.totalAmount}</p>
                </div>

                {summary.slotDate && (
                    <div>
                        <p className="text-gray-500 text-sm">Date & Time</p>
                        <p className="text-gray-800 font-medium">
                            {new Date(summary.slotDate).toLocaleDateString()}
                            <br />
                            <span className="text-gray-600">{summary.slotStartTime} - {summary.slotEndTime}</span>
                        </p>
                    </div>
                )}

                {summary.address && (
                    <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="text-gray-800 font-medium">{summary.address.line1}</p>
                        <p className="text-gray-600">{summary.address.city}, {summary.address.pincode}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSummary;
