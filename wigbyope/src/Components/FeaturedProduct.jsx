// import React, { useState, useEffect, useContext } from "react";
// import "../Components/FeaturedProduct.css";
// import CurlyLaceWigImg from '../assets/curly-lace-wig.jpeg';
// import StraightWig from '../assets/straightwig.jpeg';
// import TwistedWig from '../assets/Twistedwig.jpeg';
// import { CartContext } from "../context/CartContext";
// import { toast } from "react-toastify";

// const products = [
//   {
//     id: 1,
//     name: "Curly Lace Wig",
//     price: 120,
//     image: CurlyLaceWigImg,
//     description:
//       "Beautiful curly lace wig with a natural look, lightweight and easy to style for everyday elegance.",
//   },
//   {
//     id: 2,
//     name: "Straight Human Hair",
//     price: 150,
//     image: StraightWig,
//     description:
//       "Silky straight wig made with 100% human hair for a flawless, natural finish and long-lasting wear.",
//   },
//   {
//     id: 3,
//     name: "Body Wave Wig",
//     price: 180,
//     image: TwistedWig,
//     description:
//       "Soft body wave wig with natural shine, perfect for all occasions and effortless glamour.",
//   },
// ];

// export default function FeaturedProducts() {
//   const { addToCart } = useContext(CartContext);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Close modal on ESC key press
//   useEffect(() => {
//     function handleKeyDown(e) {
//       if (e.key === "Escape") {
//         setSelectedProduct(null);
//       }
//     }
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const handleQuickView = (productId) => {
//     const product = products.find(p => p.id === productId);
//     setSelectedProduct(product);
//   };

//   const handleAddToCart = (product) => {
//     addToCart(product);
//     toast.success(`Added "${product.name}" to cart!`);
//   };

//   const closeModal = () => {
//     setSelectedProduct(null);
//   };

//   return (
//     <section className="featured" aria-labelledby="featured-heading">
//       <h2 id="featured-heading">Featured Products</h2>
//       <p className="featured-subtitle">Discover our premium selection of high-quality wigs for every style and occasion.</p>
//       <div className="product-grid">
//         {products.map(({ id, name, price, image }) => (
//           <article className="product-card" key={id} tabIndex="0" aria-label={`${name}, priced at $${price}`}>
//             <div className="product-image-wrapper">
//               <img src={image} alt={name} loading="lazy" />
//             </div>
//             <h3>{name}</h3>
//             <p className="price">${price}</p>
//             <div className="card-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={() => handleQuickView(id)}
//                 aria-haspopup="dialog"
//                 aria-controls="product-modal"
//               >
//                 Quick View
//               </button>
//               {/* <button
//                 className="btn-primary"
//                 onClick={() => handleAddToCart(products.find(p => p.id === id))}
//                 aria-label={`Add ${name} to cart`}
//               >
//                 Add to Cart
//               </button> */}
//             </div>
//           </article>
//         ))}
//       </div>

//       {selectedProduct && (
//         <div
//           className="modal-overlay"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//           aria-describedby="modal-description"
//           onClick={closeModal}
//           id="product-modal"
//         >
//           <div
//             className="modal"
//             onClick={(e) => e.stopPropagation()}
//             tabIndex="-1"
//           >
//             <button
//               className="modal-close"
//               onClick={closeModal}
//               aria-label="Close modal"
//             >
//               ✖
//             </button>
//             <div className="modal-gallery">
//               <img src={selectedProduct.image} alt={selectedProduct.name} />
//             </div>
//             <h3 id="modal-title">{selectedProduct.name}</h3>
//             <p className="price">${selectedProduct.price}</p>
//             <p id="modal-description" className="description">{selectedProduct.description}</p>
//             <div className="modal-actions">
//               <button
//                 className="btn-primary"
//                 onClick={() => {
//                   handleAddToCart(selectedProduct);
//                   closeModal();
//                 }}
//                 aria-label={`Add ${selectedProduct.name} to cart`}
//               >    
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import "../Components/FeaturedProduct.css";
import useProducts from "../data/allProducts";
import { CartContext } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { toast } from "react-toastify";

export default function FeaturedProducts() {
  const navigate = useNavigate(); // Added for navigation to product detail page
  const { addToCart } = useContext(CartContext);
  const currencyCtx = useContext(CurrencyContext);
  const { products: allProducts, loading, error } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Shuffle array (Fisher-Yates) and take first 3
  const getRandomProducts = (products) => {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      setFeaturedProducts(getRandomProducts(allProducts));
    }
  }, [allProducts]);

  const handleQuickView = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product detail page by ID (same as ShopPage)
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added "${product.name}" to cart!`);
  };

  // Combined loading
  if (currencyCtx.isLoading || loading) {
    return (
      <section className="featured" aria-labelledby="featured-heading">
        <h2 id="featured-heading">Featured Products</h2>
        <p className="featured-subtitle">Discover our premium selection of high-quality wigs for every style and occasion.</p>
        <div className="product-grid">
          <div className="loading-message">Loading featured products...</div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || featuredProducts.length === 0) {
    return (
      <section className="featured" aria-labelledby="featured-heading">
        <h2 id="featured-heading">Featured Products</h2>
        <p className="featured-subtitle">Discover our premium selection of high-quality wigs for every style and occasion.</p>
        <div className="product-grid">
          <div className="error-message">
            {error ? `Error loading products: ${error}` : "No featured products available."}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured" aria-labelledby="featured-heading">
      <h2 id="featured-heading">Featured Products</h2>
      <p className="featured-subtitle">Discover our premium selection of high-quality wigs for every style and occasion.</p>
      <div className="product-grid">
        {featuredProducts.map((product) => (
          <article
            className="product-card"
            key={product._id}
            tabIndex="0"
            aria-label={`${product.name}, priced at ${getDynamicPrice(product.price)}`}
            onClick={() => handleQuickView(product._id)} // Navigate on click
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleQuickView(product._id); // Navigate on Enter or Space
              }
            }}
            role="button"
          >
            <div className="product-image-wrapper">
              <img
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                loading="lazy"
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
              />
              <div className="spotlight-overlay">Featured</div>
            </div>
            <h3>{product.name}</h3>
            <p className="price">{getDynamicPrice(product.price)}</p>
            <div className="card-actions">
              <button
                className="btn-secondary quick-view"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleQuickView(product._id);
                }}
                aria-label={`View details for ${product.name}`}
              >
                Quick View
              </button>
              {/* Optional: Add to Cart button on cards */}
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  // Helper for price (moved inside component for scope)
  function getDynamicPrice(price) {
    const converted = parseFloat(currencyCtx.getConvertedPrice(price));
    const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
    return `${symbol}${converted.toLocaleString()}`;
  }
}