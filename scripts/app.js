import './utils/settings-icon-spin.js';
import { getWeatherData } from './utils/fetch-instance.js';
import { showErrorMessage } from './utils/show-error-message.js';
import { displayCurrentWeatherData } from './pages/main page/current-weather-data.js';
import { displayHourlyForecast } from './pages/main page/hourly-forecast.js';
import { displayOtherWeatherDetails } from './pages/main page/other-weather-details.js';
import { displayTenDayForecast } from './pages/main page/3-day-forecast.js';

export const tempUnits = {
    C: 'C',
    F: 'F'
};

const weatherDetailsSection = document.querySelector('.js-weather-details')
const HISTORY_KEY = 'weatherSearchHistory';
const historyContainer = document.querySelector('.js-search-history');

function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        const items = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(items)) return [];
        // Remove coordinate-like entries (latitude, longitude)
        const coordRe = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/;
        const cleaned = items.filter(i => !coordRe.test(i));
        if (cleaned.length !== items.length) {
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned.slice(0,10))); } catch(e){}
        }
        return cleaned;
    } catch (e) {
        console.error('Failed to load search history', e);
        return [];
    }
}

function saveSearch(term) {
    if (!term) return;
    const normalized = term.trim();
    if (!normalized) return;
    const items = loadHistory();
    // remove duplicates (case-insensitive)
    const filtered = items.filter(i => i.toLowerCase() !== normalized.toLowerCase());
    filtered.unshift(normalized);
    const limited = filtered.slice(0, 10);
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
    } catch (e) {
        console.error('Failed to save search history', e);
    }
    renderHistoryDropdown();
}

function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch(e){}
    renderHistoryDropdown();
}

function renderHistoryDropdown(filter = '') {
    if (!historyContainer) return;
    const items = loadHistory();
    if (!items.length) {
        historyContainer.innerHTML = '';
        historyContainer.classList.remove('show');
        historyContainer.setAttribute('aria-hidden', 'true');
        return;
    }
    const normalizedFilter = filter.trim().toLowerCase();
    const visible = items.filter(i => i.toLowerCase().includes(normalizedFilter));
    historyContainer.innerHTML = visible.map(i => `<div class="item" data-value="${i}">${i}</div>`).join('') + '<div class="item clear-history" data-clear>Clear history</div>';
    historyContainer.classList.add('show');
    historyContainer.setAttribute('aria-hidden', 'false');

    // attach handlers
    historyContainer.querySelectorAll('.item').forEach(el => {
        el.addEventListener('click', (e) => {
            const val = e.currentTarget.dataset.value;
            if (e.currentTarget.hasAttribute('data-clear')) {
                clearHistory();
                return;
            }
            if (val) {
                searchInput.value = val;
                renderWeatherdata(val);
                historyContainer.classList.remove('show');
                historyContainer.setAttribute('aria-hidden', 'true');
            }
        });
    });
}

async function renderWeatherdata(location, saveHistory = true) {
    try {
        const weatherData = await getWeatherData(location);
        // Save the successful search to history (unless disabled)
        if (saveHistory) {
            try { saveSearch(location); } catch(e) { console.error('saveSearch failed', e); }
        }
        // Hide history dropdown after performing a search
        if (historyContainer) {
            historyContainer.classList.remove('show');
            historyContainer.setAttribute('aria-hidden', 'true');
        }
        weatherDetailsSection.innerHTML = `
            ${displayCurrentWeatherData(weatherData)}

            <section class="hourly-forecast-container">
                <h3 class="hourly-forecast-heading">Today</h3>
                <section class="hourly-forecast js-hourly-forecast">${displayHourlyForecast(weatherData)}</section>
            </section>

            ${displayOtherWeatherDetails(weatherData)}

            <section class="ten-day-forecast-container">
                <h3 class="days-forecast-heading">3 day forecast</h3>
                <section class="ten-day-forecast js-ten-day-forecast">${displayTenDayForecast(weatherData)}</section>
            </section>
        `;
    } catch (error) {
        showErrorMessage(error);
    }

}

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-input');

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchInput.value.trim();
        renderWeatherdata(location);
        // hide dropdown when performing a search
        if (historyContainer) {
            historyContainer.classList.remove('show');
            historyContainer.setAttribute('aria-hidden', 'true');
        }
        searchInput.value = '';
    }
    
});

searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    renderWeatherdata(location);
    if (historyContainer) {
        historyContainer.classList.remove('show');
        historyContainer.setAttribute('aria-hidden', 'true');
    }
    searchInput.value = '';
});

// Show history when input focused and filter while typing
if (searchInput) {
    searchInput.addEventListener('focus', () => renderHistoryDropdown(''));
    // Only update/filter the dropdown while the input is focused
    searchInput.addEventListener('input', (e) => {
        if (document.activeElement === searchInput) {
            renderHistoryDropdown(e.target.value);
        }
    });
}

// Hide history when clicking outside
document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.closest || !searchInput) return;
    const isOutside = !target.closest('.search');
    if (isOutside && historyContainer) {
        historyContainer.classList.remove('show');
        historyContainer.setAttribute('aria-hidden', 'true');
    }
});

// do not render history dropdown on load; it will appear when input is focused



// current location estimation and initial render
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // From Uiverse.io by Shoh2008

        document.querySelector('.js-weather-details').innerHTML = '<div class="loader"></div>'

        renderWeatherdata(`${latitude}, ${longitude}`, false);
        
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