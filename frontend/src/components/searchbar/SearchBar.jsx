import { useCity } from "../../services/CityContext";
import { useState, useEffect } from "react";

export function SearchBar() {
    const { city, setSelectedStation, cities } = useCity();

    const [cityName, setCityName] = useState("");
    const [allSuggestions, setAllSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
        if (!cities || cities.length === 0) return;

        const parsedNames = cities.map(c => {
            const parts = c.name.split("_");
            return {
                full: c.name,
                human: (parts[1] + " " + parts[2]).trim(),
                id: c.id
            };
        });

        setAllSuggestions(parsedNames);
    }, [cities]);

    useEffect(() => {
        if (!cityName.trim()) {
            setFilteredSuggestions([]);
            return;
        }

        const lower = cityName.toLowerCase();
        setFilteredSuggestions(
            allSuggestions.filter(s => s.human.toLowerCase().includes(lower))
        );
    }, [cityName, allSuggestions]);


    const handleSelectSuggestion = (suggestion) => {
        setCityName(suggestion.human);
        setFilteredSuggestions([]);

        if (suggestion.id) {
            setSelectedStation(suggestion.id);
            setCityName("");
        }
    };


    return (
        <div className="topbar" style={{ position: "relative" }}>
            <input
                className="searchbar"
                type="text"
                value={cityName}
                placeholder="Search for a city..."
                onChange={(e) => setCityName(e.target.value)}
            />

            {filteredSuggestions.length > 0 && (
                <ul
                    className="autocomplete-list"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "200px",
                        backgroundColor: "white",
                        borderRadius: "14px",
                        border: "2px solid black",
                        listStyle: "none",
                        margin: "5px 0 0 0",
                        padding: 0,
                        zIndex: 1000,
                        maxHeight: "150px",
                        overflowY: "auto",
                    }}
                >
                    {filteredSuggestions.map((s, i) => (
                        <li
                            key={i}
                            onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            {s.human}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
