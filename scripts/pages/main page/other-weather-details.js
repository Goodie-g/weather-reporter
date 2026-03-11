import { selectedUnit } from '../../app.js';
import { units } from '../../utils/units.js';

export function displayOtherWeatherDetails(weatherData) {
    const currentWeatherData = weatherData.current;
    const useF = selectedUnit === units.temperature.F;
    const wind = useF ? `${currentWeatherData.wind_mph} ${units.speed.mph}` : `${currentWeatherData.wind_kph} ${units.speed.kph}`;
    const vis = useF ? `${currentWeatherData.vis_miles} ${units.distance.miles}` : `${currentWeatherData.vis_km} ${units.distance.km}`;
    const pressure = useF ? `${currentWeatherData.pressure_in} ${units.pressure.in}` : `${currentWeatherData.pressure_mb} ${units.pressure.mb}`;
    const precip = useF ? `${currentWeatherData.precip_in} ${units.precipitation.in}` : `${currentWeatherData.precip_mm} ${units.precipitation.mm}`;

    return `
        <section class="other-weather-details"> 
            <h3 class="other-predictions-heading">Other predictions</h3>
            <section class="weather-predictions">
                <div class="weather-detail">Humidity: ${currentWeatherData.humidity}%</div>
                <div class="weather-detail">Wind: ${wind} (${currentWeatherData.wind_degree}\u00B0 ${currentWeatherData.wind_dir})</div>
                <div class="weather-detail">Visibility: ${vis}</div>
                <div class="weather-detail">Pressure: ${pressure}</div>
                <div class="weather-detail">UV: ${currentWeatherData.uv}</div>
                <div class="weather-detail">Precipitation: ${precip}</div>
            </section>
        </section>
    `;
}