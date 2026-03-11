import { apiKey } from "./apiKey.js";
import { showErrorMessage} from './show-error-message.js';


export async function getWeatherData(location) {
    try { 
        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&days=3`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
            const weatherData = await response.json();
        
            if (weatherData.error) {
                console.log('API error response:', weatherData.error);
                const apiErrorMessage = weatherData.error.message || weatherData.error.msg || JSON.stringify(weatherData.error);
                const err = new Error(apiErrorMessage || `API error`);
                // Attach code/type if available so downstream can make better decisions
                err.code = weatherData.error.code || weatherData.error.type || response.status;
                throw err;
            }
            return weatherData;


    } catch(error) {
        // Log and rethrow so callers can handle the error consistently.
        console.error('getWeatherData error:', error);
        throw error;
    }
}