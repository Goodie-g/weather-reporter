import dayjs from 'https://cdn.skypack.dev/dayjs';
import { selectedUnit } from '../../app.js';
import { units } from '../../utils/units.js';

export function displayHourlyForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    const [firstDay] = weatherForecast;
    const useF = selectedUnit === units.temperature.F;
    const result = firstDay.hour.map(hourOfTheDay =>
        `
            <div class="hour-forecast">
                <div>${dayjs(hourOfTheDay.time).format('hh a')}</div>
                <div>${Math.round(useF ? hourOfTheDay.temp_f : hourOfTheDay.temp_c)}\u00B0 ${useF ? units.temperature.F : units.temperature.C}</div>
                <img src="${hourOfTheDay.condition.icon}">
                <div class="condition-in-hour-of-the-day"> ${hourOfTheDay.condition.text}</div>
            </div>
        `
    ).join('');
    return result;
}