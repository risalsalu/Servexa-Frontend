import { useState } from "react";

const AddressList = ({ addresses, onEdit, onDelete, isSelectionMode = false, onSelect, selectedAddressId }) => {

    if (!addresses || addresses.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200 border-dashed">
                <p>No addresses found. Add one to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    className={`bg-white p-4 rounded-lg shadow-sm border transaction-colors ${isSelectionMode && selectedAddressId === addr.id
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                    onClick={() => isSelectionMode && onSelect && onSelect(addr)}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-2">
                                {addr.label}
                            </span>
                            <p className="text-gray-900 font-medium">{addr.line1}</p>
                            <p className="text-gray-600 text-sm">
                                {addr.city}, {addr.pincode}
                            </p>
                            {(addr.lat !== 0 || addr.lng !== 0) && (
                                <p className="text-gray-400 text-xs mt-1">
                                    Lat: {addr.lat}, Lng: {addr.lng}
                                </p>
                            )}
                        </div>
                    </div>

                    {!isSelectionMode && (
                        <div className="mt-4 flex space-x-3 text-sm border-t pt-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(addr); }}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }}
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AddressList;
