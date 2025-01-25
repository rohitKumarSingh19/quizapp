const express = require('express');
const {
  signupUser,
  loginUser,
  getAllUsers, // Import the getAllUsers function
} = require('../controllers/userController');

const router = express.Router();

// Route to handle user signup
router.post('/signup', signupUser);

// Route to handle user login
router.post('/login', loginUser);

// Route to fetch all users
router.get('/users', getAllUsers);

module.exports = router;
