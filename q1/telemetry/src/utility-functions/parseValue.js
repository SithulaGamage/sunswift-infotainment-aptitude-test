export function parseValue(value) {
    if (value === null || value === undefined) return null;

    if (typeof value === "number" && !Number.isNaN(value)) return value;

    const cleaned = String(value).replace(/[^0-9.-]/g, "");

    const parsed = parseFloat(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
}
