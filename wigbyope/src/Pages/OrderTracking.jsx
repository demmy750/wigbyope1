import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./OrderTracking.css";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

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
      setError(null);
      const data = await fetchWithAuth(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load order details.");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId, fetchOrder]);

  const handleRetry = () => {
    setRetrying(true);
    fetchOrder();
  };

  if (loading || retrying) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p className="loading-text">{retrying ? "Retrying..." : "Loading order details..."}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <div className="error-icon" aria-hidden="true">❌</div>
        <h2 className="error-title">Order Not Found</h2>
        <p className="error-message">{error}</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="retry-button" disabled={retrying}>
            {retrying ? "Retrying..." : "Try Again"}
          </button>
          <Link to="/orders" className="error-button">View All Orders</Link>
        </div>
      </div>
    );
  }

  const symbol = getCurrencySymbol(order.currency);

  // Status steps up to current status
  const statusSteps = [
    { label: 'Ordered', icon: '📦', key: 'ordered' },
    { label: 'Processing', icon: '⚙️', key: 'processing' },
    { label: 'Customizing', icon: '✂️', key: 'customizing' },
    { label: 'Shipped', icon: '🚚', key: 'shipped' },
    { label: 'Delivered', icon: '✅', key: 'delivered' },
  ];
  const statusIndex = statusSteps.findIndex(step => step.key === order.status.toLowerCase());
  const visibleSteps = statusSteps.slice(0, statusIndex + 1);

  return (
    <div className="order-tracking-container">
      <h1>Order Tracking</h1>
      <p><strong>Order ID:</strong> {order._id}</p>

      {/* Status Progress */}
      <div className="status-progress" role="progressbar" aria-valuenow={(statusIndex + 1) * 20} aria-valuemin="0" aria-valuemax="100">
        {visibleSteps.map((step, index) => (
          <div key={step.key} className={`status-step ${index === statusIndex ? 'active' : 'completed'}`}>
            <span className="status-icon" aria-hidden="true">{step.icon}</span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      {/* Order Details */}
      <section className="tracking-details">
        <h2>Order Details</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</p>
        <p><strong>Total:</strong> {symbol}{order.totalPrice.toFixed(2)}</p>
        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        {order.paidAt && <p><strong>Paid On:</strong> {new Date(order.paidAt).toLocaleString()}</p>}
      </section>

      {/* Shipping Details */}
      <section className="tracking-shipping">
        <h2>Shipping Address</h2>
        <p><strong>Name:</strong> {order.shippingAddress.name}</p>
        <p><strong>Address:</strong> {order.shippingAddress.address}</p>
        <p><strong>City:</strong> {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        <p><strong>Country:</strong> {order.shippingAddress.country}</p>
        <p><strong>Email:</strong> {order.shippingAddress.email}</p>
        <p><strong>Phone:</strong> {order.shippingAddress.phone || 'N/A'}</p>
      </section>

      {/* Actions */}
      <div className="tracking-actions">
        <Link to={`/order-success/${orderId}`} className="action-button">View Full Details</Link>
        <Link to="/usersorders" className="action-button secondary">View All Orders</Link>
      </div>
    </div>
  );
};

export default OrderTracking;