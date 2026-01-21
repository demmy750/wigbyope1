// src/context/CartProvider.jsx
// import React, { useState, useMemo } from "react";
// import { CartContext } from "./CartContext";

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([]);

//   function addToCart(product) {
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item._id === product._id);

//       if (existing) {
//         return prev.map((item) =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       // Ensure price is always a number
//       return [
//         ...prev,
//         { ...product, quantity: 1, price: Number(product.price) },
//       ];
//     });
//   }

//   function removeFromCart(productId) {
//     setCartItems((prev) => prev.filter((item) => item._id !== productId));
//   }

//   function updateQuantity(productId, quantity) {
//     if (quantity < 1) return;
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item._id === productId ? { ...item, quantity } : item
//       )
//     );
//   }

//   function clearCart() {
//     setCartItems([]);
//   }

//   const total = useMemo(() => {
//     return cartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   }, [cartItems]);

//   const value = useMemo(
//     () => ({
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       total,
//     }),
//     [cartItems, total]
//   );

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// }






// import React, { useState, useMemo, useContext } from "react";
// import { CartContext } from "./CartContext";
// import { CurrencyContext } from "./CurrencyContext";

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([]);
//   const currencyCtx = useContext(CurrencyContext);

//   function addToCart(product) {
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item._id === product._id);
//       if (existing) {
//         return prev.map((item) =>
//           item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1, price: Number(product.price) }];
//     });
//   }

//   function removeFromCart(productId) {
//     setCartItems((prev) => prev.filter((item) => item._id !== productId));
//   }

//   function updateQuantity(productId, quantity) {
//     if (quantity < 1) return;
//     setCartItems((prev) =>
//       prev.map((item) => item._id === productId ? { ...item, quantity } : item)
//     );
//   }

//   function clearCart() {
//     setCartItems([]);
//   }

//   const baseTotal = useMemo(() => 
//     cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
//     [cartItems]
//   );

//   const displayTotal = useMemo(() => {
//     if (!currencyCtx || currencyCtx.isLoading) return baseTotal;
//     return parseFloat(currencyCtx.getConvertedPrice(baseTotal));
//   }, [baseTotal, currencyCtx]);

//   const value = useMemo(() => ({
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     baseTotal, // USD for backend
//     displayTotal, // Converted for UI
//     total: displayTotal, // Backward compat
//   }), [cartItems, baseTotal, displayTotal]);

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// }



import React, { useState, useMemo, useContext, useEffect } from "react";  // Added useEffect
import { CartContext } from "./CartContext";
import { CurrencyContext } from "./CurrencyContext";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const currencyCtx = useContext(CurrencyContext);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate: Ensure it's an array and items have required fields
        if (Array.isArray(parsedCart) && parsedCart.every(item => item._id && item.name && typeof item.quantity === 'number')) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // If invalid, start with empty cart (or handle differently)
    }
  }, []);  // Empty dependency array: Runs only on mount

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, price: Number(product.price) }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => item._id === productId ? { ...item, quantity } : item)
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const baseTotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const displayTotal = useMemo(() => {
    if (!currencyCtx || currencyCtx.isLoading) return baseTotal;
    return parseFloat(currencyCtx.getConvertedPrice(baseTotal));
  }, [baseTotal, currencyCtx]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    baseTotal, // USD for backend
    displayTotal, // Converted for UI
    total: displayTotal, // Backward compat
  }), [cartItems, baseTotal, displayTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}