import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import bookingService from "../services/bookingService";
import BookingStepper from "../components/BookingStepper";

const BookingSummaryPage = () => {
    const navigate = useNavigate();
    const { booking, bookingId, setBooking, setCurrentStep } = useBooking();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bookingId) {
            navigate("/booking/create");
            return;
        }

        setCurrentStep(3); // Summary Step

        const fetchSummary = async () => {
            // ... fetch logic
            try {
                const data = await bookingService.getSummary(bookingId);
                setSummary(data);
            } catch (err) {
                console.error("Failed to load summary", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [bookingId, navigate, setCurrentStep]);

    const handleProceedToPayment = () => {
        navigate("/booking/payment");
    };

    if (loading) return <div className="p-8 text-center">Loading summary...</div>;
    if (!summary) return <div className="p-8 text-center text-red-500">Failed to load summary.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Review Booking</h1>
            <BookingStepper currentStep={3} />

            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                {/* 
                   We should ideally factor out a Summary Component, but for now inline is fine.
                   Displaying basic info. 
                */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Service Details</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-600">Shop:</div>
                        <div className="font-medium">{summary.shopName || "Test Shop"}</div>

                        <div className="text-gray-600">Services:</div>
                        <div className="font-medium">
                            {summary.services?.map(s => s.name).join(", ") || "Service A, Service B"}
                        </div>

                        <div className="text-gray-600">Total Amount:</div>
                        <div className="font-bold text-green-600">₹{summary.totalAmount}</div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleProceedToPayment}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSummaryPage;
