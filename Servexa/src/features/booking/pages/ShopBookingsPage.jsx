import React, { useEffect, useState } from "react";
import bookingService from "../services/bookingService";
import { BookingStatus } from "../types/booking.types";
import BookingStatusBadge from "../components/BookingStatusBadge";

const ShopBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShopBookings();
    }, []);

    const fetchShopBookings = async () => {
        try {
            const data = await bookingService.getShopBookings();
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch shop bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            await bookingService.updateStatus({ bookingId, status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <div>Loading shop bookings...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Shop Bookings</h1>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        #{booking.id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {booking.customerName || booking.customerId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.services?.map((s) => s.name).join(", ") || `${booking.serviceIds.length} Services`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.slotDate
                                            ? `${new Date(booking.slotDate).toLocaleDateString()} ${booking.slotStartTime}`
                                            : "Pending Slot"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <BookingStatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            {booking.status === BookingStatus.PENDING_PAYMENT && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                                                    className="text-green-600 hover:text-green-800 font-medium"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status === BookingStatus.CONFIRMED && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.COMPLETED)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopBookingsPage;
