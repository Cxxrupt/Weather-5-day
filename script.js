const apiKey = "f5d31dfa52566aa3f5ca239ed565e89f";
const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const currentWeather = document.querySelector("#current-weather");
const forecast = document.querySelector("#forecast");
const searchHistory = document.querySelector("#search-history");
let searchHistoryList = [];

// Function to get current weather data for a given city
async function getCurrentWeather(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to get 5-day forecast data for a given city
async function getForecast(city) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to render current weather data for a given city
function renderCurrentWeather(data) {
  currentWeather.innerHTML = `
    <h2>${data.name} (${new Date().toLocaleDateString()}) <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></h2>
    <p>Temperature: ${data.main.temp} &#8451;</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// Function to render 5-day forecast data for a given city
function renderForecast(data) {
  let forecastHTML = "<h2>5-Day Forecast:</h2>";
  for (let i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("12:00:00")) {
      forecastHTML += `
        <p>${new Date(data.list[i].dt_txt).toLocaleDateString()} <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="${data.list[i].weather[0].description}"></p>
        <p>Temperature: ${data.list[i].main.temp} &#8451;</p>
        <p>Humidity: ${data.list[i].main.humidity}%</p>
        <p>Wind Speed: ${data.list[i].wind.speed} m/s</p>
      `;
    }
  }
  forecast.innerHTML = forecastHTML;
}

// Function to render search history
function renderSearchHistory() {
  searchHistory.innerHTML = `
    <h2>Search History</h2>
    <ul>
      ${searchHistoryList.map(city => `<li>${city}</li>`).join("")}
    </ul>
  `;
}

// Event listener for search form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  const currentWeatherData = await getCurrentWeather(city);
  const forecastData = await getForecast(city);
  searchHistoryList.push(city);
  localStorage.setItem("searchHistoryList", JSON.stringify(searchHistoryList));
  renderCurrentWeather(currentWeatherData);
  renderForecast(forecastData);
  renderSearchHistory();
  cityInput.value = "";
});

// Load search history from local storage on page load
if (localStorage.getItem("searchHistoryList")) {
  searchHistoryList = JSON.parse(localStorage.getItem("searchHistoryList"));
  renderSearchHistory();
}

function renderSearchHistory() {
  searchHistory.innerHTML = `
    <h2>Search History</h2>
    <ul>
      ${searchHistoryList.map(city => `<li>${city}</li>`).join("")}
    </ul>
  `;

  // Add event listener to each city list item
  const cityListItems = document.querySelectorAll("#search-history li");
  cityListItems.forEach(cityListItem => {
    cityListItem.addEventListener("click", async () => {
      const city = cityListItem.textContent;
      const currentWeatherData = await getCurrentWeather(city);
      const forecastData = await getForecast(city);
      renderCurrentWeather(currentWeatherData);
      renderForecast(forecastData);
    });
  });
}