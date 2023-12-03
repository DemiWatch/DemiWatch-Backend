const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config.js');
const util = require('util');
const dbConfig = require('../config/config.js');
  
const authenticate = (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    if (!token) {
        return res.status(401).json({
            status: 401,
            success: false,
            error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            status: 400, 
            success: false,
            error: 'Invalid token.' });
    }
};

module.exports = authenticate;
