let errorTimeout;

function getUserFriendlyMessage(error) {
  // Normalize inputs
  const code = error && (error.code || error.status || (error.response && error.response.status));
  const rawMessage = error && (error.message || (typeof error === 'string' ? error : null));
  let message = rawMessage || (typeof error === 'string' ? error : '') || '';
  if (message === 'undefined') message = '';

  // Prefer code-based mapping when available
  if (code) {
    const codeStr = String(code);
    if (codeStr === '401') return 'API access denied. Please check your API key.';
    if (codeStr === '403') return 'Access forbidden. Please check your API key or contact support.';
    if (codeStr.startsWith('4')) return 'Invalid request or location not found. Please verify the location and try again.';
    if (codeStr.startsWith('5')) return 'The weather service is experiencing issues. Please try again later.';
  }

  // Fall back to message-based heuristics
  const normalized = message.toLowerCase();
  if (normalized.includes('failed to fetch') || normalized.includes('networkerror') || normalized.includes('network error')) {
    return 'Unable to connect to the weather service. Please check your internet connection and try again.';
  }

  if (normalized.includes('400') || normalized.includes('bad request')) {
    return 'Invalid location. Please enter a valid city, country, or location name.';
  }

  if (normalized.includes('401') || normalized.includes('unauthorized')) {
    return 'API access denied. The weather service may be temporarily unavailable. Please try again later.';
  }

  if (normalized.includes('403') || normalized.includes('forbidden')) {
    return 'Access forbidden. Please check your API key or contact support.';
  }

  if (normalized.includes('404') || normalized.includes('not found')) {
    return 'Location not found. Please verify the spelling and try again.';
  }

  if (normalized.includes('500') || normalized.includes('internal server error')) {
    return 'The weather service is experiencing issues. Please try again in a few minutes.';
  }

  if (normalized.includes('location is required') || normalized.includes('location is required.')) {
    return 'Please enter a location to get the weather information.';
  }

  // If we have a raw message that's meaningful, show it; else default
  if (message) return message;

  return 'An unexpected error occurred while fetching weather data. Please try again.';
}

export function showErrorMessage(error) {
  const message = getUserFriendlyMessage(error);
  const errorElement = document.querySelector('.js-error-message');

  // Clear any existing timeout
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  // Set the message
  errorElement.innerHTML = `${message} <button class="error-close">&times;</button>`;

  // Show the element
  errorElement.style.display = 'block';
  // Trigger animation in next tick
  requestAnimationFrame(() => {
    errorElement.classList.add('show');
  });

  // Add event listener to close button
  const closeButton = errorElement.querySelector('.error-close');
  closeButton.addEventListener('click', () => {
    hideErrorMessage();
  });

  // Hide after 5 seconds
  errorTimeout = setTimeout(() => {
    hideErrorMessage();
  }, 5000);
}

function hideErrorMessage() {
  const errorElement = document.querySelector('.js-error-message');
  errorElement.classList.remove('show');
  // Clear timeout
  if (errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }
  // Hide after animation
  setTimeout(() => {
    errorElement.style.display = 'none';
    errorElement.textContent = '';
  }, 300); // Match transition duration
}