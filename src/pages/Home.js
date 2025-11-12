import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "../style/home.css";
import mercuryTex from "../assets/mercury.jpg";
import venusTex from "../assets/venus.jpg";
import earthTex from "../assets/earth.jpg";
import marsTex from "../assets/mars.jpg";
import jupiterTex from "../assets/jupiter.jpg";
import saturnTex from "../assets/saturn.jpg";
import uranusTex from "../assets/uranus.jpg";
import neptuneTex from "../assets/neptune.jpg";

const planetsData = [
  { name: "Mercury", size: 0.3, distance: 3, speed: 0.04, texture: mercuryTex, info: "Closest planet to Sun", height: "4,879 km", unique: "Smallest planet", lat: "0", lon: "0" },
  { name: "Venus", size: 0.6, distance: 3, speed: 0.03, texture: venusTex, info: "Hottest planet", height: "12,104 km", unique: "Thick toxic atmosphere", lat: "0", lon: "0" },
  { name: "Earth", size: 0.65, distance: 4, speed: 0.02, texture: earthTex, info: "Our home planet", height: "12,742 km", unique: "Supports life", lat: "0", lon: "0" },
  { name: "Mars", size: 0.5, distance: 5, speed: 0.018, texture: marsTex, info: "The Red Planet", height: "6,779 km", unique: "Has largest volcano", lat: "0", lon: "0" },
  { name: "Jupiter", size: 1.2, distance: 7, speed: 0.01, texture: jupiterTex, info: "Largest planet", height: "139,820 km", unique: "Gas giant", lat: "0", lon: "0" },
  { name: "Saturn", size: 1, distance: 9, speed: 0.008, texture: saturnTex, info: "Has rings", height: "116,460 km", unique: "Spectacular rings", lat: "0", lon: "0" },
  { name: "Uranus", size: 0.8, distance: 11, speed: 0.006, texture: uranusTex, info: "Ice giant", height: "50,724 km", unique: "Rotates on its side", lat: "0", lon: "0" },
  { name: "Neptune", size: 0.8, distance: 12, speed: 0.005, texture: neptuneTex, info: "Furthest planet", height: "49,244 km", unique: "Strongest winds", lat: "0", lon: "0" },
];

function Planet({ data, isPaused, speedMultiplier, onClick }) {
  const meshRef = useRef();
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const texture = useLoader(THREE.TextureLoader, data.texture);

  useFrame(() => {
    if (!isPaused) {
      setAngle((prev) => prev + data.speed * speedMultiplier);
      meshRef.current.position.x = Math.cos(angle) * data.distance;
      meshRef.current.position.z = Math.sin(angle) * data.distance;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} onClick={() => onClick(data)}>
      <sphereGeometry args={[data.size, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  return (
    <div className="home-container">
      <button className="pause-btn" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Resume Motion" : "Stop Motion"}
      </button>

      {/* Speed Slider */}
      <div className="speed-slider">
        <label>Planet Speed:</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.01"
          value={speedMultiplier}
          onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
        />
        <span>{speedMultiplier.toFixed(2)}x</span>
      </div>

      <Canvas camera={{ position: [0, 15, 30], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight intensity={2} position={[0, 0, 0]} />
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial emissive={"#ffdd00"} emissiveIntensity={2} />
        </mesh>

        {planetsData.map((planet) => (
          <Planet
            key={planet.name}
            data={planet}
            isPaused={isPaused}
            speedMultiplier={speedMultiplier}
            onClick={setSelectedPlanet}
          />
        ))}

        {planetsData.map((planet) => (
          <mesh key={planet.name + "orbit"} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.distance - 0.01, planet.distance + 0.01, 128]} />
            <meshBasicMaterial color="#555" side={THREE.DoubleSide} />
          </mesh>
        ))}

        <OrbitControls enableZoom={true} />
      </Canvas>

      {selectedPlanet && (
        <div className="planet-detail">
          <div className="planet-image">
            <img src={selectedPlanet.texture} alt={selectedPlanet.name} />
          </div>
          <div className="planet-info">
            <h2>{selectedPlanet.name}</h2>
            <p>{selectedPlanet.info}</p>
            <ul>
              <li><strong>Height:</strong> {selectedPlanet.height}</li>
              <li><strong>Distance from Sun:</strong> {selectedPlanet.distance} AU</li>
              <li><strong>Unique Qualities:</strong> {selectedPlanet.unique}</li>
              <li><strong>Latitude:</strong> {selectedPlanet.lat}</li>
              <li><strong>Longitude:</strong> {selectedPlanet.lon}</li>
            </ul>
            <button onClick={() => setSelectedPlanet(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="background-stars"></div>
    </div>
  );
}
