import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies the JWT and attaches the user to req.user
export const protect = async (req, res, next) => {
    const header = req.headers.authorization;
    const token = req.cookies?.token
        || (header && header.startsWith('Bearer ') ? header.split(' ')[1] : null);

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};