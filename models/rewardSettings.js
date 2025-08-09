const mongoose = require('mongoose');

const rewardSettingsSchema = new mongoose.Schema({
  rewards: [{
    directBusiness: {
      type: Number,
      required: true
    },
    reward: {
      type: Number,
      required: true
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure there's only one reward settings document
rewardSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      rewards: [
        { directBusiness: 10000, reward: 250 },
        { directBusiness: 25000, reward: 500 },
        { directBusiness: 50000, reward: 1000 },
        { directBusiness: 100000, reward: 2000 },
        { directBusiness: 200000, reward: 5000 },
        { directBusiness: 500000, reward: 10000 },
        { directBusiness: 1000000, reward: 25000 },
        { directBusiness: 2000000, reward: 50000 }
      ]
    });
  }
  return settings;
};

rewardSettingsSchema.statics.updateSettings = async function(newRewards) {
  let settings = await this.findOne();
  if (settings) {
    settings.rewards = newRewards;
    settings.updatedAt = new Date();
    await settings.save();
  } else {
    settings = await this.create({
      rewards: newRewards
    });
  }
  return settings;
};

module.exports = mongoose.model('RewardSettings', rewardSettingsSchema);
