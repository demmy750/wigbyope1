// src/api.js

// ------------------------
// Base URL
// ------------------------
// Empty because Vite proxy handles forwarding /api → http://localhost:5000/api
const API_BASE_URL = "https://your-backend-url.com/api";

// ------------------------
// Normalize endpoint helper
// ------------------------
function normalizeEndpoint(endpoint = "") {
  if (!endpoint.startsWith("/")) endpoint = "/" + endpoint;
  if (!endpoint.startsWith("/api")) endpoint = "/api" + endpoint;
  return endpoint;
}

// ------------------------
// Core fetch helper
// ------------------------
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": options.body instanceof FormData ? undefined : "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_BASE_URL}${normalizeEndpoint(endpoint)}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // ---- SAFE PARSE ----
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // fallback if not valid JSON
  }

  if (!response.ok) {
    const errorMsg = (data && data.message) || "API request failed";
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  return data;
}

// ------------------------
// Auth API
// ------------------------
export const authAPI = {
  login: (credentials) =>
    fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data) =>
    fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (email, code) =>
    fetchWithAuth("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),

  forgotPassword: (email) =>
    fetchWithAuth("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, token, newPassword) =>
    fetchWithAuth("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword }),
    }),

  getProfile: () => fetchWithAuth("/auth/profile"),
};

// ------------------------
// Product API
// ------------------------
export const productAPI = {
  getAll: () => fetchWithAuth("/products"),
  getById: (id) => fetchWithAuth(`/products/${id}`),

  create: (productData) =>
    fetchWithAuth("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    fetchWithAuth(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  delete: (id) => fetchWithAuth(`/products/${id}`, { method: "DELETE" }),

  addReview: (id, review) =>
    fetchWithAuth(`/products/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    }),
};

// ------------------------
// Blog API
// ------------------------
export const blogAPI = {
  getAll: () => fetchWithAuth("/blogs"),
  getById: (id) => fetchWithAuth(`/blogs/${id}`),

  create: (blogData) =>
    fetchWithAuth("/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    }),

  update: (id, blogData) =>
    fetchWithAuth(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    }),

  delete: (id) => fetchWithAuth(`/blogs/${id}`, { method: "DELETE" }),
};

// ------------------------
// Upload API (Admin only)
// ------------------------
export const uploadAPI = {
  uploadProductImage: (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${normalizeEndpoint("/upload/product")}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("Image upload failed");
      return res.json();
    });
  },

  uploadBlogImage: (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${normalizeEndpoint("/upload/blog")}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("Image upload failed");
      return res.json();
    });
  },
};
