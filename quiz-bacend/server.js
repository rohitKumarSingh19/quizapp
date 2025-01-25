const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: 'http://localhost:3001' })); // Allow requests from frontend

// Routes
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if DB connection fails
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require('express');
// const User = require('./models/User'); // Import your User model
// const app = express();

// app.use(express.json());

// app.post('/api/users/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) { // Use password hashing for real applications
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     res.json({ success: true, userId: user._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'An error occurred. Please try again later.' });
//   }
// });
