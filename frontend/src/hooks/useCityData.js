import { calculateDaylight } from "../utils/weather";
import { getMonthlyAveragePercent, getTrafficStatus } from "../utils/traffic";

export function useCityData(city) {

    const windSpeed = city.windSpeed ?? 0;
    const precipitation = city.precipitation ?? 0;
    const avgSpeed = city.avgSpeed ?? 0;
    const numCars = city.numCars ?? 0;

    const daylight = calculateDaylight(city.sunrise, city.sunset);
    const monthlyAveragePercent = getMonthlyAveragePercent(numCars, city.MonthlyAverage);
    const trafficStatus = getTrafficStatus(city.avgSpeed);

    return {
        windSpeed,
        precipitation,
        avgSpeed,
        numCars,
        daylight,
        monthlyAveragePercent,
        trafficStatus
    }
}