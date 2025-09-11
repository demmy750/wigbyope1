// import React, { useState } from "react";
// import styles from "./Cart.module.css";

// const initialCartItems = [
//   {
//     id: 1,
//     name: "Premium Lace Wig",
//     price: 120.0,
//     quantity: 1,
//     image:
//       "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 2,
//     name: "Box Braids Extension",
//     price: 80.0,
//     quantity: 2,
//     image:
//       "https://images.unsplash.com/photo-1614289377761-3a3a3a3a3a3a?auto=format&fit=crop&w=400&q=80",
//   },
// ];

// export default function Cart() {
//   const [cartItems, setCartItems] = useState(initialCartItems);

//   const handleQuantityChange = (id, newQty) => {
//     if (newQty < 1) return;
//     setCartItems((items) =>
//       items.map((item) =>
//         item.id === id ? { ...item, quantity: newQty } : item
//       )
//     );
//   };

//   const handleRemove = (id) => {
//     setCartItems((items) => items.filter((item) => item.id !== id));
//   };

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   return (
//     <main className={styles.cartPage}>
//       <h1 className={styles.title}>Your Shopping Cart</h1>
//       {cartItems.length === 0 ? (
//         <p className={styles.emptyMessage}>Your cart is empty.</p>
//       ) : (
//         <>
//           <ul className={styles.cartList}>
//             {cartItems.map(({ id, name, price, quantity, image }) => (
//               <li key={id} className={styles.cartItem}>
//                 <img
//                   src={image}
//                   alt={name}
//                   className={styles.productImage}
//                   loading="lazy"
//                 />
//                 <div className={styles.productDetails}>
//                   <h2 className={styles.productName}>{name}</h2>
//                   <p className={styles.productPrice}>
//                     ${price.toFixed(2)}
//                   </p>
//                   <label htmlFor={`qty-${id}`} className={styles.qtyLabel}>
//                     Quantity:
//                   </label>
//                   <input
//                     id={`qty-${id}`}
//                     type="number"
//                     min="1"
//                     value={quantity}
//                     onChange={(e) =>
//                       handleQuantityChange(id, parseInt(e.target.value, 10))
//                     }
//                     className={styles.qtyInput}
//                   />
//                 </div>
//                 <button
//                   className={styles.removeBtn}
//                   onClick={() => handleRemove(id)}
//                   aria-label={`Remove ${name} from cart`}
//                 >
//                   &times;
//                 </button>
//               </li>
//             ))}
//           </ul>

//           <div className={styles.summary}>
//             <p className={styles.subtotal}>
//               Subtotal: <strong>${subtotal.toFixed(2)}</strong>
//             </p>
//             <div className={styles.actions}>
//               <button
//                 className={styles.continueBtn}
//                 onClick={() => window.location.href = "/shop"}
//               >
//                 Continue Shopping
//               </button>
//               <button
//                 className={styles.checkoutBtn}
//                 onClick={() => window.location.href = "/checkout"}
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </main>
//   );
// }