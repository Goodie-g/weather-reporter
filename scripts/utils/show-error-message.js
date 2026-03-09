let errorTimeout;

function getUserFriendlyMessage(error) {
  const message = error.message || error.toString();

  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Unable to connect to the weather service. Please check your internet connection and try again.';
  }

  if (message.includes('400') || message.includes('Bad Request')) {
    return 'Invalid location. Please enter a valid city, country, or location name.';
  }

  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'API access denied. The weather service may be temporarily unavailable. Please try again later.';
  }

  if (message.includes('403') || message.includes('Forbidden')) {
    return 'Access forbidden. Please check your API key or contact support.';
  }

  if (message.includes('404') || message.includes('Not Found')) {
    return 'Location not found. Please verify the spelling and try again.';
  }

  if (message.includes('500') || message.includes('Internal Server Error')) {
    return 'The weather service is experiencing issues. Please try again in a few minutes.';
  }

  if (message.includes('location is required')) {
    return 'Please enter a location to get the weather information.';
  }

  // Default message
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