/* =========================================================
   GymFlow — main.js
   Header scroll · Mobile nav · Scroll reveal · Smooth scroll
   ========================================================= */

(function () {
  'use strict';

  /* ── Header: cambia estilo al hacer scroll ─────────────── */
  var header = document.getElementById('header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ── Scroll reveal ─────────────────────────────────────── */
  /*
    CORRECCIÓN DEL BUG PRINCIPAL:
    El CSS base de .reveal tiene opacity:1 (siempre visible).
    Solo cuando JS confirma soporte, añadimos 'js-reveal-ready'
    al <html>, lo que activa el estado oculto inicial via CSS.
    Después IntersectionObserver añade .visible para animar la entrada.

    Si este JS falla por cualquier razón, el HTML no tiene
    'js-reveal-ready' y todo el contenido sigue siendo visible.
  */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    /* Paso 1: señalar al CSS que JS está activo */
    document.documentElement.classList.add('js-reveal-ready');

    /* Paso 2: observar cada elemento */
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

  }
  /* Si no hay IntersectionObserver: no añadimos js-reveal-ready,
     el contenido queda visible sin animación. */

  /* ── Mobile nav ────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var closeBtn  = document.getElementById('mobileNavClose');

  function openMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  window.closeMobileNav = function () {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (closeBtn)  closeBtn.addEventListener('click', window.closeMobileNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      window.closeMobileNav();
    }
  });

  /* ── FAQ accordion ───────────────────────────────────── */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var button = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      var icon   = item.querySelector('.faq-icon');

      if (!button || !answer) return;

      answer.style.maxHeight = '0px';
      answer.setAttribute('aria-hidden', 'true');
      button.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '+';

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        if (isOpen) {
          item.classList.remove('open');
          button.setAttribute('aria-expanded', 'false');
          answer.setAttribute('aria-hidden', 'true');
          answer.style.maxHeight = '0px';
          if (icon) icon.textContent = '+';
          return;
        }

        faqItems.forEach(function (otherItem) {
          var otherButton = otherItem.querySelector('.faq-question');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          var otherIcon   = otherItem.querySelector('.faq-icon');

          if (!otherButton || !otherAnswer) return;

          otherItem.classList.remove('open');
          otherButton.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('aria-hidden', 'true');
          otherAnswer.style.maxHeight = '0px';
          if (otherIcon) otherIcon.textContent = '+';
        });

        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (icon) icon.textContent = '−';
      });
    });

    window.addEventListener('resize', function () {
      faqItems.forEach(function (item) {
        if (!item.classList.contains('open')) return;
        var answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ── Smooth scroll para links internos ─────────────────── */
  initFaqAccordion();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      var headerH = header ? header.offsetHeight : 0;
      var targetY = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

})();
