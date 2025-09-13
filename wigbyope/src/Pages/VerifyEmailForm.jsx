import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Verify Email</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: 320,
  margin: "auto",
  gap: 10,
  padding: 20,
  border: "1px solid #ccc",
  borderRadius: 8,
};