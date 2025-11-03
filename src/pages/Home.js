import React, { useEffect, useState } from "react";
import "../style/home.css";

const Home = () => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "FxIeEJ1RgbQCVNhaV4NfydbDcNj5mhEKwjmHaSJE";

  const fetchAPOD = async (url) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch NASA APOD");
      const data = await res.json();
      setApod(data);
    } catch (err) {
      console.error("❌ Error fetching NASA APOD:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Default - Today's APOD
  useEffect(() => {
    fetchAPOD(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = apod.hdurl || apod.url;
    link.download = `${apod.title}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: apod.title,
          text: "Check out this NASA Astronomy Picture of the Day!",
          url: apod.url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported on this device/browser.");
    }
  };

  const handleRandom = () => {
    const randomDate = () => {
      const start = new Date(1996, 5, 16); // APOD start date
      const end = new Date();
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return date.toISOString().split("T")[0];
    };
    const date = randomDate();
    fetchAPOD(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`);
  };

  if (loading) return <div className="home-loading">🚀 Loading NASA Image...</div>;
  if (error) return <div className="home-error">❌ Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="apod-card">
        <div className="apod-left">
          {apod.media_type === "image" ? (
            <img src={apod.url} alt={apod.title} className="apod-image" />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              className="apod-video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>

        <div className="apod-right">
          <h1 className="home-title">Astronomy Picture of the Day</h1>
          <h2>{apod.title}</h2>
          <p className="apod-date">📅 {apod.date}</p>
          <p className="apod-explanation">{apod.explanation}</p>

          <div className="button-container">
            <button className="btn download-btn" onClick={handleDownload}>
              ⬇️ Download
            </button>
            <button className="btn share-btn" onClick={handleShare}>
              📤 Share
            </button>
            <button className="btn random-btn" onClick={handleRandom}>
              🎲 Random Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

