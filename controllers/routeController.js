const API_KEY = process.env.OPENROUTESERVICE_API_KEY;
const axios = require('axios');

const getRoute = async (req, res) => {
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length !== 2 || coordinates[0].length !== 2 || coordinates[1].length !== 2) {
        return res.status(400).json({ 
            status : 400,
            success: false,
            error: "Invalid coordinates provided.",
            details: "Coordinates must be an array of two pairs of latitude and longitude."
        });
    }

    try {
        const response = await axios.post('https://api.openrouteservice.org/v2/directions/foot-walking', {
            coordinates: coordinates
        },{
            headers: {
                'Authorization': API_KEY,
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
            }
        });
        
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
