const Patient = require('../models/patientModel.js');
const { calculateTimeDifference } = require('../utils/calculateTimeDifference.js');
const moment = require('moment-timezone');

const history = async (req, res) => {
  const { kode } = req.params;
  try {
    const patient = await Patient.findOne({ kode });
    if (!patient) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Patient not found'
      });
    }
    const calculateTimeDifference = (locationHistory) => {
      const durations = [];
      let segmentStart = null;
      // const liveLocation = lastLocation;
      locationHistory.forEach((entry, index) => {
        if (entry.message === "At home") {
          segmentStart = moment(entry.timestamp)
        } else if (entry.message === "Arrived at destination." && segmentStart) {
          const endMoment = moment(entry.timestamp);
          const duration = moment.duration(endMoment.diff(segmentStart));
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const seconds = duration.seconds();
          let condition = "aman";
          if (duration.asMinutes()>60) {
            condition = "kendala";
          }
          durations.push({
            condition,
            duration: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
            start: segmentStart.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            end: endMoment.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
          });
          segmentStart = null;
        }
      });
    
      return durations;
    };
    const totalDurations = calculateTimeDifference(patient.locationHistory);

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Successfully get history',
      id: patient._id,
      nama: patient.nama,
      jenisPenyakit: patient.jenisPenyakit,
      // alamatRumah: patient.alamatRumah,
      // alamatTujuan: patient.alamatTujuan,
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

