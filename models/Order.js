
// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String },
//         price: { type: Number, required: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: "Product",
//         },
//       },
//     ],
//     shippingAddress: {
//       name: { type: String },
//       address: { type: String, required: true },
//       city: { type: String },
//       postalCode: { type: String },
//       country: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     currency: {
//       type: String,
//       required: true,
//       default: "USD",
//     },
//     baseTotalUSD: {
//       type: Number,
//       required: true,
//     },
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: Date },
//       email_address: { type: String },
//       currency: { type: String },
//       amount: { type: Number },
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save hook for validation (optional, but helps prevent bad data)
// orderSchema.pre('save', function (next) {
//   if (this.orderItems.length === 0) {
//     const err = new Error('Order must have at least one item');
//     return next(err);
//   }
//   next();
// });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;

// const mongoose = require("mongoose");

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String },
//         price: { type: Number, required: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: "Product",
//         },
//       },
//     ],
//     shippingAddress: {
//       name: { type: String },
//       address: { type: String, required: true },
//       city: { type: String },
//       postalCode: { type: String },
//       country: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     currency: {
//       type: String,
//       required: true,
//       default: "USD",
//     },
//     baseTotalUSD: {
//       type: Number,
//       required: true,
//     },
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: Date },
//       email_address: { type: String },
//       currency: { type: String },
//       amount: { type: Number },
//     },
//     status: {
//       type: String,
//       enum: ["Pending", "Paid", "Processing", "Customizing", "Shipped", "Delivered", "Cancelled"], // Added "Customizing"
//       default: "Pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Pre-save hook for validation
// orderSchema.pre('save', function (next) {
//   if (this.orderItems.length === 0) {
//     const err = new Error('Order must have at least one item');
//     return next(err);
//   }
//   next();
// });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;





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
      email: { type: String, required: true }, // Added for email notifications
      phone: { type: String }, // Added for completeness
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

// Pre-save hook for validation (optional, but helps prevent bad data)
orderSchema.pre('save', function (next) {
  if (this.orderItems.length === 0) {
    const err = new Error('Order must have at least one item');
    return next(err);
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;