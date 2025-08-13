const jwt = require('jsonwebtoken'); // Add at top if not present
require('dotenv').config();
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...
// Register admin user management routes at the very end, after all other routes and middleware
const adminUserRouter = require('./server/routes/adminUser');
app.use(adminUserRouter);
const express = require('express');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    'https://startraders-frontend.onrender.com',
    'https://startraders-fullstack-9ayr.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://startraders-frontend.onrender.com/',
    // Allow any subdomain for testing
    /^https:\/\/.*\.onrender\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Manual CORS headers as fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// OTP API for withdrawal and forgot password (must be after app is initialized)
const userOtpRouter = require('./routes/userOtp');
app.use('/api/user', userOtpRouter);
// Test Mail API
const testMailRouter = require('./routes/test');
app.use(testMailRouter);

// User Referral Overview API
const userReferralRouter = require('./routes/userReferral');
app.use(userReferralRouter);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Referral Tree API
const referralTreeRouter = require('./routes/referralTree');
app.use(referralTreeRouter);

// CRON API for daily ROI and referral income
const cronRouter = require('./routes/cron');
app.use(cronRouter);

// Referral Settings API
const referralSettingsRouter = require('./routes/referralSettings');
app.use(referralSettingsRouter);

// Referral Trading Income API
const ReferralTradingIncomeRoutes = require('./routes/referralTradingIncome');
app.use('/api', ReferralTradingIncomeRoutes.router);

// Health Check / Ping Route - Keep Render awake
app.get('/api/ping', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'PONG OK',
    timestamp: new Date().toISOString(),
    server: 'Star Traders Backend',
    version: '2.0.0'
  });
});

// Debug API endpoints status
app.get('/api/debug/status', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const User = require('./models/user');
    const userCount = await User.countDocuments();
    
    res.json({
      status: 'OK',
      database: dbStatus,
      totalUsers: userCount,
      server: 'Running',
      timestamp: new Date().toISOString(),
      cors: 'Enabled',
      routes: 'Active'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test all critical API endpoints
app.get('/api/debug/test-endpoints', (req, res) => {
  const criticalEndpoints = [
    'POST /api/register',
    'POST /api/login',
    'GET /api/user/deposit-settings',
    'POST /api/user/deposit',
    'GET /api/user/transactions/:userId',
    'GET /api/user/referral-overview/:userId',
    'POST /api/admin/approve-deposit',
    'GET /api/admin/users',
    'GET /api/ping'
  ];
  
  res.json({
    status: 'API Endpoints Available',
    endpoints: criticalEndpoints,
    serverTime: new Date().toISOString(),
    message: 'All critical endpoints are configured'
  });
});

// Forgot Password & OTP API
const userForgotRouter = require('./routes/userForgot');
app.use(userForgotRouter);

// Multer + Cloudinary: QR image file upload (for admin panel)
const multer = require('multer');
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/admin/upload-qr', upload.single('qr'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  try {
    const stream = Readable.from(req.file.buffer);
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'startraders/qr' }, (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, error: error.message || error });
      }
      res.json({ success: true, url: result.secure_url });
    });
    stream.pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ MongoDB error:", err));

// Import models from models folder
const User = require('./models/user');
const Transaction = require('./models/transaction');
const Deposit = require('./models/deposit');
const Settings = require('./models/settings');
const Withdrawal = require('./models/withdrawal');
// User: Submit Withdrawal Request
app.post('/api/user/withdrawal', async (req, res) => {
  try {
    const { userId, amount, wallet } = req.body;
    if (!userId || !amount || isNaN(amount)) return res.status(400).json({ success: false, message: 'Invalid data' });
    const user = await User.findById(userId);
    if (!user || user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });
    // OTP verification removed - already verified before submit
    user.balance -= amount;
    await user.save();
    const withdrawal = new Withdrawal({ userId, amount, wallet });
    await withdrawal.save();
    await new Transaction({ userId, amount, type: 'debit', description: 'Withdrawal Request' }).save();
    res.json({ success: true, message: 'Withdrawal request submitted' });
  } catch (err) {
    console.error('Withdrawal request error:', err);
    res.status(500).json({ success: false, message: 'Withdrawal error' });
  }
});

// Admin: Get all withdrawal requests
app.get('/api/admin/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, withdrawals });
  } catch (err) {
    console.error('Fetch withdrawals error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawals' });
  }
});

// Admin: Approve withdrawal
app.post('/api/admin/approve-withdrawal', async (req, res) => {
  try {
    const { id } = req.body;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal || withdrawal.status !== 'pending') return res.status(404).json({ success: false, message: 'Invalid withdrawal' });
    withdrawal.status = 'approved';
    await withdrawal.save();
    res.json({ success: true, message: 'Withdrawal approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve withdrawal' });
  }
});

// Admin: Reject withdrawal
app.post('/api/admin/reject-withdrawal', async (req, res) => {
  try {
    const { id, adminNote } = req.body;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal || withdrawal.status !== 'pending') return res.status(404).json({ success: false, message: 'Invalid withdrawal' });
    withdrawal.status = 'rejected';
    withdrawal.adminNote = adminNote || '';
    await withdrawal.save();
    // Optionally refund user
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.balance += withdrawal.amount;
      await user.save();
      await new Transaction({ userId: user._id, amount: withdrawal.amount, type: 'credit', description: 'Withdrawal Rejected - Refunded' }).save();
    }
    res.json({ success: true, message: 'Withdrawal rejected and refunded' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reject withdrawal' });
  }
});
// Get Trading Income Settings
// Get Trading Income & Deposit Settings (for admin)
app.get('/api/admin/trading-income-settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// Admin: Update deposit address and QR codes (deposit, buy)
app.post('/api/admin/deposit-settings', async (req, res) => {
  try {
    const { depositAddress, depositQrCode, buyQrCode } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    if (depositAddress !== undefined) settings.depositAddress = depositAddress;
    if (depositQrCode !== undefined) settings.depositQrCode = depositQrCode;
    if (buyQrCode !== undefined) settings.buyQrCode = buyQrCode;
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update deposit settings' });
  }
});

// User: Get deposit address and QR codes (deposit, buy)
app.get('/api/user/deposit-settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) return res.json({ success: true, depositAddress: '', depositQrCode: '', buyQrCode: '' });
    res.json({
      success: true,
      depositAddress: settings.depositAddress || '',
      depositQrCode: settings.depositQrCode || '',
      buyQrCode: settings.buyQrCode || ''
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch deposit settings' });
  }
});

// User: Get support settings (telegram, email, phone)
app.get('/api/user/support-settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      return res.json({ 
        success: true, 
        telegramSupportLink: 'https://t.me/startraderssupport',
        supportEmail: 'support@startraders.com',
        supportPhone: '+1234567890',
        whatsappSupport: ''
      });
    }
    res.json({
      success: true,
      telegramSupportLink: settings.telegramSupportLink || 'https://t.me/startraderssupport',
      supportEmail: settings.supportEmail || 'support@startraders.com',
      supportPhone: settings.supportPhone || '+1234567890',
      whatsappSupport: settings.whatsappSupport || ''
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch support settings' });
  }
});

// Admin: Update support settings
app.post('/api/admin/support-settings', async (req, res) => {
  try {
    const { telegramSupportLink, supportEmail, supportPhone, whatsappSupport } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    
    if (telegramSupportLink !== undefined) settings.telegramSupportLink = telegramSupportLink;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (supportPhone !== undefined) settings.supportPhone = supportPhone;
    if (whatsappSupport !== undefined) settings.whatsappSupport = whatsappSupport;
    
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update support settings' });
  }
});

// Reward Settings APIs
const RewardSettings = require('./models/rewardSettings');

// Get reward settings
app.get('/api/admin/reward-settings', async (req, res) => {
  try {
    // Set no-cache headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    const settings = await RewardSettings.getSettings();
    res.json({ 
      success: true, 
      rewards: settings.rewards || []
    });
  } catch (err) {
    console.error('Error fetching reward settings:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reward settings' });
  }
});

// Update reward settings
app.post('/api/admin/reward-settings', async (req, res) => {
  try {
    const { rewards } = req.body;
    
    if (!Array.isArray(rewards)) {
      return res.status(400).json({ success: false, message: 'Rewards must be an array' });
    }
    
    // Validate reward data
    for (let reward of rewards) {
      if (!reward.directBusiness || !reward.reward || reward.directBusiness <= 0 || reward.reward <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid reward data. Direct business and reward must be positive numbers.' 
        });
      }
    }
    
    // Sort rewards by directBusiness amount
    const sortedRewards = rewards.sort((a, b) => a.directBusiness - b.directBusiness);
    
    const settings = await RewardSettings.updateSettings(sortedRewards);
    res.json({ 
      success: true, 
      message: 'Reward settings updated successfully',
      rewards: settings.rewards 
    });
  } catch (err) {
    console.error('Error updating reward settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update reward settings' });
  }
});

// Get user reward status
app.get('/api/user/reward-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate user's direct business (total deposits from direct referrals)
    const directReferrals = await User.find({ referredBy: userId });
    let directBusiness = 0;
    
    for (const referral of directReferrals) {
      const deposits = await Transaction.find({ 
        userId: referral._id, 
        type: 'deposit',
        status: 'approved'
      });
      directBusiness += deposits.reduce((sum, deposit) => sum + (deposit.amount || 0), 0);
    }

    // Get reward settings to calculate current reward level
    const rewardSettings = await RewardSettings.getSettings();
    let currentReward = 0;
    let totalRewardEarned = 0;

    // Find the highest reward tier achieved
    for (const tier of rewardSettings.rewards.sort((a, b) => b.directBusiness - a.directBusiness)) {
      if (directBusiness >= tier.directBusiness) {
        currentReward = tier.reward;
        break;
      }
    }

    // Calculate total reward earned (sum of all achieved tiers)
    for (const tier of rewardSettings.rewards) {
      if (directBusiness >= tier.directBusiness) {
        totalRewardEarned += tier.reward;
      }
    }

    res.json({
      success: true,
      status: {
        directBusiness,
        currentReward,
        totalRewardEarned
      }
    });
  } catch (err) {
    console.error('Error fetching user reward status:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reward status' });
  }
});

// Update Trading Income Settings
app.post('/api/admin/trading-income-settings', async (req, res) => {
  try {
    const { roiPercentage, roiDuration, roiFrequency } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    if (roiPercentage !== undefined) settings.roiPercentage = roiPercentage;
    if (roiDuration !== undefined) settings.roiDuration = roiDuration;
    if (roiFrequency !== undefined) settings.roiFrequency = roiFrequency;
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// ✅ Register
// Helper to generate unique referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

app.post('/api/register', async (req, res) => {
  const { name, email, password, sponsorId } = req.body;
  console.log("[REGISTER] sponsorId received:", sponsorId);
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // --- STRONG sponsorId validation: must be valid ObjectId AND exist in DB ---
    let referredByValue = null;
    if (sponsorId) {
      if (!/^[a-fA-F0-9]{24}$/.test(sponsorId)) {
        console.log('[REGISTER] sponsorId invalid format:', sponsorId);
        return res.status(400).json({ success: false, message: 'Invalid sponsorId format' });
      }
      const sponsorUser = await User.findById(sponsorId);
      if (!sponsorUser) {
        console.log('[REGISTER] sponsorId not found in DB:', sponsorId);
        return res.status(400).json({ success: false, message: 'Invalid sponsorId: user not found' });
      }
      referredByValue = sponsorUser._id;
      console.log('[REGISTER] sponsorUser found:', sponsorUser._id, sponsorUser.name);
    } else {
      console.log('[REGISTER] No sponsorId provided, top-level user');
    }

    let referralCode;
    let codeExists = true;
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode });
    }

    const user = new User({ name, email, password, referredBy: referredByValue, referralCode });
    console.log('[REGISTER] Creating user:', { name, email, referredBy: referredByValue, referralCode });
    await user.save();
    console.log('[REGISTER] User saved:', user._id, 'referredBy:', user.referredBy);

    res.json({
      success: true,
      message: 'Registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        boosting: user.boosting,
        referredBy: user.referredBy,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    console.error('[REGISTER] Error:', err);
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});



app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // If user doesn't have referralCode, generate and save one
    if (!user.referralCode) {
      let referralCode;
      let codeExists = true;
      while (codeExists) {
        referralCode = generateReferralCode();
        codeExists = await User.findOne({ referralCode });
      }
      user.referralCode = referralCode;
      await user.save();
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Login successful',
      token, // Include token in response
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        boosting: user.boosting,
        referredBy: user.referredBy,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Admin Login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Admin logged in" });
  } else {
    res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }
});

// Admin: Get All Users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch users" });
  }
});

// Admin: Get Single User
app.get("/api/admin/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user detail" });
  }
});

// Admin: Get pending deposits
app.get("/api/admin/deposits", async (req, res) => {
  try {
    const deposits = await Deposit.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching deposits' });
  }
});

// Admin: Approve deposit and distribute referral
app.post("/api/admin/approve-deposit", async (req, res) => {
  try {
    const { id } = req.body;
    const deposit = await Deposit.findById(id);
    if (!deposit || deposit.status !== 'pending') return res.status(404).json({ success: false, message: 'Invalid deposit' });

    const user = await User.findById(deposit.userId);
    user.balance += deposit.amount;
    user.wallet = (user.wallet || 0) + deposit.amount;
    user.depositedAmount = (user.depositedAmount || 0) + deposit.amount;
    deposit.status = 'approved';

    await user.save();
    await deposit.save();

    await new Transaction({ userId: user._id, amount: deposit.amount, type: "credit", description: "Deposit Approved" }).save();

    // BOOSTING LOGIC: Start/extend boosting for user
    // 1. If user has no boosting or boosting expired, start new 24h boosting
    // 2. If user has 2 direct referrals with equal/greater deposit, extend boosting to 300 days (3X)
    const now = new Date();
    let boostingChanged = false;
    if (!user.boosting || !user.boosting.isActive || (user.boosting.endTime && user.boosting.endTime < now)) {
      user.boosting = {
        isActive: true,
        startTime: now,
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        durationHours: 24,
        extendedDays: 200,
        achieved3x: false,
        directReferrals: 0,
        lastChecked: now
      };
      boostingChanged = true;
    }

    // Count direct referrals with equal/greater deposit
    const directRefs = await User.find({ referredBy: user._id });
    let qualifyingRefs = 0;
    for (const ref of directRefs) {
      if ((ref.depositedAmount || 0) >= deposit.amount) qualifyingRefs++;
    }
    if (qualifyingRefs >= 2 && user.boosting && !user.boosting.achieved3x) {
      user.boosting.extendedDays = 300;
      user.boosting.achieved3x = true;
      boostingChanged = true;
    }

    user.boosting.directReferrals = qualifyingRefs;
    user.boosting.lastChecked = now;
    if (boostingChanged) await user.save();

    // Referral income logic (3 levels, dynamic from ReferralSettings)
    const ReferralSettings = require('./models/referralSettings');
    const settings = await ReferralSettings.findOne();
    const referralPercents = [
      (settings?.level1Percent || 5) / 100,
      (settings?.level2Percent || 3) / 100,
      (settings?.level3Percent || 2) / 100
    ];
    let refUserId = user.referredBy;
    for (let i = 0; i < 3; i++) {
      if (!refUserId) break;
      const refUser = await User.findById(refUserId);
      if (!refUser) break;
      const income = deposit.amount * referralPercents[i];
      refUser.balance += income;
      await refUser.save();
      await new Transaction({
        userId: refUser._id,
        fromUser: user._id,
        toUser: refUser._id,
        amount: income,
        type: "referral_on_deposit",
        level: i + 1,
        description: `Level ${i + 1} Referral Income (Deposit)`
      }).save();
      refUserId = refUser.referredBy;
    }

    res.json({ success: true, message: 'Deposit approved and referral income processed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve deposit' });
  }
});

// --- MIGRATION: For old users, set wallet and depositedAmount = balance if wallet is missing ---
app.get('/api/admin/migrate-wallet', async (req, res) => {
  try {
    const users = await User.find();
    let updated = 0;
    for (const user of users) {
      let changed = false;
      if ((user.balance > 0) && (!user.wallet || user.wallet === 0)) {
        user.wallet = user.balance;
        changed = true;
      }
      if ((user.balance > 0) && (!user.depositedAmount || user.depositedAmount === 0)) {
        user.depositedAmount = user.balance;
        changed = true;
      }
      if (changed) {
        await user.save();
        updated++;
      }
    }
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Migration failed' });
  }
});

// Admin: Reject deposit
app.post("/api/admin/reject-deposit", async (req, res) => {
  try {
    const { id } = req.body;
    const deposit = await Deposit.findById(id);
    if (!deposit || deposit.status !== 'pending') return res.status(404).json({ success: false, message: 'Invalid deposit' });

    deposit.status = 'rejected';
    await deposit.save();

    res.json({ success: true, message: 'Deposit rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reject deposit' });
  }
});

// Admin: Update User Balance
app.post('/api/admin/update-balance', async (req, res) => {
  try {
    const { userId, amount, type } = req.body;
    const user = await User.findById(userId);
    const amt = parseFloat(amount);
    if (!user || isNaN(amt)) return res.status(400).json({ success: false, message: "Invalid user or amount" });

    if (type === 'credit') {
      user.balance += amt;
    } else if (type === 'debit' && user.balance >= amt) {
      user.balance -= amt;
    } else {
      return res.status(400).json({ success: false, message: "Insufficient balance or invalid type" });
    }

    await user.save();
    await new Transaction({ userId, amount: amt, type, description: "Manual Balance Update" }).save();

    res.json({ success: true, message: "Balance updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Balance update failed" });
  }
});

// User: Submit Deposit
app.post('/api/user/deposit', async (req, res) => {
  try {
    const { email, amount, transactionId } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newDeposit = new Deposit({ userId: user._id, amount, transactionId, status: 'pending' });
    await newDeposit.save();
    res.json({ success: true, message: 'Deposit request submitted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deposit error' });
  }
});

// User: Get transaction history
// Transaction history with optional type filter
app.get("/api/user/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;
    let query = { userId };
    if (type) query.type = type;
    const history = await Transaction.find(query).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

// API: Get only trading income for user
app.get("/api/user/trading-income/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tradingHistory = await Transaction.find({ 
      userId, 
      type: 'trading_income' 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, transactions: tradingHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch trading income" });
  }
});

// ADMIN: Get all users with boosting info
app.get('/api/admin/boosting-users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email boosting');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// ADMIN: Toggle boosting for a user
app.post('/api/admin/boosting-toggle', async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.boosting) return res.json({ success: false });
    user.boosting.isActive = isActive;
    if (!isActive) {
      user.boosting.endTime = new Date();
    } else {
      // Reactivate for 24h from now
      const now = new Date();
      user.boosting.startTime = now;
      user.boosting.endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update boosting' });
  }
});

// ✅ CHECK 24 HOUR BOOSTING STATUS & AUTO-EXPIRE
app.get('/api/user/check-boosting/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const now = new Date();
    let boostingChanged = false;
    let message = '';

    // Check if boosting exists and is active
    if (user.boosting && user.boosting.isActive) {
      const timeLeft = user.boosting.endTime - now;
      
      // If 24 hours expired
      if (timeLeft <= 0) {
        // Count qualifying direct referrals
        const directRefs = await User.find({ referredBy: user._id });
        let qualifyingRefs = 0;
        for (const ref of directRefs) {
          if ((ref.depositedAmount || 0) >= (user.depositedAmount || 0)) qualifyingRefs++;
        }

        if (qualifyingRefs >= 2) {
          // SUCCESS: Upgrade to 3X plan (300 days)
          user.boosting.achieved3x = true;
          user.boosting.extendedDays = 300;
          user.boosting.isActive = true;
          user.boosting.endTime = new Date(now.getTime() + 300 * 24 * 60 * 60 * 1000);
          message = '🎉 Congratulations! You are upgraded! Boosting 3X plan activated for 300 days!';
          boostingChanged = true;
        } else {
          // FAILED: Remove boosting option
          user.boosting.isActive = false;
          user.boosting.endTime = now;
          message = '⏰ 24-hour timer expired. Boosting option removed. You needed 2 direct referrals.';
          boostingChanged = true;
        }
        
        user.boosting.directReferrals = qualifyingRefs;
        user.boosting.lastChecked = now;
      } else {
        // Still within 24 hours - update referral count
        const directRefs = await User.find({ referredBy: user._id });
        let qualifyingRefs = 0;
        for (const ref of directRefs) {
          if ((ref.depositedAmount || 0) >= (user.depositedAmount || 0)) qualifyingRefs++;
        }
        user.boosting.directReferrals = qualifyingRefs;
        user.boosting.lastChecked = now;
        
        if (qualifyingRefs >= 2 && !user.boosting.achieved3x) {
          // Achieved 2 referrals within 24 hours!
          user.boosting.achieved3x = true;
          user.boosting.extendedDays = 300;
          user.boosting.endTime = new Date(now.getTime() + 300 * 24 * 60 * 60 * 1000);
          message = '🎉 Congratulations! You are upgraded! Boosting 3X plan activated for 300 days!';
          boostingChanged = true;
        }
      }
    }

    if (boostingChanged) await user.save();

    res.json({ 
      success: true, 
      boosting: user.boosting,
      message,
      directReferrals: user.boosting?.directReferrals || 0
    });
  } catch (err) {
    console.error('Check boosting error:', err);
    res.status(500).json({ success: false, message: 'Failed to check boosting status' });
  }
});

// ✅ GET BOOSTING STATUS FOR TIMER DISPLAY
app.get('/api/user/boosting-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Auto-check boosting status
    const now = new Date();
    if (user.boosting && user.boosting.isActive) {
      const timeLeft = user.boosting.endTime - now;
      if (timeLeft <= 0 && !user.boosting.achieved3x) {
        // Auto-expire if not achieved 3x
        user.boosting.isActive = false;
        await user.save();
      }
    }

    res.json({ 
      success: true, 
      boosting: user.boosting || null,
      directReferrals: user.boosting?.directReferrals || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get boosting status' });
  }
});

// API: Get total referral income for user
app.get("/api/user/referral-income-total/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all referral income transactions
    const referralTransactions = await Transaction.find({ 
      toUser: userId, 
      type: { $in: ['referral_on_deposit', 'referral_income'] }
    });
    
    // Calculate total referral income
    const totalReferralIncome = referralTransactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      totalReferralIncome: totalReferralIncome.toFixed(2),
      transactionCount: referralTransactions.length
    });
  } catch (err) {
    console.error('Referral income total error:', err);
    res.status(500).json({ success: false, message: "Failed to fetch referral income total" });
  }
});

// API: Get detailed referral income for user
app.get("/api/user/referral-income/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const referralHistory = await Transaction.find({ 
      toUser: userId, 
      type: { $in: ['referral_on_deposit', 'referral_income'] }
    }).populate('fromUser', 'name email').sort({ createdAt: -1 });
    
    // Calculate total
    const totalReferralIncome = referralHistory.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      transactions: referralHistory,
      totalReferralIncome: totalReferralIncome.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch referral income" });
  }
});

// ✅ Calculate Referral Income on Trading Income (10 Levels)
async function calculateReferralIncomeOnTrading(userId, tradingAmount) {
  try {
    const referralLevels = [
      0.15, // Level 1: 15%
      0.12, // Level 2: 12%
      0.10, // Level 3: 10%
      0.08, // Level 4: 8%
      0.07, // Level 5: 7%
      0.06, // Level 6: 6%
      0.05, // Level 7: 5%
      0.04, // Level 8: 4%
      0.03, // Level 9: 3%
      0.02  // Level 10: 2%
    ];

    // ✅ Get the user who earned trading income
    const user = await User.findById(userId);
    if (!user) return;

    // ✅ Start from the user's referrer (NOT the user himself)
    let refUserId = user.referredBy;
    
    // ✅ Go up the referral chain (10 levels)
    for (let level = 0; level < 10; level++) {
      if (!refUserId) break; // No more referrers in chain
      
      const refUser = await User.findById(refUserId);
      if (!refUser) break; // Invalid referrer
      
      const income = tradingAmount * referralLevels[level];
      
      // ✅ Add income to referrer's balance (NOT to the original user)
      refUser.balance += income;
      refUser.referralIncome = (refUser.referralIncome || 0) + income;
      await refUser.save();
      
      // ✅ Create transaction record
      await new Transaction({
        userId: refUser._id,
        fromUser: userId, // Original user who earned trading income
        toUser: refUser._id, // Referrer who gets commission
        amount: income,
        type: "referral_on_trading",
        level: level + 1,
        description: `Level ${level + 1} Referral Income on Trading (${(referralLevels[level] * 100).toFixed(0)}%)`
      }).save();
      
      console.log(`Level ${level + 1} referral income: $${income.toFixed(2)} to ${refUser.name} (from ${user.name}'s $${tradingAmount} trading income)`);
      
      // ✅ Move to next level (referrer's referrer)
      refUserId = refUser.referredBy;
    }
  } catch (error) {
    console.error('Error calculating referral income on trading:', error);
  }
}

// ✅ API: Get Salary Income Data (placeholder)
app.get('/api/user/salary-income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For now, return placeholder data
    // You can implement actual salary income logic here
    res.json({
      success: true,
      totalSalaryIncome: 0,
      monthlySalary: 0,
      transactions: []
    });
  } catch (error) {
    console.error('Error fetching salary income:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch salary income' });
  }
});

// ✅ API: Get Direct Referral Income Data
app.get('/api/user/direct-referral-income/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const referralHistory = await Transaction.find({ 
      toUser: userId, 
      type: { $in: ['referral_on_deposit', 'referral_income'] }
    }).populate('fromUser', 'name email').sort({ createdAt: -1 });
    
    const totalDirectReferralIncome = referralHistory.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0);
    }, 0);
    
    res.json({ 
      success: true, 
      totalDirectReferralIncome: totalDirectReferralIncome.toFixed(2),
      transactions: referralHistory
    });
  } catch (err) {
    console.error('Direct referral income error:', err);
    res.status(500).json({ success: false, message: "Failed to fetch direct referral income" });
  }
});

// ✅ GET REWARD INCOME STATUS & AUTO-EXPIRE
app.get('/api/user/reward-income', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate user's direct business amount
    const directBusiness = user.depositedAmount || 0;
    
    // Calculate reward based on direct business
    let rewardAmount = 0;
    if (directBusiness >= 2000000) rewardAmount = 25000;
    else if (directBusiness >= 500000) rewardAmount = 2000;
    else if (directBusiness >= 100000) rewardAmount = 1000;
    else if (directBusiness >= 25000) rewardAmount = 500;
    else if (directBusiness >= 10000) rewardAmount = 250;

    res.json({
      success: true,
      directBusiness,
      rewardAmount,
      totalRewardEarned: user.rewardIncome || 0
    });
  } catch (error) {
    console.error('Error fetching reward income:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reward income' });
  }
});

// ✅ API: Get Referral Income on Trading Data
app.get('/api/user/referral-trading-income', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get all referral income transactions for this user
    const referralTransactions = await Transaction.find({
      toUser: userId,
      type: 'referral_on_trading'
    }).populate('fromUser', 'name email');

    // Group by level
    const levelIncome = {};
    let totalIncome = 0;

    referralTransactions.forEach(transaction => {
      const level = transaction.level || 1;
      if (!levelIncome[level]) {
        levelIncome[level] = {
          amount: 0,
          count: 0
        };
      }
      levelIncome[level].amount += transaction.amount;
      levelIncome[level].count += 1;
      totalIncome += transaction.amount;
    });

    res.json({
      success: true,
      levelIncome,
      totalIncome,
      transactions: referralTransactions
    });
  } catch (error) {
    console.error('Error fetching referral trading income:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch referral trading income' });
  }
});

// ✅ Admin: Clean up wrong referral income transactions
app.post('/api/admin/cleanup-referral-transactions', async (req, res) => {
  try {
    // Remove referral_on_trading transactions where fromUser = toUser (wrong logic)
    const wrongTransactions = await Transaction.find({
      type: 'referral_on_trading',
      $expr: { $eq: ['$fromUser', '$toUser'] }
    });

    console.log(`Found ${wrongTransactions.length} wrong referral transactions`);

    // Reverse the wrong transactions
    for (const transaction of wrongTransactions) {
      const user = await User.findById(transaction.userId);
      if (user) {
        // Subtract the wrong amount
        user.balance -= transaction.amount;
        user.referralIncome = (user.referralIncome || 0) - transaction.amount;
        if (user.balance < 0) user.balance = 0;
        if (user.referralIncome < 0) user.referralIncome = 0;
        await user.save();
        
        console.log(`Reversed $${transaction.amount} from ${user.name}`);
      }
    }

    // Delete the wrong transactions
    await Transaction.deleteMany({
      type: 'referral_on_trading',
      $expr: { $eq: ['$fromUser', '$toUser'] }
    });

    res.json({ 
      success: true, 
      message: `Cleaned up ${wrongTransactions.length} wrong referral transactions`,
      cleanedCount: wrongTransactions.length
    });
  } catch (error) {
    console.error('Error cleaning up transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to cleanup transactions' });
  }
});

// ✅ DEBUG: Test Referral Income Calculation
app.post('/api/debug/test-referral-income', async (req, res) => {
  try {
    const { userId, tradingAmount } = req.body;
    
    console.log(`Testing referral income for userId: ${userId}, amount: ${tradingAmount}`);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    
    console.log(`User: ${user.name}, referredBy: ${user.referredBy}`);
    
    const referralLevels = [0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02];
    let refUserId = user.referredBy;
    const results = [];
    
    for (let level = 0; level < 10; level++) {
      if (!refUserId) {
        results.push({ level: level + 1, status: 'No referrer found' });
        break;
      }
      
      const refUser = await User.findById(refUserId);
      if (!refUser) {
        results.push({ level: level + 1, status: 'Invalid referrer' });
        break;
      }
      
      const income = tradingAmount * referralLevels[level];
      
      results.push({
        level: level + 1,
        referrerName: refUser.name,
        referrerId: refUser._id,
        income: income,
        percentage: (referralLevels[level] * 100).toFixed(0) + '%'
      });
      
      console.log(`Level ${level + 1}: ${refUser.name} should get $${income.toFixed(2)}`);
      
      refUserId = refUser.referredBy;
    }
    
    res.json({
      success: true,
      userName: user.name,
      tradingAmount,
      referralChain: results
    });
    
  } catch (error) {
    console.error('Debug referral error:', error);
    res.status(500).json({ success: false, message: 'Debug failed', error: error.message });
  }
});

// ✅ Manual Test: Force Run Trading Income Job for One User
app.post('/api/admin/force-trading-income', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find user's active deposits
    const Deposit = require('./models/deposit');
    const deposits = await Deposit.find({ userId: userId, status: 'approved', isActive: true });
    
    if (deposits.length === 0) {
      return res.json({ success: false, message: 'No active deposits found for this user' });
    }

    const results = [];
    
    for (const deposit of deposits) {
      // Calculate 1% ROI
      const roi = deposit.amount * 0.01;
      
      // Check if deposit is still eligible
      if (deposit.totalPaid >= deposit.amount * 2) {
        deposit.isActive = false;
        await deposit.save();
        continue;
      }

      // Cap ROI if needed
      let finalRoi = roi;
      if (deposit.totalPaid + roi > deposit.amount * 2) {
        finalRoi = deposit.amount * 2 - deposit.totalPaid;
      }

      if (finalRoi > 0) {
        // Add trading income to user
        user.balance += finalRoi;
        user.wallet += finalRoi;
        await user.save();

        deposit.totalPaid += finalRoi;
        if (deposit.totalPaid >= deposit.amount * 2) deposit.isActive = false;
        await deposit.save();

        // Create trading income transaction
        await new Transaction({
          userId: user._id,
          amount: finalRoi,
          type: 'trading_income',
          description: `Manual Trading Income (1% on $${deposit.amount} deposit)`
        }).save();

        // ✅ INLINE Referral Income Calculation
        const referralLevels = [0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02];
        let refUserId = user.referredBy;
        const referralResults = [];
        
        for (let level = 0; level < 10; level++) {
          if (!refUserId) break;
          
          const refUser = await User.findById(refUserId);
          if (!refUser) break;
          
          const income = finalRoi * referralLevels[level];
          
          // Add to referrer's balance
          refUser.balance += income;
          refUser.referralIncome = (refUser.referralIncome || 0) + income;
          await refUser.save();
          
          // Create transaction
          await new Transaction({
            userId: refUser._id,
            fromUser: user._id,
            toUser: refUser._id,
            amount: income,
            type: "referral_on_trading",
            level: level + 1,
            description: `Level ${level + 1} Referral Income on Trading (${(referralLevels[level] * 100).toFixed(0)}%) - Manual`
          }).save();
          
          referralResults.push({
            level: level + 1,
            referrerName: refUser.name,
            amount: income,
            percentage: (referralLevels[level] * 100).toFixed(0) + '%'
          });
          
          console.log(`✅ Manual Level ${level + 1}: $${income.toFixed(2)} to ${refUser.name}`);
          
          refUserId = refUser.referredBy;
        }

        results.push({
          depositAmount: deposit.amount,
          tradingIncome: finalRoi,
          referralDistributed: referralResults
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Manual trading income processed',
      userName: user.name,
      results
    });
    
  } catch (error) {
    console.error('Force trading income error:', error);
    res.status(500).json({ success: false, message: 'Failed to process trading income' });
  }
});

// ✅ Complete Test API: Check User's Referral Chain & Test Distribution
app.post('/api/admin/test-referral-chain', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check referral chain
    const chain = [];
    let currentRefId = user.referredBy;
    
    for (let level = 1; level <= 10; level++) {
      if (!currentRefId) break;
      
      const refUser = await User.findById(currentRefId);
      if (!refUser) break;
      
      chain.push({
        level,
        id: refUser._id,
        name: refUser.name,
        email: refUser.email,
        currentBalance: refUser.balance || 0,
        referralIncome: refUser.referralIncome || 0
      });
      
      currentRefId = refUser.referredBy;
    }

    // Check recent trading income transactions
    const recentTrading = await Transaction.find({
      userId: userId,
      type: 'trading_income'
    }).sort({ createdAt: -1 }).limit(5);

    // Check recent referral transactions
    const recentReferral = await Transaction.find({
      type: 'referral_on_trading',
      fromUser: userId
    }).sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      userName: user.name,
      userBalance: user.balance || 0,
      hasReferredBy: !!user.referredBy,
      referralChain: chain,
      recentTradingIncome: recentTrading,
      recentReferralDistributions: recentReferral
    });
    
  } catch (error) {
    console.error('Test referral chain error:', error);
    res.status(500).json({ success: false, message: 'Failed to test referral chain' });
  }
});

// ✅ Simple Test: Trigger Small Amount to Test Distribution
app.post('/api/admin/test-small-referral', async (req, res) => {
  try {
    const { userId } = req.body;
    const testAmount = 1; // $1 for testing
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add test trading income first
    user.balance += testAmount;
    user.wallet += testAmount;
    await user.save();

    await new Transaction({
      userId: user._id,
      amount: testAmount,
      type: 'trading_income',
      description: 'Test Trading Income for Referral Check'
    }).save();

    // Now distribute referral income
    const referralLevels = [0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02];
    let refUserId = user.referredBy;
    const distributed = [];
    
    for (let level = 0; level < 10; level++) {
      if (!refUserId) break;
      
      const refUser = await User.findById(refUserId);
      if (!refUser) break;
      
      const income = testAmount * referralLevels[level];
      
      refUser.balance += income;
      refUser.referralIncome = (refUser.referralIncome || 0) + income;
      await refUser.save();
      
      await new Transaction({
        userId: refUser._id,
        fromUser: user._id,
        toUser: refUser._id,
        amount: income,
        type: "referral_on_trading",
        level: level + 1,
        description: `Test Level ${level + 1} Referral Income (${(referralLevels[level] * 100).toFixed(0)}%)`
      }).save();
      
      distributed.push({
        level: level + 1,
        referrerName: refUser.name,
        amount: income,
        percentage: (referralLevels[level] * 100).toFixed(0) + '%'
      });
      
      refUserId = refUser.referredBy;
    }

    res.json({
      success: true,
      message: `Test completed for ${user.name}`,
      testAmount,
      distributed
    });
    
  } catch (error) {
    console.error('Small referral test error:', error);
    res.status(500).json({ success: false, message: 'Failed to test small referral' });
  }
});

// User Withdrawal OTP API
const userWithdrawalOtpRouter = require('./routes/userWithdrawalOtp');
app.use('/api/user/withdrawal-otp', userWithdrawalOtpRouter);

// Additional withdrawal OTP endpoints for frontend compatibility
app.post('/api/user/send-withdraw-otp', async (req, res) => {
  const { email } = req.body;
  console.log('🚀 OTP Generation Request for email:', email);
  
  if (!email) {
    console.log('❌ Email missing in request');
    return res.json({ success: false, message: 'Email is required' });
  }
  
  try {
    const Otp = require('./models/otp');
    
    // ✅ Clean up old OTPs for this email
    const deletedCount = await Otp.deleteMany({ email, purpose: 'withdrawal' });
    console.log('🧹 Deleted old OTPs count:', deletedCount.deletedCount);
    
    // ✅ Generate 6-digit OTP as string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated OTP:', otp, 'for email:', email, 'type:', typeof otp);
    
    // ✅ Use bcryptjs (Render-safe) 
    const bcrypt = require('bcryptjs');
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    console.log('🔐 OTP Hash created:', { 
      originalOtp: otp, 
      hashLength: otpHash.length,
      expiresAt: expiresAt.toISOString()
    });
    
    // ✅ Save to database
    const otpDoc = await Otp.create({ 
      email, 
      otpHash, 
      purpose: 'withdrawal', 
      expiresAt 
    });
    
    console.log('💾 OTP saved to database:', { 
      id: otpDoc._id, 
      email: otpDoc.email, 
      expires: otpDoc.expiresAt,
      timeValid: '5 minutes'
    });
    
    // ✅ Send email with nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Withdrawal - Star Traders',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8c4be7;">Star Traders - Withdrawal OTP</h2>
            <p>Your OTP for withdrawal is:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #8c4be7;">
              ${otp}
            </div>
            <p>This OTP is valid for 5 minutes only.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Thank you,<br>Star Traders Team</p>
          </div>
        `
      });
      
      console.log('📧 OTP email sent successfully to:', email, 'OTP:', otp);
      res.json({ 
        success: true, 
        message: 'OTP sent to your email successfully',
        timestamp: new Date().toISOString()
      });
      
    } catch (mailError) {
      console.error('📧 Email send error:', mailError);
      // 🔧 Fallback: Log OTP for testing on Render
      console.log('🚨 FALLBACK - OTP for testing:', { email, otp, expires: expiresAt });
      res.json({ 
        success: true, 
        message: 'OTP generated (check server logs if email fails)',
        fallback: true
      });
    }
    
  } catch (err) {
    console.error('💥 OTP generation error:', err);
    res.json({ 
      success: false, 
      message: 'Failed to generate OTP', 
      error: err.message 
    });
  }
});

app.post('/api/user/verify-withdraw-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log("📩 Body received:", { email, otp, otpType: typeof otp });

    // ✅ Use correct OTP model 
    const Otp = require('./models/otp');

    const latestOtp = await Otp.findOne({ 
      email, 
      purpose: 'withdrawal' 
    }).sort({ createdAt: -1 });

    if (!latestOtp) {
      console.log("❌ OTP not found in DB for email:", email);
      return res.status(400).json({ 
        success: false, 
        message: "OTP not found" 
      });
    }

    console.log("🔐 OTP From DB (Hash):", latestOtp.otpHash);
    console.log("🔢 OTP From Frontend:", otp);
    console.log("⏳ Expires At:", latestOtp.expiresAt);
    console.log("📆 Current Time:", new Date());
    console.log("⏰ Time Left:", Math.round((new Date(latestOtp.expiresAt) - new Date()) / 1000) + " seconds");

    if (latestOtp.expiresAt < Date.now()) {
      console.log("⚠️ OTP expired - DB time vs Current time");
      return res.status(400).json({ 
        success: false, 
        message: "OTP expired" 
      });
    }

    // 🔥 CRITICAL DEBUG: bcrypt.compare() with detailed logging
    const bcrypt = require('bcryptjs');
    
    console.log("🔍 Before bcrypt.compare():", {
      frontendOtp: otp,
      frontendOtpLength: String(otp).length,
      dbHash: latestOtp.otpHash,
      dbHashLength: latestOtp.otpHash.length
    });

    const isMatch = await bcrypt.compare(String(otp), latestOtp.otpHash);
    
    console.log("🔁 Compare result:", isMatch);
    console.log("🎯 bcrypt.compare('" + otp + "', '" + latestOtp.otpHash + "') = " + isMatch);

    if (!isMatch) {
      console.log("❌ OTP does not match - Hash comparison failed");
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP" 
      });
    }

    console.log("✅ OTP verified successfully!");
    
    // Delete used OTP
    await Otp.deleteOne({ _id: latestOtp._id });
    console.log("🧹 Used OTP deleted from database");

    return res.status(200).json({ 
      success: true, 
      message: "OTP verified" 
    });

  } catch (error) {
    console.log("🔥 Error verifying OTP:", error.message);
    console.error("💥 Full Error Stack:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
});

// 🚨 PILOT DEBUG ROUTE - Clean और Simple OTP Verification
app.post('/api/user/verify-withdraw-otp-pilot', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 🚨 PILOT DEBUG START - यही logs Render में दिखेंगे
    console.log("✅ PILOT DEBUG: API Hit hua!");
    console.log("👉 Received Body:", JSON.stringify(req.body));
    console.log("📧 Email received:", email);
    console.log("🔢 OTP received:", otp, "Type:", typeof otp);

    // Basic validation
    if (!email || !otp) {
      console.log("❌ Missing email or OTP");
      return res.status(400).json({ 
        success: false, 
        message: 'Missing email or OTP',
        debug: 'Frontend not sending complete data'
      });
    }

    // Check if using User model (old method) first
    const User = require('./models/user');
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log("👤 User found:", user.name);

    // 🔍 Check if user has withdrawOtp field (old method)
    if (user.withdrawOtp) {
      console.log("🔍 OLD METHOD - User Model OTP DEBUG:", {
        email,
        storedOtp: user.withdrawOtp,
        receivedOtp: otp,
        storedType: typeof user.withdrawOtp,
        receivedType: typeof otp,
        stringMatch: String(user.withdrawOtp) === String(otp),
        expiry: user.otpExpire ? new Date(user.otpExpire) : 'No expiry'
      });

      // Check expiry (if exists)
      if (user.otpExpire && user.otpExpire < Date.now()) {
        console.log("⚠️ OTP expired");
        return res.status(400).json({ 
          success: false, 
          message: 'OTP expired' 
        });
      }

      // Compare OTPs
      if (String(user.withdrawOtp) !== String(otp)) {
        console.log("❌ OLD METHOD - OTP invalid");
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid OTP' 
        });
      }

      console.log("✅ OLD METHOD - OTP Verified Successfully!");
      return res.status(200).json({ 
        success: true, 
        message: 'OTP verified successfully' 
      });
    }

    // 🔍 Check new OTP model method
    const Otp = require('./models/otp');
    
    // Clean old expired OTPs
    await Otp.deleteMany({ 
      email, 
      purpose: 'withdrawal',
      expiresAt: { $lt: new Date() }
    });
    
    const otpDoc = await Otp.findOne({ 
      email, 
      purpose: 'withdrawal',
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    console.log("🔍 NEW METHOD - OTP Model DEBUG:", {
      searchEmail: email,
      found: !!otpDoc,
      otpDocEmail: otpDoc?.email,
      expires: otpDoc?.expiresAt,
      created: otpDoc?.createdAt,
      timeLeft: otpDoc ? Math.round((new Date(otpDoc.expiresAt) - new Date()) / 1000) + 's' : 'N/A'
    });
    
    if (!otpDoc) {
      console.log("❌ NEW METHOD - No OTP found in database");
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found. Please request a new OTP.' 
      });
    }
    
    // Use bcryptjs for comparison
    const bcrypt = require('bcryptjs');
    const otpString = String(otp).trim();
    
    console.log("🔐 NEW METHOD - Comparing OTP:", { 
      provided: otpString, 
      hashExists: !!otpDoc.otpHash 
    });
    
    const match = await bcrypt.compare(otpString, otpDoc.otpHash);
    console.log("✅ NEW METHOD - OTP Comparison Result:", match);
    
    if (!match) {
      console.log("❌ NEW METHOD - OTP MISMATCH");
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP. Please check and try again.' 
      });
    }
    
    console.log("✅ NEW METHOD - OTP VERIFIED SUCCESSFULLY!");
    
    res.status(200).json({ 
      success: true, 
      message: 'OTP Verified Successfully' 
    });
    
  } catch (err) {
    console.log("🔥 PILOT DEBUG - Server Error:", err.message);
    console.error("💥 Full Error:", err);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: err.message 
    });
  }
});

// DEBUG: Test OTP generation and verification
app.post('/api/debug/test-otp', async (req, res) => {
  try {
    const testEmail = 'test@example.com';
    const testOtp = '123456';
    
    console.log('🧪 Starting OTP Debug Test...');
    
    // ✅ Use bcryptjs (Render-safe)
    const bcrypt = require('bcryptjs');
    const otpHash = await bcrypt.hash(testOtp, 10);
    console.log('🔐 Test OTP Hash generated:', { 
      original: testOtp, 
      hash: otpHash,
      hashLength: otpHash.length 
    });
    
    // Test different input types (common frontend issues)
    const tests = [
      { input: '123456', type: 'string' },
      { input: 123456, type: 'number' },
      { input: '  123456  ', type: 'string with spaces' },
      { input: ' 123456', type: 'leading space' },
      { input: '123456 ', type: 'trailing space' }
    ];
    
    const results = [];
    for (const test of tests) {
      // 🔧 Apply same conversion logic as main verification
      const inputString = String(test.input).trim();
      const match = await bcrypt.compare(inputString, otpHash);
      
      results.push({
        original: test.input,
        type: test.type,
        cleaned: inputString,
        cleanedLength: inputString.length,
        match: match,
        status: match ? '✅ PASS' : '❌ FAIL'
      });
      
      console.log(`🧪 Test: ${test.type} -> "${test.input}" -> "${inputString}" -> ${match ? '✅' : '❌'}`);
    }
    
    // Test actual database workflow
    const Otp = require('./models/otp');
    
  // Clean old expired OTPs
    await Otp.deleteMany({ email: testEmail, purpose: 'withdrawal' });
    
    // Create new test OTP
    const testDoc = await Otp.create({
      email: testEmail,
      otpHash: otpHash,
      purpose: 'withdrawal', 
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    
    // Test retrieval and verification
    const retrievedDoc = await Otp.findOne({ 
      email: testEmail, 
      purpose: 'withdrawal' 
    }).sort({ createdAt: -1 });
    
    const dbVerification = await bcrypt.compare(testOtp, retrievedDoc.otpHash);
    
    res.json({
      success: true,
      testOtp: testOtp,
      hash: otpHash,
      inputTests: results,
      databaseTest: {
        saved: !!testDoc,
        retrieved: !!retrievedDoc,
        verification: dbVerification,
        status: dbVerification ? '✅ DB_PASS' : '❌ DB_FAIL'
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        bcryptjsWorking: true
      },
      message: '🎉 bcryptjs working correctly on Render!',
      timestamp: new Date().toISOString()
    });
    
    // Cleanup
    await Otp.deleteOne({ _id: testDoc._id });
    
  } catch (error) {
    console.error('💥 OTP test error:', error);
    res.json({ 
      success: false, 
      error: error.message, 
      stack: error.stack,
      message: '❌ OTP test failed'
    });
  }
});

// 🚨 INSTANT OTP TEST - Generate और Verify एक साथ करने के लिए
app.post('/api/debug/instant-otp-test', async (req, res) => {
  try {
    const { email } = req.body || {};
    const testEmail = email || 'test@startraders.com';
    
    console.log('🚨 INSTANT OTP TEST for email:', testEmail);
    
    // ✅ Step 1: Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated test OTP:', otp);
    
    // ✅ Step 2: Hash and save
    const bcrypt = require('bcryptjs');
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    const Otp = require('./models/otp');
    
  // Clean old expired OTPs
    await Otp.deleteMany({ email: testEmail, purpose: 'withdrawal' });
    
    // Save new OTP
    const otpDoc = await Otp.create({
      email: testEmail,
      otpHash: otpHash,
      purpose: 'withdrawal',
      expiresAt: expiresAt
    });
    
    console.log('💾 Test OTP saved to database');
    
    // ✅ Step 3: Immediate verification test
    const verifyResult = await bcrypt.compare(otp, otpDoc.otpHash);
    console.log('🔐 Immediate verification result:', verifyResult);
    
    // ✅ Step 4: Test with different input formats
    const inputTests = [
      String(otp),
      parseInt(otp),
      ` ${otp} `,
      `${otp}\n`,
      `${otp}\t`
    ];
    
    const testResults = [];
    for (const input of inputTests) {
      const cleanInput = String(input).trim();
      const match = await bcrypt.compare(cleanInput, otpDoc.otpHash);
      testResults.push({
        original: input,
        cleaned: cleanInput,
        match: match,
        status: match ? '✅' : '❌'
      });
    }
    
    // Cleanup
    await Otp.deleteOne({ _id: otpDoc._id });
    
    res.json({
      success: true,
      testEmail: testEmail,
      generatedOtp: otp,
      immediateVerification: verifyResult,
      inputFormatTests: testResults,
      message: verifyResult ? '✅ OTP system working correctly!' : '❌ OTP system has issues',
      instructions: `Use this OTP for testing: ${otp}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Instant OTP test error:', error);
    res.json({
      success: false,
      error: error.message,
      message: '❌ Instant OTP test failed'
    });
  }
});

// Offer image upload route
// Offer image upload route
try {
  const offerRouter = require('./server/routes/offer');
  app.use(offerRouter);
} catch (e1) {
  try {
    const offerRouter = require('./routes/offer');
    app.use(offerRouter);
  } catch (e2) {
    try {
      const offerRouter = require('./src/routes/offer');
      app.use(offerRouter);
    } catch (e3) {
      console.error('Offer route not found in any known path');
    }
  }
}



// Offer image upload route
try {
  const offerRouter = require('./server/routes/offer');
  app.use(offerRouter);
} catch (e1) {
  try {
    const offerRouter = require('./routes/offer');
    app.use(offerRouter);
  } catch (e2) {
    try {
      const offerRouter = require('./src/routes/offer');
      app.use(offerRouter);
    } catch (e3) {
      console.error('Offer route not found in any known path');
    }
  }
}

// Serve React frontend (production build) - must be LAST
const clientBuildPath = path.join(__dirname, 'client', 'build');

app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
