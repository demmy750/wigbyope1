import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js'; // New: For Stripe
import { Elements } from '@stripe/react-stripe-js'; // New: Stripe provider
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
import { CurrencyProvider } from "./context/CurrencyContext"; // New: Currency provider
import CartSidebar from "./Components/CartSidebar";
import { ToastContainer } from "react-toastify";
import OrderConfirmation from "./Pages/OrderConfirmation";
import OrderTracking from "./Pages/OrderTracking";
import Order from "./Pages/Order";
import ProfilePage from "./Pages/Profile";
// import EditProfilePage from "./pages/EditProfilePage";

// Import your auth pages (replace with your actual components or the forms I gave)
import Login from "./Pages/LoginForm";
import Register from "./Pages/RegisterForm";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPasswordForm";
import ResetPassword from "./Pages/ResetPasswordForm";

// import AdminDashboard from "./admin/AdminDashboard";
import PrivateRoute from "./Components/PrivateRoute";
import AdminPanel from "./admin/AdminPanel";
import OrderSuccessPage from "./Pages/OrderSuccess";
import OrdersPage from "./Pages/OrdersPage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import EditProfilePage from "./Pages/EditProfilePage";
import UserOrders from "./Pages/Userorders";


// import VerifyCodeForm from "./Pages/VerifyCodeForm";

// New: Load Stripe with fallback (Vite-specific)
let stripePromise = null;
try {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (key && key.startsWith('pk_test_')) {  // Basic validation
    stripePromise = loadStripe(key);
    console.log('Stripe initialized successfully with key:', key.substring(0, 10) + '...'); // Debug (partial key for security)
  } else {
    console.warn('Stripe publishable key missing or invalid. Add VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... to .env and restart server.');
  }
} catch (error) {
  console.error('Error loading Stripe:', error);
}

function App() {
  const [isCartOpen, setCartOpen] = useState(false);

  const toggleCart = () => setCartOpen((open) => !open);
  const closeCart = () => setCartOpen(false);

  const placeOrder = async (orderData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User  not authenticated");

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to place order");
    }

    return res.json();
  };

  // App content (to be wrapped by Elements if available)
  const appContent = (
    <Router>
      <div className="appp min-h-screen flex flex-col s">
        <Navbar onCartToggle={toggleCart} />
        <CartSidebar isOpen={isCartOpen} onClose={closeCart} />

        <main >
          <Routes>
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}> 
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/checkout" element={<CheckoutPage placeOrder={placeOrder} />} /> {/* Passes placeOrder for backend call */}
            <Route path="/services" element={<Services />} />
            <Route path="/training" element={<Training />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetailPage/>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            {/* <Route path="/verify" element={<VerifyCodeForm />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<OrdersPage />} />

            {/* Order routes */}
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
             <Route path="/usersorders" element={<UserOrders />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            {/* <Route path="/adminss" element={<AdminDashboard />} /> */}
            <Route path="/allorders" element={<Order />} />
          </Routes>

          {/* Optional: Add simple links for auth navigation */}
          
        </main>

        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );

  // Conditional Stripe Elements: Wrap appContent if Stripe ready
  const wrappedApp = stripePromise ? (
    <Elements stripe={stripePromise}>
      {appContent}
    </Elements>
  ) : (
    <>
      {import.meta.env.MODE === 'development' && (
        <div style={{ 
          padding: '10px', 
          background: '#fff3cd', 
          color: '#856404', 
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999 
        }}>
          ⚠️ Stripe not loaded (missing .env key). Checkout will show a warning. Add VITE_STRIPE_PUBLISHABLE_KEY and restart.
        </div>
      )}
      {appContent}
    </>
  );

  return (
    <CurrencyProvider> {/* New: Global currency detection and conversion */}
      <CartProvider>
        {wrappedApp} {/* Conditional Stripe wrap here */}
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;