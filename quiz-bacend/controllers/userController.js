const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variabless
// Helper function to validate password
const isStrongPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};
// Controller to fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, excluding passwords for security
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Signup Function
exports.signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login Function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email+" "+password);
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    console.log(isPasswordValid+"nbtrlsld;fkg");
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    //ensure we are geretting jwt_secret from .env file
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Internal Server Error. Please contact support.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    // Send response with token
    res.status(200).json({
      message: 'Login successful!',
      user: { id: existingUser._id, email: existingUser.email },
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
