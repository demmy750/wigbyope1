import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

const styles = {
  container: {
    padding: "1.5rem",
    fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#4a4a4a",
    backgroundColor: "#fff8f5",
    minHeight: "100%",
  },
  heading1: {
    fontSize: "1.75rem",
    fontWeight: "700",
    marginBottom: "1rem",
    fontFamily: "'Playfair Display', serif",
    color: "#6f42c1",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  gridMd4: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(111, 66, 193, 0.1)",
    color: "#3a3a3a",
  },
  cardLabel: {
    color: "#7e7e7e",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  },
  cardValue: {
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  heading2: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#6f42c1",
    fontFamily: "'Playfair Display', serif",
  },
  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(111, 66, 193, 0.1)",
    padding: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#3a3a3a",
  },
  theadTr: {
    borderBottom: "2px solid #d1c4e9",
  },
  th: {
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#6f42c1",
  },
  tbodyTr: {
    borderBottom: "1px solid #e0d7f5",
  },
  td: {
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
  },
  noOrdersRow: {
    textAlign: "center",
    color: "#9e9e9e",
    padding: "1.5rem",
    fontStyle: "italic",
  },
  loadingError: {
    padding: "1.5rem",
    fontSize: "1rem",
  },
  errorText: {
    color: "#dc2626", // red-600
  },
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await fetchWithAuth("/admin/dashboard");
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return <p style={styles.loadingError}>Loading dashboard...</p>;

  if (error)
    return (
      <p style={{ ...styles.loadingError, ...styles.errorText }}>
        Error: {error}
      </p>
    );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading1}>Admin Dashboard</h1>

      <div
        style={{
          ...styles.grid,
          ...(window.innerWidth >= 768 ? styles.gridMd4 : {}),
        }}
      >
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Users</p>
          <p style={styles.cardValue}>{dashboardData.usersCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Products</p>
          <p style={styles.cardValue}>{dashboardData.productsCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Orders</p>
          <p style={styles.cardValue}>{dashboardData.ordersCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Sales</p>
          <p style={styles.cardValue}>
            ${dashboardData.totalSales.toFixed(2)}
          </p>
        </div>
      </div>

      <h2 style={styles.heading2}>Recent Orders</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadTr}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentOrders.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noOrdersRow}>
                  No recent orders found.
                </td>
              </tr>
            ) : (
              dashboardData.recentOrders.map((order) => (
                <tr key={order._id} style={styles.tbodyTr}>
                  <td style={styles.td}>{order._id}</td>
                  <td style={styles.td}>{order.user?.name || "N/A"}</td>
                  <td style={styles.td}>${order.totalPrice.toFixed(2)}</td>
                  <td style={styles.td}>{order.status}</td>
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;