
import React, { useEffect, useState } from 'react';
import './ReferralIncome.css';
import axios from 'axios';

const ReferralIncome = () => {
  const [referralData, setReferralData] = useState([]);
  const [totalReferralIncome, setTotalReferralIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) return;

    // Fetch direct referral income data
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/user/direct-referral-income/${user._id}`)
      .then((res) => {
        if (res.data.success) {
          setReferralData(res.data.transactions || []);
          setTotalReferralIncome(parseFloat(res.data.totalDirectReferralIncome) || 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching direct referral income", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', background: 'transparent', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Loading Referral Income...</h2>
      </div>
    );
  }

  // Group by level
  const levelStats = {};
  referralData.forEach(transaction => {
    const level = transaction.level || 1;
    if (!levelStats[level]) {
      levelStats[level] = { count: 0, amount: 0 };
    }
    levelStats[level].count++;
    levelStats[level].amount += typeof transaction.amount === 'number' ? transaction.amount : 0;
  });

  return (
    <div style={{ padding: '20px', color: 'white', background: 'transparent', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Direct Referral Income</h2>

      {/* Total Summary */}
      <div style={{ background: '#222', borderRadius: '12px', padding: '18px 24px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(140,75,231,0.08)' }}>
        <h3 style={{ color: '#8c4be7', marginBottom: '10px' }}>Total Referral Income</h3>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>${totalReferralIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      </div>

      {/* Level-wise Summary */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#8c4be7', marginBottom: '10px' }}>Level-wise Income</h3>
        <table style={{ width: '100%', background: '#181818', borderRadius: '8px', overflow: 'hidden', color: '#fff' }}>
          <thead>
            <tr style={{ background: '#8c4be7', color: '#fff' }}>
              <th style={{ padding: '10px' }}>Level</th>
              <th style={{ padding: '10px' }}>Count</th>
              <th style={{ padding: '10px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(levelStats).sort((a, b) => a - b).map(level => (
              <tr key={level}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{level}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{levelStats[level].count}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>${levelStats[level].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction List */}
      <div>
        <h3 style={{ color: '#8c4be7', marginBottom: '10px' }}>Referral Transactions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', background: '#181818', borderRadius: '8px', overflow: 'hidden', color: '#fff' }}>
            <thead>
              <tr style={{ background: '#8c4be7', color: '#fff' }}>
                <th style={{ padding: '10px' }}>Date</th>
                <th style={{ padding: '10px' }}>From User</th>
                <th style={{ padding: '10px' }}>Level</th>
                <th style={{ padding: '10px' }}>Amount</th>
                <th style={{ padding: '10px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {referralData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>No referral income transactions found.</td>
                </tr>
              ) : (
                referralData.map((txn, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{new Date(txn.date).toLocaleString()}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{txn.fromUserName || txn.fromUser || '-'}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{txn.level || 1}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>${(txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{txn.description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReferralIncome;



