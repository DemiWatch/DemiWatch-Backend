const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { db } = require('./config/config.js'); // Menggunakan hanya db dari config
const authRoutes = require('./routes/authRoutes.js');
const app = express();

const DB_URI = process.env.DB_URI; 
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
module.exports = app
