export const fetchProjects = async (query) => {
  try {
    const res = await fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);
    if (!res.ok) throw new Error("Failed to fetch NASA project data");

    const data = await res.json();

    const items = data.collection?.items?.slice(0, 20).map((item) => ({
      title: item.data[0]?.title || "Untitled Project",
      description: item.data[0]?.description || "No description available.",
      image: item.links?.[0]?.href || "",
      dateCreated: item.data[0]?.date_created
        ? new Date(item.data[0].date_created).toDateString()
        : "Unknown Date",
    }));

    return items || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
