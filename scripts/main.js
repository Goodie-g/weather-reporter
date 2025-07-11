import { apiKey } from "./apiKey.js";
import dayjs from 'https://cdn.skypack.dev/dayjs';

async function getWeather(location) {
    try { 
        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&days=3`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        if (weatherData.error) {
            throw new Error(weatherData.error.message)
        }
        console.log(weatherData)
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

    const currentWeather = weatherData.current;
    console.log(currentWeather);

    document.querySelector('.js-weather-details')
        .innerHTML = `
        <section class="current-weather">
        <div class="location">${weatherData.location.name}, ${weatherData.location.country}</div>
        <img src="${currentWeather.condition.icon}">
        <div class="current-temp">Current temp: ${Math.round(currentWeather.temp_c)}\u00B0 ${tempUnits.C}</div>
        <div>Feels like: ${Math.round(currentWeather.feelslike_c)}\u00B0 ${tempUnits.C}</div>
        <div>Condition: ${currentWeather.condition.text}</div>
        </section>
        <section class="hourly-forecast-container">
            <h3>hourly forecast</h3>
            <section class="hourly-forecast js-hourly-forecast"></section>
        </section>
        <section class="ten-day-forecast-container">
            <h3>3 day forecast</h3>
            <section class="ten-day-forecast js-ten-day-forecast"></section>
        </section>
       <section class="other-weather-details"> 
            <div>Humidity: ${currentWeather.humidity}mm</div>
            <div>Wind:${currentWeather.wind_kph}kph (${currentWeather.wind_degree}\u00B0 ${currentWeather.wind_dir})</div>
            <div>Precipitation: ${currentWeather.precip_mm}</div>
            <div>Pressure: ${currentWeather.pressure_mb}</div>
            <div>UV: ${currentWeather.uv}</div>
            <div>Visibilty: ${currentWeather.vis_km}</div>
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
            displayHourlyForecast(weatherData);
            displayTenDayForecast(weatherData);
        });
        searchInput.value = '';
    }
});

searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    getWeather(location).then((weatherData) => {
        displayWeatherData(weatherData);
        displayHourlyForecast(weatherData);
        displayTenDayForecast(weatherData);
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
            displayHourlyForecast(weatherData);
            displayTenDayForecast(weatherData);
            
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

function displayHourlyForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    const [firstDay] = weatherForecast;
    firstDay.hour.map(hourOfTheDay => {
        document.querySelector('.js-hourly-forecast')
            .innerHTML += `
            <section class="hour-forecast">
                <div>${hourOfTheDay.time}</div>
                <div>${Math.round(hourOfTheDay.temp_c)}</div>
                <div>Condition: ${hourOfTheDay.condition.text}</div>
            </section>
            `;
    }).join('');
        
}

function displayTenDayForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    weatherForecast.map(day => {
        document.querySelector('.js-ten-day-forecast')
            .innerHTML += `
            <section class="days-forecast">
                <div>${dayjs(day.date).format('ddd')}</div>
                <div>MaxTemp: ${Math.round(day.day.maxtemp_c)} </div>
                <div>MinTemp: ${Math.round(day.day.mintemp_c)}</div>
            </section>
            `;
    }).join('');
}


