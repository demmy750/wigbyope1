// src/pages/OrderTracking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Mock API (replace with real one later)
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch(() => setOrder(null));
  }, [orderId]);

  if (!order) return <p>Loading or order not found...</p>;

  return (
    <section>
      <h1>Order Tracking</h1>
      <p><strong>Order ID:</strong> {order.id || order._id}</p>
      <p><strong>Payment:</strong> {order.paymentMethod}</p>
      <p><strong>Total:</strong> ${order.totalAmount}</p>
      <p>Status: ✅ Order Confirmed</p>
    </section>
  );
};

export default OrderTracking;
