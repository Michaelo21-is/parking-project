import ParkingSpot from '../models/ParkingSpot.js';
import { getIO } from '../sockets/socket.js';

const getFloorCounts = async (lotId) => {
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

    return byFloor.map(f => ({ floor: f._id, total: f.total, available: f.available }));
};

const emitAvailability = async (io, lotId, changedFloor) => {
    const floors = await getFloorCounts(lotId);
    const totals = floors.reduce((acc, f) => ({
        total: acc.total + f.total,
        available: acc.available + f.available
    }), { total: 0, available: 0 });

    io.to(`lot:${lotId}`).emit('lotAvailability', {
        parkingLot: lotId,
        total: totals.total,
        available: totals.available,
        floors
    });

    const floorCounts = floors.find(f => f.floor === changedFloor);
    io.to(`lot:${lotId}:floor:${changedFloor}`).emit('floorAvailability', {
        parkingLot: lotId,
        floor: changedFloor,
        total: floorCounts?.total ?? 0,
        available: floorCounts?.available ?? 0
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
