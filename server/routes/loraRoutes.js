import express from 'express';
import { processData } from '../services/loraService.js';
const router = express.Router();

router.post('/status', async (req, res) => {
    const sensorData = req.body;

    try {
        await processData(sensorData);
        res.status(200).json(
            {
                status: 'success',
                message: 'Sensor data received successfully'
            });
    } catch (error) {
        res.status(400).json(
            {
                status: 'error',
                message: error.message
            });
    }
});

export default router;