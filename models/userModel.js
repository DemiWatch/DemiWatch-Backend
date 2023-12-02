const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: String,
  email: String,
  password: String,
  telepon: String,
  status: String,
  radius: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
