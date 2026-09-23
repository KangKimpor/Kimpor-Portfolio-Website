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

  /* ---------- Motion ----------
     Text is visible without this script. The class is only a hook
     for anything that still looks for .is-visible after filtering. */
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el) { el.classList.add('is-visible'); });

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

  /* ---------- Project galleries ----------
     Only the cover, plus the slide on either side of the one in view,
     is downloaded. The rest wait until the visitor swipes. */
  var BUILD = '3';

  function photoSrc(slug, n) {
    var name = (n < 10 ? '0' : '') + n;
    return 'images/projects/' + slug + '/' + name + '.jpg?v=' + BUILD;
  }

  var galleryMedias = document.querySelectorAll('#projectsGrid .card-media');

  galleryMedias.forEach(function (media) {
    var slug = media.getAttribute('data-gallery');
    var total = parseInt(media.getAttribute('data-total'), 10) || 0;
    // Exact filenames from the build manifest (extensions vary: jpg/png)
    var files = (window.GALLERY_FILES && window.GALLERY_FILES[slug]) || null;
            if (!slug || total < 2) { return; }

    var track = document.createElement('div');
    track.className = 'gallery-track';
    var slides = [];

    var cover = media.querySelector('img');
    if (cover) {
      cover.alt = slug.replace(/-/g, ' ');
      cover.decoding = 'async';
      cover.draggable = false;
      track.appendChild(cover);
      slides.push(cover);
    }

    for (var i = 2; i <= total; i++) {
      var img = document.createElement('img');
      img.src = 'images/projects/' + slug + '/' + (files && files[i - 1] ? files[i - 1] : (i < 10 ? '0' + i : i) + '.jpg');
      img.alt = slug.replace(/-/g, ' ');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      track.appendChild(img);
      slides.push(img);
    }

    function loadAround(index) {
      for (var j = index - 1; j <= index + 1; j++) {
        if (j < 0 || j >= slides.length) { continue; }
        var wanted = photoSrc(slug, j + 1);
        if (slides[j].getAttribute('data-src-set') !== wanted) {
          slides[j].src = wanted;
          slides[j].setAttribute('data-src-set', wanted);
        }
      }
    }

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'gal-btn gal-prev';
    prev.setAttribute('aria-label', 'Previous photo');
    prev.textContent = '\u2039';

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'gal-btn gal-next';
    var max = total - 1;
    var current = 0;
    next.setAttribute('aria-label', 'Next photo');
    next.textContent = '\u203a';

    var count = document.createElement('span');
    count.className = 'gal-count';
    count.textContent = '1/' + total;

    function syncCount() {
      var w = track.clientWidth || 1;
      current = Math.min(max, Math.round(track.scrollLeft / w));
      count.textContent = (current + 1) + '/' + total;
      loadAround(current);
    }
    track.addEventListener('scroll', syncCount, { passive: true });
    window.addEventListener('resize', syncCount);

    prev.addEventListener('click', function (e) {
      e.stopPropagation();
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
    next.addEventListener('click', function (e) {
      e.stopPropagation();
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });

    media.appendChild(track);
    media.appendChild(prev);
    media.appendChild(next);
    media.appendChild(count);

    if ('IntersectionObserver' in window) {
      var near = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          loadAround(0);
          near.unobserve(media);
        });
      }, { rootMargin: '240px 0px' });
      near.observe(media);
    } else {
      loadAround(0);
    }

    var dragX = 0;
    track.addEventListener('pointerdown', function (e) { dragX = e.clientX; });
    track.addEventListener('click', function (e) {
      if (e.target.tagName !== 'IMG') { return; }
      if (Math.abs(e.clientX - dragX) > 8) { return; }
      openLightbox(slug, total, current);
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCount = document.getElementById('lightboxCount');
  var lightboxSlug = '';
  var lightboxTotal = 0;
  var lightboxIndex = 0;

  if (lightboxImg) { lightboxImg.decoding = 'async'; }

  function lightboxSrc(index) {
    var files = window.GALLERY_FILES && window.GALLERY_FILES[lightboxSlug];
    var name = (files && files[index])
      ? files[index]
      : (index < 9 ? '0' + (index + 1) : index + 1) + '.jpg';
    return 'images/projects/' + lightboxSlug + '/' + name;
  }

  function renderLightbox() {
    if (lightboxImg) { lightboxImg.src = lightboxSrc(lightboxIndex); }
    if (lightboxCount) { lightboxCount.textContent = (lightboxIndex + 1) + ' / ' + lightboxTotal; }
    // Preload only the next photo so stepping forward feels instant
    if (lightboxTotal > 1) {
      var pre = new Image();
      pre.src = lightboxSrc((lightboxIndex + 1) % lightboxTotal);
    }
  }

  function openLightbox(slug, total, index) {
    lightboxSlug = slug;
    lightboxTotal = total;
    lightboxIndex = index;
    renderLightbox();
    if (lightbox) {
      lightbox.classList.add('is-open');
      document.body.classList.add('lb-open');
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lb-open');
    }
  }

  function stepLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxTotal) % lightboxTotal;
    renderLightbox();
  }

  if (lightbox) {
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', function () { stepLightbox(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { stepLightbox(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { closeLightbox(); } });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      if (e.key === 'ArrowLeft') { stepLightbox(-1); }
      if (e.key === 'ArrowRight') { stepLightbox(1); }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
