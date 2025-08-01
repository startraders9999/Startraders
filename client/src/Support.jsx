import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const Support = () => {
  const [supportSettings, setSupportSettings] = useState({
    telegramSupportLink: 'https://t.me/startraderssupport',
    supportEmail: 'support@startraders.com',
    supportPhone: '+1234567890',
    whatsappSupport: ''
  });

  useEffect(() => {
    // Fetch support settings from API
    axios
      .get(`https://startraders-fullstack-9ayr.onrender.com/api/user/support-settings`)
      .then(res => {
        if (res.data.success) {
          setSupportSettings({
            telegramSupportLink: res.data.telegramSupportLink || 'https://t.me/startraderssupport',
            supportEmail: res.data.supportEmail || 'support@startraders.com',
            supportPhone: res.data.supportPhone || '+1234567890',
            whatsappSupport: res.data.whatsappSupport || ''
          });
        }
      })
      .catch(() => console.log('Failed to fetch support settings'));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>24/7 Customer Support</h1>
        <p>We're here to help you with any questions or concerns</p>
      </div>

      <div className="dashboard-content">
        <div className="balance-cards">
          <div className="balance-card support-card">
            <div className="card-icon">💬</div>
            <div className="card-content">
              <h3>Telegram Support</h3>
              <p>Get instant help from our support team</p>
              <a href={supportSettings.telegramSupportLink} target="_blank" rel="noopener noreferrer" className="support-btn">
                Open Telegram
              </a>
            </div>
          </div>

          <div className="balance-card support-card">
            <div className="card-icon">📧</div>
            <div className="card-content">
              <h3>Email Support</h3>
              <p>Send us your queries via email</p>
              <a href={`mailto:${supportSettings.supportEmail}`} className="support-btn">
                Send Email
              </a>
            </div>
          </div>

          <div className="balance-card support-card">
            <div className="card-icon">📞</div>
            <div className="card-content">
              <h3>Phone Support</h3>
              <p>Call us for immediate assistance</p>
              <a href={`tel:${supportSettings.supportPhone}`} className="support-btn">
                Call Now
              </a>
            </div>
          </div>

          {supportSettings.whatsappSupport && (
            <div className="balance-card support-card">
              <div className="card-icon">📱</div>
              <div className="card-content">
                <h3>WhatsApp Support</h3>
                <p>Chat with us on WhatsApp</p>
                <a href={supportSettings.whatsappSupport} target="_blank" rel="noopener noreferrer" className="support-btn">
                  Open WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className="balance-card support-card">
            <div className="card-icon">❓</div>
            <div className="card-content">
              <h3>FAQ</h3>
              <p>Find answers to common questions</p>
              <button className="support-btn">View FAQ</button>
            </div>
          </div>
        </div>

        <div className="support-info" style={{
          background: '#1a1a3a',
          padding: '20px',
          borderRadius: '10px',
          marginTop: '20px',
          color: 'white'
        }}>
          <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>Contact Information</h3>
          <div className="contact-details">
            <p><strong>Email:</strong> support@startraders.com</p>
            <p><strong>Phone:</strong> +1 (234) 567-8900</p>
            <p><strong>Hours:</strong> 24/7 Available</p>
            <p><strong>Response Time:</strong> Within 30 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
