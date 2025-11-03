import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import "../style/earth.css";

export default function Earth() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [selectedEq, setSelectedEq] = useState(null);
  const [details, setDetails] = useState(null);
  const [stats, setStats] = useState({ co2: null, temp: null, ice: null });
  const wrapperRef = useRef();
  const [size, setSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      try {
        const res = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
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
            url: eq.properties.url,
          }));
        setEarthquakes(latest);
      } catch (e) {
        console.error(e);
      }
    };
    const fetchStats = () =>
      setStats({ co2: 419.2, temp: 1.12, ice: 5.45 });

    fetchEarthquakeData();
    fetchStats();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setSize({
        w: Math.max(300, Math.floor(rect.width)),
        h: Math.max(300, Math.floor(rect.height)),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewDetails = async (eq) => {
    try {
      const res = await fetch(
        `https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/${eq.id}.geojson`
      );
      const data = await res.json();
      setDetails({
        place: eq.place,
        magnitude: eq.mag,
        depth: eq.depth,
        coords: `${eq.lat.toFixed(2)}, ${eq.lng.toFixed(2)}`,
        time: eq.time,
        url: data.properties?.url || eq.url,
      });
    } catch (err) {
      console.error(err);
      setDetails({
        place: eq.place,
        magnitude: eq.mag,
        depth: eq.depth,
        coords: `${eq.lat.toFixed(2)}, ${eq.lng.toFixed(2)}`,
        time: eq.time,
        url: eq.url,
      });
    }
  };

  return (
    <div className="earth-layout">
      <div className="earth-left">
        <div className="stat-box">
          <h3>CO₂ Concentration</h3>
          <p>{stats.co2 ? `${stats.co2} ppm` : "Loading..."}</p>
        </div>
        <div className="stat-box">
          <h3>Global Temperature</h3>
          <p>{stats.temp ? `${stats.temp} °C` : "Loading..."}</p>
        </div>
        <div className="stat-box">
          <h3>Arctic Ice Extent</h3>
          <p>{stats.ice ? `${stats.ice} M km²` : "Loading..."}</p>
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
            <button
              className="view-btn"
              onClick={() => handleViewDetails(selectedEq)}
            >
              View Details
            </button>
            <button
              className="close-btn"
              onClick={() => setSelectedEq(null)}
            >
              ×
            </button>
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
            <a href={details.url} target="_blank" rel="noreferrer">
              View on USGS Website
            </a>
            <button
              className="close-modal"
              onClick={() => setDetails(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
