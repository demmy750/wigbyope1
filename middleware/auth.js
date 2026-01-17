// // // middleware/auth.js
// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');

// // const admin = (req, res, next) => {
// //   if (req.user && req.user.role === 'admin') {
// //     next();
// //   } else {
// //     res.status(403).json({ message: 'Admin access required' });
// //   }
// // };

// // const protect = async (req, res, next) => {
// //   let token;

// //   if (
// //     req.headers.authorization &&
// //     req.headers.authorization.startsWith('Bearer')
// //   ) {
// //     try {
// //       token = req.headers.authorization.split(' ')[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //       req.user = await User.findById(decoded.id).select('-password');
// //       next();
// //     } catch (error) {
// //       console.error(error);
// //       res.status(401).json({ message: 'Not authorized, token failed' });
// //     }
// //   } else {
// //     res.status(401).json({ message: 'Not authorized, no token' });
// //   }
// // };

// // module.exports = { protect, admin };



// // middleware/auth.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Protect routes (requires login)
// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth error:", error);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Admin only middleware
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin access required" });
//   }
// };

// module.exports = { protect, admin };




// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // Protect routes (requires login)
// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth error:", error);
//       // Improved: Distinguish token expiry from other failures
//       if (error.name === 'TokenExpiredError') {
//         return res.status(401).json({ message: "Session expired. Please log in again." });
//       }
//       return res.status(401).json({ message: "Not authorized, invalid token" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Admin only middleware
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin access required" });
//   }
// };

// module.exports = { protect, admin };





const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (requires login)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Auth middleware: Verifying token...");  // Added logging
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("Auth middleware: User found:", req.user ? req.user.email : "null");  // Added logging

      if (!req.user) {
        console.error("Auth middleware: User not found for ID:", decoded.id);  // Added logging
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);  // Enhanced logging
      // Improved: Distinguish token expiry from other failures
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    console.warn("Auth middleware: No token provided");  // Added logging
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin only middleware
const admin = (req, res, next) => {
  console.log("Admin middleware: Checking role for user:", req.user ? req.user.email : "null");  // Added logging
  if (req.user && req.user.role === "admin") {
    console.log("Admin middleware: Access granted");  // Added logging
    next();
  } else {
    console.warn("Admin middleware: Access denied - not admin");  // Added logging
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { protect, admin };