
// // // const mongoose = require('mongoose');

// // // const orderItemSchema = new mongoose.Schema({
// // //   product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
// // //   quantity: { type: Number, required: true },
// // //   price: { type: Number, required: true }, // USD price at order time
// // // });

// // // const billingSchema = new mongoose.Schema({
// // //   name: { type: String, required: true },
// // //   email: { type: String, required: true },
// // //   phone: { type: String, required: true },
// // //   address: { type: String, required: true },
// // // });

// // // const orderSchema = new mongoose.Schema({
// // //   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true }, // Fixed ref (no space)
// // //   billing: { type: billingSchema, required: true },
// // //   items: [orderItemSchema],
// // //   totalPrice: { type: Number, required: true }, // Paid amount in order's currency
// // //   baseTotalUSD: { type: Number, required: true }, // USD equivalent (for accounting/taxes)
// // //   currency: { type: String, required: true, default: 'USD' }, // e.g., 'USD', 'GBP', 'NGN'
// // //   status: { type: String, default: 'Pending' }, // Pending, Paid, Processing, Shipped, Delivered, Cancelled
// // //   paymentResult: {
// // //     id: String, // Stripe PaymentIntent ID
// // //     status: String,
// // //     update_time: String,
// // //     email_address: String,
// // //   },
// // //   paidAt: { type: Date },
// // //   deliveredAt: { type: Date },
// // // }, { timestamps: true });

// // // module.exports = mongoose.model('Order', orderSchema);


// // const mongoose = require('mongoose');

// // const orderSchema = mongoose.Schema(
// //   {
// //      user: {
// //        type: mongoose.Schema.Types.ObjectId,
// //        required: true,
// //        ref: 'User ', // Fixed: No extra space
// //      },
// //     orderItems: [
// //       {
// //         name: { type: String, required: true },
// //         qty: { type: Number, required: true },
// //         image: { type: String, required: true },
// //         price: { type: Number, required: true },
// //         product: {
// //           type: mongoose.Schema.Types.ObjectId,
// //           required: true,
// //           ref: 'Product',
// //         },
// //       },
// //     ],
// //     shippingAddress: {
// //       address: { type: String, required: true },
// //       city: { type: String, required: true }, // Optional: Add if needed
// //       postalCode: { type: String, required: true }, // Optional
// //       country: { type: String, required: true },
// //     },
// //     paymentMethod: {
// //       type: String,
// //       required: true,
// //     },
// //     totalPrice: {
// //       type: Number,
// //       required: true,
// //       default: 0.0,
// //     },
// //     currency: {
// //       type: String,
// //       required: true,
// //       default: 'USD', // e.g., 'NGN', 'GBP'
// //     },
// //     baseTotalUSD: {
// //       type: Number,
// //       required: true, // USD equivalent for validation
// //     },
// //     isPaid: {
// //       type: Boolean,
// //       required: true,
// //       default: false,
// //     },
// //     paidAt: {
// //       type: Date,
// //     },
// //     paymentResult: {
// //       id: { type: String },
// //       status: { type: String },
// //       update_time: { type: Date },
// //       email_address: { type: String },
// //       currency: { type: String }, // e.g., 'ngn'
// //       amount: { type: Number }, // Subunits (e.g., 29759400 kobo)
// //     },
// //   },
// //   {
// //     timestamps: true,
// //   }
// // );

// // const Order = mongoose.model('Order', orderSchema);

// // module.exports = Order;


// // models/Order.js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      name: { type: String },
      address: { type: String, required: true },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    baseTotalUSD: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: Date },
      email_address: { type: String },
      currency: { type: String },
      amount: { type: Number },
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

