document.addEventListener('DOMContentLoaded', () => {
    console.log("Skriptet laddat!");

    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            console.log("Knapp klickad!");
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpened);
            navMenu.classList.toggle('nav-open');
        });

        // Stäng menyn när man klickar på en länk (för mobil)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Sätt minsta datum till "nu"
const startDateInput = document.getElementById('start_date');

if (startDateInput) {
    const nu = new Date();

    const year = nu.getFullYear();
    const month = String(nu.getMonth() + 1).padStart(2, '0');
    const day = String(nu.getDate()).padStart(2, '0');
    const hours = String(nu.getHours()).padStart(2, '0');
    const minutes = String(nu.getMinutes()).padStart(2, '0');
    
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    startDateInput.setAttribute('min', minDateTime);
}

const endDateInput = document.getElementById('end_date');

startDateInput.addEventListener('change', () => {
    // När användaren valt startdatum, sätt det som min-värde för slutdatumet
    endDateInput.setAttribute('min', startDateInput.value);
});

    // --- Övrig kod ---
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Formulär-scroll
    const offerPanel = document.getElementById('offerPanel');
    if (offerPanel) {
        offerPanel.addEventListener('toggle', () => {
            if (offerPanel.open) {
                offerPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});