import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import "../style/home.css";
import sunTex from "../assets/sun.jpg";
import mercuryTex from "../assets/mercury.jpg";
import venusTex from "../assets/venus.jpg";
import earthTex from "../assets/earth.jpg";
import marsTex from "../assets/mars.jpg";
import jupiterTex from "../assets/jupiter.jpg";
import saturnTex from "../assets/saturn.jpg";
import uranusTex from "../assets/uranus.jpg";
import neptuneTex from "../assets/neptune.jpg";

// ✅ Planet data (same as before)
const planetsData = [
  {
    name: "Sun",
    size: 2,
    distance: 0,
    speed: 0,
    texture: sunTex,
    info: {
      paragraph: `The Sun is the heart of our solar system, a glowing ball of hot plasma that provides light and energy to all planets. Its immense gravity keeps the solar system bound together.`,
      points: [
        "Type: G-type main-sequence star (Yellow Dwarf)",
        "Diameter: ~1.39 million km",
        "Surface Temperature: ~5,500°C (photosphere)",
        "Core Temperature: ~15 million°C",
        "Composition: About 74% hydrogen and 24% helium",
        "Rotation Period: About 25 Earth days (at equator)",
        "Interesting Fact: The Sun contains 99.86% of the total mass of the solar system.",
      ],
    },
  },
  {
    name: "Mercury",
    size: 0.3,
    distance: 3,
    speed: 0.04,
    texture: mercuryTex,
    info: {
      paragraph: `Mercury is the innermost planet of the solar system and orbits very close to the Sun. Despite being small, it has one of the most extreme temperature ranges of any planet.`,
      points: [
        "Type: Terrestrial (rocky)",
        "Diameter: ~4,880 km",
        "Orbital Period: 88 Earth days",
        "Atmosphere: Extremely thin, mainly oxygen, sodium, hydrogen, helium",
        "Surface: Covered with craters and rocky plains; no liquid water",
        "Moons: None",
        "Interesting Fact: A day on Mercury lasts about 176 Earth days.",
      ],
    },
  },
  {
    name: "Venus",
    size: 0.6,
    distance: 4,
    speed: 0.03,
    texture: venusTex,
    info: {
      paragraph: `Venus, the second planet from the Sun, is often called Earth’s twin because of its similar size and mass. However, its thick, toxic atmosphere traps heat, making it the hottest planet in the solar system.`,
      points: [
        "Type: Terrestrial",
        "Diameter: ~12,104 km",
        "Orbital Period: 225 Earth days",
        "Atmosphere: Thick clouds of carbon dioxide and sulfuric acid",
        "Surface: Rocky with mountains, volcanoes, and vast plains",
        "Moons: None",
        "Interesting Fact: Venus rotates in the opposite direction to most planets.",
      ],
    },
  },
  {
    name: "Earth",
    size: 0.65,
    distance: 5,
    speed: 0.02,
    texture: earthTex,
    info: {
      paragraph: `Earth is the third planet from the Sun and the only known planet to support life. Its unique combination of water, atmosphere, and suitable temperatures makes it a haven for life.`,
      points: [
        "Type: Terrestrial",
        "Diameter: ~12,742 km",
        "Orbital Period: 365.25 days",
        "Atmosphere: Nitrogen (78%), oxygen (21%), trace gases",
        "Surface: Oceans, mountains, forests, deserts, polar ice caps",
        "Moons: One (Moon)",
        "Interesting Fact: Earth’s magnetic field protects life from harmful solar radiation.",
      ],
    },
  },
  {
    name: "Mars",
    size: 0.5,
    distance: 6,
    speed: 0.018,
    texture: marsTex,
    info: {
      paragraph: `Mars, often called the Red Planet, is known for its reddish appearance caused by iron oxide on its surface. Evidence suggests it may have had liquid water long ago.`,
      points: [
        "Type: Terrestrial",
        "Diameter: ~6,779 km",
        "Orbital Period: 687 Earth days",
        "Atmosphere: Thin, mostly carbon dioxide with traces of nitrogen and argon",
        "Surface: Deserts, volcanoes, valleys, polar ice caps",
        "Moons: Two (Phobos and Deimos)",
        "Interesting Fact: Mars has the tallest volcano in the solar system.",
      ],
    },
  },
  {
    name: "Jupiter",
    size: 1.2,
    distance: 8,
    speed: 0.01,
    texture: jupiterTex,
    info: {
      paragraph: `Jupiter is the largest planet in the solar system, a massive gas giant with a strong magnetic field and a complex system of rings and moons.`,
      points: [
        "Type: Gas giant",
        "Diameter: ~139,820 km",
        "Orbital Period: 11.86 Earth years",
        "Atmosphere: Hydrogen and helium",
        "Surface: Thick gas layers, no solid surface",
        "Moons: Over 95 known moons",
        "Interesting Fact: Jupiter’s Great Red Spot is a storm larger than Earth.",
      ],
    },
  },
  {
    name: "Saturn",
    size: 1,
    distance: 10,
    speed: 0.008,
    texture: saturnTex,
    info: {
      paragraph: `Saturn is known for its stunning ring system made of ice and rock particles, making it one of the most beautiful objects in the sky.`,
      points: [
        "Type: Gas giant",
        "Diameter: ~116,460 km",
        "Orbital Period: 29.5 Earth years",
        "Atmosphere: Hydrogen and helium",
        "Surface: Gaseous outer layers",
        "Moons: Over 80 known moons",
        "Interesting Fact: Its rings can extend up to 280,000 km wide but are only 10 meters thick.",
      ],
    },
  },
  {
    name: "Uranus",
    size: 0.8,
    distance: 12,
    speed: 0.006,
    texture: uranusTex,
    info: {
      paragraph: `Uranus is an ice giant with a unique sideways rotation, which causes extreme seasonal changes. Its blue-green color comes from methane in the atmosphere.`,
      points: [
        "Type: Ice giant",
        "Diameter: ~50,724 km",
        "Orbital Period: 84 Earth years",
        "Atmosphere: Hydrogen, helium, methane",
        "Moons: 27 known moons",
        "Interesting Fact: Uranus rotates almost perpendicular to its orbit.",
      ],
    },
  },
  {
    name: "Neptune",
    size: 0.8,
    distance: 14,
    speed: 0.005,
    texture: neptuneTex,
    info: {
      paragraph: `Neptune is the farthest planet from the Sun, with supersonic winds and a deep blue hue due to methane in its atmosphere.`,
      points: [
        "Type: Ice giant",
        "Diameter: ~49,244 km",
        "Orbital Period: 165 Earth years",
        "Atmosphere: Hydrogen, helium, methane",
        "Moons: 14 known moons",
        "Interesting Fact: Neptune’s winds can reach speeds up to 2,100 km/h.",
      ],
    },
  },
];

// ✅ Single planet orbit model (same as before)
function Planet({ data, isPaused, speedMultiplier, onClick }) {
  const meshRef = useRef();
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  const texture = useTexture(data.texture);

  useFrame(() => {
    if (!isPaused && data.distance > 0) {
      setAngle((prev) => prev + data.speed * speedMultiplier);
      meshRef.current.position.x = Math.cos(angle) * data.distance;
      meshRef.current.position.z = Math.sin(angle) * data.distance;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} onClick={() => onClick(data)}>
      <sphereGeometry args={[data.size, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color("#ffaa55")}
        emissiveIntensity={0.4}
        emissiveMap={texture}
      />
    </mesh>
  );
}

// ✅ 3D Interactive Planet Preview component
function PlanetPreview({ texture }) {
  const tex = useTexture(texture);
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        map={tex}
        emissive={"#222"}
        emissiveIntensity={0.4}
        metalness={0.3}
        roughness={0.5}
      />
    </mesh>
  );
}

// ✅ Main Home component
export default function Home() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  return (
    <div className="home-container">
      <button className="pause-btn" onClick={() => setIsPaused(!isPaused)}>
        {isPaused ? "Resume Motion" : "Stop Motion"}
      </button>

      <div className="speed-slider">
        <label>Planet Speed:</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.01"
          value={speedMultiplier}
          onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
        />
        <span>{speedMultiplier.toFixed(2)}x</span>
      </div>

      <Canvas camera={{ position: [0, 15, 30], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight intensity={2} position={[0, 0, 0]} />

        {planetsData.map((planet) => (
          <Planet
            key={planet.name}
            data={planet}
            isPaused={isPaused}
            speedMultiplier={speedMultiplier}
            onClick={setSelectedPlanet}
          />
        ))}

        {planetsData
          .filter((p) => p.distance > 0)
          .map((planet) => (
            <mesh key={planet.name + "orbit"} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[planet.distance - 0.01, planet.distance + 0.01, 128]}
              />
              <meshBasicMaterial color="#555" side={THREE.DoubleSide} />
            </mesh>
          ))}

        <OrbitControls enableZoom={true} />
      </Canvas>

      {selectedPlanet && (
        <div className="planet-detail">
          <div className="planet-image">
            {/* ✅ Interactive 3D Planet instead of Image */}
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} />
              <PlanetPreview texture={selectedPlanet.texture} />
              <OrbitControls enableZoom={true} />
            </Canvas>
          </div>
          <div className="planet-info">
            <h2>{selectedPlanet.name}</h2>
            <p style={{ marginBottom: "20px", whiteSpace: "pre-line" }}>
              {selectedPlanet.info.paragraph}
            </p>
            <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
              {selectedPlanet.info.points.map((point, index) => (
                <li key={index} style={{ marginBottom: "10px", lineHeight: "1.6" }}>
                  {point}
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedPlanet(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="background-stars"></div>
    </div>
  );
}
