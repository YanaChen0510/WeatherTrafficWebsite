import { Scatter } from "react-chartjs-2";
import { calculateLinearRegression } from "../../utils/charts";

/**
 * Removes outliers from an array of { x, y } samples using Z-score filtering.
 *
 * @param {Array<{x:number, y:number}>} samples - Array of points to filter
 * @param {number} [zLimit=2.5] - Maximum allowed Z-score for x and y
 * @returns {Array<{x:number, y:number}>} Filtered array with outliers removed
 */
function removeOutliers(samples, zLimit = 2.5) {
    if (!samples.length) return samples;

    const xs = samples.map(s => s.x);
    const ys = samples.map(s => s.y);

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = arr => Math.sqrt(avg(arr.map(v => (v - avg(arr)) ** 2)));

    const meanX = avg(xs);
    const stdX = std(xs);

    const meanY = avg(ys);
    const stdY = std(ys);

    return samples.filter(s => {
        const zx = Math.abs((s.x - meanX) / stdX);
        const zy = Math.abs((s.y - meanY) / stdY);
        return zx < zLimit && zy < zLimit;
    });
}

export const PrecipitationScatterGraph = ({ yearlyTraffic, yearlyWeather }) => {

    if (!yearlyTraffic?.averageSpeed || !yearlyWeather) {
        return <div style={{ textAlign: "center", padding: 20 }}>
            Missing yearly data
        </div>;
    }

    const dailyPrecip = {};

    Object.entries(yearlyWeather).forEach(([month, data]) => {
        const precipArr = data.precipitation;
        if (!Array.isArray(precipArr)) return;

        const year = month.split("-")[0];
        const monthNum = parseInt(month.split("-")[1], 10);

        let dayIndex = 1;
        for (let i = 0; i < precipArr.length; i += 24) {
            const sum = precipArr.slice(i, i + 24).reduce((a, b) => a + b, 0);
            const dayStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(dayIndex).padStart(2, "0")}`;
            dailyPrecip[dayStr] = sum;
            dayIndex++;
        }
    });

    let samples = Object.entries(yearlyTraffic.averageSpeed)
        .filter(([date]) => dailyPrecip[date] !== undefined)
        .map(([date, speed]) => ({
            x: dailyPrecip[date],
            y: speed
        }));

    if (!samples.length) {
        return <div style={{ textAlign: "center", padding: 20 }}>
            No overlapping precipitation/speed data
        </div>;
    }

    const filteredSamples = removeOutliers(samples);

    if (!filteredSamples.length) {
        return <div style={{ textAlign: "center", padding: 20 }}>
            All points were outliers — graph unavailable
        </div>;
    }

    const { lineData } = calculateLinearRegression(filteredSamples);
    const line = lineData.sort((a, b) => a.x - b.x);


    const data = {
        datasets: [
            {
                label: "Trend",
                data: line,
                type: "line",
                borderColor: "black",
                pointRadius: 0,
                fill: false,
            },
            {
                label: "Daily Precipitation vs Speed",
                data: filteredSamples,
                pointRadius: 6,
                backgroundColor: "white",
                borderColor: "black",
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: { title: { display: true, text: "Daily Precipitation (mm)" } },
            y: { title: { display: true, text: "Average Speed (km/h)" } }
        }
    };

    return (
        <div style={{ width: "98%", height: 400, margin: "auto" }}>
            <Scatter data={data} options={options} />
        </div>
    );
};
