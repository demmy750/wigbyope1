// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import { cartAPI } from "../api";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import AuthModal from "../components/AuthModal"; // Adjust path if necessary (assuming AuthModal is in ../components/)
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const { cartItems, baseTotal, clearCart } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [cardError, setCardError] = useState("");
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" }); // Added for auth modal
//   const token = localStorage.getItem("token");

//   // Dynamic total and items for display
//   const displayTotal = currencyCtx.isLoading ? baseTotal : parseFloat(currencyCtx.getConvertedPrice(baseTotal));
//   const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//   const convertedItems = cartItems.map(item => ({
//     ...item,
//     displayPrice: parseFloat(currencyCtx.getConvertedPrice(item.price)), // For UI only
//   }));

//   // Country-to-code map (for dropdown value; reverse of CurrencyContext)
//   const currencyToCountryMap = {
//     'USD': 'US',
//     'NGN': 'NG',
//     'GBP': 'GB',
//     'CAD': 'CA',
//     'ZAR': 'ZA',
//     'EUR': 'ES', // Or 'FR' etc.
//   };

//   // Auto-set country on load (from userCountry or currency)
//   useEffect(() => {
//     if (currencyCtx.userCountry) {
//       setFormData(prev => ({ ...prev, country: currencyCtx.userCountry }));
//     } else if (currencyCtx.currentCurrency) {
//       const defaultCountry = currencyToCountryMap[currencyCtx.currentCurrency] || 'US';
//       setFormData(prev => ({ ...prev, country: defaultCountry }));
//     }
//   }, [currencyCtx.userCountry, currencyCtx.currentCurrency]);

//   // Redirect if cart is empty (but not after successful order)
//   useEffect(() => {
//     if (cartItems.length === 0 && message.type !== "success") {
//       navigate("/shop");
//     }
//   }, [cartItems, navigate, message.type]);

//   // 🔎 Enhanced validation (added city, postalCode, country)
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Full name is required.";
//     if (!formData.email.trim()) newErrors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Email is invalid.";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, "")))
//       newErrors.phone = "Phone number must be 10-11 digits.";
//     if (!formData.address.trim()) newErrors.address = "Address is required.";
//     if (!formData.city.trim()) newErrors.city = "City is required.";
//     if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code/ZIP is required.";
//     else if (!/^\d{3,10}$/.test(formData.postalCode.replace(/\D/g, ""))) // Basic ZIP/Postal validation
//       newErrors.postalCode = "Invalid postal code format.";
//     if (!formData.country) newErrors.country = "Country is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // 🟢 Run validation on every input change
//   useEffect(() => {
//     validateForm();
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ text: "", type: "" });
//     setCardError("");

//     if (!validateForm()) {
//       setMessage({ text: "Please fix the errors below.", type: "error" });
//       return;
//     }

//     if (!token) {
//       // Instead of error message, open sign-up modal
//       setAuthModal({ open: true, view: "register" });
//       return;
//     }

//     if (cartItems.length === 0) {
//       setMessage({ text: "Your cart is empty.", type: "error" });
//       return;
//     }

//     // Check Stripe loaded
//     if (!stripe || !elements) {
//       setMessage({ text: "Payment system is not loaded. Please refresh the page.", type: "error" });
//       return;
//     }

//     setLoading(true);

//     try {
//       // ✅ Enhanced orderItems: Include name, qty, image, price, product (matches model)
//       const orderItems = cartItems.map((item) => {
//         const productId = item.id || item._id; // Product ID from cart
//         return {
//           name: item.name, // Required: Product name
//           qty: item.quantity, // Required: Use 'qty' (not 'quantity') for schema
//           image: item.images?.[0] || '/placeholder.jpg', // Required: First image URL
//           price: item.price, // USD base price (for backend validation)
//           product: productId, // ObjectId ref to Product
//         };
//       });

//       // ✅ Enhanced shippingAddress: Include all fields (matches schema)
//       const shippingAddress = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city,
//         postalCode: formData.postalCode,
//         country: formData.country, // e.g., 'NG'
//       };

//       const orderData = {
//         items: orderItems, // Full items array (backend maps to orderItems)
//         shippingAddress, // Send full shippingAddress (includes email/phone for schema/email)
//         totalPrice: displayTotal, // Converted total for payment
//         baseTotalUSD: baseTotal, // USD total for backend validation
//         currency: currencyCtx.currentCurrency, // e.g., 'NGN'
//         paymentMethod: "Stripe", 
//       };

//       console.log("Sending orderData:", orderData); // Debug log

//       // ✅ Call backend to create order (gets clientSecret)
//       const orderResponse = await fetchWithAuth("/orders", { 
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(orderData),
//       });

//       const { _id: orderId, clientSecret } = orderResponse;

//       if (!clientSecret) {
//         throw new Error("Payment session could not be created. Please try again.");
//       }

//       // Confirm payment with Stripe (enhanced billing_details)
//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             address: {
//               line1: formData.address.split('\n')[0] || formData.address, // First line of address
//               city: formData.city, // Now included
//               postal_code: formData.postalCode, // Now included
//               country: formData.country, // Now included (e.g., 'NG')
//             },
//           },
//         },
//       });

//       if (error) {
//         console.error("Stripe error:", error);
//         setCardError(error.message);
//         setMessage({ text: `Payment failed: ${error.message}`, type: "error" });
//         return;
//       }

//       if (paymentIntent.status === 'succeeded') {
//         // Update order payment status on backend
//         await fetchWithAuth(`/orders/${orderId}/pay`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
//         });

//         // Set success message first, then clear cart (prevents empty cart redirect)
//         setMessage({
//           text: "Order placed successfully! Redirecting...",
//           type: "success",
//         });

//         // Optional: Clear backend cart if it exists
//         try {
//           await cartAPI.clearCart();
//         } catch (clearError) {
//           console.warn("Backend cart clear failed (may not exist):", clearError);
//         }

//         clearCart(); // Clear local cart

//         setTimeout(() => {
//           navigate(`/order-success/${orderId}`);
//         }, 1500);
//       } else {
//         throw new Error("Payment was not confirmed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       setMessage({ text: error.message || "Failed to place order. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Only return null if cart empty AND not in success state
//   if (cartItems.length === 0 && message.type !== "success") return null;

//   // Country options for dropdown (expand as needed)
//   const countryOptions = [
//     { value: 'US', label: 'United States' },
//     { value: 'NG', label: 'Nigeria' },
//     { value: 'GB', label: 'United Kingdom' },
//     { value: 'CA', label: 'Canada' },
//     { value: 'ZA', label: 'South Africa' },
//     { value: 'ES', label: 'Spain' },
//     { value: 'FR', label: 'France' },
//     // Add more as needed
//   ];

//   return (
//     <div className="checkout-container" role="main" aria-label="Checkout page">
//       <h1 className="checkout-title">Secure Checkout</h1>
//       <p className="checkout-subtitle">
//         Review your order and complete your purchase.
//       </p>

//       {/* Order Summary - Updated with dynamic currency */}
//       <section className="order-summary" aria-label="Order summary">
//         <h2 className="summary-title">Order Summary</h2>
//         <ul className="items-list" role="list">
//           {convertedItems.map((item) => (
//             <li key={item.id || item._id} className="item-row" role="listitem">
//               <span className="item-name">{item.name}</span>
//               <span className="item-details">
//                 Qty: {item.quantity} × {symbol}{item.displayPrice.toLocaleString()}
//               </span>
//               <span className="item-total">
//                 {symbol}{(item.displayPrice * item.quantity).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//         <div className="total-row">
//           <span className="total-label">Total ({currencyCtx.currentCurrency}):</span>
//           <span className="total-amount">{symbol}{displayTotal.toLocaleString()}</span>
//         </div>
//       </section>

//       {/* Checkout Form - Enhanced with new fields */}
//       <form
//         onSubmit={handleSubmit}
//         className="checkout-form"
//         noValidate
//         aria-label="Billing information"
//       >
//         <fieldset disabled={loading}>
//           <legend className="form-legend">Billing & Shipping Information</legend>

//           {["name", "email", "phone", "address", "city", "postalCode"].map((field) => (
//             <div key={field} className="form-group">
//               <label htmlFor={field} className="form-label">
//                 {field === "name"
//                   ? "Full Name *"
//                   : field === "email"
//                   ? "Email Address *"
//                   : field === "phone"
//                   ? "Phone Number *"
//                   : field === "address"
//                   ? "Delivery Address *"
//                   : field === "city"
//                   ? "City *"
//                   : "Postal Code / ZIP *"}
//               </label>
//               {field === "address" ? (
//                 <textarea
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Enter your full delivery address (street, apt, etc.)"
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               ) : (
//                 <input
//                   id={field}
//                   type={
//                     field === "email"
//                       ? "email"
//                       : field === "phone"
//                       ? "tel"
//                       : field === "postalCode"
//                       ? "text" // Alphanumeric for international
//                       : "text"
//                   }
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   placeholder={
//                     field === "name"
//                       ? "Enter your full name"
//                       : field === "email"
//                       ? "Enter your email address"
//                       : field === "phone"
//                       ? "+234 123 456 7890"
//                       : field === "city"
//                       ? "Enter your city"
//                       : field === "postalCode"
//                       ? "Enter postal code (e.g., 10001 or 23401)"
//                       : "Enter your delivery address"
//                   }
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               )}
//               {errors[field] && (
//                 <span id={`${field}-error`} className="error-message">
//                   {errors[field]}
//                 </span>
//               )}
//             </div>
//           ))}

//           {/* Country Dropdown */}
//           <div className="form-group">
//             <label htmlFor="country" className="form-label">Country *</label>
//             <select
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className={errors.country ? "input-error" : ""}
//               aria-describedby={errors.country ? "country-error" : undefined}
//               aria-invalid={!!errors.country}
//             >
//               <option value="">Select your country</option>
//               {countryOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <span id="country-error" className="error-message">
//                 {errors.country}
//               </span>
//             )}
//           </div>

//           {/* Stripe Card Input */}
//           <div className="form-group">
//             <label htmlFor="card-element" className="form-label">
//               Credit or Debit Card *
//             </label>
//             <small className="helper-text">Enter your card number, expiry (MM/YY format), and CVC. We accept Visa, Mastercard, and more.</small>
//             <div
//               id="card-element"
//               className={`input-field ${cardError ? "input-error" : ""}`}
//             >
//               <CardElement
//                 options={{
//                   hidePostalCode: true,  // No ZIP prompt (handled by form field)
//                   style: {
//                     base: {
//                       fontSize: '16px',
//                       color: '#424770',
//                       lineHeight: '1.4',
//                       '::placeholder': { 
//                         color: '#aab7c4',
//                         fontSize: '16px'
//                       },
//                       padding: '12px',
//                     },
//                     invalid: { 
//                       color: '#9e2146',
//                       iconColor: '#9e2146'
//                     },
//                   },
//                 }}
//               />
//             </div>
//             {cardError && (
//               <span id="card-error" className="error-message">
//                 {cardError}
//               </span>
//             )}
//           </div>
//         </fieldset>

//         <button
//           type="submit"
//           disabled={loading || Object.keys(errors).length > 0 || currencyCtx.isLoading || !stripe}
//           className="submit-button"
//           aria-label={loading ? "Processing order" : `Place order for ${symbol}${displayTotal.toLocaleString()}`}
//         >
//           {loading ? (
//             <>
//               <span className="spinner" aria-hidden="true"></span> {/* Add CSS for spinner if needed */}
//               Processing Order...
//             </>
//           ) : (
//             `Place Order - ${symbol}${displayTotal.toLocaleString()}`
//           )}
//         </button>
//       </form>

//       {message.text && (
//         <div
//           className={`message ${message.type}`}
//           role="alert"
//           aria-live="polite"
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Auth Modal */}

// <AuthModal
//   isOpen={authModal.open}
//   view={authModal.view}
//   onClose={() => setAuthModal({ open: false, view: "register" })}
//   onLoginSuccess={() => {
//     setAuthModal({ open: false, view: "register" });
//     // Dispatch event to update navbar and other components
//     window.dispatchEvent(new Event("authChange"));
//   }}
// />
//     </div>
//   );
// };

// export default CheckoutPage;





// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import { cartAPI } from "../api";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import AuthModal from "../components/AuthModal"; // Adjust path if necessary (assuming AuthModal is in ../components/)
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const { cartItems, baseTotal, clearCart } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "", // Kept for potential future use, but commented out in form
//     postalCode: "",
//     country: "",
//     state: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [cardError, setCardError] = useState("");
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const token = localStorage.getItem("token");

//   // Dynamic total and items for display
//   const displayTotal = currencyCtx.isLoading ? baseTotal : parseFloat(currencyCtx.getConvertedPrice(baseTotal));
//   const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//   const convertedItems = cartItems.map(item => ({
//     ...item,
//     displayPrice: parseFloat(currencyCtx.getConvertedPrice(item.price)),
//   }));

//   // Country-to-code map
//   const currencyToCountryMap = {
//     'USD': 'US',
//     'NGN': 'NG',
//     'GBP': 'GB',
//     'CAD': 'CA',
//     'ZAR': 'ZA',
//     'EUR': 'ES',
//   };

//   // State options based on country
//   const stateOptions = {
//     'US': [
//       { value: 'AL', label: 'Alabama' },
//       { value: 'AK', label: 'Alaska' },
//       { value: 'AZ', label: 'Arizona' },
//       { value: 'AR', label: 'Arkansas' },
//       { value: 'CA', label: 'California' },
//       { value: 'CO', label: 'Colorado' },
//       { value: 'CT', label: 'Connecticut' },
//       { value: 'DE', label: 'Delaware' },
//       { value: 'FL', label: 'Florida' },
//       { value: 'GA', label: 'Georgia' },
//       { value: 'HI', label: 'Hawaii' },
//       { value: 'ID', label: 'Idaho' },
//       { value: 'IL', label: 'Illinois' },
//       { value: 'IN', label: 'Indiana' },
//       { value: 'IA', label: 'Iowa' },
//       { value: 'KS', label: 'Kansas' },
//       { value: 'KY', label: 'Kentucky' },
//       { value: 'LA', label: 'Louisiana' },
//       { value: 'ME', label: 'Maine' },
//       { value: 'MD', label: 'Maryland' },
//       { value: 'MA', label: 'Massachusetts' },
//       { value: 'MI', label: 'Michigan' },
//       { value: 'MN', label: 'Minnesota' },
//       { value: 'MS', label: 'Mississippi' },
//       { value: 'MO', label: 'Missouri' },
//       { value: 'MT', label: 'Montana' },
//       { value: 'NE', label: 'Nebraska' },
//       { value: 'NV', label: 'Nevada' },
//       { value: 'NH', label: 'New Hampshire' },
//       { value: 'NJ', label: 'New Jersey' },
//       { value: 'NM', label: 'New Mexico' },
//       { value: 'NY', label: 'New York' },
//       { value: 'NC', label: 'North Carolina' },
//       { value: 'ND', label: 'North Dakota' },
//       { value: 'OH', label: 'Ohio' },
//       { value: 'OK', label: 'Oklahoma' },
//       { value: 'OR', label: 'Oregon' },
//       { value: 'PA', label: 'Pennsylvania' },
//       { value: 'RI', label: 'Rhode Island' },
//       { value: 'SC', label: 'South Carolina' },
//       { value: 'SD', label: 'South Dakota' },
//       { value: 'TN', label: 'Tennessee' },
//       { value: 'TX', label: 'Texas' },
//       { value: 'UT', label: 'Utah' },
//       { value: 'VT', label: 'Vermont' },
//       { value: 'VA', label: 'Virginia' },
//       { value: 'WA', label: 'Washington' },
//       { value: 'WV', label: 'West Virginia' },
//       { value: 'WI', label: 'Wisconsin' },
//       { value: 'WY', label: 'Wyoming' },
//     ],
//     'NG': [
//       { value: 'AB', label: 'Abia' },
//       { value: 'AD', label: 'Adamawa' },
//       { value: 'AK', label: 'Akwa Ibom' },
//       { value: 'AN', label: 'Anambra' },
//       { value: 'BA', label: 'Bauchi' },
//       { value: 'BY', label: 'Bayelsa' },
//       { value: 'BE', label: 'Benue' },
//       { value: 'BO', label: 'Borno' },
//       { value: 'CR', label: 'Cross River' },
//       { value: 'DE', label: 'Delta' },
//       { value: 'EB', label: 'Ebonyi' },
//       { value: 'ED', label: 'Edo' },
//       { value: 'EK', label: 'Ekiti' },
//       { value: 'EN', label: 'Enugu' },
//       { value: 'FC', label: 'Federal Capital Territory' },
//       { value: 'GO', label: 'Gombe' },
//       { value: 'IM', label: 'Imo' },
//       { value: 'JI', label: 'Jigawa' },
//       { value: 'KD', label: 'Kaduna' },
//       { value: 'KN', label: 'Kano' },
//       { value: 'KT', label: 'Katsina' },
//       { value: 'KE', label: 'Kebbi' },
//       { value: 'KO', label: 'Kogi' },
//       { value: 'KW', label: 'Kwara' },
//       { value: 'LA', label: 'Lagos' },
//       { value: 'NA', label: 'Nasarawa' },
//       { value: 'NI', label: 'Niger' },
//       { value: 'OG', label: 'Ogun' },
//       { value: 'ON', label: 'Ondo' },
//       { value: 'OS', label: 'Osun' },
//       { value: 'OY', label: 'Oyo' },
//       { value: 'PL', label: 'Plateau' },
//       { value: 'RI', label: 'Rivers' },
//       { value: 'SO', label: 'Sokoto' },
//       { value: 'TA', label: 'Taraba' },
//       { value: 'YO', label: 'Yobe' },
//       { value: 'ZA', label: 'Zamfara' },
//     ],
//     'GB': [
//       { value: 'ENG', label: 'England' },
//       { value: 'SCT', label: 'Scotland' },
//       { value: 'WLS', label: 'Wales' },
//       { value: 'NIR', label: 'Northern Ireland' },
//     ],
//     'CA': [
//       { value: 'AB', label: 'Alberta' },
//       { value: 'BC', label: 'British Columbia' },
//       { value: 'MB', label: 'Manitoba' },
//       { value: 'NB', label: 'New Brunswick' },
//       { value: 'NL', label: 'Newfoundland and Labrador' },
//       { value: 'NS', label: 'Nova Scotia' },
//       { value: 'ON', label: 'Ontario' },
//       { value: 'PE', label: 'Prince Edward Island' },
//       { value: 'QC', label: 'Quebec' },
//       { value: 'SK', label: 'Saskatchewan' },
//       { value: 'NT', label: 'Northwest Territories' },
//       { value: 'NU', label: 'Nunavut' },
//       { value: 'YT', label: 'Yukon' },
//     ],
//     'ZA': [
//       { value: 'EC', label: 'Eastern Cape' },
//       { value: 'FS', label: 'Free State' },
//       { value: 'GT', label: 'Gauteng' },
//       { value: 'KZN', label: 'KwaZulu-Natal' },
//       { value: 'LP', label: 'Limpopo' },
//       { value: 'MP', label: 'Mpumalanga' },
//       { value: 'NC', label: 'Northern Cape' },
//       { value: 'NW', label: 'North West' },
//       { value: 'WC', label: 'Western Cape' },
//     ],
//     'ES': [
//       { value: 'AN', label: 'Andalusia' },
//       { value: 'AR', label: 'Aragon' },
//       { value: 'AS', label: 'Asturias' },
//       { value: 'IB', label: 'Balearic Islands' },
//       { value: 'PV', label: 'Basque Country' },
//       { value: 'CN', label: 'Canary Islands' },
//       { value: 'CB', label: 'Cantabria' },
//       { value: 'CL', label: 'Castile and León' },
//       { value: 'CM', label: 'Castile-La Mancha' },
//       { value: 'CT', label: 'Catalonia' },
//       { value: 'CE', label: 'Ceuta' },
//       { value: 'EX', label: 'Extremadura' },
//       { value: 'GA', label: 'Galicia' },
//       { value: 'MD', label: 'Madrid' },
//       { value: 'MC', label: 'Murcia' },
//       { value: 'ML', label: 'Melilla' },
//       { value: 'NC', label: 'Navarre' },
//       { value: 'RI', label: 'La Rioja' },
//       { value: 'VC', label: 'Valencian Community' },
//     ],
//     'FR': [
//       { value: 'ARA', label: 'Auvergne-Rhône-Alpes' },
//       { value: 'BFC', label: 'Bourgogne-Franche-Comté' },
//       { value: 'BRE', label: 'Brittany' },
//       { value: 'CVL', label: 'Centre-Val de Loire' },
//       { value: 'COR', label: 'Corsica' },
//       { value: 'GES', label: 'Grand Est' },
//       { value: 'HDF', label: 'Hauts-de-France' },
//       { value: 'IDF', label: 'Île-de-France' },
//       { value: 'NOR', label: 'Normandy' },
//       { value: 'NAQ', label: 'Nouvelle-Aquitaine' },
//       { value: 'OCC', label: 'Occitanie' },
//       { value: 'PDL', label: 'Pays de la Loire' },
//       { value: 'PAC', label: 'Provence-Alpes-Côte d\'Azur' },
//     ],
//   };

//   // Auto-set country on load
//   useEffect(() => {
//     if (currencyCtx.userCountry) {
//       setFormData(prev => ({ ...prev, country: currencyCtx.userCountry, state: "" }));
//     } else if (currencyCtx.currentCurrency) {
//       const defaultCountry = currencyToCountryMap[currencyCtx.currentCurrency] || 'US';
//       setFormData(prev => ({ ...prev, country: defaultCountry, state: "" }));
//     }
//   }, [currencyCtx.userCountry, currencyCtx.currentCurrency]);

//   // Reset state when country changes
//   useEffect(() => {
//     setFormData(prev => ({ ...prev, state: "" }));
//   }, [formData.country]);

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0 && message.type !== "success") {
//       navigate("/shop");
//     }
//   }, [cartItems, navigate, message.type]);

//   // Validation (city commented out)
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Full name is required.";
//     if (!formData.email.trim()) newErrors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone number must be 10-11 digits.";
//     if (!formData.address.trim()) newErrors.address = "Address is required.";
//     // if (!formData.city.trim()) newErrors.city = "City is required."; // Commented out
//     if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code/ZIP is required.";
//     else if (!/^\d{3,10}$/.test(formData.postalCode.replace(/\D/g, ""))) newErrors.postalCode = "Invalid postal code format.";
//     if (!formData.country) newErrors.country = "Country is required.";
//     if (!formData.state) newErrors.state = "State/Province is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Run validation on input change
//   useEffect(() => {
//     validateForm();
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ text: "", type: "" });
//     setCardError("");

//     if (!validateForm()) {
//       setMessage({ text: "Please fix the errors below.", type: "error" });
//       return;
//     }

//     if (!token) {
//       setAuthModal({ open: true, view: "register" });
//       return;
//     }

//     if (cartItems.length === 0) {
//       setMessage({ text: "Your cart is empty.", type: "error" });
//       return;
//     }

//     if (!stripe || !elements) {
//       setMessage({ text: "Payment system is not loaded. Please refresh the page.", type: "error" });
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderItems = cartItems.map(item => {
//         const productId = item.id || item._id;
//         return {
//           name: item.name,
//           qty: item.quantity,
//           image: item.images?.[0] || '/placeholder.jpg',
//           price: item.price,
//           product: productId,
//         };
//       });

//       const shippingAddress = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city, // Kept, but field commented out
//         postalCode: formData.postalCode,
//         country: formData.country,
//         state: formData.state,
//       };

//       const orderData = {
//         items: orderItems,
//         shippingAddress,
//         totalPrice: displayTotal,
//         baseTotalUSD: baseTotal,
//         currency: currencyCtx.currentCurrency,
//         paymentMethod: "Stripe",
//       };

//       console.log("Sending orderData:", orderData);

//       const orderResponse = await fetchWithAuth("/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const { _id: orderId, clientSecret } = orderResponse;

//       if (!clientSecret) {
//         throw new Error("Payment session could not be created. Please try again.");
//       }

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             address: {
//               line1: formData.address.split('\n')[0] || formData.address,
//               city: formData.city, // Kept
//               postal_code: formData.postalCode,
//               country: formData.country,
//               state: formData.state,
//             },
//           },
//         },
//       });

//       if (error) {
//         console.error("Stripe error:", error);
//         setCardError(error.message);
//         setMessage({ text: `Payment failed: ${error.message}`, type: "error" });
//         return;
//       }

//       if (paymentIntent.status === 'succeeded') {
//         await fetchWithAuth(`/orders/${orderId}/pay`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
//         });

//         setMessage({ text: "Order placed successfully! Redirecting...", type: "success" });

//         try {
//           await cartAPI.clearCart();
//         } catch (clearError) {
//           console.warn("Backend cart clear failed (may not exist):", clearError);
//         }

//         clearCart();

//         setTimeout(() => {
//           navigate(`/order-success/${orderId}`);
//         }, 1500);
//       } else {
//         throw new Error("Payment was not confirmed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       setMessage({ text: error.message || "Failed to place order. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0 && message.type !== "success") return null;

//   const countryOptions = [
//     { value: 'US', label: 'United States' },
//     { value: 'NG', label: 'Nigeria' },
//     { value: 'GB', label: 'United Kingdom' },
//     { value: 'CA', label: 'Canada'},
//         { value: 'ZA', label: 'South Africa' },
//     { value: 'ES', label: 'Spain' },
//     { value: 'FR', label: 'France' },
//     // Add more as needed
//   ];

//   return (
//     <div className="checkout-container" role="main" aria-label="Checkout page">
//       <h1 className="checkout-title">Secure Checkout</h1>
//       <p className="checkout-subtitle">
//         Review your order and complete your purchase.
//       </p>

//       {/* Order Summary - Updated with dynamic currency */}
//       <section className="order-summary" aria-label="Order summary">
//         <h2 className="summary-title">Order Summary</h2>
//         <ul className="items-list" role="list">
//           {convertedItems.map((item) => (
//             <li key={item.id || item._id} className="item-row" role="listitem">
//               <span className="item-name">{item.name}</span>
//               <span className="item-details">
//                 Qty: {item.quantity} × {symbol}{item.displayPrice.toLocaleString()}
//               </span>
//               <span className="item-total">
//                 {symbol}{(item.displayPrice * item.quantity).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//         <div className="total-row">
//           <span className="total-label">Total ({currencyCtx.currentCurrency}):</span>
//           <span className="total-amount">{symbol}{displayTotal.toLocaleString()}</span>
//         </div>
//       </section>

//       {/* Checkout Form - Enhanced with new fields */}
//       <form
//         onSubmit={handleSubmit}
//         className="checkout-form"
//         noValidate
//         aria-label="Billing information"
//       >
//         <fieldset disabled={loading}>
//           <legend className="form-legend">Billing & Shipping Information</legend>

//           {["name", "email", "phone", "address"].map((field) => (
//             <div key={field} className="form-group">
//               <label htmlFor={field} className="form-label">
//                 {field === "name"
//                   ? "Full Name *"
//                   : field === "email"
//                   ? "Email Address *"
//                   : field === "phone"
//                   ? "Phone Number *"
//                   : "Delivery Address *"}
//               </label>
//               {field === "address" ? (
//                 <textarea
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Enter your full delivery address (street, apt, etc.)"
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               ) : (
//                 <input
//                   id={field}
//                   type={
//                     field === "email"
//                       ? "email"
//                       : field === "phone"
//                       ? "tel"
//                       : "text"
//                   }
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   placeholder={
//                     field === "name"
//                       ? "Enter your full name"
//                       : field === "email"
//                       ? "Enter your email address"
//                       : field === "phone"
//                       ? "+234 123 456 7890"
//                       : "Enter your delivery address"
//                   }
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               )}
//               {errors[field] && (
//                 <span id={`${field}-error`} className="error-message">
//                   {errors[field]}
//                 </span>
//               )}
//             </div>
//           ))}

//           {/* Country Dropdown */}
//           <div className="form-group">
//             <label htmlFor="country" className="form-label">Country *</label>
//             <select
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className={errors.country ? "input-error" : ""}
//               aria-describedby={errors.country ? "country-error" : undefined}
//               aria-invalid={!!errors.country}
//             >
//               <option value="">Select your country</option>
//               {countryOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <span id="country-error" className="error-message">
//                 {errors.country}
//               </span>
//             )}
//           </div>

//           {/* State Dropdown - Only show if country is selected */}
//           {formData.country && (
//             <div className="form-group">
//               <label htmlFor="state" className="form-label">State/Province *</label>
//               <select
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={errors.state ? "input-error" : ""}
//                 aria-describedby={errors.state ? "state-error" : undefined}
//                 aria-invalid={!!errors.state}
//               >
//                 <option value="">Select your state/province</option>
//                 {(stateOptions[formData.country] || []).map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.state && (
//                 <span id="state-error" className="error-message">
//                   {errors.state}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Postal Code / ZIP - Below State */}
//           <div className="form-group">
//             <label htmlFor="postalCode" className="form-label">Postal Code / ZIP *</label>
//             <input
//               id="postalCode"
//               type="text"
//               name="postalCode"
//               value={formData.postalCode}
//               onChange={handleChange}
//               placeholder="Enter postal code (e.g., 10001 or 23401)"
//               className={errors.postalCode ? "input-error" : ""}
//               aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
//               aria-invalid={!!errors.postalCode}
//             />
//             {errors.postalCode && (
//               <span id="postalCode-error" className="error-message">
//                 {errors.postalCode}
//               </span>
//             )}
//           </div>

//           {/* Stripe Card Input */}
//           <div className="form-group">
//             <label htmlFor="card-element" className="form-label">
//               Credit or Debit Card *
//             </label>
//             <small className="helper-text">Enter your card number, expiry (MM/YY format), and CVC. We accept Visa, Mastercard, and more.</small>
//             <div
//               id="card-element"
//               className={`input-field ${cardError ? "input-error" : ""}`}
//             >
//               <CardElement
//                 options={{
//                   hidePostalCode: true,
//                   style: {
//                     base: {
//                       fontSize: '16px',
//                       color: '#424770',
//                       lineHeight: '1.4',
//                       '::placeholder': {
//                         color: '#aab7c4',
//                         fontSize: '16px'
//                       },
//                       padding: '12px',
//                     },
//                     invalid: {
//                       color: '#9e2146',
//                       iconColor: '#9e2146'
//                     },
//                   },
//                 }}
//               />
//             </div>
//             {cardError && (
//               <span id="card-error" className="error-message">
//                 {cardError}
//               </span>
//             )}
//           </div>
//         </fieldset>

//         <button
//           type="submit"
//           disabled={loading || Object.keys(errors).length > 0 || currencyCtx.isLoading || !stripe}
//           className="submit-button"
//           aria-label={loading ? "Processing order" : `Place order for ${symbol}${displayTotal.toLocaleString()}`}
//         >
//           {loading ? (
//             <>
//               <span className="spinner" aria-hidden="true"></span>
//               Processing Order...
//             </>
//           ) : (
//             `Place Order - ${symbol}${displayTotal.toLocaleString()}`
//           )}
//         </button>
//       </form>

//       {message.text && (
//         <div
//           className={`message ${message.type}`}
//           role="alert"
//           aria-live="polite"
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={() => setAuthModal({ open: false, view: "register" })}
//         onLoginSuccess={() => {
//           setAuthModal({ open: false, view: "register" });
//           window.dispatchEvent(new Event("authChange"));
//         }}
//       />
//     </div>
//   );
// };

// export default CheckoutPage; 












// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import { cartAPI } from "../api";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import AuthModal from "../components/AuthModal"; // Adjust path if necessary (assuming AuthModal is in ../components/)
// import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'; // New import for phone formatting
// import 'react-phone-number-input/style.css'; 
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const { cartItems, baseTotal, clearCart } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "", // Kept for potential future use, but commented out in form
//     postalCode: "",
//     country: "",
//     state: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [cardError, setCardError] = useState("");
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const token = localStorage.getItem("token");

//   // Dynamic total and items for display
//   const displayTotal = currencyCtx.isLoading ? baseTotal : parseFloat(currencyCtx.getConvertedPrice(baseTotal));
//   const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//   const convertedItems = cartItems.map(item => ({
//     ...item,
//     displayPrice: parseFloat(currencyCtx.getConvertedPrice(item.price)),
//   }));

//   // Country-to-code map
//   const currencyToCountryMap = {
//     'USD': 'US',
//     'NGN': 'NG',
//     'GBP': 'GB',
//     'CAD': 'CA',
//     'ZAR': 'ZA',
//     'EUR': 'ES',
//   };

//   // State options based on country
//   const stateOptions = {
//     'US': [
//       { value: 'AL', label: 'Alabama' },
//       { value: 'AK', label: 'Alaska' },
//       { value: 'AZ', label: 'Arizona' },
//       { value: 'AR', label: 'Arkansas' },
//       { value: 'CA', label: 'California' },
//       { value: 'CO', label: 'Colorado' },
//       { value: 'CT', label: 'Connecticut' },
//       { value: 'DE', label: 'Delaware' },
//       { value: 'FL', label: 'Florida' },
//       { value: 'GA', label: 'Georgia' },
//       { value: 'HI', label: 'Hawaii' },
//       { value: 'ID', label: 'Idaho' },
//       { value: 'IL', label: 'Illinois' },
//       { value: 'IN', label: 'Indiana' },
//       { value: 'IA', label: 'Iowa' },
//       { value: 'KS', label: 'Kansas' },
//       { value: 'KY', label: 'Kentucky' },
//       { value: 'LA', label: 'Louisiana' },
//       { value: 'ME', label: 'Maine' },
//       { value: 'MD', label: 'Maryland' },
//       { value: 'MA', label: 'Massachusetts' },
//       { value: 'MI', label: 'Michigan' },
//       { value: 'MN', label: 'Minnesota' },
//       { value: 'MS', label: 'Mississippi' },
//       { value: 'MO', label: 'Missouri' },
//       { value: 'MT', label: 'Montana' },
//       { value: 'NE', label: 'Nebraska' },
//       { value: 'NV', label: 'Nevada' },
//       { value: 'NH', label: 'New Hampshire' },
//       { value: 'NJ', label: 'New Jersey' },
//       { value: 'NM', label: 'New Mexico' },
//       { value: 'NY', label: 'New York' },
//       { value: 'NC', label: 'North Carolina' },
//       { value: 'ND', label: 'North Dakota' },
//       { value: 'OH', label: 'Ohio' },
//       { value: 'OK', label: 'Oklahoma' },
//       { value: 'OR', label: 'Oregon' },
//       { value: 'PA', label: 'Pennsylvania' },
//       { value: 'RI', label: 'Rhode Island' },
//       { value: 'SC', label: 'South Carolina' },
//       { value: 'SD', label: 'South Dakota' },
//       { value: 'TN', label: 'Tennessee' },
//       { value: 'TX', label: 'Texas' },
//       { value: 'UT', label: 'Utah' },
//       { value: 'VT', label: 'Vermont' },
//       { value: 'VA', label: 'Virginia' },
//       { value: 'WA', label: 'Washington' },
//       { value: 'WV', label: 'West Virginia' },
//       { value: 'WI', label: 'Wisconsin' },
//       { value: 'WY', label: 'Wyoming' },
//     ],
//     'NG': [
//       { value: 'AB', label: 'Abia' },
//       { value: 'AD', label: 'Adamawa' },
//       { value: 'AK', label: 'Akwa Ibom' },
//       { value: 'AN', label: 'Anambra' },
//       { value: 'BA', label: 'Bauchi' },
//       { value: 'BY', label: 'Bayelsa' },
//       { value: 'BE', label: 'Benue' },
//       { value: 'BO', label: 'Borno' },
//       { value: 'CR', label: 'Cross River' },
//       { value: 'DE', label: 'Delta' },
//       { value: 'EB', label: 'Ebonyi' },
//       { value: 'ED', label: 'Edo' },
//       { value: 'EK', label: 'Ekiti' },
//       { value: 'EN', label: 'Enugu' },
//       { value: 'FC', label: 'Federal Capital Territory' },
//       { value: 'GO', label: 'Gombe' },
//       { value: 'IM', label: 'Imo' },
//       { value: 'JI', label: 'Jigawa' },
//       { value: 'KD', label: 'Kaduna' },
//       { value: 'KN', label: 'Kano' },
//       { value: 'KT', label: 'Katsina' },
//       { value: 'KE', label: 'Kebbi' },
//       { value: 'KO', label: 'Kogi' },
//       { value: 'KW', label: 'Kwara' },
//       { value: 'LA', label: 'Lagos' },
//       { value: 'NA', label: 'Nasarawa' },
//       { value: 'NI', label: 'Niger' },
//       { value: 'OG', label: 'Ogun' },
//       { value: 'ON', label: 'Ondo' },
//       { value: 'OS', label: 'Osun' },
//       { value: 'OY', label: 'Oyo' },
//       { value: 'PL', label: 'Plateau' },
//       { value: 'RI', label: 'Rivers' },
//       { value: 'SO', label: 'Sokoto' },
//       { value: 'TA', label: 'Taraba' },
//       { value: 'YO', label: 'Yobe' },
//       { value: 'ZA', label: 'Zamfara' },
//     ],
//     'GB': [
//       { value: 'ENG', label: 'England' },
//       { value: 'SCT', label: 'Scotland' },
//       { value: 'WLS', label: 'Wales' },
//       { value: 'NIR', label: 'Northern Ireland' },
//     ],
//     'CA': [
//       { value: 'AB', label: 'Alberta' },
//       { value: 'BC', label: 'British Columbia' },
//       { value: 'MB', label: 'Manitoba' },
//       { value: 'NB', label: 'New Brunswick' },
//       { value: 'NL', label: 'Newfoundland and Labrador' },
//       { value: 'NS', label: 'Nova Scotia' },
//       { value: 'ON', label: 'Ontario' },
//       { value: 'PE', label: 'Prince Edward Island' },
//       { value: 'QC', label: 'Quebec' },
//       { value: 'SK', label: 'Saskatchewan' },
//       { value: 'NT', label: 'Northwest Territories' },
//       { value: 'NU', label: 'Nunavut' },
//       { value: 'YT', label: 'Yukon' },
//     ],
//     'ZA': [
//       { value: 'EC', label: 'Eastern Cape' },
//       { value: 'FS', label: 'Free State' },
//       { value: 'GT', label: 'Gauteng' },
//       { value: 'KZN', label: 'KwaZulu-Natal' },
//       { value: 'LP', label: 'Limpopo' },
//       { value: 'MP', label: 'Mpumalanga' },
//       { value: 'NC', label: 'Northern Cape' },
//       { value: 'NW', label: 'North West' },
//       { value: 'WC', label: 'Western Cape' },
//     ],
//     'ES': [
//       { value: 'AN', label: 'Andalusia' },
//       { value: 'AR', label: 'Aragon' },
//       { value: 'AS', label: 'Asturias' },
//       { value: 'IB', label: 'Balearic Islands' },
//       { value: 'PV', label: 'Basque Country' },
//       { value: 'CN', label: 'Canary Islands' },
//       { value: 'CB', label: 'Cantabria' },
//       { value: 'CL', label: 'Castile and León' },
//       { value: 'CM', label: 'Castile-La Mancha' },
//       { value: 'CT', label: 'Catalonia' },
//       { value: 'CE', label: 'Ceuta' },
//       { value: 'EX', label: 'Extremadura' },
//       { value: 'GA', label: 'Galicia' },
//       { value: 'MD', label: 'Madrid' },
//       { value: 'MC', label: 'Murcia' },
//       { value: 'ML', label: 'Melilla' },
//       { value: 'NC', label: 'Navarre' },
//       { value: 'RI', label: 'La Rioja' },
//       { value: 'VC', label: 'Valencian Community' },
//     ],
//     'FR': [
//       { value: 'ARA', label: 'Auvergne-Rhône-Alpes' },
//       { value: 'BFC', label: 'Bourgogne-Franche-Comté' },
//       { value: 'BRE', label: 'Brittany' },
//       { value: 'CVL', label: 'Centre-Val de Loire' },
//       { value: 'COR', label: 'Corsica' },
//       { value: 'GES', label: 'Grand Est' },
//       { value: 'HDF', label: 'Hauts-de-France' },
//       { value: 'IDF', label: 'Île-de-France' },
//       { value: 'NOR', label: 'Normandy' },
//       { value: 'NAQ', label: 'Nouvelle-Aquitaine' },
//       { value: 'OCC', label: 'Occitanie' },
//       { value: 'PDL', label: 'Pays de la Loire' },
//       { value: 'PAC', label: 'Provence-Alpes-Côte d\'Azur' },
//     ],
//   };

//   // Auto-set country on load
//   useEffect(() => {
//     if (currencyCtx.userCountry) {
//       setFormData(prev => ({ ...prev, country: currencyCtx.userCountry, state: "" }));
//     } else if (currencyCtx.currentCurrency) {
//       const defaultCountry = currencyToCountryMap[currencyCtx.currentCurrency] || 'US';
//       setFormData(prev => ({ ...prev, country: defaultCountry, state: "" }));
//     }
//   }, [currencyCtx.userCountry, currencyCtx.currentCurrency]);

//   // Reset state when country changes
//   useEffect(() => {
//     setFormData(prev => ({ ...prev, state: "" }));
//   }, [formData.country]);

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0 && message.type !== "success") {
//       navigate("/shop");
//     }
//   }, [cartItems, navigate, message.type]);

//   // Validation (city commented out)
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Full name is required.";
//     if (!formData.email.trim()) newErrors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     else if (!isValidPhoneNumber(formData.phone)) newErrors.phone = "Phone number is invalid for the selected country."; // Updated validation
//     if (!formData.address.trim()) newErrors.address = "Address is required.";
//     // if (!formData.city.trim()) newErrors.city = "City is required."; // Commented out
//     if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code/ZIP is required.";
//     else if (!/^\d{3,10}$/.test(formData.postalCode.replace(/\D/g, ""))) newErrors.postalCode = "Invalid postal code format.";
//     if (!formData.country) newErrors.country = "Country is required.";
//     if (!formData.state) newErrors.state = "State/Province is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Run validation on input change
//   useEffect(() => {
//     validateForm();
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ text: "", type: "" });
//     setCardError("");

//     if (!validateForm()) {
//       setMessage({ text: "Please fix the errors below.", type: "error" });
//       return;
//     }

//     if (!token) {
//       setAuthModal({ open: true, view: "register" });
//       return;
//     }

//     if (cartItems.length === 0) {
//       setMessage({ text: "Your cart is empty.", type: "error" });
//       return;
//     }

//     if (!stripe || !elements) {
//       setMessage({ text: "Payment system is not loaded. Please refresh the page.", type: "error" });
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderItems = cartItems.map(item => {
//         const productId = item.id || item._id;
//         return {
//           name: item.name,
//           qty: item.quantity,
//           image: item.images?.[0] || '/placeholder.jpg',
//           price: item.price,
//           product: productId,
//         };
//       });

//       const shippingAddress = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city, // Kept, but field commented out
//         postalCode: formData.postalCode,
//         country: formData.country,
//         state: formData.state,
//       };
//             const orderData = {
//         items: orderItems,
//         shippingAddress,
//         totalPrice: displayTotal,
//         baseTotalUSD: baseTotal,
//         currency: currencyCtx.currentCurrency,
//         paymentMethod: "Stripe",
//       };

//       console.log("Sending orderData:", orderData);

//       const orderResponse = await fetchWithAuth("/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const { _id: orderId, clientSecret } = orderResponse;

//       if (!clientSecret) {
//         throw new Error("Payment session could not be created. Please try again.");
//       }

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             address: {
//               line1: formData.address.split('\n')[0] || formData.address,
//               city: formData.city, // Kept
//               postal_code: formData.postalCode,
//               country: formData.country,
//               state: formData.state,
//             },
//           },
//         },
//       });

//       if (error) {
//         console.error("Stripe error:", error);
//         setCardError(error.message);
//         setMessage({ text: `Payment failed: ${error.message}`, type: "error" });
//         return;
//       }

//       if (paymentIntent.status === 'succeeded') {
//         await fetchWithAuth(`/orders/${orderId}/pay`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
//         });

//         setMessage({ text: "Order placed successfully! Redirecting...", type: "success" });

//         try {
//           await cartAPI.clearCart();
//         } catch (clearError) {
//           console.warn("Backend cart clear failed (may not exist):", clearError);
//         }

//         clearCart();

//         setTimeout(() => {
//           navigate(`/order-success/${orderId}`);
//         }, 1500);
//       } else {
//         throw new Error("Payment was not confirmed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       setMessage({ text: error.message || "Failed to place order. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0 && message.type !== "success") return null;

//   const countryOptions = [
//     { value: 'US', label: 'United States' },
//     { value: 'NG', label: 'Nigeria' },
//     { value: 'GB', label: 'United Kingdom' },
//     { value: 'CA', label: 'Canada'},
//         { value: 'ZA', label: 'South Africa' },
//     { value: 'ES', label: 'Spain' },
//     { value: 'FR', label: 'France' },
//     // Add more as needed
//   ];

//   return (
//     <div className="checkout-container" role="main" aria-label="Checkout page">
//       <h1 className="checkout-title">Secure Checkout</h1>
//       <p className="checkout-subtitle">
//         Review your order and complete your purchase.
//       </p>

//       {/* Order Summary - Updated with dynamic currency */}
//       <section className="order-summary" aria-label="Order summary">
//         <h2 className="summary-title">Order Summary</h2>
//         <ul className="items-list" role="list">
//           {convertedItems.map((item) => (
//             <li key={item.id || item._id} className="item-row" role="listitem">
//               <span className="item-name">{item.name}</span>
//               <span className="item-details">
//                 Qty: {item.quantity} × {symbol}{item.displayPrice.toLocaleString()}
//               </span>
//               <span className="item-total">
//                 {symbol}{(item.displayPrice * item.quantity).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//         <div className="total-row">
//           <span className="total-label">Total ({currencyCtx.currentCurrency}):</span>
//           <span className="total-amount">{symbol}{displayTotal.toLocaleString()}</span>
//         </div>
//       </section>

//       {/* Checkout Form - Enhanced with new fields */}
//       <form
//         onSubmit={handleSubmit}
//         className="checkout-form"
//         noValidate
//         aria-label="Billing information"
//       >
//         <fieldset disabled={loading}>
//           <legend className="form-legend">Billing & Shipping Information</legend>

//           {["name", "email", "phone", "address"].map((field) => (
//             <div key={field} className="form-group">
//               <label htmlFor={field} className="form-label">
//                 {field === "name"
//                   ? "Full Name *"
//                   : field === "email"
//                   ? "Email Address *"
//                   : field === "phone"
//                   ? "Phone Number *"
//                   : "Delivery Address *"}
//               </label>
//               {field === "address" ? (
//                 <textarea
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Enter your full delivery address (street, apt, etc.)"
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               ) : field === "phone" ? (
//                 <PhoneInput
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={(value) => setFormData(prev => ({ ...prev, phone: value || "" }))}
//                   country={formData.country || 'US'} // Default to US if no country selected
//                   placeholder="Enter your phone number"
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               ) : (
//                 <input
//                   id={field}
//                   type={
//                     field === "email"
//                       ? "email"
//                       : field === "phone"
//                       ? "tel"
//                       : "text"
//                   }
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   placeholder={
//                     field === "name"
//                       ? "Enter your full name"
//                       : field === "email"
//                       ? "Enter your email address"
//                       : field === "phone"
//                       ? "+234 123 456 7890"
//                       : "Enter your delivery address"
//                   }
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               )}
//               {errors[field] && (
//                 <span id={`${field}-error`} className="error-message">
//                   {errors[field]}
//                 </span>
//               )}
//             </div>
//           ))}

//           {/* Country Dropdown */}
//           <div className="form-group">
//             <label htmlFor="country" className="form-label">Country *</label>
//             <select
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className={errors.country ? "input-error" : ""}
//               aria-describedby={errors.country ? "country-error" : undefined}
//               aria-invalid={!!errors.country}
//             >
//               <option value="">Select your country</option>
//               {countryOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <span id="country-error" className="error-message">
//                 {errors.country}
//               </span>
//             )}
//           </div>

//           {/* State Dropdown - Only show if country is selected */}
//           {formData.country && (
//             <div className="form-group">
//               <label htmlFor="state" className="form-label">State/Province *</label>
//               <select
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={errors.state ? "input-error" : ""}
//                 aria-describedby={errors.state ? "state-error" : undefined}
//                 aria-invalid={!!errors.state}
//               >
//                 <option value="">Select your state/province</option>
//                 {(stateOptions[formData.country] || []).map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.state && (
//                 <span id="state-error" className="error-message">
//                   {errors.state}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Postal Code / ZIP - Below State */}
//           <div className="form-group">
//             <label htmlFor="postalCode" className="form-label">Postal Code / ZIP *</label>
//             <input
//               id="postalCode"
//               type="text"
//               name="postalCode"
//               value={formData.postalCode}
//               onChange={handleChange}
//               placeholder="Enter postal code (e.g., 10001 or 23401)"
//               className={errors.postalCode ? "input-error" : ""}
//               aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
//               aria-invalid={!!errors.postalCode}
//             />
//             {errors.postalCode && (
//               <span id="postalCode-error" className="error-message">
//                 {errors.postalCode}
//               </span>
//             )}
//           </div>

//           {/* Stripe Card Input */}
//           <div className="form-group">
//             <label htmlFor="card-element" className="form-label">
//               Credit or Debit Card *
//             </label>
//             <small className="helper-text">Enter your card number, expiry (MM/YY format), and CVC. We accept Visa, Mastercard, and more.</small>
//             <div
//               id="card-element"
//               className={`input-field ${cardError ? "input-error" : ""}`}
//             >
//               <CardElement
//                 options={{
//                   hidePostalCode: true,
//                   style: {
//                     base: {
//                       fontSize: '16px',
//                       color: '#424770',
//                       lineHeight: '1.4',
//                       '::placeholder': {
//                         color: '#aab7c4',
//                         fontSize: '16px'
//                       },
//                       padding: '12px',
//                     },
//                     invalid: {
//                       color: '#9e2146',
//                       iconColor: '#9e2146'
//                     },
//                   },
//                 }}
//               />
//             </div>
//             {cardError && (
//               <span id="card-error" className="error-message">
//                 {cardError}
//               </span>
//             )}
//           </div>
//         </fieldset>

//         <button
//           type="submit"
//           disabled={loading || Object.keys(errors).length > 0 || currencyCtx.isLoading || !stripe}
//           className="submit-button"
//           aria-label={loading ? "Processing order" : `Place order for ${symbol}${displayTotal.toLocaleString()}`}
//         >
//           {loading ? (
//             <>
//               <span className="spinner" aria-hidden="true"></span>
//               Processing Order...
//             </>
//           ) : (
//             `Place Order - ${symbol}${displayTotal.toLocaleString()}`
//           )}
//         </button>
//       </form>

//       {message.text && (
//         <div
//           className={`message ${message.type}`}
//           role="alert"
//           aria-live="polite"
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={() => setAuthModal({ open: false, view: "register" })}
//         onLoginSuccess={() => {
//           setAuthModal({ open: false, view: "register" });
//           window.dispatchEvent(new Event("authChange"));
//         }}
//       />
//     </div>
//   );
// };

// export default CheckoutPage;







// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { CurrencyContext } from "../context/CurrencyContext";
// import { useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import { cartAPI } from "../api";
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import AuthModal from "../components/AuthModal"; // Adjust path if necessary (assuming AuthModal is in ../components/)
// // import { isValidPhoneNumber } from 'libphonenumber-js'; 
// import "./CheckoutPage.css";

// const CheckoutPage = () => {
//   const { cartItems, baseTotal, clearCart } = useContext(CartContext);
//   const currencyCtx = useContext(CurrencyContext);
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "", // Kept for potential future use, but commented out in form
//     postalCode: "",
//     country: "",
//     state: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [cardError, setCardError] = useState("");
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const token = localStorage.getItem("token");

//   // Dynamic total and items for display
//   const displayTotal = currencyCtx.isLoading ? baseTotal : parseFloat(currencyCtx.getConvertedPrice(baseTotal));
//   const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
//   const convertedItems = cartItems.map(item => ({
//     ...item,
//     displayPrice: parseFloat(currencyCtx.getConvertedPrice(item.price)),
//   }));

//   // Country-to-code map
//   const currencyToCountryMap = {
//     'USD': 'US',
//     'NGN': 'NG',
//     'GBP': 'GB',
//     'CAD': 'CA',
//     'ZAR': 'ZA',
//     'EUR': 'ES',
//   };

//   // State options based on country
//   const stateOptions = {
//     'US': [
//       { value: 'AL', label: 'Alabama' },
//       { value: 'AK', label: 'Alaska' },
//       { value: 'AZ', label: 'Arizona' },
//       { value: 'AR', label: 'Arkansas' },
//       { value: 'CA', label: 'California' },
//       { value: 'CO', label: 'Colorado' },
//       { value: 'CT', label: 'Connecticut' },
//       { value: 'DE', label: 'Delaware' },
//       { value: 'FL', label: 'Florida' },
//       { value: 'GA', label: 'Georgia' },
//       { value: 'HI', label: 'Hawaii' },
//       { value: 'ID', label: 'Idaho' },
//       { value: 'IL', label: 'Illinois' },
//       { value: 'IN', label: 'Indiana' },
//       { value: 'IA', label: 'Iowa' },
//       { value: 'KS', label: 'Kansas' },
//       { value: 'KY', label: 'Kentucky' },
//       { value: 'LA', label: 'Louisiana' },
//       { value: 'ME', label: 'Maine' },
//       { value: 'MD', label: 'Maryland' },
//       { value: 'MA', label: 'Massachusetts' },
//       { value: 'MI', label: 'Michigan' },
//       { value: 'MN', label: 'Minnesota' },
//       { value: 'MS', label: 'Mississippi' },
//       { value: 'MO', label: 'Missouri' },
//       { value: 'MT', label: 'Montana' },
//       { value: 'NE', label: 'Nebraska' },
//       { value: 'NV', label: 'Nevada' },
//       { value: 'NH', label: 'New Hampshire' },
//       { value: 'NJ', label: 'New Jersey' },
//       { value: 'NM', label: 'New Mexico' },
//       { value: 'NY', label: 'New York' },
//       { value: 'NC', label: 'North Carolina' },
//       { value: 'ND', label: 'North Dakota' },
//       { value: 'OH', label: 'Ohio' },
//       { value: 'OK', label: 'Oklahoma' },
//       { value: 'OR', label: 'Oregon' },
//       { value: 'PA', label: 'Pennsylvania' },
//       { value: 'RI', label: 'Rhode Island' },
//       { value: 'SC', label: 'South Carolina' },
//       { value: 'SD', label: 'South Dakota' },
//       { value: 'TN', label: 'Tennessee' },
//       { value: 'TX', label: 'Texas' },
//       { value: 'UT', label: 'Utah' },
//       { value: 'VT', label: 'Vermont' },
//       { value: 'VA', label: 'Virginia' },
//       { value: 'WA', label: 'Washington' },
//       { value: 'WV', label: 'West Virginia' },
//       { value: 'WI', label: 'Wisconsin' },
//       { value: 'WY', label: 'Wyoming' },
//     ],
//     'NG': [
//       { value: 'AB', label: 'Abia' },
//       { value: 'AD', label: 'Adamawa' },
//       { value: 'AK', label: 'Akwa Ibom' },
//       { value: 'AN', label: 'Anambra' },
//       { value: 'BA', label: 'Bauchi' },
//       { value: 'BY', label: 'Bayelsa' },
//       { value: 'BE', label: 'Benue' },
//       { value: 'BO', label: 'Borno' },
//       { value: 'CR', label: 'Cross River' },
//       { value: 'DE', label: 'Delta' },
//       { value: 'EB', label: 'Ebonyi' },
//       { value: 'ED', label: 'Edo' },
//       { value: 'EK', label: 'Ekiti' },
//       { value: 'EN', label: 'Enugu' },
//       { value: 'FC', label: 'Federal Capital Territory' },
//       { value: 'GO', label: 'Gombe' },
//       { value: 'IM', label: 'Imo' },
//       { value: 'JI', label: 'Jigawa' },
//       { value: 'KD', label: 'Kaduna' },
//       { value: 'KN', label: 'Kano' },
//       { value: 'KT', label: 'Katsina' },
//       { value: 'KE', label: 'Kebbi' },
//       { value: 'KO', label: 'Kogi' },
//       { value: 'KW', label: 'Kwara' },
//       { value: 'LA', label: 'Lagos' },
//       { value: 'NA', label: 'Nasarawa' },
//       { value: 'NI', label: 'Niger' },
//       { value: 'OG', label: 'Ogun' },
//       { value: 'ON', label: 'Ondo' },
//       { value: 'OS', label: 'Osun' },
//       { value: 'OY', label: 'Oyo' },
//       { value: 'PL', label: 'Plateau' },
//       { value: 'RI', label: 'Rivers' },
//       { value: 'SO', label: 'Sokoto' },
//       { value: 'TA', label: 'Taraba' },
//       { value: 'YO', label: 'Yobe' },
//       { value: 'ZA', label: 'Zamfara' },
//     ],
//     'GB': [
//       { value: 'ENG', label: 'England' },
//       { value: 'SCT', label: 'Scotland' },
//       { value: 'WLS', label: 'Wales' },
//       { value: 'NIR', label: 'Northern Ireland' },
//     ],
//     'CA': [
//       { value: 'AB', label: 'Alberta' },
//       { value: 'BC', label: 'British Columbia' },
//       { value: 'MB', label: 'Manitoba' },
//       { value: 'NB', label: 'New Brunswick' },
//       { value: 'NL', label: 'Newfoundland and Labrador' },
//       { value: 'NS', label: 'Nova Scotia' },
//       { value: 'ON', label: 'Ontario' },
//       { value: 'PE', label: 'Prince Edward Island' },
//       { value: 'QC', label: 'Quebec' },
//       { value: 'SK', label: 'Saskatchewan' },
//       { value: 'NT', label: 'Northwest Territories' },
//       { value: 'NU', label: 'Nunavut' },
//       { value: 'YT', label: 'Yukon' },
//     ],
//     'ZA': [
//       { value: 'EC', label: 'Eastern Cape' },
//       { value: 'FS', label: 'Free State' },
//       { value: 'GT', label: 'Gauteng' },
//       { value: 'KZN', label: 'KwaZulu-Natal' },
//       { value: 'LP', label: 'Limpopo' },
//       { value: 'MP', label: 'Mpumalanga' },
//       { value: 'NC', label: 'Northern Cape' },
//       { value: 'NW', label: 'North West' },
//       { value: 'WC', label: 'Western Cape' },
//     ],
//     'ES': [
//       { value: 'AN', label: 'Andalusia' },
//       { value: 'AR', label: 'Aragon' },
//       { value: 'AS', label: 'Asturias' },
//       { value: 'IB', label: 'Balearic Islands' },
//       { value: 'PV', label: 'Basque Country' },
//       { value: 'CN', label: 'Canary Islands' },
//       { value: 'CB', label: 'Cantabria' },
//       { value: 'CL', label: 'Castile and León' },
//       { value: 'CM', label: 'Castile-La Mancha' },
//       { value: 'CT', label: 'Catalonia' },
//       { value: 'CE', label: 'Ceuta' },
//       { value: 'EX', label: 'Extremadura' },
//       { value: 'GA', label: 'Galicia' },
//       { value: 'MD', label: 'Madrid' },
//       { value: 'MC', label: 'Murcia' },
//       { value: 'ML', label: 'Melilla' },
//       { value: 'NC', label: 'Navarre' },
//       { value: 'RI', label: 'La Rioja' },
//       { value: 'VC', label: 'Valencian Community' },
//     ],
//     'FR': [
//       { value: 'ARA', label: 'Auvergne-Rhône-Alpes' },
//       { value: 'BFC', label: 'Bourgogne-Franche-Comté' },
//       { value: 'BRE', label: 'Brittany' },
//       { value: 'CVL', label: 'Centre-Val de Loire' },
//       { value: 'COR', label: 'Corsica' },
//       { value: 'GES', label: 'Grand Est' },
//       { value: 'HDF', label: 'Hauts-de-France' },
//       { value: 'IDF', label: 'Île-de-France' },
//       { value: 'NOR', label: 'Normandy' },
//       { value: 'NAQ', label: 'Nouvelle-Aquitaine' },
//       { value: 'OCC', label: 'Occitanie' },
//       { value: 'PDL', label: 'Pays de la Loire' },
//       { value: 'PAC', label: 'Provence-Alpes-Côte d\'Azur' },
//     ],
//   };

//   // Auto-set country on load
//   useEffect(() => {
//     if (currencyCtx.userCountry) {
//       setFormData(prev => ({ ...prev, country: currencyCtx.userCountry, state: "" }));
//     } else if (currencyCtx.currentCurrency) {
//       const defaultCountry = currencyToCountryMap[currencyCtx.currentCurrency] || 'US';
//       setFormData(prev => ({ ...prev, country: defaultCountry, state: "" }));
//     }
//   }, [currencyCtx.userCountry, currencyCtx.currentCurrency]);

//   // Reset state when country changes
//   useEffect(() => {
//     setFormData(prev => ({ ...prev, state: "" }));
//   }, [formData.country]);

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cartItems.length === 0 && message.type !== "success") {
//       navigate("/shop");
//     }
//   }, [cartItems, navigate, message.type]);

//   // Validation (city commented out)
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) newErrors.name = "Full name is required.";
//     if (!formData.email.trim()) newErrors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
//     else if (!isValidPhoneNumber(formData.phone)) newErrors.phone = "Phone number is invalid for the selected country."; // Updated validation
//     if (!formData.address.trim()) newErrors.address = "Address is required.";
//     // if (!formData.city.trim()) newErrors.city = "City is required."; // Commented out
//     if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code/ZIP is required.";
//     else if (!/^\d{3,10}$/.test(formData.postalCode.replace(/\D/g, ""))) newErrors.postalCode = "Invalid postal code format.";
//     if (!formData.country) newErrors.country = "Country is required.";
//     if (!formData.state) newErrors.state = "State/Province is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Run validation on input change
//   useEffect(() => {
//     validateForm();
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage({ text: "", type: "" });
//     setCardError("");

//     if (!validateForm()) {
//       setMessage({ text: "Please fix the errors below.", type: "error" });
//       return;
//     }

//     if (!token) {
//       setAuthModal({ open: true, view: "register" });
//       return;
//     }

//     if (cartItems.length === 0) {
//       setMessage({ text: "Your cart is empty.", type: "error" });
//       return;
//     }

//     if (!stripe || !elements) {
//       setMessage({ text: "Payment system is not loaded. Please refresh the page.", type: "error" });
//       return;
//     }

//     setLoading(true);

//     try {
//       const orderItems = cartItems.map(item => {
//         const productId = item.id || item._id;
//         return {
//           name: item.name,
//           qty: item.quantity,
//           image: item.images?.[0] || '/placeholder.jpg',
//           price: item.price,
//           product: productId,
//         };
//       });

//       const shippingAddress = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city, // Kept, but field commented out
//         postalCode: formData.postalCode,
//         country: formData.country,
//         state: formData.state,
//       };
//             const orderData = {
//         items: orderItems,
//         shippingAddress,
//         totalPrice: displayTotal,
//         baseTotalUSD: baseTotal,
//         currency: currencyCtx.currentCurrency,
//         paymentMethod: "Stripe",
//       };

//       console.log("Sending orderData:", orderData);

//       const orderResponse = await fetchWithAuth("/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderData),
//       });

//       const { _id: orderId, clientSecret } = orderResponse;

//       if (!clientSecret) {
//         throw new Error("Payment session could not be created. Please try again.");
//       }

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             address: {
//               line1: formData.address.split('\n')[0] || formData.address,
//               city: formData.city, // Kept
//               postal_code: formData.postalCode,
//                             country: formData.country,
//               state: formData.state,
//             },
//           },
//         },
//       });

//       if (error) {
//         console.error("Stripe error:", error);
//         setCardError(error.message);
//         setMessage({ text: `Payment failed: ${error.message}`, type: "error" });
//         return;
//       }

//       if (paymentIntent.status === 'succeeded') {
//         await fetchWithAuth(`/orders/${orderId}/pay`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
//         });

//         setMessage({ text: "Order placed successfully! Redirecting...", type: "success" });

//         try {
//           await cartAPI.clearCart();
//         } catch (clearError) {
//           console.warn("Backend cart clear failed (may not exist):", clearError);
//         }

//         clearCart();

//         setTimeout(() => {
//           navigate(`/order-success/${orderId}`);
//         }, 1500);
//       } else {
//         throw new Error("Payment was not confirmed. Please contact support.");
//       }
//     } catch (error) {
//       console.error("Order error:", error);
//       setMessage({ text: error.message || "Failed to place order. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0 && message.type !== "success") return null;

//   const countryOptions = [
//     { value: 'US', label: 'United States' },
//     { value: 'NG', label: 'Nigeria' },
//     { value: 'GB', label: 'United Kingdom' },
//     { value: 'CA', label: 'Canada'},
//         { value: 'ZA', label: 'South Africa' },
//     { value: 'ES', label: 'Spain' },
//     { value: 'FR', label: 'France' },
//     // Add more as needed
//   ];

//   return (
//     <div className="checkout-container" role="main" aria-label="Checkout page">
//       <h1 className="checkout-title">Secure Checkout</h1>
//       <p className="checkout-subtitle">
//         Review your order and complete your purchase.
//       </p>

//       {/* Order Summary - Updated with dynamic currency */}
//       <section className="order-summary" aria-label="Order summary">
//         <h2 className="summary-title">Order Summary</h2>
//         <ul className="items-list" role="list">
//           {convertedItems.map((item) => (
//             <li key={item.id || item._id} className="item-row" role="listitem">
//               <span className="item-name">{item.name}</span>
//               <span className="item-details">
//                 Qty: {item.quantity} × {symbol}{item.displayPrice.toLocaleString()}
//               </span>
//               <span className="item-total">
//                 {symbol}{(item.displayPrice * item.quantity).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//         <div className="total-row">
//           <span className="total-label">Total ({currencyCtx.currentCurrency}):</span>
//           <span className="total-amount">{symbol}{displayTotal.toLocaleString()}</span>
//         </div>
//       </section>

//       {/* Checkout Form - Enhanced with new fields */}
//       <form
//         onSubmit={handleSubmit}
//         className="checkout-form"
//         noValidate
//         aria-label="Billing information"
//       >
//         <fieldset disabled={loading}>
//           <legend className="form-legend">Billing & Shipping Information</legend>

//           {["name", "email", "phone", "address"].map((field) => (
//             <div key={field} className="form-group">
//               <label htmlFor={field} className="form-label">
//                 {field === "name"
//                   ? "Full Name *"
//                   : field === "email"
//                   ? "Email Address *"
//                   : field === "phone"
//                   ? "Phone Number *"
//                   : "Delivery Address *"}
//               </label>
//               {field === "address" ? (
//                 <textarea
//                   id={field}
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Enter your full delivery address (street, apt, etc.)"
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               ) : field === "phone" ? (
//                 <div>
//                   <input
//                     id={field}
//                     type="tel"
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     placeholder="+1 234 567 8901 (include country code)"
//                     className={errors[field] ? "input-error" : ""}
//                     aria-describedby={errors[field] ? `${field}-error` : undefined}
//                     aria-invalid={!!errors[field]}
//                   />
//                   <small className="helper-text">Include country code (e.g., +1 for US, +234 for Nigeria).</small>
//                 </div>
//               ) : (
//                 <input
//                   id={field}
//                   type={
//                     field === "email"
//                       ? "email"
//                       : field === "phone"
//                       ? "tel"
//                       : "text"
//                   }
//                   name={field}
//                   value={formData[field]}
//                   onChange={handleChange}
//                   placeholder={
//                     field === "name"
//                       ? "Enter your full name"
//                       : field === "email"
//                       ? "Enter your email address"
//                       : field === "phone"
//                       ? "+234 123 456 7890"
//                       : "Enter your delivery address"
//                   }
//                   className={errors[field] ? "input-error" : ""}
//                   aria-describedby={errors[field] ? `${field}-error` : undefined}
//                   aria-invalid={!!errors[field]}
//                 />
//               )}
//               {errors[field] && (
//                 <span id={`${field}-error`} className="error-message">
//                   {errors[field]}
//                 </span>
//               )}
//             </div>
//           ))}

//           {/* Country Dropdown */}
//           <div className="form-group">
//             <label htmlFor="country" className="form-label">Country *</label>
//             <select
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className={errors.country ? "input-error" : ""}
//               aria-describedby={errors.country ? "country-error" : undefined}
//               aria-invalid={!!errors.country}
//             >
//               <option value="">Select your country</option>
//               {countryOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.country && (
//               <span id="country-error" className="error-message">
//                 {errors.country}
//               </span>
//             )}
//           </div>

//           {/* State Dropdown - Only show if country is selected */}
//           {formData.country && (
//             <div className="form-group">
//               <label htmlFor="state" className="form-label">State/Province *</label>
//               <select
//                 id="state"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={errors.state ? "input-error" : ""}
//                 aria-describedby={errors.state ? "state-error" : undefined}
//                 aria-invalid={!!errors.state}
//               >
//                 <option value="">Select your state/province</option>
//                 {(stateOptions[formData.country] || []).map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.state && (
//                 <span id="state-error" className="error-message">
//                   {errors.state}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Postal Code / ZIP - Below State */}
//           <div className="form-group">
//             <label htmlFor="postalCode" className="form-label">Postal Code / ZIP *</label>
//             <input
//               id="postalCode"
//               type="text"
//               name="postalCode"
//               value={formData.postalCode}
//               onChange={handleChange}
//               placeholder="Enter postal code (e.g., 10001 or 23401)"
//               className={errors.postalCode ? "input-error" : ""}
//               aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
//               aria-invalid={!!errors.postalCode}
//             />
//             {errors.postalCode && (
//               <span id="postalCode-error" className="error-message">
//                 {errors.postalCode}
//               </span>
//             )}
//           </div>

//           {/* Stripe Card Input */}
//           <div className="form-group">
//             <label htmlFor="card-element" className="form-label">
//               Credit or Debit Card *
//             </label>
//             <small className="helper-text">Enter your card number, expiry (MM/YY format), and CVC. We accept Visa, Mastercard, and more.</small>
//             <div
//               id="card-element"
//               className={`input-field ${cardError ? "input-error" : ""}`}
//             >
//               <CardElement
//                 options={{
//                   hidePostalCode: true,
//                   style: {
//                     base: {
//                       fontSize: '16px',
//                       color: '#424770',
//                       lineHeight: '1.4',
//                       '::placeholder': {
//                         color: '#aab7c4',
//                         fontSize: '16px'
//                       },
//                       padding: '12px',
//                     },
//                     invalid: {
//                       color: '#9e2146',
//                       iconColor: '#9e2146'
//                     },
//                   },
//                 }}
//               />
//             </div>
//             {cardError && (
//               <span id="card-error" className="error-message">
//                 {cardError}
//               </span>
//             )}
//           </div>
//         </fieldset>

//         <button
//           type="submit"
//           disabled={loading || Object.keys(errors).length > 0 || currencyCtx.isLoading || !stripe}
//           className="submit-button"
//           aria-label={loading ? "Processing order" : `Place order for ${symbol}${displayTotal.toLocaleString()}`}
//         >
//           {loading ? (
//             <>
//               <span className="spinner" aria-hidden="true"></span>
//               Processing Order...
//             </>
//           ) : (
//             `Place Order - ${symbol}${displayTotal.toLocaleString()}`
//           )}
//         </button>
//       </form>

//       {message.text && (
//         <div
//           className={`message ${message.type}`}
//           role="alert"
//           aria-live="polite"
//         >
//           {message.text}
//         </div>
//       )}

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={() => setAuthModal({ open: false, view: "register" })}
//         onLoginSuccess={() => {
//           setAuthModal({ open: false, view: "register" });
//           window.dispatchEvent(new Event("authChange"));
//         }}
//       />
//     </div>
//   );
// };

// export default CheckoutPage;





import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import { cartAPI } from "../api";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AuthModal from "../components/AuthModal"; // Adjust path if necessary (assuming AuthModal is in ../components/)
// import { isValidPhoneNumber } from 'libphonenumber-js'; 
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, baseTotal, clearCart } = useContext(CartContext);
  const currencyCtx = useContext(CurrencyContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    // city: "", // Removed as it's not used in the form
    postalCode: "",
    country: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [cardError, setCardError] = useState("");
  const [authModal, setAuthModal] = useState({ open: false, view: "register" });
  const token = localStorage.getItem("token");

  // Dynamic total and items for display
  const displayTotal = currencyCtx.isLoading ? baseTotal : parseFloat(currencyCtx.getConvertedPrice(baseTotal));
  const symbol = currencyCtx.getSymbol(currencyCtx.currentCurrency);
  const convertedItems = cartItems.map(item => ({
    ...item,
    displayPrice: parseFloat(currencyCtx.getConvertedPrice(item.price)),
  }));

  // Country-to-code map
  const currencyToCountryMap = {
    'USD': 'US',
    'NGN': 'NG',
    'GBP': 'GB',
    'CAD': 'CA',
    'ZAR': 'ZA',
    'EUR': 'ES',
  };

  // State options based on country
  const stateOptions = {
    'US': [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' },
    ],
    'NG': [
      { value: 'AB', label: 'Abia' },
      { value: 'AD', label: 'Adamawa' },
      { value: 'AK', label: 'Akwa Ibom' },
      { value: 'AN', label: 'Anambra' },
      { value: 'BA', label: 'Bauchi' },
      { value: 'BY', label: 'Bayelsa' },
      { value: 'BE', label: 'Benue' },
      { value: 'BO', label: 'Borno' },
      { value: 'CR', label: 'Cross River' },
      { value: 'DE', label: 'Delta' },
      { value: 'EB', label: 'Ebonyi' },
      { value: 'ED', label: 'Edo' },
      { value: 'EK', label: 'Ekiti' },
      { value: 'EN', label: 'Enugu' },
      { value: 'FC', label: 'Federal Capital Territory' },
      { value: 'GO', label: 'Gombe' },
      { value: 'IM', label: 'Imo' },
      { value: 'JI', label: 'Jigawa' },
      { value: 'KD', label: 'Kaduna' },
      { value: 'KN', label: 'Kano' },
      { value: 'KT', label: 'Katsina' },
      { value: 'KE', label: 'Kebbi' },
      { value: 'KO', label: 'Kogi' },
      { value: 'KW', label: 'Kwara' },
      { value: 'LA', label: 'Lagos' },
      { value: 'NA', label: 'Nasarawa' },
      { value: 'NI', label: 'Niger' },
      { value: 'OG', label: 'Ogun' },
      { value: 'ON', label: 'Ondo' },
      { value: 'OS', label: 'Osun' },
      { value: 'OY', label: 'Oyo' },
      { value: 'PL', label: 'Plateau' },
      { value: 'RI', label: 'Rivers' },
      { value: 'SO', label: 'Sokoto' },
      { value: 'TA', label: 'Taraba' },
      { value: 'YO', label: 'Yobe' },
      { value: 'ZA', label: 'Zamfara' },
    ],
    'GB': [
      { value: 'ENG', label: 'England' },
      { value: 'SCT', label: 'Scotland' },
      { value: 'WLS', label: 'Wales' },
      { value: 'NIR', label: 'Northern Ireland' },
    ],
    'CA': [
      { value: 'AB', label: 'Alberta' },
      { value: 'BC', label: 'British Columbia' },
      { value: 'MB', label: 'Manitoba' },
      { value: 'NB', label: 'New Brunswick' },
      { value: 'NL', label: 'Newfoundland and Labrador' },
      { value: 'NS', label: 'Nova Scotia' },
      { value: 'ON', label: 'Ontario' },
      { value: 'PE', label: 'Prince Edward Island' },
      { value: 'QC', label: 'Quebec' },
      { value: 'SK', label: 'Saskatchewan' },
      { value: 'NT', label: 'Northwest Territories' },
      { value: 'NU', label: 'Nunavut' },
      { value: 'YT', label: 'Yukon' },
    ],
    'ZA': [
      { value: 'EC', label: 'Eastern Cape' },
      { value: 'FS', label: 'Free State' },
      { value: 'GT', label: 'Gauteng' },
      { value: 'KZN', label: 'KwaZulu-Natal' },
      { value: 'LP', label: 'Limpopo' },
      { value: 'MP', label: 'Mpumalanga' },
      { value: 'NC', label: 'Northern Cape' },
      { value: 'NW', label: 'North West' },
      { value: 'WC', label: 'Western Cape' },
    ],
    'ES': [
      { value: 'AN', label: 'Andalusia' },
      { value: 'AR', label: 'Aragon' },
      { value: 'AS', label: 'Asturias' },
      { value: 'IB', label: 'Balearic Islands' },
      { value: 'PV', label: 'Basque Country' },
      { value: 'CN', label: 'Canary Islands' },
      { value: 'CB', label: 'Cantabria' },
      { value: 'CL', label: 'Castile and León' },
      { value: 'CM', label: 'Castile-La Mancha' },
      { value: 'CT', label: 'Catalonia' },
      { value: 'CE', label: 'Ceuta' },
      { value: 'EX', label: 'Extremadura' },
      { value: 'GA', label: 'Galicia' },
      { value: 'MD', label: 'Madrid' },
      { value: 'MC', label: 'Murcia' },
      { value: 'ML', label: 'Melilla' },
      { value: 'NC', label: 'Navarre' },
      { value: 'RI', label: 'La Rioja' },
      { value: 'VC', label: 'Valencian Community' },
    ],
    'FR': [
      { value: 'ARA', label: 'Auvergne-Rhône-Alpes' },
      { value: 'BFC', label: 'Bourgogne-Franche-Comté' },
      { value: 'BRE', label: 'Brittany' },
      { value: 'CVL', label: 'Centre-Val de Loire' },
      { value: 'COR', label: 'Corsica' },
      { value: 'GES', label: 'Grand Est' },
      { value: 'HDF', label: 'Hauts-de-France' },
      { value: 'IDF', label: 'Île-de-France' },
      { value: 'NOR', label: 'Normandy' },
      { value: 'NAQ', label: 'Nouvelle-Aquitaine' },
      { value: 'OCC', label: 'Occitanie' },
      { value: 'PDL', label: 'Pays de la Loire' },
      { value: 'PAC', label: 'Provence-Alpes-Côte d\'Azur' },
    ],
  };

  // Auto-set country on load
  useEffect(() => {
    if (currencyCtx.userCountry) {
      setFormData(prev => ({ ...prev, country: currencyCtx.userCountry, state: "" }));
    } else if (currencyCtx.currentCurrency) {
      const defaultCountry = currencyToCountryMap[currencyCtx.currentCurrency] || 'US';
      setFormData(prev => ({ ...prev, country: defaultCountry, state: "" }));
    }
  }, [currencyCtx.userCountry, currencyCtx.currentCurrency]);

  // Reset state when country changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, state: "" }));
  }, [formData.country]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && message.type !== "success") {
      navigate("/shop");
    }
  }, [cartItems, navigate, message.type]);

  // Validation (city commented out)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    // else if (formData.country && !isValidPhoneNumber(formData.phone, formData.country)) newErrors.phone = "Phone number is invalid for the selected country.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    // if (!formData.city.trim()) newErrors.city = "City is required."; // Commented out
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code/ZIP is required.";
    else if (!/^\d{3,10}$/.test(formData.postalCode.replace(/\D/g, ""))) newErrors.postalCode = "Invalid postal code format.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State/Province is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run validation on input change
  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setCardError("");

    if (!validateForm()) {
      setMessage({ text: "Please fix the errors below.", type: "error" });
      return;
    }

    if (!token) {
      setAuthModal({ open: true, view: "register" });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ text: "Your cart is empty.", type: "error" });
      return;
    }

    if (!stripe || !elements) {
      setMessage({ text: "Payment system is not loaded. Please refresh the page.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map(item => {
        const productId = item.id || item._id;
        return {
          name: item.name,
          qty: item.quantity,
          image: item.images?.[0] || '/placeholder.jpg',
          price: item.price,
          product: productId,
        };
      });

      const shippingAddress = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        // city: formData.city, // Removed as it's not in the form
        postalCode: formData.postalCode,
        country: formData.country,
        state: formData.state,
      };
            const orderData = {
        items: orderItems,
        shippingAddress,
        totalPrice: displayTotal,
        baseTotalUSD: baseTotal,
        currency: currencyCtx.currentCurrency,
        paymentMethod: "Stripe",
      };

      console.log("Sending orderData:", orderData);

      const orderResponse = await fetchWithAuth("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const { _id: orderId, clientSecret } = orderResponse;

      if (!clientSecret) {
        throw new Error("Payment session could not be created. Please try again.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address.split('\n')[0] || formData.address,
              // city: formData.city, // Removed as it's not in the form
              postal_code: formData.postalCode,
                            country: formData.country,
              state: formData.state,
            },
          },
        },
      });

      if (error) {
        console.error("Stripe error:", error);
        setCardError(error.message);
        setMessage({ text: `Payment failed: ${error.message}`, type: "error" });
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await fetchWithAuth(`/orders/${orderId}/pay`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        setMessage({ text: "Order placed successfully! Redirecting...", type: "success" });

        try {
          await cartAPI.clearCart();
        } catch (clearError) {
          console.warn("Backend cart clear failed (may not exist):", clearError);
        }

        clearCart();

        setTimeout(() => {
          navigate(`/order-success/${orderId}`);
        }, 1500);
      } else {
        throw new Error("Payment was not confirmed. Please contact support.");
      }
    } catch (error) {
      console.error("Order error:", error);
      setMessage({ text: error.message || "Failed to place order. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && message.type !== "success") return null;

    const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'ES', label: 'Spain' },
    { value: 'FR', label: 'France' },
    // Add more as needed
  ];

  return (
    <div className="checkout-container" role="main" aria-label="Checkout page">
      <h1 className="checkout-title">Secure Checkout</h1>
      <p className="checkout-subtitle">
        Review your order and complete your purchase.
      </p>

      {/* Order Summary - Updated with dynamic currency */}
      <section className="order-summary" aria-label="Order summary">
        <h2 className="summary-title">Order Summary</h2>
        <ul className="items-list" role="list">
          {convertedItems.map((item) => (
            <li key={item.id || item._id} className="item-row" role="listitem">
              <span className="item-name">{item.name}</span>
              <span className="item-details">
                Qty: {item.quantity} × {symbol}{item.displayPrice.toLocaleString()}
              </span>
              <span className="item-total">
                {symbol}{(item.displayPrice * item.quantity).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <div className="total-row">
          <span className="total-label">Total ({currencyCtx.currentCurrency}):</span>
          <span className="total-amount">{symbol}{displayTotal.toLocaleString()}</span>
        </div>
      </section>

      {/* Checkout Form - Enhanced with new fields */}
      <form
        onSubmit={handleSubmit}
        className="checkout-form"
        noValidate
        aria-label="Billing information"
      >
        <fieldset disabled={loading}>
          <legend className="form-legend">Billing & Shipping Information</legend>

          {["name", "email", "phone", "address"].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field} className="form-label">
                {field === "name"
                  ? "Full Name *"
                  : field === "email"
                  ? "Email Address *"
                  : field === "phone"
                  ? "Phone Number *"
                  : "Delivery Address *"}
              </label>
              {field === "address" ? (
                <textarea
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your full delivery address (street, apt, etc.)"
                  className={errors[field] ? "input-error" : ""}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                  aria-invalid={!!errors[field]}
                />
              ) : field === "phone" ? (
                <div>
                  <input
                    id={field}
                    type="tel"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder="+1 234 567 8901 (include country code)"
                    className={errors[field] ? "input-error" : ""}
                    aria-describedby={errors[field] ? `${field}-error` : undefined}
                    aria-invalid={!!errors[field]}
                  />
                  <small className="helper-text">Include country code (e.g., +1 for US, +234 for Nigeria).</small>
                </div>
              ) : (
                <input
                  id={field}
                  type={
                    field === "email"
                      ? "email"
                      : field === "phone"
                      ? "tel"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    field === "name"
                      ? "Enter your full name"
                      : field === "email"
                      ? "Enter your email address"
                      : field === "phone"
                      ? "+234 123 456 7890"
                      : "Enter your delivery address"
                  }
                  className={errors[field] ? "input-error" : ""}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                  aria-invalid={!!errors[field]}
                />
              )}
              {errors[field] && (
                <span id={`${field}-error`} className="error-message">
                  {errors[field]}
                </span>
              )}
            </div>
          ))}

          {/* Country Dropdown */}
          <div className="form-group">
            <label htmlFor="country" className="form-label">Country *</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? "input-error" : ""}
              aria-describedby={errors.country ? "country-error" : undefined}
              aria-invalid={!!errors.country}
            >
              <option value="">Select your country</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <span id="country-error" className="error-message">
                {errors.country}
              </span>
            )}
          </div>

          {/* State Dropdown - Only show if country is selected */}
          {formData.country && (
            <div className="form-group">
              <label htmlFor="state" className="form-label">State/Province *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? "input-error" : ""}
                aria-describedby={errors.state ? "state-error" : undefined}
                aria-invalid={!!errors.state}
              >
                <option value="">Select your state/province</option>
                {(stateOptions[formData.country] || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.state && (
                <span id="state-error" className="error-message">
                  {errors.state}
                </span>
              )}
            </div>
          )}

          {/* Postal Code / ZIP - Below State */}
          <div className="form-group">
            <label htmlFor="postalCode" className="form-label">Postal Code / ZIP *</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code (e.g., 10001 or 23401)"
              className={errors.postalCode ? "input-error" : ""}
              aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
              aria-invalid={!!errors.postalCode}
            />
            {errors.postalCode && (
              <span id="postalCode-error" className="error-message">
                {errors.postalCode}
              </span>
            )}
          </div>

          {/* Stripe Card Input */}
          <div className="form-group">
            <label htmlFor="card-element" className="form-label">
              Credit or Debit Card *
            </label>
            <small className="helper-text">Enter your card number, expiry (MM/YY format), and CVC. We accept Visa, Mastercard, and more.</small>
            <div
              id="card-element"
              className={`input-field ${cardError ? "input-error" : ""}`}
            >
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      lineHeight: '1.4',
                      '::placeholder': {
                        color: '#aab7c4',
                        fontSize: '16px'
                      },
                      padding: '12px',
                    },
                    invalid: {
                      color: '#9e2146',
                      iconColor: '#9e2146'
                    },
                  },
                }}
              />
            </div>
            {cardError && (
              <span id="card-error" className="error-message">
                {cardError}
              </span>
            )}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0 || currencyCtx.isLoading || !stripe}
          className="submit-button"
          aria-label={loading ? "Processing order" : `Place order for ${symbol}${displayTotal.toLocaleString()}`}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              Processing Order...
            </>
          ) : (
            `Place Order - ${symbol}${displayTotal.toLocaleString()}`
          )}
        </button>
      </form>

      {message.text && (
        <div
          className={`message ${message.type}`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        view={authModal.view}
        onClose={() => setAuthModal({ open: false, view: "register" })}
        onLoginSuccess={() => {
          setAuthModal({ open: false, view: "register" });
          window.dispatchEvent(new Event("authChange"));
        }}
      />
    </div>
  );
};

export default CheckoutPage;
