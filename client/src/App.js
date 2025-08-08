import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';  

import USDTWithdrawalPage from './USDTWithdrawalPage';
import ForgotPassword from './ForgotPassword.jsx';
import USDTDepositpage from './USDTDepositpage';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.js';
import Trading from './Trading.js';
import ReferralOnTrading from './ReferralOnTrading.js';
import ReferralIncome from './ReferralIncome.js';
import RewardIncomeUser from './RewardIncomeSimple.js';
import SalaryIncome from './SalaryIncome.js';
import Team from './Team';
import Layout from './Layout';
import Earning from './Earning';
import Staking from './Staking';
import Report from './Report';
import Support from './Support.jsx';

// Error Boundary and API Status Checker
import ErrorBoundary, { APIStatusChecker } from './components/ErrorBoundary';


// ✅ Admin pages
import ProtectedAdminLayout from './admin/ProtectedAdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import UserDetail from './admin/pages/UserDetail.jsx';
import Users from './admin/Users';
import Deposits from './admin/Deposits';
import Withdrawals from './admin/Withdrawals';
import AdminRewardIncome from './admin/RewardIncome';

import Boosting from './admin/Boosting';
import BoostingControl from './admin/BoostingControl';
import OfflineGateway from './admin/OfflineGateway';
import Settings from './admin/Settings';
import Analytics from './admin/Analytics';
import Transactions from './admin/Transactions';
import AdminSupport from './admin/Support';
import AdminLogin from './admin/AdminLogin';
import TradingIncome from './admin/TradingIncome';
import ReferralSettingsAdmin from './admin/ReferralSettings';
import TransactionHistory from './TransactionHistory.jsx';
// import logo from './assets/logo.png';
// Old sidebar and hamburger menu imports removed if present
import Referral from './Referral.jsx';

const App = () => {
  // Offer popup logic
  const [showPopup, setShowPopup] = useState(false);
  const [offerImage, setOfferImage] = useState('');

  useEffect(() => {
    // Simulate user login event
    // Replace with actual login logic
    const isLoggedIn = true;
    if (isLoggedIn) {
      axios.get('/api/offer').then(res => {
        if (res.data.imageUrl) {
          setOfferImage(res.data.imageUrl);
          setShowPopup(true);
        }
      });
    }
  }, []);

  const OfferPopup = ({ imageUrl, onClose }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 20,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        position: 'relative',
        maxWidth: 350,
        width: '90%'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <img src={imageUrl} alt="Offer" style={{ width: '100%', borderRadius: 6 }} />
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <APIStatusChecker />
      <div>
        {showPopup && offerImage && (
          <OfferPopup imageUrl={offerImage} onClose={() => setShowPopup(false)} />
        )}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/team" element={<Team />} />
            <Route path="/earning" element={<Earning />} />
            <Route path="/salary-income" element={<SalaryIncome />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/trading-income" element={<Trading />} />
            <Route path="/direct-referral-income" element={<Referral />} />
            <Route path="/referral-on-trading" element={<ReferralOnTrading />} />
            <Route path="/reward-income" element={<RewardIncomeUser />} />
            <Route path="/withdrawal" element={<USDTWithdrawalPage />} />
            <Route path="/report" element={<Report />} />
            <Route path="/support" element={<Support />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Route>

          <Route path="/admin" element={<ProtectedAdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="user/:id" element={<UserDetail />} />
            <Route path="deposits" element={<Deposits />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="reward-income" element={<AdminRewardIncome />} />
            <Route path="boosting" element={<BoostingControl />} />
            <Route path="offer-settings" element={<OfferSettings />} />
            <Route path="offline-gateway" element={<OfflineGateway />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="trading-income" element={<TradingIncome />} />
            <Route path="referral-settings" element={<ReferralSettingsAdmin />} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/deposit" element={<USDTDepositpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/trading" element={<Trading />} />
          {/* Referral Dashboard: All referral routes point to Referral.jsx */}
          <Route path="/referral-income" element={<Referral />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/dashboard/referral" element={<Referral />} />
          {/* Referral on trading income */}
          <Route path="/referral-on-trading" element={<ReferralOnTrading />} />
          <Route path="/salary-income" element={<SalaryIncome />} />

          {/* Home and 404 */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<h1 style={{ color: 'white' }}>Page Not Found</h1>} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
