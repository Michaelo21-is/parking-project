import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import City from '../models/City.js';

const router = express.Router();

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/signup', async (req, res) => {
    const { fullName, email, password, cityName } = req.body;
    if (!fullName || !email || !password || !cityName) {
        return res.status(400).json({ error: "Missing 'fullName', 'email', 'password', or 'cityName'" });
    }

    const city = await City.findOne({ name: cityName });
    if (!city) {
        return res.status(404).json({ error: "City not found" });
    }

    try {
        const user = await User.create({ fullName, email, password, city: city._id });
        await City.findByIdAndUpdate(city._id, { $addToSet: { authorizedUsers: user._id } });
        const token = signToken(user);
        res.status(201).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email already registered" });
        }
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing 'email' or 'password'" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city }
    });
});

export default router;
