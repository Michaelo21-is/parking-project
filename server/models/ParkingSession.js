import mongoose from 'mongoose';

const parkingSessionSchema = new mongoose.Schema({
    carPlate: { type: String, required: true },
    parkingLot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    parkingSpot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    entryTime: { type: Date, required: true, default: Date.now },
    exitTime: { type: Date, default: null },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('ParkingSession', parkingSessionSchema);
