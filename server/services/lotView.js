import ParkingSpot from '../models/ParkingSpot.js';

const SPOT_TYPES = ['regular', 'disabled', 'dean'];

const mapSpot = spot => ({
    spot: spot.spotNumber,
    floor: spot.floor,
    status: spot.status,
    type: spot.type
});

export function countByType(spots) {
    const counts = {
        regular: { free: 0, total: 0 },
        disabled: { free: 0, total: 0 },
        dean: { free: 0, total: 0 }
    };

    for (const spot of spots) {
        const type = SPOT_TYPES.includes(spot.type) ? spot.type : 'regular';
        counts[type].total += 1;
        if (spot.status !== 'occupied') counts[type].free += 1;
    }

    return counts;
}

// Shared response shape for a single lot, used by GET /lots/:id and GET /parking/lot.
// Pass `floor` to scope spots + spotsByType to that floor; omit for the whole lot.
export async function buildLotView(lot, floor) {
    const allSpots = await ParkingSpot.find({ parkingLot: lot._id });
    const spots = floor !== undefined
        ? allSpots.filter(spot => spot.floor === Number(floor))
        : allSpots;

    const floors = [...new Set(allSpots.map(spot => spot.floor))].sort((a, b) => a - b);

    return {
        lotId: lot._id,
        name: lot.name,
        address: lot.address,
        spotCount: lot.spotCount,
        totalSpots: allSpots.length,
        floors,
        spotsByType: countByType(spots),
        spots: spots.map(mapSpot)
    };
}
