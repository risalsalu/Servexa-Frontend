import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import BookingStepper from "../components/BookingStepper";
import AddressSelector from "../components/AddressSelector";
import userShopService from "../../../services/userShopService";

const AddressSelectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking, bookingId, shopId, addAddress, setCurrentStep, loading, error } = useBooking();
    const [shopDetails, setShopDetails] = useState(null);

    // Use bookingId from context OR fall back to navigation state (handover)
    const effectiveBookingId = bookingId || location.state?.booking?.id;
    const effectiveShopId = shopId || location.state?.booking?.shopId;

    useEffect(() => {
        if (!effectiveBookingId) {
            navigate("/booking/create");
            return;
        }

        setCurrentStep(2);

        // Fetch shop details for radius check
        const fetchShop = async () => {
            if (effectiveShopId) {
                try {
                    const data = await userShopService.getShopDetails(shopId);
                    setShopDetails(data);
                } catch (err) {
                    console.error("Failed to load shop details used for address check", err);
                }
            }
        };
        fetchShop();

    }, [bookingId, shopId, navigate, setCurrentStep]);

    const handleAddressSelect = async (addressId) => {
        try {
            await addAddress(addressId);
            navigate("/booking/summary");
        } catch (err) {
            console.error(err);
        }
    };

    if (!booking) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Select Address</h1>

            <BookingStepper currentStep={2} />

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-700">
                    Showing addresses within 10km of {shopDetails?.shopName || "the shop"}.
                </p>
            </div>

            {error && (
                <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <AddressSelector
                        onSelect={handleAddressSelect}
                        shopLocation={shopDetails ? { lat: shopDetails.latitude, lng: shopDetails.longitude } : null}
                    />
                )}
            </div>
        </div>
    );
};

export default AddressSelectionPage;
