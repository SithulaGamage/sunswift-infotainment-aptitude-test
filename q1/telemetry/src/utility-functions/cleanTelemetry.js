import { cleanEntry } from "./cleanEntry";
import { interpolateSpeed } from "./interpolateSpeed";
import { interpolateField } from "./interpolateField";

export function cleanTelemetry(rawData) {
    let cleaned = rawData.map(cleanEntry);

    cleaned = interpolateSpeed(cleaned);

    cleaned = interpolateField(cleaned, "battery");
    cleaned = interpolateField(cleaned, "motorTemp");

    return cleaned;
}
