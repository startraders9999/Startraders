import React, { useEffect, useState } from 'react';
import './RewardIncome.css';
import axios from 'axios';

const RewardIncome = () => {
  const [rewardData, setRewardData] = useState({
    directBusiness: 0,
    rewardAmount: 0,
    totalRewardEarned: 0
  });
  const [loading, setLoading] = useState(true);

  const rewards = [
    { business: '$10,000', reward: '$250' },
    { business: '$25,000', reward: '$500' },
    { business: '$100,000', reward: '$1,000' },
    { business: '$500,000', reward: '$2,000' },
    { business: '$2,000,000', reward: '$25,000' },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    // Fetch reward income data
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/user/reward-income?userId=${user._id}`)
      .then((res) => {
        if (res.data.success) {
          setRewardData({
            directBusiness: res.data.directBusiness || 0,
            rewardAmount: res.data.rewardAmount || 0,
            totalRewardEarned: res.data.totalRewardEarned || 0
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reward income", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', background: 'transparent', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Loading Reward Income...</h2>
      </div>
    );
  }

  return (
    <div className="reward-container">
      <h2 className="reward-title">REWARD INCOME</h2>
      
      {/* Current Status */}
      <div className="reward-status" style={{ marginBottom: '2rem', padding: '1rem', background: '#1a1a2e', borderRadius: '10px', border: '1px solid #8c4be7' }}>
        <h3 style={{ color: '#8c4be7', marginBottom: '1rem' }}>Your Current Status</h3>
        <div style={{ color: 'white' }}>
          <p><strong>Direct Business:</strong> ${rewardData.directBusiness.toLocaleString()}</p>
          <p><strong>Current Reward Level:</strong> ${rewardData.rewardAmount.toLocaleString()}</p>
          <p><strong>Total Reward Earned:</strong> ${rewardData.totalRewardEarned.toLocaleString()}</p>
        </div>
      </div>

      {/* Reward Table */}
      <table className="reward-table">
        <thead>
          <tr>
            <th>Direct Business</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((item, index) => (
            <tr key={index}>
              <td>{item.business}</td>
              <td>{item.reward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardIncome;