import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/landing.css";
import bg from "../assets/bg.jpg";
import rocket from "../assets/smallrocket.jpg";

function Landing() {
  const [launch, setLaunch] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (launch) return;
    setLaunch(true);
    setTimeout(() => {
      navigate("/signin");
    }, 2600);
  };

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="content">
        <h1 className="title">COSMOSCOPE</h1>
        <p className="tagline">Explore the Universe of Possibilities ✨</p>
        <button className="enter-btn" onClick={handleLaunch}>
          Enter the Galaxy
        </button>
      </div>

      <img
        src={rocket}
        alt="rocket"
        className={`rocket ${launch ? "launch" : ""}`}
      />
    </div>
  );
}

export default Landing;
