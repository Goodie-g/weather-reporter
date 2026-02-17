import { apiKey } from "./utils/apiKey.js";

const searchElement = document.querySelector('.js-search');
console.log(typeof searchElement.input)
location = String(searchElement.input);

async function getWeather(location) {
    try {

        if (!location) {
            throw new Error("location is required.");
        }
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
       
        const weatherData = await response.json();
        console.log(weatherData);
        if (weatherData.error) {
            throw new Error(weatherData.error.message)
        }

    } catch(error) {
        // switch (webError.code) {
        //     case webError
        // }
        console.log('Error:', error.message);
    }
}

const searchButton = document.querySelector('.js-search-button');

searchButton.addEventListener('click', () => {
    getWeather();
});

getWeather('-6.803564, 39.1903455');

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`${latitude}, ${longitude}`);

        alert(`Location found! Latitude: ${latitude}, ${longitude}`);
    },
    (error) => {
        let errorMessage;
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location access was denied. Please enable location services in your browser or device settings.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out. Please try again.";
                break;
                 
            case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred while getting your location.";
                break;
            default:
            errorMessage = "An error occurred while getting your location: " + error.message;
        }
        alert(errorMessage);
        console.error("Geolocation error:", errorMessage);
        },
        {
        // Optional options: timeout and accuracy
        timeout: 10000,
        maximumAge: 0,
        enableHighAccuracy: true
        }
    );
} else {
  alert("Geolocation is not supported by your browser.");
}
        
