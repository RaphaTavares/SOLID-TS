import * as geolib from "geolib";

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export function getDistanceBetweenCoordinates(
    from: Coordinate,
    to: Coordinate
) {
    const pointA = { latitude: from.latitude, longitude: from.longitude };
    const pointB = { latitude: to.latitude, longitude: to.longitude };
    const distance = geolib.getDistance(pointA, pointB);
    console.log(`distancia é ${distance}`);
    return distance;
}