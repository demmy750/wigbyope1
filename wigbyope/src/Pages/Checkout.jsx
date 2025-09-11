// src/Pages/Checkout.jsx
import React, { useContext } from "react";
import { CartContext } from "../CartContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Checkout = () => {
  const { total, clearCart } = useContext(CartContext);

  const handlePayment = () => {
    alert("Redirecting to payment gateway (Paystack/Flutterwave)...");
    clearCart();
  };

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <h2>Checkout</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Address" required />
          <h3>Total: ₦{total.toLocaleString()}</h3>
          <button type="button" onClick={handlePayment}>
            Pay Now
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
