import dayjs from 'https://cdn.skypack.dev/dayjs';

export function displayTenDayForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    weatherForecast.map(day => {
        document.querySelector('.js-ten-day-forecast')
            .innerHTML += `
            <section class="day-forecast">
                <div>${dayjs(day.date).format('ddd')}</div>
                <div>Hi: ${Math.round(day.day.maxtemp_c)} </div>
                <img src="${day.day.condition.icon}">
                <div>Lo: ${Math.round(day.day.mintemp_c)}</div>
            </section>
            `;
    }).join('');
}