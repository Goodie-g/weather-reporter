import dayjs from 'https://cdn.skypack.dev/dayjs';

export function displayHourlyForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    const [firstDay] = weatherForecast;
    const result = firstDay.hour.map(hourOfTheDay =>
        `
            <div class="hour-forecast">
                <div>${dayjs(hourOfTheDay.time).format('hh a')}</div>
                <div>${Math.round(hourOfTheDay.temp_c)}\u00B0 C</div>
                <img src="${hourOfTheDay.condition.icon}">
                <div class="condition-in-hour-of-the-day"> ${hourOfTheDay.condition.text}</div>
            </div>
        `
    ).join('');
    return result;
    
}