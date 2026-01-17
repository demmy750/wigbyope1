// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import { CopyToClipboard } from 'react-copy-to-clipboard'; // Optional: npm install react-copy-to-clipboard
// import "./Order.css";

// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [copiedOrderId, setCopiedOrderId] = useState(null);
//   const navigate = useNavigate();

//   // Currency symbol mapper (dynamic per order)
//   const getCurrencySymbol = (currency) => {
//     const symbols = {
//       USD: '$',
//       NGN: '₦',
//       GBP: '£',
//       CAD: '$',
//       ZAR: 'R',
//       EUR: '€',
//     };
//     return symbols[currency] || '$';
//   };

//   // Fetch orders on mount
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         setLoading(true);
//         setError("");
//         const data = await fetchWithAuth("/orders");
//         setOrders(data || []);
//       } catch (err) {
//         console.error("Fetch orders error:", err);
//         setError(err.message || "Failed to load orders. Please try refreshing.");
//         // Redirect to login if unauthorized
//         if (err.message.includes("Unauthorized")) {
//           setTimeout(() => {
//             navigate("/login?redirect=/orders");
//           }, 2000);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchOrders();
//   }, [navigate]);

//   // Copy order ID handler (optional)
//   const handleCopyOrderId = (orderId) => {
//     setCopiedOrderId(orderId);
//     setTimeout(() => setCopiedOrderId(null), 2000);
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p className="loading-text">Loading your orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error-icon">⚠️</div>
//         <h2 className="error-title">Error Loading Orders</h2>
//         <p className="error-message">{error}</p>
//         <button onClick={() => window.location.reload()} className="error-button">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="empty-container">
//         <div className="empty-icon">📦</div>
//         <h2 className="empty-title">No Orders Yet</h2>
//         <p className="empty-message">You haven't placed any orders. Start shopping to see your history here!</p>
//         <Link to="/" className="empty-button">
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <h1 className="orders-title">My Orders</h1>
//         <p className="orders-subtitle">Here's a list of your recent orders. Click "View Details" for more info.</p>
//       </div>

//       <div className="orders-table-container">
//         {/* Desktop Table */}
//         <table className="orders-table" role="table" aria-label="Orders history">
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Total</th>
//               <th>Items</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => {
//               const symbol = getCurrencySymbol(order.currency);
//               const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
//               const statusClass = order.status.toLowerCase().replace(' ', '-');

//               return (
//                 <tr key={order._id} className="order-row">
//                   <td className="order-id-cell">
//                     <span className="order-id">#{order._id}</span>
//                     <CopyToClipboard text={order._id}>
//                       <button
//                         onClick={() => handleCopyOrderId(order._id)}
//                         className="copy-button"
//                         aria-label="Copy order ID"
//                       >
//                         📋
//                       </button>
//                     </CopyToClipboard>
//                   </td>
//                   <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td className="status-cell">
//                     <span className={`status-badge ${statusClass}`}>{order.status}</span>
//                   </td>
//                   <td className="total-cell">{symbol}{order.totalPrice.toLocaleString()}</td>
//                   <td className="items-cell">{itemCount} items</td>
//                   <td className="actions-cell">
//                     <Link
//                       to={`/order-success/${order._id}`}
//                       className="view-button"
//                       aria-label={`View details for order ${order._id}`}
//                     >
//                       View Details
//                     </Link>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* Mobile Cards (hidden on desktop) */}
//         <div className="orders-cards">
//           {orders.map((order) => {
//             const symbol = getCurrencySymbol(order.currency);
//             const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
//             const statusClass = order.status.toLowerCase().replace(' ', '-');

//             return (
//               <div key={order._id} className="order-card">
//                 <div className="card-header">
//                   <span className="order-id-mobile">#{order._id}</span>
//                   <span className="status-badge-mobile paid">{order.status}</span>
//                 </div>
//                 <div className="card-body">
//                   <p className="card-date">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                   <p className="card-total">Total: {symbol}{order.totalPrice.toLocaleString()}</p>
//                   <p className="card-items">{itemCount} items</p>
//                 </div>
//                 <div className="card-actions">
//                   <Link
//                     to={`/order-success/${order._id}`}
//                     className="view-button-mobile"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }



















import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./Order.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const navigate = useNavigate();

  // Currency symbol mapper (dynamic per order)
  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: '$',
      NGN: '₦',
      GBP: '£',
      CAD: '$',
      ZAR: 'R',
      EUR: '€',
    };
    return symbols[currency] || '$';
  };

  // Fetch orders on mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchWithAuth("/orders");
        setOrders(data || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message || "Failed to load orders. Please try refreshing.");
        // Redirect to login if unauthorized
        if (err.message.includes("Unauthorized")) {
          setTimeout(() => {
            navigate("/login?redirect=/orders");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [navigate]);

  // UPDATED: Native copy-to-clipboard handler (no external package needed)
  const handleCopyOrderId = async (orderId) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy order ID:", err);
      // Fallback for older browsers: Use a temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Error Loading Orders</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="error-button">
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">📦</div>
        <h2 className="empty-title">No Orders Yet</h2>
        <p className="empty-message">You haven't placed any orders. Start shopping to see your history here!</p>
        <Link to="/" className="empty-button">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">Here's a list of your recent orders. Click "View Details" for more info.</p>
      </div>

      <div className="orders-table-container">
        {/* Desktop Table */}
        <table className="orders-table" role="table" aria-label="Orders history">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const symbol = getCurrencySymbol(order.currency);
              const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
              const statusClass = order.status.toLowerCase().replace(' ', '-');

              return (
                <tr key={order._id} className="order-row">
                  <td className="order-id-cell">
                    <span className="order-id">#{order._id}</span>
                    {/* UPDATED: Removed CopyToClipboard wrapper, now just a button */}
                    <button
                      onClick={() => handleCopyOrderId(order._id)}
                      className="copy-button"
                      aria-label="Copy order ID"
                    >
                      📋
                    </button>
                    {copiedOrderId === order._id && <span className="copied-text">Copied!</span>}
                  </td>
                  <td className="date-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${statusClass}`}>{order.status}</span>
                  </td>
                  <td className="total-cell">{symbol}{order.totalPrice.toLocaleString()}</td>
                  <td className="items-cell">{itemCount} items</td>
                  <td className="actions-cell">
                    <Link
                      to={`/order-success/${order._id}`}
                      className="view-button"
                      aria-label={`View details for order ${order._id}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Mobile Cards (hidden on desktop) */}
        <div className="orders-cards">
          {orders.map((order) => {
            const symbol = getCurrencySymbol(order.currency);
            const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
            const statusClass = order.status.toLowerCase().replace(' ', '-');

            return (
              <div key={order._id} className="order-card">
                <div className="card-header">
                  <span className="order-id-mobile">#{order._id}</span>
                  <span className="status-badge-mobile paid">{order.status}</span>
                </div>
                <div className="card-body">
                  <p className="card-date">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="card-total">Total: {symbol}{order.totalPrice.toLocaleString()}</p>
                  <p className="card-items">{itemCount} items</p>
                </div>
                <div className="card-actions">
                  <Link
                    to={`/order-success/${order._id}`}
                    className="view-button-mobile"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}