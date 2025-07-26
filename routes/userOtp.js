const express = require('express');
const bcrypt = require('bcryptjs');
const { sendOtpMail } = require('../utils/sendMail');
const Otp = require('../models/otp');
const User = require('../models/user');

const router = express.Router();

// Helper: Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Save OTP to DB
async function saveOtp(email, otp, purpose) {
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await Otp.create({ email, otpHash, purpose, expiresAt });
}

// ========== Withdrawal OTP ========== //
// Send OTP for withdrawal
router.post('/send-withdraw-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const otp = generateOtp();
    await saveOtp(email, otp, 'withdraw');
    await sendOtpMail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP for withdrawal
router.post('/verify-withdraw-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
    const record = await Otp.findOne({ email, purpose: 'withdraw', expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) return res.status(400).json({ message: 'Invalid OTP' });
    res.json({ message: 'OTP Verified' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// ========== Forgot Password OTP ========== //
// Send OTP for forgot password
router.post('/send-forgot-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const otp = generateOtp();
    await saveOtp(email, otp, 'forgot');
    await sendOtpMail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP for forgot password
router.post('/verify-forgot-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
    const record = await Otp.findOne({ email, purpose: 'forgot', expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'Invalid OTP' });
    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) return res.status(400).json({ message: 'Invalid OTP' });
    res.json({ message: 'OTP Verified' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;
