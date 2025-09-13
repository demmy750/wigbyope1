// backend/routes/uploadRoutes.js
const express = require("express");
const path = require("path");
const multer = require("multer");
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// ---------------------------
// Multer Storage Config
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Decide folder based on route
    if (req.originalUrl.includes("product")) {
      cb(null, path.join(__dirname, "../uploads/products"));
    } else if (req.originalUrl.includes("blog")) {
      cb(null, path.join(__dirname, "../uploads/blogs"));
    } else {
      cb(null, path.join(__dirname, "../uploads/others"));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
});

// ---------------------------
// Product Upload Route
// ---------------------------
router.post(
  "/product",
  protect,
  admin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/products/${req.file.filename}`;
    res.json({ message: "Product image uploaded successfully", url: filePath });
  }
);

// ---------------------------
// Blog Upload Route
// ---------------------------
router.post(
  "/blog",
  protect,
  admin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/blogs/${req.file.filename}`;
    res.json({ message: "Blog image uploaded successfully", url: filePath });
  }
);

module.exports = router;
