import express from 'express';
import City from '../models/City.js';
import ParkingLot from '../models/ParkingLot.js';
import ParkingSpot from '../models/ParkingSpot.js';
import { protect, authorize } from '../middleware/auth.js';
import { buildLotView } from '../services/lotView.js';

const router = express.Router();

// READ — list all lots (optionally filter by ?cityName=)
router.get('/', async (req, res) => {
    const { cityName } = req.query;
    let filter = {};

    if (cityName) {
        const city = await City.findOne({ name: cityName });
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        filter.city = city._id;
    }

    const lots = await ParkingLot.find(filter).populate('city', 'name district');
    res.json(lots);
});

// READ — single lot by id. Same response shape as GET /parking/lot (search by
// city+lot name) — pass ?floor= to scope spots/spotsByType to one floor.
router.get('/:id', async (req, res) => {
    try {
        const lot = await ParkingLot.findById(req.params.id).populate('city', 'name');
        if (!lot) {
            return res.status(404).json({ error: "Parking lot not found" });
        }
        const { floor } = req.query;
        const floorNum = floor === undefined || floor === null || floor === '' ? undefined : Number(floor);
        res.json(await buildLotView(lot, { floor: floorNum }));
    } catch (error) {
        res.status(400).json({ error: "Invalid lot id" });
    }
});

// CREATE — new lot in a city (only in the user's own city)
router.post('/', protect, authorize('admin'), async (req, res) => {
    const { name, cityName, address, spotCount } = req.body;
    if (!name || !cityName) {
        return res.status(400).json({ error: "Missing 'name' or 'cityName'" });
    }

    const city = await City.findOne({ name: cityName });
    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }
    if (!city._id.equals(req.user.city)) {
        return res.status(403).json({ error: "You are not authorized to manage lots in this city" });
    }

    try {
        const lot = await ParkingLot.create({ name, city: city._id, address, spotCount });
        await City.findByIdAndUpdate(city._id, { $addToSet: { parkingLots: lot._id } });
        res.status(201).json(lot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE — edit lot fields (e.g. spotCount after renovation)
router.put('/:id', protect, authorize('admin', 'worker'), async (req, res) => {
    const { name, address, spotCount } = req.body;

    try {
        const lot = await ParkingLot.findById(req.params.id);
        if (!lot) {
            return res.status(404).json({ error: "Parking lot not found" });
        }
        if (!lot.city.equals(req.user.city)) {
            return res.status(403).json({ error: "You are not authorized to manage lots in this city" });
        }

        if (name !== undefined) lot.name = name;
        if (address !== undefined) lot.address = address;
        if (spotCount !== undefined) lot.spotCount = spotCount;
        await lot.save();
        res.json(lot);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE — remove lot, its spots, and its reference on the city
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const lot = await ParkingLot.findById(req.params.id);
        if (!lot) {
            return res.status(404).json({ error: "Parking lot not found" });
        }
        if (!lot.city.equals(req.user.city)) {
            return res.status(403).json({ error: "You are not authorized to manage lots in this city" });
        }

        await lot.deleteOne();
        await ParkingSpot.deleteMany({ parkingLot: lot._id });
        await City.findByIdAndUpdate(lot.city, { $pull: { parkingLots: lot._id } });
        res.json({ message: "Parking lot deleted", id: lot._id });
    } catch (error) {
        res.status(400).json({ error: "Invalid lot id" });
    }
});

export default router;
