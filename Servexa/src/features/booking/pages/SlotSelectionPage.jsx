import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import BookingStepper from "../components/BookingStepper";
import SlotSelector from "../components/SlotSelector";

const SlotSelectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking, bookingId, selectSlot, setCurrentStep } = useBooking();
    const [isProcessing, setIsProcessing] = useState(false);

    const effectiveBookingId = bookingId || location.state?.booking?.id;

    useEffect(() => {
        if (!effectiveBookingId) {
            navigate("/booking/create");
            return;
        }

        setCurrentStep(2); // Depending on stepper config
    }, [effectiveBookingId, navigate, setCurrentStep]);

    const handleSlotSelect = async (slotId) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await selectSlot(slotId);
            navigate("/booking/summary");
        } catch (error) {
            console.error("Slot selection failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!booking) return null; // Or a loader

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Select Time Slot</h1>
            <BookingStepper currentStep={3} />

            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                <SlotSelector
                    shopId={booking.shopId}
                    onSelect={handleSlotSelect}
                />
            </div>
        </div>
    );
};

export default SlotSelectionPage;
