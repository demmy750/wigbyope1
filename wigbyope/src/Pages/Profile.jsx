// Updated ProfilePage.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Currency symbol mapper
  const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
    return symbols[currency] || '$';
  };

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    checkLogin();

    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Fetch user profile and orders (only if logged in)
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false); // No loading if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, ordersData] = await Promise.all([
          fetchWithAuth("/api/users/profile"),
          fetchWithAuth("/api/orders")
        ]);
        setUser(userData);
        setOrders(ordersData);
      } catch (err) {
        setError(err.message || "Failed to load profile.");
        if (err.status === 401) {
          setIsLoggedIn(false);
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, isLoggedIn]);

  const handleLogout = () => {
    console.log("Logout clicked"); // Debug: Check console
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Force re-render
    navigate("/");
    
    // Dispatch custom event to notify other components (like Navbar)
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <div className="profile-page">
      {/* Header with Conditional Profile Icon */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f0f0f0", marginBottom: "2rem" }}>
        <Link to="/" style={{ textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
          Your App Name
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* Conditional: Profile icon if logged in */}
          {isLoggedIn && (
            <Link to="/profile" title="Go to Profile">
              <i style={{ fontSize: "1.5rem", cursor: "pointer" }}>👤</i>
            </Link>
          )}
          {/* Logout button if logged in (red) */}
          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* Main Content: Signup Button if Logged Out, Profile if Logged In */}
      {!isLoggedIn ? (
        // When logged out: Show signup button styled like your original Profile button
        <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
          <h1>Profile</h1>
          <p>You are not logged in.</p>
          <Link to="/signup">
            <button style={{ marginTop: "1rem" }}> {/* Exact style from your Profile component */}
              Sign Up
            </button>
          </Link>
        </main>
      ) : (
        // When logged in: Show full profile content
        <>
          {loading && (
            <div className="profile-loading">
              <div className="spinner"></div>
              <p>Loading your profile...</p>
            </div>
          )}

          {error && (
            <div className="profile-error">
              <h2>Oops!</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="profile-header">
                <h1>Welcome back, {user?.name || "Beauty Enthusiast"}!</h1>
                <p>Manage your account and view your wig orders.</p>
              </div>

              <div className="profile-content">
                <section className="profile-section user-info">
                  <h2>Your Information</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{user?.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  <Link to="/edit-profile" className="edit-btn">Edit Profile</Link>
                </section>

                <section className="profile-section orders">
                  <h2>Your Orders</h2>
                  {orders.length === 0 ? (
                    <p className="no-orders">No orders yet. <Link to="/shop">Start shopping for wigs!</Link></p>
                  ) : (
                    <div className="orders-list">
                      {orders.map((order) => (
                        <div key={order._id} className="order-card">
                          <div className="order-header">
                            <span className="order-id">Order #{order._id}</span>
                            <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                          </div>
                          <div className="order-details">
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> {getCurrencySymbol(order.currency)}{order.totalPrice.toLocaleString()}</p>
                            <p><strong>Items:</strong> {order.orderItems.length} wig(s)</p>
                          </div>
                          <Link to={`/order-success/${order._id}`} className="view-order-btn">View Details</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="profile-section logout">
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </section>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}







// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import "./Profile.css";

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Currency symbol mapper
//   const getCurrencySymbol = (currency) => {
//     const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
//     return symbols[currency] || '$';
//   };

//   // Check login status on mount and when localStorage changes
//   useEffect(() => {
//     const checkLogin = () => {
//       setIsLoggedIn(!!localStorage.getItem("token"));
//     };
//     checkLogin();

//     window.addEventListener("storage", checkLogin);
//     return () => window.removeEventListener("storage", checkLogin);
//   }, []);

//   // Fetch user profile and orders (only if logged in)
//   useEffect(() => {
//     if (!isLoggedIn) {
//       setLoading(false); // No loading if not logged in
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [userData, ordersData] = await Promise.all([
//           fetchWithAuth("/api/users/profile"),
//           fetchWithAuth("/api/orders")
//         ]);
//         setUser(userData);
//         setOrders(ordersData);
//       } catch (err) {
//         setError(err.message || "Failed to load profile.");
//         if (err.status === 401) {
//           setIsLoggedIn(false);
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate, isLoggedIn]);

//   const handleLogout = () => {
//     console.log("Logout clicked"); // Debug: Check console
//     localStorage.removeItem("token");
//     setIsLoggedIn(false); // Force re-render
//     navigate("/");
//   };

//   return (
//     <div className="profile-page">
//       {/* Header with Conditional Profile Icon */}
//       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f0f0f0", marginBottom: "2rem" }}>
//         <Link to="/" style={{ textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
//           Your App Name
//         </Link>
//         <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//           {/* Conditional: Profile icon if logged in */}
//           {isLoggedIn && (
//             <Link to="/profile" title="Go to Profile">
//               <i style={{ fontSize: "1.5rem", cursor: "pointer" }}>👤</i>
//             </Link>
//           )}
//           {/* Logout button if logged in (red) */}
//           {isLoggedIn && (
//             <button 
//               onClick={handleLogout} 
//               style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
//             >
//               Logout
//             </button>
//           )}
//         </nav>
//       </header>

//       {/* Main Content: Signup Button if Logged Out, Profile if Logged In */}
//       {!isLoggedIn ? (
//         // When logged out: Show signup button styled like your original Profile button
//         <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
//           <h1>Profile</h1>
//           <p>You are not logged in.</p>
//           <Link to="/signup">
//             <button style={{ marginTop: "1rem" }}> {/* Exact style from your Profile component */}
//               Sign Up
//             </button>
//           </Link>
//         </main>
//       ) : (
//         // When logged in: Show full profile content
//         <>
//           {loading && (
//             <div className="profile-loading">
//               <div className="spinner"></div>
//               <p>Loading your profile...</p>
//             </div>
//           )}

//           {error && (
//             <div className="profile-error">
//               <h2>Oops!</h2>
//               <p>{error}</p>
//               <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//           )}

//           {!loading && !error && (
//             <>
//               <div className="profile-header">
//                 <h1>Welcome back, {user?.name || "Beauty Enthusiast"}!</h1>
//                 <p>Manage your account and view your wig orders.</p>
//               </div>

//               <div className="profile-content">
//                 <section className="profile-section user-info">
//                   <h2>Your Information</h2>
//                   <div className="info-grid">
//                     <div className="info-item">
//                       <label>Name:</label>
//                       <span>{user?.name}</span>
//                     </div>
//                     <div className="info-item">
//                       <label>Email:</label>
//                       <span>{user?.email}</span>
//                     </div>
//                   </div>
//                   <Link to="/edit-profile" className="edit-btn">Edit Profile</Link>
//                 </section>

//                 <section className="profile-section orders">
//                   <h2>Your Orders</h2>
//                   {orders.length === 0 ? (
//                     <p className="no-orders">No orders yet. <Link to="/shop">Start shopping for wigs!</Link></p>
//                   ) : (
//                     <div className="orders-list">
//                       {orders.map((order) => (
//                         <div key={order._id} className="order-card">
//                           <div className="order-header">
//                             <span className="order-id">Order #{order._id}</span>
//                             <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
//                           </div>
//                           <div className="order-details">
//                             <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
//                             <p><strong>Total:</strong> {getCurrencySymbol(order.currency)}{order.totalPrice.toLocaleString()}</p>
//                             <p><strong>Items:</strong> {order.orderItems.length} wig(s)</p>
//                           </div>
//                           <Link to={`/order-success/${order._id}`} className="view-order-btn">View Details</Link>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </section>

//                 <section className="profile-section logout">
//                   <button onClick={handleLogout} className="logout-btn">Logout</button>
//                 </section>
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { fetchWithAuth } from "../api";

// export default function Profile() {
//   const [user, setUser ] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [status, setStatus] = useState(null);

//   useEffect(() => {
//     async function loadUser () {
//       try {
//         const data = await fetchWithAuth("/users/me");
//         setUser (data);
//         setFormData({ name: data.name, email: data.email, password: "" });
//       } catch (err) {
//         setStatus({ error: err.message });
//       }
//     }
//     loadUser ();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus(null);
//     try {
//       const res = await fetchWithAuth("/users/me", {
//         method: "PUT",
//         body: JSON.stringify(formData),
//       });
//       setStatus({ success: "Profile updated successfully" });
//     } catch (err) {
//       setStatus({ error: err.message });
//     }
//   };

//   if (!user) return <p>Loading profile...</p>;

//   return (
//     <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
//       <h1>Your Profile</h1>
//       <form onSubmit={handleSubmit} noValidate>
//         <label>Name</label>
//         <input name="name" value={formData.name} onChange={handleChange} required />

//         <label style={{ marginTop: "1rem" }}>Email</label>
//         <input name="email" type="email" value={formData.email} onChange={handleChange} required />

//         <label style={{ marginTop: "1rem" }}>New Password (leave blank to keep current)</label>
//         <input name="password" type="password" value={formData.password} onChange={handleChange} />

//         {status?.error && <p style={{ color: "red" }}>{status.error}</p>}
//         {status?.success && <p style={{ color: "green" }}>{status.success}</p>}

//         <button type="submit" style={{ marginTop: "1rem" }}>
//           Update Profile
//         </button>
//       </form>
//     </main>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchWithAuth } from "../api";
// import "./Profile.css";

// export default function ProfilePage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Currency symbol mapper
//   const getCurrencySymbol = (currency) => {
//     const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
//     return symbols[currency] || '$';
//   };

//   // Fetch user profile and orders
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [userData, ordersData] = await Promise.all([
//           fetchWithAuth("/api/users/profile"), // FIXED: Use /api/users/profile (matches backend mount)
//           fetchWithAuth("/api/orders") // Already correct
//         ]);
//         setUser(userData);
//         setOrders(ordersData); // Backend returns array directly
//       } catch (err) {
//         setError(err.message || "Failed to load profile.");
//         if (err.status === 401) navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   if (loading) {
//     return (
//       <div className="profile-loading">
//         <div className="spinner"></div>
//         <p>Loading your profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="profile-error">
//         <h2>Oops!</h2>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <h1>Welcome back, {user?.name || "Beauty Enthusiast"}!</h1>
//         <p>Manage your account and view your wig orders.</p>
//       </div>

//       <div className="profile-content">
//         {/* User Info Section */}
//         <section className="profile-section user-info">
//           <h2>Your Information</h2>
//           <div className="info-grid">
//             <div className="info-item">
//               <label>Name:</label>
//               <span>{user?.name}</span>
//             </div>
//             <div className="info-item">
//               <label>Email:</label>
//               <span>{user?.email}</span>
//             </div>
//             {/* Add more fields if available, e.g., phone */}
//           </div>
//           <Link to="/edit-profile" className="edit-btn">Edit Profile</Link>
//         </section>

//         {/* Orders Section */}
//         <section className="profile-section orders">
//           <h2>Your Orders</h2>
//           {orders.length === 0 ? (
//             <p className="no-orders">No orders yet. <Link to="/shop">Start shopping for wigs!</Link></p>
//           ) : (
//             <div className="orders-list">
//               {orders.map((order) => (
//                 <div key={order._id} className="order-card">
//                   <div className="order-header">
//                     <span className="order-id">Order #{order._id}</span>
//                     <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
//                   </div>
//                   <div className="order-details">
//                     <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
//                     <p><strong>Total:</strong> {getCurrencySymbol(order.currency)}{order.totalPrice.toLocaleString()}</p>
//                     <p><strong>Items:</strong> {order.orderItems.length} wig(s)</p>
//                   </div>
//                   <Link to={`/order-success/${order._id}`} className="view-order-btn">View Details</Link>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Logout Section */}
//         <section className="profile-section logout">
//           <button onClick={handleLogout} className="logout-btn">Logout</button>
//         </section>
//       </div>
//     </div>
//   );
// }