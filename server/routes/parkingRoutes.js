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

const floorsFromSpots = spots => [...new Set(spots.map(spot => spot.floor))].sort((a, b) => a - b);

const getFloors = async lotId => {
    const floors = await ParkingSpot.distinct('floor', { parkingLot: lotId });
    return floors.sort((a, b) => a - b);
};

// Search by district -> cities in that district, each mapped to its parking lot names
router.get('/district', async (req, res) => {
    const district = req.query.name;
    if (!district) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const cities = await City.find({ district }).select('name');
    const result = {};
    await Promise.all(cities.map(async city => {
        const lots = await ParkingLot.find({ city: city._id }).select('name');
        result[city.name] = lots.map(lot => ({ lotId: lot._id, name: lot.name }));
    }));

    res.json(result);
});

// Flexible search by city name, parking lot name, and/or floor number.
router.get('/search', async (req, res) => {
    const { cityName, lotName, floor } = req.query;
    if (!cityName && !lotName && floor === undefined) {
        return res.status(400).json({ error: "Provide at least one of 'cityName', 'lotName', or 'floor'" });
    }

    const lotFilter = {};
    if (cityName) {
        const cities = await City.find({ name: new RegExp(cityName, 'i') }).select('_id');
        lotFilter.city = { $in: cities.map(c => c._id) };
    }
    if (lotName) {
        lotFilter.name = new RegExp(lotName, 'i');
    }

    const lots = await ParkingLot.find(lotFilter).populate('city', 'name');

    const spotFilter = {};
    if (floor !== undefined) {
        spotFilter.floor = Number(floor);
    }

    const results = await Promise.all(lots.map(async lot => {
        const spots = await ParkingSpot.find({ parkingLot: lot._id, ...spotFilter });
        return {
            lotId: lot._id,
            city: lot.city?.name,
            parkingName: lot.name,
            address: lot.address,
            spotCount: spots.filter(spot => spot.status === 'free').length,
            matchedSpotCount: spots.length
        };
    }));

    const filtered = floor !== undefined ? results.filter(r => r.matchedSpotCount > 0) : results;
    res.json(filtered.map(({ matchedSpotCount, ...rest }) => rest));
});

// Autocomplete city names by prefix
router.get('/cities/autocomplete', async (req, res) => {
    const q = req.query.q;
    if (typeof q !== 'string' || q.trim().length < 2) {
        return res.json([]);
    }

    try {
        const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp('^' + escaped, 'i');
        const cities = await City.find({ name: prefixRegex }).select('name').limit(10);
        res.json(cities.map(city => ({ id: city._id, name: city.name })));
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search by city
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
            lotId: lot._id,
            parkingName: lot.name,
            address: lot.address,
            spotCount: spots.filter(spot => spot.status === 'free').length
        };
    }));

    res.json(responseData);
});

// Single parking lot within a city. Without 'floor', returns all floors' spots.
// With 'floor', returns only the free-spot counts by type (regular/disabled/dean) on that floor.
router.get('/lot', async (req, res) => {
    const { cityName, lotName, floor } = req.query;
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

    if (floor === undefined || floor === null || floor === '') {
        const spots = await ParkingSpot.find({ parkingLot: parkingLot._id });
        return res.json({
            lotId: parkingLot._id,
            parkingName: parkingLot.name,
            address: parkingLot.address,
            spotCount: parkingLot.spotCount,
            floors: floorsFromSpots(spots),
            spots: spots.map(mapSpot)
        });
    }

    const floorSpots = await ParkingSpot.find({ parkingLot: parkingLot._id, floor: Number(floor) });
    const freeCounts = { regular: 0, disabled: 0, dean: 0 };
    floorSpots.forEach(spot => {
        if (spot.status === 'free' && freeCounts[spot.type] !== undefined) {
            freeCounts[spot.type]++;
        }
    });

    res.json({
        lotId: parkingLot._id,
        parkingName: parkingLot.name,
        floor: Number(floor),
        floors: await getFloors(parkingLot._id),
        freeSpots: freeCounts
    });
});

export default router;
