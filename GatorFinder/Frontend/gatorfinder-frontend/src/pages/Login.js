// src/pages/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

const Login = () => {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API (using fetch or axios)
    console.log("Login data:", { usernameEmail, password });
  };

  return (
    <div>
      <header>
        <div className="logo">GatorFinder</div>
      </header>
      <main>
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="usernameEmail">Username or Email</label>
              <input
                type="text"
                id="usernameEmail"
                name="usernameEmail"
                placeholder="Enter your username or email"
                required
                value={usernameEmail}
                onChange={(e) => setUsernameEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
