const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/Blogs");
const { protect, admin } = require("../middleware/auth")
// const { protect } = require("../middleware/auth");
// const admin = require("../middleware/admin.dsk");

// Multer config for blog images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/blogs/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Images only (jpg, jpeg, png)"));
    }
  },
});

// @desc   Get all blogs
// @route  GET /api/blogs
// @access Public
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("author", "name email");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Get single blog
// @route  GET /api/blogs/:id
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Create blog
// @route  POST /api/blogs
// @access Private/Admin
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: req.file ? `/uploads/blogs/${req.file.filename}` : null,
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Update blog
// @route  PUT /api/blogs/:id
// @access Private/Admin
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    if (req.file) {
      blog.image = `/uploads/blogs/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Delete blog
// @route  DELETE /api/blogs/:id
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
