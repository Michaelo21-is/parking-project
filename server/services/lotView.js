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

// Free + total counts per spot type, from an already-fetched array of spots.
export const countByType = spots => {
    const counts = { regular: { free: 0, total: 0 }, disabled: { free: 0, total: 0 }, dean: { free: 0, total: 0 } };
    spots.forEach(spot => {
        const bucket = counts[spot.type];
        if (!bucket) return;
        bucket.total++;
        if (spot.status === 'free') bucket.free++;
    });
    return counts;
};

// Same free + total breakdown, but computed in the DB via aggregation for
// callers that don't already have the spots loaded (e.g. list endpoints
// that only need counts per lot, not the spots themselves).
export const countByTypeAggregate = async (match) => {
    const rows = await ParkingSpot.aggregate([
        { $match: match },
        { $group: { _id: '$type', total: { $sum: 1 }, free: { $sum: { $cond: [{ $eq: ['$status', 'free'] }, 1, 0] } } } }
    ]);
    const counts = { regular: { free: 0, total: 0 }, disabled: { free: 0, total: 0 }, dean: { free: 0, total: 0 } };
    rows.forEach(row => {
        if (counts[row._id]) counts[row._id] = { free: row.free, total: row.total };
    });
    return counts;
};

// Builds the unified lot view. Pass `floor` to scope `spots`/`spotsByType` to one
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
        spotsByType: countByType(scopedSpots),
        spots: scopedSpots.map(mapSpot)
    };
};
