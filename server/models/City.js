import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    district: {
        type: String,
        required: true,
        enum: ['מחוז תל אביב', 'מחוז המרכז', 'מחוז ירושלים',
               'מחוז הצפון', 'מחוז חיפה', 'מחוז הדרום']
    },
    parkingLots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' }],
    authorizedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('City', citySchema);
