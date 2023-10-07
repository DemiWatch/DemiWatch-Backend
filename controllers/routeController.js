const axios = require('axios');
const qs = require('qs');
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

const getRoute = async (req, res) => {
    const { coordinates } = req.query;

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

module.exports = {
    getRoute
};
