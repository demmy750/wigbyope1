// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchWithAuth } from "../api";

export default function PrivateRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const user = await fetchWithAuth("/users/me");
        if (adminOnly && user.role !== "admin") {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [adminOnly]);

  if (loading) return <p>Loading...</p>;

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}