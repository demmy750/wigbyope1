import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Users</p>
          <p className="text-xl font-semibold">{dashboardData.usersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Products</p>
          <p className="text-xl font-semibold">{dashboardData.productsCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-xl font-semibold">{dashboardData.ordersCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Sales</p>
          <p className="text-xl font-semibold">${dashboardData.totalSales.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
      <div className="overflow-x-auto bg-white rounded shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentOrders.map((order) => (
              <tr key={order._id} className="border-b border-gray-200">
                <td className="py-2 px-3">{order._id}</td>
                <td className="py-2 px-3">{order.user?.name || "N/A"}</td>
                <td className="py-2 px-3">${order.totalPrice.toFixed(2)}</td>
                <td className="py-2 px-3">{order.status}</td>
                <td className="py-2 px-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;