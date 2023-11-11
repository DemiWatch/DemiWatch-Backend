const express = require('express');
const router = express.Router();
const {history} = require('../controllers/historyController');
const authenticate = require('../middleware/authMiddleware')

router.get('/history/:kode', authenticate, history);

module.exports = router;
