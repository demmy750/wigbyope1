// src/utils/auth.js
import jwtDecode from "jwt-decode";

// Get role from token
export function getUserRole() {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || "user"; // default to "user"
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
