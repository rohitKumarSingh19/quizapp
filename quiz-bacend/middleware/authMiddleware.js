const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Validate Authorization header format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token format.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. No token provided.' });
  }

  // Ensure JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
   // console.error('JWT_SECRET is not defined in environment variables.');
    return res.status(500).json({ message: 'Internal Server Error. Please contact support.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request
    next(); // Proceed to the next middleware/route
  } catch (err) {
   // console.error('Token verification error:', err.message); // Log error for debugging
    return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
  }
};
