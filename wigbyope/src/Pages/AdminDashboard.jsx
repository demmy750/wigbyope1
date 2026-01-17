// // src/Pages/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";
// import { fetchWithAuth } from "../api";
// // import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// export default function AdminDashboard() {
//   const [dashboard, setDashboard] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function loadDashboard() {
//       try {
//         const data = await fetchWithAuth("/admin/dashboard");
//         setDashboard(data);
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//     loadDashboard();
//   }, []);

//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
//   if (!dashboard) return <p>Loading dashboard...</p>;

//   return (
//     <main style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
//       <h1>Admin Dashboard</h1>

//       <section style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
//         <div style={{ flex: 1, padding: "1rem", background: "#f5f5f5", borderRadius: 8 }}>
//           <h3>Users</h3>
//           <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{dashboard.usersCount}</p>
//         </div>
//         <div style={{ flex: 1, padding: "1rem", background: "#f5f5f5", borderRadius: 8 }}>
//           <h3>Products</h3>
//           <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{dashboard.productsCount}</p>
//         </div>
//         <div style={{ flex: 1, padding: "1rem", background: "#f5f5f5", borderRadius: 8 }}>
//           <h3>Orders</h3>
//           <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{dashboard.ordersCount}</p>
//         </div>
//         <div style={{ flex: 1, padding: "1rem", background: "#f5f5f5", borderRadius: 8 }}>
//           <h3>Total Sales</h3>
//           <p style={{ fontSize: "2rem", fontWeight: "bold" }}>${dashboard.totalSales.toFixed(2)}</p>
//         </div>
//       </section>

//       <section style={{ marginBottom: "2rem" }}>
//         <h2>Recent Orders</h2>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#ddd" }}>
//               <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Order ID</th>
//               <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>User </th>
//               <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Total Price</th>
//               <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dashboard.recentOrders.map((order) => (
//               <tr key={order._id}>
//                 <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{order._id.slice(-6)}</td>
//                 <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>{order.user.name}</td>
//                 <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>${order.totalPrice.toFixed(2)}</td>
//                 <td style={{ padding: "0.5rem", border: "1px solid #ccc" }}>
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section>
//         <h2>Sales in Last 30 Days</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={dashboard.salesData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="_id" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="dailySales" stroke="#8884d8" name="Daily Sales" />
//             <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Orders Count" />
//           </LineChart>
//         </ResponsiveContainer>
//       </section>
//     </main>
//   );
// }