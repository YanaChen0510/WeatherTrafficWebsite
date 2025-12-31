import { useCity } from "../../services/CityContext";
import { Link } from "react-router-dom";
import { SearchBar } from "../searchbar/SearchBar";

export function TopBar({ showNav, setShowNav, cityName, setCityName }) {

    const { updateCity } = useCity();

    return (
        <>
            <div className="topbar">
                <SearchBar></SearchBar>
                <div className="menu-icon" onClick={() => setShowNav(true)}>
                    <img src="/icons/Menu.png" alt="Menu icon" />
                </div>
            </div>

            {showNav && (
                <div className="nav-menu">
                    <Link to="/" onClick={() => setShowNav(false)}>
                        Home
                    </Link>
                    <Link to="/dashboard" onClick={() => setShowNav(false)}>
                        Dashboard
                    </Link>
                    <Link to="/map" onClick={() => setShowNav(false)}>
                        Map
                    </Link>
                </div>
            )}
        </>
    );
}