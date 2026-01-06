import { useState, useEffect } from "react";
import addressService from "../../services/addressService";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";

const AddressManager = ({ isSelectionMode = false, onSelectAddress, selectedAddressId }) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const data = await addressService.getAddresses();
            setAddresses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch addresses", err);
            setError("Could not load addresses.");
            setAddresses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (addr) => {
        setEditingAddress(addr);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await addressService.deleteAddress(id);
            fetchAddresses();
        } catch (err) {
            alert("Failed to delete address");
        }
    };

    const handleFormSubmit = async (payload) => {
        try {
            setIsSubmitting(true);
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, payload);
            } else {
                await addressService.addAddress(payload);
            }
            setIsModalOpen(false);
            fetchAddresses();
        } catch (err) {
            console.error(err);
            alert("Failed to save address");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow min-h-[400px] p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {isSelectionMode ? "Select Address" : "Manage Addresses"}
                </h2>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                    + Add New Address
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {isLoading ? (
                <div className="text-center py-8">Loading addresses...</div>
            ) : (
                <AddressList
                    addresses={addresses}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isSelectionMode={isSelectionMode}
                    onSelect={onSelectAddress}
                    selectedAddressId={selectedAddressId}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {editingAddress ? "Edit Address" : "Add New Address"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsModalOpen(false)}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressManager;
