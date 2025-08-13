
import React, { useState } from 'react';
import './admin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Hardcoded admin credentials check
<<<<<<< HEAD
    if (username === 'admin' && password === 'admin') {
=======
    if (username === 'starking' && password === 'star@lokesh') {
>>>>>>> 95fe3dd50bd136357b217773a310a5468855d3dd
      // ✅ Save login token in localStorage
      localStorage.setItem('admin-auth', 'true');

      alert('Admin login successful');
      window.location.href = '/admin/dashboard';
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
