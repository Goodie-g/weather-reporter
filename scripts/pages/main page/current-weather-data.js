import { tempUnits, selectedUnit } from "../../app.js";

export function displayCurrentWeatherData(weatherData) {
    const currentWeatherData = weatherData.current;
    const useF = selectedUnit === tempUnits.F;
    const temp = useF ? Math.round(currentWeatherData.temp_f) : Math.round(currentWeatherData.temp_c);
    const feels = useF ? Math.round(currentWeatherData.feelslike_f) : Math.round(currentWeatherData.feelslike_c);
    const unitLabel = useF ? tempUnits.F : tempUnits.C;
    return `
        <section class="current-weather">
            <section class="arrange-content">
                <div class="location">${weatherData.location.name}, ${weatherData.location.country}</div>
                <img src="https:${currentWeatherData.condition.icon}">
                <div class="current-temp">${temp}\u00B0 ${unitLabel}</div>
                <div class="feels-like">Feels like ${feels}\u00B0 ${unitLabel}</div>
                <div class="condition"> ${currentWeatherData.condition.text}</div>
            </section>
        </section>
    `;
}