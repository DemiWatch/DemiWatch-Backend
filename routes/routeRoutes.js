const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticate = require('../middleware/authMiddleware');

router.get('/getRoute', routeController.getRoute);
router.post('/liveLocation', routeController.liveLocation);
router.get('/getLocation/:kode',authenticate, routeController.getLocation);

module.exports = router;
