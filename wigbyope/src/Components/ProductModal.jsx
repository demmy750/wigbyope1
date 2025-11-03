// src/Components/ProductModal.jsx
import React from "react";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import "./ProductModal.css";

 function ProductModal({ product, onClose }) {
  const { addToCart } = useContext(CartContext);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Product Image */}
        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="modal-info">
          <h2 id="modal-title">{product.name}</h2>
          <p className="modal-price">${product.price}</p>
          <p className="modal-description">{product.description}</p>

          {/* Actions */}
          <div className="modal-actions">
            <button
              className="btn-primary"
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;