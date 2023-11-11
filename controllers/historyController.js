const { getPatientByKode } = require('../controllers/patientController');
const { haversineDistance } = require('../utils/distanceUtils');
const moment = require('moment');

let lastLocation = null;

const history = async (req, res) => {
  const { kode } = req.params;
  const patientData = await getPatientByKode(kode);

  if (!patientData) {
    return res.status(404).json({
      status: 404,
      success: false,
      error: "Patient data not found."
    });
  }

  if (!lastLocation && patientData.alamatRumah) {
    lastLocation = {
      longitude: patientData.alamatRumah.longi,
      latitude: patientData.alamatRumah.lat
    };
  }

  if (!lastLocation) {
    return res.status(404).json({
      status: 404,
      success: false,
      error: "Location data not available."
    });
  }

  const destinationCoords = {
    longitude: patientData.alamatTujuan.longi,
    latitude: patientData.alamatTujuan.lat
  };

  const distanceToDestination = haversineDistance(lastLocation.longitude, lastLocation.latitude, destinationCoords.longitude, destinationCoords.latitude);

  const distanceFromStart = haversineDistance(lastLocation.longitude, lastLocation.latitude, patientData.alamatRumah.longi, patientData.alamatRumah.lat);

  let status = "";
  let duration = "";
  if (distanceToDestination <= 0.05) {
    status = "Arrived at destination.";
    duration = calculateDuration(patientData.alamatRumah, lastLocation);
  } else if (distanceFromStart <= 0.05) {
    status = "At home.";
    duration = calculateDuration(patientData.alamatRumah, lastLocation);
  } else {
    status = "On the way to destination.";
    duration = calculateDuration(patientData.alamatRumah, lastLocation);
  }

  const currentDate = moment();
  const formattedDate = currentDate.format('DD-MM-YYYY');
  const historyResponse = {
    nama: patientData.nama,
    jenisPenyakit: patientData.jenisPenyakit,
    alamatRumah: patientData.alamatRumah,
    alamatTujuan: patientData.alamatTujuan,
    tanggal: formattedDate,
    status,
    duration
  };

  return res.status(200).json({
    status: 200,
    success: true,
    data: historyResponse
  });
};

// Helper function to calculate duration
const calculateDuration = (startLocation, endLocation) => {
  const start = moment(startLocation);
  const end = moment(endLocation);

  const duration = moment.duration(end.diff(start));
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours} hours and ${minutes} minutes`;
};

module.exports = {
  history
};