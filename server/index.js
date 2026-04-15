import express from 'express';
import cors from 'cors';
import parkingRoutes from './routes/parkingRoutes.js';
import loraRoutes from './routes/loraRoutes.js';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/lora', loraRoutes);
app.use('/parking', parkingRoutes);

app.get('/api/test', (req, res) => {
    res.send('Hello Smart Parking');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});