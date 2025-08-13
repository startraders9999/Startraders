const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  wallet: { type: Number, default: 0 }, // For daily ROI calculation and display
  depositedAmount: { type: Number, default: 0 }, // User's principal deposit
  investmentFund: { type: Number, default: 0 }, // Only deposit & reinvested returns
  availableFund: { type: Number, default: 0 }, // All non-deposit incomes
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCode: { type: String, unique: true }, // Referral system
  directReferrals: { type: Number, default: 0 }, // Direct referrals count
  unlockedLevels: { type: Number, default: 0 }, // Auto calculated as directReferrals * 2, max 15
  totalReferralTradingIncome: { type: Number, default: 0 }, // Total earned from referral trading income
  boosting: {
    isActive: { type: Boolean, default: false },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    durationHours: { type: Number, default: 24 }, // default 24 hours
    extendedDays: { type: Number, default: 200 }, // 200 or 300 days
    achieved3x: { type: Boolean, default: false },
    directReferrals: { type: Number, default: 0 },
    lastChecked: { type: Date, default: null }
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
