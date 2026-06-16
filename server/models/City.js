import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    district: {
        type: String,
        required: true,
        enum: ['Tel Aviv District', 'Central District', 'Jerusalem District',
               'Northern District', 'Haifa District', 'Southern District']
    },
    parkingLots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' }],
    authorizedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('City', citySchema);
