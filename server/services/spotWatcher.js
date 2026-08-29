import { getIO } from '../sockets/socket.js';
import { countByTypeAggregate } from './lotView.js';
import ParkingSpot from '../models/ParkingSpot.js';

const emitAvailability = async (io, lotId, changedFloor) => {
    const lotCounts = await countByTypeAggregate({ parkingLot: lotId });
    io.to(`lot:${lotId}`).emit('lotAvailability', {
        parkingLot: lotId,
        spotsByType: lotCounts
    });

    const floorCounts = await countByTypeAggregate({ parkingLot: lotId, floor: changedFloor });
    io.to(`lot:${lotId}:floor:${changedFloor}`).emit('floorAvailability', {
        parkingLot: lotId,
        floor: changedFloor,
        spotsByType: floorCounts
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
