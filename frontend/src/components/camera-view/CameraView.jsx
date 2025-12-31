import { use, useState } from "react";
import { useCity } from "../../services/CityContext";
import "./CameraView.css"

export function CameraView() {

    const {city} = useCity();

    const cameraNames = city.cameraLinks.map((cam) => cam.name.split("_")[1] + " " + cam.name.split("_")[2]) || [];
    const cameraUrls = city.cameraLinks.map((cam) => cam.imageUrl[0]?.[0] || "") || [];
    console.log(cameraUrls);

    console.log(city)

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleChange = (e) => {
        setSelectedIndex(Number(e.target.value));
    }

    const currentCameraLabel = cameraNames[selectedIndex] || "No camera available";

    const currentCameraUrl = cameraUrls[selectedIndex] || "";

    const cameraOptions = cameraNames.map((label, index) => {
        return (
            <option value={index} key={index}>
                {label}
            </option>
        );
    })

    return (
        <div 
            className="camera-view"
            style={{
                backgroundImage: `url(${currentCameraUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            >
            <select 
                name="city-select" 
                className="city-select"
                value={selectedIndex}
                onChange={handleChange}
            >
                {cameraOptions}
            </select>

            {
                currentCameraUrl ? "" : (
                    <p className="camera-error-message">No camera feed available</p>
                )
            }

        </div>
    );
    

}