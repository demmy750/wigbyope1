const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

let transporter = null;

// Lazy init Ethereal transporter
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

  console.log('🧪 Ethereal test account created:');
  console.log('   user:', testAccount.user);
  console.log('   pass:', testAccount.pass);
  return transporter;
}

// ----------------------
// Register
// ----------------------
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password, // will be hashed by schema pre-save
      role: role || 'customer',
      verificationCode,
      isVerified: false,
    });

    await user.save();

    await ensureTransporter();

    const mailOptions = {
      from: `"Your App" <no-reply@example.com>`,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Verification email preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('🔢 Verification code for', email, ':', verificationCode);

    return res.status(201).json({ message: 'Registered successfully. Please verify your email.', email });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Verify Email
// ----------------------
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    // ✅ Correct query
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined; // clear code
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post('/verify-email', async (req, res) => {
//   const { email, code } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'User not found' });
//     if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });
//     if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid verification code' });

//     user.isVerified = true;
//     user.verificationCode = null;
//     await user.save();

//     // Auto-login after verification
//     const payload = { id: user._id, role: user.role };
//     const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1d' });

//     return res.json({ message: 'Email verified successfully', token });
//   } catch (error) {
//     console.error('Verify email error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// ----------------------
// Login
// ----------------------
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

    return res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// Forgot Password
// ----------------------
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

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
      text: `Use this link to reset your password: ${resetUrl}`,
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

// ----------------------
// Reset Password
// ----------------------
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
