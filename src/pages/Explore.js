import React, { useState, useEffect, useRef, useCallback } from "react";
import "../style/explore.css";

function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Wrap fetchData in useCallback to make it stable for useEffect
  const fetchData = useCallback(async (searchQuery, currentPage = 1) => {
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://images-api.nasa.gov/search?q=${searchQuery}&page=${currentPage}`
      );
      const data = await res.json();
      const newItems = data.collection.items || [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) =>
          currentPage === 1 ? newItems : [...prev, ...newItems]
        );
      }
    } catch (error) {
      console.error("Error fetching NASA data:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setPage(1);
      setHasMore(true);
      return;
    }
    const delay = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchData(query, 1);
    }, 500);
    return () => clearTimeout(delay);
  }, [query, fetchData]); // ✅ add fetchData

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          results.length > 0
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current; // ✅ copy ref for cleanup
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [results, loading, hasMore]);

  useEffect(() => {
    if (page > 1 && hasMore) fetchData(query, page);
  }, [page, fetchData, query, hasMore]); // ✅ include dependencies

  return (
    <div className="explore-page">
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
            return (
              <div
                className="result-card"
                key={index}
                onClick={() =>
                  setSelectedItem({
                    title: data.title,
                    description: data.description || "No description available.",
                    image,
                    date: data.date_created,
                  })
                }
              >
                <img src={image} alt={data.title} />
                <div className="card-info">
                  <h3>{data.title}</h3>
                  <p>
                    {data.description
                      ? data.description.substring(0, 120) + "..."
                      : "No description available"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore ? (
          <div ref={loaderRef} className="loading-trigger"></div>
        ) : (
          results.length > 0 && (
            <p className="loading-text">🚀 End of cosmic results.</p>
          )
        )}

        {selectedItem && (
          <div className="modal-overlay">
            <div className="modal-content">
              {selectedItem.image && (
                <img src={selectedItem.image} alt={selectedItem.title} />
              )}
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>
              {selectedItem.date && <p className="date">🕒 {selectedItem.date}</p>}
              <button
                className="modal-close"
                onClick={() => setSelectedItem(null)}
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
