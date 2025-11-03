import React, { useEffect, useState } from "react";
import "../style/Project.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");

  const fetchWikipediaProjects = async (searchQuery) => {
    try {
      const url = searchQuery
        ? `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&exintro&explaintext&piprop=original&generator=search&gsrsearch=${searchQuery}`
        : `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages|extracts&exintro&explaintext&piprop=original&generator=search&gsrsearch=space%20missions`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.query && data.query.pages) {
        const items = Object.values(data.query.pages).map((page) => ({
          title: page.title,
          description: page.extract || "No description available.",
          image: page.original?.source || "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg",
          dateCreated: "From Wikipedia",
        }));
        setProjects(items);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching Wikipedia data:", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchWikipediaProjects();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchWikipediaProjects(query);
    }, 700);
    return () => clearTimeout(delay);
  }, [query]);

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
            <div key={index} className="project-card">
              <div className="image-box">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h2>{project.title}</h2>
                <p>{project.description.substring(0, 150)}...</p>
                <span className="date">📘 {project.dateCreated}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No projects found. Try another search.</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
