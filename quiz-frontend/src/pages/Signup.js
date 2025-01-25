import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../pages/Logo.jpg'; // Adjust path to your logo file

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Frontend validation
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(password)) {
      setError(
        'Password must be at least 6 characters long and include uppercase, lowercase, numbers, and special characters.'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        email,
        password,
      });

      if (response.status === 201) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response) {
        setError(err.response.data?.message || 'Signup failed. Please try again.');
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
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
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
    logo: {
      width: '100px',
      height: '100px',
      margin: '0 auto 20px',
      borderRadius: '50%',
      border: '4px solid #00ffc3',
      boxShadow: '0 0 20px #00ffc3',
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
        <img src={logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.heading}>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.inputField}
            aria-label="Email"
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputField}
            aria-label="Password"
            autoComplete="new-password"
            required
          />
          {error && <p style={styles.errorText}>{error}</p>}
          {loading && <p style={styles.loadingText}>Signing up...</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
        <p style={styles.signupText}>
          Already have an account?{' '}
          <span style={styles.signupLink} onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
