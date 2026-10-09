(function () {
  'use strict';

  // Matches the ?v= suffix on the gallery cover images in index.html, so the
  // lightbox reuses the bytes the card already downloaded instead of refetching.
  var BUILD = '4';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function scrollBehavior() { return reducedMotion.matches ? 'instant' : 'smooth'; }

  // Only short, cancelable fades where CSS cannot describe the content change.
  function fadeContent(element) {
    if (!element || !element.animate) { return; }
    element.getAnimations().forEach(function (animation) {
      if (animation.id === 'content-fade') { animation.cancel(); }
    });
    if (!reducedMotion.matches) {
      element.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' }).id = 'content-fade';
    }
  }

  function setBackgroundInert(open) {
    document.querySelectorAll('.topbar, main, .footer, .skip-link').forEach(function (element) {
      element.inert = open;
    });
  }

  var topbar = document.querySelector('.topbar');
  if (topbar && 'ResizeObserver' in window) {
    new ResizeObserver(function () {
      document.documentElement.style.setProperty('--topbar-h', topbar.offsetHeight + 'px');
    }).observe(topbar);
  }

  var navToggle = document.getElementById('navToggle');
  var navPanel = document.getElementById('navPanel');
  var navClose = document.getElementById('navClose');
  var navBackdrop = document.getElementById('navBackdrop');

  function setMenu(open) {
    if (!navPanel || !navToggle) { return; }
    setBackgroundInert(open);
    navPanel.classList.toggle('is-open', open);
    navPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
    // Keep the off-canvas links out of the tab order while closed
    if (open) { navPanel.removeAttribute('inert'); } else { navPanel.setAttribute('inert', ''); }
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);

    if (open && navClose) { navClose.focus(); }
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
      if (e.key === 'Escape' && navPanel.classList.contains('is-open')) { closeMenu(); }
    });
  }

  // Close the mobile overlay when its trigger disappears at the desktop breakpoint.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (event) {
    if (event.matches && navPanel && navPanel.classList.contains('is-open')) {
      closeMenu();
      document.querySelector('.brand').focus({ preventScroll: true });
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') { return; }
    var panel = document.querySelector('.lightbox.is-open, .drawer.is-open');
    if (!panel) { return; }
    var controls = panel.querySelectorAll('a[href], button:not(:disabled)');
    var first = controls[0];
    var last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('[data-nav]');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var target = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === target;
          link.classList.toggle('is-active', active);
          if (active) { link.setAttribute('aria-current', 'location'); }
          else { link.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#projectsGrid .card');

  function isKnownFilter(value) {
    return value === 'all' || value === 'handed-over' || value === 'ongoing';
  }

  function applyFilter(filter, animate) {
    filterBtns.forEach(function (btn) {
      var active = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(function (card) {
      var show = filter === 'all' || card.getAttribute('data-status') === filter;
      card.classList.toggle('is-hidden', !show);
      if (show && animate) { fadeContent(card.querySelector('.card-body')); }
    });
    var result = document.getElementById('filterResult');
    if (result) { result.textContent = document.querySelectorAll('#projectsGrid .project-card:not(.is-hidden)').length + ' projects shown'; }
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
      if (btn.classList.contains('is-active')) { return; }
      applyFilter(filter, true);
      syncFilterToUrl(filter);
    });
  });

  if (filterBtns.length) {
    var requested = null;
    try { requested = new URL(window.location.href).searchParams.get('filter'); } catch (err) { requested = null; }
    applyFilter(isKnownFilter(requested) ? requested : 'all');
  }

  var galleryMedias = document.querySelectorAll('#projectsGrid .card-media');
  galleryMedias.forEach(function (media) {
    var trigger = media.querySelector('.gallery-cover');
    var cover = media.querySelector('img');
    if (cover) {
      function markMissing() { media.classList.add('is-empty'); }
      cover.addEventListener('error', markMissing);
      if (cover.complete && !cover.naturalWidth) { markMissing(); }
    }
    if (!trigger) { return; }
    trigger.addEventListener('click', function () {
      openLightbox(media.getAttribute('data-gallery'), parseInt(media.getAttribute('data-total'), 10), 0, trigger);
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCount = document.getElementById('lightboxCount');
  var lightboxSlug = '';
  var lightboxTotal = 0;
  var lightboxIndex = 0;
  var lastFocus = null;

  if (lightboxImg) {
    lightboxImg.decoding = 'async';
    lightboxImg.addEventListener('error', function () { document.getElementById('lightboxError').hidden = false; lightboxImg.style.visibility = 'hidden'; });
    lightboxImg.addEventListener('load', function () {
      document.getElementById('lightboxError').hidden = true; lightboxImg.style.visibility = 'visible';
      if (lightbox.classList.contains('is-open')) { fadeContent(lightboxImg); }
    });
  }

  function lightboxSrc(index) {
    var files = window.GALLERY_FILES && window.GALLERY_FILES[lightboxSlug];
    var name = (files && files[index])
      ? files[index]
      : (index < 9 ? '0' + (index + 1) : index + 1) + '.webp';
    return 'images/projects/' + lightboxSlug + '/' + name + '?v=' + BUILD;
  }

  function renderLightbox() {
    document.getElementById('lightboxError').hidden = true;
    if (lightboxImg) {
      lightboxImg.style.visibility = 'hidden';
      lightboxImg.alt = lightboxSlug.replace(/-/g, ' ') + ', photo ' + (lightboxIndex + 1) + ' of ' + lightboxTotal;
      lightboxImg.src = lightboxSrc(lightboxIndex);
    }
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
    setBackgroundInert(true);
    lightboxSlug = slug;
    lightboxTotal = total;
    var media = document.querySelector('[data-gallery="' + slug + '"]');
    var title = media.closest('.project-card').querySelector('h3').textContent;
    document.getElementById('lightboxTitle').textContent = title;
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
    setBackgroundInert(false);
    if (lastFocus && typeof lastFocus.focus === 'function') { lastFocus.focus(); }
  }

  function stepLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxTotal) % lightboxTotal;
    renderLightbox();
  }

  if (lightbox) {
    var touchStart = null;
    lightbox.addEventListener('touchstart', function (event) {
      if (event.touches.length !== 1) { touchStart = null; return; }
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      if (!touchStart || event.touches.length || event.changedTouches.length !== 1) { touchStart = null; return; }
      var dx = event.changedTouches[0].clientX - touchStart.x;
      var dy = event.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { stepLightbox(dx < 0 ? 1 : -1); }
      touchStart = null;
    }, { passive: true });
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', function () { stepLightbox(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { stepLightbox(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) { closeLightbox(); } });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (e.key === 'Escape') { closeLightbox(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepLightbox(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
    });
  }

  var portraitImgs = document.querySelectorAll('.portrait-frame img');
  portraitImgs.forEach(function (img) {
    var frame = img.closest('.portrait-frame');
    if (!frame) { return; }
    function markPortraitMissing() { frame.classList.add('is-empty'); }
    img.addEventListener('error', markPortraitMissing);
    if (img.complete && img.naturalWidth === 0) { markPortraitMissing(); }
  });

  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      var overview = document.getElementById('overview');
      if (overview) {
        overview.scrollIntoView({ behavior: scrollBehavior() });
      } else {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      }
      if (history.pushState) {
        history.pushState(null, null, '#overview');
      } else {
        window.location.hash = '#overview';
      }
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();
