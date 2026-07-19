import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

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

// Lets an already-authenticated user create another user account.
// Does not log the new user in — just confirms creation.
router.post('/signup', protect, async (req, res) => {
    const { fullName, email, password, city } = req.body;
    if (!fullName || !email || !password || !city) {
        return res.status(400).json({ error: "Missing 'fullName', 'email', 'password' or 'city'" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ error: "A user with this email already exists" });
    }

    const user = await User.create({ fullName, email, password, city });
    res.status(202).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city }
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
});

// Checks whether the current session's token is still valid.
// 200 + user -> frontend keeps the user on the admin page.
// 401 (from `protect`) -> frontend redirects to login.
router.get('/me', protect, (req, res) => {
    const { user } = req;
    res.json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city }
    });
});

export default router;
