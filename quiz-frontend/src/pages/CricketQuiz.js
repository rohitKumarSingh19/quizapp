import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from './Image'; // Assumes this is a valid image rendering component
import logo from './Logo.jpg';
import axios from 'axios';

const CricketQuiz = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(5); // Start timer at 5 seconds
  const [loading, setLoading] = useState(false); // Loading state for submitting the score
  const navigate = useNavigate(); // Hook for navigation

  const questions = [
    { question: 'Who won the 2019 Cricket World Cup?', options: ['England', 'India', 'Australia'], answer: 'England' },
    { question: 'Who holds the record for most runs in ODIs?', options: ['Sachin Tendulkar', 'Virat Kohli', 'Ricky Ponting'], answer: 'Sachin Tendulkar' },
    { question: 'Which player is known as the "Master Blaster" in cricket?', options: ['Shane Warne', 'Sachin Tendulkar', 'Brian Lara'], answer: 'Sachin Tendulkar' },
  ];

  useEffect(() => {
    if (currentIndex >= questions.length) {
      setShowScore(true); // Show score when all questions are answered
      return;
    }

    if (timer === 0) {
      setCurrentIndex((prevIndex) => prevIndex + 1); // Move to the next question
      setTimer(5); // Reset timer for the next question
    }

    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1); // Decrease the timer every second
      }
    }, 1000);

    // Cleanup interval when the timer changes
    return () => clearInterval(timerInterval);
  }, [timer, currentIndex, questions.length]);

  const handleAnswer = (selectedAnswer, correctAnswer) => {
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setCurrentIndex((prevIndex) => prevIndex + 1); // Move to the next question
    setTimer(5); // Reset timer
  };

  const handleGoLeaderboard = async () => {
    const playerName = prompt('Enter your name:');
    if (playerName) {
      setLoading(true); // Start loading
      try {
        // Send the player data to the backend
        await axios.post('http://localhost:5000/api/leaderboard', {
          name: playerName,
          score: score,
        });
        alert('Score submitted to leaderboard!');
        if (onComplete) {
          onComplete({ name: playerName, score }); // Notify parent about the completed quiz
        }
        navigate('/leaderboard'); // Navigate to the leaderboard
      } catch (error) {
        console.error('Failed to submit score:', error);
        alert('Failed to submit score. Please try again.');
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white',
      fontFamily: "'Press Start 2P', cursive",
      textAlign: 'center',
    },
    questionContainer: {
      margin: '20px 0',
      padding: '20px',
      border: '2px solid #00ffc3',
      borderRadius: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      boxShadow: '0 10px 30px rgba(0, 255, 255, 0.6)',
      color: '#00ffc3',
    },
    button: {
      padding: '10px 20px',
      margin: '10px',
      backgroundColor: '#00ffc3',
      color: '#000',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      textTransform: 'uppercase',
      textShadow: '0 0 10px #000',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#00bfa6',
      transform: 'scale(1.1)',
      boxShadow: '0 0 20px #00ffc3',
    },
    scoreContainer: {
      textAlign: 'center',
    },
    scoreText: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#00ffc3',
      textShadow: '0 0 10px #00ffc3',
    },
    loadingText: {
      color: '#00ffc3',
      marginTop: '10px',
      fontWeight: 'bold',
    },
  };

  if (showScore) {
    return (
      <div style={styles.container}>
        <div style={styles.scoreContainer}>
          <h1 style={styles.scoreText}>Cricket Quiz Finished</h1>
          <h2 style={styles.scoreText}>Your Score: {score} / {questions.length}</h2>
          {loading && <p style={styles.loadingText}>Submitting score...</p>}
          <button
            style={styles.button}
            onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, styles.button)}
            onClick={handleGoLeaderboard}
            disabled={loading} // Disable button while loading
          >
            Go to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.questionContainer}>
        <Image image={logo} />
        <h1 style={styles.scoreText}>Cricket Quiz</h1>
        <p>Time Remaining: {timer}s</p>
        <h2>Question {currentIndex + 1}</h2>
        <p>{questions[currentIndex]?.question}</p>
        {questions[currentIndex]?.options.map((option, i) => (
          <button
            key={i}
            style={styles.button}
            onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseOut={(e) => Object.assign(e.target.style, styles.button)}
            onClick={() => handleAnswer(option, questions[currentIndex].answer)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CricketQuiz;
