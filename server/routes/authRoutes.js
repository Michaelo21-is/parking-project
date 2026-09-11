import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import City from '../models/City.js';

const router = express.Router();

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Sets the JWT as an httpOnly cookie, plus a readable userInfo cookie
// (role/cityId/cityName) the client renders with, and returns the user.
const sendAuth = (res, user, city, status) => {
    const token = signToken(user);
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie('userInfo', JSON.stringify({
        role: user.role,
        cityId: city._id,
        cityName: city.name
    }), {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(status).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role }
    });
};

router.post('/signup', async (req, res) => {
    const { fullName, email, password, city, role } = req.body;
    if (!fullName || !email || !password || !city) {
        return res.status(400).json({ error: "Missing 'fullName', 'email', 'password', or 'city'" });
    }

    if (!mongoose.isValidObjectId(city)) {
        return res.status(404).json({ error: "City not found" });
    }

    const cityDoc = await City.findById(city);
    if (!cityDoc) {
        return res.status(404).json({ error: "City not found" });
    }

    try {
        const user = await User.create({
            fullName,
            email,
            password,
            city: cityDoc._id,
            role: role === 'admin' ? 'admin' : 'worker'
        });
        await City.findByIdAndUpdate(cityDoc._id, { $addToSet: { authorizedUsers: user._id } });
        sendAuth(res, user, cityDoc, 201);
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

    const user = await User.findOne({ email }).populate('city', 'name');
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    sendAuth(res, user, user.city, 200);
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('userInfo');
    res.json({ message: "Logged out" });
});

export default router;
