import express from 'express';

const router = express.Router();

// Mock database
const cities = [
    { id: "c1", cityName: "תל אביב" },
    { id: "c2", cityName: "חולון" }
];

const parkingLots = [
    { id: "L10", floors: 1, cityId: "c1", name: "חניון עזריאלי" },
    { id: "L20", floors: 2, cityId: "c2", name: "חניון HIT" },
    { id: "L30", floors: 2, cityId: "c1", name: "חניון רוטשילד" }
];

const spots = [
    { id: "s1", floor: 1, lotId: "L10", spotNumber: 1, isOccupied: false, type: "normal" },
    { id: "s2", floor: 1, lotId: "L10", spotNumber: 2, isOccupied: true, type: "disabled" },
    { id: "s3", floor: 1, lotId: "L10", spotNumber: 3, isOccupied: false, type: "dean" },

    { id: "s4", floor: 1, lotId: "L20", spotNumber: 1, isOccupied: true, type: "normal" },
    { id: "s5", floor: 2, lotId: "L20", spotNumber: 2, isOccupied: false, type: "normal" },
    { id: "s6", floor: 2, lotId: "L20", spotNumber: 3, isOccupied: true, type: "disabled" },

    { id: "s7", floor: 1, lotId: "L30", spotNumber: 1, isOccupied: false, type: "normal" },
    { id: "s8", floor: 2, lotId: "L30", spotNumber: 2, isOccupied: true, type: "disabled" },
    { id: "s9", floor: 2, lotId: "L30", spotNumber: 3, isOccupied: false, type: "normal" }
];

router.get('/city', (req, res) => {
    const requestedCityName = req.query.name;

    if (!requestedCityName) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }
    const city = cities.find(c => c.cityName === requestedCityName);

    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }
    const cityParkingLots = parkingLots.filter(lot => lot.cityId === city.id);
    const responseData = cityParkingLots.map(lot => {
        const lotSpots = spots.filter(spot => spot.lotId === lot.id);
        return {
            parkingName: lot.name,
            floors: lot.floors,
            spots: lotSpots.map(spot => ({
                spot: spot.spotNumber,
                floor: spot.floor,
                status: spot.isOccupied,
                type: spot.type
            }))
        };
    });
    res.json(responseData);
});

router.get('/lot', (req, res) => {
    const { cityName, lotName } = req.query;
    if (!cityName || !lotName) {
        return res.status(400).json({ error: "Missing 'cityName' or 'lotName' query parameters" });
    }

    const city = cities.find(c => c.cityName === cityName);
    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }

    const parkingLot = parkingLots.find(lot => lot.cityId === city.id && lot.name === lotName);
    if (!parkingLot) {
        return res.status(404).json({ error: "Parking lot not found in the specified city" });
    }
    const lotSpots = spots.filter(spot => spot.lotId === parkingLot.id);

    const responseData = {
        parkingName: parkingLot.name,
        floors: parkingLot.floors,
        spots: lotSpots.map(spot => ({
            spot: spot.spotNumber,
            floor: spot.floor,
            status: spot.isOccupied,
            type: spot.type
        }))
    };

    res.json(responseData);
});

export default router;