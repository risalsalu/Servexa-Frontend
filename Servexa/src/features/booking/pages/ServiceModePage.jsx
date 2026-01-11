import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingStepper from "../components/BookingStepper";
import ServiceModeCard from "../components/ServiceModeCard";
import { Home, Calendar } from "lucide-react";

const ServiceModePage = () => {
    const navigate = useNavigate();
    const { bookingId } = useParams();
    const [selectedMode, setSelectedMode] = React.useState(null);

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
    };

    const handleContinue = () => {
        if (selectedMode === "home") {
            navigate(`/booking/${bookingId}/address`);
        } else if (selectedMode === "slot") {
            navigate(`/booking/${bookingId}/slot`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Select Service Mode</h1>

            <BookingStepper currentStep={1} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceModeCard
                    title="Home Service"
                    description="Professional comes to your doorstep"
                    icon={<Home size={40} />}
                    isSelected={selectedMode === "home"}
                    onClick={() => handleModeSelect("home")}
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
                    onClick={handleContinue}
                    disabled={!selectedMode}
                    className={`px-8 py-3 rounded-lg font-bold text-white transition-all transform ${selectedMode
                            ? "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 shadow-lg"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ServiceModePage;
