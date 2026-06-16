document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1) VARIABLER FÖR FORMULÄR & POLICY ---
    const form = document.getElementById('offerForm');
    const policyCheckbox = document.getElementById('policy_agreement');
    const submitBtn = document.getElementById('submitBtn');

    // --- 1.5) POLICY CHECKBOX LOGIC ---
    // Inaktiverar/Aktiverar skicka-knappen baserat på godkännande
    if (policyCheckbox && submitBtn) {
        // Säkerställ korrekt status vid sidladdning
        submitBtn.disabled = !policyCheckbox.checked;

        policyCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
    }

    // --- 1) FORM HANDLING & VALIDATION ---
    if (form) {
        form.addEventListener('submit', function(e) {
            let hasError = false;

            // 1. Validera vanliga textfält/selects (Markerade med required)
            const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
            requiredFields.forEach(field => {
                field.classList.remove('input-error');
                
                // Om fältet är tomt
                if (!field.value.trim()) {
                    field.classList.add('input-error');
                    hasError = true;
                }
            });

            // 2. Validera tjänsterna (Checkbox-gruppen i #service-toggles)
            const serviceGrid = document.getElementById('service-toggles');
            if (serviceGrid) {
                const serviceCheckboxes = serviceGrid.querySelectorAll('input[name="services[]"]');
                const isAnyServiceChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);

                if (!isAnyServiceChecked) {
                    serviceGrid.style.border = "2px solid #ff0000"; // Röd ram vid fel
                    serviceGrid.style.borderRadius = "10px";
                    hasError = true;
                } else {
                    serviceGrid.style.border = "none";
                }
            }

            // Stoppa inskick om fel finns
            if (hasError) {
                e.preventDefault();
                alert("Vänligen fyll i alla obligatoriska fält markerade med rött.");
            }
        });

        // Ta bort rött fält direkt när användaren börjar skriva/ändra
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
            });
            // Specifik lyssnare för checkboxar för att ta bort röd ram på gridden
            if (input.name === "services[]") {
                input.addEventListener('change', () => {
                    const serviceGrid = document.getElementById('service-toggles');
                    if (serviceGrid) serviceGrid.style.border = "none";
                });
            }
        });
    }

    // --- 2) ACCORDION LOGIC ---
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const content = card.querySelector('.content');
        
        // Auto-wrapper fix
        if (content && !content.querySelector('.content-inner')) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('content-inner');
            while (content.firstChild) {
                wrapper.appendChild(content.firstChild);
            }
            content.appendChild(wrapper);
        }

        // Stäng andra kort när ett öppnas
        const summary = card.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', (e) => {
                if (!card.open) {
                    cards.forEach(otherCard => {
                        if (otherCard !== card) otherCard.removeAttribute('open');
                    });
                }
            });
        }
    });

    // --- 3) MOBILE MENU ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('nav-open');
        });
    }

    // --- 4) DATE LOGIC (Sätt dagens datum som minimum) ---
    const startInput = document.getElementById('start_date');
    if (startInput) {
        const now = new Date();
        const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        startInput.min = localNow;
    }

    // --- 5) FOOTER YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});