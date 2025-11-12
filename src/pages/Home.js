import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import "../style/home.css";

export default function Home() {
  const globeRefs = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const planetConfigs = [
    { name: "Mercury", radius: 3, speed: 0.7, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/mercury.jpg" },
    { name: "Venus", radius: 5, speed: 0.6, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/venus.jpg" },
    { name: "Earth", radius: 7, speed: 0.5, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/earth_daymap.jpg" },
    { name: "Mars", radius: 9, speed: 0.45, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/mars.jpg" },
    { name: "Jupiter", radius: 13, speed: 0.35, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/jupiter.jpg" },
    { name: "Saturn", radius: 17, speed: 0.3, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/saturn.jpg" },
    { name: "Uranus", radius: 21, speed: 0.25, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/uranus.jpg" },
    { name: "Neptune", radius: 25, speed: 0.2, texture: "https://planet-textures.nyc3.digitaloceanspaces.com/neptune.jpg" },
  ];

  useEffect(() => {
    let frameId;
    const animate = () => {
      if (!isPaused) {
        const time = Date.now() * 0.0002;
        globeRefs.current.forEach((globe, i) => {
          if (globe) {
            const config = planetConfigs[i];
            const angle = time * config.speed;
            const x = Math.cos(angle) * config.radius * 15;
            const z = Math.sin(angle) * config.radius * 15;
            globe.style.transform = `translate3d(${x}px, 0px, ${z}px)`;
          }
        });
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const handlePlanetClick = async (planetName) => {
    try {
      const res = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${planetName.toLowerCase()}`);
      const data = await res.json();
      setSelectedPlanet(data);
    } catch (err) {
      console.error("Planet data fetch error:", err);
    }
  };

  return (
    <div className="solar-layout">
      <h1 className="solar-title">🌞 The Solar System</h1>
      <div className="sun" />
      <button className="pause-btn" onClick={() => setIsPaused((p) => !p)}>
        {isPaused ? "▶️ Play" : "⏸️ Stop"}
      </button>
      <div className="planets-container">
        {planetConfigs.map((planet, i) => (
          <div key={planet.name} className="planet-wrapper">
            <div
              className="planet-globe"
              ref={(el) => (globeRefs.current[i] = el)}
              onClick={() => handlePlanetClick(planet.name)}
            >
              <Globe
                globeImageUrl={planet.texture}
                width={80}
                height={80}
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={false}
              />
              <p className="planet-label">{planet.name}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPlanet && (
        <div className="planet-modal">
          <div className="modal-content">
            <h2>{selectedPlanet.englishName}</h2>
            <p><strong>Gravity:</strong> {selectedPlanet.gravity} m/s²</p>
            <p><strong>Density:</strong> {selectedPlanet.density}</p>
            <p><strong>Mass:</strong> {selectedPlanet.mass?.massValue} ×10^{selectedPlanet.mass?.massExponent} kg</p>
            <p><strong>Discovery:</strong> {selectedPlanet.discoveryDate || "Unknown"}</p>
            <button className="close-modal" onClick={() => setSelectedPlanet(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
