import { apiKey } from "./apiKey.js";

export async function getWeatherData(location) {
    try { 
        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&days=3`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        if (weatherData.error) {
            throw new Error(weatherData.error.message)
        }
        return weatherData;

    } catch(error) {
        console.log('Error:', error.message);
    }
}