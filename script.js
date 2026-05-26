/* DelMuro Designs — Landing Page Scripts */

// === HERO COLLAGE ROTATOR ===
(function () {
  const slides = document.querySelectorAll('.collage__slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;

  let current  = 0;
  let interval = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    interval = setInterval(() => goTo(current + 1), 3500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      goTo(i);
      startAuto();
    });
  });

  startAuto();
})();


// === NAV SCROLL STATE ===
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// === SCROLL FADE-IN ===
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger cards in a grid
      const delay = entry.target.closest('.relationships__grid, .diff__grid, .process__steps')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


// === PROCESS STEPS CAROUSEL ===
(function () {
  const steps = document.querySelectorAll('.process__steps .step');
  if (!steps.length) return;

  let current = 0;
  let interval = null;

  function activate(idx) {
    steps.forEach(s => s.classList.remove('active'));
    steps[idx].classList.add('active');
  }

  function start() {
    activate(current);
    interval = setInterval(() => {
      current = (current + 1) % steps.length;
      activate(current);
    }, 3000);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !interval) {
        start();
      } else if (!entry.isIntersecting) {
        clearInterval(interval);
        interval = null;
        steps.forEach(s => s.classList.remove('active'));
        current = 0;
      }
    });
  }, { threshold: 0.3 });

  const stepsWrap = document.querySelector('.process__steps');
  if (stepsWrap) observer.observe(stepsWrap);
})();


// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// === BOOKING MODAL ===
(function () {
  const overlay = document.getElementById('bookingModal');
  if (!overlay) return;

  const modal   = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal__close');
  const form    = overlay.querySelector('.modal__form');
  const success = overlay.querySelector('.modal__success');

  function openModal() {
    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    form.querySelector('input').focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.js-book-modal').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (!modal.contains(e.target)) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // AJAX submit — show success state, fallback to native on error
  form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.hidden = true;
        success.hidden = false;
        setTimeout(closeModal, 2500);
      } else {
        form.submit();
      }
    } catch {
      form.submit();
    }
  });
})();
