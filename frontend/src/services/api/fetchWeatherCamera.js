/**
 * Fetch all weather camera stations.
 * 
 * @returns {Promise<Array<Object>|null>} Array of weather camera station objects, or null on failure.
 */
export async function fetchWeatherCameras() {

    try {

        const url = `http://localhost:8081/api/traffic/weathercam/stations`;

        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();

    } catch (err) {
        console.error("Failed to fetch traffic data : ", err);
        return null;
    }

}

/**
 * Fetch a specific weather camera station by ID.
 * 
 * @param {number} stationId - ID of the weather camera station.
 * @returns {Promise<Object|null>} Weather camera station data, or null on failure.
 */
export async function fetchWeatherCamera(stationId) {

    try {

        const url = `http://localhost:8081/api/traffic/weathercam/stations/${stationId}`;

        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();

    } catch (err) {
        console.error("Failed to fetch traffic data : ", err);
        return null;
    }

}