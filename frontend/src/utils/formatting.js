import { fetchWeatherData } from "../services/api/fetchWeatherData";
import { calculateMonthlyAverage, getMonthlyAveragePercent, getTrafficStatus } from "./traffic";
import { weatherTable } from "./weatherTable";

/**
 * Format raw hourly data by filling in default values for missing fields.
 * 
 * @param {Array} hourly - Array of raw hourly data objects.
 * @param {Object} defaults - Default values for temperature, speed, and vehicle count.
 * @param {number} defaults.temperature - Default temperature in °C.
 * @param {number} defaults.avgSpeed - Default speed in km/h.
 * @param {number} defaults.vehicleCount - Default vehicle count.
 * @returns {Array<Object>} Formatted hourly data with consistent fields.
 */
export function formatHourly(hourly = [], defaults) {

    const {temperature, avgSpeed, vehicleCount} = defaults;

    return hourly.map((hour) => ({
        timestamp: hour.timestamp,
        avgSpeedKph: typeof hour.avgSpeedKph === "number" ? hour.avgSpeedKph : avgSpeed,
        vehicleCount: typeof hour.vehicleCount === "number" ? hour.vehicleCount : vehicleCount,
        temperatureC: typeof hour.temperatureC === "number" ? hour.temperatureC : temperature,
        precipitationMm: typeof hour.precipitationMm === "number" ? hour.precipitationMm : 0,
        windspeedMs: typeof hour.windspeedMs === "number" ? hour.windspeedMs : 0
    }));

}

/**
 * Calculate total cars from raw traffic data object.
 * 
 * @param {Object} rawTraffic - Raw traffic data including sensors array.
 * @returns {number} Total vehicle count.
 */
function getTotalCarsFromRawTraffic(rawTraffic) {
    if (!rawTraffic?.sensors || !Array.isArray(rawTraffic.sensors)) return 0;

    return rawTraffic.sensors.reduce((total, sensor) => {
        return total + (sensor.value || 0);
    }, 0);
}

/**
 * Calculate the average monthly vehicle count from yearly traffic data.
 * 
 * @param {Object} yearlyTraffic - Yearly traffic data containing vehicleCount object.
 * @returns {number} Average vehicle count per month.
 */
function getMonthlyCarsAverage(yearlyTraffic) {
    const counts = Object.values(yearlyTraffic.vehicleCount);
    const total = counts.reduce((sum, count) => sum + count, 0);
    return total / counts.length;
}

/**
 * Format raw dashboard, traffic, and weather data into a structured city data object.
 * 
 * @param {Object} rawDashboard - Raw dashboard data for the city.
 * @param {Object} rawTraffic - Raw traffic data for the city.
 * @param {Object} hourlyWeather - Hourly weather data for the city.
 * @param {Object} yearlyWeather - Yearly weather data for the city.
 * @param {Array<string>} relatedCameraLinks - URLs of traffic cameras.
 * @param {Object} yearlyTraffic - Yearly traffic data for the city.
 * @returns {Object|null} Formatted city data object or null if rawDashboard is missing.
 */
export function formatCityData(rawDashboard, rawTraffic, hourlyWeather, yearlyWeather, relatedCameraLinks, yearlyTraffic) {
    if (!rawDashboard ) return null;

    const cityName = typeof rawDashboard.municipality === "string" ? rawDashboard.municipality : "";
    const averageVehicleSpeed = typeof rawDashboard.avgSpeed60Min === "number" ? rawDashboard.avgSpeed60Min : 0;
    const vehicleCount = typeof getTotalCarsFromRawTraffic(rawTraffic) === "number" ? getTotalCarsFromRawTraffic(rawTraffic) : 0;
    const averageMonthlyCars = typeof getMonthlyCarsAverage(yearlyTraffic) === "number" ? getMonthlyCarsAverage(yearlyTraffic) : 0;
    const temperature = typeof rawDashboard.weather.temperature === "number" ? rawDashboard.weather.temperature : 0;
    const weather = typeof weatherTable[rawDashboard.weather.weatherCode] === "string" ? weatherTable[rawDashboard.weather.weatherCode] : "??";
    const precipitation = typeof rawDashboard.weather.precipitation === "number" ? rawDashboard.weather.precipitation : 0;
    const windSpeed = typeof rawDashboard.weather.windSpeed === "number" ? rawDashboard.weather.windSpeed : 0;
    const windDirection = typeof rawDashboard.weather.windDirection === "number" ? rawDashboard.weather.windDirection : 0;
    const sunrise = typeof rawDashboard.weather.sunrise === "string" ? new Date(rawDashboard.weather.sunrise) : "";
    const sunset = typeof rawDashboard.weather.sunset === "string" ? new Date(rawDashboard.weather.sunset) : "";
    const daylightDuration = typeof rawDashboard.weather.daylight_duration === "number" ? rawDashboard.weather.daylight_duration : 0;

    const hourlyTemperature = hourlyWeather.hourly.temperature_2m;
    const yearlyWeatherData = formatYearlyWeatherData(yearlyWeather);

    const coordinates = rawTraffic.coordinates;

    return {
        name: cityName,
        temperature: temperature.toFixed(1) + "°",
        cameraLinks : relatedCameraLinks,
        weather,
        precipitation,
        windSpeed,
        windDirection,
        averageVehicleSpeed,
        vehicleCount,
        averageMonthlyCars,
        daylightDuration,
        sunrise: sunrise.getHours() + ":" + sunrise.getMinutes() || "08:30",
        sunset: sunset.getHours() + ":" + sunset.getMinutes() || "16:30",
        hourlyTemperature,
        yearlyWeatherData,
        yearlyTraffic,
        coordinates
    };
}

/**
 * Format raw yearly hourly weather data into a structured object grouped by month.
 * 
 * @param {Object} yearlyWeather - Raw yearly weather data.
 * @returns {Object} Object with keys as YYYY-MM and values containing arrays for each weather field.
 */
function formatYearlyWeatherData(yearlyWeather) {
    
    const {time, ...dataFields} = yearlyWeather.hourly;

    const result = {};

    time.forEach((t, index) => {

        const date = new Date(t);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        if (!result[monthKey]) {
            result[monthKey] = {};
            for (const field in dataFields) {
                result[monthKey][field] = [];
            }
        }

        for (const field in dataFields) {
            result[monthKey][field].push(dataFields[field][index]);
        }

    });

    return result;
}