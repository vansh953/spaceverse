import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import "../style/earth.css";
import { fetchCityAQI, fetchCityWeather } from "../utils/api";

export default function Earth() {
  const [city, setCity] = useState("Delhi");
  const [cityData, setCityData] = useState({
    aqi: null,
    temp: null,
    humidity: null
  });
  const [earthquakes, setEarthquakes] = useState([]);
  const [selectedEq, setSelectedEq] = useState(null);
  const [details, setDetails] = useState(null);
  const wrapperRef = useRef();
  const [size, setSize] = useState({ w: 800, h: 600 });

  const fetchEarthquakeData = async () => {
    try {
      const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
      const json = await res.json();
      const latest = (json.features || [])
        .slice(0, 5)
        .map((eq) => ({
          id: eq.id,
          lat: eq.geometry.coordinates[1],
          lng: eq.geometry.coordinates[0],
          depth: eq.geometry.coordinates[2],
          mag: eq.properties.mag,
          place: eq.properties.place,
          time: new Date(eq.properties.time).toLocaleString(),
          url: eq.properties.url
        }));
      setEarthquakes(latest);
    } catch (e) {
      console.error(e);
      setEarthquakes([]);
    }
  };

  const fetchCityDetails = async (cityName) => {
    const weatherResult = await fetchCityWeather(cityName);
    const aqiResult = await fetchCityAQI(cityName);

    setCityData({
      aqi: aqiResult.success ? aqiResult.aqi : "N/A",
      temp: weatherResult.success ? weatherResult.temp : null,
      humidity: weatherResult.success ? weatherResult.humidity : null
    });
  };

  useEffect(() => {
    fetchEarthquakeData();
    fetchCityDetails(city);
    const interval = setInterval(() => {
      fetchEarthquakeData();
      fetchCityDetails(city);
    }, 300000);
    return () => clearInterval(interval);
  }, [city]);

  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setSize({
        w: Math.max(300, Math.floor(rect.width)),
        h: Math.max(300, Math.floor(rect.height))
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewDetails = async (eq) => {
    try {
      const res = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${eq.id}.geojson`);
      const data = await res.json();
      setDetails({
        place: eq.place,
        magnitude: eq.mag,
        depth: eq.depth,
        coords: `${eq.lat.toFixed(2)}, ${eq.lng.toFixed(2)}`,
        time: eq.time,
        url: data.properties?.url || eq.url
      });
    } catch (err) {
      console.error(err);
      setDetails({
        place: eq.place,
        magnitude: eq.mag,
        depth: eq.depth,
        coords: `${eq.lat.toFixed(2)}, ${eq.lng.toFixed(2)}`,
        time: eq.time,
        url: eq.url
      });
    }
  };

  const tempColor = (temp) => {
    if (temp == null) return "#ccc";
    if (temp < 10) return "#00f";
    if (temp < 25) return "#0f0";
    if (temp < 35) return "#ff0";
    return "#f00";
  };

  return (
    <div className="earth-layout">
      <div className="earth-left">
        <div className="stat-box">
          <h3>🏙️ City: {city}</h3>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="city-input"
          />
        </div>

        <div className="stat-box">
          <h3>🌀 AQI</h3>
          <p>{cityData.aqi !== null ? cityData.aqi : "Loading..."}</p>
        </div>

        <div className="stat-box">
          <h3>🌡️ Temperature</h3>
          <p style={{ color: tempColor(cityData.temp) }}>
            {cityData.temp !== null ? `${cityData.temp} °C` : "N/A"}
          </p>
        </div>

        <div className="stat-box">
          <h3>💧 Humidity</h3>
          <p>{cityData.humidity !== null ? `${cityData.humidity}%` : "N/A"}</p>
        </div>
      </div>

      <div className="earth-center">
        <div className="globe-wrapper" ref={wrapperRef}>
          <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={earthquakes}
            pointLat={(d) => d.lat}
            pointLng={(d) => d.lng}
            pointAltitude={0.02}
            pointColor={() => "rgba(255,60,60,0.9)"}
            pointRadius={0.55}
            pointLabel={(d) => `${d.place}\nMagnitude: ${d.mag}\n${d.time}`}
            onPointClick={(d) => setSelectedEq(d)}
            width={size.w}
            height={size.h}
            showAtmosphere={true}
            atmosphereAltitude={0.12}
          />
        </div>

        {selectedEq && (
          <div className="popup">
            <h4>{selectedEq.place}</h4>
            <p>Magnitude: {selectedEq.mag}</p>
            <button className="view-btn" onClick={() => handleViewDetails(selectedEq)}>
              View Details
            </button>
            <button className="close-btn" onClick={() => setSelectedEq(null)}>×</button>
          </div>
        )}
      </div>

      <div className="earth-right">
        {earthquakes.length > 0 ? (
          earthquakes.map((eq) => (
            <div className="quake-card" key={eq.id}>
              <h4>{eq.place}</h4>
              <p>Magnitude: {eq.mag}</p>
              <span>{eq.time}</span>
            </div>
          ))
        ) : (
          <p className="loading">Fetching data...</p>
        )}
      </div>

      {details && (
        <div className="details-modal">
          <div className="details-content">
            <h3>{details.place}</h3>
            <p><strong>Magnitude:</strong> {details.magnitude}</p>
            <p><strong>Depth:</strong> {details.depth} km</p>
            <p><strong>Coordinates:</strong> {details.coords}</p>
            <p><strong>Time:</strong> {details.time}</p>
            <a href={details.url} target="_blank" rel="noreferrer">View on USGS Website</a>
            <button className="close-modal" onClick={() => setDetails(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
