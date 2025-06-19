import { apiKey } from "./apiKey.js";

const searchElement = document.querySelector('.js-search');
const search = String(searchElement.input);

async function getWeather() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${search}&aqi=no`);
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        console.log(weatherData);

    } catch(error) {
        console.log('Error:', error);
    }
}

const searchButton = document.querySelector('.js-search-button');

searchButton.addEventListener('click', () => {
    getWeather();
});