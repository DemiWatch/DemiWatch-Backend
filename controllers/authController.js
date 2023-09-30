const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config.js');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 400, error: 'Invalid email format' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
            return res.status(400).json({ status: 400, error: 'Email is already registered' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      return res.status(200).json({ status: 200, success: true, message: 'User registered successfully' });
    } catch (error) {
      return res.status(500).json({ status: 500, error: `Failed to register user: ${error.message}` });
    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 401, error: 'Invalid credentials', detail: 'Email not found' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign({ email: user.email, name: user.name }, jwtSecret, {
        expiresIn: '1h'
      });
      return res.status(200).json({ status: 200, success: true, name: user.name, token: token });
    } else {
      return res.status(401).json({ status: 401, error: 'Invalid credentials', detail: 'Incorrect password' });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, error: `Failed to log in: ${error.message}` });
  }
};


module.exports = {
  register,
  login
};
