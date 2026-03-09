const settingsIcon = document.querySelector('.settings-icon');

// media query
const mediaQuery = window.matchMedia('(max-width: 1023px)');

function handleClick() {
    settingsIcon.classList.add('spin');
    setTimeout(() => {
        settingsIcon.classList.remove('spin');
    }, 500);
}

function handleMouseEnter() {
    settingsIcon.classList.add('spin');
}

function handleMouseLeave() {
    settingsIcon.classList.remove('spin');
}

function setupSmallScreen() {
    settingsIcon.addEventListener('click', handleClick);
    settingsIcon.removeEventListener('mouseenter', handleMouseEnter);
    settingsIcon.removeEventListener('mouseleave', handleMouseLeave);
}

function setupLargeScreen() {
    settingsIcon.removeEventListener('click', handleClick);
    settingsIcon.addEventListener('mouseenter', handleMouseEnter);
    settingsIcon.addEventListener('mouseleave', handleMouseLeave);
}

if (mediaQuery.matches) {
    setupSmallScreen();
} else {
    setupLargeScreen();
}

mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
        setupSmallScreen();
    } else {
        setupLargeScreen();
    }
});
