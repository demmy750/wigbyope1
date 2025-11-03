// backend/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { protect, admin } = require("../middleware/auth");
// const { protect } = require("../middleware/auth");
// const admin = require("../middleware/admin.dsk");

const router = express.Router();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer (store in memory instead of disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, res) => {
  const cld_upload_stream = cloudinary.uploader.upload_stream(
    { folder },
    (error, result) => {
      if (error) return res.status(500).json({ message: error.message });
      res.json({ message: "Image uploaded successfully", url: result.secure_url });
    }
  );
  streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
};

// ---------------------------
// Product Upload Route
// ---------------------------
router.post("/product", protect, admin, upload.array('image', 10), (req, res) => {
  if (!req.files) return res.status(400).json({ message: "No file uploaded" });
  uploadToCloudinary(req.file.buffer, "wigshop/products", res);
});

// ---------------------------
// Blog Upload Route
// ---------------------------
router.post("/blog", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  uploadToCloudinary(req.file.buffer, "wigshop/blogs", res);
});

module.exports = router;
