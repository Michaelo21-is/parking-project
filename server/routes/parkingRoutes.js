import express from 'express';
import City from '../models/City.js';
import ParkingLot from '../models/ParkingLot.js';
import ParkingSpot from '../models/ParkingSpot.js';

const router = express.Router();

const mapSpot = spot => ({
    spot: spot.spotNumber,
    floor: spot.floor,
    status: spot.status,
    type: spot.type
});

// Search by district -> cities in that district
router.get('/district', async (req, res) => {
    const district = req.query.name;
    if (!district) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const cities = await City.find({ district }).select('name district');
    res.json(cities.map(c => ({ id: c._id, name: c.name, district: c.district })));
});

// Search by city -> the city's parking lots (with spots)
router.get('/city', async (req, res) => {
    const requestedCityName = req.query.name;
    if (!requestedCityName) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const city = await City.findOne({ name: requestedCityName });
    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }

    const lots = await ParkingLot.find({ city: city._id });
    const responseData = await Promise.all(lots.map(async lot => {
        const spots = await ParkingSpot.find({ parkingLot: lot._id });
        return {
            parkingName: lot.name,
            address: lot.address,
            spotCount: lot.spotCount,
            spots: spots.map(mapSpot)
        };
    }));

    res.json(responseData);
});

// Single parking lot (with spots) within a city
router.get('/lot', async (req, res) => {
    const { cityName, lotName } = req.query;
    if (!cityName || !lotName) {
        return res.status(400).json({ error: "Missing 'cityName' or 'lotName' query parameters" });
    }

    const city = await City.findOne({ name: cityName });
    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }

    const parkingLot = await ParkingLot.findOne({ city: city._id, name: lotName });
    if (!parkingLot) {
        return res.status(404).json({ error: "Parking lot not found in the specified city" });
    }

    const spots = await ParkingSpot.find({ parkingLot: parkingLot._id });
    res.json({
        parkingName: parkingLot.name,
        address: parkingLot.address,
        spotCount: parkingLot.spotCount,
        spots: spots.map(mapSpot)
    });
});

export default router;
