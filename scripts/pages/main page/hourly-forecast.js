import dayjs from 'https://cdn.skypack.dev/dayjs';

export function displayHourlyForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    const [firstDay] = weatherForecast;
    return firstDay.hour.forEach(hourOfTheDay => {
        document.querySelector('.js-hourly-forecast')
            .innerHTML += `
            <div class="hour-forecast">
                <div>${dayjs(hourOfTheDay.time).format('hh a')}</div>
                <div>${Math.round(hourOfTheDay.temp_c)}\u00B0 C</div>
                <div class="condition-in-hour-of-the-day"> ${hourOfTheDay.condition.text}</div>
            </div>
            `;
    }).join('');       
}