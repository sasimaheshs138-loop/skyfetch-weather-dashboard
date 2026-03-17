// Your OpenWeatherMap API Key
const API_KEY = 'ba6006a670235ab1fb66ceff0f352f21'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
function getWeather(city) {
    // Build the complete URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    // Make API call using Axios
    axios.get(url)
        .then(function(response) {
            console.log('Weather Data:', response.data);
            displayWeather(response.data);
        })
        .catch(function(error) {
            console.error('Error fetching weather:', error);
            document.getElementById('weather-display').innerHTML = 
                '<p class="loading">Could not fetch weather data. Please try again.</p>';
        });
}

function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Call the function when page loads
async function getWeather(city) {
    // Build the API URL (replace YOUR_API_KEY with your actual key)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`;

    try {
        // Fetch data using await
        const response = await axios.get(url);

        // Log response for debugging
        console.log(response);

        // Pass data to display function
        displayWeather(response.data);

    } catch (error) {
        // Log error
        console.error(error);

        // Call error handler
        showError();
    }
}


const errorHTML = `
    <div class="error-message">
        <h2>⚠️ Oops!</h2>
        <p>${message || "Something went wrong. Please try again."}</p>
    </div>
`;

function showError(message) {
    const weatherDisplay = document.getElementById("weather-display");

    // Create error HTML
    const errorHTML = `
        <div style="
            background: #ffe0e0;
            color: #d8000c;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            font-size: 1rem;
        ">
            ⚠️ ${message || "Something went wrong. Please try again!"}
        </div>
    `;

    // Display error message
    weatherDisplay.innerHTML = errorHTML;
}

// Get references to HTML elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

// Function to handle search logic
function handleSearch() {
    const city = cityInput.value.trim();

    // Validate input
    if (city === "") {
        showError("Please enter a city name ⚠️");
        return;
    }

    // Call weather function
    getWeather(city);

    // Clear input (optional)
    cityInput.value = "";
}

// Click event listener
searchBtn.addEventListener("click", function () {
    handleSearch();
});

// Enter key support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

const weatherDisplay = document.getElementById("weather-display");

weatherDisplay.innerHTML = `
    <div style="text-align: center; padding: 20px;">
        <h2>🌤️ Welcome to Weather App</h2>
        <p>Enter a city name above to get the current weather.</p>
    </div>
`;

function showLoading() {
    const weatherDisplay = document.getElementById("weather-display");

    const loadingHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #ddd;
                border-top: 4px solid #4facfe;
                border-radius: 50%;
                margin: 0 auto 10px;
                animation: spin 1s linear infinite;
            "></div>
            <p>Loading weather data...</p>
        </div>
    `;

    weatherDisplay.innerHTML = loadingHTML;
}

const loadingHTML = `
    <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading weather data...</p>
    </div>
`;

async function getWeather(city) {
    // Show loading at the start
    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await axios.get(url);

        // Replace loading with weather data
        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        // Handle different error cases
        if (error.response) {
            if (error.response.status === 404) {
                showError("City not found ❌");
            } else {
                showError("Something went wrong. Try again ⚠️");
            }
        } else {
            showError("Network error. Check your connection 🌐");
        }
    }
}

async function getWeather(city) {
    showLoading();

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await axios.get(url);
        displayWeather(response.data);

    } catch (error) {
        console.error('Error:', error);

        // Check error type
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
    }
}

if (!error.response) {
    showError('Network error. Check your internet connection 🌐');
}
// Event listener with validation
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    // 1 & 2: Empty or only spaces
    if (!city) {
        showError("Please enter a city name ⚠️");
        return;
    }

    // 3: Minimum length check
    if (city.length < 2) {
        showError("City name too short ❌");
        return;
    }

    // Proceed with search
    getWeather(city);

    // Optional: clear input
    cityInput.value = "";
});
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click(); // reuse validation logic
    }
});
async function getWeather(city) {
    showLoading();

    // Disable button to prevent multiple clicks
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        displayWeather(response.data);

    } catch (error) {
        console.error(error);
        showError("Something went wrong. Please try again.");
        
    } finally {
        // Re-enable button after request completes
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}
function displayWeather(data) {
    // ... your existing code to display weather ...

    // Focus back on input for better UX
    cityInput.focus();
}
cityInput.focus();
cityInput.select(); // highlights previous text for quick overwrite