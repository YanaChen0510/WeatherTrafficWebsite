import './Dashboard.css'
import { useCity } from '../../services/CityContext';
import { computeDailyWeather, calculateRainImpact } from '../../utils/weather';
import { toShortTime } from '../../utils/date';
import { PrecipitationScatterGraph } from '../../components/graphs/PrecipitationScatterGraph';
import { MonthBarGraph } from '../../components/graphs/MonthBarGraph';
import { TableLine } from '../../components/table-line/TableLine';

export function Dashboard() {

    const { city, loading } = useCity();

    if (loading) {
        return <div className='loading-dashboard'>
            Loading dashboard data...
        </div>;
    }

    if (!city) {
        return <div className='error-dashboard'>
            Failed to load data. Please check the backend connection.
        </div>;
    }

    const yearlyWeather = city.yearlyWeatherData || [];
    const yearlyTraffic = city.yearlyTraffic || [];
    const dailyWeather = computeDailyWeather(yearlyWeather);

    console.log(yearlyWeather);
    console.log(yearlyTraffic);

    const allDates = Object.keys(yearlyTraffic.averageSpeed).sort(); // chronological

    const last30Dates = allDates.slice(-30);

    const recent = last30Dates.map(date => ({
        timestamp: date,
        avgSpeedKph: yearlyTraffic.averageSpeed[date],
        vehicleCount: yearlyTraffic.vehicleCount[date],
        precipitationMm: dailyWeather[date]?.precipitationMm ?? 0,
        temperatureC: dailyWeather[date]?.temperatureC ?? null
    }));


    const rainImpact = calculateRainImpact(yearlyWeather, yearlyTraffic);
    console.log(rainImpact);

    return (
        <>
            <h1 className="title-dashboard">
                {city.name} Traffic Summary
            </h1>

            <div className="infos-dashboard">

                <div className="year-stats">
                    <div className="range-info">
                        Total number of vehicles per month ({Object.keys(yearlyTraffic.vehicleCount).length} records)
                    </div>
                    <MonthBarGraph yearlyTraffic={yearlyTraffic} />
                </div>

                <div className="data-wrapper">

                    <div className="data-dashboard">
                        <div className='precipitation-graph-wrapper'>
                            <PrecipitationScatterGraph yearlyTraffic={yearlyTraffic} yearlyWeather={yearlyWeather} />
                        </div>
                        <div className="insights">
                            <p><strong>Rainfall Impact</strong></p>
                            <p>Rainy avg speed: {rainImpact.rainyAvg} km/h</p>
                            <p>Dry avg speed: {rainImpact.dryAvg} km/h</p>
                        </div>
                    </div>

                    <div className="table">
                        <h3>Recent Weather & Traffic Data</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className='left'>Date</th>
                                    <th className='center'>Avg. Speed (km/h)</th>
                                    <th className='center'>Vehicles</th>
                                    <th className='center'>Rain (mm)</th>
                                    <th className='right'>Temp (C°)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.reverse().map((hour, index) => (
                                    <TableLine
                                        key={index}
                                        date={toShortTime(hour.timestamp)}
                                        speed={hour.avgSpeedKph?.toFixed(1)}
                                        numCars={hour.vehicleCount}
                                        rain={hour.precipitationMm?.toFixed(1)}
                                        temp={hour.temperatureC?.toFixed(1)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}