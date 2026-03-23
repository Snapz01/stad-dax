document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1) Accordion Logic with Auto-Wrapper ---
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        // We need a wrapper div inside .content for the grid animation to work.
        // This code adds it automatically if it's missing!
        const content = card.querySelector('.content');
        if (content && !content.querySelector('.content-inner')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('content-inner');
            while (content.firstChild) {
                wrapper.appendChild(content.firstChild);
            }
            content.appendChild(wrapper);
        }

        // Close other cards when one is opened
        card.querySelector('summary').addEventListener('click', (e) => {
            if (!card.open) {
                cards.forEach(otherCard => {
                    if (otherCard !== card) otherCard.removeAttribute('open');
                });
            }
        });
    });

    // --- 2) Mobile Menu ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('nav-open');
        });
    }

    // --- 3) Form Date Logic ---
    const startInput = document.getElementById('start_date');
    const endInput = document.getElementById('end_date');

    if (startInput) {
        const now = new Date();
        startInput.min = now.toISOString().slice(0, 16);
        
        startInput.addEventListener('change', () => {
            if (endInput) endInput.min = startInput.value;
        });
    }

    // --- 4) Footer Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});