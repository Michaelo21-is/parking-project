import ParkingSpot from '../models/ParkingSpot.js';
import { getIO } from '../sockets/socket.js';

const emitLotAvailability = async (io, lotId) => {
    const byFloor = await ParkingSpot.aggregate([
        { $match: { parkingLot: lotId } },
        {
            $group: {
                _id: '$floor',
                total: { $sum: 1 },
                available: { $sum: { $cond: [{ $eq: ['$status', 'free'] }, 1, 0] } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const totals = byFloor.reduce((acc, f) => ({
        total: acc.total + f.total,
        available: acc.available + f.available
    }), { total: 0, available: 0 });

    io.to(`lot:${lotId}`).emit('lotAvailability', {
        parkingLot: lotId,
        total: totals.total,
        available: totals.available,
        floors: byFloor.map(f => ({ floor: f._id, total: f.total, available: f.available }))
    });
};

export const watchParkingSpots = () => {
    const changeStream = ParkingSpot.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
        const doc = change.fullDocument;
        if (!doc) return;

        const io = getIO();
        await emitLotAvailability(io, doc.parkingLot);
    });

    changeStream.on('error', (err) => {
        console.error('ParkingSpot change stream error:', err.message);
    });

    console.log('Watching ParkingSpot collection for changes');
    return changeStream;
};
