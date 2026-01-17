import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./OrdersPage.css"; // Import the CSS

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await fetchWithAuth("/orders");
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="empty-state">
          <h2>No Orders Yet</h2>
          <p>Start shopping to place your first order!</p>
          <Link to="/shop" className="shop-btn">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your recent orders.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">Order #{order._id.substring(0, 8)}...</div>
              <div className="order-status status-pending">{order.status}</div>
            </div>

            <div className="order-meta">
              <div className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="order-total">
                Total: ₦{order.totalPrice.toLocaleString()}
              </div>
            </div>

            <div className="order-items-preview">
              <h3>Items:</h3>
              <ul>
                {order.items.slice(0, 3).map((item) => (
                  <li key={item._id}>
                    {item.product?.name || "Unknown Product"} × {item.quantity}
                  </li>
                ))}
                {order.items.length > 3 && (
                  <li className="more-items">+ {order.items.length - 3} more</li>
                )}
              </ul>
            </div>

            <div className="order-actions">
              <Link
                to={`/orders/${order._id}`}
                className="view-details-btn"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;