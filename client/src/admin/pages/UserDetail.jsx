
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  // Handler for Transfer button
  const handleTransfer = () => {
    setShowTransferPopup(true);
  };

  // Handler for Ban button
  const handleBan = () => {
    if (window.confirm('Kya aap user ko ban karna chahte hain?')) {
      axios.post('https://startraders-fullstack-9ayr.onrender.com/api/admin/ban-user', { userId: id })
        .then(res => {
          if (res.data.success) {
            alert('User banned successfully');
            setUser({ ...user, banned: true });
          } else {
            alert(res.data.message || 'Failed to ban user');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Error occurred while banning user');
        });
    }
  };

  // Handler for Delete User button
  const handleDeleteUser = () => {
    if (window.confirm('Kya aap user ko delete karna chahte hain?')) {
      axios.delete('https://startraders-fullstack-9ayr.onrender.com/api/admin/delete-user', { data: { userId: id } })
        .then(res => {
          if (res.data.success) {
            alert('User deleted successfully');
            window.location.href = '/admin/users';
          } else {
            alert(res.data.message || 'Failed to delete user');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Error occurred while deleting user');
        });
    }
  };

  // Handler for Login as User button
  const handleLoginAsUser = () => {
    axios.post('https://startraders-fullstack-9ayr.onrender.com/api/admin/login-as-user', { userId: id })
      .then(res => {
        if (res.data.success && res.data.token && res.data.user) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = '/dashboard';
        } else {
          alert('Login as user failed');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error occurred while logging in as user');
      });
  };

  useEffect(() => {
    axios.get(`https://startraders-fullstack-9ayr.onrender.com/api/admin/user/${id}`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, [id]);

  const handleBalanceUpdate = () => {
    if (!amount || isNaN(amount)) return alert("Enter valid amount");
    axios.post(`https://startraders-fullstack-9ayr.onrender.com/api/admin/update-balance`, {
      userId: id,
      amount: parseFloat(amount),
      type: type,
    }).then(res => {
      if (res.data.success) {
        setUser(res.data.user);
        setShowPopup(false);
        setAmount('');
      } else {
        alert("Failed to update balance");
      }
    }).catch(err => {
      console.error(err);
      alert("Error occurred");
    });
  };

  if (!user) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <div className="user-details-container">
      <h2 className="user-details-heading">USER DETAILS</h2>
      <div className="user-info">
        <p><strong>User Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Deposited Balance:</strong>
          <span className="amount clickable" onClick={() => setShowPopup(true)}>
            ${user.balance?.toFixed(2)}
          </span>
        </p>
      </div>

      {/* Transfer Popup */}
      {showTransferPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Transfer Amount</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={() => {
                if (!transferAmount || isNaN(transferAmount)) return alert('Enter valid amount');
                axios.post('https://startraders-fullstack-9ayr.onrender.com/api/admin/transfer', {
                  userId: id,
                  amount: parseFloat(transferAmount)
                }).then(res => {
                  if (res.data.success) {
                    alert('Transfer successful');
                    setUser(res.data.user);
                    setShowTransferPopup(false);
                    setTransferAmount('');
                  } else {
                    alert('Transfer failed');
                  }
                }).catch(err => {
                  console.error(err);
                  alert('Error occurred during transfer');
                });
              }}>Submit</button>
              <button onClick={() => setShowTransferPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetail;


      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Update Balance</h3>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleBalanceUpdate}>Submit</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="user-actions">
        <button className="transfer-btn" onClick={handleTransfer}>Transfer</button>
        <button className="ban-btn" onClick={handleBan}>Ban</button>
        <button className="delete-btn" style={{marginLeft: '10px', background: 'darkred', color: 'white'}} onClick={handleDeleteUser}>Delete User</button>
        <button className="transfer-btn" onClick={handleLoginAsUser}>Login as User</button>
      </div>

      {/* Transfer Popup */}
      {showTransferPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Transfer Amount</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={() => {
                if (!transferAmount || isNaN(transferAmount)) return alert('Enter valid amount');
                axios.post('https://startraders-fullstack-9ayr.onrender.com/api/admin/transfer', {
                  userId: id,
                  amount: parseFloat(transferAmount)
                }).then(res => {
                  if (res.data.success) {
                    alert('Transfer successful');
                    setUser(res.data.user);
                    setShowTransferPopup(false);
                    setTransferAmount('');
                  } else {
                    alert('Transfer failed');
                  }
                }).catch(err => {
                  console.error(err);
                  alert('Error occurred during transfer');
                });
              }}>Submit</button>
              <button onClick={() => setShowTransferPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Balance Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Update Balance</h3>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="popup-actions">
              <button onClick={handleBalanceUpdate}>Submit</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
