import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const signToken = (user) =>
    jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Sets the JWT as an httpOnly cookie, plus a non-httpOnly cookie with
// non-sensitive profile info (role/city) the frontend can read directly for
// UI rendering without an extra /auth/me round trip. The real session cookie
// (`token`) stays httpOnly — only cosmetic data goes in `userInfo`.
const sendAuth = (res, user, status) => {
    const token = signToken(user);
    const cookieOpts = {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
    res.cookie('token', token, { ...cookieOpts, httpOnly: true });
    res.cookie('userInfo', JSON.stringify({ city: user.city, role: user.role }), {
        ...cookieOpts,
        httpOnly: false
    });
    res.status(status).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role }
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

// Lets an admin create another user account (admin or worker).
// Does not log the new user in — just confirms creation.
router.post('/signup', protect, authorize('admin'), async (req, res) => {
    const { fullName, email, password, city, role } = req.body;
    if (!fullName || !email || !password || !city) {
        return res.status(400).json({ error: "Missing 'fullName', 'email', 'password' or 'city'" });
    }
    if (role && !['admin', 'worker'].includes(role)) {
        return res.status(400).json({ error: "Invalid 'role'" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ error: "A user with this email already exists" });
    }

    const user = await User.create({ fullName, email, password, city, role });
    res.status(202).json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role }
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('userInfo');
    res.json({ message: "Logged out" });
});

// Checks whether the current session's token is still valid.
// 200 + user -> frontend keeps the user on the admin page.
// 401 (from `protect`) -> frontend redirects to login.
router.get('/me', protect, (req, res) => {
    const { user } = req;
    res.json({
        user: { id: user._id, fullName: user.fullName, email: user.email, city: user.city, role: user.role }
    });
});

export default router;
