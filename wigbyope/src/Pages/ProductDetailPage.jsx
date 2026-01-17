// import './ProductDetailsPage.css'
// import React, { useState, useContext, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import useProducts from "../data/allProducts";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const { products: allProducts, loading, error } = useProducts();

//   const [selectedImage, setSelectedImage] = useState(0);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [quantity, setQuantity] = useState(1);
//   const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
//   const [reviews, setReviews] = useState([]); // Local state for added reviews
//   const [navigatingToRelated, setNavigatingToRelated] = useState(false); // New state for related product navigation feedback

//   // Find the product
//   const product = useMemo(() => {
//     return allProducts.find((p) => p._id === id);
//   }, [allProducts, id]);

//   // Combine existing and new reviews
//   const allReviews = useMemo(() => {
//     return [...(product?.reviews || []), ...reviews];
//   }, [product, reviews]);

//   // Related products
//   const relatedProducts = useMemo(() => {
//     if (!product) return [];
//     return allProducts
//       .filter((p) => p._id !== product._id && p.type === product.type)
//       .slice(0, 4);
//   }, [allProducts, product]);

//   // Lightbox navigation
//   const nextImage = () => {
//     setSelectedImage((prev) => (prev + 1) % (product.images?.length || 1));
//   };
//   const prevImage = () => {
//     setSelectedImage((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
//   };

//   // Handle review submission
//   const handleReviewSubmit = (e) => {
//     e.preventDefault();
//     if (!reviewForm.name || !reviewForm.comment) {
//       toast.error("Please fill in all fields.");
//       return;
//     }
//     const newReview = {
//       user: reviewForm.name,
//       rating: reviewForm.rating,
//       comment: reviewForm.comment,
//     };
//     setReviews((prev) => [...prev, newReview]); // Add to local state
//     setReviewForm({ name: "", rating: 5, comment: "" }); // Reset form
//     toast.success("Review added successfully!");
//     // In a real app: Send to API, e.g., fetch('/api/reviews', { method: 'POST', body: JSON.stringify(newReview) })
//   };

//   // Handle related product click with feedback and full page refresh
//   const handleRelatedProductClick = async (relProdId) => {
//     setNavigatingToRelated(true); // Show loading feedback
//     // Simulate a brief delay for user feedback
//     setTimeout(() => {
//       window.location.href = `/product/${relProdId}`; // Full page refresh to new product
//     }, 500); // 500ms delay to show feedback
//   };

//   // Loading state
//   if (loading || currencyCtx.isLoading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading product details...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="error-container">
//         <p>Error loading product: {error}</p>
//         <button className="btn-primary" onClick={() => window.location.reload()}>
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Product not found
//   if (!product) {
//     return (
//       <div className="not-found-container">
//         <h1>Product Not Found</h1>
//         <p>Sorry, we couldn't find the product you're looking for.</p>
//         <button className="btn-primary" onClick={() => navigate("/shop")}>
//           Back to Shop
//         </button>
//       </div>
//     );
//   }

//   // Helper for price
//   const getDynamicPrice = (price) => {
//     const converted = parseFloat(currencyCtx.getConvertedPrice(price));
//     const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//     return `${symbol}${converted.toLocaleString()}`;
//   };

//   // Average rating
//   const averageRating = allReviews.length
//     ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
//     : 0;

//   return (
//     <div className="product-detail-page">
//       {/* Back Button */}
//       <nav className="back-nav">
//         <button className="btn-secondary" onClick={() => navigate("/shop")}>
//           ← Back to Shop
//         </button>
//       </nav>

//       {/* Main Product Section */}
//       <section className="product-main">
//         {/* Image Gallery */}
//         <div className="product-gallery">
//           <div className="main-image" onClick={() => setLightboxOpen(true)}>
//             <img
//               src={product.images?.[selectedImage] || "/placeholder-image.jpg"}
//               alt={product.name}
//               loading="lazy"
//             />
//             <div className="zoom-overlay">Click to Zoom</div>
//           </div>
//           <div className="thumbnail-gallery">
//             {product.images?.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`${product.name} view ${index + 1}`}
//                 className={selectedImage === index ? "active" : ""}
//                 onClick={() => setSelectedImage(index)}
//                 loading="lazy"
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="product-info">
//           <h1>{product.name}</h1>
//           <div className="rating">
//             <span className="stars">{"★".repeat(Math.floor(averageRating))}</span>
//             <span>({allReviews.length} reviews)</span>
//           </div>
//           <p className="price">{getDynamicPrice(product.price)}</p>
//           <p className="description">{product.description}</p>

//           {/* Specs */}
//           <div className="specs">
//             <h3>Product Details</h3>
//             <ul>
//               <li><strong>Type:</strong> {product.type}</li>
//               <li><strong>Color:</strong> {product.color}</li>
//               <li><strong>Length:</strong> {product.length}"</li>
//               <li><strong>Material:</strong> {product.material || "Premium Synthetic"}</li>
//             </ul>
//           </div>

//           {/* Quantity Selector */}
//           <div className="quantity-selector">
//             <label htmlFor="quantity">Quantity:</label>
//             <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
//             <input
//               id="quantity"
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//             />
//             <button onClick={() => setQuantity(quantity + 1)}>+</button>
//           </div>

//           {/* Buttons */}
//           <div className="button-group"> {/* Added wrapper for buttons */}
//             <button
//               className="btn-primary add-to-cart"
//               onClick={() => {
//                 for (let i = 0; i < quantity; i++) {
//                   addToCart(product);
//                 }
//                 toast.success(`Added ${quantity} "${product.name}" to cart!`);
//                 setQuantity(1);
//               }}
//             >
//               Add to Cart
//             </button>
//             <button
//               className="btn-secondary"
//               onClick={() => {
//                 for (let i = 0; i < quantity; i++) {
//                   addToCart(product);
//                 }
//                 navigate('/checkout'); // Assuming checkout route is '/checkout'
//                 toast.success(`Added ${quantity} "${product.name}" to cart and proceeding to checkout!`);
//                 setQuantity(1);
//               }}
//               aria-label={`Buy ${quantity} ${product.name} now`}
//             >
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Lightbox Modal */}
//       {lightboxOpen && (
//         <div className="lightbox" onClick={() => setLightboxOpen(false)}>
//           <button className="close-btn" onClick={() => setLightboxOpen(false)}>×</button>
//           <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
//           <img
//             src={product.images?.[selectedImage] || "/placeholder-image.jpg"}
//             alt={product.name}
//             onClick={(e) => e.stopPropagation()}
//           />
//           <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
//         </div>
//       )}

//       {/* Reviews Section */}
//       <section className="reviews-section">
//         <h2>Customer Reviews</h2>
//         {allReviews.length ? (
//           <div className="reviews-list">
//             {allReviews.map((review, index) => (
//               <div key={index} className="review">
//                 <div className="review-header">
//                   <strong>{review.user}</strong>
//                   <span className="stars">{"★".repeat(review.rating)}</span>
//                 </div>
//                 <p>{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No reviews yet. Be the first to review!</p>
//         )}

//         {/* Review Form */}
//         <form className="review-form" onSubmit={handleReviewSubmit}>
//           <h3>Share Your Experience</h3>
//           <div className="form-group">
//             <label htmlFor="review-name">Your Name</label>
//             <input
//               id="review-name"
//               type="text"
//               placeholder="Enter your name"
//               value={reviewForm.name}
//               onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
//               required
//               aria-describedby="name-error"
//             />
//             <span id="name-error" className="error-text" style={{ display: reviewForm.name ? 'none' : 'block' }}>
//               Name is required.
//             </span>
//           </div>
//           <div className="form-group">
//             <label>Rating</label>
//             <div className="star-rating-input" role="radiogroup" aria-label="Select rating">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   className={`star ${star <= reviewForm.rating ? "selected" : ""}`}
//                   onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                   role="radio"
//                   aria-checked={star === reviewForm.rating}
//                   tabIndex={0}
//                   onKeyDown={(e) => e.key === "Enter" && setReviewForm({ ...reviewForm, rating: star })}
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="review-comment">Your Review</label>
//             <textarea
//               id="review-comment"
//               placeholder="Tell us what you think about this wig..."
//               value={reviewForm.comment}
//               onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//               maxLength={500}
//               required
//               aria-describedby="comment-error comment-counter"
//             />
//             <div className="textarea-footer">
//               <span id="comment-error" className="error-text" style={{ display: reviewForm.comment ? 'none' : 'block' }}>
//                 Review comment is required.
//               </span>
//               <span id="comment-counter" className="counter">{reviewForm.comment.length}/500</span>
//             </div>
//           </div>
//           <button type="submit" className="btn-primary submit-review">Submit Review</button>
//         </form>
//       </section>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <section className="related-products">
//           <h2>You Might Also Like</h2>
//           {navigatingToRelated && (
//             <div className="navigation-feedback">
//               <div className="spinner"></div>
//               <p>Loading product...</p>
//             </div>
//           )}
//           <div className="related-grid">
//             {relatedProducts.map((relProd) => (
//               <article
//                 key={relProd._id}
//                 className="related-card"
//                 onClick={() => handleRelatedProductClick(relProd._id)}
//               >
//                 <img src={relProd.images?.[0] || "/placeholder-image.jpg"} alt={relProd.name} />
//                 <h3>{relProd.name}</h3>
//                 <p className="price">{getDynamicPrice(relProd.price)}</p>
//               </article>
//             ))}
//           </div>
//         </section>
//       )}

//       <ToastContainer />
//     </div>
//   );
// }






import './ProductDetailsPage.css'
import React, { useState, useContext, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProducts from "../data/allProducts";
import { CartContext } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const currencyCtx = useContext(CurrencyContext);
  const { products: allProducts, loading, error } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" }); // Removed name from state
  const [reviews, setReviews] = useState([]); // Local state for added reviews (can be removed if not needed after API integration)
  const [submittingReview, setSubmittingReview] = useState(false); // New state for review submission loading
  const [isNavigating, setIsNavigating] = useState(false); // State for navigation transition

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find the product
  const product = useMemo(() => {
    return allProducts.find((p) => p._id === id);
  }, [allProducts, id]);

  // Combine existing and new reviews (local state can be phased out after full API integration)
  const allReviews = useMemo(() => {
    return [...(product?.reviews || []), ...reviews];
  }, [product, reviews]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p._id !== product._id && p.type === product.type)
      .slice(0, 4);
  }, [allProducts, product]);

  // Lightbox navigation
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product.images?.length || 1));
  };
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
  };

  // Handle review submission with API call
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment) { // Removed name check
      toast.error("Please fill in the comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage; adjust if using context
      if (!token) {
        toast.error("You must be logged in to submit a review.");
        setSubmittingReview(false);
        return;
      }
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming Bearer token auth
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("Review added successfully!");
        setReviewForm({ rating: 5, comment: "" }); // Reset form, removed name
        // Instead of reloading, update local reviews state to reflect the new review
        setReviews((prev) => [...prev, { name: "You", rating: reviewForm.rating, comment: reviewForm.comment }]); // Assuming user name is "You" or fetch from user data
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle related product click with transition
  const handleRelatedProductClick = (relProdId) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/product/${relProdId}`);
      setIsNavigating(false);
    }, 300); // Short delay for transition effect
  };

  // Loading state
  if (loading || currencyCtx.isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>Error loading product: {error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="not-found-container">
        <h1>Product Not Found</h1>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <button className="btn-primary" onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </div>
    );
  }

  // Helper for price
  const getDynamicPrice = (price) => {
    const converted = parseFloat(currencyCtx.getConvertedPrice(price));
    const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
    return `${symbol}${converted.toLocaleString()}`;
  };

  // Average rating
  const averageRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  return (
    <div className={`product-detail-page ${isNavigating ? 'fade-out' : 'fade-in'}`}>
      {/* Back Button */}
      <nav className="back-nav">
        <button className="btn-secondary" onClick={() => navigate("/shop")}>
          ← Back to Shop
        </button>
      </nav>

      {/* Main Product Section */}
      <section className="product-main">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image" onClick={() => setLightboxOpen(true)}>
            <img
              src={product.images?.[selectedImage] || "/placeholder-image.jpg"}
              alt={product.name}
              loading="lazy"
            />
            <div className="zoom-overlay">Click to Zoom</div>
          </div>
          <div className="thumbnail-gallery">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} view ${index + 1}`}
                className={selectedImage === index ? "active" : ""}
                onClick={() => setSelectedImage(index)}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="rating">
            <span className="stars">{"★".repeat(Math.floor(averageRating))}</span>
            <span>({allReviews.length} reviews)</span>
          </div>
          <p className="price">{getDynamicPrice(product.price)}</p>
          <p className="description">{product.description}</p>

          {/* Specs */}
          <div className="specs">
            <h3>Product Details</h3>
            <ul>
              <li><strong>Type:</strong> {product.type}</li>
              <li><strong>Color:</strong> {product.color}</li>
              <li><strong>Length:</strong> {product.length}"</li>
              <li><strong>Material:</strong> {product.material || "Premium Synthetic"}</li>
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          {/* Buttons */}
          <div className="button-group"> {/* Added wrapper for buttons */}
            <button
              className="btn-primary add-to-cart"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }
                toast.success(`Added ${quantity} "${product.name}" to cart!`);
                setQuantity(1);
              }}
            >
              Add to Cart
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }
                navigate('/checkout'); // Assuming checkout route is '/checkout'
                toast.success(`Added ${quantity} "${product.name}" to cart and proceeding to checkout!`);
                setQuantity(1);
              }}
              aria-label={`Buy ${quantity} ${product.name} now`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="close-btn" onClick={() => setLightboxOpen(false)}>×</button>
          <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <img
            src={product.images?.[selectedImage] || "/placeholder-image.jpg"}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
        </div>
      )}

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        {allReviews.length ? (
          <div className="reviews-list">
            {allReviews.map((review, index) => (
              <div key={index} className="review">
                <div className="review-header">
                  <strong>{review.name}</strong> {/* Now directly using review.name */}
                  <span className="stars">{"★".repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}

        {/* Review Form */}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Share Your Experience</h3>
          {/* Removed name input field */}
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating-input" role="radiogroup" aria-label="Select rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= reviewForm.rating ? "selected" : ""}`}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  role="radio"
                  aria-checked={star === reviewForm.rating}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setReviewForm({ ...reviewForm, rating: star })}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="review-comment">Your Review</label>
            <textarea
              id="review-comment"
              placeholder="Tell us what you think about this wig..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              maxLength={500}
              required
              aria-describedby="comment-error comment-counter"
            />
            <div className="textarea-footer">
              <span id="comment-error" className="error-text" style={{ display: reviewForm.comment ? 'none' : 'block' }}>
                Review comment is required.
              </span>
              <span id="comment-counter" className="counter">{reviewForm.comment.length}/500</span>
            </div>
          </div>
          <button type="submit" className="btn-primary submit-review" disabled={submittingReview}>
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You Might Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((relProd) => (
              <article
                key={relProd._id}
                className="related-card"
                onClick={() => handleRelatedProductClick(relProd._id)}
              >
                <img src={relProd.images?.[0] || "/placeholder-image.jpg"} alt={relProd.name} />
                <h3>{relProd.name}</h3>
                <p className="price">{getDynamicPrice(relProd.price)}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <ToastContainer />
    </div>
  );
}