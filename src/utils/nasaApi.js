
export const fetchAPOD = async () => {
  const apiKey = "fyli9xiU2edhO23XCoXbhOZexAmzLWy3NWwttEdU";

  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to Load APOD: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("🚨 Error fetching NASA APOD:", error);
    throw error;
  }
};
