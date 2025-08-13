
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
  {/* Total Summary */}



 