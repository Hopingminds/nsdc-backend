// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
    // Get token from the header
    const authHeader = req.header('Authorization');

    // Check if no token
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded, 'token');

        // Attach the userId to the request object
        req.userId = decoded.userId;
        console.log(decoded.userId, 'decoded.userId');

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
