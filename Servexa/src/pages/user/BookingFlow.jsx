import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import addressService from "../../services/addressService";
import serviceService from "../../services/serviceService";
import paymentService from "../../services/paymentService";
import { useBookingStore } from "../../store/bookingStore";

// Sub-components can be inline or internal for simplicity unless huge
const BookingFlow = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Slot, 3: Summary
    const [bookingDetails, setBookingDetails] = useState(null);

    // Data states
    const [addresses, setAddresses] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Selection states
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedSlotId, setSelectedSlotId] = useState(null);

    useEffect(() => {
        loadBooking();
    }, [bookingId]);

    const loadBooking = async () => {
        try {
            const data = await bookingService.getSummary(bookingId);
            setBookingDetails(data);
            // Optionally set step based on status if backend provides previous completion info
        } catch (err) {
            console.error(err);
            navigate("/dashboard"); // Redirect on invalid/unauthorized booking
        }
    };

    // --- Steps Handlers ---
    const handleAddressStep = async () => {
        try {
            const addrs = await addressService.getAll();
            setAddresses(addrs);
        } catch (err) { console.error("Failed to load addresses"); }
    };

    // ... (handleSlotStep remains similar)

    // ...

    const confirmPayment = async () => {
        try {
            // Check status, if PendingPayment, maybe use retry? 
            // Simplified: Always create order or use retry if status indicates failure.
            // Using standard createOrder flow as confirmed in step 3.
            await paymentService.createOrder(bookingId);

            // Simulate Verify
            await paymentService.verifyPayment({ bookingId, status: "success", paymentId: "mock_" + Date.now() });
            alert("Booking Confirmed!");
            navigate("/dashboard");
        } catch (err) {
            alert("Payment failed. Please try again.");
            // Optionally could offer a explicit "Retry" button that calls paymentService.retryPayment(bookingId)
        }
    };

    if (!bookingDetails) return <div className="p-8">Loading booking...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Complete Booking</h1>

            {/* Step Indicators */}
            <div className="flex mb-8 space-x-4">
                <div className={`px-4 py-2 rounded ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1. Address</div>
                <div className={`px-4 py-2 rounded ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2. Slot</div>
                <div className={`px-4 py-2 rounded ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3. Summary & Pay</div>
            </div>

            {/* Step 1: Address */}
            {step === 1 && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Select Address</h2>
                    <div className="space-y-4 mb-6">
                        {addresses.map(addr => (
                            <div key={addr.id} className={`p-4 border rounded cursor-pointer ${selectedAddressId === addr.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                onClick={() => setSelectedAddressId(addr.id)}>
                                <p className="font-bold">{addr.name}</p>
                                <p>{addr.addressLine}, {addr.city}</p>
                            </div>
                        ))}
                    </div>
                    {/* Add Address Form Place Holder */}
                    <button className="mb-4 text-blue-600">+ Add New Address</button>

                    <button onClick={confirmAddress} className="w-full bg-blue-600 text-white py-2 rounded">Next: Select Slot</button>
                </div>
            )}

            {/* Step 2: Slot */}
            {step === 2 && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Select Slot</h2>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="mb-4 border p-2 rounded" />

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {slots.map(slot => (
                            <button
                                key={slot.id}
                                disabled={!slot.isAvailable}
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`p-2 border rounded ${selectedSlotId === slot.id ? 'bg-blue-600 text-white' : slot.isAvailable ? 'hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                {slot.startTime}
                            </button>
                        ))}
                    </div>

                    <button onClick={confirmSlot} className="w-full bg-blue-600 text-white py-2 rounded">Next: Summary</button>
                </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                    <div className="mb-6 space-y-2">
                        <p><strong>Service:</strong> {bookingDetails.serviceName}</p>
                        <p><strong>Shop:</strong> {bookingDetails.shopName}</p>
                        <p><strong>Price:</strong> ${bookingDetails.price}</p>
                        <p><strong>Address:</strong> {bookingDetails.address}</p>
                        <p><strong>Slot:</strong> {bookingDetails.slotTime}</p>
                    </div>
                    <button onClick={confirmPayment} className="w-full bg-green-600 text-white py-3 rounded text-lg font-bold">Pay & Confirm</button>
                </div>
            )}
        </div>
    );
};

export default BookingFlow;
