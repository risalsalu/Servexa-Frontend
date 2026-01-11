import React, { useEffect, useState } from "react";
import AddressList from "../../../components/user/AddressList";
import addressService from "../../../services/addressService";

const AddressSelector = ({ onSelect, selectedAddressId, shopLocation }) => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    // Haversine Formula for distance
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

    // Filter addresses if shopLocation is provided
    const filteredAddresses = addresses.filter(addr => {
        if (!shopLocation || !addr.latitude || !addr.longitude) return true; // Show all if no shop loc context (or fallback)
        const dist = getDistanceFromLatLonInKm(shopLocation.lat, shopLocation.lng, addr.latitude, addr.longitude);
        return dist <= 10;
    });

    const handleSelect = (addr) => {
        onSelect(addr.id);
    };

    if (loading) return <div>Loading addresses...</div>;

    if (shopLocation && filteredAddresses.length === 0 && addresses.length > 0) {
        return (
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <p className="text-yellow-700 font-medium">No addresses found within 10km of the shop.</p>
                <p className="text-sm text-yellow-600 mt-2">Please add a new address closer to the shop location.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Select Address</h3>
            <AddressList
                addresses={filteredAddresses}
                onSelect={handleSelect}
                selectedAddressId={selectedAddressId}
                isSelectionMode={true}
                onEdit={() => { }}
                onDelete={() => { }}
            />
        </div>
    );
};

export default AddressSelector;
