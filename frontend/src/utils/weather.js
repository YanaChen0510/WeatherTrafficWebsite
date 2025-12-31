/**
 *  Create a readable string with the total daylight time in a given day
 * @param {string} sunrise HH:mm
 * @param {string} sunset HH::mm
 * @returns {string} the formated string
 */

export function calculateDaylight(sunrise, sunset) {
    if (!sunrise || !sunset) return "N/A";

    const [sunriseHour, sunriseMinute] = sunrise.split(":").map(Number);
    const [sunsetHour, sunsetMinute] = sunset.split(":").map(Number);

    const total = (sunsetHour * 60 + sunsetMinute) - (sunriseHour * 60 + sunriseMinute);

    const totalHours = Math.floor(total/60);
    const totalMinutes = total % 60;

    return `${totalHours}h ${totalMinutes}`;
};

/**
 * Calculate the average vehicle speed on rainy vs dry days.
 *
 * @param {Object|Array} yearlyWeather - Weather data with monthly precipitation arrays
 * @param {Object} yearlyTraffic - Traffic data containing averageSpeed per day
 * @returns {{rainyAvg: number, dryAvg: number}} Average speed for rainy and dry days
 */
export function calculateRainImpact(yearlyWeather, yearlyTraffic) {
    if (!yearlyWeather || !yearlyTraffic?.averageSpeed) {
        console.warn("Missing yearlyWeather or yearlyTraffic in calculateRainImpact");
        return { rainyAvg: 0, dryAvg: 0 };
    }

    const dailyPrecip = {};

    const months = Array.isArray(yearlyWeather)
        ? yearlyWeather
        : Object.entries(yearlyWeather).map(([month, data]) => ({
            timestamp: month,
            ...data
        }));

    for (const monthObj of months) {
        if (!monthObj || !monthObj.timestamp) continue;

        let precipArr = monthObj.precipitation;
        if (!Array.isArray(precipArr)) continue;

        const [year, month] = monthObj.timestamp.split("-");

        let dayIndex = 1;
        for (let i = 0; i < precipArr.length; i += 24) {
            const slice = precipArr.slice(i, i + 24);
            const sum = slice.reduce((a, b) => a + b, 0);

            const dayStr = `${year}-${String(month).padStart(2, "0")}-${String(dayIndex).padStart(2, "0")}`;
            dailyPrecip[dayStr] = sum;

            dayIndex++;
        }
    }

    const rainySpeeds = [];
    const drySpeeds = [];

    for (const [date, speed] of Object.entries(yearlyTraffic.averageSpeed)) {
        if (typeof dailyPrecip[date] !== "number") continue;

        const rainMm = dailyPrecip[date];

        if (rainMm > 0.1) {
            rainySpeeds.push(speed);
        } else {
            drySpeeds.push(speed);
        }
    }

    const avg = arr =>
        arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
        rainyAvg: Number(avg(rainySpeeds).toFixed(2)),
        dryAvg: Number(avg(drySpeeds).toFixed(2))
    };
}

/**
 * Convert wind direction in degrees to compass bearing string.
 *
 * @param {number} direction - Wind direction in degrees (0-360)
 * @returns {string} Compass bearing (e.g., "North", "South east")
 */
export function getBearingFromDirection(direction) {

  let bearing = "";
  if(direction >= 337.5 || bearing < 22.5) bearing = "North"
  else if (direction < 67.5) bearing = "North east"
  else if (direction < 112.5) bearing = "East"
  else if (direction < 157.5) bearing = "South east"
  else if (direction < 202.5) bearing = "South"
  else if (direction < 247.5) bearing = "South west"
  else if (direction < 292.5) bearing = "West"
  else bearing = "North west";

  return bearing;
}

/**
 * Compute daily precipitation and temperature averages from monthly hourly data.
 *
 * @param {Object} yearlyWeather - Weather data keyed by month, each containing hourly precipitation and temperature arrays
 * @returns {Object} Daily weather data keyed by YYYY-MM-DD, each with { precipitationMm, temperatureC }
 */
export function computeDailyWeather(yearlyWeather) {
    const output = {};

    Object.entries(yearlyWeather).forEach(([month, data]) => {
        const precip = data.precipitation;
        const temp = data.temperature_2m;

        if (!precip || !temp) return;

        const year = month.split("-")[0];
        const monthNum = parseInt(month.split("-")[1], 10);

        let dayIndex = 1;
        for (let i = 0; i < precip.length; i += 24) {

            const dayPrecip = precip.slice(i, i + 24).reduce((a, b) => a + b, 0);
            const dayTemps = temp.slice(i, i + 24);
            const dayTempAvg = dayTemps.reduce((a, b) => a + b, 0) / dayTemps.length;

            const dayStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(dayIndex).padStart(2, "0")}`;

            output[dayStr] = {
                precipitationMm: dayPrecip,
                temperatureC: dayTempAvg
            };

            dayIndex++;
        }
    });

    return output;
}
