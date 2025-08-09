
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import './login.css';
// import logo from './assets/logo.png';


function Login() {
  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState(localStorage.getItem('savedPassword') || '');
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/login', {
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (remember) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  // Wallet connect logic
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  // Connect to wallet (MetaMask/Trust Wallet)
  const connectWallet = async (showPopup = true) => {
    if (!window.ethereum) {
      setWalletError('No wallet found. Please install MetaMask or Trust Wallet.');
      return;
    }
    try {
      // Request BNB Smart Chain (mainnet)
      const bnbChainId = '0x38';
      if (window.ethereum.networkVersion !== '56' && window.ethereum.chainId !== bnbChainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: bnbChainId }],
        });
      }
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletConnected(true);
      setWalletAddress(accounts[0]);
      setWalletError('');
      // Save wallet address for withdrawal page
      localStorage.setItem('savedWalletAddress', accounts[0]);
    } catch (err) {
      if (showPopup) setWalletError('Wallet connection failed.');
      setWalletConnected(false);
    }
  };

  // Auto-connect on page load
  useEffect(() => {
    if (!walletConnected && window.ethereum) {
      connectWallet(false);
    }
    // Listen for account/network changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          localStorage.setItem('savedWalletAddress', accounts[0]);
        } else {
          setWalletConnected(false);
          setWalletAddress('');
          localStorage.removeItem('savedWalletAddress');
        }
      };
      const handleChainChanged = (chainId) => {
        if (chainId !== '0x38') {
          setWalletError('Please switch to BNB Smart Chain.');
          setWalletConnected(false);
        } else {
          setWalletError('');
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletConnected]);

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Star Traders violet logo and brand name */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24}}>
          <img src={require('./assets/logo.png')} alt="Star Traders Logo" style={{height:'64px',marginBottom:'12px'}} />
          <div style={{color:'#8c4be7',fontWeight:700,fontSize:'2rem',letterSpacing:'1px',marginBottom:'8px'}}>STAR TRADERS</div>
        </div>
        <div style={{ color: '#6c4ccf', fontWeight: 600, marginBottom: 18 }}>SIGN IN</div>
        <input
          className="login-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            id="rememberMe"
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button className="login-btn" onClick={handleLogin}>Sign In</button>
        <a href="/forgot-password" className="login-forgot">
          <span role="img" aria-label="lock">🔒</span> Forgot your password?
        </a>
        <div className="login-divider">Sign in with Connect Wallet</div>
        <button className="login-wallet-btn" onClick={() => connectWallet(true)} disabled={walletConnected}>
          <span role="img" aria-label="wallet">💳</span> {walletConnected ? `Connected${walletAddress ? ' (' + walletAddress.slice(0,6) + '...' + walletAddress.slice(-4) + ')' : ''}` : 'Connect Wallet'}
        </button>
        {walletError && <div style={{color:'red',marginTop:8}}>{walletError}</div>}
        <div className="login-signup">
          Don't have an account?
          <a href="/register" className="login-signup-btn"> Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
