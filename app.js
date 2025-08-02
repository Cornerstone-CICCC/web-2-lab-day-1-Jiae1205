const fetchBtn = document.getElementById("fetchBtn");
const cityInput = document.getElementById("cityInput");

fetchBtn.addEventListener("click", async () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }

  try {
    // 도시 정보 가져오기
    const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    const cityData = await getData(cityUrl);

    if (!cityData.results || cityData.results.length === 0) {
      alert("City not found.");
      return;
    }

    const { latitude, longitude, name, country, timezone, population } =
      cityData.results[0];

    // 날씨 정보 가져오기
    const weatherData = await getWeatherData(latitude, longitude);

    // 화면에 표시
    buildWeather(name, country, timezone, population, weatherData);
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to fetch data.");
  }
});

async function getData(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getWeatherData(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
  try {
    const res = await fetch(weatherUrl);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

function buildWeather(name, country, timezone, population, data) {
  const isDay = data.current.is_day === 1;
  const bg = isDay ? "./images/day.jpg" : "./images/night.jpg";

  const mainSection = document.querySelector(".main");
  mainSection.style.backgroundImage = `url(${bg})`;
  mainSection.style.backgroundSize = "cover";
  mainSection.style.backgroundPosition = "center";

  if (!isDay) {
    mainSection.classList.add("dark-mode");
  } else {
    mainSection.classList.remove("dark-mode");
  }

  document.querySelector(".city").textContent = name;
  document.querySelector(
    ".temperature"
  ).textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
  document.querySelector(".country").textContent = country;
  document.querySelector(".timezone").textContent = timezone;
  document.querySelector(".population").textContent =
    population?.toLocaleString() || "N/A";
  document.querySelector(
    ".forecast_low"
  ).textContent = `${data.daily.temperature_2m_min[0]} °C`;
  document.querySelector(
    ".forecast_max"
  ).textContent = `${data.daily.temperature_2m_max[0]} °C`;
}
