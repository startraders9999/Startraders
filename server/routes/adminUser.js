const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// Ban user (set isActive: false)
router.post('/api/admin/ban-user', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: 'Error banning user' });
  }
});

// Delete user
router.delete('/api/admin/delete-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'Error deleting user' });
  }
});

// Login as user (dummy, returns a fake token)
router.post('/api/admin/login-as-user', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    // In real app, generate a JWT for the user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.json({ success: false, message: 'Error logging in as user' });
  }
});

module.exports = router;
