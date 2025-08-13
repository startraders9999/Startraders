const mongoose = require('mongoose');

const referralTradingIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, required: true }, // Level 1-15
  percentage: { type: Number, required: true }, // Income percentage
  tradingAmount: { type: Number, required: true }, // Original trading income amount
  incomeAmount: { type: Number, required: true }, // Referral income earned
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
}, { timestamps: true });

module.exports = mongoose.model('ReferralTradingIncome', referralTradingIncomeSchema);
