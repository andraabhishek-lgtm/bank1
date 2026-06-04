/* ============================================================
   Stackly Bank — Main JavaScript
   Prepared by: Andra Abhishek | ID: STK-26-1248
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initTheme();
  initTicker();
  initScrollReveal();
  initBackToTop();
  initFAQ();
  initCounters();
  initHeroCarousel();
  initEMICalculator();
  initDashboard();
  setActiveNavLink();
  initPageTransition();
  if (document.querySelector('.password-strength')) initPasswordStrength();
  if (document.querySelector('.otp-input')) initOTPInputs();
  if (document.querySelector('.auth-form')) initAuthForms();
});

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  if (!hamburger || !mobileMenu) return;

  const close = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  const open = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const toggle = () => mobileMenu.classList.contains('open') ? close() : open();

  hamburger.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', close);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ===== THEME ===== */
function initTheme() {
  applyTheme('dark');
  const btn = document.querySelector('.nav-theme-btn');
  if (!btn) return;
  btn.setAttribute('aria-label', 'Dark mode locked');
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('tsb-theme', 'dark');
  const btn = document.querySelector('.nav-theme-btn');
  if (btn) btn.textContent = '☀️';
}

/* ===== ACTIVE NAV LINK ===== */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
}

/* ===== TICKER ===== */
function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => io.observe(el));
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== FAQ ===== */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ===== COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = el.getAttribute('data-decimals') || 0;
      let start = 0;
      const step = target / 70;
      const t = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(t); }
        el.textContent = Number(start.toFixed(decimals)).toLocaleString('en-IN') + suffix;
      }, 22);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ===== HERO CAROUSEL ===== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;
  let cur = 0, timer;
  const go = idx => {
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  };
  const start = () => { timer = setInterval(() => go(cur + 1), 5500); };
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); go(i); start(); }));
  start();
}

/* ===== EMI CALCULATOR ===== */
function initEMICalculator() {
  const calc = document.querySelector('.emi-calculator');
  if (!calc) return;
  const get = id => calc.querySelector(id);
  const pInput = get('#emi-amount'), rInput = get('#emi-rate'), tInput = get('#emi-tenure');
  const compute = () => {
    const P = parseFloat(pInput?.value || 500000);
    const R = parseFloat(rInput?.value || 10) / 1200;
    const N = parseFloat(tInput?.value || 60);
    const disp = (id, val) => { const el = get(id); if (el) el.textContent = val; };
    disp('#emi-amount-display', '₹' + P.toLocaleString('en-IN'));
    disp('#emi-rate-display', (R * 1200).toFixed(1) + '% p.a.');
    disp('#emi-tenure-display', N + ' months');
    if (R === 0) { disp('#emi-monthly', '₹' + Math.round(P / N).toLocaleString('en-IN')); return; }
    const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    const total = emi * N;
    disp('#emi-monthly', '₹' + Math.round(emi).toLocaleString('en-IN'));
    disp('#emi-total', '₹' + Math.round(total).toLocaleString('en-IN'));
    disp('#emi-interest', '₹' + Math.round(total - P).toLocaleString('en-IN'));
  };
  [pInput, rInput, tInput].forEach(el => el && el.addEventListener('input', compute));
  compute();
}

/* ===== DASHBOARD ===== */
function initDashboard() {
  if (!document.querySelector('.dashboard-layout')) return;
  const bars = document.querySelectorAll('.chart-bar-inner');
  setTimeout(() => bars.forEach(b => { b.style.height = (b.dataset.height || '50') + '%'; }), 300);
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ===== PAGE TRANSITION ===== */
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.style.opacity = '1'));
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.getAttribute('target') === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 320);
    });
  });
}

/* ===== PASSWORD STRENGTH ===== */
function initPasswordStrength() {
  const input = document.querySelector('#password');
  const strengthEl = document.querySelector('.password-strength');
  if (!input || !strengthEl) return;
  input.addEventListener('input', () => {
    const v = input.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const classes = ['', 'pw-weak', 'pw-fair', 'pw-good', 'pw-strong'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong ✓'];
    strengthEl.className = 'password-strength ' + (classes[score] || '');
    const t = strengthEl.querySelector('.strength-text');
    if (t) t.textContent = score ? 'Strength: ' + labels[score] : '';
  });
}

/* ===== OTP INPUTS ===== */
function initOTPInputs() {
  const inputs = [...document.querySelectorAll('.otp-input')];
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
      if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
    });
  });
}

/* ===== AUTH FORMS ===== */
function initAuthForms() {
  const loginForm = document.querySelector('#login-form');
  const signupForm = document.querySelector('#signup-form');
  const forgotForm = document.querySelector('#forgot-form');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      const emailVal = (document.querySelector('#user-id')?.value || '').trim();
      if (emailVal) localStorage.setItem('tsb-user-email', emailVal.toUpperCase());
      btn.textContent = 'Signing in...';
      btn.disabled = true;
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });
  }
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const pw = document.querySelector('#password')?.value;
      const cpw = document.querySelector('#confirm-password')?.value;
      if (pw !== cpw) { showToast('Passwords do not match', 'error'); return; }
      const signupEmail = (document.querySelector('#email')?.value || '').trim();
      if (signupEmail) localStorage.setItem('tsb-user-email', signupEmail.toUpperCase());
      const signupName = (document.querySelector('#full-name')?.value || '').trim();
      if (signupName) localStorage.setItem('tsb-user-name', signupName.toUpperCase());
      const btn = signupForm.querySelector('[type="submit"]');
      btn.textContent = 'Creating Account...';
      btn.disabled = true;
      setTimeout(() => {
        showToast('Account created successfully! Redirecting to login...', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1800);
      }, 1500);
    });
  }
  if (forgotForm) {
    forgotForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = forgotForm.querySelector('[type="submit"]');
      const step = forgotForm.dataset.step || '1';
      if (step === '1') {
        btn.textContent = 'Sending OTP...';
        btn.disabled = true;
        setTimeout(() => {
          showToast('OTP sent to your registered mobile/email', 'success');
          document.querySelector('.step-1')?.classList.add('d-none');
          document.querySelector('.step-2')?.classList.remove('d-none');
          forgotForm.dataset.step = '2';
          btn.textContent = 'Verify OTP';
          btn.disabled = false;
        }, 1200);
      } else if (step === '2') {
        btn.textContent = 'Verifying...';
        btn.disabled = true;
        setTimeout(() => {
          document.querySelector('.step-2')?.classList.add('d-none');
          document.querySelector('.step-3')?.classList.remove('d-none');
          forgotForm.dataset.step = '3';
          btn.textContent = 'Reset Password';
          btn.disabled = false;
        }, 1000);
      } else {
        btn.textContent = 'Resetting...';
        btn.disabled = true;
        setTimeout(() => {
          showToast('Password reset successful! Redirecting to login...', 'success');
          setTimeout(() => { window.location.href = 'login.html'; }, 1800);
        }, 1200);
      }
    });
  }

  // Password toggles
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = btn.previousElementSibling;
      if (!inp || inp.type === undefined) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
}

/* ===== TOAST ===== */
function showToast(msg, type = 'info') {
  let cont = document.querySelector('.toast-container');
  if (!cont) { cont = document.createElement('div'); cont.className = 'toast-container'; document.body.appendChild(cont); }
  const icons = { success: '✅', error: '❌', info: '🔔' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type] || '🔔'}</span><span style="font-size:.85rem;color:rgba(255,255,255,.85)">${msg}</span>`;
  cont.appendChild(t);
  setTimeout(() => { t.style.cssText = 'opacity:0;transform:translateX(36px);transition:.28s'; setTimeout(() => t.remove(), 300); }, 3200);
}

/* ===== CONTACT FORM ===== */
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      showToast('Message sent! Our team will contact you shortly.', 'success');
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1400);
  });
}
