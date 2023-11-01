const express = require('express');
const router = express.Router();
const { addUser, getUser } = require('../controllers/userController.js');
const authenticate = require('../middleware/authMiddleware.js');

router.put('/addUser/:id', addUser);
router.get('/getUser/:id', getUser);

module.exports = router;
