import React from "react";
import { BookingStatus } from "../types/booking.types";

const BookingStatusBadge = ({ status }) => {
    let colorClass = "bg-gray-100 text-gray-800";

    switch (status) {
        case BookingStatus.CONFIRMED:
            colorClass = "bg-green-100 text-green-800";
            break;
        case BookingStatus.PENDING_PAYMENT:
            colorClass = "bg-yellow-100 text-yellow-800";
            break;
        case BookingStatus.COMPLETED:
            colorClass = "bg-blue-100 text-blue-800";
            break;
        case BookingStatus.CANCELLED:
            colorClass = "bg-red-100 text-red-800";
            break;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {status.replace("_", " ")}
        </span>
    );
};

export default BookingStatusBadge;
