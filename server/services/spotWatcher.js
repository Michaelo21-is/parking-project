import ParkingSpot from '../models/ParkingSpot.js';
import { getIO } from '../sockets/socket.js';

const getFreeCountsByType = async (match) => {
    const rows = await ParkingSpot.aggregate([
        { $match: match },
        { $group: { _id: '$type', free: { $sum: { $cond: [{ $eq: ['$status', 'free'] }, 1, 0] } } } }
    ]);

    const counts = { regular: 0, disabled: 0, dean: 0 };
    rows.forEach(row => {
        counts[row._id] = row.free;
    });
    return counts;
};

const emitAvailability = async (io, lotId, changedFloor) => {
    const lotCounts = await getFreeCountsByType({ parkingLot: lotId });
    io.to(`lot:${lotId}`).emit('lotAvailability', {
        parkingLot: lotId,
        ...lotCounts
    });

    const floorCounts = await getFreeCountsByType({ parkingLot: lotId, floor: changedFloor });
    io.to(`lot:${lotId}:floor:${changedFloor}`).emit('floorAvailability', {
        parkingLot: lotId,
        floor: changedFloor,
        ...floorCounts
    });
};

export const watchParkingSpots = () => {
    const changeStream = ParkingSpot.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
        const doc = change.fullDocument;
        if (!doc) return;

        const io = getIO();
        await emitAvailability(io, doc.parkingLot, doc.floor);
    });

    changeStream.on('error', (err) => {
        console.error('ParkingSpot change stream error:', err.message);
    });

    console.log('Watching ParkingSpot collection for changes');
    return changeStream;
};
