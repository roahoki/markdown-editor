// =======================Dark Mode===========================
export function enableDarkmode() {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
};

export function disableDarkmode() {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
};

export function DarkMode() {
    let darkmode = localStorage.getItem('darkmode');
    const themeSwitch = document.getElementById('theme-switch');

    if (darkmode === 'active') enableDarkmode();

    themeSwitch.addEventListener('click', () => {
        darkmode = localStorage.getItem('darkmode');
        darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
    });

};