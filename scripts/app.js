import './utils/settings-icon-spin.js';
import { getWeatherData } from './utils/fetch-instance.js';
import { displayCurrentWeatherData } from './pages/main page/current-weather-data.js';
import { displayHourlyForecast } from './pages/main page/hourly-forecast.js';
import { displayOtherWeatherDetails } from './pages/main page/other-weather-details.js';
import { displayTenDayForecast } from './pages/main page/3-day-forecast.js';

export const tempUnits = {
    C: 'C',
    F: 'F'
};

const weatherDetailsSection = document.querySelector('.js-weather-details')

async function renderWeatherdata(location) {
    
    const weatherData = await getWeatherData(location);

    weatherDetailsSection.innerHTML = `
        ${displayCurrentWeatherData(weatherData)}

        <section class="hourly-forecast-container">
            <h3 class="hourly-forecast-heading">Today</h3>
            <section class="hourly-forecast js-hourly-forecast">${displayHourlyForecast(weatherData)}</section>
        </section>

        ${displayOtherWeatherDetails(weatherData)}

        <section class="ten-day-forecast-container">
            <h3 class="days-forecast-heading">3 day forecast</h3>
            <section class="ten-day-forecast js-ten-day-forecast">${displayTenDayForecast(weatherData)}</section>
        </section>
    `;

}

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-input');

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value.trim();
        getWeatherData(location).then((weatherData) => {
            renderWeatherdata(weatherData)
        });
        searchInput.value = '';
    }
});

searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    getWeatherData(location).then((weatherData) => {
        renderWeatherdata(weatherData)
    });
});

document.querySelector('.js-weather-details')
    .innerHTML = '<p class="loading">Loading...</p>';

// current location estimation and initial render
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.querySelector('.js-weather-details').innerHTML = '<p class="loading">Loading...</p>'

        renderWeatherdata(`${latitude}, ${longitude}`);
        
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





