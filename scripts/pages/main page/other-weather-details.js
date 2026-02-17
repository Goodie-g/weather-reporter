export function displayOtherWeatherDetails(weatherData) {
    const currentWeatherData = weatherData.current;

    return `
        <section class="other-weather-details"> 
            <h3 class="other-predictions-heading">Other predictions</h3>
            <section class="weather-predictions">
                <div class="weather-detail">Humidity: 
                ${currentWeatherData.humidity}mm</div>
                <div class="weather-detail">Wind:${currentWeatherData.wind_kph}kph 
                (${currentWeatherData.wind_degree}\u00B0 ${currentWeatherData.wind_dir})</div>
                <div class="weather-detail">Visibilty: <br> 
                ${currentWeatherData.vis_km}</div>
                <div class="weather-detail">Pressure: <br>
                ${currentWeatherData.pressure_mb}</div>
                <div class="weather-detail">UV: <br>
                ${currentWeatherData.uv}</div>
                <div class="weather-detail">Precipitation:<br> 
                ${currentWeatherData.precip_mm}</div>
            </section>
        </section>
    `;
}