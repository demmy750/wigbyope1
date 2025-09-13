// backend/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// ✅ Security Middlewares
app.use(helmet()); // secure headers
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // allow frontend
app.use(express.json()); // parse JSON requests
app.use(morgan("dev")); // logging

// ✅ Custom middleware to sanitize req.body and req.params only (avoid req.query sanitization)
app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
  }
  // Do NOT sanitize req.query to avoid the error
  next();
});

// ✅ Custom sanitize for body (extra safety)
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const out = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      continue; // skip dangerous key
    }
    out[key] = sanitizeObject(obj[key]);
  }
  return out;
}

app.use((req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  next();
});

// ✅ Connect Database
connectDB();

// ✅ Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes")); // admin-only uploads

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});