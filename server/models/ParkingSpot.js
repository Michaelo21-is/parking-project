import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema({
    spotNumber: { type: Number, required: true },
    floor: { type: Number, required: true, default: 1 },
    parkingLot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    status: { type: String, enum: ['free', 'occupied'], default: 'free' },
    type: { type: String, enum: ['regular', 'disabled', 'dean'], default: 'regular' },
    parkedCar: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('ParkingSpot', parkingSpotSchema);
