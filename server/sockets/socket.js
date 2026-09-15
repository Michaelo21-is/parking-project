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

        const { lotId, floor } = socket.handshake.query;
        if (lotId) {
            socket.join(`lot:${lotId}`);
            if (floor) {
                socket.join(`lot:${lotId}:floor:${floor}`);
            }
        }

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
