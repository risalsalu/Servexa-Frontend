import React, { createContext, useState, useContext, useEffect } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    // Persistent state could be enhanced with localStorage if page refresh persistence is needed.
    // For now, in-memory state is sufficient as long as we don't refresh.
    // To be safe against refresh, we can init from localStorage.

    const [booking, setBooking] = useState(() => {
        const saved = localStorage.getItem("current_booking");
        return saved ? JSON.parse(saved) : null;
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sync to local storage for refresh safety
    useEffect(() => {
        if (booking) {
            localStorage.setItem("current_booking", JSON.stringify(booking));
        } else {
            localStorage.removeItem("current_booking");
        }
    }, [booking]);

    const value = {
        booking,
        setBooking,
        currentStep,
        setCurrentStep,
        loading,
        setLoading,
        error,
        setError
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBookingContext must be used within a BookingProvider");
    }
    return context;
};
