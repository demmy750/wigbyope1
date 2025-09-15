import React, { useEffect, useState } from "react";
// import fetchWithAuth from "../Components/AuthModal";
import { fetchWithAuth } from "../api";
export default function OrdersTab({ activeTab }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (activeTab !== "orders") return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        // Fetch all orders (admin)
        const data = await fetchWithAuth("/api/orders");
        setOrders(data);
      } catch (err) {
        setOrdersError(err.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetchWithAuth(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated");
    } catch (err) {
      alert("Failed to update order status: " + err.message);
    }
  };

  if (activeTab !== "orders") return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Manage Orders</h3>

      {loadingOrders && <p>Loading orders...</p>}
      {ordersError && <p className="text-red-600">{ordersError}</p>}

      {orders.length === 0 && !loadingOrders && (
        <p className="text-gray-600">No orders found.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Order #{order._id}</h4>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="border rounded p-1"
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

            <p>
              <strong>Customer:</strong> {order.user?.name || "N/A"} (
              {order.user?.email || "N/A"})
            </p>
            <p>
              <strong>Phone:</strong> {order.user?.phone || "N/A"}
            </p>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {order.shippingAddress || "N/A"}
            </p>
            <p>
              <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {order.paymentResult?.status || "N/A"}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-3">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {order.items.map((item) => (
                  <li key={item.product._id || item.product}>
                    {item.product?.name || "Product"} - ${item.price} x {item.quantity}
                    {item.product?.wigType ? ` (${item.product.wigType})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}