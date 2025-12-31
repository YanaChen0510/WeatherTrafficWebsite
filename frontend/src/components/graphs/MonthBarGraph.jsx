import { Bar } from "react-chartjs-2";
import {
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from "chart.js";
import ChartJS from "chart.js/auto";
import { aggregateMonthlyVehicleCountsFromYearly } from "../../utils/traffic";
import { calculateStepSize} from "../../utils/charts";
import { getCurrentYearMonth } from "../../utils/date";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MonthBarGraph = ({ yearlyTraffic }) => {
    const { year, month: currentMonth } = getCurrentYearMonth();
    const monthlyTotals = aggregateMonthlyVehicleCountsFromYearly(yearlyTraffic, year);


    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        .map((label, index) => (index <= currentMonth ? label : ""));

    const stepSize = calculateStepSize(monthlyTotals.slice(0, currentMonth + 1));

    const data = {
        labels: monthLabels,
        datasets: [{
            label: `${year} Monthly Vehicle Count`,
            data: monthlyTotals,
            backgroundColor: ctx =>
                ctx.dataIndex > currentMonth ? "#e0e0e0" : "black",
            borderRadius: 12,
            barThickness: 20,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { 
                    stepSize 
                },
                grid: { 
                    display: false 
                }
            },
            x: { 
                grid: { 
                    display: false 
                } 
            }
        }
    };

    return (
        <div style={{ width: "98%", height: "300px", margin: "auto" }}>
            <Bar data={data} options={options} />
        </div>
    );
};
