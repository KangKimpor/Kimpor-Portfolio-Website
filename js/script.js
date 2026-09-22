/* ============================================================
   Kimpor Kang - Portfolio
   Lightweight vanilla JS: mobile nav, scroll reveal,
   active nav highlighting, project status filter, footer year.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after tapping a link (mobile)
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('.nav-link')) {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
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
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sections = document.querySelectorAll('section[id]');
  var linkMap = {};
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var hash = link.getAttribute('href');
    if (hash && hash.charAt(0) === '#') { linkMap[hash.slice(1)] = link; }
  });

  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && linkMap[entry.target.id]) {
          Object.keys(linkMap).forEach(function (id) {
            linkMap[id].classList.remove('is-active');
          });
          linkMap[entry.target.id].classList.add('is-active');
        }
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
