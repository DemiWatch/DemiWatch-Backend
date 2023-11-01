const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authenticate = require('../middleware/authMiddleware');

router.get('/getRoute', routeController.getRoute);
router.post('/liveLocation',authenticate, routeController.liveLocation);
router.get('/getLocation', routeController.getLocation);

module.exports = router;
