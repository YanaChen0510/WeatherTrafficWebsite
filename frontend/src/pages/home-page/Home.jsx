import './Home.css';
import { InfoBlock, SunBlock } from '../../components/info-block/InfoBlock';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useCity } from '../../services/CityContext';
import { CameraView } from '../../components/camera-view/CameraView';
import { useCityData } from '../../hooks/useCityData';
import { calculateDaylight, getBearingFromDirection } from '../../utils/weather';
import { TemperatureLineGraph } from '../../components/graphs/TemperatureLineGraph';
import { getTrafficStatus } from '../../utils/traffic';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function Home() {
    const { city, loading } = useCity();

    if (loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>Loading...</div>;
    }

    if (!city) {
        return <div style={{padding: '20px', textAlign: 'center', color: 'red'}}>
            Failed to load data. Please check the backend connection.
        </div>;
    }

    useCityData(city);

    return (
        <>
            <div className='main-content'>
                <div className='city-info'>
                    <h1>{city.name}</h1>
                    <p className='temperature'>{city.temperature}</p>
                    <p className='weather'>{city.weather}</p>
                </div>

                <div className='infos'>
                    <div className='data'>
                        <div className='daily-data'>

                            <InfoBlock
                                title={"Wind"}
                                iconSrc={"icons/Wind.png"}
                                data={`${city.windSpeed.toFixed(1)} km/h`}
                                additionalInfo={getBearingFromDirection(city.windDirection)}
                            />

                            <InfoBlock
                                title={"Precipitation"}
                                iconSrc={"icons/CloudRain.png"}
                                data={`${city.precipitation.toFixed(1)} mm`}
                                additionalInfo={`Today`}
                            />

                            <SunBlock
                                title={"Daylight"}
                                iconSrc={"icons/SunIcon.png"}
                                data={calculateDaylight(city.sunrise, city.sunset)}
                                sunrise={city.sunrise}
                                sunset={city.sunset}
                            />

                            <InfoBlock
                                title={"Average speed"}
                                iconSrc={"icons/Car.png"}
                                data={`${city.averageVehicleSpeed.toFixed(1)} km/h`}
                                additionalInfo={`Last hour`}
                            />

                            <InfoBlock
                                title={"Number of cars"}
                                iconSrc={"icons/Commute.png"}
                                data={`${city.vehicleCount}`}
                                additionalInfo={`${((city.vehicleCount / city.averageMonthlyCars) * 100).toFixed(1)}% of the avg.`}
                            />

                            <InfoBlock
                                title={"Traffic Status"}
                                iconSrc={"icons/Box.png"}
                                data={getTrafficStatus(city.averageVehicleSpeed)}
                                additionalInfo={`Based on speed`}
                            />

                        </div>

                        <div className='week-graph'>
                            <TemperatureLineGraph hourly={city.hourlyTemperature} />
                        </div>

                    </div>

                    <CameraView />

                </div>
            </div>
        </>
    );
}