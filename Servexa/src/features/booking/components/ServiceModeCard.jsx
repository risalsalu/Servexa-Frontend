import React from "react";

const ServiceModeCard = ({ title, description, icon, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer border rounded-xl p-6 transition-all duration-200 flex flex-col items-center text-center space-y-4 ${isSelected
                    ? "border-blue-600 bg-blue-50 shadow-md transform scale-105"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}
        >
            <div className={`text-4xl ${isSelected ? "text-blue-600" : "text-gray-400"}`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-bold text-lg ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    {title}
                </h3>
                <p className={`text-sm mt-2 ${isSelected ? "text-blue-700" : "text-gray-500"}`}>
                    {description}
                </p>
            </div>
            <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}
            >
                {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default ServiceModeCard;
