const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Transaction = require('../models/transaction');

// Salary Income generate API
router.post('/generate-salary-income', async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId and amount required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.availableFund = (user.availableFund || 0) + Number(amount);
    await user.save();
    await Transaction.create({
      userId: user._id,
      amount: Number(amount),
      type: 'salary_income',
      fundType: 'availableFund',
      description: description || 'Salary Income'
    });
    res.json({ success: true, message: 'Salary income added to availableFund.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reward Income generate API
router.post('/generate-reward-income', async (req, res) => {
  try {
    const { userId, amount, description } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId and amount required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.availableFund = (user.availableFund || 0) + Number(amount);
    await user.save();
    await Transaction.create({
      userId: user._id,
      amount: Number(amount),
      type: 'reward_income',
      fundType: 'availableFund',
      description: description || 'Reward Income'
    });
    res.json({ success: true, message: 'Reward income added to availableFund.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
