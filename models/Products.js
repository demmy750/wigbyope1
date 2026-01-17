// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true }, // reviewer name
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     description: { type: String, default: "" },
//     price: { type: Number, required: true, min: 0 },
//     category: { type: String, default: "General" },
//     color: { type: String },
//     length: { type: String },
//     stock: { type: Number, default: 0, min: 0 },
//     images: {
//       type: [String], // array of Cloudinary URLs
//       validate: {
//         validator: (arr) => arr.every((url) => typeof url === "string"),
//         message: "All images must be valid URLs",
//       },
//       default: [],
//     },
//     ratings: { type: Number, default: 0, min: 0, max: 5 },
//     numReviews: { type: Number, default: 0 },
//     reviews: [reviewSchema],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);



const mongoose = require("mongoose");

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // reviewer name
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "General" },
    color: { type: String },
    length: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    images: {
      type: [String], // Array of Cloudinary URLs
      validate: {
        validator: (arr) => arr.every((url) => typeof url === "string"),
        message: "All images must be valid URLs",
      },
      default: [],
    },
    ratings: { type: Number, default: 0, min: 0, max: 5 }, // average rating
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema], // embedded reviews
  },
  { timestamps: true }
);

// Method to add a review and update ratings
productSchema.methods.addReview = function (review) {
  this.reviews.push(review);
  this.numReviews = this.reviews.length;
  this.ratings =
    this.reviews.reduce((acc, item) => acc + item.rating, 0) / this.numReviews;
  return this.save();
};

// Optional: method to remove a review
productSchema.methods.removeReview = function (reviewId) {
  this.reviews = this.reviews.filter((r) => r._id.toString() !== reviewId.toString());
  this.numReviews = this.reviews.length;
  this.ratings =
    this.numReviews === 0
      ? 0
      : this.reviews.reduce((acc, item) => acc + item.rating, 0) / this.numReviews;
  return this.save();
};

// Optional: prevent negative stock
productSchema.pre("save", function (next) {
  if (this.stock < 0) this.stock = 0;
  next();
});

module.exports = mongoose.model("Product", productSchema);
