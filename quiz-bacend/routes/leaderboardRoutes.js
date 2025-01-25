const express = require('express');
const { getLeaderboard, addLeaderboardEntry } = require('../controllers/leaderboardController');

const router = express.Router();

// GET: Fetch leaderboard data
router.get('/', getLeaderboard);

// POST: Add a new leaderboard entry
router.post('/', addLeaderboardEntry);

module.exports = router;


