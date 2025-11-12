import React, { useEffect, useState, useCallback } from "react";
import "../style/Project.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Wrap fetchWikipediaProjects in useCallback to stabilize for useEffect
  const fetchWikipediaProjects = useCallback(async (searchQuery, pageNum = 1) => {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&exintro&explaintext&piprop=original&generator=search&gsrsearch=${
        searchQuery || "space missions"
      }&gsrlimit=50&gsroffset=${(pageNum - 1) * 50}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.query && data.query.pages) {
        const items = Object.values(data.query.pages).map((page) => ({
          id: page.pageid,
          title: page.title,
          description:
            page.extract ||
            "No description available. Click Read More for details.",
          image:
            page.original?.source ||
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
          dateCreated: "From Wikipedia",
        }));

        setProjects((prev) =>
          pageNum === 1 ? items : [...prev, ...items]
        );

        setHasMore(items.length === 50);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching Wikipedia data:", err);
      setHasMore(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    setPage(1);
    fetchWikipediaProjects("", 1);
  }, [fetchWikipediaProjects]); // ✅ added dependency

  // Search query effect
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchWikipediaProjects(query, 1);
    }, 700);
    return () => clearTimeout(delay);
  }, [query, fetchWikipediaProjects]); // ✅ added dependency

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]); // ✅ dependency is correct

  // Fetch more pages
  useEffect(() => {
    if (page > 1) fetchWikipediaProjects(query, page);
  }, [page, query, fetchWikipediaProjects]); // ✅ added dependencies

  const fetchFullProject = async (id) => {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&pageids=${id}&format=json&origin=*&prop=extracts|pageimages&explaintext&exsectionformat=plain&piprop=original`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.query && data.query.pages[id]) {
        const page = data.query.pages[id];
        setSelectedProject({
          title: page.title,
          description: page.extract,
          image:
            page.original?.source ||
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
        });
      }
    } catch (error) {
      console.error("Error fetching full project:", error);
    }
  };

  return (
    <div className="projects-container">
      <div className="overlay"></div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search space projects (e.g., Chandrayaan, SpaceX, Mars)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="project-card"
              onClick={() => fetchFullProject(project.id)}
            >
              <div className="image-box">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h2>{project.title}</h2>
                <p>{project.description.substring(0, 200)}...</p>
                <span className="date">📘 {project.dateCreated}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No projects found. Try another search.</p>
        )}
      </div>

      {hasMore && <p className="loading-text">🚀 Loading more projects...</p>}

      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedProject(null)}
            >
              ✖
            </button>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="modal-image"
            />
            <h2>{selectedProject.title}</h2>
            <p className="modal-description">{selectedProject.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
