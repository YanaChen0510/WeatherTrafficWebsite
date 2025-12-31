import { Line } from "react-chartjs-2";

export const TemperatureLineGraph = ({hourly}) => {

    const temperatures = hourly ?? [];
    console.log("temperatures", temperatures);
    const labels = hourly?.map((hour, index) => (index < 10 ? "0" : "") + index + ":00") ?? [];

    const data = {
        labels,
        datasets : [{
            label: "Hourly temperature",
            data : temperatures,
            pointRadius: 0,
            borderWidth: 1,
            fill: true,
            borderColor: "black",
            backgroundColor: "white",
            tension: 0.4
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false,
                    min: -20,
                    max: 30
                }
            }
        }
    };

    return (
        <div style={{width: "98%", margin: "auto", height: "200px"}}>
            <Line data={data} options={options}></Line>
        </div>
    )

}