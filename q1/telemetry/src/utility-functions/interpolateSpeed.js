const lowerBound = 50;
const upperBound = 200;

export function interpolateSpeed(data) {
    const cleaned = [...data];

    let start = null;
    let end = null;

    for (let i = 0; i < cleaned.length; i++) {
        const speed = cleaned[i].speed;

        const isOutlier = (speed === null || speed < lowerBound || speed > upperBound);

        if (isOutlier) {
            if (start === null) start = i;
            end = i;
        } else if (start !== null) {
            // interpolate from previous good point to current good point
            const prevGood = start > 0 ? cleaned[start - 1].speed : speed;
            const nextGood = speed;

            const gap = end - start + 1;
            for (let j = 0; j < gap; j++) {
                cleaned[start + j].speed = prevGood + ((nextGood - prevGood) * (j + 1)) / (gap + 1);
            }

            start = null;
            end = null;
        }
    }

    // handle streak at end of array
    if (start !== null && start > 0) {
        const prevGood = cleaned[start - 1].speed;
        for (let j = start; j < cleaned.length; j++) {
            cleaned[j].speed = prevGood;
        }
    }

    return cleaned;
}
