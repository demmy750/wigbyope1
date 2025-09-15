import React, { useState, useMemo, useEffect, useContext } from "react";
import "./ShopPage.css";
import useProducts from "../data/allProducts"; // ✅ import the hook
import { CartContext } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TYPES = ["Lace Wig", "Closure", "Frontal", "Bundle"];
const COLORS = ["Black", "Brown", "Blonde", "Custom"];
const LENGTHS = [
  { label: '8"–14"', min: 8, max: 14 },
  { label: '15"–22"', min: 15, max: 22 },
  { label: '23"–30"', min: 23, max: 30 },
];

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} aria-hidden="true" className={i <= rating ? "star filled" : "star"}>
        ★
      </span>
    );
  }
  return (
    <span aria-label={`${rating} out of 5 stars`} role="img" className="star-rating">
      {stars}
    </span>
  );
};

export default function ShopPage() {
  const { addToCart } = useContext(CartContext);

  // ✅ load products from hook
  const { products: allProducts, loading, error } = useProducts();

  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [selectedLengths, setSelectedLengths] = useState(new Set());

  const PRODUCTS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  const [detailProduct, setDetailProduct] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const toggleSetValue = (set, value) => {
    const newSet = new Set(set);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    return newSet;
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTypes.size && !selectedTypes.has(p.type)) return false;
      if (selectedColors.size && !selectedColors.has(p.color)) return false;
      if (selectedLengths.size) {
        let lengthMatch = false;
        for (let len of selectedLengths) {
          const range = LENGTHS.find((l) => l.label === len);
          if (range && p.length >= range.min && p.length <= range.max) {
            lengthMatch = true;
            break;
          }
        }
        if (!lengthMatch) return false;
      }
      return true;
    });
  }, [allProducts, search, selectedTypes, selectedColors, selectedLengths]);

  const paginatedProducts = filteredProducts.slice(0, page * PRODUCTS_PER_PAGE);

  const loadMore = () => {
    if (page * PRODUCTS_PER_PAGE < filteredProducts.length) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, selectedTypes, selectedColors, selectedLengths]);

  const nextImage = () => {
    if (!detailProduct) return;
    setGalleryIndex((galleryIndex + 1) % detailProduct.images.length);
  };
  const prevImage = () => {
    if (!detailProduct) return;
    setGalleryIndex((galleryIndex - 1 + detailProduct.images.length) % detailProduct.images.length);
  };

  // FIX: Add safe check for relatedIds to avoid undefined error
  const relatedProducts = detailProduct && Array.isArray(detailProduct.relatedIds)
    ? allProducts.filter((p) => detailProduct.relatedIds.includes(p.id))
    : [];

  // ✅ Handle loading & error states
  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;

  return (
    <>
      <header className="shop-header" role="banner">
        <h1>Discover Premium Wigs</h1>
        <p>Explore our curated collection of luxurious wigs tailored to your style.</p>
      </header>

      {/* 🔎 Filters */}
      <section className="filters" aria-label="Product filters">
        <div className="filter-group">
          <h3>Type</h3>
          <div className="filter-options">
            {TYPES.map((type) => (
              <label key={type} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.has(type)}
                  onChange={() => setSelectedTypes(toggleSetValue(selectedTypes, type))}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Color</h3>
          <div className="filter-options">
            {COLORS.map((color) => (
              <label key={color} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedColors.has(color)}
                  onChange={() => setSelectedColors(toggleSetValue(selectedColors, color))}
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Length</h3>
          <div className="filter-options">
            {LENGTHS.map(({ label }) => (
              <label key={label} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedLengths.has(label)}
                  onChange={() => setSelectedLengths(toggleSetValue(selectedLengths, label))}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search wigs..."
            aria-label="Search wigs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* 🛒 Product Grid */}
      <section className="product-grid" aria-live="polite" aria-label="Product listings">
        {paginatedProducts.length === 0 && (
          <p className="no-results" role="alert">
            No products found matching your criteria.
          </p>
        )}
        {paginatedProducts.map((product) => (
          <article
            key={product.id}
            className="product-card"
            tabIndex="0"
            aria-describedby={`desc-${product.id}`}
            onClick={() => {
              setDetailProduct(product);
              setGalleryIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDetailProduct(product);
                setGalleryIndex(0);
              }
            }}
            role="button"
          >
            <div className="product-image-wrapper" aria-hidden="true">
              <img src={product.images[0]} alt={product.name} loading="lazy" />
              <div className="quick-view-overlay">Quick View</div>
            </div>
            <h2>{product.name}</h2>
            <p className="price">${product.price.toFixed(2)}</p>
            <button
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
                toast.success(`Added "${product.name}" to cart!`);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
            <p id={`desc-${product.id}`} className="sr-only">
              {product.description}
            </p>
          </article>
        ))}
      </section>

      {/* Load More */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="load-more-wrapper">
          <button className="btn-secondary" onClick={loadMore} aria-label="Load more products">
            Load More
          </button>
        </div>
      )}

      {/* 🔍 Product Modal */}
      {detailProduct && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          aria-describedby="detail-desc"
          onClick={() => setDetailProduct(null)}
          tabIndex={-1}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()} tabIndex={0}>
            <button
              className="modal-close"
              aria-label="Close product details"
              onClick={() => setDetailProduct(null)}
            >
              ×
            </button>

            <div className="gallery">
              <button className="gallery-nav prev" aria-label="Previous image" onClick={prevImage}>
                ‹
              </button>
              <img
                src={detailProduct.images[galleryIndex]}
                alt={`${detailProduct.name} image ${galleryIndex + 1}`}
                loading="lazy"
              />
              <button className="gallery-nav next" aria-label="Next image" onClick={nextImage}>
                ›
              </button>
            </div>

            <h2 id="detail-title">{detailProduct.name}</h2>
            <p className="price">${detailProduct.price.toFixed(2)}</p>
            <p id="detail-desc" className="description">{detailProduct.description}</p>
            <p className={`availability ${detailProduct.availability === "In Stock" ? "in-stock" : "out-stock"}`}>
              {detailProduct.availability}
            </p>

            <div className="detail-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  addToCart(detailProduct);
                  toast.success(`Added "${detailProduct.name}" to cart!`);
                  setDetailProduct(null); // close modal
                }}
              >
                Add to Cart
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  toast.info(`Proceeding to buy "${detailProduct.name}"`);
                  setDetailProduct(null);
                }}
              >
                Buy Now
              </button>
            </div>

            <section className="reviews" aria-label="Customer reviews">
              <h3>Customer Reviews</h3>
              {detailProduct.reviews.length === 0 && <p>No reviews yet.</p>}
              <ul>
                {detailProduct.reviews.map(({ id, name, rating, comment }) => (
                  <li key={id} className="review">
                    <strong>{name}</strong> <StarRating rating={rating} />
                    <p>{comment}</p>
                  </li>
                ))}
              </ul>
            </section>

            {relatedProducts.length > 0 && (
              <section className="related-products" aria-label="Related products">
                <h3>Suggested Wigs</h3>
                <div className="related-grid">
                  {relatedProducts.map((rp) => (
                    <article
                      key={rp.id}
                      className="related-card"
                      tabIndex="0"
                      onClick={() => {
                        setDetailProduct(rp);
                        setGalleryIndex(0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDetailProduct(rp);
                          setGalleryIndex(0);
                        }
                      }}
                      role="button"
                      aria-label={`View details for ${rp.name}`}
                    >
                      <img src={rp.images[0]} alt={rp.name} loading="lazy" />
                      <p>{rp.name}</p>
                      <p className="price">${rp.price.toFixed(2)}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer />
    </>
  );
}