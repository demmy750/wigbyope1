const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Product = require("../models/Products");

// POST review
router.post("/:id", protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = {
      user: req.user._id,  // MongoDB ObjectId
      name: req.user.name, // readable name
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    console.error("Error adding review:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
