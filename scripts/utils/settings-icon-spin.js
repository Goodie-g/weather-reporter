const settingsIcon = document.querySelector('.settings-icon');

// media query
const mediaQuery = window.matchMedia('(max-width: 1023px)');

settingsIcon.addEventListener('click', () => {
    if(mediaQuery.matches) {
        settingsIcon.classList.add('spin');

        setTimeout(() => {
        settingsIcon.classList.remove('spin');
      }, 500);
    }
});
