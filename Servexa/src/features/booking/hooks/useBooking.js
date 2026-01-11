import { useCallback } from "react";
import bookingService from "../services/bookingService";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../context/BookingContext";

export const useBooking = () => {
    const navigate = useNavigate();
    const {
        booking,
        setBooking,
        currentStep,
        setCurrentStep,
        loading,
        setLoading,
        error,
        setError
    } = useBookingContext();

    const createDraft = useCallback(async (data) => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const newBooking = await bookingService.createDraft(data);
            setBooking(newBooking);
            // Navigation is now handled by the component or here depending on preference.
            // Component handling is more explicit for flow control.
            return newBooking;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking draft");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loading, setBooking, setLoading, setError]);

    const addAddress = useCallback(async (addressId) => {
        if (!booking?.id) {
            setError("No active booking");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const updatedBooking = await bookingService.addAddress(booking.id, addressId);
            setBooking(updatedBooking);
            return updatedBooking;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add address");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [booking, setBooking, setLoading, setError]);

    const selectSlot = useCallback(async (slotId) => {
        if (!booking?.id) {
            setError("No active booking");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const updatedBooking = await bookingService.selectSlot(booking.id, slotId);
            setBooking(updatedBooking);
            return updatedBooking;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to select slot");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [booking, setBooking, setLoading, setError]);

    const resetBooking = useCallback(() => {
        setBooking(null);
        setCurrentStep(1);
        localStorage.removeItem("current_booking");
    }, [setBooking, setCurrentStep]);

    return {
        currentStep,
        setCurrentStep,
        booking,
        loading,
        error,
        createDraft,
        addAddress,
        selectSlot,
        resetBooking,
        setBooking,
        bookingId: booking?.id,
        shopId: booking?.shopId,
        serviceIds: booking?.serviceIds,
        serviceMode: booking?.serviceMode,
        isAuthenticated: true // Helper if needed
    };
};
