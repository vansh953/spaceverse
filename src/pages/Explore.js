import React, { useState, useEffect } from "react";
import "../style/explore.css";

function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
          const data = await res.json();
          setResults(data.collection.items || []);
        } catch (error) {
          console.error("Error fetching NASA data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="explore-page">
      <div className="star-layer"></div>
      <div className="explore-overlay">
        <h1 className="explore-title">✨ Explore the Multiverse ✨</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search galaxies, planets, or stars..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && <p className="loading-text">🌠 Searching the cosmos...</p>}

        <div className="results-grid">
          {results.map((item, index) => {
            const data = item.data[0];
            const image = item.links ? item.links[0].href : "";
            const title = data.title;
            const desc = data.description?.slice(0, 120) || "No description available";
            const nasaLink = data.nasa_id
              ? `https://images.nasa.gov/details-${data.nasa_id}`
              : "#";

            return (
              <a
                href={nasaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="result-card"
                key={index}
              >
                <img src={image} alt={title} />
                <div className="card-info">
                  <h3>{title}</h3>
                  <p>{desc}...</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Explore;
