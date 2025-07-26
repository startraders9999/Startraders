import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Referral = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [overview, setOverview] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    levelSummary: [
      { users: 0, investment: 0, earnings: 0 },
      { users: 0, investment: 0, earnings: 0 },
      { users: 0, investment: 0, earnings: 0 }
    ],
    referralList: [],
    incomeHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    
    console.log('[Referral] Starting fetch for user:', user._id);
    setLoading(true);
    
    // Force stop loading after 5 seconds regardless of API response
    const forceStopLoading = setTimeout(() => {
      console.log('[Referral] Force stopping loading - showing empty data');
      setOverview({
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        levelSummary: [
          { users: 0, investment: 0, earnings: 0 },
          { users: 0, investment: 0, earnings: 0 },
          { users: 0, investment: 0, earnings: 0 }
        ],
        referralList: [],
        incomeHistory: []
      });
      setLoading(false);
      setRefreshing(false);
    }, 5000);

    const url = `https://startraders-fullstack-9ayr.onrender.com/api/user/referral-overview/${user._id}`;
    
    axios.get(url, {
      timeout: 8000, // 8 second timeout for axios
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        clearTimeout(forceStopLoading);
        console.log('[Referral] API success:', res.data);
        
        const data = res.data || {};
        setOverview({
          totalReferrals: data.totalReferrals || 0,
          activeReferrals: data.activeReferrals || 0,
          totalEarnings: data.totalEarnings || 0,
          levelSummary: data.levelSummary || [
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 }
          ],
          referralList: data.referralList || [],
          incomeHistory: data.incomeHistory || []
        });
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        clearTimeout(forceStopLoading);
        console.error('[Referral] API error:', err.message);
        
        // Always show the page with empty data instead of staying in loading
        setOverview({
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          levelSummary: [
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 }
          ],
          referralList: [],
          incomeHistory: []
        });
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    // Emergency fallback - if still loading after 3 seconds, force show page
    const emergencyFallback = setTimeout(() => {
      if (loading) {
        console.log('[Referral] Emergency fallback - force showing page');
        setOverview({
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          levelSummary: [
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 },
            { users: 0, investment: 0, earnings: 0 }
          ],
          referralList: [],
          incomeHistory: []
        });
        setLoading(false);
      }
    }, 3000);

    fetchOverview();
    
    return () => clearTimeout(emergencyFallback);
  }, [user]);

  if (loading) {
    return (
      <div className="referral-theme-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #6a0dad',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ color: '#6a0dad', fontSize: '1.1rem' }}>Loading referral data...</p>
        </div>
      </div>
    );
  }

  // Ensure overview has default structure
  const safeOverview = overview || {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    levelSummary: [],
    referralList: [],
    incomeHistory: []
  };

  return (
    <div className="referral-theme-container">
      {/* Header */}
      <div className="referral-title">Direct Referral Income</div>
      <p style={{ 
        color: '#666', 
        fontSize: '1.1rem', 
        marginBottom: '30px', 
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        Manage your referral network and track your earnings from direct referrals
      </p>

      {/* Referral Link Section */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
        padding: '25px',
        marginBottom: '30px',
        maxWidth: '700px',
        width: '100%',
        border: '2px solid #e0d4f7'
      }}>
        <h3 style={{
          color: '#6a0dad',
          fontSize: '1.3rem',
          marginBottom: '15px',
          fontWeight: '600'
        }}>
          🔗 Your Referral Link
        </h3>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            readOnly
            value={`https://startraders-f.onrender.com/register?ref=${user?._id}`}
            style={{
              flex: '1',
              minWidth: '300px',
              padding: '12px 15px',
              backgroundColor: '#f8f6ff',
              border: '2px solid #e0d4f7',
              borderRadius: '8px',
              color: '#333',
              fontSize: '14px'
            }}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://startraders-f.onrender.com/register?ref=${user?._id}`);
              alert("Referral link copied!");
            }}
            style={{
              padding: '12px 20px',
              background: '#6a0dad',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#5a0ca0'}
            onMouseLeave={(e) => e.target.style.background = '#6a0dad'}
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
          padding: '25px',
          textAlign: 'center',
          border: '2px solid #e0d4f7'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <h3 style={{ color: '#6a0dad', fontSize: '1.8rem', margin: '5px 0' }}>
            ${safeOverview?.totalEarnings?.toFixed(2) || '0.00'}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Earnings</p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
          padding: '25px',
          textAlign: 'center',
          border: '2px solid #e0d4f7'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: '#6a0dad', fontSize: '1.8rem', margin: '5px 0' }}>
            {safeOverview?.totalReferrals || 0}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Referrals</p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
          padding: '25px',
          textAlign: 'center',
          border: '2px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
          <h3 style={{ color: '#22c55e', fontSize: '1.8rem', margin: '5px 0' }}>
            {safeOverview?.activeReferrals || 0}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Active Members</p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
          padding: '25px',
          textAlign: 'center',
          border: '2px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❌</div>
          <h3 style={{ color: '#ef4444', fontSize: '1.8rem', margin: '5px 0' }}>
            {(safeOverview?.totalReferrals || 0) - (safeOverview?.activeReferrals || 0)}
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Inactive Members</p>
        </div>
      </div>
      {/* Level Summary Table */}
      <div className="referral-summary-card" style={{ maxWidth: '800px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 className="referral-summary-heading">
            📊 Level Summary
          </h3>
          <button
            className="referral-refresh-btn"
            onClick={() => { setRefreshing(true); fetchOverview(); }}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="referral-summary-table">
            <thead>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#6a0dad' }}>Level</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#6a0dad' }}>Members</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#6a0dad' }}>Investment</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#6a0dad' }}>Earned Income</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3].map(lvl => (
                <tr key={lvl} style={{
                  borderBottom: '1px solid #e0d4f7',
                  backgroundColor: lvl % 2 === 0 ? '#f8f6ff' : '#fff'
                }}>
                  <td style={{ padding: '12px 15px', color: '#6a0dad', fontWeight: '600' }}>
                    Level {lvl}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#333' }}>
                    {safeOverview?.levelSummary?.[lvl-1]?.users ?? 0}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600' }}>
                    ${safeOverview?.levelSummary?.[lvl-1]?.investment?.toFixed(2) ?? '0.00'}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600' }}>
                    ${safeOverview?.levelSummary?.[lvl-1]?.earnings?.toFixed(2) ?? '0.00'}
                  </td>
                </tr>
              ))}
              <tr style={{
                background: '#e0d4f7',
                fontWeight: 'bold'
              }}>
                <td style={{ padding: '15px', color: '#6a0dad', fontWeight: 'bold' }}>Total</td>
                <td style={{ padding: '15px', color: '#333', fontWeight: 'bold' }}>
                  {safeOverview?.totalReferrals ?? 0}
                </td>
                <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                  ${[0,1,2].reduce((a,i) => a + (safeOverview?.levelSummary?.[i]?.investment || 0), 0).toFixed(2)}
                </td>
                <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                  ${[0,1,2].reduce((a,i) => a + (safeOverview?.levelSummary?.[i]?.earnings || 0), 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Referral Members */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
        padding: '25px',
        marginBottom: '30px',
        maxWidth: '900px',
        width: '100%',
        border: '2px solid #e0d4f7'
      }}>
        <h3 style={{
          color: '#6a0dad',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          👥 Referral Members
        </h3>

        {safeOverview?.referralList && safeOverview.referralList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '700px'
            }}>
              <thead>
                <tr style={{
                  background: '#6a0dad',
                  color: 'white'
                }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Level</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Deposit</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {safeOverview.referralList.map((member, idx) => (
                  <tr key={member._id || idx} style={{
                    borderBottom: '1px solid #e0d4f7',
                    backgroundColor: idx % 2 === 0 ? '#f8f6ff' : '#fff'
                  }}>
                    <td style={{ padding: '12px 15px', color: '#333', fontWeight: '500' }}>
                      {member?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.9rem' }}>
                      {member?.email || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6a0dad', fontWeight: '600' }}>
                      Level {member?.level ?? 1}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600' }}>
                      ${member?.depositedAmount?.toFixed(2) ?? '0.00'}
                    </td>
                    <td style={{ padding: '12px 15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: (member?.depositedAmount > 0) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: (member?.depositedAmount > 0) ? '#22c55e' : '#ef4444',
                        border: `1px solid ${(member?.depositedAmount > 0) ? '#22c55e' : '#ef4444'}`
                      }}>
                        {(member?.depositedAmount > 0) ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.9rem' }}>
                      {member?.joined ? new Date(member.joined).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
            <p>No referral members yet</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>Share your referral link to start earning!</p>
          </div>
        )}
      </div>

      {/* Income History */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(106,13,173,0.08)',
        padding: '25px',
        maxWidth: '900px',
        width: '100%',
        border: '2px solid #e0d4f7'
      }}>
        <h3 style={{
          color: '#6a0dad',
          fontSize: '1.3rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          💰 Income History
        </h3>

        {safeOverview?.incomeHistory && safeOverview.incomeHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{
                  background: '#6a0dad',
                  color: 'white'
                }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Level</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Source User</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {safeOverview.incomeHistory.map((income, idx) => (
                  <tr key={income._id || idx} style={{
                    borderBottom: '1px solid #e0d4f7',
                    backgroundColor: idx % 2 === 0 ? '#f8f6ff' : '#fff'
                  }}>
                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.9rem' }}>
                      {income?.date ? new Date(income.date).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#6a0dad', fontWeight: '600' }}>
                      Level {income?.level ?? 1}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600', fontSize: '1.1rem' }}>
                      +${income?.amount?.toFixed(2) ?? '0.00'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#333' }}>
                      {income?.sourceUser ? `${income.sourceUser.name}` : 'N/A'}
                      <br />
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>
                        {income?.sourceUser?.email || ''}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '0.9rem' }}>
                      {income?.description || 'Referral Income'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
            <p>No income history yet</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>Income will appear here when your referrals make deposits</p>
          </div>
        )}
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Referral;
