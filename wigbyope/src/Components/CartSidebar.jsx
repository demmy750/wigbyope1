import React, { useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Close sidebar on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/shop");
  };

  if (!isOpen) return null; // Optionally don't render when closed

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />

      {/* Sidebar */}
      <aside
        className="cart-sidebar open"
        aria-modal="true"
        role="dialog"
        aria-label="Shopping cart"
        ref={sidebarRef}
      >
        <header className="cart-sidebar-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
            &times;
          </button>
        </header>

        {cartItems.length === 0 ? (
          <p className="empty-message">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {cartItems.map(({ id, name, price, quantity, image }) => (
                <li key={id} className="cart-item">
                  <img src={image} alt={name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3>{name}</h3>
                    <p>${price.toFixed(2)}</p>
                    <label>
                      Qty:
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => updateQuantity(id, parseInt(e.target.value, 10))}
                        className="qty-input"
                        aria-label={`Quantity for ${name}`}
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

            <footer className="cart-sidebar-footer">
              <p className="subtotal">
                Subtotal: <strong>${total.toFixed(2)}</strong>
              </p>
              <div className="cart-sidebar-actions">
                <button onClick={handleContinueShopping} className="btn-continue">
                  Continue Shopping
                </button>
                <button onClick={handleCheckout} className="btn-checkout">
                  Proceed to Checkout
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}