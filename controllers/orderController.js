const asyncHandler = require('express-async-handler');
const Order = require('../models/Order'); // Your Order model (ensure this exists!)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load Stripe

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, billing, totalPrice, baseTotalUSD, currency } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Validate total (security: check against USD base + tolerance for rate fluctuations)
  const calculatedUSD = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (Math.abs(calculatedUSD - baseTotalUSD) > 0.01) { // 1% tolerance
    res.status(400);
    throw new Error('Order total mismatch (possible tampering)');
  }

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100), // Convert to subunits (e.g., 29759400 kobo for NGN)
    currency: currency.toLowerCase(), // e.g., 'ngn'
    metadata: {
      orderId: 'temp', // Will update after order creation
      baseTotalUSD: baseTotalUSD.toString(),
    },
  });

  // Create order in DB
  const order = new Order({
    user: req.user._id, // From protect middleware
    orderItems: items,
    shippingAddress: billing, // Reuse billing as shipping for simplicity
    paymentMethod: 'card', // Stripe
    totalPrice,
    currency,
    baseTotalUSD,
    isPaid: false,
    paidAt: null,
    paymentResult: {
      id: paymentIntent.id,
      status: 'pending',
      update_time: Date.now(),
    },
  });

  const createdOrder = await order.save();

  // Update PaymentIntent metadata with real order ID
  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: { orderId: createdOrder._id.toString() },
  });

  res.status(201).json({
    _id: createdOrder._id,
    clientSecret: paymentIntent.client_secret, // For frontend confirm
  });
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    res.status(400);
    throw new Error('Payment Intent ID is required');
  }

  // Find order
  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // If already paid, return success (idempotency)
  if (order.isPaid) {
    res.json({
      message: 'Order already paid',
      order: {
        id: order._id,
        status: 'Paid',
      },
    });
    return;
  }

  try {
    // Retrieve (not confirm!) PaymentIntent from Stripe to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check status
    if (paymentIntent.status === 'succeeded') {
      // Update order
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: Date.now(),
        currency: paymentIntent.currency,
        amount: paymentIntent.amount, // Subunits
      };

      const updatedOrder = await order.save();

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
  } catch (stripeError) {
    console.error('Stripe retrieve error:', stripeError);

    // Handle "already succeeded" or other idempotent errors gracefully
    if (stripeError.code === 'payment_intent_already_succeeded' || 
        stripeError.message.includes('already succeeded')) {
      // Treat as success: Update DB anyway
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: Date.now(),
      };
      await order.save();

      res.json({
        message: 'Payment already confirmed. Order updated.',
        order: {
          id: order._id,
          status: 'Paid',
        },
      });
    } else {
      res.status(400);
      throw new Error(stripeError.message || 'Payment verification failed');
    }
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price image');
  res.json(orders);
});

// Export
module.exports = {
  createOrder,
  updateOrderPayment,
  getMyOrders,
};