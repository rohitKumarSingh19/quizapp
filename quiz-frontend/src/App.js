import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CricketQuiz from './pages/CricketQuiz';
import FootballQuiz from './pages/FootballQuiz';
import Leaderboard from './pages/Leaderboard';

const App = () => {
  const [userId, setUserId] = useState(() => {
    try {
      const storedUserId = localStorage.getItem('userId');
      return storedUserId ? JSON.parse(storedUserId) : null; // Safe parsing
    } catch (err) {
      console.error('Error parsing userId from localStorage:', err);
      return null; // Fallback to null on error
    }
  });

  const [leaderboardData, setLeaderboardData] = useState(() => {
    try {
      const storedData = localStorage.getItem('leaderboardData');
      return storedData ? JSON.parse(storedData) : [];
    } catch (err) {
      console.error('Error parsing leaderboard data from localStorage:', err);
      return []; // Fallback to empty array
    }
  });

  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', JSON.stringify(id)); // Store userId as JSON string
    console.log('User logged in successfully:', id); // Log success
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId'); // Clear userId from localStorage
  };

  const handleQuizCompletion = (playerData) => {
    setLeaderboardData((prevData) => {
      const updatedData = [...prevData, playerData];
      localStorage.setItem('leaderboardData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={userId ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/quiz/cricket"
          element={
            userId ? (
              <CricketQuiz onComplete={handleQuizCompletion} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/quiz/football"
          element={
            userId ? (
              <FootballQuiz onComplete={handleQuizCompletion} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={
            userId ? (
              <Leaderboard players={leaderboardData || []} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
