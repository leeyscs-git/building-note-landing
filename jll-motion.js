(() => {
  'use strict';
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 600px)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const hero = q('.hero');
  const frame = q('.hero-frame');
  const title = q('#hero-title');
  const description = q('.hero-description');
  const cta = q('#hero-cta');
  const tabs = qa('.story-tab');
  const media = document.createElement('div');
  media.className = 'hero-media';
  let photo = q('.hero-image');
  photo.before(media);
  media.append(photo);
  const playButton = document.createElement('button');
  playButton.className = 'hero-play icon-button';
  playButton.type = 'button';
  const playIcon = document.createElement('span');
  playIcon.className = 'hero-play-icon';
  playIcon.setAttribute('aria-hidden', 'true');
  playButton.append(playIcon);
  q('.hero-controls').append(playButton);
  tabs.forEach(tab => {
    const bar = document.createElement('span');
    bar.className = 'story-progress';
    bar.setAttribute('aria-hidden', 'true');
    tab.append(bar);
  });
  hero.setAttribute('aria-roledescription', '캐러셀');

  const imageCache = new Map();
  function loadImage(src) {
    if (!imageCache.has(src)) {
      const image = new Image();
      image.src = src;
      imageCache.set(src, image.decode().catch(() => null));
    }
    return imageCache.get(src);
  }
  slides.forEach(slide => loadImage(slide.image));

  let current = 0;
  let requested = 0;
  let requestId = 0;
  let transitioning = false;
  let userPaused = false;
  let heroVisible = false;
  let focusPaused = false;
  let progress;
  let zoom;
  let fade;
  let previousPhoto;
  let textAnimations = [];

  function clearTextMotion() {
    textAnimations.forEach(animation => animation.cancel());
    textAnimations = [];
  }
  function animateCopy(initial = false) {
    clearTextMotion();
    if (reduceMotion.matches) return;
    qa('.hero-title-line > span', title).forEach((line, index) => {
      textAnimations.push(line.animate([
        { transform: 'translateY(110%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], { duration: 850, delay: 80 + index * 90, easing: ease, fill: 'backwards' }));
    });
    [description, cta].forEach((element, index) => {
      textAnimations.push(element.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 700, delay: 260 + index * 100, easing: ease, fill: 'backwards' }));
    });
    if (initial) {
      [q('.hero .eyebrow'), q('.hero-bottom')].forEach((element, index) => {
        textAnimations.push(element.animate([
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 800, delay: index * 300, easing: ease, fill: 'backwards' }));
      });
    }
  }
  function renderCopy(index) {
    const slide = slides[index];
    title.innerHTML = slide.title.split('<br>').map(line => `<span class="hero-title-line"><span>${line}</span></span>`).join('');
    description.innerHTML = slide.description;
    cta.innerHTML = `${slide.cta} <span>→</span>`;
    cta.href = slide.target;
    cta.target = slide.target.startsWith('about.html') ? '_top' : '_self';
    q('#slide-count').innerHTML = `0${index + 1} <span>/ 0${slides.length}</span>`;
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-pressed', String(i === index));
    });
  }
  function blocked() {
    return reduceMotion.matches || userPaused || document.hidden || !heroVisible ||
      !!q('dialog[open]') || q('.menu-toggle').getAttribute('aria-expanded') === 'true' ||
      focusPaused;
  }
  function syncPlayback() {
    const paused = blocked();
    hero.dataset.playback = paused ? 'paused' : 'playing';
    if (progress && progress.playState !== 'finished') {
      if (paused || transitioning) progress.pause();
      else progress.play();
    }
    if (zoom && zoom.playState !== 'finished') {
      if (paused) zoom.pause();
      else zoom.play();
    }
    playButton.disabled = reduceMotion.matches;
    playButton.setAttribute('aria-label', reduceMotion.matches ? '모션 감소 설정으로 자동 재생 꺼짐' : paused ? '스토리 자동 재생' : '스토리 일시정지');
    const icon = paused ? '▶' : 'Ⅱ';
    if (playIcon.textContent !== icon) playIcon.textContent = icon;
    q('#slide-count').setAttribute('aria-live', paused ? 'polite' : 'off');
  }
  function resetProgress() {
    progress?.cancel();
    progress = null;
    if (!reduceMotion.matches) {
      progress = q('.story-progress', tabs[current]).animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 7200, easing: 'linear', fill: 'forwards' }
      );
      progress.onfinish = () => { if (!blocked()) changeSlide((current + 1) % slides.length); };
    }
    syncPlayback();
  }
  function startZoom() {
    zoom?.cancel();
    zoom = reduceMotion.matches ? null : photo.animate(
      [{ transform: 'scale(1.055)' }, { transform: 'scale(1)' }],
      { duration: 8500, easing: 'linear', fill: 'forwards' }
    );
  }
  async function changeSlide(index) {
    requested = (index + slides.length) % slides.length;
    const target = requested;
    const token = ++requestId;
    transitioning = true;
    syncPlayback();
    await loadImage(slides[target].image);
    if (token !== requestId) return;
    // Cancel superseded transitions, leaving exactly one current image layer.
    fade?.cancel();
    previousPhoto?.remove();
    previousPhoto = null;
    if (target === current) {
      transitioning = false;
      resetProgress();
      return;
    }
    const outgoing = photo;
    if (zoom) outgoing.style.transform = getComputedStyle(outgoing).transform;
    zoom?.cancel();
    photo = document.createElement('img');
    photo.className = 'hero-image';
    photo.src = slides[target].image;
    photo.alt = slides[target].alt;
    outgoing.alt = '';
    outgoing.setAttribute('aria-hidden', 'true');
    media.append(photo);
    current = target;
    renderCopy(current);
    animateCopy();
    startZoom();
    resetProgress();
    if (reduceMotion.matches) {
      outgoing.remove();
      transitioning = false;
      syncPlayback();
      return;
    }
    previousPhoto = outgoing;
    fade = photo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 950, easing: 'ease-in-out' });
    fade.onfinish = () => {
      outgoing.remove();
      previousPhoto = null;
      if (token === requestId) transitioning = false;
      syncPlayback();
    };
  }

  tabs.forEach((tab, index) => tab.addEventListener('click', () => changeSlide(index)));
  q('.hero-next').addEventListener('click', () => changeSlide(requested + 1));
  q('.hero-prev').addEventListener('click', () => changeSlide(requested - 1));
  // Preserve the intent shown before focus moves to the playback control.
  let resumeRequested = null;
  playButton.addEventListener('pointerdown', () => { resumeRequested = blocked(); });
  playButton.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') resumeRequested = blocked();
  });
  playButton.addEventListener('click', () => {
    userPaused = !(resumeRequested ?? blocked());
    resumeRequested = null;
    if (!userPaused) focusPaused = false;
    syncPlayback();
  });
  hero.addEventListener('focusin', event => {
    if (event.target !== playButton) focusPaused = true;
    syncPlayback();
  });
  hero.addEventListener('focusout', () => requestAnimationFrame(() => {
    if (!hero.contains(document.activeElement)) focusPaused = false;
    syncPlayback();
  }));
  document.addEventListener('visibilitychange', syncPlayback);
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: .15 }).observe(hero);
  const playbackObserver = new MutationObserver(syncPlayback);
  qa('dialog').forEach(dialog => playbackObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
  playbackObserver.observe(q('.menu-toggle'), { attributes: true, attributeFilter: ['aria-expanded'] });

  // Reveal each item once; short delays connect related content without blocking reading.
  const revealItems = new Set();
  function addReveal(elements, stagger = 0) {
    elements.forEach((element, index) => {
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * stagger}ms`);
      revealItems.add(element);
    });
  }
  ['.gateway > div:first-child', '.section-intro', '.editorial-copy', '.service-directory > div:first-child',
    '.section-heading > div:first-child', '.faq > div:first-child', '.contact-inner > div:first-child'].forEach(selector => {
    qa(selector).forEach(group => addReveal([...group.children], 85));
  });
  ['.gateway-links', '.directory-links', '.insight-grid', '.faq-list', '.contact-action'].forEach(selector => addReveal([...q(selector).children], 90));
  addReveal(qa('.editorial-image'));
  addReveal(qa('.insight-filters'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target.matches('.editorial-row') ? q('.editorial-image', entry.target) : entry.target;
      item.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach(element => {
    if (reduceMotion.matches || element.getBoundingClientRect().bottom < 0) element.classList.add('is-revealed');
    else revealObserver.observe(element.matches('.editorial-image') ? element.parentElement : element);
  });
  document.documentElement.classList.add('motion-ready');
  document.addEventListener('focusin', event => {
    const item = event.target.closest('[data-reveal]');
    if (item) { item.classList.add('is-revealed'); revealObserver.unobserve(item); }
  });

  const filterAnimations = new Map();
  qa('.filter').forEach(button => button.addEventListener('click', () => {
    filterAnimations.forEach(animation => animation.cancel());
    filterAnimations.clear();
    qa('.insight-card:not([hidden])').forEach((card, index) => {
      card.classList.add('is-revealed');
      revealObserver.unobserve(card);
      if (!reduceMotion.matches) filterAnimations.set(card, card.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 550, delay: index * 70, easing: ease, fill: 'backwards' }));
    });
  }));
  qa('.faq details').forEach(item => item.addEventListener('toggle', () => {
    if (item.open && !reduceMotion.matches) q('p', item).animate(
      [{ opacity: 0, transform: 'translateY(-7px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 350, easing: ease }
    );
  }));

  // Native scroll drives only decorative image offsets; no wheel interception or scroll tween.
  const activePhotos = new Set();
  let scrollFrame = 0;
  function drawScroll() {
    scrollFrame = 0;
    q('.nav-shell').classList.toggle('is-scrolled', scrollY > 20);
    const enabled = !reduceMotion.matches && !compact.matches;
    const positions = [...activePhotos].map(element => ({ element, rect: element.getBoundingClientRect() }));
    positions.forEach(({ element, rect }) => {
      const offset = enabled ? Math.max(-18, Math.min(18, (innerHeight / 2 - rect.top - rect.height / 2) * .045)) : 0;
      element.style.setProperty('--image-drift', `${offset.toFixed(2)}px`);
    });
    const heroOffset = enabled && heroVisible ? Math.max(0, Math.min(22, -hero.getBoundingClientRect().top * .035)) : 0;
    media.style.setProperty('--hero-drift', `${heroOffset.toFixed(2)}px`);
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(drawScroll); }
  const photoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) activePhotos.add(entry.target); else activePhotos.delete(entry.target); });
    scheduleScroll();
  }, { rootMargin: '60px' });
  qa('.editorial-image').forEach(image => photoObserver.observe(image));
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) {
      clearTextMotion();
      fade?.finish();
      zoom?.cancel();
      filterAnimations.forEach(animation => animation.cancel());
      revealItems.forEach(element => element.classList.add('is-revealed'));
      revealObserver.disconnect();
    } else startZoom();
    resetProgress();
    scheduleScroll();
  });
  renderCopy(0);
  animateCopy(true);
  startZoom();
  resetProgress();
  scheduleScroll();
})();
