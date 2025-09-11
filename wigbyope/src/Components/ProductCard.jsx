// ProductCard.jsx
import React, { useState } from "react";
import "./ProductCard.css";
export default function ProductCard({ product, addToCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <article
        className="product-card"
        tabIndex="0"
        aria-describedby={`desc-${product.id}`}
        role="group"
      >
        <div
          className="product-image-wrapper"
          aria-hidden="true"
          onClick={openModal}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
          <div className="quick-view-overlay">Quick View</div>
        </div>

        <h2>{product.name}</h2>
        <p className="price">${product.price}</p>

        <button
          className="btn-primary"
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          aria-disabled={!product.inStock}
          aria-label={
            product.inStock
              ? `Add ${product.name} to cart`
              : `${product.name} is out of stock`
          }
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>

        <p id={`desc-${product.id}`} className="sr-only">
          {product.description || "High quality wig."}
        </p>
      </article>

      {/* Quick View Modal */}
      {isModalOpen && (
  <div className="modal-overlay" onClick={closeModal}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${product.id}`}
    >
      <button className="modal-close" onClick={closeModal} aria-label="Close modal">
        &times;
      </button>

      <div className="modal-body">
        <img src={product.image} alt={product.name} className="modal-image" />

        <div className="modal-info">
          <h2 id={`modal-title-${product.id}`} className="modal-title">{product.name}</h2>
          <p className="price">${product.price}</p>
          <p className="description">{product.description || "Premium quality wig for any occasion."}</p>
          <p className={`availability ${product.inStock ? "in-stock" : "out-stock"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              addToCart(product);
              closeModal();
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
