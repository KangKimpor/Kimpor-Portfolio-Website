/* ============================================================
   Kimpor Kang - Portfolio
   Vanilla JS: mobile drawer, scroll-spy navigation, project
   status filter (synced to the URL), lazy photo galleries,
   lightbox, portrait fallback, inquiry form, footer year.
   ============================================================ */

(function () {
  'use strict';

  var BUILD = '3';

  /* ---------- Mobile drawer (slides in from the right) ---------- */
  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');
  var navClose = document.getElementById('navClose');
  var navBackdrop = document.getElementById('navBackdrop');

  function setMenu(open) {
    if (!navPanel || !navToggle) { return; }
    navPanel.classList.toggle('is-open', open);
    navPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    // Keep the off-canvas links out of the tab order while closed
    if (open) { navPanel.removeAttribute('inert'); } else { navPanel.setAttribute('inert', ''); }
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);

    var closeBtn = document.getElementById('navClose');
    if (open && closeBtn) { closeBtn.focus(); }
    if (!open) { navToggle.focus(); }
  }

  function closeMenu() { setMenu(false); }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      setMenu(!navPanel.classList.contains('is-open'));
    });
    if (navClose) { navClose.addEventListener('click', closeMenu); }
    if (navBackdrop) { navBackdrop.addEventListener('click', closeMenu); }

    navPanel.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); }
    });
  }

  /* ---------- Scroll-spy navigation ---------- */
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

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- Project status filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#projectsGrid .card');

  function isKnownFilter(value) {
    return value === 'all' || value === 'handed-over' || value === 'ongoing';
  }

  function applyFilter(filter) {
    filterBtns.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-filter') === filter);
    });
    cards.forEach(function (card) {
      var show = filter === 'all' || card.getAttribute('data-status') === filter;
      card.classList.toggle('is-hidden', !show);
    });
  }

  function syncFilterToUrl(filter) {
    try {
      var url = new URL(window.location.href);
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      window.history.replaceState(null, '', url.toString());
    } catch (err) {
      /* file:// or an older browser: the filter simply stays in memory */
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter') || 'all';
      applyFilter(filter);
      syncFilterToUrl(filter);
    });
  });

  if (filterBtns.length) {
    var requested = null;
    try { requested = new URL(window.location.href).searchParams.get('filter'); } catch (err) { requested = null; }
    if (requested && isKnownFilter(requested)) { applyFilter(requested); }
  }

  /* ---------- Project galleries ----------
     Only the cover, plus the slide on either side of the one in
     view, is downloaded. The rest wait until the visitor swipes. */
  function slideSrc(slug, files, index) {
    var name = (files && files[index])
      ? files[index]
      : (index < 9 ? '0' + (index + 1) : index + 1) + '.jpg';
    return 'images/projects/' + slug + '/' + name + '?v=' + BUILD;
  }

  var galleryMedias = document.querySelectorAll('#projectsGrid .card-media');

  galleryMedias.forEach(function (media) {
    var slug = media.getAttribute('data-gallery');
    var total = parseInt(media.getAttribute('data-total'), 10) || 0;
    var files = (window.GALLERY_FILES && window.GALLERY_FILES[slug]) || null;
    if (!slug || total < 2) { return; }

    var track = document.createElement('div');
    track.className = 'gallery-track';
    var slides = [];
    var current = 0;

    var cover = media.querySelector('img');
    if (cover) {
      if (!cover.alt) { cover.alt = slug.replace(/-/g, ' '); }
      cover.decoding = 'async';
      cover.draggable = false;
      // Already carries its final URL, so loadAround must not re-request it
      cover.setAttribute('data-src-set', cover.getAttribute('src') || '');
      track.appendChild(cover);
      slides.push(cover);
    }

    // Slides ship without src; loadAround assigns it as they come into play
    for (var i = 2; i <= total; i++) {
      var img = document.createElement('img');
      img.alt = slug.replace(/-/g, ' ') + ' photo ' + i;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      track.appendChild(img);
      slides.push(img);
    }

    function loadAround(index) {
      for (var j = index - 1; j <= index + 1; j++) {
        if (j < 0 || j >= slides.length) { continue; }
        var wanted = slideSrc(slug, files, j);
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
    prev.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-chev-left"></use></svg>';

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'gal-btn gal-next';
    next.setAttribute('aria-label', 'Next photo');
    next.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-chev-right"></use></svg>';

    // The counter doubles as the keyboard route into the full gallery
    var count = document.createElement('button');
    count.type = 'button';
    count.className = 'gal-count';
    count.textContent = '1 / ' + total;
    count.setAttribute('aria-label', 'Open the full gallery, photo 1 of ' + total + ' photos');

    function updatePosition() {
      var width = track.clientWidth || 1;
      current = Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / width)));
      count.textContent = (current + 1) + ' / ' + total;
      count.setAttribute('aria-label', 'Open the full gallery, photo ' + (current + 1) + ' of ' + total + ' photos');
      loadAround(current);
    }

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(updatePosition);
    }, { passive: true });

    prev.addEventListener('click', function (e) {
      e.stopPropagation();
      track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
    });
    next.addEventListener('click', function (e) {
      e.stopPropagation();
      track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
    });
    count.addEventListener('click', function (e) {
      e.stopPropagation();
      openLightbox(slug, total, current, count);
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
      openLightbox(slug, total, current, count);
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCount = document.getElementById('lightboxCount');
  var lightboxSlug = '';
  var lightboxTotal = 0;
  var lightboxIndex = 0;
  var lastFocus = null;

  if (lightboxImg) { lightboxImg.decoding = 'async'; }

  function lightboxSrc(index) {
    var files = window.GALLERY_FILES && window.GALLERY_FILES[lightboxSlug];
    var name = (files && files[index])
      ? files[index]
      : (index < 9 ? '0' + (index + 1) : index + 1) + '.jpg';
    return 'images/projects/' + lightboxSlug + '/' + name + '?v=' + BUILD;
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

  function openLightbox(slug, total, index, trigger) {
    if (!lightbox) { return; }
    lastFocus = trigger || document.activeElement;
    lightboxSlug = slug;
    lightboxTotal = total;
    lightboxIndex = index;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.removeAttribute('inert');
    document.body.classList.add('lb-open');
    var closeBtn = document.getElementById('lbClose');
    if (closeBtn) { closeBtn.focus(); }
  }

  function closeLightbox() {
    if (!lightbox) { return; }
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('inert', '');
    document.body.classList.remove('lb-open');
    if (lastFocus && typeof lastFocus.focus === 'function') { lastFocus.focus(); }
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

  /* ---------- Portrait fallback ---------- */
  var portraitImg = document.getElementById('portraitImg');
  var portraitFrame = portraitImg && portraitImg.closest('.portrait-frame');

  if (portraitImg && portraitFrame) {
    function markPortraitMissing() { portraitFrame.classList.add('is-empty'); }
    portraitImg.addEventListener('error', markPortraitMissing);
    if (portraitImg.complete && portraitImg.naturalWidth === 0) { markPortraitMissing(); }
  }

  /* ---------- Inquiry form ----------
     The site is static, so the form hands the message to the
     visitor's own mail client instead of pretending to send it. */
  var inquiryForm = document.getElementById('portfolioContactForm');
  var inquiryNotice = document.getElementById('contactFormNotice');

  function fieldValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var to = inquiryForm.getAttribute('data-mailto') || 'kimporkang01@gmail.com';
      var topic = fieldValue('inqTopic') || 'Project inquiry';
      var lines = [
        'Name: ' + fieldValue('inqName'),
        'Company: ' + fieldValue('inqCompany'),
        'Email: ' + fieldValue('inqEmail'),
        'Engagement: ' + topic,
        '',
        fieldValue('inqMessage')
      ];
      var url = 'mailto:' + to +
        '?subject=' + encodeURIComponent('Project inquiry: ' + topic) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = url;

      if (inquiryNotice) {
        inquiryNotice.textContent = 'Your mail client should open with these details addressed to Kimpor Kang. If it does not open, email kimporkang01@gmail.com directly.';
        inquiryNotice.hidden = false;
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();
