const express = require('express');
const router = express.Router();
const { tambahPatient, getPatient, updatePatient } = require('../controllers/patientController.js');

router.post('/addPatient', tambahPatient);
router.get('/getPatient/:id', getPatient);
router.put('/editPatient/:id', updatePatient)

module.exports = router;
