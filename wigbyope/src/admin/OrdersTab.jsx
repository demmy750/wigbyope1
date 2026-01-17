// // // import React, { useEffect, useState } from "react";
// // // import { fetchWithAuth } from "../api";

// // // const styles = {
// // //   container: {
// // //     backgroundColor: "#fff",
// // //     border: "1px solid #e5e7eb",
// // //     borderRadius: 8,
// // //     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
// // //     padding: 24,
// // //     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// // //     color: "#111827",
// // //   },
// // //   heading: {
// // //     fontSize: 20,
// // //     fontWeight: 600,
// // //     marginBottom: 16,
// // //   },
// // //   message: {
// // //     marginTop: 16,
// // //     fontSize: 16,
// // //   },
// // //   errorMessage: {
// // //     color: "#dc2626",
// // //   },
// // //   emptyMessage: {
// // //     color: "#6b7280",
// // //   },
// // //   ordersList: {
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     gap: 24,
// // //   },
// // //   orderCard: {
// // //     border: "1px solid #d1d5db",
// // //     borderRadius: 8,
// // //     padding: 16,
// // //     boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
// // //   },
// // //   orderHeader: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: 8,
// // //   },
// // //   orderTitle: {
// // //     fontWeight: 600,
// // //     fontSize: 16,
// // //   },
// // //   select: {
// // //     border: "1px solid #d1d5db",
// // //     borderRadius: 6,
// // //     padding: "4px 8px",
// // //     fontSize: 14,
// // //     cursor: "pointer",
// // //   },
// // //   paragraph: {
// // //     margin: "4px 0",
// // //     fontSize: 14,
// // //   },
// // //   strong: {
// // //     fontWeight: 600,
// // //   },
// // //   itemsContainer: {
// // //     marginTop: 12,
// // //   },
// // //   itemsList: {
// // //     listStyleType: "disc",
// // //     paddingLeft: 20,
// // //     marginTop: 4,
// // //   },
// // //   listItem: {
// // //     fontSize: 14,
// // //     marginBottom: 4,
// // //   },
// // // };

// // // export default function OrdersTab({ activeTab }) {
// // //   const [orders, setOrders] = useState([]);
// // //   const [loadingOrders, setLoadingOrders] = useState(false);
// // //   const [ordersError, setOrdersError] = useState(null);

// // //   useEffect(() => {
// // //     if (activeTab !== "orders") return;

// // //     const fetchOrders = async () => {
// // //       setLoadingOrders(true);
// // //       try {
// // //         const data = await fetchWithAuth("/api/orders");
// // //         setOrders(data);
// // //       } catch (err) {
// // //         setOrdersError(err.message || "Failed to load orders");
// // //       } finally {
// // //         setLoadingOrders(false);
// // //       }
// // //     };

// // //     fetchOrders();
// // //   }, [activeTab]);

// // //   const updateOrderStatus = async (orderId, newStatus) => {
// // //     try {
// // //       await fetchWithAuth(`/api/orders/${orderId}/status`, {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ status: newStatus }),
// // //       });
// // //       setOrders((prev) =>
// // //         prev.map((order) =>
// // //           order._id === orderId ? { ...order, status: newStatus } : order
// // //         )
// // //       );
// // //       alert("Order status updated");
// // //     } catch (err) {
// // //       alert("Failed to update order status: " + err.message);
// // //     }
// // //   };

// // //   if (activeTab !== "orders") return null;

// // //   return (
// // //     <div style={styles.container}>
// // //       <h3 style={styles.heading}>Manage Orders</h3>

// // //       {loadingOrders && <p style={styles.message}>Loading orders...</p>}
// // //       {ordersError && (
// // //         <p style={{ ...styles.message, ...styles.errorMessage }}>{ordersError}</p>
// // //       )}

// // //       {orders.length === 0 && !loadingOrders && (
// // //         <p style={{ ...styles.message, ...styles.emptyMessage }}>No orders found.</p>
// // //       )}

// // //       <div style={styles.ordersList}>
// // //         {orders.map((order) => (
// // //           <div key={order._id} style={styles.orderCard}>
// // //             <div style={styles.orderHeader}>
// // //               <h4 style={styles.orderTitle}>Order #{order._id}</h4>
// // //               <select
// // //                 value={order.status}
// // //                 onChange={(e) => updateOrderStatus(order._id, e.target.value)}
// // //                 style={styles.select}
// // //               >
// // //                 <option>Pending</option>
// // //                 <option>Paid</option>
// // //                 <option>Processing</option>
// // //                 <option>Shipped</option>
// // //                 <option>Delivered</option>
// // //                 <option>Cancelled</option>
// // //               </select>
// // //             </div>

// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Customer:</strong> {order.user?.name || "N/A"} (
// // //               {order.user?.email || "N/A"})
// // //             </p>
// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Phone:</strong> {order.user?.phone || "N/A"}
// // //             </p>
// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Shipping Address:</strong> {order.shippingAddress || "N/A"}
// // //             </p>
// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Total Price:</strong> ${order.totalPrice.toFixed(2)}
// // //             </p>
// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Payment Status:</strong> {order.paymentResult?.status || "N/A"}
// // //             </p>
// // //             <p style={styles.paragraph}>
// // //               <strong style={styles.strong}>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
// // //             </p>

// // //             <div style={styles.itemsContainer}>
// // //               <strong style={styles.strong}>Items:</strong>
// // //               <ul style={styles.itemsList}>
// // //                 {order.items.map((item) => (
// // //                   <li key={item.product._id || item.product} style={styles.listItem}>
// // //                     {item.product?.name || "Product"} - ${item.price} x {item.quantity}
// // //                     {item.product?.wigType ? ` (${item.product.wigType})` : ""}
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import React, { useEffect, useState } from "react";
// // import { fetchWithAuth } from "../api";

// // const styles = {
// //   container: {
// //     backgroundColor: "#fff",
// //     border: "1px solid #e5e7eb",
// //     borderRadius: 8,
// //     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
// //     padding: 24,
// //     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //     color: "#111827",
// //   },
// //   heading: {
// //     fontSize: 20,
// //     fontWeight: 600,
// //     marginBottom: 16,
// //   },
// //   message: {
// //     marginTop: 16,
// //     fontSize: 16,
// //   },
// //   errorMessage: {
// //     color: "#dc2626",
// //   },
// //   emptyMessage: {
// //     color: "#6b7280",
// //   },
// //   ordersList: {
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: 24,
// //   },
// //   orderCard: {
// //     border: "1px solid #d1d5db",
// //     borderRadius: 8,
// //     padding: 16,
// //     boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
// //   },
// //   orderHeader: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 8,
// //   },
// //   orderTitle: {
// //     fontWeight: 600,
// //     fontSize: 16,
// //   },
// //   select: {
// //     border: "1px solid #d1d5db",
// //     borderRadius: 6,
// //     padding: "4px 8px",
// //     fontSize: 14,
// //     cursor: "pointer",
// //   },
// //   paragraph: {
// //     margin: "4px 0",
// //     fontSize: 14,
// //   },
// //   strong: {
// //     fontWeight: 600,
// //   },
// //   itemsContainer: {
// //     marginTop: 12,
// //   },
// //   itemsList: {
// //     listStyleType: "disc",
// //     paddingLeft: 20,
// //     marginTop: 4,
// //   },
// //   listItem: {
// //     fontSize: 14,
// //     marginBottom: 4,
// //   },
// // };

// // // Helper functions for safe formatting
// // const formatPrice = (price, currency = 'USD') => {
// //   const num = Number(price);
// //   if (isNaN(num)) return `${currency} 0.00`;
// //   return `${currency} ${num.toFixed(2)}`;
// // };

// // const formatDate = (dateStr) => {
// //   if (!dateStr) return "N/A";
// //   const date = new Date(dateStr);
// //   return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
// // };

// // const formatShippingAddress = (addr) => {
// //   if (!addr || typeof addr !== 'object') return "N/A";
// //   const { name = '', address = '', city = '', postalCode = '', country = '' } = addr;
// //   return `${name ? `${name}, ` : ''}${address}${city || postalCode ? `, ${city} ${postalCode}` : ''}${country ? `, ${country}` : ''}`.trim() || "N/A";
// // };

// // export default function OrdersTab({ activeTab }) {
// //   const [orders, setOrders] = useState([]);
// //   const [loadingOrders, setLoadingOrders] = useState(false);
// //   const [ordersError, setOrdersError] = useState(null);

// //   useEffect(() => {
// //     if (activeTab !== "orders") return;

// //     const fetchOrders = async () => {
// //       setLoadingOrders(true);
// //       try {
// //         const data = await fetchWithAuth("/api/orders");
// //         // Filter valid orders (with _id)
// //         const validOrders = Array.isArray(data) ? data.filter(order => order && order._id) : [];
// //         setOrders(validOrders);
// //       } catch (err) {
// //         setOrdersError(err.message || "Failed to load orders");
// //       } finally {
// //         setLoadingOrders(false);
// //       }
// //     };

// //     fetchOrders();
// //   }, [activeTab]);

// //   const updateOrderStatus = async (orderId, newStatus) => {
// //     try {
// //       // Note: This assumes you add the backend route for /api/orders/:id/status
// //       await fetchWithAuth(`/api/orders/${orderId}/status`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ status: newStatus }),
// //       });
// //       setOrders((prev) =>
// //         prev.map((order) =>
// //           order._id === orderId ? { ...order, status: newStatus } : order
// //         )
// //       );
// //       alert("Order status updated");
// //     } catch (err) {
// //       alert("Failed to update order status: " + err.message);
// //     }
// //   };

// //   if (activeTab !== "orders") return null;

// //   // Derive status from isPaid if no status field (fallback)
// //   const getOrderStatus = (order) => order.status || (order.isPaid ? "Paid" : "Pending");

// //   return (
// //     <div style={styles.container}>
// //       <h3 style={styles.heading}>Manage Orders</h3>

// //       {loadingOrders && <p style={styles.message}>Loading orders...</p>}
// //       {ordersError && (
// //         <p style={{ ...styles.message, ...styles.errorMessage }}>{ordersError}</p>
// //       )}

// //       {orders.length === 0 && !loadingOrders && (
// //         <p style={{ ...styles.message, ...styles.emptyMessage }}>No orders found.</p>
// //       )}

// //       <div style={styles.ordersList}>
// //         {orders.map((order, index) => (
// //           <div key={order._id || `order-${index}`} style={styles.orderCard}>
// //             <div style={styles.orderHeader}>
// //               <h4 style={styles.orderTitle}>
// //                 Order #{order._id || `Unknown-${index}`}
// //               </h4>
// //               <select
// //                 value={getOrderStatus(order)}
// //                 onChange={(e) => updateOrderStatus(order._id, e.target.value)}
// //                 style={styles.select}
// //               >
// //                 <option>Pending</option>
// //                 <option>Paid</option>
// //                 <option>Processing</option>
// //                 <option>Shipped</option>
// //                 <option>Delivered</option>
// //                 <option>Cancelled</option>
// //               </select>
// //             </div>

// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Customer:</strong> User ID: {order.user || "N/A"} {/* Update backend to populate user.name/email */}
// //               {/* Once populated: {order.user?.name || "N/A"} ({order.user?.email || "N/A"}) */}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Phone:</strong> N/A {/* Add to schema or populate from user */}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Shipping Address:</strong> {formatShippingAddress(order.shippingAddress)}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Total Price:</strong> {formatPrice(order.totalPrice, order.currency || 'USD')}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Base USD:</strong> {formatPrice(order.baseTotalUSD, 'USD')}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Payment Status:</strong> {order.paymentResult?.status || order.isPaid ? "Paid" : "Pending"}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Is Paid:</strong> {order.isPaid ? "Yes" : "No"}
// //             </p>
// //             <p style={styles.paragraph}>
// //               <strong style={styles.strong}>Order Date:</strong> {formatDate(order.createdAt)}
// //             </p>

// //             <div style={styles.itemsContainer}>
// //               <strong style={styles.strong}>Items:</strong>
// //               <ul style={styles.itemsList}>
// //                 {(order.orderItems || []).map((item, itemIndex) => (
// //                   <li
// //                     key={item._id || item.product?._id || `item-${itemIndex}`}
// //                     style={styles.listItem}
// //                   >
// //                     {item.name || item.product?.name || "Product"} - {formatPrice(item.price, order.currency || 'USD')} x {item.qty || 1}
// //                     {item.product?.wigType ? ` (${item.product.wigType})` : ""} {/* Add 'wigType' to backend populate if needed */}
// //                     {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', marginLeft: 8 }} />} {/* Optional: Show image */}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api";
// import { getUserRole } from "../auth";

// export default function OrdersTab() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const role = getUserRole();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await fetchWithAuth("/allorder");
//         setOrders(data);
//       } catch (err) {
//         console.error("Failed to fetch orders", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const updatedOrder = await fetchWithAuth(`/orders/${orderId}/status`, {
//         method: "PUT",
//         body: JSON.stringify({ status: newStatus }),
//       });
//       setOrders((prev) =>
//         prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
//       );
//     } catch (err) {
//       console.error("Failed to update status", err);
//     }
//   };

// //   const handleStatusChange = async (orderId, newStatus) => {
// //   try {
// //     const updatedOrder = await fetchWithAuth(`/orders/${orderId}/status`, {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ status: newStatus }),
// //     });
// //     setOrders((prev) =>
// //       prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
// //     );
// //   } catch (err) {
// //     console.error("Failed to update status", err);
// //   }
// // };

//   if (loading) return <p>Loading orders...</p>;
//   if (orders.length === 0) return <p>No orders found.</p>;

//   return (
//     <div>
//       <h2>{role === "admin" ? "All Orders" : "My Orders"}</h2>
//       <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
//         <thead>
//           <tr>
//             <th>ID</th>
//             {role === "admin" && <th>User</th>}
//             <th>Total</th>
//             <th>Status</th>
//             <th>Paid</th>
//             <th>Date</th>
//             {role === "admin" && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order._id}>
//               <td>{order._id}</td>
//               {role === "admin" && (
//                 <td>{order.user?.name} ({order.user?.email})</td>
//               )}
//               <td>{order.totalPrice} {order.currency}</td>
//               <td>{order.status}</td>
//               <td>{order.isPaid ? "Yes" : "No"}</td>
//               <td>{new Date(order.createdAt).toLocaleString()}</td>
//               {role === "admin" && (
//                 <td>
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Paid">Paid</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { fetchWithAuth } from "../api"; // Or use ordersAPI if updated
// import { FaEye, FaEdit, FaDownload, FaSearch } from "react-icons/fa";
// import "./OrderTab.css";

// const OrdersTab = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [updatingOrderId, setUpdatingOrderId] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     let filtered = orders;
//     if (statusFilter !== "All") {
//       filtered = filtered.filter(order => order.status === statusFilter);
//     }
//     if (searchQuery) {
//       filtered = filtered.filter(order =>
//         order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredOrders(filtered);
//   }, [orders, statusFilter, searchQuery]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetchWithAuth("/orders/all");
//       setOrders(response);
//       setFilteredOrders(response);
//     } catch (err) {
//       setError("Failed to fetch orders. Please check your connection and try again.");
//       console.error("Failed to fetch orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingOrderId(orderId);
//       await fetchWithAuth(`/orders/${orderId}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       setOrders(orders.map(order =>
//         order._id === orderId ? { ...order, status: newStatus } : order
//       ));
//       alert("Order status updated successfully!");
//     } catch (err) {
//       alert("Failed to update order status. Please try again.");
//       console.error("Failed to update status:", err);
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   const exportToCSV = () => {
//     const csvData = filteredOrders.map(order => ({
//       OrderID: order._id,
//       User: order.user?.email || "N/A",
//       Total: `$${order.totalPrice}`,
//       Status: order.status,
//       Date: new Date(order.createdAt).toLocaleDateString(),
//     }));
//     const csvString = [
//       Object.keys(csvData[0]).join(","),
//       ...csvData.map(row => Object.values(row).join(","))
//     ].join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "orders.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const statusOptions = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

//   if (loading) return <div className="loading">Loading orders...</div>;
//   if (error) return <div className="error">{error} <button onClick={fetchOrders}>Retry</button></div>;

//   return (
//     <div className="orders-tab">
//       <h2>Manage Orders</h2>
      
//       <div className="filters">
//         <div className="search-bar">
//           <FaSearch />
//           <input
//             type="text"
//             placeholder="Search by Order ID or User Email"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//           {statusOptions.map(status => (
//             <option key={status} value={status}>{status}</option>
//           ))}
//         </select>
//         <button onClick={exportToCSV} className="export-btn">
//           <FaDownload /> Export CSV
//         </button>
//       </div>

//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>Order ID</th>
//             <th>User</th>
//             <th>Total</th>
//             <th>Status</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.length === 0 ? (
//             <tr>
//               <td colSpan="6">No orders found.</td>
//             </tr>
//           ) : (
//             filteredOrders.map(order => (
//               <tr key={order._id}>
//                 <td>{order._id}</td>
//                 <td>{order.user?.email || "N/A"}</td>
//                 <td>${order.totalPrice}</td>
//                 <td>
//                   <select
//                     value={order.status}
//                     onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                     disabled={updatingOrderId === order._id}
//                   >
//                     {statusOptions.slice(1).map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                   {updatingOrderId === order._id && <span> Updating...</span>}
//                 </td>
//                 <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   <button onClick={() => setSelectedOrder(order)} className="view-btn">
//                     <FaEye /> View Details
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {selectedOrder && (
//         <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>Order Details</h3>
//             <p><strong>Order ID:</strong> {selectedOrder._id}</p>
//             <p><strong>User:</strong> {selectedOrder.user?.email || "N/A"}</p>
//             <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
//             <p><strong>Status:</strong> {selectedOrder.status}</p>
//             <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.country}` : "N/A"}</p>
//             <h4>Items:</h4>
//             <ul>
//               {selectedOrder.orderItems?.map(item => (  // FIXED: Changed from order.items to order.orderItems
//                 <li key={item._id}>
//                   {item.name} (Qty: {item.qty}) - ${item.price}
//                 </li>
//               )) || <li>No items</li>}
//             </ul>
//             <button onClick={() => setSelectedOrder(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersTab;


// import React, { useState, useEffect } from "react";
// import { fetchWithAuth } from "../api";
// import { FaEye, FaEdit, FaDownload, FaSearch } from "react-icons/fa";
// import "./OrderTab.css";

// const OrdersTab = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [updatingOrderId, setUpdatingOrderId] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     let filtered = orders;
//     if (statusFilter !== "All") {
//       filtered = filtered.filter(order => order.status === statusFilter);
//     }
//     if (searchQuery) {
//       filtered = filtered.filter(order =>
//         order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
//     setFilteredOrders(filtered);
//   }, [orders, statusFilter, searchQuery]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await fetchWithAuth("/orders/all");
//       setOrders(response);
//       setFilteredOrders(response);
//     } catch (err) {
//       setError("Failed to fetch orders. Please check your connection and try again.");
//       console.error("Failed to fetch orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingOrderId(orderId);
//       await fetchWithAuth(`/orders/${orderId}/status`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       setOrders(orders.map(order =>
//         order._id === orderId ? { ...order, status: newStatus } : order
//       ));
//       alert("Order status updated successfully!");
//     } catch (err) {
//       alert("Failed to update order status. Please try again.");
//       console.error("Failed to update status:", err);
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   const exportToCSV = () => {
//     const csvData = filteredOrders.map(order => ({
//       OrderID: order._id,
//       User: order.user?.email || "N/A",
//       Total: `$${order.totalPrice}`,
//       Status: order.status,
//       Date: new Date(order.createdAt).toLocaleDateString(),
//     }));
//     const csvString = [
//       Object.keys(csvData[0]).join(","),
//       ...csvData.map(row => Object.values(row).join(","))
//     ].join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "orders.csv";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const statusOptions = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

//   if (loading) return <div className="loading">Loading orders...</div>;
//   if (error) return <div className="error">{error} <button onClick={fetchOrders}>Retry</button></div>;

//   return (
//     <div className="orders-tab">
//       <h2>Manage Orders</h2>
      
//       <div className="filters">
//         <div className="search-bar">
//           <FaSearch />
//           <input
//             type="text"
//             placeholder="Search by Order ID or User Email"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//           {statusOptions.map(status => (
//             <option key={status} value={status}>{status}</option>
//           ))}
//         </select>
//         <button onClick={exportToCSV} className="export-btn">
//           <FaDownload /> Export CSV
//         </button>
//       </div>

//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>Order ID</th>
//             <th>User</th>
//             <th>Total</th>
//             <th>Status</th>
//             <th>Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.length === 0 ? (
//             <tr>
//               <td colSpan="6">No orders found.</td>
//             </tr>
//           ) : (
//             filteredOrders.map(order => (
//               <tr key={order._id}>
//                 <td>{order._id}</td>
//                 <td>{order.user?.email || "N/A"}</td>
//                 <td>${order.totalPrice}</td>
//                 <td>
//                   <select
//                     value={order.status}
//                     onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                     disabled={updatingOrderId === order._id}
//                   >
//                     {statusOptions.slice(1).map(status => (
//                       <option key={status} value={status}>{status}</option>
//                     ))}
//                   </select>
//                   {updatingOrderId === order._id && <span> Updating...</span>}
//                 </td>
//                 <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                 <td>
//                   <button onClick={() => setSelectedOrder(order)} className="view-btn">
//                     <FaEye /> View Details
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {selectedOrder && (
//         <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>Order Details</h3>
//             <p><strong>Order ID:</strong> {selectedOrder._id}</p>
//             <p><strong>User:</strong> {selectedOrder.user?.email || "N/A"}</p>
//             <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
//             <p><strong>Status:</strong> {selectedOrder.status}</p>
//             <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.country}` : "N/A"}</p>
//             <h4>Items:</h4>
//             <ul>
//               {selectedOrder.orderItems?.map(item => (
//                 <li key={item._id}>
//                   {item.name} (Qty: {item.qty}) - ${item.price}
//                 </li>
//               )) || <li>No items</li>}
//             </ul>
//             <button onClick={() => setSelectedOrder(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersTab;



import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../api";
import { FaEye, FaEdit, FaDownload, FaSearch } from "react-icons/fa";
import "./OrderTab.css";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchWithAuth("/orders/all");
      setOrders(response);
      setFilteredOrders(response);
    } catch (err) {
      setError("Failed to fetch orders. Please check your connection and try again.");
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetchWithAuth(`/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Update local state with the response (which includes the updated order)
      setOrders(orders.map(order =>
        order._id === orderId ? response.order : order
      ));
      alert("Order status updated successfully! User has been notified via email.");
    } catch (err) {
      alert("Failed to update order status. Please try again.");
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const exportToCSV = () => {
    const csvData = filteredOrders.map(order => ({
      OrderID: order._id,
      User: order.user?.email || "N/A",
      Total: `$${order.totalPrice}`,
      Status: order.status,
      Date: new Date(order.createdAt).toLocaleDateString(),
    }));
    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusOptions = ["All", "Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error} <button onClick={fetchOrders}>Retry</button></div>;

  return (
    <div className="orders-tab">
      <h2>Manage Orders</h2>
      
      <div className="filters">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by Order ID or User Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button onClick={exportToCSV} className="export-btn">
          <FaDownload /> Export CSV
        </button>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6">No orders found.</td>
            </tr>
          ) : (
            filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.email || "N/A"}</td>
                <td>${order.totalPrice}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                  >
                    {statusOptions.slice(1).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {updatingOrderId === order._id && <span> Updating...</span>}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} className="view-btn">
                    <FaEye /> View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.user?.email || "N/A"}</p>
            <p><strong>Total:</strong> ${selectedOrder.totalPrice}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress ? `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.country}` : "N/A"}</p>
            <h4>Items:</h4>
            <ul>
              {selectedOrder.orderItems?.map(item => (
                <li key={item._id}>
                  {item.name} (Qty: {item.qty}) - ${item.price}
                </li>
              )) || <li>No items</li>}
            </ul>
            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;