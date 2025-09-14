// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

let transporter = null;

// Ensure transporter exists (Ethereal test account) - lazy init
async function ensureTransporter() {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('🧪 Ethereal test account created (preview emails):');
  console.log('   user:', testAccount.user);
  console.log('   pass:', testAccount.pass);
  return transporter;
}

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // IMPORTANT: Do NOT hash here — your User schema pre('save') will hash it.
    user = new User({
      name,
      email,
      password, // plain here; will be hashed by schema pre('save')
      role: role || 'customer',
      verificationCode,
      isVerified: false,
    });

    await user.save();

    // Ensure transporter is ready
    await ensureTransporter();

    // Send verification email
    const mailOptions = {
      from: `"Your App" <no-reply@example.com>`,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL so you can open it in browser (Ethereal)
    console.log('📧 Verification email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('🔢 Verification code for', email, ':', verificationCode);

    return res.status(201).json({ message: 'Registered successfully. Please verify your email.' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-email
router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });
    if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ message: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await ensureTransporter();

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
    const mailOptions = {
      from: `"Your App" <no-reply@example.com>`,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Use the link: ${resetUrl}`,
      html: `<p>Use this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Password reset email preview URL:', nodemailer.getTestMessageUrl(info));

    return res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
