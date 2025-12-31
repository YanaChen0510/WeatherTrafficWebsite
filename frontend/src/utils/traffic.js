/**
 * Get the diffence percentage between this months and the average months number of cars
 * @param {number} numCars 
 * @param {number} monthlyAverage 
 * @returns {string} the difference
 */
export function getMonthlyAveragePercent(numCars, monthlyAverage) {
    if (!monthlyAverage) return "0%"

    const difference = (numCars / monthlyAverage - 1) * 100;
    return `${difference >= 0 ? '+' : ''}${difference.toFixed(2)}%`;
}

/**
 * Returns the status of the traffic based on the average vehicle speed
 * @param {number} avgSpeed 
 * @returns {string}
 */
export function getTrafficStatus(avgSpeed) {
    if (avgSpeed > 90) return "Smooth";
    if (avgSpeed > 70) return "Normal";
    return "Slow";
}

/**
 * Returns the average number of vehicles per month
 * @param {*} hourly 
 * @param {*} fallback 
 */
export function calculateMonthlyAverage(hourly, fallback) {
    const filtered = hourly
        .map(hour => hour.vehicleCount)
        .filter((vehicle) => vehicle > 0 && vehicle !== fallback);

    if (!filtered.length) return fallback;

    const sum = filtered.reduce((a, b) => a + b, 0);
    return Math.round(sum / filtered.length);
}

/**
 * Aggregate vehicle counts into monthly totals for a specific year.
 * @param {*} hourly 
 * @param {*} targetYear 
 * @returns 
 */
export function aggregateMonthlyVehicleCounts(hourly, targetYear) {
    const months = Array(12).fill(0);

    hourly.forEach(entry => {
        if (!entry.timestamp || entry.vehicleCount == null) return;

        const date = new Date(entry.timestamp);
        if (date.getFullYear() !== targetYear) return;

        months[date.getMonth()] += entry.vehicleCount;
    });

    return months;
}

/**
 * Converts yearlyTrafficData.vehicleCount into monthly sums.
 * 
 * @param {Object} yearlyTraffic Traffic data object from backend.
 * @param {number} targetYear The year to aggregate
 * @returns {number[]} An array of 12 monthly totals.
 */
export function aggregateMonthlyVehicleCountsFromYearly(yearlyTraffic, targetYear) {
    if (!yearlyTraffic || !yearlyTraffic.vehicleCount) return new Array(12).fill(0);

    const counts = new Array(12).fill(0);

    for (const [dateStr, vehicleCount] of Object.entries(yearlyTraffic.vehicleCount)) {
        const date = new Date(dateStr);

        if (date.getFullYear() !== targetYear) continue;

        const monthIndex = date.getMonth();
        counts[monthIndex] += vehicleCount;
    }

    return counts;
}