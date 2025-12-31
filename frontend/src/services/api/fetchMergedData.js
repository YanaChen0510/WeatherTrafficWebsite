
/**
 * Get the weather and traffic data from the backend
 * @param {string} stationId 
 * @param {number} days 
 * @returns weather and traffic data
 */
export async function fetchMergedData(stationId = "23001", days=30) {

    try {

        const endDate = new Date();
        const startDate = new Date();
        
        startDate.setDate(startDate.getDate() - days);

        const url = `http://localhost:8081/api/merged?stationId=${stationId}&from=${startDate.toISOString()}&to=${endDate.toISOString()}`;

        const response = await fetch(url);
        if(!response.ok) {
            const detail = await response.text();
            throw new Error(`Backend error ${response.status} : ${detail}`);
        }

        return response.json();

    } catch (err) {
        console.error("Failed to fetch merged data : ", err);
        return null;
    }

}