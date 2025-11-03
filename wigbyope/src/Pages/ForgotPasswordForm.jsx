// import React, { useState } from "react";

// export default function ForgotPasswordForm() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setMessage(data.message);
//       } else {
//         setError(data.message || "Request failed");
//       }
//     } catch {
//       setError("Network error");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={formStyle}>
//       <h2>Forgot Password</h2>
//       {message && <p style={{ color: "green" }}>{message}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <button type="submit">Send Reset Email</button>
//     </form>
//   );
// }

// const formStyle = {
//   display: "flex",
//   flexDirection: "column",
//   maxWidth: 320,
//   margin: "auto",
//   gap: 10,
//   padding: 20,
//   border: "1px solid #ccc",
//   borderRadius: 8,
// };



import React, { useState } from "react";
import { authAPI } from "../api";

export default function ForgotPasswordForm({ onEmailSubmitted }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await authAPI.forgotPassword(email);
      setMessage("Check your email for the reset code.");
      if (onEmailSubmitted) onEmailSubmitted(email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Send Reset Email</button>
    </form>
  );
}
