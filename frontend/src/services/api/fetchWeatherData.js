import { toYYYYMMDD } from "../../utils/date";

/**
 * Fetch historical weather data for a given location.
 * 
 * @param {number} lon - Longitude of the location.
 * @param {number} lat - Latitude of the location.
 * @param {number} [days=30] - Number of past days to fetch (default is 30).
 * @returns {Promise<Object|null>} Weather data object from the API, or null if the request fails.
 */
export async function fetchWeatherData(lon, lat, days=30) {


    try {

        const endDate = new Date();
        const startDate = new Date();
        
        startDate.setDate(startDate.getDate() - days);

        const url = `http://localhost:8081/api/weather/archive?lat=${lat}&lon=${lon}&start=${toYYYYMMDD(startDate)}&end=${toYYYYMMDD(endDate)}`;
    
        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();
    } catch (err) {
        console.error("Failed to fetch weather data : ", err);
        return null;
    }

}

/**
 * Fetch dashboard data for a specific traffic/weather station.
 * 
 * @param {number} stationId - ID of the station.
 * @returns {Promise<Object|null>} Dashboard data object from the API, or null if the request fails.
 */
export async function fetchDashboardData(stationId) {
    try {

        const url = `http://localhost:8081/api/dashboard/${stationId}`;
    
        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();
    } catch (err) {
        console.error("Failed to fetch weather data : ", err);
        return null;
    }
}