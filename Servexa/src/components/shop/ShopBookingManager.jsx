import { useState, useEffect } from "react";
import shopService from "../../services/shopService";

const STATUS_MAP = {
    0: "Draft",
    1: "Pending Payment",
    2: "Confirmed",
    3: "Completed",
    4: "Cancelled"
};

const ShopBookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await shopService.getBookings();

            // Fix: response might be plain array OR { success: true, data: [...] }
            let bookingsData = [];
            if (Array.isArray(response)) {
                bookingsData = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                bookingsData = response.data;
            } else if (response && response.result && Array.isArray(response.result)) {
                // Fallback for some wrappers
                bookingsData = response.result;
            }

            setBookings(bookingsData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await shopService.updateBookingStatus(bookingId, newStatus);
            fetchBookings();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Bookings</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No bookings yet</td>
                                </tr>
                            )}
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {booking.customerName} <br />
                                        <span className="text-xs text-gray-500">{booking.customerPhone}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{booking.serviceName}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(booking.bookingDate).toLocaleDateString()} <br />
                                        {booking.slotTime}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${booking.status === 2 ? 'bg-green-100 text-green-800' :
                                                booking.status === 3 ? 'bg-blue-100 text-blue-800' :
                                                    booking.status === 4 ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {STATUS_MAP[booking.status] || booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {/* Status Transistion Logic based on int status */}
                                        {booking.status === 2 && (
                                            <button onClick={() => handleStatusUpdate(booking.id, 3)} className="text-blue-600 hover:text-blue-900">Complete</button>
                                        )}
                                        {booking.status < 3 && (
                                            <button onClick={() => handleStatusUpdate(booking.id, 4)} className="text-red-600 hover:text-red-900">Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShopBookingManager;
