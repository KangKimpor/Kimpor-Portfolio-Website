/* ============================================================
   Kimpor Kang - Portfolio
   Vanilla JS: slide-down menu panel, scroll reveal, active nav
   highlighting, project status filter, footer year.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Side menu (slides in from the right) ---------- */
  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');
  var navClose = document.getElementById('navClose');
  var navBackdrop = document.getElementById('navBackdrop');

  function setMenu(open) {
    if (!navPanel || !navToggle) { return; }
    navPanel.classList.toggle('is-open', open);
    navPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }

  function closeMenu() { setMenu(false); }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      setMenu(!navPanel.classList.contains('is-open'));
    });

    if (navClose) { navClose.addEventListener('click', closeMenu); }
    if (navBackdrop) { navBackdrop.addEventListener('click', closeMenu); }

    // Close after choosing a link
    navPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('[data-nav]');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var target = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Project status filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#projectsGrid .card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-status') === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) { card.classList.add('is-visible'); } // keep revealed after filtering
      });
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
