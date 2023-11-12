const axios = require('axios');
const qs = require('qs');
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const { getPatientByKode } = require('../controllers/patientController');
const {haversineDistance } = require('../utils/distanceUtils');
const { getManeuvers} = require('../utils/responseUtils');
const Patient = require('../models/patientModel.js');
const moment = require('moment');


const getRoute = async (req, res) => {
    const alamatRumah = { name: "Rumah", longi: 112.796075, lat: -7.284068 };
    const alamatTujuan = { name: "FTE", longi: 112.796251, lat: -7.290800 };
    // const { coordinates } = req.query;
    // if (!lastLocation && patientData.alamatRumah) {
    //     lastLocation = {
    //         longitude: patientData.alamatRumah.longi,
    //         latitude: patientData.alamatRumah.lat
    //     };
    // }

    const coordinates = `${alamatRumah.longi},${alamatRumah.lat};${alamatTujuan.longi},${alamatTujuan.lat}`;
    if (!coordinates || typeof coordinates !== 'string') {
        return res.status(400).json({
            status : 400,
            success: false,
            error: "Invalid coordinates provided, must be a string in the format 'lon1,lat1;lon2,lat2"
        });
    }

    try {
        const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?alternatives=true&continue_straight=true&geometries=geojson&language=id&overview=simplified&steps=true&access_token=${ACCESS_TOKEN}`);
        const data = getManeuvers(response.data.routes);
        // const data = response.data.routes[0].legs[0].steps[0].maneuver;
        return res.status(200).json({
            status : 200,
            success: true,
            data: data
        });
    } catch (error) {
        return res.status(500).json({ 
            status : 500,
            success: false,
            error: "Error fetching route."
        });
    }
};
let lastLocation = null;
let lastKode = null;
//POST from hardware
const liveLocation = async (req, res) => {
    const { longitude, latitude, kode } = req.body;

    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({
            status: 400,
            success: false,
            error: "Invalid coordinates provided, must include 'latitude' and 'longitude' as numbers."
        });
    }

    const patientData = await getPatientByKode(kode);
    if (!patientData || !patientData.alamatTujuan) {
        return res.status(404).json({
            status: 404,
            success: false,
            error: "Patient data not found or destination address missing."
        });
    }

    lastLocation = { longitude, latitude };
    lastKode = kode;
    location = req.body;

    const formattedTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    return res.status(200).json({
        status: 200,
        success: true,
        message: "Location updated successfully.",
        timestamp: formattedTimestamp
    });
};

//GET from hardware, for app
const getLocation = async (req, res) => {
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

    const formattedTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    let message = "";

    if (distanceToDestination <= 0.05) {
        message = "Arrived at destination.";
    } else if (distanceFromStart <= 0.05) {
        message = "At home";
    } else {
        message = "On the way to destination.";
    }

    await saveLocationHistoryToDatabase(kode, message, lastLocation, formattedTimestamp);

    return res.status(200).json({
        status: 200,
        success: true,
        message,
        location: lastLocation,
        timestamp: formattedTimestamp
    });
};

const saveLocationHistoryToDatabase = async (kode, message, lastLocation, timestamp) => {
    try {
        const updatedPatient = await Patient.findOneAndUpdate(
            { kode: kode },
            {
                $push: {
                    locationHistory: {
                        message,
                        location: lastLocation,
                        timestamp
                    }
                }
            },
            { new: true }
        );

        if (!updatedPatient) {
            console.error('Failed to update patient with location history');
        }
    } catch (error) {
        console.error('An error occurred while saving location history:', error);
    }
};




module.exports = {
    getRoute, liveLocation, getLocation
};