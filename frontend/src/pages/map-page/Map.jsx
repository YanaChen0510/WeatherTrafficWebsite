import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useCity } from "../../services/CityContext";
import { useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export function Map() {
  const { city, cities, loading, setSelectedStation } = useCity();
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  if (!city) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        Failed to load data. Please check the backend connection.
      </div>
    );
  }

  const center = city.coordinates;
  const cityMarkers = cities || [];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "800px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {cityMarkers.map((town, index) => (
        <Marker
          key={index}
          position={[town.coordinates[0], town.coordinates[1]]}
        >
          <Popup>
            <button onClick={() => {
              setSelectedStation(town.id);
              navigate("/");
            }}>
              Show data
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
