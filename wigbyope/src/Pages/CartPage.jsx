// src/pages/CartPage.jsx
import React, { useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ isSidebarOpen, closeSidebar }) {
  const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    }
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, closeSidebar]);

  return (
    <aside className={`cart-sidebar ${isSidebarOpen ? "open" : ""}`} ref={sidebarRef}>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map(({ id, name, price, quantity, image }) => (
              <li key={id} className="cart-item">
                <img
                  src={image || "/placeholder.jpg"}
                  alt={name}
                  className="product-image"
                  onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                />
                <div className="product-info">
                  <h2>{name}</h2>
                  <p>${price.toFixed(2)}</p>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => updateQuantity(id, parseInt(e.target.value, 10) || 1)}
                    />
                  </label>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(id)}
                  aria-label={`Remove ${name} from cart`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p>
              Subtotal: <strong>${total.toFixed(2)}</strong>
            </p>
            <div className="cart-actions">
              <button onClick={() => { closeSidebar(); navigate("/shop"); }}>
                Continue Shopping
              </button>
              <button onClick={() => { closeSidebar(); navigate("/checkout"); }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
