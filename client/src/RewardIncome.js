import React, { useEffect, useState } from 'react';
import './RewardIncome.css';
import axios from 'axios';
import UniversalResponsiveLayout from './UniversalResponsiveLayout';
import { FaGift, FaUsers } from 'react-icons/fa';
import logo from './assets/logo.png';

const RewardIncome = () => {
  const [rewardSettings, setRewardSettings] = useState([]);
  const [userStatus, setUserStatus] = useState({
    directBusiness: 0,
    currentReward: 0,
    totalRewardEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewardSettings();
    fetchUserStatus();
  }, []);

  const fetchRewardSettings = async () => {
    try {
      console.log('Fetching reward settings from API...');
      const timestamp = new Date().getTime();
      const response = await axios.get(`https://startraders-fullstack-9ayr.onrender.com/api/admin/reward-settings?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.rewards && response.data.rewards.length > 0) {
        console.log('Setting reward data from API:', response.data.rewards);
        setRewardSettings(response.data.rewards);
      } else {
        console.log('API response invalid or empty, using default data');
        setRewardSettings([
          { directBusiness: 10000, reward: 250 },
          { directBusiness: 25000, reward: 500 },
          { directBusiness: 50000, reward: 1000 },
          { directBusiness: 100000, reward: 2000 },
          { directBusiness: 200000, reward: 5000 },
          { directBusiness: 500000, reward: 10000 },
          { directBusiness: 1000000, reward: 25000 },
          { directBusiness: 2000000, reward: 50000 }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch reward settings:', error);
      console.log('Error occurred, using default data');
      setRewardSettings([
        { directBusiness: 10000, reward: 250 },
        { directBusiness: 25000, reward: 500 },
        { directBusiness: 50000, reward: 1000 },
        { directBusiness: 100000, reward: 2000 },
        { directBusiness: 200000, reward: 5000 },
        { directBusiness: 500000, reward: 10000 },
        { directBusiness: 1000000, reward: 25000 },
        { directBusiness: 2000000, reward: 50000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user._id) {
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
      <UniversalResponsiveLayout>
        <div style={{ 
          background: '#f8f6ff', 
          minHeight: '100vh', 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#8c4be7', fontSize: '2rem', fontWeight: '700' }}>Loading reward data...</h2>
          </div>
        </div>
      </UniversalResponsiveLayout>
    );
  }

  return (
    <UniversalResponsiveLayout>
      <div style={{ background: '#f8f6ff', minHeight: '100vh', padding: '20px' }}>
        {/* Header with Star Traders logo */}
        <div style={{
          width: '100%',
          background: '#8c4be7',
          display: 'flex',
          alignItems: 'center',
          padding: '0 0 0 24px',
          height: '64px',
          boxShadow: '0 2px 8px rgba(140,75,231,0.08)',
          marginBottom: '30px',
          borderRadius: '12px'
        }}>
          <img src={logo} alt="Star Traders Logo" style={{ height: '40px', marginRight: '16px' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '2rem', letterSpacing: '1px' }}>
            STAR TRADERS - REWARD INCOME
          </span>
        </div>

        {/* Refresh Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={() => {
              setLoading(true);
              fetchRewardSettings();
              fetchUserStatus();
            }}
            style={{
              background: '#8c4be7',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 10px rgba(140,75,231,0.3)'
            }}
          >
            🔄 Refresh Reward Data
          </button>
        </div>

        {/* User Current Status */}
        <div style={{
          background: 'linear-gradient(135deg, #8c4be7 0%, #6a0dad 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(140,75,231,0.3)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.8rem', fontWeight: '700' }}>Your Current Status</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.directBusiness)}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Direct Business</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.currentReward)}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Current Reward Level</div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {formatCurrency(userStatus.totalRewardEarned)}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total Reward Earned</div>
            </div>
          </div>
        </div>

        {/* Reward Income Table */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '2px solid #8c4be7'
          }}>
            <FaGift style={{ color: '#8c4be7', fontSize: '2rem', marginRight: '15px' }} />
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#333',
              margin: 0
            }}>
              REWARD INCOME
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '1.1rem'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #8c4be7 0%, #6a0dad 100%)',
                  color: 'white'
                }}>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    Direct Business
                  </th>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    Reward
                  </th>
                </tr>
              </thead>
              <tbody>
                {rewardSettings.map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#8c4be7'
                    }}>
                      {formatCurrency(item.directBusiness)}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      textAlign: 'right',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#28a745'
                    }}>
                      {formatCurrency(item.reward)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Income on Trading Income Table */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '2px solid #8c4be7'
          }}>
            <FaUsers style={{ color: '#8c4be7', fontSize: '2rem', marginRight: '15px' }} />
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#333',
              margin: 0
            }}>
              REFERRAL INCOME ON TRADING INCOME
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '1.1rem'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #8c4be7 0%, #6a0dad 100%)',
                  color: 'white'
                }}>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'left',
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    Level
                  </th>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'right',
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>
                    Income %
                  </th>
                </tr>
              </thead>
              <tbody>
                {referralLevels.map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    <td style={{ 
                      padding: '18px 20px', 
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#8c4be7'
                    }}>
                      {item.level}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      textAlign: 'right',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#28a745'
                    }}>
                      {item.percentage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666',
          fontSize: '1rem'
        }}>
          2025 - 2026 © Reward Income by <span style={{ color: '#8c4be7', fontWeight: 'bold' }}> Star Traders</span>
        </div>
      </div>
    </UniversalResponsiveLayout>
  );
};

export default RewardIncome;