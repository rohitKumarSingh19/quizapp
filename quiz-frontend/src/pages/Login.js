import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic input validation
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { userId, token } = response.data;

        // Save user details in localStorage
        localStorage.setItem('userId', JSON.stringify(userId));
        localStorage.setItem('authToken', token);

        // Notify parent component and redirect
        onLogin(userId);
        navigate('/quiz/cricket');
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      console.error('Login error:', err);

      // Error handling
      if (err.response) {
        setError(err.response.data?.message || 'Invalid email or password.');
      } else if (err.request) {
        setError('Unable to connect to the server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: "url('https://wallpaperaccess.com/full/329583.jpg') no-repeat center center/cover",
      color: 'white',
      fontFamily: "'Press Start 2P', cursive",
    },
    formContainer: {
      width: '400px',
      padding: '40px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.6)',
      borderRadius: '15px',
      textAlign: 'center',
      color: '#00ffc3',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#00ffc3',
      textShadow: '0 0 10px #00ffc3, 0 0 20px #00ffc3',
    },
    inputField: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: '2px solid #00ffc3',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'transparent',
      color: '#00ffc3',
      fontFamily: "'Press Start 2P', cursive",
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#00ffc3',
      color: '#000',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      textTransform: 'uppercase',
    },
    errorText: {
      color: '#ff003c',
      marginTop: '10px',
      fontWeight: 'bold',
      textShadow: '0 0 10px #ff003c',
    },
    loadingText: {
      color: '#00ffc3',
      marginTop: '10px',
      fontWeight: 'bold',
    },
    signupText: {
      marginTop: '20px',
      fontSize: '12px',
      color: '#00ffc3',
    },
    signupLink: {
      color: '#00ffc3',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Quiz Master</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.inputField}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputField}
            required
          />
          {error && <p style={styles.errorText}>{error}</p>}
          {loading && <p style={styles.loadingText}>Logging in...</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            Login
          </button>
        </form>
        <p style={styles.signupText}>
          New here?{' '}
          <span style={styles.signupLink} onClick={() => navigate('/signup')}>
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
