import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";
import "./EditProfile.css"; // New CSS file (see below)

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current user data on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchWithAuth("/api/users/me"); // Uses your existing GET /me endpoint
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          country: userData.country || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await fetchWithAuth("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 2000); // Redirect back to profile
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="NG">Nigeria</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            {/* Add more as needed */}
          </select>
        </div>
        <button type="submit" disabled={saving} className="save-btn">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => navigate("/profile")} className="cancel-btn">
          Cancel
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
}