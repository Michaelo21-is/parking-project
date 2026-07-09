import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import City from '../models/City.js';

const router = express.Router();

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Sets the JWT as an httpOnly cookie and returns the user
const sendAuth = (res, user, status) => {
    const token = signToken(user);
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(status).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city }
    });
};

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
        sendAuth(res, user, 201);
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

    sendAuth(res, user, 200);
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
});

export default router;
