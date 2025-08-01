const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ReferralTradingIncome = require('../models/referralTradingIncome');

// Level structure with correct percentages
const LEVEL_PERCENTAGES = {
  1: 15,   // 15%
  2: 10,   // 10%
  3: 8,    // 8%
  4: 6,    // 6%
  5: 4,    // 4%
  6: 3,    // 3%
  7: 3,    // 3%
  8: 2,    // 2%
  9: 2,    // 2%
  10: 1,   // 1%
  11: 1,   // 1%
  12: 0.5, // 0.50%
  13: 0.5, // 0.50%
  14: 2,   // 2%
  15: 5    // 5%
};

// Update user's unlocked levels based on direct referrals
async function updateUnlockedLevels(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Count direct referrals
    const directReferralsCount = await User.countDocuments({ referredBy: userId });
    
    // Calculate unlocked levels: 1 direct = 2 levels, max 15
    const unlockedLevels = Math.min(directReferralsCount * 2, 15);
    
    // Update user
    await User.findByIdAndUpdate(userId, {
      directReferrals: directReferralsCount,
      unlockedLevels: unlockedLevels
    });

    console.log(`Updated user ${userId}: ${directReferralsCount} direct referrals, ${unlockedLevels} unlocked levels`);
  } catch (error) {
    console.error('Error updating unlocked levels:', error);
  }
}

// Distribute referral trading income
async function distributeReferralTradingIncome(userId, tradingAmount) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    console.log(`Distributing referral trading income for user ${userId}, amount: ${tradingAmount}`);

    // Find upline chain up to 15 levels
    let currentUser = user;
    let level = 1;

    while (currentUser.referredBy && level <= 15) {
      const uplineUser = await User.findById(currentUser.referredBy);
      if (!uplineUser) break;

      // Update upline user's unlocked levels
      await updateUnlockedLevels(uplineUser._id);
      
      // Refresh upline user data
      const refreshedUplineUser = await User.findById(uplineUser._id);

      // Check if this level is unlocked for upline user
      if (level <= refreshedUplineUser.unlockedLevels) {
        const percentage = LEVEL_PERCENTAGES[level];
        const incomeAmount = (tradingAmount * percentage) / 100;

        // Create referral trading income record
        const referralIncome = new ReferralTradingIncome({
          userId: uplineUser._id,
          fromUserId: userId,
          level: level,
          percentage: percentage,
          tradingAmount: tradingAmount,
          incomeAmount: incomeAmount
        });

        await referralIncome.save();

        // Update upline user's balance and total referral trading income
        await User.findByIdAndUpdate(uplineUser._id, {
          $inc: { 
            balance: incomeAmount,
            totalReferralTradingIncome: incomeAmount
          }
        });

        console.log(`Gave ${incomeAmount} to user ${uplineUser._id} at level ${level} (${percentage}%)`);
      } else {
        console.log(`Level ${level} locked for user ${uplineUser._id} (has ${refreshedUplineUser.unlockedLevels} unlocked levels)`);
      }

      currentUser = uplineUser;
      level++;
    }
  } catch (error) {
    console.error('Error distributing referral trading income:', error);
  }
}

// Get user's referral trading income data
router.get('/user/referral-trading-income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Update unlocked levels first
    await updateUnlockedLevels(userId);
    const refreshedUser = await User.findById(userId);

    // Get referral trading income history
    const incomeHistory = await ReferralTradingIncome.find({ userId })
      .populate('fromUserId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate total income
    const totalIncome = refreshedUser.totalReferralTradingIncome || 0;

    res.json({
      success: true,
      totalIncome: totalIncome,
      directReferrals: refreshedUser.directReferrals,
      unlockedLevels: refreshedUser.unlockedLevels,
      incomeHistory: incomeHistory.map(income => ({
        _id: income._id,
        level: income.level,
        percentage: income.percentage,
        tradingAmount: income.tradingAmount,
        incomeAmount: income.incomeAmount,
        fromUser: income.fromUserId ? income.fromUserId.name : 'Unknown',
        date: income.createdAt,
        status: income.status
      }))
    });
  } catch (error) {
    console.error('Error fetching referral trading income:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Manual trigger for testing (admin only)
router.post('/admin/trigger-referral-trading-income', async (req, res) => {
  try {
    const { userId, tradingAmount } = req.body;
    
    if (!userId || !tradingAmount) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    await distributeReferralTradingIncome(userId, tradingAmount);
    
    res.json({ success: true, message: 'Referral trading income distributed successfully' });
  } catch (error) {
    console.error('Error in manual trigger:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Create sample data for testing
router.post('/admin/create-sample-data', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.json({ success: false, message: 'Missing userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Create sample referral trading income records
    const sampleData = [
      { level: 1, percentage: 15, tradingAmount: 1000, incomeAmount: 150 },
      { level: 2, percentage: 10, tradingAmount: 500, incomeAmount: 50 },
      { level: 3, percentage: 8, tradingAmount: 800, incomeAmount: 64 },
      { level: 1, percentage: 15, tradingAmount: 1200, incomeAmount: 180 }
    ];

    let totalSampleIncome = 0;

    for (const sample of sampleData) {
      const referralIncome = new ReferralTradingIncome({
        userId: userId,
        fromUserId: userId, // Self for testing
        level: sample.level,
        percentage: sample.percentage,
        tradingAmount: sample.tradingAmount,
        incomeAmount: sample.incomeAmount
      });

      await referralIncome.save();
      totalSampleIncome += sample.incomeAmount;
    }

    // Update user with sample data
    await User.findByIdAndUpdate(userId, {
      $inc: { 
        balance: totalSampleIncome,
        totalReferralTradingIncome: totalSampleIncome
      },
      directReferrals: 3,
      unlockedLevels: 6
    });

    res.json({ 
      success: true, 
      message: 'Sample data created successfully',
      totalIncome: totalSampleIncome,
      recordsCreated: sampleData.length
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Export the distribution function for use in other modules
module.exports = {
  router,
  distributeReferralTradingIncome,
  updateUnlockedLevels
};
