import "../../pages/dashboard/Dashboard.css"

export function TableLine({ date, speed, numCars, rain, temp }) {
    return (
        <tr className="line">
            <td className="left">{date}</td>
            <td className="center">{speed}</td>
            <td className="center">{numCars}</td>
            <td className="center">{rain}</td>
            <td className="right">{temp}</td>
        </tr>
    );
}