/* ============================================================
   main.js - substitui o app.bundle minificado do mirror.
   Mesmo comportamento, sem os dois bugs do original:
     - o toggle do menu mobile lia uma variavel `s` inexistente
       e estourava ReferenceError no primeiro clique;
     - o icone do menu apontava para worldofys.com no hardcode.
   ============================================================ */
(function () {
  'use strict';

  /* --- menu mobile --------------------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('mobileNav');
    var icon = document.getElementById('toggleIcon');
    if (!toggle || !nav) return;

    var open = false;
    toggle.addEventListener('click', function () {
      open = !open;
      nav.classList.toggle('open', open);
      toggle.classList.toggle('is-open', open);
      if (icon) icon.alt = open ? 'Fechar menu' : 'Abrir menu';
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* --- header escurece ao rolar -------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById('global-header');
    if (!header) return;
    /* paginas com data-header-compacto no <body> ja abrem com o header
       reduzido e ficam assim (ex.: personagens/) */
    var sempre = document.body.hasAttribute('data-header-compacto');
    if (sempre) header.classList.add('scrld');
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrld', sempre || window.scrollY >= 400);
    }, { passive: true });
  }

  /* --- anima elementos .reveal ao entrar na tela --------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('active'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* --- parallax (rellax, carregado via CDN) -------------- */
  function initParallax() {
    if (typeof Rellax === 'undefined') return;
    if (!document.querySelector('.js-parallax')) return;
    new Rellax('.js-parallax');
  }

  /* --- slider da home ------------------------------------ */
  function initSlider() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.swiper')) return;
    new Swiper('.swiper', {
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }
    });
  }

  function init() {
    initMobileNav();
    initHeaderScroll();
    initReveal();
    initParallax();
    initSlider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
