import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  // Admin password change modal state
  const [showAdminPwdModal, setShowAdminPwdModal] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPwdLoading, setAdminPwdLoading] = useState(false);

  // Handler for admin password change
  const handleAdminPwdSubmit = async (e) => {
    e.preventDefault();
    setAdminPwdLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/update-admin-password", {
        username: adminUsername,
        newPassword: adminPwd
      });
      if (res.data.success) {
        alert("Admin password updated successfully");
        setShowAdminPwdModal(false);
        setAdminPwd("");
        setAdminUsername("");
      } else {
        alert(res.data.message || "Error occurred while updating password");
      }
    } catch (err) {
      alert("Error occurred while updating password");
    }
    setAdminPwdLoading(false);
  };
>>>>>>> 95fe3dd50bd136357b217773a310a5468855d3dd
  const [supportSettings, setSupportSettings] = useState({
    telegramSupportLink: '',
    supportEmail: '',
    supportPhone: '',
    whatsappSupport: ''
  });
  
  const [rewardSettings, setRewardSettings] = useState([
    { directBusiness: 10000, reward: 250 },
    { directBusiness: 25000, reward: 500 },
    { directBusiness: 50000, reward: 1000 },
    { directBusiness: 100000, reward: 2000 },
    { directBusiness: 200000, reward: 5000 },
    { directBusiness: 500000, reward: 10000 },
    { directBusiness: 1000000, reward: 25000 },
    { directBusiness: 2000000, reward: 50000 }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingRewards, setSavingRewards] = useState(false);
  const [message, setMessage] = useState('');
  const [rewardMessage, setRewardMessage] = useState('');

  // Fetch current support settings
  useEffect(() => {
    // Fetch support settings
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/user/support-settings`)
      .then(res => {
        if (res.data.success) {
          setSupportSettings({
            telegramSupportLink: res.data.telegramSupportLink || '',
            supportEmail: res.data.supportEmail || '',
            supportPhone: res.data.supportPhone || '',
            whatsappSupport: res.data.whatsappSupport || ''
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch support settings', err);
      });

    // Fetch reward settings
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/admin/reward-settings`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log('Fetched reward settings:', res.data);
        if (res.data.success && res.data.rewards) {
          setRewardSettings(res.data.rewards);
        }
      })
      .catch(err => {
        console.error('Failed to fetch reward settings', err);
        console.error('Error response:', err.response?.data);
      });
      
    setLoading(false);
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSupportSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle reward changes
  const handleRewardChange = (index, field, value) => {
    const updatedRewards = [...rewardSettings];
    updatedRewards[index] = {
      ...updatedRewards[index],
      [field]: parseFloat(value) || 0
    };
    setRewardSettings(updatedRewards);
  };

  // Add new reward tier
  const addRewardTier = () => {
    setRewardSettings([...rewardSettings, { directBusiness: 0, reward: 0 }]);
  };

  // Remove reward tier
  const removeRewardTier = (index) => {
    const updatedRewards = rewardSettings.filter((_, i) => i !== index);
    setRewardSettings(updatedRewards);
  };

  // Reload reward settings from server
  const reloadRewardSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://startraders-fullstack-9ayr.onrender.com/api/admin/reward-settings`,
        {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Reloaded reward settings:', response.data);
      if (response.data.success && response.data.rewards) {
        setRewardSettings(response.data.rewards);
        setRewardMessage('Reward settings reloaded successfully!');
        setTimeout(() => setRewardMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to reload reward settings', error);
      setRewardMessage('Failed to reload reward settings');
      setTimeout(() => setRewardMessage(''), 3000);
    }
    setLoading(false);
  };

  // Save support settings
  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const response = await axios.post(
        `https://startraders-fullstack-9ayr.onrender.com/api/admin/support-settings`,
        supportSettings
      );
      
      if (response.data.success) {
        setMessage('Support settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update support settings', error);
      setMessage('Failed to update support settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
    
    setSaving(false);
  };

  // Save reward settings
  const handleSaveRewards = async () => {
    setSavingRewards(true);
    setRewardMessage('');
    
    try {
      const sortedRewards = rewardSettings
        .filter(r => r.directBusiness > 0 && r.reward > 0)
        .sort((a, b) => a.directBusiness - b.directBusiness);
      
      console.log('Sending reward data:', sortedRewards);
        
      const response = await axios.post(
        `https://startraders-fullstack-9ayr.onrender.com/api/admin/reward-settings`,
        { rewards: sortedRewards },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Server response:', response.data);
      
      console.log('Server response:', response.data);
      
      if (response.data.success) {
        // Update the local state with the server response
        if (response.data.rewards) {
          setRewardSettings(response.data.rewards);
        }
        setRewardMessage('Reward settings updated successfully!');
        setTimeout(() => setRewardMessage(''), 3000);
      } else {
        setRewardMessage(response.data.message || 'Failed to update reward settings');
        setTimeout(() => setRewardMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update reward settings', error);
      console.error('Error response:', error.response?.data);
      setRewardMessage(`Failed to update reward settings: ${error.response?.data?.message || error.message}`);
      setTimeout(() => setRewardMessage(''), 3000);
    }
    
    setSavingRewards(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⚙️ Admin Settings</h2>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
<<<<<<< HEAD
=======
      {/* Change Admin Password Button */}
      <button
        style={{background:'#8c4be7',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 18px',fontWeight:'600',fontSize:'1rem',cursor:'pointer',marginBottom:'18px'}}
        onClick={()=>setShowAdminPwdModal(true)}
      >
        Change Admin Password
      </button>

      {/* Admin Password Change Modal */}
      {showAdminPwdModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{background:'#fff',padding:'32px',borderRadius:'12px',minWidth:'320px',boxShadow:'0 2px 12px rgba(0,0,0,0.2)'}}>
            <h2 style={{marginBottom:'18px'}}>Change Admin Password</h2>
            <form onSubmit={handleAdminPwdSubmit}>
              <input
                type="text"
                value={adminUsername}
                onChange={e=>setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                style={{width:'100%',padding:'10px',marginBottom:'12px',borderRadius:'6px',border:'1px solid #ccc'}}
                required
              />
              <input
                type="password"
                value={adminPwd}
                onChange={e=>setAdminPwd(e.target.value)}
                placeholder="Enter new password"
                style={{width:'100%',padding:'10px',marginBottom:'18px',borderRadius:'6px',border:'1px solid #ccc'}}
                required
              />
              <div style={{display:'flex',justifyContent:'flex-end',gap:'12px'}}>
                <button type="button" onClick={()=>setShowAdminPwdModal(false)} style={{background:'#eee',color:'#333',border:'none',borderRadius:'6px',padding:'8px 18px',fontWeight:'600',fontSize:'1rem',cursor:'pointer'}}>Cancel</button>
                <button type="submit" disabled={adminPwdLoading} style={{background:'#8c4be7',color:'#fff',border:'none',borderRadius:'6px',padding:'8px 18px',fontWeight:'600',fontSize:'1rem',cursor:'pointer'}}>
                  {adminPwdLoading ? 'Updating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> 95fe3dd50bd136357b217773a310a5468855d3dd
      <h2>⚙️ Admin Settings</h2>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Support Configuration</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Telegram Support Link:
          </label>
          <input
            type="url"
            value={supportSettings.telegramSupportLink}
            onChange={(e) => handleInputChange('telegramSupportLink', e.target.value)}
            placeholder="https://t.me/yoursupportchannel"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Support Email:
          </label>
          <input
            type="email"
            value={supportSettings.supportEmail}
            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
            placeholder="support@yourdomain.com"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Support Phone:
          </label>
          <input
            type="tel"
            value={supportSettings.supportPhone}
            onChange={(e) => handleInputChange('supportPhone', e.target.value)}
            placeholder="+1234567890"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            WhatsApp Support Link (Optional):
          </label>
          <input
            type="url"
            value={supportSettings.whatsappSupport}
            onChange={(e) => handleInputChange('whatsappSupport', e.target.value)}
            placeholder="https://wa.me/1234567890"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? '#cccccc' : '#8c4be7',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: saving ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {saving ? 'Saving...' : 'Save Support Settings'}
        </button>

        {message && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: message.includes('successfully') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            color: message.includes('successfully') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Reward Configuration Section */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💰 Reward Income Configuration</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Configure reward tiers based on direct business volume. Users will receive rewards when they reach these targets.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr auto', 
            gap: '10px', 
            alignItems: 'center',
            marginBottom: '10px',
            fontWeight: 'bold',
            color: '#333',
            padding: '10px',
            background: '#e9ecef',
            borderRadius: '4px'
          }}>
            <div>Direct Business ($)</div>
            <div>Reward ($)</div>
            <div>Action</div>
          </div>
          
          {rewardSettings.map((reward, index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr auto', 
              gap: '10px', 
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <input
                type="number"
                value={reward.directBusiness}
                onChange={(e) => handleRewardChange(index, 'directBusiness', e.target.value)}
                placeholder="Direct Business Amount"
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <input
                type="number"
                value={reward.reward}
                onChange={(e) => handleRewardChange(index, 'reward', e.target.value)}
                placeholder="Reward Amount"
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => removeRewardTier(index)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🗑️ Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={addRewardTier}
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ➕ Add New Reward Tier
          </button>
          
          <button
            onClick={reloadRewardSettings}
            disabled={loading}
            style={{
              background: loading ? '#cccccc' : '#17a2b8',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Reloading...' : '🔄 Reload Settings'}
          </button>
          
          <button
            onClick={handleSaveRewards}
            disabled={savingRewards}
            style={{
              background: savingRewards ? '#cccccc' : '#8c4be7',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: savingRewards ? 'not-allowed' : 'pointer'
            }}
          >
            {savingRewards ? 'Saving...' : '💾 Save Reward Settings'}
          </button>
        </div>

        {rewardMessage && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: rewardMessage.includes('successfully') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${rewardMessage.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            color: rewardMessage.includes('successfully') ? '#155724' : '#721c24'
          }}>
            {rewardMessage}
          </div>
        )}
      </div>
    </div>
  );
}