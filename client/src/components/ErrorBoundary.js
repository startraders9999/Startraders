import React from 'react';
import axios from 'axios';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#ff4444', 
          color: 'white', 
          textAlign: 'center',
          margin: '20px'
        }}>
          <h2>⚠️ Something went wrong</h2>
          <p>Error: {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'white',
              color: '#ff4444',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// API Status Checker Component - Temporarily disabled to avoid CORS issues
export const APIStatusChecker = () => {
  return null; // Temporarily disabled
  
  // Original code commented out to avoid CORS issues during initial load
  /*
  const [status, setStatus] = React.useState('checking');
  const [details, setDetails] = React.useState(null);

  React.useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await axios.get('https://startraders-fullstack-9ayr.onrender.com/api/ping');
        setStatus('connected');
        setDetails(response.data);
      } catch (error) {
        setStatus('error');
        setDetails({ error: error.message });
        console.error('API Connection Error:', error);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const statusStyles = {
    checking: { background: '#ffa500', color: 'white' },
    connected: { background: '#4CAF50', color: 'white' },
    error: { background: '#f44336', color: 'white' }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      ...statusStyles[status]
    }}>
      API: {status} {status === 'connected' && '✅'}
      {status === 'error' && '❌'}
      {status === 'checking' && '⏳'}
    </div>
  );
  */
};

export default ErrorBoundary;
