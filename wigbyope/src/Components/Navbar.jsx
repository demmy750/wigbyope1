import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onCartToggle }) {
  const { cartItems } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function toggleMobileMenu() {
    setMobileMenuOpen((open) => !open);
  }

  function handleLinkClick() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={handleLinkClick} style={{ textDecoration: "none", color: "inherit" }}>
              WIG<span>BYOPE</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="navbar-links">
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Shop", path: "/shop" },
              { name: "Training", path: "/training" },
              { name: "About", path: "/about" },
              { name: "Blog", path: "/blog" },
              { name: "Contact", path: "/contact" },
            ].map(({ name, path }) => (
              <li key={name}>
                <Link to={path} className="nav-link" onClick={handleLinkClick}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons + Buttons */}
          <div className="navbar-actions">
            <button
              onClick={() => alert("Search feature coming soon!")}
              className="icon-btn"
              aria-label="Open search"
            >
              <i className="fas fa-search"></i>
            </button>

            <button
              onClick={onCartToggle}
              className="icon-btn cart-btn"
              aria-label="Open cart"
            >
              <i className="fas fa-shopping-bag"></i>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>

            <button className="btn-outline">Sign In</button>
            <button className="btn-gradient">Sign Up</button>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <button
            className="close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          <ul>
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "Shop", path: "/shop" },
              { name: "Training", path: "/training" },
              { name: "About", path: "/about" },
              { name: "Blog", path: "/blog" },
              { name: "Contact", path: "/contact" },
            ].map(({ name, path }) => (
              <li key={name}>
                <Link to={path} onClick={handleLinkClick}>
                  {name}
                </Link>
              </li>
            ))}
            <li className="mobile-actions">
              <button className="btn-outline">Sign In</button>
              <button className="btn-gradient">Sign Up</button>
            </li>
          </ul>
        </div>
      </nav>
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