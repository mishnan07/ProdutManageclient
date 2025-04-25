"use client";
import React, { useState } from "react";
import Script from "next/script";

const Payment = () => {
  const [paymentId, setPaymentId] = useState("");

  const handlePayment = async () => {
    if (typeof window !== "undefined" && window.Razorpay) {

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2UyODNkNjdlNjgwODdiMzcyNWIzNmMiLCJuYW1lIjoiTWlzaG5hbiIsImlhdCI6MTc0NTU1OTk1MywiZXhwIjoxNzQ1NjQ2MzUzfQ.nLcZhTs9a5grUPUXjfSPmkJM_Dz6ZyTEZZ83a2L_5oM'

      // Step 1: Create order
      const orderRes = await fetch("http://localhost:3010/v1/ecard/razorpay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "currency": "INR", "amount": "100", "dCardId": "6803799c2c88402e0c8f8618" })
      });

      const { razorpay_order_id, currency } = await orderRes.json();

      // Step 2: Configure Razorpay
      const options = {
        key: "rzp_test_7IQrfwQtlLyVb0", // Your Razorpay key
        amount: "", // will be auto handled from server
        currency,
        name: "Your Company",
        description: "Test Payment",
        order_id: razorpay_order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          setPaymentId(razorpay_payment_id);

          // Step 3: Verify payment (send signature in headers)
          const verifyRes = await fetch("http://localhost:3010/v1/ecard/razorpay/verify", {
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
    <div >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <h2>Make a Payment</h2>
      <button onClick={handlePayment}>Pay Now</button>
      {paymentId && <p>Payment ID: {paymentId}</p>}
    </div>
  );
};

export default Payment;
