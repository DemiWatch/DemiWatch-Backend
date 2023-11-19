const Patient = require('../models/patientModel.js');
const { calculateTimeDifference } = require('../utils/calculateTimeDifference.js');
const moment = require('moment-timezone');

const history = async (req, res) => {
  const { kode } = req.params;
  try {
    const patient = await Patient.findOne({ kode });
    if (!patient) {
      // return res.status(404).send('Patient not found');
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Patient not found'
      });
    }

    const totalDurations = calculateTimeDifference(patient.locationHistory);



    // Format the response
    // const historyResponse = patient.locationHistory.map(entry => ({
    //   message: entry.message,
    //   location: entry.location,
    //   timestamp: moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
    // }));

    return res.status(200).json({
      status: 200,
      success: true,
      nama: patient.nama,
      jenisPenyakit: patient.jenisPenyakit,
      alamatRumah: patient.alamatRumah,
      alamatTujuan: patient.alamatTujuan,
      tanggal: moment(patient.timestamp).tz('Asia/Jakarta').format('YYYY-MM-DD'),
      // history: historyResponse,
      durations: totalDurations
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  history
};

