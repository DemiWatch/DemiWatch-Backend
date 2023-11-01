const express = require('express');
const router = express.Router();
const { tambahPatient, getPatient, updatePatient } = require('../controllers/patientController.js');
const authenticate = require('../middleware/authMiddleware.js');

router.post('/addPatient', authenticate, tambahPatient);
router.get('/getPatient/:id',authenticate, getPatient);
router.put('/editPatient/:id',authenticate, updatePatient)

module.exports = router;
