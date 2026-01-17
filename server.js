// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const mongoSanitize = require("express-mongo-sanitize");
// const path = require("path");
// const connectDB = require("./config/db");

// // Load env variables
// dotenv.config();

// // Initialize app
// const app = express();

// // ✅ Security Middlewares
// app.use(helmet()); 
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json()); 
// app.use(morgan("dev")); 

// // ✅ Sanitize req.body and req.params
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
//   if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
//   next();
// });

// // ✅ Extra safety
// function sanitizeObject(obj) {
//   if (!obj || typeof obj !== "object") return obj;
//   if (Array.isArray(obj)) return obj.map(sanitizeObject);
//   const out = {};
//   for (const key of Object.keys(obj)) {
//     if (key.startsWith("$") || key.includes(".")) continue;
//     out[key] = sanitizeObject(obj[key]);
//   }
//   return out;
// }
// app.use((req, res, next) => {
//   if (req.body) req.body = sanitizeObject(req.body);
//   next();
// });

// // ✅ Connect DB
// connectDB();

// // ✅ Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// // app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use("/api/upload", require("./routes/uploadRoutes")); // Cloudinary uploads
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const mongoSanitize = require("express-mongo-sanitize");
// const path = require("path");
// const connectDB = require("./config/db");

// // Load env variables
// dotenv.config();

// // Initialize app
// const app = express();

// // ✅ Security Middlewares
// app.use(helmet()); 
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json()); 
// app.use(morgan("dev")); 

// // ✅ Sanitize req.body and req.params
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
//   if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
//   next();
// });

// // ✅ Extra safety
// function sanitizeObject(obj) {
//   if (!obj || typeof obj !== "object") return obj;
//   if (Array.isArray(obj)) return obj.map(sanitizeObject);
//   const out = {};
//   for (const key of Object.keys(obj)) {
//     if (key.startsWith("$") || key.includes(".")) continue;
//     out[key] = sanitizeObject(obj[key]);
//   }
//   return out;
// }
// app.use((req, res, next) => {
//   if (req.body) req.body = sanitizeObject(req.body);
//   next();
// });

// // ✅ Connect DB and verify connection
// connectDB().then(() => {
//   console.log("✅ Database connected successfully");  // Added logging
// }).catch((err) => {
//   console.error("❌ Database connection failed:", err.message);
//   process.exit(1);  // Exit if DB fails
// });

// // ✅ Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// // app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use("/api/upload", require("./routes/uploadRoutes")); // Cloudinary uploads
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/reviews", require("./routes/reviewRoutes"));


// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // ✅ Global Error Handler (catches unhandled errors, including 500s)
// app.use((err, req, res, next) => {
//   console.error("Global error handler:", err.stack);  // Added logging
//   res.status(500).json({ message: "Internal Server Error", error: process.env.NODE_ENV === 'development' ? err.message : undefined });
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const mongoSanitize = require("express-mongo-sanitize");
// const path = require("path");
// const connectDB = require("./config/db");

// // Load env variables
// dotenv.config();
// console.log("NODE_ENV:", process.env.NODE_ENV);

// // Initialize app
// const app = express();

// // ✅ Security Middlewares
// app.use(helmet()); 
// app.use(cors({ origin: process.env.NODE_ENV === "production" ? "https://your-render-app-name.onrender.com" : "http://localhost:5173", credentials: true }));  // UPDATED: Replace with your Render URL
// app.use(express.json()); 
// app.use(morgan("dev")); 

// // ✅ Sanitize req.body and req.params
// app.use((req, res, next) => {
//   if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
//   if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
//   next();
// });

// // ✅ Extra safety
// function sanitizeObject(obj) {
//   if (!obj || typeof obj !== "object") return obj;
//   if (Array.isArray(obj)) return obj.map(sanitizeObject);
//   const out = {};
//   for (const key of Object.keys(obj)) {
//     if (key.startsWith("$") || key.includes(".")) continue;
//     out[key] = sanitizeObject(obj[key]);
//   }
//   return out;
// }
// app.use((req, res, next) => {
//   if (req.body) req.body = sanitizeObject(req.body);
//   next();
// });

// // ✅ Connect DB and verify connection
// connectDB().then(() => {
//   console.log("✅ Database connected successfully");  // Added logging
// }).catch((err) => {
//   console.error("❌ Database connection failed:", err.message);
//   process.exit(1);  // Exit if DB fails
// });

// // ✅ Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// // app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use("/api/upload", require("./routes/uploadRoutes")); // Cloudinary uploads
// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/reviews", require("./routes/reviewRoutes"));

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // ✅ Serve React Frontend (UPDATED: Changed to "wigbyope/dist" to match Vite build output)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "wigbyope/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "wigbyope/dist", "index.html"));
//   });
// }

// // ✅ Global Error Handler (catches unhandled errors, including 500s)
// app.use((err, req, res, next) => {
//   console.error("Global error handler:", err.stack);  // Added logging
//   res.status(500).json({ message: "Internal Server Error", error: process.env.NODE_ENV === 'development' ? err.message : undefined });
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });













const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const fs = require("fs");  // Added: For checking if build directory exists
const connectDB = require("./config/db");

// Load env variables
dotenv.config();
console.log("NODE_ENV:", process.env.NODE_ENV);  // ✅ Added: Confirm NODE_ENV

// Initialize app
const app = express();

// ✅ Security Middlewares (UPDATED: Simplified CSP without Stripe allowances)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],  // Fallback: Only allow your own domain
      imgSrc: ["'self'", "data:", "https:"],  // Allow your images, data URIs, and HTTPS images
      connectSrc: ["'self'", "https://api.exchangerate-api.com"],  // Allow exchange rate API
      // Removed scriptSrc and frameSrc for Stripe (re-add when needed: scriptSrc: ["'self'", "https://js.stripe.com"], frameSrc: ["'self'", "https://js.stripe.com"])
      // Add more if needed, e.g., styleSrc: ["'self'", "https://fonts.googleapis.com"] for external CSS
    },
  },
}));
app.use(cors({ 
  origin: process.env.NODE_ENV === "production" ? "https://your-render-app-name.onrender.com" : "http://localhost:5173", 
  credentials: true 
}));  // UPDATED: Replace with your Render URL
app.use(express.json()); 
app.use(morgan("dev")); 

// ✅ Sanitize req.body and req.params
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
  if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
  next();
});

// ✅ Extra safety
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  const out = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    out[key] = sanitizeObject(obj[key]);
  }
  return out;
}
app.use((req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  next();
});

// ✅ Connect DB and verify connection
connectDB().then(() => {
  console.log("✅ Database connected successfully");  // Added logging
}).catch((err) => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);  // Exit if DB fails
});

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes")); // Cloudinary uploads
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// ✅ Serve React Frontend (UPDATED: Changed to "wigbyope/dist" to match Vite build output)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "wigbyope/dist");
  console.log("✅ Serving static files from wigbyope/dist");  // ✅ Added: Confirm production block
  
  // Check if build directory exists (prevents 404s if build failed)
  if (!fs.existsSync(distPath)) {
    console.error("❌ Build directory not found:", distPath);
    process.exit(1);
  }
  
  app.use(express.static(distPath));
  
  // Catch-all middleware for SPA (replaces app.get('*', ...) to fix path-to-regexp error)
  app.use((req, res, next) => {
    // Only handle GET requests for index.html (lets API routes work for other methods)
    if (req.method === 'GET') {
      res.sendFile(path.join(distPath, "index.html"));
    } else {
      // For non-GET (e.g., POST to /api/*), pass to next middleware or return 404
      next();
    }
  });
} else {
  // ✅ Test Route (only in development)
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// ✅ Global Error Handler (catches unhandled errors, including 500s)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);  // Added logging
  res.status(500).json({ 
    message: "Internal Server Error", 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// ✅ Handle unhandled promise rejections (e.g., from async DB ops)
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection:', err.message);
  // Close server and exit
  server.close(() => {
    process.exit(1);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});