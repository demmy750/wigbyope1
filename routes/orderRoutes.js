// // // const express = require("express");
// // // const router = express.Router();
// // // const Order = require("../models/Order");
// // // const Cart = require("../models/Cart");
// // // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // // const { protect, admin } = require("../middleware/auth");
// // // const { createOrder, updateOrderPayment, getMyOrders } = require('../controllers/orderController');


// // // // Helper for rates
// // // async function getExchangeRates() {
// // //   try {
// // //     const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
// // //     if (!response.ok) throw new Error('Failed to fetch rates');
// // //     const data = await response.json();
// // //     return data.rates;
// // //   } catch (error) {
// // //     console.error('Exchange rates error:', error);
// // //     throw new Error('Currency conversion unavailable');
// // //   }
// // // }

// // // // POST /api/orders
// // // router.post("/", protect, async (req, res) => {
// // //   try {
// // //     let orderItems = req.body.items;
// // //     let totalPrice = req.body.totalPrice;
// // //     let baseTotalUSD = req.body.baseTotalUSD;
// // //     const currency = req.body.currency || 'USD';
// // //     const billing = req.body.billing;

// // //     if (!billing || !billing.name || !billing.email || !billing.phone || !billing.address) {
// // //       return res.status(400).json({ message: "Billing information is required" });
// // //     }

// // //     if (!orderItems || orderItems.length === 0) {
// // //       const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
// // //       if (!cart || cart.items.length === 0) {
// // //         return res.status(400).json({ message: "Cart is empty" });
// // //       }
// // //       orderItems = cart.items.map((item) => ({
// // //         product: item.product._id,
// // //         quantity: item.quantity,
// // //         price: item.product.price,
// // //       }));
// // //       baseTotalUSD = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // //       currency = 'USD';
// // //       totalPrice = baseTotalUSD;
// // //     } else {
// // //       if (!baseTotalUSD) {
// // //         baseTotalUSD = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // //       }
// // //       if (!totalPrice) {
// // //         totalPrice = baseTotalUSD;
// // //       }
// // //     }

// // //     // Validate conversion
// // //     if (currency !== 'USD') {
// // //       const rates = await getExchangeRates();
// // //       const rate = rates[currency] || 1;
// // //       const expectedTotal = baseTotalUSD * rate;
// // //       if (Math.abs(totalPrice - expectedTotal) > 0.01) {
// // //         return res.status(400).json({ message: 'Currency amount mismatch' });
// // //       }
// // //     } else if (Math.abs(totalPrice - baseTotalUSD) > 0.01) {
// // //       return res.status(400).json({ message: 'Amount mismatch for USD' });
// // //     }

// // //     // Stripe PaymentIntent
// // //     const paymentIntent = await stripe.paymentIntents.create({
// // //       amount: Math.round(totalPrice * 100),
// // //       currency: currency.toLowerCase(),
// // //       metadata: { userId: req.user._id.toString() },
// // //       receipt_email: billing.email,
// // //     });

// // //     const order = new Order({
// // //       user: req.user._id,
// // //       billing,
// // //       items: orderItems,
// // //       totalPrice,
// // //       baseTotalUSD,
// // //       currency,
// // //       status: "Pending",
// // //       paymentResult: { id: paymentIntent.id, status: paymentIntent.status },
// // //     });
// // //     await order.save();

// // //     // Clear cart
// // //     try {
// // //       const cart = await Cart.findOne({ user: req.user._id });
// // //       if (cart) {
// // //         cart.items = [];
// // //         await cart.save();
// // //       }
// // //     } catch (clearErr) {
// // //       console.warn("Failed to clear cart:", clearErr);
// // //     }

// // //     res.status(201).json({
// // //       ...order._doc,
// // //       clientSecret: paymentIntent.client_secret,
// // //     });
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // });

// // // // GET /api/orders
// // // router.get("/", protect, async (req, res) => {
// // //   try {
// // //     const orders = await Order.find({ user: req.user._id })
// // //       .sort({ createdAt: -1 })
// // //       .populate("items.product", "name price image");
// // //     res.json(orders);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // });

// // // // GET /api/orders/:id
// // // router.get("/:id", protect, async (req, res) => {
// // //   try {
// // //     const order = await Order.findById(req.params.id).populate("items.product", "name price image");
// // //     if (!order) return res.status(404).json({ message: "Order not found" });
// // //     if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
// // //       return res.status(401).json({ message: "Not authorized" });
// // //     }
// // //     res.json(order);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   } 
// // // });

// // // // PUT /api/orders/:id/pay
// // // router.put("/:id/pay", protect, async (req, res) => {
// // //   try {
// // //     const { paymentIntentId } = req.body;
// // //     const order = await Order.findById(req.params.id);
// // //     if (!order) return res.status(404).json({ message: "Order not found" });
// // //     if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
// // //       return res.status(401).json({ message: "Not authorized" });
// // //     }

// // //     let paymentIntent = await stripe.paymentIntents.retrieve(order.paymentResult.id);
// // //     if (paymentIntentId) {
// // //       paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
// // //     }

// // //     if (paymentIntent.status === 'succeeded') {
// // //       order.paymentResult = {
// // //         id: paymentIntent.id,
// // //         status: paymentIntent.status,
// // //         update_time: new Date(paymentIntent.created * 1000).toISOString(),
// // //         email_address: paymentIntent.receipt_email || "",
// // //       };
// // //       order.status = "Paid";
// // //       order.paidAt = Date.now();
// // //       await order.save();
// // //       res.json({ message: "Payment successful", order });
// // //     } else {
// // //       res.status(400).json({ message: "Payment failed" });
// // //     }
// // //   } catch (error) {
// // //     console.error('Payment error:', error);
// // //     res.status(500).json({ message: error.message });
// // //   }
// // // });

// // // // PUT /api/orders/:id/status
// // // router.put("/:id/status", protect, admin, async (req, res) => {
// // //   try {
// // //     const { status } = req.body;
// // //     const validStatuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
// // //     if (!validStatuses.includes(status)) {
// // //       return res.status(400).json({ message: "Invalid status" });
// // //     }

// // //     const order = await Order.findById(req.params.id);
// // //     if (!order) return res.status(404).json({ message: "Order not found" });

// // //     order.status = status;
// // //     if (status === "Delivered") {
// // //       order.deliveredAt = Date.now();
// // //     }

// // //     await order.save();
// // //     res.json(order);
// // //   } catch (error) {
// // //     res.status(500).json({ message: error.message });   
// // //   }
// // // });

// // // module.exports = router;



// // const express = require('express');
// // const asyncHandler = require('express-async-handler');
// // const router = express.Router(); // Create router instance
// // const Order = require('../models/Order');
// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // const { protect } = require('../middleware/auth'); // Import protect middleware

// // // @desc    Create new order
// // // @route   POST /api/orders
// // // @access  Private
// // router.post(
// //   '/',
// //   protect, // Apply auth middleware
// //   asyncHandler(async (req, res) => {
// //     const { items, billing, totalPrice, baseTotalUSD, currency } = req.body;

// //     if (!items || items.length === 0) {
// //       res.status(400);
// //       throw new Error('No order items');
// //     }

// //     // Validate total (security: check against USD base + tolerance for rate fluctuations)
// //     const calculatedUSD = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
// //     if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) { // 1% tolerance
// //       res.status(400);
// //       throw new Error('Order total mismatch (possible tampering)');
// //     }

// //     // Create Stripe PaymentIntent
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: Math.round(totalPrice * 100), // Convert to subunits (e.g., 29759400 kobo for NGN)
// //       currency: currency.toLowerCase(), // e.g., 'ngn'
// //       metadata: {
// //         orderId: 'temp', // Will update after order creation
// //         baseTotalUSD: baseTotalUSD.toString(),
// //         country: billing.country || 'US', // Include country for Stripe metadata (new)
// //       },
// //     });

// //     // Create order in DB (include country in shippingAddress)
// //     const order = new Order({
// //       user: req.user._id, // From protect middleware
// //       orderItems: items,
// //       shippingAddress: {
// //         name: billing.name, // From form
// //         address: billing.address,
// //         city: billing.city || '', // Optional; add to form if needed
// //         postalCode: billing.postalCode || '', // Optional
// //         country: billing.country || 'US', // Ensure country is set (new)
// //       },
// //       paymentMethod: 'card', // Stripe
// //       totalPrice,
// //       currency,
// //       baseTotalUSD,
// //       isPaid: false,
// //       paidAt: null,
// //       paymentResult: {
// //         id: paymentIntent.id,
// //         status: 'pending',
// //         update_time: Date.now(),
// //       },
// //     });

// //     const createdOrder = await order.save();

// //     // Update PaymentIntent metadata with real order ID
// //     await stripe.paymentIntents.update(paymentIntent.id, {
// //       metadata: { 
// //         orderId: createdOrder._id.toString(),
// //         country: billing.country || 'US', // Include country (new)
// //       },
// //     });

// //     res.status(201).json({
// //       _id: createdOrder._id,
// //       clientSecret: paymentIntent.client_secret, // For frontend confirm
// //     });
// //   })
// // );

// // // @desc    Update order payment status
// // // @route   PUT /api/orders/:id/pay
// // // @access  Private
// // router.put(
// //   '/:id/pay',
// //   protect, // Apply auth middleware
// //   asyncHandler(async (req, res) => {
// //     const { id } = req.params;
// //     const { paymentIntentId } = req.body;

// //     if (!paymentIntentId) {
// //       res.status(400);
// //       throw new Error('Payment Intent ID is required');
// //     }

// //     // Find order
// //     const order = await Order.findById(id);
// //     if (!order) {
// //       res.status(404);
// //       throw new Error('Order not found');
// //     }

// //     // If already paid, return success (idempotency)
// //     if (order.isPaid) {
// //       res.json({
// //         message: 'Order already paid',
// //         order: {
// //           id: order._id,
// //           status: 'Paid',
// //         },
// //       });
// //       return;
// //     }

// //     try {
// //       // Retrieve (not confirm!) PaymentIntent from Stripe to verify status
// //       const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

// //       // Check status
// //       if (paymentIntent.status === 'succeeded') {
// //         // Update order
// //         order.isPaid = true;
// //         order.paidAt = Date.now();
// //         order.paymentResult = {
// //           id: paymentIntentId,
// //           status: 'succeeded',
// //           update_time: Date.now(),
// //           currency: paymentIntent.currency,
// //           amount: paymentIntent.amount, // Subunits
// //         };

// //         const updatedOrder = await order.save();

// //         res.json({
// //           message: 'Order payment updated successfully',
// //           order: {
// //             id: updatedOrder._id,
// //             status: 'Paid',
// //             totalPrice: updatedOrder.totalPrice,
// //             currency: updatedOrder.currency,
// //           },
// //         });
// //       } else if (paymentIntent.status === 'requires_action') {
// //         res.status(400);
// //         throw new Error('Payment requires additional action (e.g., 3D Secure)');
// //       } else {
// //         res.status(400);
// //         throw new Error(`Payment failed: ${paymentIntent.status}`);
// //       }
// //     } catch (stripeError) {
// //       console.error('Stripe retrieve error:', stripeError);

// //       // Handle "already succeeded" or other idempotent errors gracefully
// //       if (stripeError.code === 'payment_intent_already_succeeded' || 
// //           stripeError.message.includes('already succeeded')) {
// //         // Treat as success: Update DB anyway
// //         order.isPaid = true;
// //         order.paidAt = Date.now();
// //         order.paymentResult = {
// //           id: paymentIntentId,
// //           status: 'succeeded',
// //           update_time: Date.now(),
// //         };
// //         await order.save();

// //         res.json({
// //           message: 'Payment already confirmed. Order updated.',
// //           order: {
// //             id: order._id,
// //             status: 'Paid',
// //           },
// //         });
// //       } else {
// //         res.status(400);
// //         throw new Error(stripeError.message || 'Payment verification failed');
// //       }
// //     }
// //   })
// // );

// // // @desc    Get logged in user orders
// // // @route   GET /api/orders
// // // @access  Private
// // router.get(
// //   '/',
// //   protect, // Apply auth middleware
// //   asyncHandler(async (req, res) => {
// //     const orders = await Order.find({ user: req.user._id })
// //       .populate('orderItems.product', 'name price images') // Populate product details
// //       .sort({ createdAt: -1 }); // Newest first
// //     res.json(orders);
// //   })
// // );

// // // Export the router instance (for app.use in server.js)
// // module.exports = router;



// // const express = require('express');
// // const asyncHandler = require('express-async-handler');
// // const router = express.Router();
// // const Order = require('../models/Order');
// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // const { protect } = require('../middleware/auth');
// // const sgMail = require('@sendgrid/mail'); // For email

// // // SendGrid setup
// // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// // const SEND_EMAILS = process.env.SEND_EMAILS === 'true'; // Set to false in .env to disable

// // // Function to send order confirmation email
// // const sendOrderEmail = async (order) => {
// //   if (!SEND_EMAILS) {
// //     console.log('Email sending disabled. Order:', order._id);
// //     return;
// //   }

// //   const symbol = getCurrencySymbol(order.currency); // Helper below
// //   const htmlContent = `
// //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //       <h1 style="color: #28a745; text-align: center;">Order Confirmed! 🎉</h1>
// //       <p>Hi ${order.shippingAddress.name},</p>
// //       <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      
// //       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
// //       <ul style="list-style: none; padding: 0;">
// //         ${order.orderItems.map(item => `
// //           <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
// //             <strong>${item.name}</strong> × ${item.qty} - ${symbol}${ (item.price * item.qty).toFixed(2) }
// //           </li>
// //         `).join('')}
// //       </ul>
// //       <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0;">
// //         Total: ${symbol}${order.totalPrice.toFixed(2)}
// //       </p>
      
// //       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
// //       <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
// //       <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
// //       <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
      
// //       <p><strong>Status:</strong> ${order.status}</p>
// //       <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      
// //       <p>Thank you for shopping with us! We'll notify you when your order ships.</p>
// //       <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success/${order._id}" 
// //          style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
// //         View Your Order
// //       </a>
// //     </div>
// //   `;

// //   const msg = {
// //     to: order.shippingAddress.email,
// //     from: 'noreply@yourstore.com', // Replace with your verified SendGrid sender (set in SendGrid dashboard)
// //     subject: `Order Confirmation #${order._id} - Thank You!`,
// //     html: htmlContent,
// //   };

// //   try {
// //     await sgMail.send(msg);
// //     console.log(`Email sent to ${order.shippingAddress.email} for order ${order._id}`);
// //   } catch (error) {
// //     console.error('Email send failed:', error.response ? error.response.body : error.message);
// //     // Don't throw – log only, order still succeeds
// //   }
// // };

// // // Helper for currency symbols (used in email)
// // const getCurrencySymbol = (currency) => {
// //   const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
// //   return symbols[currency] || '$';
// // };

// // // @desc    Create new order
// // // @route   POST /api/orders
// // // @access  Private
// // router.post(
// //   '/',
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const { items, shippingAddress, totalPrice, baseTotalUSD, currency, paymentMethod = 'Stripe' } = req.body;

// //     if (!items || items.length === 0) {
// //       res.status(400);
// //       throw new Error('No order items');
// //     }

// //     // Validate total (security: check against USD base)
// //     const calculatedUSD = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
// //     if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) {
// //       res.status(400);
// //       throw new Error('Order total mismatch (possible tampering)');
// //     }

// //     // Create Stripe PaymentIntent
// //     const paymentIntent = await stripe.paymentIntents.create({
// //       amount: Math.round(totalPrice * 100), // Subunits
// //       currency: currency.toLowerCase(),
// //       metadata: {
// //         orderId: 'temp',
// //         baseTotalUSD: baseTotalUSD.toString(),
// //         country: shippingAddress.country || 'US',
// //       },
// //     });

// //     // Create order (map items to schema)
// //     const orderItems = items.map(item => ({
// //       name: item.name,
// //       qty: item.qty || item.quantity,
// //       image: item.image,
// //       price: item.price,
// //       product: item.product,
// //     }));

// //     const order = new Order({
// //       user: req.user._id,
// //       orderItems,
// //       shippingAddress, // Full object (includes email, phone now)
// //       paymentMethod,
// //       totalPrice,
// //       currency,
// //       baseTotalUSD,
// //       isPaid: false,
// //       paymentResult: {
// //         id: paymentIntent.id,
// //         status: 'pending',
// //         update_time: Date.now(),
// //       },
// //     });

// //     const createdOrder = await order.save();

// //     // Update PaymentIntent metadata with real order ID
// //     await stripe.paymentIntents.update(paymentIntent.id, {
// //       metadata: { 
// //         orderId: createdOrder._id.toString(),
// //         country: shippingAddress.country || 'US',
// //       },
// //     });

// //     res.status(201).json({
// //       _id: createdOrder._id,
// //       clientSecret: paymentIntent.client_secret,
// //     });
// //   })
// // );

// // // @desc    Update order payment status (with email)
// // router.put(
// //   '/:id/pay',
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const { id } = req.params;
// //     const { paymentIntentId } = req.body;

// //     if (!paymentIntentId) {
// //       res.status(400);
// //       throw new Error('Payment Intent ID is required');
// //     }

// //     const order = await Order.findById(id);
// //     if (!order || order.user.toString() !== req.user._id.toString()) {
// //       res.status(404);
// //       throw new Error('Order not found');
// //     }

// //     if (order.isPaid) {
// //       res.json({ message: 'Order already paid', order: { id: order._id, status: 'Paid' } });
// //       return;
// //     }

// //     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

// //     if (paymentIntent.status === 'succeeded') {
// //       order.isPaid = true;
// //       order.paidAt = Date.now();
// //       order.paymentResult = {
// //         id: paymentIntentId,
// //         status: 'succeeded',
// //         update_time: Date.now(),
// //         currency: paymentIntent.currency,
// //         amount: paymentIntent.amount,
// //       };
// //       order.status = 'Paid';

// //       const updatedOrder = await order.save();

// //       // Send confirmation email immediately
// //       await sendOrderEmail(updatedOrder);

// //       res.json({
// //         message: 'Order payment updated successfully',
// //         order: {
// //           id: updatedOrder._id,
// //           status: 'Paid',
// //           totalPrice: updatedOrder.totalPrice,
// //           currency: updatedOrder.currency,
// //         },
// //       });
// //     } else if (paymentIntent.status === 'requires_action') {
// //       res.status(400);
// //       throw new Error('Payment requires additional action (e.g., 3D Secure)');
// //     } else {
// //       res.status(400);
// //       throw new Error(`Payment failed: ${paymentIntent.status}`);
// //     }
// //   })
// // );

// // // @desc    Get single order by ID (NEW – fixes fetch error on success page)
// // router.get(
// //   '/:id',
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const order = await Order.findById(req.params.id)
// //       .populate('orderItems.product', 'name price images'); // Optional: Populate product details

// //     if (!order) {
// //       res.status(404);
// //       throw new Error('Order not found');
// //     }

// //     if (order.user.toString() !== req.user._id.toString()) {
// //       res.status(403);
// //       throw new Error('Not authorized to view this order');
// //     }

// //     res.json(order);
// //   })
// // );

// // // @desc    Get order invoice (NEW – placeholder for PDF download)
// // router.get(
// //   '/:id/invoice',
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const order = await Order.findById(req.params.id);
// //     if (!order || order.user.toString() !== req.user._id.toString()) {
// //       res.status(404);
// //       throw new Error('Order not found');
// //     }

// //     // Placeholder: Simple text invoice (expand with pdfkit later)
// //     const symbol = getCurrencySymbol(order.currency);
// //     const invoiceText = `INVOICE - Order #${order._id}
// // Date: ${new Date().toLocaleString()}
// // Customer: ${order.shippingAddress.name} (${order.shippingAddress.email})

// // Items:
// // ${order.orderItems.map(item => `  ${item.name} x${item.qty} @ ${symbol}${item.price} = ${symbol}${ (item.price * item.qty).toFixed(2) }`).join('\n')}

// // Total: ${symbol}${order.totalPrice.toFixed(2)}
// // Status: ${order.status}

// // Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
// //     `;

// //     res.set({
// //       'Content-Type': 'text/plain',
// //       'Content-Disposition': `attachment; filename="invoice-${order._id}.txt"`,
// //     });
// //     res.send(invoiceText);
// //   })
// // );

// // // @desc    Get logged in user orders (original, unchanged)
// // router.get(
// //   '/',
// //   protect,
// //   asyncHandler(async (req, res) => {
// //     const orders = await Order.find({ user: req.user._id })
// //       .populate('orderItems.product', 'name price images')
// //       .sort({ createdAt: -1 });
// //     res.json(orders);
// //   })
// // );

// // module.exports = router;




// const express = require('express');
// const asyncHandler = require('express-async-handler');
// const router = express.Router();
// const Order = require('../models/Order');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { protect, admin } = require('../middleware/auth'); // Ensure 'admin' is imported
// const sgMail = require('@sendgrid/mail'); // For email

// // SendGrid setup
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const SEND_EMAILS = process.env.SEND_EMAILS === 'true'; // Set to false in .env to disable

// // Function to send order confirmation email
// const sendOrderEmail = async (order) => {
//   if (!SEND_EMAILS) {
//     console.log('Email sending disabled. Order:', order._id);
//     return;
//   }

//   const symbol = getCurrencySymbol(order.currency);
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <h1 style="color: #28a745; text-align: center;">Order Confirmed! 🎉</h1>
//       <p>Hi ${order.shippingAddress.name},</p>
//       <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
//       <ul style="list-style: none; padding: 0;">
//         ${order.orderItems.map(item => `
//           <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
//             <strong>${item.name}</strong> × ${item.qty} - ${symbol}${(item.price * item.qty).toFixed(2)}
//           </li>
//         `).join('')}
//       </ul>
//       <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0;">
//         Total: ${symbol}${order.totalPrice.toFixed(2)}
//       </p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
//       <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
//       <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
//       <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
      
//       <p><strong>Status:</strong> ${order.status}</p>
//       <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      
//       <p>Thank you for shopping with us! We'll notify you when your order ships.</p>
//       <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success/${order._id}" 
//          style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
//         View Your Order
//       </a>
//     </div>
//   `;

//   const msg = {
//     to: order.shippingAddress.email,
//     from: 'noreply@yourstore.com', // Replace with your verified SendGrid sender
//     subject: `Order Confirmation #${order._id} - Thank You!`,
//     html: htmlContent,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(`Email sent to ${order.shippingAddress.email} for order ${order._id}`);
//   } catch (error) {
//     console.error('Email send failed:', error.response ? error.response.body : error.message);
//   }
// };

// // Helper for currency symbols
// const getCurrencySymbol = (currency) => {
//   const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
//   return symbols[currency] || '$';
// };

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// router.post(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { items, shippingAddress, totalPrice, baseTotalUSD, currency, paymentMethod = 'Stripe' } = req.body;

//     if (!items || items.length === 0) {
//       res.status(400);
//       throw new Error('No order items');
//     }

//     const calculatedUSD = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
//     if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) {
//       res.status(400);
//       throw new Error('Order total mismatch (possible tampering)');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalPrice * 100),
//       currency: currency.toLowerCase(),
//       metadata: {
//         orderId: 'temp',
//         baseTotalUSD: baseTotalUSD.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     const orderItems = items.map(item => ({
//       name: item.name,
//       qty: item.qty || item.quantity,
//       image: item.image,
//       price: item.price,
//       product: item.product,
//     }));

//     const order = new Order({
//       user: req.user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       currency,
//       baseTotalUSD,
//       isPaid: false,
//       paymentResult: {
//         id: paymentIntent.id,
//         status: 'pending',
//         update_time: Date.now(),
//       },
//     });

//     const createdOrder = await order.save();

//     await stripe.paymentIntents.update(paymentIntent.id, {
//       metadata: { 
//         orderId: createdOrder._id.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     res.status(201).json({
//       _id: createdOrder._id,
//       clientSecret: paymentIntent.client_secret,
//     });
//   })
// );

// // @desc    Update order payment status
// router.put(
//   '/:id/pay',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { paymentIntentId } = req.body;

//     if (!paymentIntentId) {
//       res.status(400);
//       throw new Error('Payment Intent ID is required');
//     }

//     const order = await Order.findById(id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.isPaid) {
//       res.json({ message: 'Order already paid', order: { id: order._id, status: 'Paid' } });
//       return;
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: paymentIntentId,
//         status: 'succeeded',
//         update_time: Date.now(),
//         currency: paymentIntent.currency,
//         amount: paymentIntent.amount,
//       };
//       order.status = 'Paid';

//       const updatedOrder = await order.save();
//       await sendOrderEmail(updatedOrder);

//       res.json({
//         message: 'Order payment updated successfully',
//         order: {
//           id: updatedOrder._id,
//           status: 'Paid',
//           totalPrice: updatedOrder.totalPrice,
//           currency: updatedOrder.currency,
//         },
//       });
//     } else if (paymentIntent.status === 'requires_action') {
//       res.status(400);
//       throw new Error('Payment requires additional action (e.g., 3D Secure)');
//     } else {
//       res.status(400);
//       throw new Error(`Payment failed: ${paymentIntent.status}`);
//     }
//   })
// );

// // @desc    Get single order by ID
// router.get(
//   '/:id',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id)
//       .populate('orderItems.product', 'name price images');

//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//       res.status(403);
//       throw new Error('Not authorized to view this order');
//     }

//     res.json(order);
//   })
// );

// // @desc    Get order invoice
// router.get(
//   '/:id/invoice',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     const symbol = getCurrencySymbol(order.currency);
//     const invoiceText = `INVOICE - Order #${order._id}
// Date: ${new Date().toLocaleString()}
// Customer: ${order.shippingAddress.name} (${order.shippingAddress.email})

// Items:
// ${order.orderItems.map(item => `  ${item.name} x${item.qty} @ ${symbol}${item.price} = ${symbol}${(item.price * item.qty).toFixed(2)}`).join('\n')}

// Total: ${symbol}${order.totalPrice.toFixed(2)}
// Status: ${order.status}

// Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
//     `;

//     res.set({
//       'Content-Type': 'text/plain',
//       'Content-Disposition': `attachment; filename="invoice-${order._id}.txt"`,
//     });
//     res.send(invoiceText);
//   })
// );

// // @desc    Get logged in user orders
// router.get(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('orderItems.product', 'name price images')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   })
// );

// // @desc    Get all orders (admin only)
// // @route   GET /api/orders/all
// // @access  Private/Admin
// router.get(
//   '/all',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const orders = await Order.find({})
//       .populate('user', 'email')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   })
// );

// // @desc    Update order status (admin only)
// // @route   PUT /api/orders/:id/status
// // @access  Private/Admin
// router.put(
//   '/:id/status',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const validStatuses = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
//     if (!validStatuses.includes(status)) {
//       res.status(400);
//       throw new Error('Invalid status');
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     order.status = status;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   })
// );

// module.exports = router;





// const express = require('express');
// const asyncHandler = require('express-async-handler');
// const router = express.Router();
// const Order = require('../models/Order');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { protect, admin } = require('../middleware/auth'); // Ensure 'admin' is imported
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const SEND_EMAILS = process.env.SEND_EMAILS === 'true';

// const sendOrderEmail = async (order) => {
//   if (!SEND_EMAILS) {
//     console.log('Email sending disabled. Order:', order._id);
//     return;
//   }

//   const symbol = getCurrencySymbol(order.currency);
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <h1 style="color: #28a745; text-align: center;">Order Confirmed! 🎉</h1>
//       <p>Hi ${order.shippingAddress.name},</p>
//       <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
//       <ul style="list-style: none; padding: 0;">
//         ${order.orderItems.map(item => `
//           <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
//             <strong>${item.name}</strong> × ${item.qty} - ${symbol}${(item.price * item.qty).toFixed(2)}
//           </li>
//         `).join('')}
//       </ul>
//       <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0;">
//         Total: ${symbol}${order.totalPrice.toFixed(2)}
//       </p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
//       <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
//       <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
//       <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
      
//       <p><strong>Status:</strong> ${order.status}</p>
//       <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      
//       <p>Thank you for shopping with us! We'll notify you when your order ships.</p>
//       <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success/${order._id}" 
//          style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
//         View Your Order
//       </a>
//     </div>
//   `;

//   const msg = {
//     to: order.shippingAddress.email,
//     from: 'noreply@yourstore.com',
//     subject: `Order Confirmation #${order._id} - Thank You!`,
//     html: htmlContent,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(`Email sent to ${order.shippingAddress.email} for order ${order._id}`);
//   } catch (error) {
//     console.error('Email send failed:', error.response ? error.response.body : error.message);
//   }
// };

// const getCurrencySymbol = (currency) => {
//   const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
//   return symbols[currency] || '$';
// };

// router.post(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { items, shippingAddress, totalPrice, baseTotalUSD, currency, paymentMethod = 'Stripe' } = req.body;

//     if (!items || items.length === 0) {
//       res.status(400);
//       throw new Error('No order items');
//     }

//     const calculatedUSD = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
//     if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) {
//       res.status(400);
//       throw new Error('Order total mismatch (possible tampering)');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalPrice * 100),
//       currency: currency.toLowerCase(),
//       metadata: {
//         orderId: 'temp',
//         baseTotalUSD: baseTotalUSD.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     const orderItems = items.map(item => ({
//       name: item.name,
//       qty: item.qty || item.quantity,
//       image: item.image,
//       price: item.price,
//       product: item.product,
//     }));

//     const order = new Order({
//       user: req.user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       currency,
//       baseTotalUSD,
//       isPaid: false,
//       paymentResult: {
//         id: paymentIntent.id,
//         status: 'pending',
//         update_time: Date.now(),
//       },
//     });

//     const createdOrder = await order.save();

//     await stripe.paymentIntents.update(paymentIntent.id, {
//       metadata: { 
//         orderId: createdOrder._id.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     res.status(201).json({
//       _id: createdOrder._id,
//       clientSecret: paymentIntent.client_secret,
//     });
//   })
// );

// router.put(
//   '/:id/pay',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { paymentIntentId } = req.body;

//     if (!paymentIntentId) {
//       res.status(400);
//       throw new Error('Payment Intent ID is required');
//     }

//     const order = await Order.findById(id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.isPaid) {
//       res.json({ message: 'Order already paid', order: { id: order._id, status: 'Paid' } });
//       return;
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: paymentIntentId,
//         status: 'succeeded',
//         update_time: Date.now(),
//         currency: paymentIntent.currency,
//         amount: paymentIntent.amount,
//       };
//       order.status = 'Paid';

//       const updatedOrder = await order.save();
//       await sendOrderEmail(updatedOrder);

//       res.json({
//         message: 'Order payment updated successfully',
//         order: {
//           id: updatedOrder._id,
//           status: 'Paid',
//           totalPrice: updatedOrder.totalPrice,
//           currency: updatedOrder.currency,
//         },
//       });
//     } else if (paymentIntent.status === 'requires_action') {
//       res.status(400);
//       throw new Error('Payment requires additional action (e.g., 3D Secure)');
//     } else {
//       res.status(400);
//       throw new Error(`Payment failed: ${paymentIntent.status}`);
//     }
//   })
// );

// router.get(
//   '/:id',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id)
//       .populate('orderItems.product', 'name price images');

//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//       res.status(403);
//       throw new Error('Not authorized to view this order');
//     }

//     res.json(order);
//   })
// );

// router.get(
//   '/:id/invoice',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     const symbol = getCurrencySymbol(order.currency);
//     const invoiceText = `INVOICE - Order #${order._id}
// Date: ${new Date().toLocaleString()}
// Customer: ${order.shippingAddress.name} (${order.shippingAddress.email})

// Items:
// ${order.orderItems.map(item => `  ${item.name} x${item.qty} @ ${symbol}${item.price} = ${symbol}${(item.price * item.qty).toFixed(2)}`).join('\n')}

// Total: ${symbol}${order.totalPrice.toFixed(2)}
// Status: ${order.status}

// Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
//     `;

//     res.set({
//       'Content-Type': 'text/plain',
//       'Content-Disposition': `attachment; filename="invoice-${order._id}.txt"`,
//     });
//     res.send(invoiceText);
//   })
// );

// router.get(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('orderItems.product', 'name price images')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   })
// );

// router.get(
//   '/all',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const orders = await Order.find({})
//       .populate('user', 'email')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   })
// );

// router.put(
//   '/:id/status',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const validStatuses = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
//     if (!validStatuses.includes(status)) {
//       res.status(400);
//       throw new Error('Invalid status');
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     order.status = status;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   })
// );

// module.exports = router;








// const express = require('express');
// const asyncHandler = require('express-async-handler');
// const router = express.Router();
// const Order = require('../models/Order');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { protect, admin } = require('../middleware/auth'); // Ensure 'admin' is imported
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const SEND_EMAILS = process.env.SEND_EMAILS === 'true';

// const sendOrderEmail = async (order) => {
//   if (!SEND_EMAILS) {
//     console.log('Email sending disabled. Order:', order._id);
//     return;
//   }

//   const symbol = getCurrencySymbol(order.currency);
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <h1 style="color: #28a745; text-align: center;">Order Confirmed! 🎉</h1>
//       <p>Hi ${order.shippingAddress.name},</p>
//       <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
//       <ul style="list-style: none; padding: 0;">
//         ${order.orderItems.map(item => `
//           <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
//             <strong>${item.name}</strong> × ${item.qty} - ${symbol}${(item.price * item.qty).toFixed(2)}
//           </li>
//         `).join('')}
//       </ul>
//       <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0;">
//         Total: ${symbol}${order.totalPrice.toFixed(2)}
//       </p>
      
//       <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
//       <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
//       <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
//       <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
      
//       <p><strong>Status:</strong> ${order.status}</p>
//       <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      
//       <p>Thank you for shopping with us! We'll notify you when your order ships.</p>
//       <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success/${order._id}" 
//          style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
//         View Your Order
//       </a>
//     </div>
//   `;

//   const msg = {
//     to: order.shippingAddress.email,
//     from: 'noreply@yourstore.com',
//     subject: `Order Confirmation #${order._id} - Thank You!`,
//     html: htmlContent,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(`Email sent to ${order.shippingAddress.email} for order ${order._id}`);
//   } catch (error) {
//     console.error('Email send failed:', error.response ? error.response.body : error.message);
//   }
// };

// const getCurrencySymbol = (currency) => {
//   const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
//   return symbols[currency] || '$';
// };

// router.post(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { items, shippingAddress, totalPrice, baseTotalUSD, currency, paymentMethod = 'Stripe' } = req.body;

//     if (!items || items.length === 0) {
//       res.status(400);
//       throw new Error('No order items');
//     }

//     const calculatedUSD = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
//     if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) {
//       res.status(400);
//       throw new Error('Order total mismatch (possible tampering)');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(totalPrice * 100),
//       currency: currency.toLowerCase(),
//       metadata: {
//         orderId: 'temp',
//         baseTotalUSD: baseTotalUSD.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     const orderItems = items.map(item => ({
//       name: item.name,
//       qty: item.qty || item.quantity,
//       image: item.image,
//       price: item.price,
//       product: item.product,
//     }));

//     const order = new Order({
//       user: req.user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       currency,
//       baseTotalUSD,
//       isPaid: false,
//       paymentResult: {
//         id: paymentIntent.id,
//         status: 'pending',
//         update_time: Date.now(),
//       },
//     });

//     const createdOrder = await order.save();

//     await stripe.paymentIntents.update(paymentIntent.id, {
//       metadata: { 
//         orderId: createdOrder._id.toString(),
//         country: shippingAddress.country || 'US',
//       },
//     });

//     res.status(201).json({
//       _id: createdOrder._id,
//       clientSecret: paymentIntent.client_secret,
//     });
//   })
// );

// router.put(
//   '/:id/pay',
//   protect,
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { paymentIntentId } = req.body;

//     if (!paymentIntentId) {
//       res.status(400);
//       throw new Error('Payment Intent ID is required');
//     }

//     const order = await Order.findById(id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.isPaid) {
//       res.json({ message: 'Order already paid', order: { id: order._id, status: 'Paid' } });
//       return;
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       order.paymentResult = {
//         id: paymentIntentId,
//         status: 'succeeded',
//         update_time: Date.now(),
//         currency: paymentIntent.currency,
//         amount: paymentIntent.amount,
//       };
//       order.status = 'Paid';

//       const updatedOrder = await order.save();
//       await sendOrderEmail(updatedOrder);

//       res.json({
//         message: 'Order payment updated successfully',
//         order: {
//           id: updatedOrder._id,
//           status: 'Paid',
//           totalPrice: updatedOrder.totalPrice,
//           currency: updatedOrder.currency,
//         },
//       });
//     } else if (paymentIntent.status === 'requires_action') {
//       res.status(400);
//       throw new Error('Payment requires additional action (e.g., 3D Secure)');
//     } else {
//       res.status(400);
//       throw new Error(`Payment failed: ${paymentIntent.status}`);
//     }
//   })
// );

// router.get(
//   '/:id',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id)
//       .populate('orderItems.product', 'name price images');

//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//       res.status(403);
//       throw new Error('Not authorized to view this order');
//     }

//     res.json(order);
//   })
// );

// router.get(
//   '/:id/invoice',
//   protect,
//   asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);
//     if (!order || order.user.toString() !== req.user._id.toString()) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     const symbol = getCurrencySymbol(order.currency);
//     const invoiceText = `INVOICE - Order #${order._id}
// Date: ${new Date().toLocaleString()}
// Customer: ${order.shippingAddress.name} (${order.shippingAddress.email})

// Items:
// ${order.orderItems.map(item => `  ${item.name} x${item.qty} @ ${symbol}${item.price} = ${symbol}${(item.price * item.qty).toFixed(2)}`).join('\n')}

// Total: ${symbol}${order.totalPrice.toFixed(2)}
// Status: ${order.status}

// Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
//     `;

//     res.set({
//       'Content-Type': 'text/plain',
//       'Content-Disposition': `attachment; filename="invoice-${order._id}.txt"`,
//     });
//     res.send(invoiceText);
//   })
// );

// router.get(
//   '/',
//   protect,
//   asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id })
//       .populate('orderItems.product', 'name price images')
//       .sort({ createdAt: -1 });
//     res.json(orders);
//   })
// );

// router.get(
//   '/all',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     console.log('User ID from token:', req.user._id);
//     console.log('User role:', req.user.role);
//     try {
//       const orders = await Order.find({})
//         .populate({
//           path: 'user',
//           select: 'email',
//           options: { strictPopulate: false }
//         })
//         .sort({ createdAt: -1 });
//       console.log('Sample order:', orders[0] ? JSON.stringify(orders[0], null, 2) : 'No orders');
//       res.json(orders);
//     } catch (err) {
//       console.error('Full error in /all:', err.stack);
//       throw err;
//     }
//   })
// );
// // router.get(
// //   // '/all',
//   // protect,
//   // admin,
//   // asyncHandler(async (req, res) => {
//   //   console.log('Fetching all orders...');  // Added logging
//   //   try {
//   //     const orders = await Order.find({})
//   //       .populate({
//   //         path: 'user',
//   //         select: 'email',
//   //         options: { strictPopulate: false }  // Allow missing refs without crashing
//   //       })
//   //       .sort({ createdAt: -1 });
//   //     console.log('Orders fetched successfully:', orders.length);  // Added logging
//   //     res.json(orders);
//   //   } catch (err) {
//   //     console.error('Error in /all route:', err);  // Added logging
//   //     throw err;  // Re-throw to trigger 500 with details
//   //   }
//   // })
  
// // );

// router.put(
//   '/:id/status',
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const validStatuses = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
//     if (!validStatuses.includes(status)) {
//       res.status(400);
//       throw new Error('Invalid status');
//     }

//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       res.status(404);
//       throw new Error('Order not found');
//     }

//     order.status = status;
//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   })
// );

// module.exports = router;






const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect, admin } = require('../middleware/auth'); // Ensure 'admin' is imported
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const SEND_EMAILS = process.env.SEND_EMAILS === 'true';

const sendOrderEmail = async (order) => {
  if (!SEND_EMAILS) {
    console.log('Email sending disabled. Order:', order._id);
    return;
  }

  const symbol = getCurrencySymbol(order.currency);
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #28a745; text-align: center;">Order Confirmed! 🎉</h1>
      <p>Hi ${order.shippingAddress.name},</p>
      <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
      <ul style="list-style: none; padding: 0;">
        ${order.orderItems.map(item => `
          <li style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 5px;">
            <strong>${item.name}</strong> × ${item.qty} - ${symbol}${(item.price * item.qty).toFixed(2)}
          </li>
        `).join('')}
      </ul>
      <p style="font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0;">
        Total: ${symbol}${order.totalPrice.toFixed(2)}
      </p>
      
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
      <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>
      <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
      <p><strong>Phone:</strong> ${order.shippingAddress.phone || 'N/A'}</p>
      
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Placed on:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      
      <p>Thank you for shopping with us! We'll notify you when your order ships.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success/${order._id}" 
         style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Your Order
      </a>
    </div>
  `;

  const msg = {
    to: order.shippingAddress.email,
    from: 'noreply@yourstore.com',
    subject: `Order Confirmation #${order._id} - Thank You!`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${order.shippingAddress.email} for order ${order._id}`);
  } catch (error) {
    console.error('Email send failed:', error.response ? error.response.body : error.message);
  }
};

const sendStatusUpdateEmail = async (order, oldStatus, newStatus) => {
  if (!SEND_EMAILS) {
    console.log('Email sending disabled for status update. Order:', order._id);
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #28a745; text-align: center;">Order Status Update</h1>
      <p>Hi ${order.shippingAddress.name},</p>
      <p>Your order <strong>#${order._id}</strong> status has been updated from <strong>${oldStatus}</strong> to <strong>${newStatus}</strong>.</p>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Thank you for shopping with us!</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${order._id}" 
         style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Your Order
      </a>
    </div>
  `;

  const msg = {
    to: order.shippingAddress.email,
    from: 'noreply@yourstore.com',
    subject: `Order Status Update #${order._id}`,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`Status update email sent to ${order.shippingAddress.email} for order ${order._id}`);
  } catch (error) {
    console.error('Status update email send failed:', error.response ? error.response.body : error.message);
  }
};

const getCurrencySymbol = (currency) => {
  const symbols = { USD: '$', NGN: '₦', GBP: '£', CAD: '$', ZAR: 'R', EUR: '€' };
  return symbols[currency] || '$';
};

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { items, shippingAddress, totalPrice, baseTotalUSD, currency, paymentMethod = 'Stripe' } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    const calculatedUSD = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
    if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) {
      res.status(400);
      throw new Error('Order total mismatch (possible tampering)');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: currency.toLowerCase(),
      metadata: {
        orderId: 'temp',
        baseTotalUSD: baseTotalUSD.toString(),
        country: shippingAddress.country || 'US',
      },
    });

    const orderItems = items.map(item => ({
      name: item.name,
      qty: item.qty || item.quantity,
      image: item.image,
      price: item.price,
      product: item.product,
    }));

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      currency,
      baseTotalUSD,
      isPaid: false,
      paymentResult: {
        id: paymentIntent.id,
        status: 'pending',
        update_time: Date.now(),
      },
    });

    const createdOrder = await order.save();

    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: { 
        orderId: createdOrder._id.toString(),
        country: shippingAddress.country || 'US',
      },
    });

    res.status(201).json({
      _id: createdOrder._id,
      clientSecret: paymentIntent.client_secret,
    });
  })
);

router.put(
  '/:id/pay',
  protect,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      res.status(400);
      throw new Error('Payment Intent ID is required');
    }

    const order = await Order.findById(id);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.isPaid) {
      res.json({ message: 'Order already paid', order: { id: order._id, status: 'Paid' } });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: Date.now(),
        currency: paymentIntent.currency,
        amount: paymentIntent.amount,
      };
      order.status = 'Paid';

      const updatedOrder = await order.save();
      await sendOrderEmail(updatedOrder);

      res.json({
        message: 'Order payment updated successfully',
        order: {
          id: updatedOrder._id,
          status: 'Paid',
          totalPrice: updatedOrder.totalPrice,
          currency: updatedOrder.currency,
        },
      });
    } else if (paymentIntent.status === 'requires_action') {
      res.status(400);
      throw new Error('Payment requires additional action (e.g., 3D Secure)');
    } else {
      res.status(400);
      throw new Error(`Payment failed: ${paymentIntent.status}`);
    }
  })
);

// Reordered: Specific routes before parameterized ones to avoid CastErrors
router.get(
  '/all',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    console.log('User ID from token:', req.user._id);
    console.log('User role:', req.user.role);
    try {
      const orders = await Order.find({})
        .populate({
          path: 'user',
          select: 'email',
          options: { strictPopulate: false }
        })
        .sort({ createdAt: -1 });
      console.log('Sample order:', orders[0] ? JSON.stringify(orders[0], null, 2) : 'No orders');
      res.json(orders);
    } catch (err) {
      console.error('Full error in /all:', err.stack);
      throw err;
    }
  })
);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price images')
      .sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name price images');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  })
);

router.get(
  '/:id/invoice',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Order not found');
    }

    const symbol = getCurrencySymbol(order.currency);
    const invoiceText = `INVOICE - Order #${order._id}
Date: ${new Date().toLocaleString()}
Customer: ${order.shippingAddress.name} (${order.shippingAddress.email})

Items:
${order.orderItems.map(item => `  ${item.name} x${item.qty} @ ${symbol}${item.price} = ${symbol}${(item.price * item.qty).toFixed(2)}`).join('\n')}

Total: ${symbol}${order.totalPrice.toFixed(2)}
Status: ${order.status}

Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}
    `;

    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="invoice-${order._id}.txt"`,
    });
    res.send(invoiceText);
  })
);

// New route for admin to update order status and send email notification
router.put(
  '/:id/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const oldStatus = order.status;

    // Use findOneAndUpdate to update only the status field, avoiding full document validation
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true, runValidators: false } // Skip full validation to avoid issues with missing fields in old orders
    );

    // Send email if status changed and email exists
    if (oldStatus !== status && updatedOrder.shippingAddress?.email) {
      await sendStatusUpdateEmail(updatedOrder, oldStatus, status);
    } else if (oldStatus !== status && !updatedOrder.shippingAddress?.email) {
      console.log(`Status updated for order ${updatedOrder._id}, but no email found to notify user.`);
    }

    res.json({ message: 'Order status updated', order: updatedOrder });
  })
);

module.exports = router;