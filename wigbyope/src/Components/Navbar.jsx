import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ onCartToggle }) {
  const { cartItems } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, view: "register" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}

  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  function openAuth(view) {
    setAuthModal({ open: true, view });
    setMobileMenuOpen(false);
  }

  function closeAuth() {
    setAuthModal({ open: false, view: "register" });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  // Close mobile menu on navigation
  function handleLinkClick() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
           <div className="navbar-logo">
             WIG<span>BYOPE</span>
           </div>
          <ul className="navbar-links">
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
            <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
            <li><Link to="/blog" onClick={handleLinkClick}>Blog</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
            {/* <li><Link to="/coo" onClick={handleLinkClick}>Coo</Link></li> */}
          </ul>

          <div className="navbar-actions">
            {/* <button onClick={() => alert("Search feature coming soon!")} className="icon-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button> */}

            <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
              <i className="fas fa-shopping-bag"></i>
              {cartItems.length > 0 && (
                <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
              )}
            </button>

            {isLoggedIn ? (
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                {/* <button className="btn-outline" onClick={() => openAuth("login")}>Sign In</button> */}
                <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
            <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
            <li><Link to="/blog" onClick={handleLinkClick}>Blog</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
            {/* <li><Link to="/coo" onClick={handleLinkClick}>Coo</Link></li> */}
          </ul>

          <li className="mobile-actions">
            {isLoggedIn ? (
              <button className="btn-gradient" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <button className="btn-outline" onClick={() => openAuth("login")}>Sign In</button>
                <button className="btn-gradient" onClick={() => openAuth("register")}>Sign Up</button>
              </>
            )}
          </li>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        view={authModal.view}
        onClose={closeAuth}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          closeAuth();
        }}
      />
    </>
  );
}

export default Navbar;

// import React, { useState, useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import CartSidebar from "./CartSidebar";
// import "./Navbar.css";

// function Navbar() {
//   const { cartItems } = useContext(CartContext);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   function toggleCart() {
//     setCartOpen((open) => !open);
//   }

//   function toggleMobileMenu() {
//     setMobileMenuOpen((open) => !open);
//   }

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-logo">
//             WIG<span>BYOPE</span>
//           </div>

//           {/* Desktop Menu */}
//           <ul className="navbar-links">
//             {[
//               "Home",
//               "Services",
//               "Shop",
//               "Training",
//               "About",
//               "Blog",
//               "Contact",
//             ].map((section) => (
//               <li key={section}>
//                 <a href={`#${section.toLowerCase()}`} className="nav-link">
//                   {section}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {/* Icons + Buttons */}
//           <div className="navbar-actions">
//             <button
//               onClick={() => alert("Search feature coming soon!")}
//               className="icon-btn"
//               aria-label="Open search"
//             >
//               <i className="fas fa-search"></i>
//             </button>

//             <button
//               onClick={toggleCart}
//               className="icon-btn cart-btn"
//               aria-label="Open cart"
//             >
//               <i className="fas fa-shopping-bag"></i>
//               {cartItems.length > 0 && (
//                 <span className="cart-badge">{cartItems.length}</span>
//               )}
//             </button>

//             <button className="btn-outline">Sign In</button>
//             <button className="btn-gradient">Sign Up</button>

//             {/* Mobile Toggle */}
//             <button
//               onClick={toggleMobileMenu}
//               className="mobile-menu-btn"
//               aria-label="Toggle menu"
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Sidebar */}
//         <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
//           <button
//             className="close-btn"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//           >
//             &times;
//           </button>
//           <ul>
//             {[
//               "Home",
//               "Services",
//               "Shop",
//               "Training",
//               "About",
//               "Blog",
//               "Contact",
//             ].map((section) => (
//               <li key={section}>
//                 <a
//                   href={`#${section.toLowerCase()}`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {section}
//                 </a>
//               </li>
//             ))}
//             <li className="mobile-actions">
//               <button className="btn-outline">Sign In</button>
//               <button className="btn-gradient">Sign Up</button>
//             </li>
//           </ul>
//         </div>
//       </nav>

//       {/* Cart Sidebar */}
//       <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
//     </>
//   );
// }

// export default Navbar;


// // import React, { useState, useContext } from "react";
// // import { CartContext } from "../context/CartContext";
// // import "./Navbar.css";

// // function Navbar({ onSearchClick, onCartToggle }) {
// //   const cartContext = useContext(CartContext);
// //   const cartItems = cartContext?.cartItems || [];

// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //   function toggleMobileMenu() {
// //     setMobileMenuOpen((open) => !open);
// //   }

// //   return (
// //     <nav className="navbar">
// //       <div className="navbar-container">
// //         {/* Logo */}
// //         <div className="navbar-logo">
// //           WIG<span>BYOPE</span>
// //         </div>

// //         {/* Desktop Menu */}
// //         <ul className="navbar-links">
// //           {[
// //             "Home",
// //             "Services",
// //             "Shop",
// //             "Training",
// //             "About",
// //             "Blog",
// //             "Contact",
// //           ].map((section) => (
// //             <li key={section}>
// //               <a href={`#${section.toLowerCase()}`} className="nav-link">
// //                 {section}
// //               </a>
// //             </li>
// //           ))}
// //         </ul>

// //         {/* Icons + Buttons */}
// //         <div className="navbar-actions">
// //           <button
// //             onClick={onSearchClick}
// //             className="icon-btn"
// //             aria-label="Open search"
// //           >
// //             <i className="fas fa-search"></i>
// //           </button>

// //           <button
// //             onClick={onCartToggle}
// //             className="icon-btn cart-btn"
// //             aria-label="Open cart"
// //           >
// //             <i className="fas fa-shopping-bag"></i>
// //             {cartItems.length > 0 && (
// //               <span className="cart-badge">{cartItems.length}</span>
// //             )}
// //           </button>

// //           <button className="btn-outline">Sign In</button>
// //           <button className="btn-gradient">Sign Up</button>

// //           {/* Mobile Toggle */}
// //           <button
// //             onClick={toggleMobileMenu}
// //             className="mobile-menu-btn"
// //             aria-label="Toggle menu"
// //           >
// //             <i className="fas fa-bars"></i>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Sidebar */}
// //       <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
// //         <button
// //           className="close-btn"
// //           onClick={() => setMobileMenuOpen(false)}
// //           aria-label="Close menu"
// //         >
// //           &times;
// //         </button>
// //         <ul>
// //           {[
// //             "Home",
// //             "Services",
// //             "Shop",
// //             "Training",
// //             "About",
// //             "Blog",
// //             "Contact",
// //           ].map((section) => (
// //             <li key={section}>
// //               <a
// //                 href={`#${section.toLowerCase()}`}
// //                 onClick={() => setMobileMenuOpen(false)}
// //               >
// //                 {section}
// //               </a>
// //             </li>
// //           ))}
// //           <li className="mobile-actions">
// //             <button className="btn-outline">Sign In</button>
// //             <button className="btn-gradient">Sign Up</button>
// //           </li>
// //         </ul>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;