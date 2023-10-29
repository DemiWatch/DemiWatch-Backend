const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/getRoute', routeController.getRoute);
router.post('/liveLocation', routeController.liveLocation);
router.get('/getLocation', routeController.getLocation);

module.exports = router;
