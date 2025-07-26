import React, { useEffect, useState } from 'react';
import './ReferralOnTrading.css';
import UniversalResponsiveLayout from './UniversalResponsiveLayout';
import axios from 'axios';

const ReferralOnTrading = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState(0);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralTradingData();
  }, []);

  const fetchReferralTradingData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      console.log('Fetching referral trading income data...');
      const response = await axios.get(`https://startraders-fullstack-9ayr.onrender.com/api/user/referral-trading-income/${user._id}`);
      
      if (response.data.success) {
        setTotalIncome(response.data.totalIncome || 0);
        setDirectReferrals(response.data.directReferrals || 0);
        setUnlockedLevels(response.data.unlockedLevels || 0);
        setIncomeHistory(response.data.incomeHistory || []);
        console.log('Data loaded:', response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching referral trading data:', error);
      setLoading(false);
    }
  };

  // Updated level structure with correct percentages
  const levelIncomeStructure = [
    { level: 1, percentage: '15%', color: '#28a745' },
    { level: 2, percentage: '10%', color: '#28a745' },
    { level: 3, percentage: '8%', color: '#ffc107' },
    { level: 4, percentage: '6%', color: '#ffc107' },
    { level: 5, percentage: '4%', color: '#17a2b8' },
    { level: 6, percentage: '3%', color: '#17a2b8' },
    { level: 7, percentage: '3%', color: '#6f42c1' },
    { level: 8, percentage: '2%', color: '#6f42c1' },
    { level: 9, percentage: '2%', color: '#fd7e14' },
    { level: 10, percentage: '1%', color: '#fd7e14' },
    { level: 11, percentage: '1%', color: '#e83e8c' },
    { level: 12, percentage: '0.50%', color: '#e83e8c' },
    { level: 13, percentage: '0.50%', color: '#6c757d' },
    { level: 14, percentage: '2%', color: '#20c997' },
    { level: 15, percentage: '5%', color: '#dc3545' }
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
          <h2 style={{ color: '#8c4be7', fontSize: '2rem', fontWeight: '700' }}>Loading...</h2>
        </div>
      </UniversalResponsiveLayout>
    );
  }

  return (
    <UniversalResponsiveLayout>
      <div style={{ background: '#f8f6ff', minHeight: '100vh', padding: '20px' }}>
        <div style={{
          width: '100%',
          background: '#8c4be7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '64px',
          boxShadow: '0 2px 8px rgba(140,75,231,0.08)',
          marginBottom: '30px',
          borderRadius: '12px'
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '2rem', letterSpacing: '1px' }}>
            REFERRAL INCOME ON TRADING INCOME
          </span>
          
          <button
            onClick={fetchReferralTradingData}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8c4be7 0%, #6a0dad 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(140,75,231,0.3)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: '600', opacity: 0.9 }}>Total Referral Trading Income</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
            ${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

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
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔒</span>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: '#333',
              margin: 0
            }}>
              Level Income Unlocking Conditions
            </h2>
          </div>
          
          <div style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '2px solid #28a745'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px'
            }}>
              <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🟩</span>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '700', 
                color: '#28a745',
                margin: 0
              }}>
                Condition 1: Direct Referral Unlock Rule
              </h3>
            </div>
            
            <div style={{ fontSize: '1.1rem', color: '#333', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '10px' }}>
                ➡️ <strong>For every 1 direct referral, 2 levels of income will be unlocked.</strong>
              </div>
              <div style={{ 
                background: '#fff',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #28a745'
              }}>
                📊 <strong>Example:</strong> 3 direct users = 6 levels unlocked
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Section */}
        <div style={{
          background: 'linear-gradient(135deg, #20c997 0%, #17a2b8 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '30px',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(32,201,151,0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🎯</span>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              margin: 0
            }}>
              Your Current Status
            </h3>
          </div>
          
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Direct Referrals:</strong> {directReferrals}
            </div>
            <div style={{ 
              fontSize: '1.4rem', 
              fontWeight: '700',
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 20px',
              borderRadius: '25px',
              display: 'inline-block',
              marginTop: '10px'
            }}>
              🔓 You have unlocked up to Level {unlockedLevels}
            </div>
          </div>
        </div>

        {/* Income History Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#333',
            margin: '0 0 25px 0',
            paddingBottom: '15px',
            borderBottom: '2px solid #28a745',
            textAlign: 'center'
          }}>
            💰 YOUR REFERRAL INCOME HISTORY
          </h2>
          
          {incomeHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '1.2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
              <div>No referral income transactions yet</div>
              <div style={{ fontSize: '1rem', marginTop: '10px' }}>
                Start referring friends to see your earnings here!
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '1rem'
              }}>
                <thead>
                  <tr style={{ 
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    color: 'white'
                  }}>
                    <th style={{ 
                      padding: '15px 10px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Date</th>
                    <th style={{ 
                      padding: '15px 10px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>From User</th>
                    <th style={{ 
                      padding: '15px 10px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Level</th>
                    <th style={{ 
                      padding: '15px 10px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Percentage</th>
                    <th style={{ 
                      padding: '15px 10px', 
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeHistory.map((transaction, index) => (
                    <tr key={transaction._id} style={{ 
                      background: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}>
                      <td style={{ 
                        padding: '12px 10px', 
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }}>
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ 
                        padding: '12px 10px', 
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        {transaction.fromUserId?.username || 'Unknown User'}
                      </td>
                      <td style={{ 
                        padding: '12px 10px', 
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#8c4be7'
                      }}>
                        Level {transaction.level}
                      </td>
                      <td style={{ 
                        padding: '12px 10px', 
                        textAlign: 'center',
                        color: '#17a2b8',
                        fontWeight: '600'
                      }}>
                        {transaction.percentage}%
                      </td>
                      <td style={{ 
                        padding: '12px 10px', 
                        textAlign: 'center',
                        fontWeight: '700',
                        color: '#28a745',
                        fontSize: '1.1rem'
                      }}>
                        ₹{transaction.incomeAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                padding: '15px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#333'
              }}>
                🎯 Total Referral Income: <span style={{ color: '#28a745' }}>₹{totalIncome.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#333',
            margin: '0 0 25px 0',
            paddingBottom: '15px',
            borderBottom: '2px solid #8c4be7',
            textAlign: 'center'
          }}>
            📊 LEVEL INCOME STRUCTURE
          </h2>
          
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
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    width: '30%'
                  }}>
                    Level
                  </th>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    width: '40%'
                  }}>
                    Income Percentage
                  </th>
                  <th style={{ 
                    padding: '20px', 
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    width: '30%'
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {levelIncomeStructure.map((item, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                  }}>
                    <td style={{ 
                      padding: '18px 20px', 
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: '#8c4be7'
                    }}>
                      Level {item.level}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      textAlign: 'center',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: item.color
                    }}>
                      {item.percentage}
                    </td>
                    <td style={{ 
                      padding: '18px 20px', 
                      textAlign: 'center'
                    }}>
                      <span style={{
                        background: item.level <= unlockedLevels ? '#28a745' : '#dc3545',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '25px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {item.level <= unlockedLevels ? '🔓 Unlocked' : '🔒 Locked'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666',
          fontSize: '1rem'
        }}>
          2025 - 2026 © Referral Income on Trading by <span style={{ color: '#8c4be7', fontWeight: 'bold' }}>Star Traders</span>
        </div>
      </div>
    </UniversalResponsiveLayout>
  );
};

export default ReferralOnTrading;
