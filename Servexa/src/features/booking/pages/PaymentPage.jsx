import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";
import BookingStepper from "../components/BookingStepper";
import bookingService from "../services/bookingService";
import paymentService from "../services/paymentService";

const PaymentPage = () => {
    const navigate = useNavigate();
    const { booking, setCurrentStep } = useBooking();

    // We can fetch fresh summary or trust context booking totalAmount.
    // Ideally fetch fresh to be secure.
    const [freshSummary, setFreshSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        if (!booking || !booking.id) {
            navigate("/booking/create");
            return;
        }

        setCurrentStep(4);

        const fetchData = async () => {
            try {
                const data = await bookingService.getSummary(booking.id);
                setFreshSummary(data);
                loadRazorpayScript();
            } catch (err) {
                console.error("Failed to load payment details", err);
                setError("Failed to load payment details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [booking, navigate, setCurrentStep]);

    const loadRazorpayScript = () => {
        if (document.querySelector("#razorpay-checkout-script")) return; // dedupe
        const script = document.createElement("script");
        script.id = "razorpay-checkout-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    };

    const handlePayment = async () => {
        if (!freshSummary) return;
        setPaymentProcessing(true);
        setError(null);

        try {
            // 1. Create Order
            const order = await paymentService.createOrder(freshSummary.totalAmount);

            // 2. Open Razorpay
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_placeholder",
                amount: order.amount,
                currency: order.currency,
                name: "Servexa",
                description: `Booking #${booking.id}`,
                order_id: order.id,
                handler: async (response) => {
                    // 3. Verify Payment
                    try {
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: booking.id
                        });

                        // 4. Update Booking Status - HANDLED BY VERIFY ENDPOINT
                        // await bookingService.updateStatus({
                        //    bookingId: booking.id,
                        //    status: "Confirmed"
                        // });

                        alert("Payment Successful! Booking Confirmed.");
                        navigate("/my-bookings");
                    } catch (verifyErr) {
                        console.error(verifyErr);
                        setError("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563EB"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                setError(`Payment Failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            setError("Failed to initiate payment. Please try again.");
        } finally {
            setPaymentProcessing(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading payment details...</div>;
    if (error) return <div className="p-12 text-center text-red-600 font-bold">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Make Payment</h1>

            <BookingStepper currentStep={4} />

            <div className="mt-12 text-center bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold mb-2">Total Amount to Pay</h2>
                <div className="text-5xl font-bold text-blue-600 mb-8">
                    ₹{freshSummary?.totalAmount || "0.00"}
                </div>

                <p className="text-gray-500 mb-8">
                    Secure payment via Razorpay. Your booking will be confirmed immediately after payment.
                </p>

                <button
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                    className={`px-10 py-4 rounded-full font-bold text-xl text-white shadow-xl transition-all transform hover:-translate-y-1 ${paymentProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {paymentProcessing ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
