
const API_URL = "https://api.open-meteo.com/v1/forecast";

// Coordinates for Uyo, Akwa Ibom State, Nigeria
const UYO = {
  latitude: 5.0513,
  longitude: 7.9335
};

const elements = {
  temperature: document.getElementById("temperature"),
  condition: document.getElementById("condition"),
  icon: document.getElementById("weather-icon"),
  feelsLike: document.getElementById("feels-like"),
  feelsDetail: document.getElementById("feels-detail"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
  cloud: document.getElementById("cloud"),
  localTime: document.getElementById("local-time"),
  updated: document.getElementById("updated"),
  status: document.getElementById("status"),
  refresh: document.getElementById("refresh-button")
};

function getWeatherDescription(code) {
  const weatherCodes = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Light freezing drizzle", "🌧️"],
    57: ["Dense freezing drizzle", "🌧️"],
    61: ["Slight rain", "🌦️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Light freezing rain", "🌧️"],
    67: ["Heavy freezing rain", "🌧️"],
    71: ["Slight snowfall", "🌨️"],
    73: ["Moderate snowfall", "🌨️"],
    75: ["Heavy snowfall", "❄️"],
    77: ["Snow grains", "🌨️"],
    80: ["Slight rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    85: ["Slight snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
  };

  return weatherCodes[code] || ["Unknown conditions", "🌡️"];
}

async function fetchWeather() {
  elements.refresh.disabled = true;
  elements.status.textContent = "Fetching live weather for Uyo...";
  elements.condition.textContent = "Loading weather...";
  
  const params = new URLSearchParams({
    latitude: UYO.latitude,
    longitude: UYO.longitude,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "wind_speed_10m"
    ].join(","),
    daily: "sunrise,sunset",
    timezone: "Africa/Lagos",
    forecast_days: "1"
  });

  try {
    const response = await fetch(`${API_URL}?${params}`);

    if (!response.ok) {
      throw new Error("Weather service is temporarily unavailable.");
    }

    const data = await response.json();
    const current = data.current;

    if (!current) {
      throw new Error("No current weather data was returned.");
    }

    const [description, icon] = getWeatherDescription(
      current.weather_code
    );

    elements.temperature.textContent =
      Math.round(current.temperature_2m);

    elements.condition.textContent = description;
    elements.icon.textContent =
      current.is_day ? icon : (current.weather_code === 0 ? "🌙" : icon);

    elements.feelsLike.textContent =
      Math.round(current.apparent_temperature);

    elements.feelsDetail.textContent =
      Math.round(current.apparent_temperature);

    elements.humidity.textContent =
      current.relative_humidity_2m;

    elements.wind.textContent =
      Math.round(current.wind_speed_10m);

    elements.cloud.textContent =
      current.cloud_cover;

    elements.localTime.textContent =
      `Akwa Ibom State, Nigeria 🇳🇬 · ${current.time.replace("T", " ")}`;

    elements.updated.textContent =
      new Date().toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos"
      });

    elements.status.textContent =
      "Weather updated successfully ✓";

  } catch (error) {
    console.error("Weather API error:", error);
    elements.condition.textContent = "Weather unavailable";
    elements.status.textContent =
      "Could not load weather. Check your internet and try again.";
  } finally {
    elements.refresh.disabled = false;
  }
}

elements.refresh.addEventListener("click", fetchWeather);

// Load Uyo's weather when the website opens.
fetchWeather();