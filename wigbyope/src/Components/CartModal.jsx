// import React, { useContext } from "react";
// import CartContext  from "../context/CartContext";

//  function CartModal({ isOpen, onClose }) {
//   const { cart, removeFromCart, total } = useContext(CartContext);

//   return (
//     <div
//       className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform z-50 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       }`}
//       aria-hidden={!isOpen}
//       role="dialog"
//       aria-modal="true"
//     >
//       <div className="p-6 flex flex-col h-full">
//         <h3 className="text-2xl font-semibold mb-6">Your Cart</h3>
//         <div className="flex-grow overflow-y-auto" id="cart-items">
//           {cart.length === 0 && <p>Your cart is empty.</p>}
//           {cart.map((item) => (
//             <div
//               key={item.id}
//               className="cart-item py-4 border-b border-gray-200"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h4 className="font-semibold">{item.name}</h4>
//                   <p className="text-gray-600">Qty: {item.quantity}</p>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="font-semibold mr-4">
//                     ${item.price * item.quantity}
//                   </span>
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-500 hover:text-red-700"
//                     aria-label={`Remove ${item.name} from cart`}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="border-t pt-4 mt-4">
//           <div className="flex justify-between text-lg font-semibold">
//             <span>Total:</span>
//             <span>${total.toFixed(2)}</span>
//           </div>
//           <button className="w-full mt-4 bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600">
//             Checkout
//           </button>
//           <button
//             onClick={onClose}
//             className="w-full mt-2 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default CartModal;