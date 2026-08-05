import ParkingSpot from '../models/ParkingSpot.js';

// Shared response shape for "give me a lot" endpoints, used by both
// GET /parking/lot (search by city+lot name) and GET /lots/:id (search by id),
// so both return the identical contract regardless of how the lot was looked up.

export const mapSpot = spot => ({
    spot: spot.spotNumber,
    floor: spot.floor,
    status: spot.status,
    type: spot.type
});

export const floorsFromSpots = spots => [...new Set(spots.map(spot => spot.floor))].sort((a, b) => a - b);

export const countFreeByType = spots => {
    const counts = { regular: 0, disabled: 0, dean: 0 };
    spots.forEach(spot => {
        if (spot.status === 'free' && counts[spot.type] !== undefined) {
            counts[spot.type]++;
        }
    });
    return counts;
};

// Builds the unified lot view. Pass `floor` to scope `spots`/`freeSpots` to one
// floor (the top-level `floors` list always covers the whole lot). `cityName`
// is optional — pass it when the caller already knows it (avoids a populate).
export const buildLotView = async (lot, { floor, cityName } = {}) => {
    const allSpots = await ParkingSpot.find({ parkingLot: lot._id });
    const floors = floorsFromSpots(allSpots);
    const scopedSpots = floor === undefined ? allSpots : allSpots.filter(spot => spot.floor === floor);

    return {
        lotId: lot._id,
        city: cityName ?? lot.city?.name,
        parkingName: lot.name,
        address: lot.address,
        totalSpots: lot.spotCount,
        floors,
        ...(floor !== undefined && { floor }),
        freeSpots: countFreeByType(scopedSpots),
        spots: scopedSpots.map(mapSpot)
    };
};
