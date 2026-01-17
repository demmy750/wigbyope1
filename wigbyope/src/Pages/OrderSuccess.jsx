


// import React, { useEffect, useState, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import "./ordersucess.css"; // Updated CSS file name for consistency

// export default function OrderSuccessPage() {
//   const { id } = useParams(); // Order ID from URL
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [retrying, setRetrying] = useState(false);

//   // Currency symbol mapper (dynamic)
//   const getCurrencySymbol = useCallback((currency) => {
//     const symbols = {
//       USD: '$',
//       NGN: '₦',
//       GBP: '£',
//       CAD: '$',
//       ZAR: 'R',
//       EUR: '€',
//     };
//     return symbols[currency] || '$';
//   }, []);

//   // Fetch order details
//   const fetchOrder = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const data = await fetchWithAuth(`/orders/${id}`);
//       setOrder(data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError(err.message || "Failed to load order details. Please try again.");
//       if (err.message.includes("Unauthorized") || err.status === 401) {
//         setTimeout(() => navigate("/login?redirect=/order-success/" + id), 2000);
//       }
//     } finally {
//       setLoading(false);
//       setRetrying(false);
//     }
//   }, [id, navigate]);

//   useEffect(() => {
//     if (id) fetchOrder();
//   }, [id, fetchOrder]);

//   // Handle retry
//   const handleRetry = () => {
//     setRetrying(true);
//     fetchOrder();
//   };

//   // Print order summary
//   const handlePrint = () => {
//     window.print();
//   };

//   if (loading || retrying) {
//     return (
//       <div className="loading-container" role="status" aria-live="polite">
//         <div className="loading-spinner" aria-hidden="true"></div>
//         <p className="loading-text">{retrying ? "Retrying..." : "Loading your order details..."}</p>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="error-container">
//         <div className="error-icon" aria-hidden="true">❌</div>
//         <h2 className="error-title">Oops! Something went wrong</h2>
//         <p className="error-message">{error}</p>
//         <div className="error-actions">
//           <button onClick={handleRetry} className="retry-button" disabled={retrying}>
//             {retrying ? "Retrying..." : "Try Again"}
//           </button>
//           <Link to="/" className="error-button">Go Home</Link>
//         </div>
//       </div>
//     );
//   }

//   const symbol = getCurrencySymbol(order.currency);

//   return (
//     <div className="order-success-container">
//       <div className="success-header">
//         <div className="celebration-icon" aria-hidden="true">🎉</div>
//         <h1 className="success-title">Order Placed Successfully!</h1>
//         <p className="success-subtitle">
//           Thank you for your purchase! Your order <span className="order-id">#{order._id}</span> is confirmed.
//         </p>
//         <p className="email-note">A confirmation email has been sent to {order.shippingAddress.email}.</p>
//       </div>

//       {/* Order Status Progress */}
//       <div className="status-progress">
//         <div className={`status-step ${order.isPaid ? 'completed' : ''}`}>
//           <span>Paid</span>
//         </div>
//         <div className={`status-step ${order.status === 'Processing' ? 'active' : order.status === 'Shipped' || order.status === 'Delivered' ? 'completed' : ''}`}>
//           <span>Processing</span>
//         </div>
//         <div className={`status-step ${order.status === 'Shipped' ? 'active' : order.status === 'Delivered' ? 'completed' : ''}`}>
//           <span>Shipped</span>
//         </div>
//         <div className={`status-step ${order.status === 'Delivered' ? 'completed' : ''}`}>
//           <span>Delivered</span>
//         </div>
//       </div>

//       {/* Order Summary */}
//       <section className="card-section" aria-labelledby="summary-title">
//         <h2 id="summary-title" className="section-title">Order Summary</h2>
//         <ul className="items-list" role="list">
//           {order.orderItems.map((item, index) => (
//             <li key={index} className="item-row" role="listitem">
//               <div className="item-info">
//                 <span className="item-name">{item.name}</span>
//                 <span className="item-qty">Qty: {item.qty}</span>
//                 {item.image && <img src={item.image} alt={item.name} className="item-image" />}
//               </div>
//               <span className="item-price">{symbol}{(item.price * item.qty).toLocaleString()}</span>
//             </li>
//           ))}
//         </ul>
//         <div className="total-row">
//           <span className="total-label">Total ({order.currency})</span>
//           <span className="total-amount">{symbol}{order.totalPrice.toLocaleString()}</span>
//         </div>
//       </section>

//       {/* Order Details */}
//       <section className="card-section" aria-labelledby="details-title">
//         <h2 id="details-title" className="section-title">Order Details</h2>
//         <div className="details-grid">
//           <p><span className="detail-label">Status:</span> <span className={`detail-value status-${order.status.toLowerCase()}`}>{order.status}</span></p>
//           <p><span className="detail-label">Payment Method:</span> <span className="detail-value">{order.paymentMethod}</span></p>
//           <p><span className="detail-label">Order Date:</span> <span className="detail-value">{new Date(order.createdAt).toLocaleString()}</span></p>
//           {order.paidAt && <p><span className="detail-label">Paid On:</span> <span className="detail-value">{new Date(order.paidAt).toLocaleString()}</span></p>}
//           {order.isPaid && <p><span className="detail-label">Payment ID:</span> <span className="detail-value">{order.paymentResult?.id}</span></p>}
//         </div>
//       </section>

//       {/* Shipping Details */}
//       <section className="card-section" aria-labelledby="shipping-title">
//         <h2 id="shipping-title" className="section-title">Shipping Address</h2>
//         <div className="shipping-details">
//           <p><span className="detail-label">Name:</span> <span className="detail-value">{order.shippingAddress.name}</span></p>
//           <p><span className="detail-label">Address:</span> <span className="detail-value">{order.shippingAddress.address}</span></p>
//           <p><span className="detail-label">City:</span> <span className="detail-value">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span></p>
//           <p><span className="detail-label">Country:</span> <span className="detail-value">{order.shippingAddress.country}</span></p>
//           <p><span className="detail-label">Email:</span> <span className="detail-value">{order.shippingAddress.email}</span></p>
//           <p><span className="detail-label">Phone:</span> <span className="detail-value">{order.shippingAddress.phone || 'N/A'}</span></p>
//         </div>
//       </section>

//       {/* Actions */}
//       <section className="card-section actions-section" aria-labelledby="actions-title">
//         <h2 id="actions-title" className="sr-only">Actions</h2> {/* Screen reader only */}
//         <div className="actions-grid">
//           <Link to="/" className="action-button primary-button">Continue Shopping</Link>
//           <Link to="/orders" className="action-button secondary-button">View All Orders</Link>
//           <button onClick={() => navigate(`/track-order/${id}`)} className="action-button track-button">Track Order</button>
//           <button onClick={handlePrint} className="action-button print-button">Print Order</button>
//         </div>
//         <p className="support-note">Need help? Contact support at support@yourwebsite.com</p>
//       </section>
//     </div>
//   );
// }





import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./ordersucess.css";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getCurrencySymbol = useCallback((currency) => {
    const symbols = {
      USD: '$',
      NGN: '₦',
      GBP: '£',
      CAD: '$',
      ZAR: 'R',
      EUR: '€',
    };
    return symbols[currency] || '$';
  }, []);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchWithAuth(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load order details. Please try again.");
      if (err.message.includes("Unauthorized") || err.status === 401) {
        setTimeout(() => navigate("/login?redirect=/order-success/" + id), 2000);
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id, fetchOrder]);

  const handleRetry = () => {
    setRetrying(true);
    fetchOrder();
  };

  // Commented out the entire handleDownloadInvoice function for now
  /*
  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');  // Adjust if your token storage differs
      const response = await fetch(`/api/orders/${id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error('Invoice download failed:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
        throw new Error(`Invoice download failed: ${response.status} ${response.statusText}`);
      }
      // Check if the response is actually a PDF
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Invoice download failed: Server did not return a valid PDF. Please contact support.');
      }
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'Content-Type:', contentType);  // Debug blob details
      if (blob.size === 0) {
        throw new Error('Invoice download failed: Received empty file. Please contact support.');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Invoice download error:', err);
      alert(`Failed to download invoice: ${err.message}. Please try again or contact support.`);
    } finally {
      setDownloading(false);
    }
  };
  */

  if (loading || retrying) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p className="loading-text">{retrying ? "Retrying..." : "Loading your order details..."}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <div className="error-icon" aria-hidden="true">❌</div>
        <h2 className="error-title">Oops! Something went wrong</h2>
        <p className="error-message">{error}</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="retry-button" disabled={retrying}>
            {retrying ? "Retrying..." : "Try Again"}
          </button>
          <Link to="/" className="error-button">Go Home</Link>
        </div>
      </div>
    );
  }

  const symbol = getCurrencySymbol(order.currency);

  // Status steps up to current status
  const statusSteps = [
    // { label: 'Ordered', icon: '📦', key: 'ordered' },
    // { label: 'Processing', icon: '⚙️', key: 'processing' },
    // { label: 'Customizing', icon: '✂️', key: 'customizing' },
    // { label: 'Shipped', icon: '🚚', key: 'shipped' },
    // { label: 'Delivered', icon: '✅', key: 'delivered' },
  ];
  const statusIndex = statusSteps.findIndex(step => step.key === order.status.toLowerCase());
  const visibleSteps = statusSteps.slice(0, statusIndex + 1);

  return (
    <div className="order-success-container">
      <div className="success-header">
        <div className="celebration-icon" aria-hidden="true">🎉</div>
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for your purchase! Your order <span className="order-id">#{order._id}</span> is confirmed.
        </p>
        <p className="email-note">A confirmation email has been sent to {order.shippingAddress.email}.</p>
      </div>

      {/* Order Status Progress - Shows only up to current status */}
      <div className="status-progress" role="progressbar" aria-valuenow={(statusIndex + 1) * 20} aria-valuemin="0" aria-valuemax="100">
        {visibleSteps.map((step, index) => (
          <div key={step.key} className={`status-step ${index === statusIndex ? 'active' : 'completed'}`}>
            <span className="status-icon" aria-hidden="true">{step.icon}</span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

            {/* Order Summary */}
      <section className="card-section" aria-labelledby="summary-title">
        <h2 id="summary-title" className="section-title">Order Summary</h2>
        <ul className="items-list" role="list">
          {order.orderItems.map((item, index) => (
            <li key={index} className="item-row" role="listitem">
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">Qty: {item.qty}</span>
                {item.image && <img src={item.image} alt={item.name} className="item-image" />}
              </div>
              <span className="item-price">{symbol}{(item.price * item.qty).toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="total-row">
          <span className="total-label">Total ({order.currency})</span>
          <span className="total-amount">{symbol}{order.totalPrice.toLocaleString()}</span>
        </div>
      </section>

      {/* Order Details */}
      <section className="card-section" aria-labelledby="details-title">
        <h2 id="details-title" className="section-title">Order Details</h2>
        <div className="details-grid">
          <p><span className="detail-label">Status:</span> <span className={`detail-value status-${order.status.toLowerCase()}`}>{order.status}</span></p>
          <p><span className="detail-label">Payment Method:</span> <span className="detail-value">{order.paymentMethod}</span></p>
          <p><span className="detail-label">Order Date:</span> <span className="detail-value">{new Date(order.createdAt).toLocaleString()}</span></p>
          {order.paidAt && <p><span className="detail-label">Paid On:</span> <span className="detail-value">{new Date(order.paidAt).toLocaleString()}</span></p>}
          {order.isPaid && <p><span className="detail-label">Payment ID:</span> <span className="detail-value">{order.paymentResult?.id}</span></p>}
        </div>
      </section>

      {/* Shipping Details */}
      <section className="card-section" aria-labelledby="shipping-title">
        <h2 id="shipping-title" className="section-title">Shipping Address</h2>
        <div className="shipping-details">
          <p><span className="detail-label">Name:</span> <span className="detail-value">{order.shippingAddress.name}</span></p>
          <p><span className="detail-label">Address:</span> <span className="detail-value">{order.shippingAddress.address}</span></p>
          <p><span className="detail-label">City:</span> <span className="detail-value">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span></p>
          <p><span className="detail-label">Country:</span> <span className="detail-value">{order.shippingAddress.country}</span></p>
          <p><span className="detail-label">Email:</span> <span className="detail-value">{order.shippingAddress.email}</span></p>
          <p><span className="detail-label">Phone:</span> <span className="detail-value">{order.shippingAddress.phone || 'N/A'}</span></p>
        </div>
      </section>

      {/* Actions */}
      <section className="card-section actions-section" aria-labelledby="actions-title">
        <h2 id="actions-title" className="sr-only">Actions</h2>
        <div className="actions-grid">
          <Link to="/shop" className="action-button primary-button">Continue Shopping</Link>
          <Link to="/usersorders" className="action-button secondary-button">View All Orders</Link>
          <button onClick={() => navigate(`/track-order/${id}`)} className="action-button track-button">Track Order</button>
          {/* Commented out the Download Invoice button for now */}
          {/* <button onClick={handleDownloadInvoice} className="action-button invoice-button" disabled={downloading}>
            {downloading ? 'Downloading...' : 'Download Invoice'}
          </button> */}
        </div>
        <p className="support-note">Need help? Contact support at <a href="mailto:wigbyope@gmail.com">wigbyope@gmail.com</a></p>
      </section>
    </div>
  );
}