import { apiKey } from "./.gitignore/apiKey.js";

const searchElement = document.querySelector('.js-search');
const location = String(searchElement.input);

async function getWeather(location) {
    try {

        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        console.log(weatherData);
        if (weatherData.error) {
            throw new Error(weatherData.error.message)
        }

    } catch(error) {
        // switch (webError.code) {
        //     case webError
        // }
        console.log('Error:', error.message);
    }
}

const searchButton = document.querySelector('.js-search-button');

searchButton.addEventListener('click', () => {
    getWeather();
});

getWeather();