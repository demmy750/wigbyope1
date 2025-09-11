const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// @route POST /api/payments/:orderId/pay
// @desc  Update order payment status after successful payment
// @access Private
router.post('/:orderId/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update payment info from request body (sent from frontend after payment)
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    order.status = 'Paid';
    order.paidAt = Date.now();

    await order.save();
    res.json({ message: 'Payment successful', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;