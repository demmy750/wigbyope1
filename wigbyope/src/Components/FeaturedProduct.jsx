import React, { useState, useEffect, useContext } from "react";
import "../Components/FeaturedProduct.css";
import CurlyLaceWigImg from '../assets/curly-lace-wig.jpeg';
import StraightWig from '../assets/straightwig.jpeg';
import TwistedWig from '../assets/Twistedwig.jpeg';
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const products = [
  {
    id: 1,
    name: "Curly Lace Wig",
    price: 120,
    image: CurlyLaceWigImg,
    description:
      "Beautiful curly lace wig with a natural look, lightweight and easy to style for everyday elegance.",
  },
  {
    id: 2,
    name: "Straight Human Hair",
    price: 150,
    image: StraightWig,
    description:
      "Silky straight wig made with 100% human hair for a flawless, natural finish and long-lasting wear.",
  },
  {
    id: 3,
    name: "Body Wave Wig",
    price: 180,
    image: TwistedWig,
    description:
      "Soft body wave wig with natural shine, perfect for all occasions and effortless glamour.",
  },
];

export default function FeaturedProducts() {
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Close modal on ESC key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="featured" aria-labelledby="featured-heading">
      <h2 id="featured-heading">Featured Products</h2>
      <div className="product-grid">
        {products.map(({ id, name, price, image }) => (
          <article className="product-card" key={id} tabIndex="0" aria-label={`${name}, priced at $${price}`}>
            <img src={image} alt={name} loading="lazy" />
            <h3>{name}</h3>
            <p className="price">${price}</p>
            <div className="card-actions">
              <button
                className="btn-secondary"
                onClick={() => setSelectedProduct(products.find(p => p.id === id))}
                aria-haspopup="dialog"
                aria-controls="product-modal"
              >
                <span style={{color: "black"}}>
                  Quick View
                </span>
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  addToCart(products.find(p => p.id === id));
                  toast.success(`Added "${name}" to cart!`);
                }}
                aria-label={`Add ${name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={() => setSelectedProduct(null)}
          id="product-modal"
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            tabIndex="-1"
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close modal"
            >
              ✖
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <h3 id="modal-title">{selectedProduct.name}</h3>
            <p className="price">${selectedProduct.price}</p>
            <p id="modal-description" className="description">{selectedProduct.description}</p>
            <button
              className="btn-primary"
              onClick={() => {
                addToCart(selectedProduct);
                toast.success(`Added "${selectedProduct.name}" to cart!`);
                setSelectedProduct(null);
              }}
              aria-label={`Add ${selectedProduct.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </section>
  );
}