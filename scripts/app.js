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

export let selectedUnit = 'C';
const UNIT_KEY = 'weatherUnit';
const LAST_WEATHER_KEY = 'lastWeatherData';

function loadSelectedUnit() {
    try {
        const v = localStorage.getItem(UNIT_KEY);
        if (v === 'F' || v === 'C') return v;
        // try to infer from browser locale (simple): default to F for en-US
        const locale = (navigator.language || '').toLowerCase();
        return locale === 'en-us' ? 'F' : 'C';
    } catch (e) { return 'C'; }
}

function setSelectedUnit(unit) {
    if (unit !== 'C' && unit !== 'F') return;
    selectedUnit = unit;
    try { localStorage.setItem(UNIT_KEY, unit); } catch (e) {}
}

function saveLastWeatherData(data) {
    try { localStorage.setItem(LAST_WEATHER_KEY, JSON.stringify(data)); } catch (e) { console.error('Failed to save last weather', e); }
}

function loadLastWeatherData() {
    try { const raw = localStorage.getItem(LAST_WEATHER_KEY); return raw ? JSON.parse(raw) : null; } catch(e){return null}
}

const weatherDetailsSection = document.querySelector('.js-weather-details')
const HISTORY_KEY = 'weatherSearchHistory';
const historyContainer = document.querySelector('.js-search-history');

// initialize selected unit early so renders use proper unit
selectedUnit = loadSelectedUnit();

// Auto-render last saved weather data on load (if present)
const _lastSaved = loadLastWeatherData();
if (_lastSaved) {
    renderFromSavedWeatherData(_lastSaved);
}

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
        // persist last fetched data
        try { saveLastWeatherData(weatherData); } catch(e){}
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

function renderFromSavedWeatherData(data) {
    if (!data) return;
    weatherDetailsSection.innerHTML = `
        ${displayCurrentWeatherData(data)}

        <section class="hourly-forecast-container">
            <h3 class="hourly-forecast-heading">Today</h3>
            <section class="hourly-forecast js-hourly-forecast">${displayHourlyForecast(data)}</section>
        </section>

        ${displayOtherWeatherDetails(data)}

        <section class="ten-day-forecast-container">
            <h3 class="days-forecast-heading">3 day forecast</h3>
            <section class="ten-day-forecast js-ten-day-forecast">${displayTenDayForecast(data)}</section>
        </section>
    `;
}

const searchButton = document.querySelector('.js-search-button');
const searchInput = document.querySelector('.js-search-input');

// Populate search input with last saved location name if available
try {
    if (typeof _lastSaved !== 'undefined' && _lastSaved && searchInput) {
        const locName = _lastSaved.location && _lastSaved.location.name ? _lastSaved.location.name : '';
    }
} catch (e) {}

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



// current location estimation and initial render (only if no saved data exists)
if (!_lastSaved) {
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
}

// --- Settings dropdown and unit toggle ---

const settingsIconEl = document.getElementById('settings-icon');
const settingsDropdown = document.querySelector('.js-settings-dropdown');
const unitToggle = document.getElementById('js-toggle-units');

if (unitToggle) {
    unitToggle.checked = selectedUnit === 'F';
    unitToggle.addEventListener('change', (e) => {
        const newUnit = e.target.checked ? 'F' : 'C';
        setSelectedUnit(newUnit);
        // re-render from saved data if available
        const last = loadLastWeatherData();
        if (last) renderFromSavedWeatherData(last);
        // hide the settings dropdown
        if (settingsDropdown) {
            settingsDropdown.classList.remove('show');
            settingsDropdown.setAttribute('aria-hidden', 'true');
        }
    });
}

if (settingsIconEl) {
    settingsIconEl.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('settings icon clicked');
        if (!settingsDropdown) {
            console.warn('settings dropdown element not found');
            return;
        }
        console.log('settingsDropdown exists, classes:', settingsDropdown.className);
        const isShown = settingsDropdown.classList.contains('show');
        if (isShown) {
            settingsDropdown.classList.remove('show');
            settingsDropdown.setAttribute('aria-hidden', 'true');
            console.log('settings dropdown hidden');
        } else {
            settingsDropdown.classList.add('show');
            settingsDropdown.setAttribute('aria-hidden', 'false');
            console.log('settings dropdown shown');
        }
    });

    // close when clicking elsewhere
    document.addEventListener('click', (ev) => {
        if (!settingsDropdown) return;
        if (!ev.target.closest || ev.target.closest('#settings-icon') || ev.target.closest('.js-settings-dropdown')) return;
        settingsDropdown.classList.remove('show');
        settingsDropdown.setAttribute('aria-hidden', 'true');
    });
}