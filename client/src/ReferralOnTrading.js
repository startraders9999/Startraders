import React, { useEffect, useState } from 'react';
import './ReferralOnTrading.css';
import UniversalResponsiveLayout from './UniversalResponsiveLayout';

const ReferralOnTrading = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      fetch(`https://startraders-fullstack-9ayr.onrender.com/api/user/referral-trading-income?userId=${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTotalIncome(data.totalIncome || 0);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const levelIncomeStructure = [
    { level: 1, percentage: '15%', color: '#28a745' },
    { level: 2, percentage: '10%', color: '#28a745' },
    { level: 3, percentage: '8%', color: '#ffc107' },
    { level: 4, percentage: '5%', color: '#ffc107' },
    { level: 5, percentage: '4%', color: '#17a2b8' },
    { level: 6, percentage: '3%', color: '#17a2b8' },
    { level: 7, percentage: '3%', color: '#6f42c1' },
    { level: 8, percentage: '2%', color: '#6f42c1' },
    { level: 9, percentage: '2%', color: '#fd7e14' },
    { level: 10, percentage: '1%', color: '#fd7e14' },
    { level: 11, percentage: '1%', color: '#e83e8c' },
    { level: 12, percentage: '0.50%', color: '#e83e8c' },
    { level: 13, percentage: '0.50%', color: '#6c757d' },
    { level: 14, percentage: '3%', color: '#20c997' },
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
          padding: '0 0 0 24px',
          height: '64px',
          boxShadow: '0 2px 8px rgba(140,75,231,0.08)',
          marginBottom: '30px',
          borderRadius: '12px'
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '2rem', letterSpacing: '1px' }}>
            REFERRAL INCOME ON TRADING INCOME
          </span>
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
                        background: item.level <= 6 ? '#28a745' : '#ffc107',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        {item.level <= 6 ? '🔓 Active' : '🔒 Locked'}
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
