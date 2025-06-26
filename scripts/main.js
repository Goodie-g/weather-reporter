import { apiKey } from "./apiKey.js";

async function getWeather(location) {
    try { 
        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no`);
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

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-input');

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value.trim();
        getWeather(location).then((weatherData) => {
            document.querySelector('.js-weather-details')
                .innerHTML = `
                <div>Current temp: ${weatherData.current.temp_c}</div>
                <div>Feels like: ${weatherData.current.feelslike_c}</div>
                `;
        });
        searchInput.value = '';
    }
});

searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    getWeather(location).then((weatherData) => {
        document.querySelector('.js-weather-details')
            .innerHTML = `
            <div>Current temp: ${weatherData.current.temp_c}</div>
            <div>Feels like: ${weatherData.current.feelslike_c}</div>
            `;
        });
});

document.querySelector('.js-weather-details')
    .innerHTML = 'Loading...'

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        getWeather(`${latitude}, ${longitude}`).then((weatherData) => {
            document.querySelector('.js-weather-details')
                .innerHTML = `
                <div>Current temp: ${weatherData.current.temp_c}</div>
                <div>Feels like: ${weatherData.current.feelslike_c}</div>
                `;
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