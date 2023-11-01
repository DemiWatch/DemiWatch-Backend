const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config.js');

const register = async (req, res) => {
  //name dihapus
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400, 
        success: false,
        error: 'Invalid email format' 
      });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: 'Email is already registered'
        });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'User registered successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Failed to register user'
      });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: 'Invalid credentials, email not found'
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign({ email: user.email }, jwtSecret, {
        expiresIn: '1h'
      });
      return res.status(200).json({
        status: 200,
        success: true,
        token: token 
      });
    } else {
      return res.status(401).json({
        status: 401, 
        success: false,
        error: 'Invalid credentials, incorrect password'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: 'Failed to log in'
    });
  }
};


module.exports = {
  register,
  login
};
