require('dotenv').config();
const mongoose = require('mongoose');
// const JWT_SECRET = process.env.JWT_SECRET;
const DB_URI = process.env.DB_URI; 
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


module.exports = { mongoose, db, jwtSecret: process.env.JWT_SECRET };
