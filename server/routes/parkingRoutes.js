import express from 'express';
import City from '../models/City.js';
import ParkingLot from '../models/ParkingLot.js';
import ParkingSpot from '../models/ParkingSpot.js';
import { buildLotView, countByTypeAggregate } from '../services/lotView.js';

const router = express.Router();

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
        const matchedSpotCount = await ParkingSpot.countDocuments({ parkingLot: lot._id, ...spotFilter });
        const freeSpotCount = await ParkingSpot.countDocuments({ parkingLot: lot._id, ...spotFilter, status: 'free' });
        const spotsByType = await countByTypeAggregate({ parkingLot: lot._id, ...spotFilter });
        return {
            lotId: lot._id,
            city: lot.city?.name,
            parkingName: lot.name,
            address: lot.address,
            totalSpots: lot.spotCount,
            freeSpotCount,
            spotsByType,
            matchedSpotCount
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
        const freeSpotCount = await ParkingSpot.countDocuments({ parkingLot: lot._id, status: 'free' });
        const spotsByType = await countByTypeAggregate({ parkingLot: lot._id });
        return {
            lotId: lot._id,
            city: city.name,
            parkingName: lot.name,
            address: lot.address,
            totalSpots: lot.spotCount,
            freeSpotCount,
            spotsByType
        };
    }));

    res.json(responseData);
});

// Single parking lot within a city. Without 'floor', spots/spotsByType cover the
// whole lot. With 'floor', they're scoped to that floor. Same response shape
// either way — see services/lotView.js.
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

    const floorNum = floor === undefined || floor === null || floor === '' ? undefined : Number(floor);
    res.json(await buildLotView(parkingLot, { floor: floorNum, cityName: city.name }));
});

export default router;
