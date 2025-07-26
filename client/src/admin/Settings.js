import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
  const [supportSettings, setSupportSettings] = useState({
    telegramSupportLink: '',
    supportEmail: '',
    supportPhone: '',
    whatsappSupport: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch current support settings
  useEffect(() => {
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
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch support settings', err);
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSupportSettings(prev => ({
      ...prev,
      [field]: value
    }));
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
    </div>
  );
}