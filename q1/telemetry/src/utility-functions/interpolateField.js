export function interpolateField(data, field) {
    const cleaned = [...data];

    let start = null;
    let end = null;

    const isInvalid = (val) => val === null || val === undefined || Number.isNaN(val);

    for (let i = 0; i < cleaned.length; i++) {
        const val = cleaned[i][field];

        if (isInvalid(val)) {
            if (start === null) start = i;
            end = i;
        } else if (start !== null) {
            const prevGood = start > 0 ? cleaned[start - 1][field] : cleaned[end + 1][field];

            const nextGood = cleaned[i][field];

            const gap = end - start + 1;

            // interpolate values
            for (let j = 0; j < gap; j++) {
                cleaned[start + j][field] = prevGood + ((nextGood - prevGood) * (j + 1)) / (gap + 1);
            }

            start = null;
            end = null;
        }
    }

    // if missing values occur at the end of the dataset, carry forward
    if (start !== null) {
        const prevGood = start > 0 ? cleaned[start - 1][field] : null;

        for (let i = start; i < cleaned.length; i++) {
            cleaned[i][field] = prevGood;
        }
    }

    return cleaned;
}
