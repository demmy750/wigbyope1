// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./CheckoutPage.css";

const stripePromise = loadStripe("pk_test_xxxxxxxxxxxxx"); // Your Stripe publishable key

const CheckoutForm = ({ orderSummary, billingInfo, shippingInfo, paymentMethod, placeOrder }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const calculateTotal = () =>
    orderSummary.items.reduce((t, i) => t + i.price * i.quantity, 0);

  const handleStripePayment = async () => {
    try {
      // Create payment intent
      const res = await fetch("http://localhost:5000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotal() * 100,
          currency: "usd",
        }),
      });

      const { clientSecret } = await res.json();

      // Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            phone: billingInfo.phone,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await placeOrder({
          billingInfo,
          shippingInfo,
          items: orderSummary.items,
          totalAmount: calculateTotal(),
          paymentMethod: "stripe",
          transactionId: paymentIntent.id,
        });
        navigate("/confirmation");
      }
    } catch (err) {
      setError("Payment failed. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === "stripe") {
      if (!stripe || !elements) return;
      setIsSubmitting(true);
      await handleStripePayment();
      setIsSubmitting(false);
    } else if (paymentMethod === "paystack") {
      // 🔹 Placeholder for Paystack integration
      alert("Redirecting to Paystack (Nigeria only)");
      // TODO: Integrate Paystack SDK here
    } else {
      alert("Unsupported payment method.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-section">
      <h2>Payment Information</h2>

      {paymentMethod === "stripe" && (
        <>
          <CardElement className="card-element" />
          {error && <p className="error-msg">{error}</p>}
        </>
      )}

      {paymentMethod === "paystack" && (
        <p>Paystack will be used for this transaction (NGN currency).</p>
      )}

      <button type="submit" disabled={isSubmitting} className="place-order-btn">
        {isSubmitting ? "Processing..." : `Pay with ${paymentMethod}`}
      </button>
    </form>
  );
};

const CheckoutPage = ({ placeOrder }) => {
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US", // default country
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const orderSummary = {
    items: [
      { id: 1, name: "Lace Front Wig", quantity: 1, price: 120 },
      { id: 2, name: "Hair Care Serum", quantity: 2, price: 25 },
    ],
  };

  // 🔹 Auto-select payment method based on country
  useEffect(() => {
    if (shippingInfo.country === "NG") {
      setPaymentMethod("paystack");
    } else {
      setPaymentMethod("stripe");
    }
  }, [shippingInfo.country]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "billing") {
      setBillingInfo((prev) => ({ ...prev, [name]: value }));
    } else if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <main className="checkout-container">
      <h1>Checkout</h1>

      {/* Shipping Info */}
      <fieldset className="checkout-section">
        <legend>Shipping Information</legend>

        <label>
          Country*
          <select
            name="country"
            value={shippingInfo.country}
            onChange={(e) => handleInputChange(e, "shipping")}
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="NG">Nigeria</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            {/* add more countries as needed */}
          </select>
        </label>

        <label>
          Address*
          <input
            name="address"
            type="text"
            value={shippingInfo.address}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
        </label>
      </fieldset>

      {/* Payment Form */}
      <Elements stripe={stripePromise}>
        <CheckoutForm
          orderSummary={orderSummary}
          billingInfo={billingInfo}
          shippingInfo={shippingInfo}
          paymentMethod={paymentMethod}
          placeOrder={placeOrder}
        />
      </Elements>
    </main>
  );
};

export default CheckoutPage;
