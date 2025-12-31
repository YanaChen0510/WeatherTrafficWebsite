import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/home-page/Home.jsx';
import { Map } from './pages/map-page/Map.jsx';
import { Dashboard } from './pages/dashboard/Dashboard.jsx';
// import { APITest } from './pages/test/APITest.jsx';  // 删除或注释这行
import { useState } from 'react';
import { TopBar } from './components/topbar/Topbar.jsx';

function App() {

    const [showNav, setShowNav] = useState(false);
    const [cityName, setCityName] = useState("");

    return (
        <>
            <TopBar
                showNav={showNav}
                setShowNav={setShowNav}
                cityName={cityName}
                setCityName={setCityName}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<Map />} />
                {/* <Route path="/test" element={<APITest />} /> */}  {/* 删除或注释这行 */}
            </Routes>
        </>
    );
}

export default App;