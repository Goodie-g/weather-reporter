export function showErrorMessage(message) {
  const errorElement = document.querySelector('.js-error-message');

  errorElement.textContent = message;

  setTimeout(() => {
    errorElement.textContent = '';
  }, 5000);
}