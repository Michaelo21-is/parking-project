import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('joinLot', (lotId) => {
            socket.join(`lot:${lotId}`);
        });

        socket.on('leaveLot', (lotId) => {
            socket.leave(`lot:${lotId}`);
        });

        socket.on('joinFloor', ({ lotId, floor }) => {
            socket.join(`lot:${lotId}:floor:${floor}`);
        });

        socket.on('leaveFloor', ({ lotId, floor }) => {
            socket.leave(`lot:${lotId}:floor:${floor}`);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized — call initSocket first');
    }
    return io;
};
