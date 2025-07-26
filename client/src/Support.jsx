import React from 'react';
import './Dashboard.css';

const Support = () => {
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
              <h3>Live Chat</h3>
              <p>Get instant help from our support team</p>
              <button className="support-btn">Start Chat</button>
            </div>
          </div>

          <div className="balance-card support-card">
            <div className="card-icon">📧</div>
            <div className="card-content">
              <h3>Email Support</h3>
              <p>Send us your queries via email</p>
              <a href="mailto:support@startraders.com" className="support-btn">
                Send Email
              </a>
            </div>
          </div>

          <div className="balance-card support-card">
            <div className="card-icon">📞</div>
            <div className="card-content">
              <h3>Phone Support</h3>
              <p>Call us for immediate assistance</p>
              <a href="tel:+1234567890" className="support-btn">
                Call Now
              </a>
            </div>
          </div>

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
