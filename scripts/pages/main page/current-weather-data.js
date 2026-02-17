import { tempUnits } from "../../app.js";

export function displayCurrentWeatherData(weatherData) {
    const currentWeatherData = weatherData.current;
    return `
        <section class="current-weather">
            <section class="arrange-content">
                <div class="location">${weatherData.location.name}, ${weatherData.location.country}</div>
                <img src="${currentWeatherData.condition.icon}">
                <div class="current-temp">${Math.round(currentWeatherData.temp_c)}\u00B0 ${tempUnits.C}</div>
                <div class="feels-like">Feels like ${Math.round(currentWeatherData.feelslike_c)}\u00B0 ${tempUnits.C}</div>
                <div class="condition"> ${currentWeatherData.condition.text}</div>
            </section>
        </section>
    `;
}