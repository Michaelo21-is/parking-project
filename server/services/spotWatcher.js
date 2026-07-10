import ParkingSpot from '../models/ParkingSpot.js';
import { getIO } from '../sockets/socket.js';

export const watchParkingSpots = () => {
    const changeStream = ParkingSpot.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
        const doc = change.fullDocument;
        if (!doc) return;

        const io = getIO();
        io.to(`lot:${doc.parkingLot}`).emit('spotUpdate', {
            spot: doc.spotNumber,
            floor: doc.floor,
            parkingLot: doc.parkingLot,
            status: doc.status,
            type: doc.type,
            parkedCar: doc.parkedCar
        });
    });

    changeStream.on('error', (err) => {
        console.error('ParkingSpot change stream error:', err.message);
    });

    console.log('Watching ParkingSpot collection for changes');
    return changeStream;
};
