import { createContext, useContext, useState, useEffect } from "react";
import { formatCityData } from "../utils/formatting";
import { fetchDashboardData, fetchWeatherData } from "./api/fetchWeatherData";
import { fetchAllTrafficStations, fetchTrafficData, fetchTrafficStationHistory } from "./api/fetchTrafficData";
import { fetchWeatherCameras, fetchWeatherCamera } from "./api/fetchWeatherCamera";

// Traffic monitoring stations near Tampere
const TAMPERE_STATIONS = {
    TEISKONTIE: {
        id: "23001",
        name: "Tampere Teiskontie",
        description: "Major road east of city center"
    },
    DEFAULT: 23001
};

const CityContext = createContext();

export function CityProvider({ children }) {
    const [city, setCity] = useState(null);
    const [cities, setCities] = useState([]);
    const [weatherCams, setWeatherCams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState(TAMPERE_STATIONS.DEFAULT);

    useEffect(() => {
        let isActive = true;

        async function loadStartupData() {
            const allCities = await fetchAllTrafficStations();
            console.log(allCities);
            const allCameras = await fetchWeatherCameras();

            if (isActive) {
                setCities(allCities);
                setWeatherCams(allCameras);
            }
        }

        loadStartupData();
        return () => { isActive = false; };
    }, []);

    useEffect(() => {
        let isActive = true;

        async function loadCityData() {
            setLoading(true);

            const rawTraffic = await fetchTrafficData(selectedStation);
            console.log("raw traffic", rawTraffic);
            const rawDashboard = await fetchDashboardData(selectedStation);

            const relatedCameras = weatherCams.filter((cam) => {
                const identifier = cam.name.split("_")[0] + cam.name.split("_")[1];
                return (
                    rawDashboard.stationName.split("_")[0] + rawDashboard.municipality === identifier
                );
            });

            const relatedCameraLinks = [];
            for (let cam of relatedCameras) {
                const link = await fetchWeatherCamera(cam.id);
                relatedCameraLinks.push(link);
            }

            const hourlyWeather = await fetchWeatherData(rawDashboard.coordinates[1], rawDashboard.coordinates[0], 0);
            const yearlyWeather = await fetchWeatherData(rawDashboard.coordinates[1], rawDashboard.coordinates[0], 365);

            const yearlyTraffic = await fetchTrafficStationHistory(selectedStation, 365);
            console.log("yearly traffic", yearlyTraffic);

            const formatted = formatCityData(
                rawDashboard,
                rawTraffic,
                hourlyWeather,
                yearlyWeather,
                relatedCameraLinks,
                yearlyTraffic
            );

            if (isActive) {
                setCity(formatted);
                setLoading(false);
            }
        }

        if (weatherCams.length > 0) {
            loadCityData();
        }

        return () => { isActive = false; };
    }, [selectedStation, weatherCams]);

    return (
        <CityContext.Provider value={{
            city,
            cities,
            loading,
            selectedStation,
            setSelectedStation,
            availableStations: TAMPERE_STATIONS
        }}>
            {children}
        </CityContext.Provider>
    );
}

// Hook
export function useCity() {
    return useContext(CityContext);
}