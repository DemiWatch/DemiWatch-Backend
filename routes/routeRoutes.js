const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/getRoute', routeController.getRoute);

module.exports = router;
