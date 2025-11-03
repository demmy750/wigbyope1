// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const { protect } = require('../middleware/auth');
// const jwt = require('jsonwebtoken');

// // GET /api/users/me - Get logged-in user profile
// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password'); // exclude password
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PUT /api/users/me - Update logged-in user profile
// router.put('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Update fields if provided
//     if (req.body.name) user.name = req.body.name;
//     if (req.body.email) user.email = req.body.email;
//     if (req.body.password) user.password = req.body.password; // will be hashed by pre-save hook

//     await user.save();

//     // Generate new token after update
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Added for password hashing

// GET /api/users/profile - Get logged-in user profile (NEW: Alias for /me to match frontend)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user); // Returns user object (e.g., { _id, name, email, country })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me - Get logged-in user profile (existing, unchanged)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me - Update logged-in user profile (existing, unchanged)
router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.country) user.country = req.body.country; // Added country update
    if (req.body.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();

    // Generate new token after update
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      country: user.country, // Include country
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const { protect } = require('../middleware/auth');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Added for password hashing

// // GET /api/users/me - Get logged-in user profile
// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password'); // exclude password
//     if (!user) return res.status(404).json({ message: 'User  not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PUT /api/users/me - Update logged-in user profile
// router.put('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: 'User  not found' });

//     // Update fields if provided
//     if (req.body.name) user.name = req.body.name;
//     if (req.body.email) user.email = req.body.email;
//     if (req.body.country) user.country = req.body.country; // Added country update
//     if (req.body.password) {
//       // Hash new password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(req.body.password, salt);
//     }

//     await user.save();

//     // Generate new token after update
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       country: user.country, // Include country
//       role: user.role,
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;