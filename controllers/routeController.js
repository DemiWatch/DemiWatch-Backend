const axios = require('axios');
const qs = require('qs');
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const { getPatientByKode } = require('../controllers/patientController');
const {haversineDistance } = require('../utils/distanceUtils');

const getRoute = async (req, res) => {
    const alamatRumah = { longi: 112.796075, lat: -7.284068 };
    const alamatTujuan = { longi: 112.796251, lat: -7.290800 };
    // const { coordinates } = req.query;
    const coordinates = `${alamatRumah.longi},${alamatRumah.lat};${alamatTujuan.longi},${alamatTujuan.lat}`;
    if (!coordinates || typeof coordinates !== 'string') {
        return res.status(400).json({
            status : 400,
            success: false,
            error: "Invalid coordinates provided.",
            details: "Coordinates must be a string in the format 'lon1,lat1;lon2,lat2'."
        });
    }

    try {
        const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?alternatives=true&continue_straight=true&geometries=geojson&language=id&overview=simplified&steps=true&access_token=${ACCESS_TOKEN}`);
        
        return res.status(200).json({
            status : 200,
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({ 
            status : 500,
            success: false,
            error: "Error fetching route.", 
            details: error.message 
        });
    }
};

const liveLocation = async (req, res) => {
    const { longitude, latitude, kode } = req.body;

    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({
            status: 400,
            success: false,
            error: "Invalid coordinates provided.",
            details: "Coordinates must include 'latitude' and 'longitude' as numbers."
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
    lastRequestBody = req.body;

    return res.status(200).json({
        status: 200,
        success: true,
        message: "Location updated successfully."
    });
};

const getLocation = async (req, res) => {
    if (lastLocation && lastKode) {
        const patientData = await getPatientByKode(lastKode);
        if (!patientData || !patientData.alamatTujuan) {
            return res.status(404).json({
                status: 404,
                success: false,
                error: "Patient data not found or destination address missing."
            });
        }

        const destinationCoords = {
            longitude: patientData.alamatTujuan.longi, 
            latitude: patientData.alamatTujuan.lat 
        };

        const distanceToDestination = haversineDistance(lastLocation.longitude, lastLocation.latitude, destinationCoords.longitude, destinationCoords.latitude);
        console.log("Sent coordinates:", lastLocation.longitude, lastLocation.latitude);
        console.log("Destination coordinates:", destinationCoords.longitude, destinationCoords.latitude);
        console.log("Calculated distance:", distanceToDestination);

        if (distanceToDestination <= 0.05) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Arrived at destination.",
                lastRequestBody : lastRequestBody
            });
        } else {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "On the way to destination.",
                lastRequestBody : lastRequestBody
            });
        }       
    } else {
        return res.status(404).json({
            status: 404,
            success: false,
            error: "Location data not available.",
            details: "No location data found."
        });
    }
};


module.exports = {
    getRoute, liveLocation, getLocation
};
