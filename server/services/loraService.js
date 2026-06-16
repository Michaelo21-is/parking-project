import mongoose from 'mongoose';
import ParkingSpot from '../models/ParkingSpot.js';

export const processData = async (data) => {
    if (!data.lotId || !data.spot || !data.status || data.floor === undefined) {
        throw new Error('Invalid data format, missing "lotId", "spot", "status", or "floor" field');
    }

    if (!mongoose.isValidObjectId(data.lotId)) {
        throw new Error('Invalid "lotId" value');
    }

    if (data.status !== 'free' && data.status !== 'occupied') {
        throw new Error('Invalid status value - must be "free" or "occupied"');
    }

    const spot = await ParkingSpot.findOne({
        parkingLot: data.lotId,
        spotNumber: data.spot,
        floor: data.floor
    });

    if (!spot) {
        throw new Error(`No parking spot ${data.spot} (floor ${data.floor}) found in lot ${data.lotId}`);
    }

    spot.status = data.status;
    if (data.status === 'free') {
        spot.parkedCar = null;
    }
    await spot.save();

    console.log(`Updated spot ${data.spot} (Floor: ${data.floor}, Lot: ${data.lotId}) to ${data.status}`);

    return true;
};
