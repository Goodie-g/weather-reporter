import { apiKey } from "./apiKey.js";

async function getWeather(location) {
    try { 
        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&days=10`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        console.log(weatherData);
        if (weatherData.error) {
            throw new Error(weatherData.error.message)
        }

        return weatherData;
    } catch(error) {
        console.log('Error:', error.message);
    }
}

function displayWeatherData(weatherData) {
    const tempUnits = {
        C: 'C',
        F: 'F'
    };

    document.querySelector('.js-weather-details')
        .innerHTML = `
        <img src="${weatherData.current.condition.icon}">
        <div>Location: ${weatherData.location.name}, ${weatherData.location.country}</div>
        <div>Current temp: ${Math.round(weatherData.current.temp_c)}\u00B0 ${tempUnits.C}</div>
        <div>Feels like: ${Math.round(weatherData.current.feelslike_c)}\u00B0 ${tempUnits.C}</div>
        <div>Condition: ${weatherData.current.condition.text}</div>
        <div>Humidity: ${weatherData.current.humidity}mm, wind:${weatherData.current.wind_kph}kph (${weatherData.current.wind_degree}\u00B0 ${weatherData.current.wind_dir})</div>
        <section class="hourly-forecast">
            
        </section>
        `;
}

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-input');

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value.trim();
        getWeather(location).then((weatherData) => {
            displayWeatherData(weatherData);
        });
        searchInput.value = '';
    }
});

searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    getWeather(location).then((weatherData) => {
        displayWeatherData(weatherData);
    });
});

document.querySelector('.js-weather-details')
    .innerHTML = 'Loading...'

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getWeather(`${latitude}, ${longitude}`).then((weatherData) => {
            displayWeatherData(weatherData);
        });
    },
    (error) => {
        let errorMessage;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location access was denied. Please enable location services in your browser or device settings.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out. Please try again.";
                break;
                 
            case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred while getting your location.";
                break;
            default:
            errorMessage = "An error occurred while getting your location: " + error.message;
        }
        alert(errorMessage);
        console.error("Geolocation error:", errorMessage);
        },
        {
        // Optional options: timeout and accuracy
        timeout: 10000,
        maximumAge: 0,
        enableHighAccuracy: true
        }
    );
} else {
  alert("Geolocation is not supported by your browser.");
}