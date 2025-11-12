const API_KEY = "e7b235b89c5e4c6b8d3140923251211";

export const fetchCityWeather = async (city) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) {
      console.error("Weather fetch error:", data.message);
      return { success: false, temp: "N/A", humidity: "N/A", condition: "N/A" };
    }

    return {
      success: true,
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather?.[0]?.description || "N/A",
    };
  } catch (err) {
    console.error("Weather API error:", err);
    return { success: false, temp: "N/A", humidity: "N/A", condition: "N/A" };
  }
};

export const fetchCityAQI = async (city) => {
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();

    if (!geoData.length) {
      console.error("City not found for AQI:", city);
      return { success: false, aqi: "N/A" };
    }

    const { lat, lon } = geoData[0];
    const aqiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const aqiData = await aqiRes.json();

    if (!aqiData.list?.length) return { success: false, aqi: "N/A" };

    const aqiValue = aqiData.list[0].main.aqi;
    return { success: true, aqi: aqiValue };
  } catch (err) {
    console.error("AQI API error:", err);
    return { success: false, aqi: "N/A" };
  }
};

