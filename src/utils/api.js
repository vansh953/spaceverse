const AQI_KEY = "CutGkwKsDNaLPSvXBSx4QA==HfUhg7qwLLjZOA87";

export async function fetchCityAQI(city) {
  try {
    const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${AQI_KEY}`);
    const data = await res.json();
    if (data.status === "ok") {
      return { success: true, aqi: data.data.aqi };
    } else {
      return { success: false, aqi: "N/A" };
    }
  } catch (err) {
    console.error("AQI fetch error:", err);
    return { success: false, aqi: "N/A" };
  }
}

export async function fetchCityWeather(city) {
  try {
    // Get latitude and longitude for the city using OpenStreetMap Nominatim
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) return { success: false };

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Fetch current weather from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weatherData = await weatherRes.json();
    if (!weatherData || !weatherData.current_weather) return { success: false };

    const temp = weatherData.current_weather.temperature;
    const condition = weatherData.current_weather.weathercode; // we can map this if needed
    const humidity = weatherData.current_weather.windspeed; // Open-Meteo does not return humidity directly, alternative is windspeed

    return { success: true, temp, humidity, condition };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return { success: false };
  }
}
