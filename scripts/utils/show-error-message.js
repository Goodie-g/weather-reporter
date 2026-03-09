let errorTimeout;

export function showErrorMessage(message) {
  const errorElement = document.querySelector('.js-error-message');

  // Clear any existing timeout
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  // Set the message and show the error
  errorElement.innerHTML = `${message} <button class="error-close">&times;</button>`;
  errorElement.classList.add('show');

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
  // Optionally clear text after animation
  setTimeout(() => {
    errorElement.textContent = '';
  }, 300); // Match transition duration
}