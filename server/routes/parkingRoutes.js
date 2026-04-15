import express from 'express';

const router = express.Router();

// Mock database מעודכן עם מפלסים וסוגי חניות
const db = {
    "tel-aviv": [
        { spot: 1, floor: 1, status: "free", type: "regular" },
        { spot: 2, floor: 1, status: "occupied", type: "disabled" },
        { spot: 3, floor: 2, status: "free", type: "dean" }
    ],
    "ramla": [
        { spot: 10, floor: -1, status: "free", type: "regular" },
        { spot: 11, floor: -1, status: "occupied", type: "disabled" }
    ]
};

router.get('/city', (req, res) => {
    const city = req.query.name;
    if (city && db[city]) {
        res.json(db[city]);
    } else {
        res.status(404).json({ error: 'City not found' });
    }
});

export default router;