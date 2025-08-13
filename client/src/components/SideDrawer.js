import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SideDrawer.css';

const SideDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          onTouchEnd={onClose}
        ></div>
      )}
      <div className={`neopips-sidebar ${isOpen ? 'sidebar-open' : ''}`} style={{display:'flex',flexDirection:'column',height:'100vh',position:'relative',overflow:'visible',paddingBottom:'120px'}}>
        <nav className="neopips-nav">
          <Link to="/deposit" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">💵</div><span className="nav-text">Deposit</span></Link>
          <Link to="/withdrawal" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">💳</div><span className="nav-text">Withdrawal</span></Link>
          <Link to="/team" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">👥</div><span className="nav-text">Team</span></Link>
          <Link to="/trading-income" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">📊</div><span className="nav-text">Trading Income</span></Link>
          <Link to="/direct-referral-income" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">👥</div><span className="nav-text">Direct Referral Income</span></Link>
          <Link to="/referral-on-trading" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">🔄</div><span className="nav-text">Trading Income on Direct Referral</span></Link>
          <Link to="/reward-income" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">🏆</div><span className="nav-text">Reward Income</span></Link>
          <Link to="/salary-income" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">💼</div><span className="nav-text">Salary Income</span></Link>
          <Link to="/trading" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">📈</div><span className="nav-text">Trading</span></Link>
          <Link to="/reward" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">🏆</div><span className="nav-text">Reward</span></Link>
          <Link to="/earning" className="neopips-nav-item" onClick={onClose}><div className="nav-icon">💰</div><span className="nav-text">Earning</span></Link>
        </nav>
        <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0',position:'fixed',bottom:'24px',left:'0'}}>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <span style={{fontSize:'1.7rem'}}>🚪</span> Logout
          </button>
          <button onClick={onClose} style={{
            background:'#eee',
            color:'#8c4be7',
            border:'none',
            borderRadius:'8px',
            padding:'12px 32px',
            fontWeight:'600',
            fontSize:'1rem',
            cursor:'pointer',
            marginTop:'4px',
            width:'90%'
          }}>Close Sidebar</button>
        </div>
      </div>
    </>
  );
};


export default SideDrawer;
