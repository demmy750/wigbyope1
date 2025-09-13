import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

export default function Profile() {
  const [user, setUser ] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadUser () {
      try {
        const data = await fetchWithAuth("/users/me");
        setUser (data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        setStatus({ error: err.message });
      }
    }
    loadUser ();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetchWithAuth("/users/me", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setStatus({ success: "Profile updated successfully" });
    } catch (err) {
      setStatus({ error: err.message });
    }
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <main style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label style={{ marginTop: "1rem" }}>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label style={{ marginTop: "1rem" }}>New Password (leave blank to keep current)</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} />

        {status?.error && <p style={{ color: "red" }}>{status.error}</p>}
        {status?.success && <p style={{ color: "green" }}>{status.success}</p>}

        <button type="submit" style={{ marginTop: "1rem" }}>
          Update Profile
        </button>
      </form>
    </main>
  );
}