const Leaderboard = require('../models/LeaderBoard');

// Fetch leaderboard data
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ score: -1 }); // Sort by score descending
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard data' });
  }
};

// Add a new leaderboard entry
const addLeaderboardEntry = async (req, res) => {
  const { name, score } = req.body;

  if (!name || score === undefined) {
    return res.status(400).json({ message: 'Name and score are required' });
  }

  try {
    const newEntry = new Leaderboard({ name, score });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    res.status(500).json({ message: 'Failed to add leaderboard entry' });
  }
};

module.exports = { getLeaderboard, addLeaderboardEntry };
