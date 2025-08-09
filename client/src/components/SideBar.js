
import React, { useState } from 'react';
import { FaExchangeAlt, FaMoneyBill, FaUsers, FaChartLine, FaGift, FaBars } from 'react-icons/fa';
import logo from '../assets/logo.png';
// import './Sidebar.css';

const menuItems = [
  { label: 'Deposit', icon: <FaExchangeAlt />, route: '/deposit' },
  { label: 'Withdrawal', icon: <FaMoneyBill />, route: '/withdrawal' },
  { label: 'Team', icon: <FaUsers />, route: '/team' },
  { label: 'Trading Income', icon: <FaChartLine />, route: '/trading-income' },
  { label: 'Direct Referral Income', icon: <FaUsers />, route: '/direct-referral-income' },
  { label: 'Referral Income on Trading Income', icon: <FaExchangeAlt />, route: '/referral-on-trading' },
  { label: 'Reward Income', icon: <FaGift />, route: '/reward-income' },
  { label: 'Salary Income', icon: <FaMoneyBill />, route: '/salary-income' }
];

const Sidebar = ({ open, setOpen, position }) => {
  // Sidebar left/right position
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: position === 'left' ? 0 : 'unset',
    right: position === 'right' ? 0 : 'unset',
    width: '260px',
    height: '100vh',
    background: '#fff',
    boxShadow: '2px 0 8px rgba(140,75,231,0.08)',
    zIndex: 999,
    transform: open
      ? 'translateX(0)'
      : position === 'left'
      ? 'translateX(-100%)'
      : 'translateX(100%)',
    transition: 'transform 0.3s',
    borderRight: '4px solid #8c4be7',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
  };

  const handleNav = (route) => {
    window.location.href = route;
    setOpen(false);
  };

  return (
    <>
      <nav style={sidebarStyle} className="sidebar-main">
        <div className="sidebar-logo" style={{display:'flex',alignItems:'center',padding:'24px 18px 12px 18px'}}>
          <img src={logo} alt="Star Traders Logo" style={{height:'40px',marginRight:'12px'}} />
          <span className="sidebar-brand" style={{color:'#8c4be7',fontWeight:700,fontSize:'1.3rem',letterSpacing:'1px'}}>STAR TRADERS</span>
        </div>
        <div className="sidebar-menu" style={{flex:1,padding:'12px 0'}}>
          {menuItems.map((item, idx) => (
            <div key={idx} className="sidebar-menu-item" style={{display:'flex',alignItems:'center',padding:'12px 24px',cursor:'pointer',color:'#444',fontWeight:600,borderBottom:'1px solid #f2f2f2'}} onClick={() => handleNav(item.route)}>
              <span className="sidebar-icon" style={{color:'#8c4be7',fontSize:'1.2rem',marginRight:'12px'}}>{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Logout button above Close Sidebar */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.replace('https://startraders-frontend.onrender.com');
            setOpen(false);
          }}
          style={{
            margin:'18px',
            background:'#8c4be7',
            color:'#fff',
            border:'none',
            borderRadius:'8px',
            padding:'12px 0',
            fontWeight:700,
            fontSize:'1.1rem',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'10px',
            marginBottom:'8px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" style={{marginRight:'8px',fill:'#fff'}}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
          Logout
        </button>
        <button onClick={() => setOpen(false)} style={{margin:'18px',background:'#8c4be7',color:'#fff',border:'none',borderRadius:'8px',padding:'10px 0',fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>Close Sidebar</button>
      </nav>
      {/* Overlay for mobile */}
      {open && <div className="sidebar-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.08)',zIndex:998}} onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
