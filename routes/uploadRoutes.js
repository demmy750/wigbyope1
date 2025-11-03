// backend/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer (store in memory, with limits for safety)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper: Upload buffer to Cloudinary (returns a Promise)
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
};

// ---------------------------
// Product Upload Route (Multiple Images)
// ---------------------------
router.post("/product", protect, admin, upload.array("image", 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    // Upload all files in parallel and collect URLs
    const urls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, "wigshop/products"))
    );
    res.json({ message: "Images uploaded successfully", urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message || "Image upload failed" });
  }
});

// ---------------------------
// Blog Upload Route (Single Image)
// ---------------------------
router.post("/blog", protect, admin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const url = await uploadToCloudinary(req.file.buffer, "wigshop/blogs");
    res.json({ message: "Image uploaded successfully", url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message || "Image upload failed" });
  }
});

module.exports = router;