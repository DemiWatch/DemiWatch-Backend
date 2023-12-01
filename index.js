require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes.js');
const routeRoutes = require('./routes/routeRoutes.js');
const patientRoutes = require('./routes/patientRoutes.js');
const userRoutes = require('./routes/userRoutes.js')
const historyRoutes = require('./routes/historyRoutes.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api', routeRoutes, authRoutes, patientRoutes, userRoutes, historyRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
module.exports = app
