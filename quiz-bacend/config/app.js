const express = require('express');
const cors = require('cors');
const userRoutes = require('../routes/userRoutes');
const leaderboardRoutes = require('../routes/leaderboardRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

module.exports = app;
