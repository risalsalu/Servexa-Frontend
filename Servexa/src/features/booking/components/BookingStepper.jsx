import React from "react";
import { Check } from "lucide-react";

const steps = [
    { number: 1, label: "Mode" },
    { number: 2, label: "Details" },
    { number: 3, label: "Summary" },
    { number: 4, label: "Payment" },
];

const BookingStepper = ({ currentStep }) => {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;

                    return (
                        <React.Fragment key={step.number}>
                            {index > 0 && (
                                <div
                                    className={`flex-1 h-1 w-12 md:w-24 rounded ${currentStep >= step.number ? "bg-blue-600" : "bg-gray-200"
                                        }`}
                                />
                            )}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 ${isCompleted
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : isCurrent
                                            ? "bg-white border-blue-600 text-blue-600"
                                            : "bg-white border-gray-300 text-gray-300"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check size={20} />
                                    ) : (
                                        <span className="font-bold">{step.number}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs md:text-sm font-medium ${isCurrent || isCompleted ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingStepper;
