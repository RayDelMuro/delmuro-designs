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


// === VIDEO SCROLL-TRIGGER (VIMEO) ===
(function () {
  const iframe = document.getElementById('vimeo-visibility');
  if (!iframe || typeof Vimeo === 'undefined') return;

  const player = new Vimeo.Player(iframe);
  let hasStarted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.7 && !hasStarted) {
        // Start playing when 70% in view
        player.play();
        hasStarted = true;
      } else if (entry.intersectionRatio < 0.2) {
        // Only pause when mostly scrolled out of view
        player.pause();
        hasStarted = false;
      }
    });
  }, { threshold: [0.2, 0.7] });

  observer.observe(iframe);
})();


// === PROVEN PROCESS — hover-to-activate + progress rail ===
(function(){
  // Tall-column track layout (process.html)
  document.querySelectorAll('.dm-proven-process').forEach(function(section){
    var steps = section.querySelectorAll('.dm-pp-step');
    var fill  = section.querySelector('.dm-pp-fill');
    var head  = section.querySelector('.dm-pp-head');
    var track = section.querySelector('.dm-pp-track');
    if (!steps.length) return;

    function activate(i){
      steps.forEach(function(s, idx){ s.classList.toggle('is-active', idx === i); });
      var pct = ((i + 1) / steps.length) * 100;
      if (fill) fill.style.width = pct + '%';
      if (head) head.style.left  = pct + '%';
    }

    steps.forEach(function(step, i){
      step.addEventListener('mouseenter', function(){ activate(i); });
    });

    if (track){
      track.addEventListener('mouseleave', function(){ activate(0); });
    }
  });

  // Compact box layout (index.html)
  document.querySelectorAll('.dm-pp-boxes-grid').forEach(function(grid){
    var boxes     = grid.querySelectorAll('.dm-pp-box');
    var wrap      = grid.closest('.dm-pp-boxes-wrap');
    var railFill  = wrap ? wrap.querySelector('.dm-pp-srail__fill') : null;
    var railSteps = wrap ? wrap.querySelectorAll('.dm-pp-srail__step') : [];
    if (!boxes.length) return;

    function activate(i){
      boxes.forEach(function(b, idx){ b.classList.toggle('is-active', idx === i); });
      railSteps.forEach(function(s, idx){
        s.classList.toggle('is-active',    idx === i);
        s.classList.toggle('is-completed', idx < i);
      });
      if (railFill) railFill.style.width = (((i + 1) / boxes.length) * 100) + '%';
    }

    boxes.forEach(function(box, i){
      box.addEventListener('mouseenter', function(){ activate(i); });
    });

    if (wrap){
      wrap.addEventListener('mouseleave', function(){ activate(0); });
    }
  });
})();


// === WHO THIS IS FOR — SCROLL REVEAL ===
(function () {
  var cards = document.querySelectorAll('.fit-card');
  if (!cards.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(function (c) { c.classList.add('is-visible'); });
    return;
  }
  cards.forEach(function (c) { c.classList.add('is-pending'); });
  if (!('IntersectionObserver' in window)) {
    cards.forEach(function (c) { c.classList.remove('is-pending'); c.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = Array.prototype.indexOf.call(cards, el) * 120;
        setTimeout(function () {
          el.classList.remove('is-pending');
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(function (c) { observer.observe(c); });
})();


// === HERO ANIMATION — play once, no loop, reveal caption at end ===
(function () {
  var iframe  = document.getElementById('hero-anim');
  var caption = document.querySelector('.hero__image-caption');
  if (!iframe) return;

  // ── Set ANIM_MS to the exact runtime of the animation ──
  var ANIM_MS = 8000; // milliseconds — adjust after watching it play through

  // ── Cache-bust: append a timestamp so the browser always does a fresh
  //    parse of the bundled HTML, preventing the stale-cache DOMContentLoaded
  //    race condition that causes the animation to silently stay on the
  //    thumbnail placeholder on refresh. ──
  var baseSrc = iframe.src.split('?')[0];
  iframe.src  = baseSrc + '?t=' + Date.now();

  // ── Watchdog: if the thumbnail placeholder (#__bundler_thumbnail) inside
  //    the iframe is still visible 4 seconds after load, the unpacker didn't
  //    run — reload the iframe once to recover. ──
  var reloaded = false;
  function watchdog() {
    if (reloaded) return;
    try {
      var doc       = iframe.contentDocument || iframe.contentWindow.document;
      var thumbnail = doc && doc.getElementById('__bundler_thumbnail');
      if (thumbnail) {
        var style = thumbnail.currentStyle || iframe.contentWindow.getComputedStyle(thumbnail);
        if (style && style.display !== 'none') {
          reloaded  = true;
          iframe.src = baseSrc + '?t=' + Date.now();
          return;
        }
      }
    } catch (e) { /* cross-origin guard — safe to ignore */ }
  }

  function onLoad() {
    iframe.removeEventListener('load', onLoad);

    // Fade the iframe in cleanly — hides the loading flash
    iframe.classList.add('is-loaded');

    // Run watchdog 4 s after load — if animation didn't start, reload once
    setTimeout(watchdog, 4000);

    // Show caption exactly when animation ends
    if (caption) {
      setTimeout(function () {
        caption.classList.add('hero__caption--visible');
      }, ANIM_MS + 1500);
    }
  }

  iframe.addEventListener('load', onLoad);
})();


// === INSTANT JUMP FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const nav = document.querySelector('.nav');
    const offset = nav ? nav.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'instant' });
  });
});

// === THOUGHT PROGRESSION — scroll reveal ===
(function () {
  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  items.forEach(function (el) { observer.observe(el); });
})();


// === FAQ ACCORDION ===
(function () {
  const list = document.getElementById('faqList');
  if (!list) return;
  const items = list.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item, unless it was already open (toggle off)
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// === MOBILE NAV HAMBURGER ===
(function () {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  if (!nav || !hamburger) return;

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav__mobile-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      nav.classList.remove('nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();
