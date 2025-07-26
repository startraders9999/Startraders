const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Otp', otpSchema);
