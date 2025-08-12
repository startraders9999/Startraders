const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// Get user balance for dashboard
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Find all transactions for this user
    const transactions = await require('../models/transaction').find({ userId: user._id });

    // Calculate income breakdowns
    let tradingIncome = 0, referralIncome = 0, rewardIncome = 0, salaryIncome = 0, depositedAmount = user.depositedAmount || 0;
    transactions.forEach(txn => {
      if (txn.type === 'trading_income') tradingIncome += txn.amount;
      if (txn.type === 'referral_on_trading' || txn.type === 'referral_income') referralIncome += txn.amount;
      if (txn.type === 'reward_income') rewardIncome += txn.amount;
      if (txn.type === 'salary_income') salaryIncome += txn.amount;
    });

    res.json({
      success: true,
      user: {
        balance: user.balance,
        depositedAmount,
        tradingIncome,
        referralIncome,
        rewardIncome,
        salaryIncome
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Admin login as user
router.post('/login-as-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Generate JWT token for user
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

// Admin update password for admin
router.post('/update-admin-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) return res.status(400).json({ success: false, message: 'Username and new password required' });
    const bcrypt = require('bcryptjs');
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.json({ success: true, message: 'Admin password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Admin ban user
router.post('/ban-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });
    const user = await User.findByIdAndUpdate(userId, { banned: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin delete user
router.delete('/delete-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
