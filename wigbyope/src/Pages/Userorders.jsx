import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./Userders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchWithAuth("/orders");
      setOrders(response);
      setFilteredOrders(response);
    } catch (err) {
      setError("Failed to fetch orders. Please check your connection and try again.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error} <button onClick={fetchOrders}>Retry</button></div>;

  return (
    <div className="user-orders">
      <h2>Your Orders</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="5">No orders found.</td>
            </tr>
          ) : (
            filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>${order.totalPrice}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/order-success/${order._id}`} className="view-btn">View Details</Link>
                  {/* <Link to={`/track-order/${order._id}`} className="track-btn">Track</Link> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrders;