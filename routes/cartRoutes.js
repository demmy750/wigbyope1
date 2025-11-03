const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const { protect } = require("../middleware/auth");

// @desc Get user cart
// @route GET /api/cart
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product"); // ⚡ FIXED
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc Add or update item in cart
// @route POST /api/cart
// @access Private
router.post("/", protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);

    if (existing) {
      existing.quantity = quantity; // update quantity
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product"); // ⚡ FIXED
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc Remove item from cart
// @route DELETE /api/cart/:productId
// @access Private
router.delete("/:productId", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product"); // ⚡ FIXED
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc Clear cart
// @route POST /api/cart/clear
// @access Private
router.post("/clear", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    await cart.populate("items.product"); // ⚡ FIXED
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
