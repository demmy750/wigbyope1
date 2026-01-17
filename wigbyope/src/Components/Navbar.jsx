// // Updated Navbar.js
// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import AuthModal from "./AuthModal";
// import "./Navbar.css";

// function Navbar({ onCartToggle }) {
//   const { cartItems } = useContext(CartContext);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const navigate = useNavigate();
//   const { clearCart } = useContext(CartContext);

//   // Check login status on mount and listen for changes (e.g., logout)
//   useEffect(() => {
//     const checkLogin = () => {
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!token);
//     };
//     checkLogin(); // Initial check

//     // Listen for storage changes (e.g., login/logout in another tab or component)
//     window.addEventListener("storage", checkLogin);
    
//     // Listen for custom auth change events (for same-tab updates)
//     window.addEventListener("authChange", checkLogin);
    
//     return () => {
//       window.removeEventListener("storage", checkLogin);
//       window.removeEventListener("authChange", checkLogin); // Clean up
//     };
//   }, []);

//   function openAuth(view) {
//     setAuthModal({ open: true, view });
//     setMobileMenuOpen(false);
//   }

//   function closeAuth() {
//     setAuthModal({ open: false, view: "register" });
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     clearCart(); 
//     setIsLoggedIn(false); // Force update
//     setMobileMenuOpen(false);
//     navigate("/");
    
//     // Dispatch custom event to notify other components (like Navbar in same tab)
//     window.dispatchEvent(new Event("authChange"));
//   }

//   // Close mobile menu on navigation
//   function handleLinkClick() {
//     setMobileMenuOpen(false);
//   }

//   // Navigate to profile on user icon click
//   function handleProfileClick() {
//     navigate("/profile");
//   }

//   return (
//     <>
//       <nav className="navbar" role="navigation" aria-label="Main navigation">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-logo">
//             WIG<span>BYOPE</span>
//           </div>

//           {/* Desktop Links */}
//           <ul className="navbar-links">
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           {/* Actions */}
//           <div className="navbar-actions">
//             {/* Cart Button */}
//             <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
//               <i className="fas fa-shopping-bag" aria-hidden="true"></i>
//               {cartItems.length > 0 && (
//                 <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
//               )}
//             </button>

//             {/* User Auth / Profile */}
//             {isLoggedIn ? (
//               <button
//                 className="icon-btn user-icon-btn"
//                 aria-label="Go to profile"
//                 onClick={handleProfileClick}
//               >
//                 <i className="fas fa-user-circle" aria-hidden="true"></i>
//               </button>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="mobile-menu-btn"
//               aria-label="Toggle mobile menu"
//               aria-expanded={mobileMenuOpen}
//             >
//               <i className="fas fa-bars" aria-hidden="true"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} role="menu">
//           <button
//             className="close-btn"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//           >
//             &times;
//           </button>
//           <ul>
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           <div className="mobile-actions">
//             {isLoggedIn ? (
//               <>
//                 <button className="btn-gradientt" onClick={handleProfileClick}>Profile</button>
//                 <button className="btn-outline" onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={closeAuth}
//         onLoginSuccess={() => {
//           setIsLoggedIn(true);
//           closeAuth();
//         }}
//       />
//     </>
//   );
// }

// export default Navbar;






// Updated Navbar.js
import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ onCartToggle }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, view: "register" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Check login status and listen for changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("authChange", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authChange", checkLogin);
    };
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
    clearCart();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");

    // Notify other components in same tab
    window.dispatchEvent(new Event("authChange"));
  }

  function handleLinkClick() {
    setMobileMenuOpen(false);
  }

  function handleProfileClick() {
    navigate("/profile");
  }

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-container">
          {/* Left Side: Logo + Links */}
          <div className="navbar-left">
            {/* Logo */}
            <div className="navbar-logo">
              WIG<span>BYOPE</span>
            </div>

            {/* Desktop Links */}
            <ul className="navbar-links">
              <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
              <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
              <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
              <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
            </ul>
          </div>

          {/* Right Side: Actions */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
              <i className="fas fa-shopping-bag" aria-hidden="true"></i>
              {cartItems.length > 0 && (
                <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
              )}
            </button>

            {/* Auth/Profile Button */}
            {isLoggedIn ? (
              <button
                className="icon-btn user-icon-btn"
                aria-label="Go to profile"
                onClick={handleProfileClick}
              >
                <i className="fas fa-user-circle" aria-hidden="true"></i>
              </button>
            ) : (
              <button className="btn-gradientt" onClick={() => openAuth("register")}>
                Sign Up
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} role="menu">
          <button
            className="close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>

          <ul>
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
            <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
          </ul>

          <div className="mobile-actions">
            {isLoggedIn ? (
              <>
                <button className="btn-gradientt" onClick={handleProfileClick}>Profile</button>
                <button className="btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
            )}
          </div>
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











// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import AuthModal from "./AuthModal";
// import "./Navbar.css";

// function Navbar({ onCartToggle }) {
//   const { cartItems } = useContext(CartContext);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const navigate = useNavigate();
//   const { clearCart } = useContext(CartContext);

//   // Check login status on mount and listen for changes (e.g., logout)
//   useEffect(() => {
//     const checkLogin = () => {
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!token);
//     };
//     checkLogin(); // Initial check

//     // Listen for storage changes (e.g., login/logout in another tab or component)
//     window.addEventListener("storage", checkLogin);
//     return () => window.removeEventListener("storage", checkLogin);
//   }, []);

//   function openAuth(view) {
//     setAuthModal({ open: true, view });
//     setMobileMenuOpen(false);
//   }

//   function closeAuth() {
//     setAuthModal({ open: false, view: "register" });
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     clearCart(); 
//     setIsLoggedIn(false); // Force update
//     setMobileMenuOpen(false);
//     navigate("/");
//   }

//   // Close mobile menu on navigation
//   function handleLinkClick() {
//     setMobileMenuOpen(false);
//   }

//   // Navigate to profile on user icon click
//   function handleProfileClick() {
//     navigate("/profile");
//   }

//   return (
//     <>
//       <nav className="navbar" role="navigation" aria-label="Main navigation">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-logo">
//             WIG<span>BYOPE</span>
//           </div>

//           {/* Desktop Links */}
//           <ul className="navbar-links">
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           {/* Actions */}
//           <div className="navbar-actions">
//             {/* Cart Button */}
//             <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
//               <i className="fas fa-shopping-bag" aria-hidden="true"></i>
//               {cartItems.length > 0 && (
//                 <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
//               )}
//             </button>

//             {/* User Auth / Profile */}
//             {isLoggedIn ? (
//               <button
//                 className="icon-btn user-icon-btn"
//                 aria-label="Go to profile"
//                 onClick={handleProfileClick}
//               >
//                 <i className="fas fa-user-circle" aria-hidden="true"></i>
//               </button>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="mobile-menu-btn"
//               aria-label="Toggle mobile menu"
//               aria-expanded={mobileMenuOpen}
//             >
//               <i className="fas fa-bars" aria-hidden="true"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} role="menu">
//           <button
//             className="close-btn"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//           >
//             &times;
//           </button>
//           <ul>
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           <div className="mobile-actions">
//             {isLoggedIn ? (
//               <>
//                 <button className="btn-gradientt" onClick={handleProfileClick}>Profile</button>
//                 <button className="btn-outline" onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={closeAuth}
//         onLoginSuccess={() => {
//           setIsLoggedIn(true);
//           closeAuth();
//         }}
//       />
//     </>
//   );
// }

// export default Navbar;










// import React, { useState, useContext, useEffect } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import AuthModal from "./AuthModal";
// import "./Navbar.css";

// function Navbar({ onCartToggle }) {
//   const { cartItems } = useContext(CartContext);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const navigate = useNavigate();
//   const { clearCart } = useContext(CartContext);

//   // Check login status on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   function openAuth(view) {
//     setAuthModal({ open: true, view });
//     setMobileMenuOpen(false);
//   }

//   function closeAuth() {
//     setAuthModal({ open: false, view: "register" });
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     clearCart(); 
//     setIsLoggedIn(false);
//     setMobileMenuOpen(false);
//     navigate("/");
//   }

//   // Close mobile menu on navigation
//   function handleLinkClick() {
//     setMobileMenuOpen(false);
//   }

//   // Navigate to profile on user icon click
//   function handleProfileClick() {
//     navigate("/profile");
//   }

//   return (
//     <>
//       <nav className="navbar" role="navigation" aria-label="Main navigation">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-logo">
//             WIG<span>BYOPE</span>
//           </div>

//           {/* Desktop Links */}
//           <ul className="navbar-links">
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           {/* Actions */}
//           <div className="navbar-actions">
//             {/* Cart Button */}
//             <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
//               <i className="fas fa-shopping-bag" aria-hidden="true"></i>
//               {cartItems.length > 0 && (
//                 <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
//               )}
//             </button>

//             {/* User Auth / Profile */}
//             {isLoggedIn ? (
//               <button
//                 className="icon-btn user-icon-btn"
//                 aria-label="Go to profile"
//                 onClick={handleProfileClick}
//               >
//                 <i className="fas fa-user-circle" aria-hidden="true"></i>
//               </button>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="mobile-menu-btn"
//               aria-label="Toggle mobile menu"
//               aria-expanded={mobileMenuOpen}
//             >
//               <i className="fas fa-bars" aria-hidden="true"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} role="menu">
//           <button
//             className="close-btn"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//           >
//             &times;
//           </button>
//           <ul>
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           <div className="mobile-actions">
//             {isLoggedIn ? (
//               <>
//                 <button className="btn-gradientt" onClick={handleProfileClick}>Profile</button>
//                 <button className="btn-outline" onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={closeAuth}
//         onLoginSuccess={() => {
//           setIsLoggedIn(true);
//           closeAuth();
//         }}
//       />
//     </>
//   );
// }

// export default Navbar;






// import React, { useState, useContext, useEffect, useRef } from "react";
// import { CartContext } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import AuthModal from "./AuthModal";
// import "./Navbar.css";

// function Navbar({ onCartToggle }) {
//   const { cartItems } = useContext(CartContext);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [authModal, setAuthModal] = useState({ open: false, view: "register" });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);

//   const navigate = useNavigate();
//   const userMenuRef = useRef();
//   const { clearCart } = useContext(CartContext);


//   // Check login status on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   // Close user menu if clicked outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setUserMenuOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   function openAuth(view) {
//     setAuthModal({ open: true, view });
//     setMobileMenuOpen(false);
//     setUserMenuOpen(false);
//   }

//   function closeAuth() {
//     setAuthModal({ open: false, view: "register" });
//   }

//   function handleLogout() {
//     localStorage.removeItem("token");
//     clearCart(); 
//     setIsLoggedIn(false);
//     setMobileMenuOpen(false);
//     setUserMenuOpen(false);
//     navigate("/");
//   }

//   // Close mobile menu on navigation
//   function handleLinkClick() {
//     setMobileMenuOpen(false);
//   }

//   return (
//     <>
//       <nav className="navbar" role="navigation" aria-label="Main navigation">
//         <div className="navbar-container">
//           {/* Logo */}
//           <div className="navbar-logo">
//             WIG<span>BYOPE</span>
//           </div>

//           {/* Desktop Links */}
//           <ul className="navbar-links">
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             {/* <li><Link to="/blog" onClick={handleLinkClick}>Blog</Link></li> */}
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           {/* Actions */}
//           <div className="navbar-actions">
//             {/* Cart Button */}
//             <button onClick={onCartToggle} className="icon-btn cart-btn" aria-label="Cart">
//               <i className="fas fa-shopping-bag" aria-hidden="true"></i>
//               {cartItems.length > 0 && (
//                 <span className="cart-badge" aria-live="polite">{cartItems.length}</span>
//               )}
//             </button>

//             {/* User Auth / Profile */}
//             {isLoggedIn ? (
//               <div className="user-menu-container" ref={userMenuRef}>
//                 <button
//                   className="icon-btn user-icon-btn"
//                   aria-label="User  menu"
//                   aria-haspopup="true"
//                   aria-expanded={userMenuOpen}
//                   onClick={() => setUserMenuOpen((open) => !open)}
//                 >
//                   <i className="fas fa-user-circle" aria-hidden="true"></i>
//                 </button>
//                 {userMenuOpen && (
//                   <ul className="user-dropdown" role="menu">
//                     <li role="none">
//                       <button role="menuitem" onClick={handleLogout} className="dropdown-logout-btn">
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 )}
//               </div>
//             ) : (
//               <>
//                 {/* <button className="btn-outline" onClick={() => openAuth("login")}>Sign In</button> */}
//                 <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//               </>
//             )}

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="mobile-menu-btn"
//               aria-label="Toggle mobile menu"
//               aria-expanded={mobileMenuOpen}
//             >
//               <i className="fas fa-bars" aria-hidden="true"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`} role="menu">
//           <button
//             className="close-btn"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//           >
//             &times;
//           </button>
//           <ul>
//             <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
//             <li><Link to="/shop" onClick={handleLinkClick}>Shop</Link></li>
//             <li><Link to="/training" onClick={handleLinkClick}>Training</Link></li>
//             <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
//             {/* <li><Link to="/blog" onClick={handleLinkClick}>Blog</Link></li> */}
//             <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
//           </ul>

//           <div className="mobile-actions">
//             {isLoggedIn ? (
//               <>
//                 <button className="btn-gradientt" onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <>
//                 {/* <button className="btn-outline" onClick={() => openAuth("login")}>Sign In</button> */}
//                 <button className="btn-gradientt" onClick={() => openAuth("register")}>Sign Up</button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={authModal.open}
//         view={authModal.view}
//         onClose={closeAuth}
//         onLoginSuccess={() => {
//           setIsLoggedIn(true);
//           closeAuth();
//         }}
//       />
//     </>
//   );
// }

// export default Navbar;









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