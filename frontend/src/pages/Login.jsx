import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(
      user =>
        user.email === emailOrUsername &&
        user.password === password
    );

    if (!existingUser) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Save login token
    localStorage.setItem("currentUser", JSON.stringify(existingUser));

    if (onLoginSuccess) {
      onLoginSuccess();
    }

  } catch (err) {
    setError("Login failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email / Username</label>
            <input
              id="emailOrUsername"
              type="text"
              placeholder="Enter your email or username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account? 
        <Link to="/register"> Register here</Link>
        </p>
      </div>
    </div>
  );
}