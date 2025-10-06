/*
  Portfolio interactions (vanilla JS)
  - Nav toggle (mobile)
  - Smooth scrolling helpers
  - Form validation and fake submit handler
  - Theme toggle with localStorage persistence
*/

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Current year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navList = $('#nav-menu');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Hide on link click (mobile)
    navList.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll-down button
  $$('.scroll-down').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-scroll') || '#education';
      const el = $(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Smooth anchor scroll
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        const el = $(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Theme toggle
  const root = document.documentElement;
  const themeBtn = $('#theme-toggle');
  const THEME_KEY = 'pref-theme';
  const setTheme = (mode) => {
    if (mode === 'light') root.classList.add('light');
    else root.classList.remove('light');
    localStorage.setItem(THEME_KEY, mode);
  };
  // Initialize theme
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) setTheme(stored);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    });
  }

  // Form validation + demo submit
  const form = $('#contact-form');
  if (form) {
    const nameEl = $('#name');
    const emailEl = $('#email');
    const messageEl = $('#message');
    const statusEl = $('.form-status');

    const setError = (el, msg) => {
      const err = $(`.error[data-for="${el.id}"]`, form);
      if (err) err.textContent = msg || '';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setError(nameEl, '');
      setError(emailEl, '');
      setError(messageEl, '');

      let ok = true;
      if (!nameEl.value.trim()) { setError(nameEl, 'Please enter your name'); ok = false; }
      const email = emailEl.value.trim();
      if (!email) { setError(emailEl, 'Please enter your email'); ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(emailEl, 'Please enter a valid email'); ok = false; }
      if (!messageEl.value.trim()) { setError(messageEl, 'Please write a message'); ok = false; }
      if (!ok) return;

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = 'Sending...';
      }
      // Demo: simulate sending
      await new Promise((r) => setTimeout(r, 1200));
      if (statusEl) statusEl.textContent = 'Message sent successfully. Thank you!';
      form.reset();
    });
  }
})();


