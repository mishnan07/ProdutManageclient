"use client";
import React, { useState } from "react";
import Script from "next/script";

const Payment = () => {
    const [paymentId, setPaymentId] = useState("");
    const [message, setMessage] = useState("");


    const handlePayment = async () => {
        if (typeof window !== "undefined" && window.Razorpay) {


            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzMxZjQzM2E1YjI0OTE4OGYwMWZiYWIiLCJpYXQiOjE3NTAxNTIwMTUsImV4cCI6MTgxOTI3MjAxNX0.VStG8GTi1TIvU3Rx_s2_c1bBdp6Eg37qdqJsJgwAWZw'
            // 1. Create Order from Backend
            const response = await fetch("https://rubidya.com/c1599h/api/inrwallet/add/create", {
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
                    const verifyRes = await fetch("https://rubidya.com/c1599h/api/inrwallet/add/verify", {
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
