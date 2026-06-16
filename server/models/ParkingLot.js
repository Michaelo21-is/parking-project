import mongoose from 'mongoose';

const parkingLotSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    address: { type: String },
    spotCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model('ParkingLot', parkingLotSchema);
