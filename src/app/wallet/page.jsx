"use client";
import React, { useState } from "react";
import Script from "next/script";

const Payment = () => {
    const [paymentId, setPaymentId] = useState("");
    const [message, setMessage] = useState("");


    const handlePayment = async () => {
        if (typeof window !== "undefined" && window.Razorpay) {


            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2UyODNkNjdlNjgwODdiMzcyNWIzNmMiLCJuYW1lIjoiTWlzaG5hbiIsImlhdCI6MTc0NTAzNTMzNCwiZXhwIjoxNzQ1MTIxNzM0fQ.z1v5NjpINHPSiRd7WuUQW5JKDlZlNfDj0YYfXPHsv4A'


            // 1. Create Order from Backend
            const response = await fetch("http://localhost:3010/v1/cPartner/wallet/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: 500, currency: "INR" }), // Send userId too if needed
            });

            const data = await response.json();
            const order = data.order;

            // 2. Razorpay Options
            const options = {
                key: "rzp_test_7IQrfwQtlLyVb0", // Replace with your Razorpay test key
                amount: order.amount,
                currency: order.currency,
                name: "Your Company",
                description: "Wallet Top-up",
                order_id: order.id,


                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    setPaymentId(razorpay_payment_id);

                    // Step 3: Verify payment (send signature in headers)
                    const verifyRes = await fetch("http://localhost:3010/v1/cPartner/wallet/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            razorpay_signature, // custom header
                        },
                        body: JSON.stringify({
                            razorpay_order_id,
                            razorpay_payment_id,
                        }),
                    });

                    const result = await verifyRes.json();
                    if (verifyRes.ok) {
                        alert("Payment verified successfully!");
                    } else {
                        alert("Payment verification failed.");
                    }
                },

                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } else {
            console.error("Razorpay SDK not loaded.");
        }
    };

    return (
        <div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

            <h2>Make a wallet add fund Payment</h2>
            <button onClick={handlePayment}>Pay Now</button>

            {paymentId && <p>Payment ID: {paymentId}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Payment;
