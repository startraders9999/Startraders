import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Referral = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = () => {
    if (!user?._id) return;
    setLoading(true);
    const url = `https://startraders-fullstack-9ayr.onrender.com/api/user/referral-overview/${user._id}`;
    console.log('[Referral] Fetching:', url);
    axios.get(url, {
      headers: {
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        console.log('[Referral] API response:', res.data);
        setOverview(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error('[Referral] API error:', err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchOverview();
  }, [user]);

  const NoReferralUI = () => (
    <></>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #8b5cf6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '20px',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          Direct Referral Income
        </h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
          Manage your referral network and track earnings
        </p>
      </div>

      {/* Referral Link Section */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          color: '#8b5cf6',
          fontSize: '1.2rem',
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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '8px',
              color: 'white',
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
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💰</div>
          <h3 style={{ color: '#22c55e', fontSize: '1.8rem', margin: '5px 0' }}>
            ${overview?.totalEarnings?.toFixed(2) || '0.00'}
          </h3>
          <p style={{ color: '#a1a1aa' }}>Total Earnings</p>
        </div>

        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
          <h3 style={{ color: '#8b5cf6', fontSize: '1.8rem', margin: '5px 0' }}>
            {overview?.totalReferrals || 0}
          </h3>
          <p style={{ color: '#a1a1aa' }}>Total Referrals</p>
        </div>

        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
          <h3 style={{ color: '#22c55e', fontSize: '1.8rem', margin: '5px 0' }}>
            {overview?.activeReferrals || 0}
          </h3>
          <p style={{ color: '#a1a1aa' }}>Active Members</p>
        </div>

        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❌</div>
          <h3 style={{ color: '#ef4444', fontSize: '1.8rem', margin: '5px 0' }}>
            {(overview?.totalReferrals || 0) - (overview?.activeReferrals || 0)}
          </h3>
          <p style={{ color: '#a1a1aa' }}>Inactive Members</p>
        </div>
      </div>
      {/* Level Summary Table */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#8b5cf6',
            fontSize: '1.4rem',
            fontWeight: '600'
          }}>
            📊 Level Summary
          </h3>
          <button
            onClick={() => { setRefreshing(true); fetchOverview(); }}
            disabled={refreshing}
            style={{
              padding: '8px 16px',
              background: refreshing ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer'
            }}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Members</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Investment</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Earned Income</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3].map(lvl => (
                <tr key={lvl} style={{
                  borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <td style={{ padding: '12px 15px', color: '#8b5cf6', fontWeight: '600' }}>
                    Level {lvl}
                  </td>
                  <td style={{ padding: '12px 15px', color: 'white' }}>
                    {overview?.levelSummary?.[lvl-1]?.users ?? 0}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600' }}>
                    ${overview?.levelSummary?.[lvl-1]?.investment?.toFixed(2) ?? '0.00'}
                  </td>
                  <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600' }}>
                    ${overview?.levelSummary?.[lvl-1]?.earnings?.toFixed(2) ?? '0.00'}
                  </td>
                </tr>
              ))}
              <tr style={{
                background: 'rgba(139, 92, 246, 0.2)',
                fontWeight: 'bold'
              }}>
                <td style={{ padding: '15px', color: '#8b5cf6', fontWeight: 'bold' }}>Total</td>
                <td style={{ padding: '15px', color: 'white', fontWeight: 'bold' }}>
                  {overview?.totalReferrals ?? 0}
                </td>
                <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                  ${[0,1,2].reduce((a,i) => a + (overview?.levelSummary?.[i]?.investment || 0), 0).toFixed(2)}
                </td>
                <td style={{ padding: '15px', color: '#22c55e', fontWeight: 'bold' }}>
                  ${[0,1,2].reduce((a,i) => a + (overview?.levelSummary?.[i]?.earnings || 0), 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Referral Members */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{
          color: '#8b5cf6',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          👥 Referral Members
        </h3>

        {overview?.referralList && overview.referralList.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              minWidth: '700px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'
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
                {overview.referralList.map((member, idx) => (
                  <tr key={member._id || idx} style={{
                    borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <td style={{ padding: '12px 15px', color: 'white' }}>
                      {member?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#a1a1aa', fontSize: '0.9rem' }}>
                      {member?.email || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#8b5cf6', fontWeight: '600' }}>
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
                        backgroundColor: (member?.depositedAmount > 0) ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: (member?.depositedAmount > 0) ? '#22c55e' : '#ef4444',
                        border: `1px solid ${(member?.depositedAmount > 0) ? '#22c55e' : '#ef4444'}`
                      }}>
                        {(member?.depositedAmount > 0) ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', color: '#a1a1aa', fontSize: '0.9rem' }}>
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
            color: '#a1a1aa'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
            <p>No referral members yet</p>
          </div>
        )}
      </div>

      {/* Income History */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px'
      }}>
        <h3 style={{
          color: '#8b5cf6',
          fontSize: '1.4rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          💰 Income History
        </h3>

        {overview?.incomeHistory && overview.incomeHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(45deg, #8b5cf6, #ec4899)'
                }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Level</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Source User</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {overview.incomeHistory.map((income, idx) => (
                  <tr key={income._id || idx} style={{
                    borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <td style={{ padding: '12px 15px', color: '#a1a1aa', fontSize: '0.9rem' }}>
                      {income?.date ? new Date(income.date).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#8b5cf6', fontWeight: '600' }}>
                      Level {income?.level ?? 1}
                    </td>
                    <td style={{ padding: '12px 15px', color: '#22c55e', fontWeight: '600', fontSize: '1.1rem' }}>
                      +${income?.amount?.toFixed(2) ?? '0.00'}
                    </td>
                    <td style={{ padding: '12px 15px', color: 'white' }}>
                      {income?.sourceUser ? `${income.sourceUser.name}` : 'N/A'}
                      <br />
                      <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
                        {income?.sourceUser?.email || ''}
                      </span>
                    </td>
                    <td style={{ padding: '12px 15px', color: '#a1a1aa', fontSize: '0.9rem' }}>
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
            color: '#a1a1aa'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💰</div>
            <p>No income history yet</p>
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
