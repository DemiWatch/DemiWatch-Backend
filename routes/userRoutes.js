const express = require('express');
const router = express.Router();
const { addUser, updateUser, getUser } = require('../controllers/userController.js');
const authenticate = require('../middleware/authMiddleware.js');

router.put('/addUser/:id',authenticate, addUser);
router.put('/updateUser/:id',authenticate, updateUser);
router.get('/getUser/:id', authenticate, getUser);

module.exports = router;
