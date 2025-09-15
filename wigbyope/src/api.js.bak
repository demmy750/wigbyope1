// src/api.js
const API_BASE_URL = "http://localhost:5000/api";

// ------------------------
// Core fetch helper
// ------------------------
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "API request failed";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (err) {
      // no JSON error body
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

// ------------------------
// Auth API
// ------------------------
export const authAPI = {
  login: (credentials) =>
    fetchWithAuth("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }),

  register: (data) =>
    fetchWithAuth("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // ✅ Verify Email
  verifyEmail: (email, code) =>
    fetchWithAuth("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }),

  // ✅ Forgot Password
  forgotPassword: (email) =>
    fetchWithAuth("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }),

  // ✅ Reset Password
  resetPassword: (email, token, newPassword) =>
    fetchWithAuth("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    fetchWithAuth(`/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    fetchWithAuth(`/products/${id}`, { method: "DELETE" }),

  addReview: (id, review) =>
    fetchWithAuth(`/products/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    }),

  update: (id, blogData) =>
    fetchWithAuth(`/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blogData),
    }),

  delete: (id) =>
    fetchWithAuth(`/blogs/${id}`, { method: "DELETE" }),
};

// ------------------------
// Upload API (Admin only)
// ------------------------
export const uploadAPI = {
  uploadProductImage: (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    return fetch(`${API_BASE_URL}/upload/product`, {
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

    return fetch(`${API_BASE_URL}/upload/blog`, {
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
