// // // import React, { useContext, useEffect, useRef } from "react";
// // // import { CartContext } from "../context/CartContext";
// // // import { useNavigate } from "react-router-dom";
// // // import "./CartSidebar.css";

// // // export default function CartSidebar({ isOpen, onClose }) {
// // //   const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
// // //   const navigate = useNavigate();
// // //   const sidebarRef = useRef(null);

// // //   // console.log("🛒 Cart Items:", cartItems);

// // //   // Close sidebar on click outside
// // //   useEffect(() => {
// // //     function handleClickOutside(event) {
// // //       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// // //         onClose();
// // //       }
// // //     }

// // //     if (isOpen) {
// // //       document.addEventListener("mousedown", handleClickOutside);
// // //     } else {
// // //       document.removeEventListener("mousedown", handleClickOutside);
// // //     }

// // //     return () => {
// // //       document.removeEventListener("mousedown", handleClickOutside);
// // //     };
// // //   }, [isOpen, onClose]);

// // //   const handleCheckout = () => {
// // //     onClose();
// // //     navigate("/checkout");
// // //   };

// // //   const handleContinueShopping = () => {
// // //     onClose();
// // //     navigate("/shop");
// // //   };

// // //   if (!isOpen) return null; // Don’t render when closed

// // //   return (
// // //     <>
// // //       {/* Overlay */}
// // //       <div className="cart-overlay" onClick={onClose} aria-hidden="true" />

// // //       {/* Sidebar */}
// // //       <aside
// // //         className="cart-sidebar open"
// // //         aria-modal="true"
// // //         role="dialog"
// // //         aria-label="Shopping cart"
// // //         ref={sidebarRef}
// // //       >
// // //         <header className="cart-sidebar-header">
// // //           <h2>Your Cart</h2>
// // //           <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
// // //             &times;
// // //           </button>
// // //         </header>

// // //         {cartItems.length === 0 ? (
// // //           <p className="empty-message">Your cart is empty.</p>
// // //         ) : (
// // //           <>
// // //             <ul className="cart-items-list">
// // //               {cartItems.map(({ _id, name, price, quantity, images }, index) => (
// // //                 <li key={_id || index} className="cart-item">
// // //                   <img
// // //                     src={images?.[0] || "/placeholder.jpg"}
// // //                     alt={name}
// // //                     className="cart-item-image"
// // //                     onError={(e) => {
// // //                       e.target.src = "/placeholder.jpg";
// // //                     }}
// // //                   />
// // //                   <div className="cart-item-info">
// // //                     <h3>{name}</h3>
// // //                     <p>${price.toFixed(2)}</p>
// // //                     <label>
// // //                       Qty:
// // //                       <input
// // //                         type="number"
// // //                         min="1"
// // //                         value={quantity}
// // //                         onChange={(e) =>
// // //                           updateQuantity(_id, parseInt(e.target.value, 10) || 1)
// // //                         }
// // //                         className="qty-input"
// // //                         aria-label={`Quantity for ${name}`}
// // //                       />
// // //                     </label>
// // //                   </div>
// // //                   <button
// // //                     className="remove-btn"
// // //                     onClick={() => removeFromCart(_id)}
// // //                     aria-label={`Remove ${name} from cart`}
// // //                   >
// // //                     &times;
// // //                   </button>
// // //                 </li>
// // //               ))}
// // //             </ul>

// // //             <footer className="cart-sidebar-footer">
// // //               <p className="subtotal">
// // //                 Subtotal: <strong>${(total || 0).toFixed(2)}</strong>
// // //               </p>
// // //               <div className="cart-sidebar-actions">
// // //                 <button onClick={handleContinueShopping} className="btn-continue">
// // //                   Continue Shopping
// // //                 </button>
// // //                 <button onClick={handleCheckout} className="btn-checkout">
// // //                   Proceed to Checkout
// // //                 </button>
// // //               </div>
// // //             </footer>
// // //           </>
// // //         )}
// // //       </aside>
// // //     </>
// // //   );
// // // }




// // import React, { useContext, useEffect, useRef } from "react";
// // import { CartContext } from "../context/CartContext";
// // import { CurrencyContext } from "../context/CurrencyContext"; // New: Import for dynamic currency
// // import { useNavigate } from "react-router-dom";
// // import "./CartSidebar.css";

// // export default function CartSidebar({ isOpen, onClose }) {
// //   const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
// //   const currencyCtx = useContext(CurrencyContext); // New: Access currency context
// //   const navigate = useNavigate();
// //   const sidebarRef = useRef(null);

// //   // console.log("🛒 Cart Items:", cartItems);

// //   // Close sidebar on click outside
// //   useEffect(() => {
// //     function handleClickOutside(event) {
// //       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //         onClose();
// //       }
// //     }

// //     if (isOpen) {
// //       document.addEventListener("mousedown", handleClickOutside);
// //     } else {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     }

// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, [isOpen, onClose]);

// //   const handleCheckout = () => {
// //     onClose();
// //     navigate("/checkout");
// //   };

// //   const handleContinueShopping = () => {
// //     onClose();
// //     navigate("/shop");
// //   };

// //   if (!isOpen) return null; // Don’t render when closed

// //   // New: Loading check for currency (prevents flash of USD)
// //   if (currencyCtx.isLoading) {
// //     return (
// //       <aside className="cart-sidebar open">
// //         <header className="cart-sidebar-header">
// //           <h2>Your Cart</h2>
// //           <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
// //             &times;
// //           </button>
// //         </header>
// //         <p className="empty-message">Loading cart...</p>
// //       </aside>
// //     );
// //   }

// //   // New: Helper to get dynamic price/symbol (for items and total)
// //   const getDynamicPrice = (price) => {
// //     const converted = parseFloat(currencyCtx.getConvertedPrice(price)); // Convert USD to current currency
// //     const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency); // e.g., ₦ for NGN
// //     return `${symbol}${converted.toLocaleString()}`;
// //   };

// //   // New: Convert total (assumes CartContext total is USD base)
// //   const dynamicTotal = total ? parseFloat(currencyCtx.getConvertedPrice(total)) : 0;
// //   const totalSymbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);

// //   return (
// //     <>
// //       {/* Overlay */}
// //       <div className="cart-overlay" onClick={onClose} aria-hidden="true" />

// //       {/* Sidebar */}
// //       <aside
// //         className="cart-sidebar open"
// //         aria-modal="true"
// //         role="dialog"
// //         aria-label="Shopping cart"
// //         ref={sidebarRef}
// //       >
// //         <header className="cart-sidebar-header">
// //           <h2>Your Cart</h2>
// //           <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
// //             &times;
// //           </button>
// //         </header>

// //         {cartItems.length === 0 ? (
// //           <p className="empty-message">Your cart is empty.</p>
// //         ) : (
// //           <>
// //             <ul className="cart-items-list">
// //               {cartItems.map(({ _id, name, price, quantity, images }, index) => (
// //                 <li key={_id || index} className="cart-item">
// //                   <img
// //                     src={images?.[0] || "/placeholder.jpg"}
// //                     alt={name}
// //                     className="cart-item-image"
// //                     onError={(e) => {
// //                       e.target.src = "/placeholder.jpg";
// //                     }}
// //                   />
// //                   <div className="cart-item-info">
// //                     <h3>{name}</h3>
// //                     {/* New: Dynamic price/symbol for each item */}
// //                     <p>{getDynamicPrice(price)}</p>
// //                     <label>
// //                       Qty:
// //                       <input
// //                         type="number"
// //                         min="1"
// //                         value={quantity}
// //                         onChange={(e) =>
// //                           updateQuantity(_id, parseInt(e.target.value, 10) || 1)
// //                         }
// //                         className="qty-input"
// //                         aria-label={`Quantity for ${name}`}
// //                       />
// //                     </label>
// //                   </div>
// //                   <button
// //                     className="remove-btn"
// //                     onClick={() => removeFromCart(_id)}
// //                     aria-label={`Remove ${name} from cart`}
// //                   >
// //                     &times;
// //                   </button>
// //                 </li>
// //               ))}
// //             </ul>

// //             <footer className="cart-sidebar-footer">
// //               {/* New: Dynamic subtotal/symbol */}
// //               <p className="subtotal">
// //                 Subtotal: <strong>{totalSymbol}{dynamicTotal.toLocaleString()}</strong>
// //               </p>
// //               <div className="cart-sidebar-actions">
// //                 <button onClick={handleContinueShopping} className="btn-continue">
// //                   Continue Shopping
// //                 </button>
// //                 <button onClick={handleCheckout} className="btn-checkout">
// //                   Proceed to Checkout
// //                 </button>
// //               </div>
// //             </footer>
// //           </>
// //         )}
// //       </aside>
// //     </>
// //   );
// // }


// import React, { useContext, useEffect, useRef } from "react";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { useNavigate } from "react-router-dom";
// import "./CartSidebar.css";

// export default function CartSidebar({ isOpen, onClose }) {
//   const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const navigate = useNavigate();
//   const sidebarRef = useRef(null);

//   // Close sidebar on click outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         onClose();
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const handleCheckout = () => {
//     onClose();
//     navigate("/checkout");
//   };

//   const handleContinueShopping = () => {
//     onClose();
//     navigate("/shop");
//   };

//   if (!isOpen) return null;

//   // Loading check for currency
//   if (currencyCtx.isLoading) {
//     return (
//       <aside className="cart-sidebar open">
//         <header className="cart-sidebar-header">
//           <h2>Your Cart</h2>
//           <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
//             &times;
//           </button>
//         </header>
//         <p className="empty-message">Loading cart...</p>
//       </aside>
//     );
//   }

//   // Helper to get dynamic price/symbol (for items only; total uses separate logic)
//   const getDynamicPrice = (price) => {
//     if (!price || isNaN(price)) return `${currencyCtx.getSymbol(currencyCtx.currentCurrency)}0.00`;
    
//     const converted = parseFloat(currencyCtx.getConvertedPrice(price));
//     if (isNaN(converted)) {
//       console.warn(`Conversion failed for price ${price} to ${currencyCtx.currentCurrency}`); // Debug
//       return `${currencyCtx.getSymbol('USD')}${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; // Fallback to USD
//     }
    
//     const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//     return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // Convert total (assumes CartContext total is USD base)
//   const safeTotal = total || 0;
//   const convertedTotal = parseFloat(currencyCtx.getConvertedPrice(safeTotal));
//   const dynamicTotal = isNaN(convertedTotal) ? safeTotal : convertedTotal; // Fallback to USD if conversion fails
//   const totalSymbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);

//   // Optional: Manual total recalc for debugging (uncomment to compare with CartContext.total)
//   // const manualTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
//   // console.log(`CartContext total: ${safeTotal} USD vs Manual: ${manualTotal} USD`); // If mismatch, fix CartContext

//   // Debug logs for footer subtotal (remove in production)
//   console.log(`=== Cart Subtotal Debug ===`);
//   console.log(`CartContext total (USD base): ${safeTotal}`);
//   console.log(`Converted total: ${dynamicTotal} ${currencyCtx.currentCurrency}`);
//   console.log(`Current currency: ${currencyCtx.currentCurrency}, Symbol: ${totalSymbol}`);
//   console.log(`Items:`, cartItems.map(item => ({ name: item.name, priceUSD: item.price, qty: item.quantity, subtotalUSD: item.price * item.quantity })));
//   console.log(`Expected sum of item subtotals (USD): ${cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0)}`);

//   return (
//     <>
//       {/* Overlay */}
//       <div className="cart-overlay" onClick={onClose} aria-hidden="true" />

//       {/* Sidebar */}
//       <aside
//         className="cart-sidebar open"
//         aria-modal="true"
//         role="dialog"
//         aria-label="Shopping cart"
//         ref={sidebarRef}
//       >
//         <header className="cart-sidebar-header">
//           <h2>Your Cart</h2>
//           <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
//             &times;
//           </button>
//         </header>

//         {cartItems.length === 0 ? (
//           <p className="empty-message">Your cart is empty.</p>
//         ) : (
//           <>
//             <ul className="cart-items-list">
//               {cartItems.map(({ _id, name, price, quantity, images }, index) => (
//                 <li key={_id || index} className="cart-item">
//                   <img
//                     src={images?.[0] || "/placeholder.jpg"}
//                     alt={name}
//                     className="cart-item-image"
//                     onError={(e) => {
//                       e.target.src = "/placeholder.jpg";
//                     }}
//                   />
//                   <div className="cart-item-info">
//                     <h3>{name}</h3>
//                     {/* Dynamic price per unit (no subtotal here) */}
//                     <p>{getDynamicPrice(price)}</p>
//                     <label>
//                       Qty:
//                       <input
//                         type="number"
//                         min="1"
//                         value={quantity}
//                         onChange={(e) =>
//                           updateQuantity(_id, parseInt(e.target.value, 10) || 1)
//                         }
//                         className="qty-input"
//                         aria-label={`Quantity for ${name}`}
//                       />
//                     </label>
//                   </div>
//                   <button
//                     className="remove-btn"
//                     onClick={() => removeFromCart(_id)}
//                     aria-label={`Remove ${name} from cart`}
//                   >
//                     &times;
//                   </button>
//                 </li>
//               ))}
//             </ul>

//             <footer className="cart-sidebar-footer">
//               {/* Fixed footer subtotal (with robust conversion and formatting) */}
//               <p className="subtotal">
//                 Subtotal: <strong>
//                   {totalSymbol}
//                   {dynamicTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </strong>
//               </p>
//               <div className="cart-sidebar-actions">
//                 <button onClick={handleContinueShopping} className="btn-continue">
//                   Continue Shopping
//                 </button>
//                 <button onClick={handleCheckout} className="btn-checkout">
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </footer>
//           </>
//         )}
//       </aside>
//     </>
//   );
// }



import React, { useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import "./CartSidebar.css";

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, total } = useContext(CartContext);
  const currencyCtx = useContext(CurrencyContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

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

  if (!isOpen) return null;

  if (currencyCtx.isLoading) {
    return (
      <aside className="cart-sidebar open">
        <header className="cart-sidebar-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart sidebar" className="close-btn">
            &times;
          </button>
        </header>
        <p className="empty-message">Loading cart...</p>
      </aside>
    );
  }

  const getDynamicPrice = (price) => {
    if (!price || isNaN(price)) return `${currencyCtx.getSymbol(currencyCtx.currentCurrency)}0.00`;
    const converted = parseFloat(currencyCtx.getConvertedPrice(price));
    if (isNaN(converted)) {
      return `${currencyCtx.getSymbol('USD')}${parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalSymbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} aria-hidden="true" />
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
              {cartItems.map(({ _id, name, price, quantity, images }, index) => (
                <li key={_id || index} className="cart-item">
                  <img
                    src={images?.[0] || "/placeholder.jpg"}
                    alt={name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="cart-item-info">
                    <h3>{name}</h3>
                    <p>{getDynamicPrice(price)}</p>
                    <label>
                      Qty:
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          updateQuantity(_id, parseInt(e.target.value, 10) || 1)
                        }
                        className="qty-input"
                        aria-label={`Quantity for ${name}`}
                      />
                    </label>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(_id)}
                    aria-label={`Remove ${name} from cart`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>

            <footer className="cart-sidebar-footer">
              <p className="subtotal">
                Subtotal: <strong>
                  {totalSymbol}
                  {total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
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