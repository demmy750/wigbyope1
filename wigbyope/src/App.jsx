import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import Training from "./Pages/Training";
import About from "./Pages/About";
import Blog from "./Pages/BlogList";
import Contact from "./Pages/Contact";
import ShopPage from "./Pages/ShopPage";
import CheckoutPage from "./Pages/CheckoutPage";
import { CartProvider } from "./context/CartProvider";
import CartSidebar from "./Components/CartSidebar";
import { ToastContainer } from "react-toastify";
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderTracking from "./Pages/OrderTracking";

function App() {
  const [isCartOpen, setCartOpen] = useState(false);

  const toggleCart = () => setCartOpen((open) => !open);
  const closeCart = () => setCartOpen(false);

  // Mock OR real order function
  const placeOrder = async (orderData) => {
    // === MOCK VERSION ===
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            orderId: "MOCK123",
            estimatedDelivery: "3-5 business days",
            ...orderData,
          }),
        800
      )
    );

    // === REAL VERSION ===
    /*
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Failed to place order");
    return await response.json();
    */
  };

  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar onCartToggle={toggleCart} />
          <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/checkout" element={<CheckoutPage placeOrder={placeOrder} />} />
              <Route path="/services" element={<Services />} />
              <Route path="/training" element={<Training />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />

              {/* Confirmation */}
              <Route
                path="/confirmation/:orderId"
                element={
                  <OrderConfirmation
                    orderId="MOCK123"
                    estimatedDelivery="3-5 business days"
                    onTrackOrder={() => (window.location.href = "/track-order/MOCK123")}
                  />
                }
              />

              {/* Tracking */}
              <Route path="/track-order/:orderId" element={<OrderTracking />} />
            </Routes>
          </main>

          <Footer />
          <ToastContainer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;




// import React, { useState,  } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
// import Home from "./Pages/Home";
// import Services from "./Pages/Services";
// import Training from "./Pages/Training";
// import About from "./Pages/About";
// import Blog from "./Pages/Blog";
// import Contact from "./Pages/Contact";
// import ShopPage from "./Pages/ShopPage";
// import CheckoutPage from "./Pages/CheckoutPage";
// import { CartProvider } from "./context/CartProvider";
// import CartSidebar from "./Components/CartSidebar";
// import { ToastContainer } from "react-toastify";
// import OrderConfirmation from "./Pages/OrderConfirmation";

// function App() {
//   const [isCartOpen, setCartOpen] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [orderError, setOrderError] = useState(null);

//   const toggleCart = () => setCartOpen((open) => !open);
//   const closeCart = () => setCartOpen(false);

//   // Function to place order by calling backend API
//   const placeOrder = async () => {
//     setOrderLoading(true);
//     setOrderError(null);
//     try {
//       const response = await fetch("http://localhost:5000/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ /* you can send order/cart data here if needed */ }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to place order");
//       }

//       const data = await response.json();
//       setOrderDetails(data);
//     } catch (error) {
//       setOrderError(error.message);
//     } finally {
//       setOrderLoading(false);
//     }
//   };

//   // Handler for tracking order
//   const handleTrackOrder = () => {
//     if (orderDetails) {
//       alert(`Tracking order ${orderDetails.orderId}`);
//       // Or redirect to tracking page, e.g.:
//       // window.location.href = `/track-order/${orderDetails.orderId}`;
//     }
//   };

//   return (
//     <Router>
//       <CartProvider>
//         <div className="min-h-screen flex flex-col font-roboto bg-gradient-to-br from-slate-50 to-slate-200">
//           <Navbar onCartToggle={toggleCart} />

//           {/* Cart Sidebar */}
//           <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

//           <main className="flex-grow">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/shop" element={<ShopPage />} />
//               <Route path="/checkout" element={<CheckoutPage placeOrder={placeOrder} />} />
//               <Route path="/services" element={<Services />} />
//               <Route path="/training" element={<Training />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/blog" element={<Blog />} />
//               <Route path="/contact" element={<Contact />} />

//               <Route
//                 path="/confirmation"
//                 element={
//                   orderLoading ? (
//                     <div className="text-center mt-20 text-lg">Processing your order...</div>
//                   ) : orderError ? (
//                     <div className="text-center mt-20 text-red-600">{orderError}</div>
//                   ) : orderDetails ? (
//                     <OrderConfirmation
//                       orderId={orderDetails.orderId}
//                       estimatedDelivery={orderDetails.estimatedDelivery}
//                       onTrackOrder={handleTrackOrder}
//                     />
//                   ) : (
//                     <div className="text-center mt-20 text-gray-700">
//                       No order found. Please place an order first.
//                     </div>
//                   )
//                 }
//               />
//             </Routes>
//           </main>

//           <Footer />
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       </CartProvider>
//     </Router>
//   );
// }

// export default App;



// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";
// import Home from "./Pages/Home";
// import Services from "./Pages/Services";
// import Training from "./Pages/Training";
// import About from "./Pages/About";
// import Blog from "./Pages/Blog";
// import Contact from "./Pages/Contact";
// import ShopPage from "./Pages/ShopPage";
// import CheckoutPage from "./Pages/CheckoutPage"; 
// import { CartProvider } from "./context/CartProvider";
// import CartPage from "./Pages/CartPage"; 
// import { ToastContainer } from "react-toastify";

// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);

//   const openSidebar = () => setSidebarOpen(true);
//   const closeSidebar = () => setSidebarOpen(false);

//   return (
//     <Router>
//       <CartProvider>
//         <div className="min-h-screen flex flex-col font-roboto bg-gradient-to-br from-slate-50 to-slate-200">
//           <Navbar
//             // You can add a prop to Navbar to open cart sidebar on cart icon click
//             onCartToggle={openSidebar}
//           />

//           {/* Overlay */}
//           {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

//           {/* Cart Sidebar */}
//           <CartPage isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

//           <main className="flex-grow">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/shop" element={<ShopPage />} />
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/services" element={<Services />} />
//               <Route path="/training" element={<Training />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/blog" element={<Blog />} />
//               <Route path="/contact" element={<Contact />} />
//             </Routes>
//           </main>

//           <Footer />
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//           />
//         </div>
//       </CartProvider>
//     </Router>
//   );
// }

// export default App;


// // import React, {  } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import Navbar from "./Components/Navbar";
// // // import CartModal from "./Components/CartModal";
// // // import SearchModal from "../Components/SearchModal";
// // import Footer from "./Components/Footer";
// // import Home from "./Pages/Home";
// // import Services from "./Pages/Services";
// // import Training from "./Pages/Training";
// // import About from "./Pages/About";
// // import Blog from "./Pages/Blog";
// // import Contact from "./Pages/Contact";
// // import ShopPage from "./Pages/ShopPage";
// // // import '@fortawesome/fontawesome-free/css/all.min.css';
// // import { CartProvider } from "./context/CartProvider";
// // import { ToastContainer } from "react-toastify";

// //  function App() {
// // //   const [cart, setCart] = useState([]);
// // //   const [mobileMenu, setMobileMenu] = useState(false);
// // //   const [showCart, setShowCart] = useState(false);
// // //   const [showSearch, setShowSearch] = useState(false);

// // //   const addToCart = (product) => {
// // //     setCart((prev) => {
// // //       const existing = prev.find((item) => item.id === product.id);
// // //       if (existing) {
// // //         return prev.map((item) =>
// // //           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
// // //         );
// // //       }
// // //       return [...prev, { ...product, quantity: 1 }];
// // //     });
// // //   };

// // //   const removeFromCart = (id) => {
// // //     setCart((prev) => prev.filter((item) => item.id !== id));
// // //   };

// // //   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// //   return (
// //     <Router>
// //       <CartProvider>
// //         <div className="min-h-screen flex flex-col font-roboto bg-gradient-to-br from-slate-50 to-slate-200">
// //         <Navbar
// //         //   cartCount={cart.length}
// //         //   onCartToggle={() => setShowCart((p) => !p)}
// //         //   onSearchToggle={() => setShowSearch(true)}
// //         //   onMobileToggle={() => setMobileMenu((p) => !p)}
// //         //   mobileMenu={mobileMenu}
// //         />

// //         <main className="flex-grow">
// //           <Routes>
// //             <Route path="/" element={<Home />} />
// //             <Route path="/shop" element={<ShopPage />} /> 
// //             {/* addToCart={addToCart}  */}
// //             <Route path="/services" element={<Services />} />
// //             <Route path="/training" element={<Training />} />
// //             <Route path="/about" element={<About />} />
// //             <Route path="/blog" element={<Blog />} />
// //             <Route path="/contact" element={<Contact />} />
// //           </Routes>
// //         </main>

// //         {/* {showCart && <CartModal cart={cart} removeFromCart={removeFromCart} total={total} />}
// //         {showSearch && <SearchModal onClose={() => setShowSearch(false)} />} */}

// //         <Footer />
// //          <ToastContainer 
// //             position="top-right" 
// //             autoClose={3000} 
// //             hideProgressBar={false} 
// //             newestOnTop={false} 
// //             closeOnClick 
// //             rtl={false} 
// //             pauseOnFocusLoss 
// //             draggable 
// //             pauseOnHover 
// //           />
// //       </div>
// //       </CartProvider>
// //     </Router>
// //   );
// // }
// // export default App;


