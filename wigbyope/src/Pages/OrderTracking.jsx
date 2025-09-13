import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../api";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await fetchWithAuth(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <section>
      <h1>Order Tracking</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Payment:</strong> {order.paymentMethod || "N/A"}</p>
      <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
      <p>Status: {order.status}</p>
    </section>
  );
};

export default OrderTracking;