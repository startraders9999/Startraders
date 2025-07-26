import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Reward = () => {
  const [rewardData, setRewardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState({
    directBusiness: 0,
    currentReward: 0,
    totalRewardEarned: 0
  });

  // Default fallback data if API fails
  const defaultRewardData = [
    { directBusiness: 10000, reward: 250 },
    { directBusiness: 25000, reward: 500 },
    { directBusiness: 50000, reward: 1000 },
    { directBusiness: 100000, reward: 2000 },
    { directBusiness: 200000, reward: 5000 },
    { directBusiness: 500000, reward: 10000 },
    { directBusiness: 1000000, reward: 25000 },
    { directBusiness: 2000000, reward: 50000 }
  ];

  useEffect(() => {
    fetchRewardSettings();
    fetchUserStatus();
  }, []);

  const fetchRewardSettings = async () => {
    try {
      const response = await axios.get('https://startraders-fullstack-9ayr.onrender.com/api/admin/reward-settings');
      if (response.data.success && response.data.rewards.length > 0) {
        setRewardData(response.data.rewards);
      } else {
        setRewardData(defaultRewardData);
      }
    } catch (error) {
      console.error('Failed to fetch reward settings:', error);
      setRewardData(defaultRewardData);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?._id) {
        const response = await axios.get(`https://startraders-fullstack-9ayr.onrender.com/api/user/reward-status/${user._id}`);
        if (response.data.success) {
          setUserStatus(response.data.status);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user reward status:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const referralLevels = [
    { level: 'Level 1', percentage: '15%' },
    { level: 'Level 2', percentage: '12%' },
    { level: 'Level 3', percentage: '10%' },
    { level: 'Level 4', percentage: '8%' },
    { level: 'Level 5', percentage: '7%' },
    { level: 'Level 6', percentage: '6%' },
    { level: 'Level 7', percentage: '5%' },
    { level: 'Level 8', percentage: '4%' },
    { level: 'Level 9', percentage: '3%' },
    { level: 'Level 10', percentage: '2%' }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading reward data...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="star-logo">
            <span className="star-icon">⭐</span>
            <h1 className="company-name">STAR TRADERS</h1>
          </div>
        </div>

        {/* User Current Status */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>Your Current Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.directBusiness)}
              </div>
              <div style={{ opacity: 0.9 }}>Direct Business</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.currentReward)}
              </div>
              <div style={{ opacity: 0.9 }}>Current Reward Level</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.totalRewardEarned)}
              </div>
              <div style={{ opacity: 0.9 }}>Total Reward Earned</div>
            </div>
          </div>
        </div>

        {/* Reward Income Section */}
        <div className="reward-income-section mb-8">
          <h2 className="section-title">REWARD INCOME</h2>
          
          <div className="reward-table">
            <div className="reward-header">
              <div className="header-item">Direct Business</div>
              <div className="header-item">Reward</div>
            </div>
            
            {rewardData.map((item, index) => (
              <div key={index} className="reward-row">
                <div className="reward-cell">{formatCurrency(item.directBusiness)}</div>
                <div className="reward-cell reward-amount">{formatCurrency(item.reward)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Income on Trading Income Section */}
        <div className="referral-trading-section">
          <h2 className="section-title">Referral Income on Trading Income</h2>
          
          <div className="referral-table">
            <div className="referral-header">
              <div className="header-item">Level</div>
              <div className="header-item">Income %</div>
            </div>
            
            {referralLevels.map((item, index) => (
              <div key={index} className="referral-row">
                <div className="referral-cell">{item.level}</div>
                <div className="referral-cell referral-percentage">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reward;
