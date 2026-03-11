import dayjs from 'https://cdn.skypack.dev/dayjs';
import { tempUnits, selectedUnit } from '../../app.js';

export function displayTenDayForecast(weatherData) {
    const weatherForecast = weatherData.forecast.forecastday;
    const useF = selectedUnit === tempUnits.F;
    const result = weatherForecast.map(day => 
        `
            <section class="day-forecast">
                <div>${dayjs(day.date).format('ddd')}</div>
                <div>Hi: ${Math.round(useF ? day.day.maxtemp_f : day.day.maxtemp_c)}\u00B0 ${useF ? tempUnits.F : tempUnits.C} </div>
                <img src="${day.day.condition.icon}">
                <div>Lo: ${Math.round(useF ? day.day.mintemp_f : day.day.mintemp_c)}\u00B0 ${useF ? tempUnits.F : tempUnits.C}</div>
            </section>
            `
    ).join('');

    return result;
}