(function (root, factory) {
  'use strict';
  const api = factory(typeof module === 'object' && module.exports ? require('./jll-remix-content-archive.js') : root.SPSContentArchive);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.SPSJournalPresentation = api; api.start(root); }
})(typeof window === 'undefined' ? null : window, function (archive) {
  'use strict';
  function urlFor(article, category = 'all', search = '') {
    const params = new URLSearchParams();
    const source = new URLSearchParams(search);
    const layout = source.get('layout');
    if (source.get('embed') === '1') params.set('embed','1');
    if (layout === 'desktop' || layout === 'responsive') params.set('layout', layout);
    if (category !== 'all') params.set('category', category);
    if (article) params.set('article', article.id);
    return 'jll-remix-journal-v2.html' + (params.size ? '?' + params : '') + (article ? '' : '#archive');
  }
  function cards(items, category = 'all', search = typeof location === 'undefined' ? '' : location.search) {
    return archive.cards(items, {
      hrefFor:article=>urlFor(article,category,search),
      labelFor:article=>article.collection === 'research' ? '리서치' : 'CEO 저널'
    });
  }
  const clamp01 = value => Math.max(0, Math.min(1, value));
  function heroFrame(progress, width, height, portraitWidth, portraitTop = 0) {
    const p = clamp01(progress);
    const eased = p * p * (3 - 2 * p);
    return {
      insetTop: portraitTop * (1 - eased),
      insetX: (width - portraitWidth) / 2 * (1 - eased),
      insetBottom: 0,
      scale: 1.04 - .04 * eased
    };
  }
  // Photo intersection, excluding the opaque reading surface as it passes the utility row.
  function navPhotoBounds(frame, state, nav, scale = 1, surfaceTop = Infinity) {
    const left = Math.max(nav.left, frame.left + state.insetX * scale);
    const right = Math.min(nav.right, frame.right - state.insetX * scale);
    const top = Math.max(nav.top, frame.top + state.insetTop * scale);
    const bottom = Math.min(nav.bottom, frame.bottom - state.insetBottom * scale, surfaceTop);
    if (right <= left || bottom <= top) return null;
    return {
      left: (left - nav.left) / scale, right: (right - nav.left) / scale,
      top: (top - nav.top) / scale, bottom: (bottom - nav.top) / scale,
      width: nav.width / scale, height: nav.height / scale
    };
  }
  function articleHero(win) {
    const doc = win.document;
    const reduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    let active = null, metrics = null, pending = 0, layoutPending = false;
    const nav = doc.querySelector('.iv2-page-nav');
    let navPhoto = null;
    function resetNav() {
      nav?.removeAttribute('data-photo-backed');
      nav?.removeAttribute('data-reading-backed');
      nav?.style.removeProperty('--iv2-nav-surface-clip');
      if (navPhoto) navPhoto.hidden = true;
    }
    function makeNavPhoto() {
      navPhoto?.remove();
      navPhoto = null;
      if (!nav || !active) return;
      // A visual copy only. The original links retain focus, events and semantics.
      const copy = nav.querySelector('.iv2-page-nav-inner').cloneNode(true);
      copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      copy.querySelectorAll('[data-journal-back]').forEach(el => el.removeAttribute('data-journal-back'));
      copy.querySelectorAll('a').forEach(el => { el.removeAttribute('href'); el.setAttribute('tabindex', '-1'); });
      navPhoto = doc.createElement('div');
      navPhoto.className = 'iv2-nav-photo';
      navPhoto.setAttribute('aria-hidden', 'true');
      navPhoto.setAttribute('inert', '');
      navPhoto.hidden = true;
      navPhoto.append(copy);
      nav.append(navPhoto);
    }
    function paintNav(frame, state) {
      // Keep the row with the title: pinned during expansion, then leave together.
      // Measuring the live heading also handles static/reduced-motion layouts.
      if(nav){
        const shift=Math.min(0,metrics.head.getBoundingClientRect().top/metrics.scale-metrics.top);
        nav.style.setProperty('--iv2-nav-shift',shift+'px');
        nav.inert=shift<=-metrics.navHeight/metrics.scale;
      }
      const navRect = nav?.getBoundingClientRect();
      const surfaceTop = metrics.content?.getBoundingClientRect().top ?? Infinity;
      const bounds = metrics.pinned && !nav?.inert && navRect && navPhoto
        ? navPhotoBounds(frame.getBoundingClientRect(), state, navRect, metrics.scale, surfaceTop)
        : null;
      if (!bounds) resetNav();
      else {
        const {left, right, top, bottom, width, height} = bounds;
        navPhoto.style.clipPath = 'inset(' + top + 'px ' + (width - right) + 'px ' + (height - bottom) + 'px ' + left + 'px)';
        // Before reading begins, open the surface only along the visible photo edge.
        nav.style.setProperty('--iv2-nav-surface-clip',
          'polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0,' +
          left + 'px ' + top + 'px,' + right + 'px ' + top + 'px,' +
          right + 'px ' + bottom + 'px,' + left + 'px ' + bottom + 'px,' + left + 'px ' + top + 'px)');
        nav.setAttribute('data-photo-backed', '');
        navPhoto.hidden = false;
      }
      // This applies to static/reduced-motion articles as well as the pinned scene.
      if (navRect && surfaceTop <= navRect.bottom) nav.setAttribute('data-reading-backed', '');
      else nav?.removeAttribute('data-reading-backed');
    }

    function measure() {
      if (!active) return;
      const article = active.closest('.journal-article');
      const intro = active.closest('.iv2-article-intro');
      const head = intro.querySelector('.journal-article-head');
      const overlay = intro.querySelector('.iv2-title-overlay');
      const content = article.querySelector('.iv2-article-content');
      const rect = article.getBoundingClientRect();
      if (!rect.width || !article.offsetWidth) return;
      const scale = rect.width / article.offsetWidth;
      const header = doc.querySelector('[data-sps-header]');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      article.style.setProperty('--iv2-page-nav-height', navHeight / scale + 'px');
      const width = doc.documentElement.clientWidth / scale;
      const headRect = head.getBoundingClientRect();
      const headingRect = head.querySelector('h1')?.getBoundingClientRect() || headRect;
      const titleHeight = headRect.height / scale;
      const headingOffset = (headingRect.top - headRect.top) / scale;
      const gap = parseFloat(win.getComputedStyle(intro).getPropertyValue('--iv2-hero-gap')) || 64;
      const top = (headerHeight + navHeight) / scale + (parseFloat(win.getComputedStyle(article).paddingTop) || 0);
      // Both the starting portrait and expanded photo meet the viewport's bottom edge.
      const available = win.innerHeight / scale - top;
      // Extend the canvas up to the global header without moving the title or starting portrait.
      const pinned = !reduce.matches && available - titleHeight - gap >= 220;
      const overhang = pinned ? top - headerHeight / scale : 0;
      const height = pinned ? available + overhang : Math.min(480, Math.max(240, width * .65));
      const portraitTop = pinned ? overhang + titleHeight + gap : 0;
      const travel = pinned ? Math.min(520, Math.max(360, available * .85)) : 0;
      // Release when the main title has equal space above and below it in the photo.
      // Measure the H1 separately so the category and wrapped titles stay balanced.
      const spaceAboveHeading = overhang + headingOffset;
      const spaceBelowHeading = available - headingOffset - headingRect.height / scale;
      const readingOverlap = pinned && content ? Math.max(0, spaceBelowHeading - spaceAboveHeading) : 0;
      article.style.setProperty('--iv2-reading-overlap', readingOverlap + 'px');
      article.style.setProperty('--iv2-hero-width', width + 'px');
      intro.style.setProperty('--iv2-hero-width', width + 'px');
      intro.style.setProperty('--iv2-hero-height', height + 'px');
      intro.style.setProperty('--iv2-content-width', article.offsetWidth + 'px');
      intro.style.setProperty('--iv2-scene-top', top + 'px');
      intro.style.setProperty('--iv2-scene-height', (pinned ? available : height) + 'px');
      intro.style.setProperty('--iv2-hero-overhang', overhang + 'px');
      intro.style.setProperty('--iv2-hero-travel', travel + 'px');
      intro.toggleAttribute('data-pinned', pinned);
      const origin = intro.getBoundingClientRect().top + win.scrollY;
      const start = Math.max(0, origin - top * scale);
      metrics = {
        width, height, pinned, portraitTop, titleHeight, overlay, intro, overhang, scale, content, article, head, top, navHeight,
        portraitWidth: Math.min(360, width * .68, (height - portraitTop) / 1.05),
        start, end: start + Math.max(1, travel * scale)
      };
    }
    function paint() {
      pending = 0;
      if (!active) return;
      if (layoutPending) { layoutPending = false; measure(); }
      if (!metrics) return;
      const p = !metrics.pinned ? 1 : (win.scrollY - metrics.start) / (metrics.end - metrics.start);
      const state = heroFrame(p, metrics.width, metrics.height, metrics.portraitWidth, metrics.portraitTop);
      const frame = active.querySelector('.iv2-hero-frame');
      const clip = 'inset(' + state.insetTop + 'px ' + state.insetX + 'px ' + state.insetBottom + 'px)';
      frame.style.clipPath = clip;
      if (metrics.overlay) metrics.overlay.style.clipPath = clip;
      const shade = metrics.pinned ? clamp01((metrics.overhang + metrics.titleHeight + 24 - state.insetTop) / Math.max(48, metrics.titleHeight * .6)) : 0;
      metrics.intro.style.setProperty('--iv2-hero-shade', shade);
      frame.querySelector('img').style.transform = 'scale(' + state.scale + ')';
      paintNav(frame, state);
    }
    function schedule(measureAgain = false) {
      if (!active) return;
      layoutPending = layoutPending || measureAgain;
      if (!pending) pending = win.requestAnimationFrame(paint);
    }
    function sync() {
      metrics?.article.style.removeProperty('--iv2-reading-overlap');
      metrics?.article.style.removeProperty('--iv2-hero-width');
      active = doc.querySelector('.journal-article:not([hidden]) .iv2-hero-stage');
      metrics = null;
      nav?.style.removeProperty('--iv2-nav-shift');
      if(nav)nav.inert=false;
      resetNav();
      makeNavPhoto();
      schedule(true);
    }
    win.addEventListener('scroll', () => schedule(), {passive:true});
    win.addEventListener('resize', () => schedule(true), {passive:true});
    win.addEventListener('sps-theme-change', () => schedule(true));
    win.addEventListener('pageshow', () => schedule(true));
    reduce.addEventListener('change', () => schedule(true));
    doc.fonts?.ready.then(() => schedule(true));
    const header = doc.querySelector('[data-sps-header]');
    if ('ResizeObserver' in win) {
      const resize = new win.ResizeObserver(() => schedule(true));
      if (header) resize.observe(header, {box:'border-box'});
      if (nav) resize.observe(nav, {box:'border-box'});
    }
    return sync;
  }
  function start(win) {
    const syncHero = articleHero(win);
    const doc = win.document;
    const list = archive.start(win);
    const moveBreadcrumb = archive.breadcrumbMotion(win,doc.querySelector('.iv2-page-nav'));
    doc.addEventListener('sps-journal-render', event => {
      moveBreadcrumb(() => {
        const isArticle = event.detail.view === 'article';
        doc.getElementById('iv2-breadcrumb-article').hidden = !isArticle;
        doc.getElementById('iv2-breadcrumb-leaf').hidden = !isArticle;
        doc.getElementById('iv2-breadcrumb-index').hidden = isArticle;
        const crumbLink = doc.getElementById('iv2-breadcrumb-back');
        crumbLink.href = urlFor(null,event.detail.category,win.location.search);
        const back = doc.getElementById('iv2-article-back');
        back.hidden = !isArticle;
        back.href = crumbLink.href;
        doc.querySelector('.iv2-page-nav').toggleAttribute('data-article-view', isArticle);
        syncHero();
      });
      win.requestAnimationFrame(() => { list.refresh(); });
    });
  }
  return { cards, urlFor, start, heroFrame, navPhotoBounds, articleHero };
});
