import { parseValue } from "./parseValue";
import { parseGPS } from "./parseGPS";

export function cleanEntry(entry) {
    return {
        timestamp: entry.timestamp,
        speed: parseValue(entry.speed),
        battery: parseValue(entry.battery),
        motorTemp: parseValue(entry.motorTemp),
        gps: parseGPS(entry.gps),
    };
}
