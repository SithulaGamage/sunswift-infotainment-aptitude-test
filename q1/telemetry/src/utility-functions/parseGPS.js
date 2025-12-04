export function parseGPS(gps) {
    if (!gps || gps.lat === undefined || gps.lng === undefined) return null;

    const lat = parseFloat(gps.lat);
    const lng = parseFloat(gps.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    return { lat, lng };
}
