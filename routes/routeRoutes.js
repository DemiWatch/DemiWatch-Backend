const express = require('express');
const router = express.Router();
const {getRoute, liveLocation, getLocation} = require('../controllers/routeController');
const authenticate = require('../middleware/authMiddleware');

router.get('/getRoute', getRoute);
router.post('/liveLocation', liveLocation);
router.get('/getLocation/:kode',authenticate, getLocation);

module.exports = router;
