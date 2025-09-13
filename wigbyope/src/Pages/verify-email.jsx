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

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});