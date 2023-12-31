const axios = require('axios');
const qs = require('qs');
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const { getPatientByKode } = require('../controllers/patientController');
const { haversineDistance } = require('../utils/distanceUtils');
const { getManeuvers } = require('../utils/responseUtils');
const Patient = require('../models/patientModel.js');
const History = require('../models/historyModel.js');
const moment = require('moment-timezone');

const getRoute = async (req, res) => {
  const { coordinates } = req.query;
  if (!coordinates || typeof coordinates !== 'string') {
    return res.status(400).json({
      status: 400,
      success: false,
      error: "Invalid coordinates provided, must be a string in the format 'lon1,lat1;lon2,lat2'",
    });
  }

  try {
    const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?alternatives=true&continue_straight=true&geometries=geojson&language=id&overview=simplified&steps=true&access_token=${ACCESS_TOKEN}`);
    const data = getManeuvers(response.data.routes);
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Successfully get route',
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: "Error fetching route.",
    });
  }
};

let lastLocation = null;
let lastKode = null;
let emergencyState = false;

// POST from hardware
const liveLocation = async (req, res) => {
  const { longitude, latitude, kode, emergency } = req.body;
  const parsedLongitude = parseFloat(longitude);
  const parsedLatitude = parseFloat(latitude);
  
  if (!parsedLatitude || !parsedLongitude || typeof parsedLatitude !== 'number' || typeof parsedLongitude !== 'number') {
    return res.status(400).json({
      status: 400,
      success: false,
      error: "Invalid coordinates provided, must include 'latitude' and 'longitude' as numbers.",
    });
  }

  try {
    const patientData = await getPatientByKode(kode);
    if (!patientData || !patientData.alamatTujuan) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: "Patient data not found or destination address missing.",
      });
    }

    lastLocation = { longitude: parsedLongitude, latitude: parsedLatitude };
    lastKode = kode;

    const destinationCoords = {
      longitude: patientData.alamatTujuan.longi,
      latitude: patientData.alamatTujuan.lat,
    };

    const distanceToDestination = haversineDistance(lastLocation.longitude, lastLocation.latitude, destinationCoords.longitude, destinationCoords.latitude);

    const distanceFromStart = haversineDistance(lastLocation.longitude, lastLocation.latitude, patientData.alamatRumah.longi, patientData.alamatRumah.lat);

    let message = "";
    emergencyState = emergency === "true";

    if (emergencyState) {
      message = "Emergency button pressed.";
    } else if (distanceToDestination <= 0.05) {
      message = "Arrived at destination.";
    } else if (distanceFromStart <= 0.05) {
      message = "At home";
    } else {
      message = "On the way to destination.";
    }

    const formattedTimestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    let historyRecord = await History.findOne({ kode });

    if (!historyRecord) {
      historyRecord = await History.create({
        kode,
        locationHistory: [{
          message,
          alamatRumah: patientData.alamatRumah,
          alamatTujuan: patientData.alamatTujuan,
          location: lastLocation,
          timestamp: formattedTimestamp,
          emergency: emergencyState,
        }]
      })
    } else {
      historyRecord = await History.findOneAndUpdate(
        { kode: kode },
        {
          $push: {
            locationHistory: {
              message,
              alamatRumah: patientData.alamatRumah,
              alamatTujuan: patientData.alamatTujuan,
              location: lastLocation,
              timestamp: formattedTimestamp,
              emergency: emergencyState,
            }
          }
        },
        { new: true }
      );
    }

    return res.status(200).json({
      status: 200,
      success: true,
      kode,
      message,
      emergency: emergencyState ? "true" : "false",
      alamatRumah: patientData.alamatRumah,
      alamatTujuan: patientData.alamatTujuan,
      location: lastLocation,
      timestamp: formattedTimestamp,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while saving history data",
    });
  }
};

// GET from hardware, for app
const getLocation = async (req, res) => {
  const { kode } = req.params;
  const patientData = await getPatientByKode(kode);

  if (!patientData) {
    return res.status(404).json({
      status: 404,
      success: false,
      error: "Patient data not found.",
    });
  }

  try {
    const history = await History.findOne({ kode }).exec();

    if (!history || !history.locationHistory || history.locationHistory.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: "Location data not available.",
      });
    }

    const latestLocation = history.locationHistory[history.locationHistory.length - 1];
    const destinationCoords = {
      longitude: patientData.alamatTujuan.longi,
      latitude: patientData.alamatTujuan.lat,
    };

    const distanceToDestination = haversineDistance(latestLocation.location.longitude, latestLocation.location.latitude, destinationCoords.longitude, destinationCoords.latitude);

    const distanceFromStart = haversineDistance(latestLocation.location.longitude, latestLocation.location.latitude, patientData.alamatRumah.longi, patientData.alamatRumah.lat);

    const formattedTimestamp = moment(latestLocation.timestamp).format('YYYY-MM-DD HH:mm:ss');
    let message = "";

    if (emergencyState) {
      message = "Emergency button pressed.";
    } else if (distanceToDestination <= 0.05) {
      message = "Arrived at destination.";
    } else if (distanceFromStart <= 0.05) {
      message = "At home";
    } else {
      message = "On the way to destination.";
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message,
      emergency: emergencyState ? "true" : "false",
      location: latestLocation.location,
      timestamp: formattedTimestamp,
    });
  } catch {
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching location data.",
    });
  }
};

module.exports = {
  getRoute,
  liveLocation,
  getLocation
};
