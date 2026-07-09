import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import lotRoutes from './routes/lotRoutes.js';
import loraRoutes from './routes/loraRoutes.js';

await connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/lora', loraRoutes);
app.use('/parking', parkingRoutes);
app.use('/lots', lotRoutes);

app.get('/api/test', (req, res) => {
    res.send('Hello Smart Parking');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});