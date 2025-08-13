import React, { useEffect, useState } from 'react';
import './SalaryIncome.css'; 
import axios from 'axios';

const SalaryIncome = () => {
  const [salaryData, setSalaryData] = useState({
    totalSalaryIncome: 0,
    monthlySalary: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    // Fetch salary income data
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/user/salary-income/${user._id}`)
      .then((res) => {
        if (res.data.success) {
          setSalaryData({
            totalSalaryIncome: res.data.totalSalaryIncome || 0,
            monthlySalary: res.data.monthlySalary || 0,
            transactions: res.data.transactions || []
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching salary income", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white', background: 'transparent', minHeight: '100vh', textAlign: 'center' }}>
        <h2>Loading Salary Income...</h2>
      </div>
    );
  }

  return (
    <div className="salary-container">
      <h1 className="Salary-title">SALARY INCOME</h1>
      
      {/* Current Status */}
      <div className="salary-status" style={{ marginBottom: '2rem', padding: '1rem', background: '#1a1a2e', borderRadius: '10px', border: '1px solid #8c4be7' }}>
        <h3 style={{ color: '#8c4be7', marginBottom: '1rem' }}>Your Current Status</h3>
        <div style={{ color: 'white' }}>
          <p><strong>Total Salary Income:</strong> ${salaryData.totalSalaryIncome.toLocaleString()}</p>
          <p><strong>Monthly Salary:</strong> ${salaryData.monthlySalary.toLocaleString()}</p>
        </div>
      </div>

      <p className="salary-subtitle">Start earning daily fixed salary income based on your direct business:</p>
      <div className="salary-table-wrapper">
        <table className="salary-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Direct Business Volume</th>
              <th>Daily Salary</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Level 1</td><td>$1,250</td><td>$5/day</td></tr>
            <tr><td>Level 2</td><td>$2,500</td><td>$10/day</td></tr>
            <tr><td>Level 3</td><td>$5,000</td><td>$20/day</td></tr>
            <tr><td>Level 4</td><td>$10,000</td><td>$40/day</td></tr>
            <tr><td>Level 5</td><td>$20,000</td><td>$80/day</td></tr>
            <tr><td>Level 6</td><td>$40,000</td><td>$160/day</td></tr>
            <tr><td>Level 7</td><td>$80,000</td><td>$320/day</td></tr>
            <tr><td>Level 8</td><td>$160,000</td><td>$640/day</td></tr>
            <tr><td>Level 9</td><td>$320,000</td><td>$1,280/day</td></tr>
            <tr><td>Level 10</td><td>$640,000</td><td>$2,560/day</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryIncome;