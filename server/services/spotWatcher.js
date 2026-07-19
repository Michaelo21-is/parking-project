import ParkingSpot from '../models/ParkingSpot.js';
import { getIO } from '../sockets/socket.js';

const getFloorCounts = async (lotId) => {
    const rows = await ParkingSpot.aggregate([
        { $match: { parkingLot: lotId } },
        {
            $group: {
                _id: { floor: '$floor', type: '$type' },
                total: { $sum: 1 },
                available: { $sum: { $cond: [{ $eq: ['$status', 'free'] }, 1, 0] } }
            }
        },
        { $sort: { '_id.floor': 1 } }
    ]);

    const floorsMap = new Map();
    for (const row of rows) {
        const { floor, type } = row._id;
        if (!floorsMap.has(floor)) {
            floorsMap.set(floor, { floor, total: 0, available: 0, byType: {} });
        }
        const entry = floorsMap.get(floor);
        entry.total += row.total;
        entry.available += row.available;
        entry.byType[type] = { free: row.available, occupied: row.total - row.available };
    }

    return [...floorsMap.values()].sort((a, b) => a.floor - b.floor);
};

const emitAvailability = async (io, lotId, changedFloor) => {
    const floors = await getFloorCounts(lotId);
    const totals = floors.reduce((acc, f) => {
        acc.total += f.total;
        acc.available += f.available;
        for (const [type, counts] of Object.entries(f.byType)) {
            if (!acc.byType[type]) acc.byType[type] = { free: 0, occupied: 0 };
            acc.byType[type].free += counts.free;
            acc.byType[type].occupied += counts.occupied;
        }
        return acc;
    }, { total: 0, available: 0, byType: {} });

    io.to(`lot:${lotId}`).emit('lotAvailability', {
        parkingLot: lotId,
        total: totals.total,
        available: totals.available,
        byType: totals.byType
    });

    const floorCounts = floors.find(f => f.floor === changedFloor);
    io.to(`lot:${lotId}:floor:${changedFloor}`).emit('floorAvailability', {
        parkingLot: lotId,
        floor: changedFloor,
        total: floorCounts?.total ?? 0,
        available: floorCounts?.available ?? 0,
        byType: floorCounts?.byType ?? {}
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
