import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        console.log('Fetched Leaderboard Data:', data); // Debug log
        setLeaderboard(data); // Set fetched data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to fetch leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: "url('https://wallpapercave.com/wp/wp2768598.jpg') no-repeat center center/cover",
      color: 'white',
      fontFamily: "'Press Start 2P', cursive",
    },
    leaderboardBox: {
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
    list: {
      listStyleType: 'none',
      padding: '0',
      fontSize: '18px',
    },
    listItem: {
      marginBottom: '10px',
      textShadow: '0 0 5px #00ffc3',
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
  };

  if (loading) {
    return <div style={styles.loadingText}>Loading leaderboard...</div>;
  }

  if (error) {
    return <div style={styles.errorText}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.leaderboardBox}>
        <h1 style={styles.heading}>Leaderboard</h1>
        <ul style={styles.list}>
          {leaderboard.length > 0 ? (
            leaderboard.map((player, index) => (
              <li key={index} style={styles.listItem}>
                {index + 1}. {player.name}: {player.score} Points
              </li>
            ))
          ) : (
            <li style={styles.listItem}>No players yet!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
