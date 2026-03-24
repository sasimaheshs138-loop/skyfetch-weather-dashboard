function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherDisplay = document.getElementById('weather-display');

    this.init();
}

// ✅ INIT
WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));

    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

// ✅ WELCOME
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌤 SkyFetch Dashboard</h2>
            <p>Enter a city to get weather + 5-day forecast</p>
        </div>
    `;
};

// ✅ HANDLE SEARCH
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city");
        return;
    }

    if (city.length < 2) {
        this.showError("City name too short");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = '';
};

// ✅ MAIN WEATHER + FORECAST
WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();
    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        const [currentRes, forecastData] = await Promise.all([
            fetch(currentUrl).then(res => res.json()),
            this.getForecast(city)
        ]);

        if (currentRes.cod !== 200) {
            throw new Error("City not found");
        }

        this.displayWeather(currentRes);
        this.displayForecast(forecastData);

    } catch (err) {
        this.showError(err.message);
    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = "Search";
    }
};

// ✅ FORECAST FETCH
WeatherApp.prototype.getForecast = async function (city) {
    const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    const res = await fetch(url);
    return res.json();
};

// ✅ CURRENT WEATHER UI
WeatherApp.prototype.displayWeather = function (data) {
    const html = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <p>${data.weather[0].description}</p>
        </div>
    `;

    this.weatherDisplay.innerHTML = html;
    this.cityInput.focus();
};

// ✅ FILTER FORECAST (ONLY 12PM)
WeatherApp.prototype.processForecastData = function (data) {
    return data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);
};

// ✅ DISPLAY FORECAST
WeatherApp.prototype.displayForecast = function (data) {
    const days = this.processForecastData(data);

    const forecastHTML = days.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"/>
                <p class="temp">${Math.round(day.main.temp)}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    }).join('');

    const section = `
        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;

    this.weatherDisplay.innerHTML += section;
};

// ✅ LOADING
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `<p>Loading...</p>`;
};

// ✅ ERROR
WeatherApp.prototype.showError = function (msg) {
    this.weatherDisplay.innerHTML = `<p style="color:red;">${msg}</p>`;
};

// ✅ CREATE APP
const app = new WeatherApp("YOUR_API_KEY");