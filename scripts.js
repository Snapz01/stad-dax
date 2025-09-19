// Mobilmeny
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
      nav.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Klientvalidering
const form = document.getElementById('offerForm');
const statusEl = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', (e) => {
    const servicesChecked = form.querySelectorAll('input[name="services[]"]:checked').length > 0;
    if (!servicesChecked) {
      e.preventDefault();
      statusEl.textContent = 'Välj minst en tjänst tack.';
      return;
    }
    const required = ['name', 'email', 'phone', 'zip', 'frequency'];
    for (const n of required) {
      const el = form.querySelector(`[name="${n}"]`);
      if (!el || !el.value.trim()) {
        e.preventDefault();
        statusEl.textContent = 'Fyll i alla obligatoriska fält.';
        if (el) el.focus();
        return;
      }
    }
    statusEl.textContent = 'Skickar…';
  });
}

// Auto-uppdatera årtal i footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Scrolla till formuläret när panelen öppnas
const offerPanel = document.getElementById('offerPanel');
if (offerPanel) {
  offerPanel.addEventListener('toggle', () => {
    if (offerPanel.open) {
      offerPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
