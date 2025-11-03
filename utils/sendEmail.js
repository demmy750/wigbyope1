const nodemailer = require('nodemailer');

// Configure transporter (use your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // Or 'sendgrid', etc.
  auth: {
    user: process.env.EMAIL_USER, // e.g., yourgmail@gmail.com
    pass: process.env.EMAIL_PASS, // App password (not regular password)
  },
});

const sendOrderEmail = async (userEmail, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <h2>Order Placed Successfully!</h2>
      <p>Hi there,</p>
      <p>Your order <strong>#{order._id}</strong> has been placed.</p>
      <ul>
        <li>Total: ₦${order.totalPrice.toLocaleString()}</li>
        <li>Status: ${order.status}</li>
        <li>Items: ${order.items.map(item => `${item.product?.name} × ${item.quantity}`).join(', ')}</li>
      </ul>
      <p>Billing: ${order.billing.name}, ${order.billing.email}, ${order.billing.phone}, ${order.billing.address}</p>
      <p>Track your order <a href="http://localhost:3000/orders/${order._id}">here</a>.</p>
      <p>Thanks for shopping!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderEmail };