// Calculate distance between two GPS coordinates
const calculateDistance = (
    latitude1,
    longitude1,
    latitude2,
    longitude2
) => {

    const earthRadius = 6371; // KM

    const lat1 = latitude1 * Math.PI / 180;
    const lat2 = latitude2 * Math.PI / 180;

    const deltaLat =
        (latitude2 - latitude1) * Math.PI / 180;

    const deltaLon =
        (longitude2 - longitude1) * Math.PI / 180;


    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);


    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;
};


// Calculate ETA in minutes
const calculateETA = (
    distanceInKm,
    averageSpeedKmph = 30
) => {

    if (
        distanceInKm <= 0 ||
        averageSpeedKmph <= 0
    ) {
        return 0;
    }

    const timeInHours =
        distanceInKm / averageSpeedKmph;

    const timeInMinutes =
        timeInHours * 60;

    return Math.max(
        1,
        Math.round(timeInMinutes)
    );
};


module.exports = {
    calculateDistance,
    calculateETA
};