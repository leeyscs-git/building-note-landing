'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
function closeMenu() { window.SPSCNavigation.closeMenu(); }
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    if (entry.target.classList.contains('business')) entry.target.classList.add('is-drawn');
    reveal.unobserve(entry.target);
  }), { threshold: .08 });
  $$('.reveal,.business').forEach(el => reveal.observe(el));
  document.documentElement.classList.add('motion-ready');

  const video = $('.network-video video');
  let videoVisible = false;
  function syncVideo() {
    if (!video) return;
    if (videoVisible && !document.hidden && !reduced.matches && !$('dialog[open]')) video.play().catch(() => {});
    else video.pause();
  }
  if (video) new IntersectionObserver(([entry]) => { videoVisible = entry.isIntersecting; syncVideo(); }, { rootMargin: '200px' }).observe($('.network-journey'));
  document.addEventListener('visibilitychange', syncVideo);
  document.addEventListener('toggle', syncVideo, true);
  reduced.addEventListener('change', () => {
    if (reduced.matches) $$('.reveal').forEach(el => el.classList.add('is-visible'));
    syncVideo();
    draw();
  });

  const process = $('#process');
  const track = $('.process-track');
  const cards = $$('.process-card');
  const network = $('.network-journey');
  let frame = 0;
  let processTop = 0, processDistance = 1, trackDistance = 0;
  const from = () => innerWidth <= 767 ? .2 / .9 : .4 / 1.1;
  const until = () => innerWidth <= 767 ? .7 / .9 : .9 / 1.1;
  function measure() {
    if (process) {
      processTop = process.getBoundingClientRect().top + scrollY;
      processDistance = Math.max(1, process.offsetHeight - $('.process-stage').offsetHeight);
      trackDistance = Math.max(0, track.scrollWidth - $('.process-viewport').clientWidth);
    }
    draw();
  }
  function draw() {
    frame = 0;
    if (process) {
      const progress = clamp((scrollY - processTop) / processDistance);
      const travel = clamp((progress - from()) / (until() - from()));
      process.style.setProperty('--process-x', `${reduced.matches ? 0 : -trackDistance * travel}px`);
      process.style.setProperty('--process-intro-opacity', String(reduced.matches ? 1 : 1 - clamp(progress / from())));
      process.style.setProperty('--process-progress', String(travel));
      network.style.setProperty('--network-opacity', String(1 - .55 * clamp(progress / from())));
      $('[data-process="prev"]').disabled = travel < .005;
      $('[data-process="next"]').disabled = travel > .995;
    }
    if (network && !reduced.matches) {
      const progress = clamp(-network.getBoundingClientRect().top / Math.max(1, network.offsetHeight - innerHeight));
      network.style.setProperty('--network-bg-y', `${progress * 100}px`);
      network.style.setProperty('--network-scale', String((innerWidth <= 767 ? 1 : .9) - progress * .1));
      network.style.setProperty('--network-blur', `${progress * 5}px`);
    }
  }
  function go(index) {
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (reduced.matches) { card.scrollIntoView({ block:'nearest', inline:'start', behavior:'instant' }); return; }
    const ratio = clamp(card.offsetLeft / Math.max(1, trackDistance));
    scrollTo({ top: processTop + (from() + ratio * (until() - from())) * processDistance, behavior:'smooth' });
  }
  function step(direction) {
    const travel = clamp((clamp((scrollY - processTop) / processDistance) - from()) / (until() - from()));
    const stepWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
    const index = Math.round(travel * trackDistance / stepWidth);
    go(index + direction);
  }
  if (process) {
    $$('[data-process]').forEach(button => button.addEventListener('click', () => step(button.dataset.process === 'next' ? 1 : -1)));
    track.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || reduced.matches || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') go(0);
      else if (event.key === 'End') go(cards.length - 1);
      else step(event.key === 'ArrowRight' ? 1 : -1);
    });
    cards.forEach((card, index) => card.addEventListener('focus', () => {
      const bounds = card.getBoundingClientRect(), viewport = $('.process-viewport').getBoundingClientRect();
      if (bounds.left < viewport.left - 2 || bounds.right > viewport.right + 2) go(index);
    }));
    new ResizeObserver(measure).observe($('.process-stage'));
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(draw); }, { passive: true });
  addEventListener('resize', measure, { passive: true });
  document.fonts.ready.then(measure);
  measure();
})();
