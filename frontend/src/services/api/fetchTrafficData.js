import { toYYYYMMDD } from "../../utils/date";

/**
 * Fetch traffic data for a specific station.
 * 
 * @param {number} [stationId=23001] - ID of the traffic station to fetch.
 * @returns {Promise<Object|null>} Traffic data object for the station, or null on failure.
 */
export async function fetchTrafficData(stationId=23001) {

    try {

        const url = `http://localhost:8081/api/traffic/stations/${stationId}`;
    
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
 * Fetch all traffic stations.
 * 
 * @returns {Promise<Array<Object>|null>} Array of traffic station objects, or null on failure.
 */
export async function fetchAllTrafficStations() {

    try {

        const url = "http://localhost:8081/api/traffic/stations";

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
 * Fetch historical traffic data for a specific station over a number of days.
 * 
 * @param {number} stationId - ID of the traffic station.
 * @param {number} days - Number of past days to fetch data for.
 * @returns {Promise<Object|null>} Historical traffic data object, or null on failure.
 */
export async function fetchTrafficStationHistory(stationId, days) {

    try {

        const endDate = new Date();
        const startDate = new Date();
        
        startDate.setDate(startDate.getDate() - days);

        const url = `http://localhost:8081/api/traffic/stations/${stationId}/history?start=${toYYYYMMDD(startDate)}&end=${toYYYYMMDD(endDate)}`;

        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();
    } catch (err) {
        console.error("Failed to fetch historical traffic data : ", err);
        return null;
    }

}