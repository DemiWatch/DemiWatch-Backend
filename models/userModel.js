const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: String,
  email: String,
  password: String,
  // img:{
  //   data:Buffer,
  //   contentType : String
  // },
  telepon: String,
  status: String,
  radius: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
