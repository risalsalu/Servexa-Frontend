import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import BookingStepper from "../components/BookingStepper";
import ServiceModeCard from "../components/ServiceModeCard";
import { Home, Calendar } from "lucide-react";
import userShopService from "../../../services/userShopService";

const CreateBookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { createDraft, resetBooking, booking } = useBooking();

    // We expect these from /shop/:id navigation state
    const { shopId, serviceIds } = location.state || {};

    const [selectedMode, setSelectedMode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shopDetails, setShopDetails] = useState(null);
    const [fetchingShop, setFetchingShop] = useState(false);
    const [error, setError] = useState(null);

    // Reset logic
    useEffect(() => {
        if (shopId) {
            resetBooking();
        }
    }, [shopId, resetBooking]);

    // Fetch Shop Details for Validations (Home Service)
    useEffect(() => {
        const idToFetch = shopId || booking?.shopId;
        if (idToFetch) {
            const fetchShop = async () => {
                setFetchingShop(true);
                try {
                    const data = await userShopService.getShopDetails(idToFetch);
                    setShopDetails(data);
                } catch (err) {
                    console.error("Failed to fetch shop details", err);
                } finally {
                    setFetchingShop(false);
                }
            };
            fetchShop();
        }
    }, [shopId, booking?.shopId]);

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
    };

    const handleStartBooking = async () => {
        const idToUse = shopId || booking?.shopId;
        const servicesToUse = serviceIds || booking?.serviceIds;

        if (!idToUse || !servicesToUse) {
            setError("Missing booking data. Please try again from Shop page.");
            return;
        }

        if (!selectedMode) return;

        setLoading(true);
        setError(null);

        try {
            // Mode: 'home' -> 2, 'slot' -> 1
            const modeValue = selectedMode === "home" ? 2 : 1;

            const payload = {
                shopId: String(idToUse),
                serviceIds: Array.isArray(servicesToUse) ? servicesToUse.map(String) : [String(servicesToUse)],
                serviceMode: modeValue
            };

            console.log("Creating Draft:", payload);

            // Create Draft
            const newBooking = await createDraft(payload);

            if (selectedMode === "home") {
                navigate("/booking/address", { state: { booking: newBooking } });
            } else {
                navigate("/booking/slot", { state: { booking: newBooking } });
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Failed to create booking draft");
        } finally {
            setLoading(false);
        }
    };

    // GUARD: If no shopId in state AND no existing booking context, show invalid access.
    // However, if we HAVE a booking, we shouldn't necessarily be here unless we want to restart?
    // User requirement: "User is unexpectedly redirected back to /booking/create". 
    // This happens when guards fail. 
    // If we are here, we are starting fresh. If we have a booking, we might want to offer resume?
    // For now, allow access if we strictly have shopId. 
    // If we fallback here from a redirect, we show error.
    // GUARD: Simple check. If we have no shopId AND no existing booking, then it's invalid.
    // But if we have an existing booking, we might be resuming.
    if (!shopId && !location.state && !booking?.id) {
        return (
            <div className="p-12 text-center">
                <p className="text-red-500">Invalid access. Please select a service from a shop first.</p>
                <button
                    onClick={() => navigate("/shops")}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Go to Shops
                </button>
            </div>
        );
    }

    if (fetchingShop) return <div className="p-12 text-center">Loading options...</div>;

    const isHomeServiceAvailable = shopDetails?.isHomeServiceAvailable || false;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Select Service Mode</h1>

            <BookingStepper currentStep={1} />

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceModeCard
                    title="Home Service"
                    description={isHomeServiceAvailable ? "Professional comes to your doorstep" : "Not available for this shop"}
                    icon={<Home size={40} />}
                    isSelected={selectedMode === "home"}
                    onClick={() => isHomeServiceAvailable && handleModeSelect("home")}
                    disabled={!isHomeServiceAvailable}
                />

                <ServiceModeCard
                    title="Visit Shop"
                    description="You visit the shop at a scheduled time"
                    icon={<Calendar size={40} />}
                    isSelected={selectedMode === "slot"}
                    onClick={() => handleModeSelect("slot")}
                />
            </div>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={handleStartBooking}
                    disabled={!selectedMode || loading}
                    className={`px - 8 py - 3 rounded - lg font - bold text - white transition - all transform ${!selectedMode || loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 shadow-lg"
                        } `}
                >
                    {loading ? "Processing..." : "Proceed"}
                </button>
            </div>
        </div>
    );
};

export default CreateBookingPage;
