require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

const DB_URI = process.env.DB_URI; 
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = { mongoose, db, jwtSecret: secretKey };
