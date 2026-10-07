// F keeps the existing C motion in an independent snapshot.
'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = $('.motion-hero');
const slides = [
{lines:['Beyond','Buildings'],kicker:'건물 운영을 맡기고, 더 넓은 가능성으로.',caption:'당신의 자산에, 더 나은 내일을.',href:'f-services.html',label:'SPS 서비스 살펴보기'},
{lines:['Spaces for','People'],kicker:'머무는 사람과 공간을 함께 살피는 관리.',caption:'임차·공실 관리의 범위와 조건을 살펴보세요.',href:'f-service.html?service=leasing',label:'임차·공실 관리 살펴보기'},
{lines:['Smarter','Together'],kicker:'맡긴 일의 현재와 남은 확인을 연결합니다.',caption:'계약·입금 확인부터 미납 대응 범위까지.',href:'f-service.html?service=arrears',label:'미납 대응 살펴보기'}
];
let slideIndex = 0;
let elapsed = 0;
let userPaused = reducedMotion.matches;
let heroVisible = true;
let focused = false;
let resumedByUser = false;
let playbackFrame = 0;
let previousFrame = 0;
let sliding = false;
let slideAnimations = [];
let finishTransition = null;
// Hyosung: five seconds of progress, then a one-second horizontal transition.
const duration = 5000;

function changeSlide(index) {
  const next = (index + slides.length) % slides.length;
  if (next === slideIndex || sliding) return;
  const direction = index < slideIndex ? -1 : 1;
  const oldScene = $(`[data-scene="${slideIndex}"]`);
  const scene = $(`[data-scene="${next}"]`);
  sliding = true;
  $('.hero-title-block').classList.add('is-changing');
  $('#hero-caption').classList.add('is-changing');
  oldScene.classList.remove('active');
  oldScene.classList.add('exiting');
  slideIndex = next;
  elapsed = 0;
  hero.style.setProperty('--slide-progress', '0');
  const complete = () => {
    if (!sliding) return;
    sliding = false;
    scene.classList.add('active');
    oldScene.classList.remove('exiting');
    slideAnimations.forEach(animation => animation.cancel());
    slideAnimations = [];
    finishTransition = null;
    const slide = slides[next];
    $('#hero-title').innerHTML = slide.lines.map((line, i) => `<span class="line-mask"><span>${line}${i === 1 ? '<span class="title-dot">.</span>' : ''}</span></span>`).join('');
    $('#hero-kicker').textContent = slide.kicker;
    $('#hero-caption').textContent = slide.caption;
    $('#hero-discover').href = slide.href;
    $('#hero-discover').target = '_self';
    $('#hero-discover').setAttribute('aria-label', slide.label);
    $('.hero-current').innerHTML = `0${next + 1} <span>/ 03</span>`;
    $$('[data-slide]').forEach((button, i) => {
      button.classList.toggle('active', i === next);
      button.setAttribute('aria-pressed', String(i === next));
    });
    $('.hero-title-block').classList.remove('is-changing');
    $('#hero-caption').classList.remove('is-changing');
    elapsed = 0;
    syncPlayback();
  };
  finishTransition = complete;
  if (reducedMotion.matches) { complete(); return; }
  const options = { duration: 1000, easing: 'cubic-bezier(.25,.1,.25,1)', fill: 'both' };
  slideAnimations = [
    oldScene.animate([{ transform:'translateX(0)' }, { transform:`translateX(${-direction * 100}%)` }], options),
    scene.animate([{ transform:`translateX(${direction * 100}%)` }, { transform:'translateX(0)' }], options),
    $('.scene-parallax', oldScene).animate([{ transform:'translateX(0)' }, { transform:`translateX(${direction * 30}%)` }], options),
    $('.scene-parallax', scene).animate([{ transform:`translateX(${-direction * 30}%)` }, { transform:'translateX(0)' }], options),
  ];
  slideAnimations[1].finished.then(complete).catch(() => {});
  syncPlayback();
}

function canPlay() {
  return !userPaused && !reducedMotion.matches && !sliding && heroVisible && !document.hidden && (resumedByUser || !focused) && !$('dialog[open]');
}
function playbackTick(now) {
  playbackFrame = 0;
  if (!canPlay()) { hero.classList.add('is-paused'); return; }
  elapsed += Math.min(80, now - previousFrame);
  previousFrame = now;
  if (elapsed >= duration) changeSlide(slideIndex + 1);
  hero.style.setProperty('--slide-progress', String(elapsed / duration));
  if (canPlay()) playbackFrame = requestAnimationFrame(playbackTick);
}
function syncPlayback() {
  const running = canPlay();
  hero.classList.toggle('is-paused', !running);
  if (running && !playbackFrame) {
    previousFrame = performance.now();
    playbackFrame = requestAnimationFrame(playbackTick);
  } else if (!running && playbackFrame) {
    cancelAnimationFrame(playbackFrame);
    playbackFrame = 0;
  }
}
function updatePauseButton() {
  const button = $('.hero-pause');
  button.textContent = userPaused ? '▷' : 'Ⅱ';
  button.setAttribute('aria-pressed', String(userPaused));
  button.setAttribute('aria-label', reducedMotion.matches ? '모션 감소 설정 사용 중' : userPaused ? '자동 전환 재생' : '자동 전환 일시정지');
  button.disabled = reducedMotion.matches;
  syncPlayback();
}
$('.hero-next').addEventListener('click', () => changeSlide(slideIndex + 1));
$('.hero-prev').addEventListener('click', () => changeSlide(slideIndex - 1));
$$('[data-slide]').forEach(button => button.addEventListener('click', () => changeSlide(Number(button.dataset.slide))));
$('.hero-pause').addEventListener('click', () => { userPaused = !userPaused; resumedByUser = !userPaused; updatePauseButton(); });
hero.addEventListener('focusin', event => { focused = true; if (event.target !== $('.hero-pause')) resumedByUser = false; syncPlayback(); });
hero.addEventListener('focusout', event => { focused = hero.contains(event.relatedTarget); syncPlayback(); });
document.addEventListener('visibilitychange', syncPlayback);
const heroObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; syncPlayback(); }, { threshold: 0 });
heroObserver.observe(hero);
$$('dialog').forEach(dialog => {
  dialog.addEventListener('toggle', syncPlayback);
  dialog.addEventListener('close', syncPlayback);
});
updatePauseButton();

function closeMenu() { const menu = document.getElementById("f-menu"); if (menu?.open) menu.close(); }

// Reveal only after observers exist: content stays available when JS is disabled.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
$$('.reveal').forEach(element => revealObserver.observe(element));
document.documentElement.classList.add('motion-ready');

const countersInFlight = new Set();
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    countObserver.unobserve(entry.target);
    const node = entry.target;
    const goal = Number(node.dataset.count);
    if (reducedMotion.matches) { node.textContent = String(goal); return; }
    const started = performance.now();
    countersInFlight.add(node);
    const tick = now => {
      const progress = reducedMotion.matches ? 1 : Math.min(1, (now - started) / 1000);
      node.textContent = String(Math.round(goal * (.1 + .9 * progress)));
      if (progress < 1) requestAnimationFrame(tick);
      else countersInFlight.delete(node);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
$$('[data-count]').forEach(node => countObserver.observe(node));

// Page input remains native. Only background and timeline transforms interpolate.
const clamp = value => Math.max(0, Math.min(1, value));
const statement = $('[data-scrub-text]');
const business = $('.business');
const network = $('.network-journey');
const networkIntro = $('.network-intro');
const video = $('.network-video video');
const process = $('#process');
const processStage = $('.process-stage');
const track = $('.process-track');
const viewport = $('.process-viewport');
const contact = $('.contact');
const processCards = $$('.process-card');
let scrollFrame = 0;
let previousMotionTime = 0;
let visualY = scrollY;
let networkVisible = false;
let videoRequested = false;
let geometry = {};

function measure() {
  geometry = {
    networkTop: network.getBoundingClientRect().top + scrollY,
    networkHeight: network.offsetHeight,
    introHeight: networkIntro.offsetHeight,
    processTop: process.getBoundingClientRect().top + scrollY,
    processDistance: Math.max(1, process.offsetHeight - processStage.offsetHeight),
    trackDistance: Math.max(0, track.scrollWidth - viewport.clientWidth),
  };
  queueScroll();
}
function syncVideo() {
  const shouldPlay = networkVisible && !document.hidden && !reducedMotion.matches && !$('dialog[open]');
  if (shouldPlay && !videoRequested) {
    videoRequested = true;
    video.play().catch(() => { videoRequested = false; });
  } else if (!shouldPlay) {
    videoRequested = false;
    video.pause();
  }
}
new IntersectionObserver(([entry]) => {
  networkVisible = entry.isIntersecting;
  syncVideo();
}, { rootMargin: '0px 0px 30% 0px' }).observe(network);
document.addEventListener('visibilitychange', () => {
  syncVideo();
  if (!document.hidden) { visualY = scrollY; previousMotionTime = 0; queueScroll(); }
  else { cancelAnimationFrame(scrollFrame); scrollFrame = 0; }
});
$$('dialog').forEach(dialog => {
  dialog.addEventListener('toggle', syncVideo);
  dialog.addEventListener('close', syncVideo);
});

function paintScroll(now) {
  scrollFrame = 0;
  const y = scrollY, height = innerHeight, reduced = reducedMotion.matches;
  const dt = previousMotionTime ? Math.min(64, now - previousMotionTime) : 16;
  previousMotionTime = now;
  // Settle quickly on reversal without accumulating scroll distance.
  visualY = reduced ? y : visualY + (y - visualY) * (1 - Math.exp(-dt / 110));
  if (Math.abs(y - visualY) < .15) visualY = y;
  const textProgress = reduced ? 1 : clamp((height * .87 - statement.getBoundingClientRect().top) / (height * .55));
  statement.style.setProperty('--text-fill', `${textProgress * 100}%`);
  if (business.getBoundingClientRect().top < height * .5 || reduced) business.classList.add('is-drawn');

  // Reference sequence: sticky globe, background shift 100px, blur 10px,
  // scale .9 -> .75 (mobile: 1 -> .95) before the horizontal milestones.
  const earthProgress = clamp((visualY - geometry.networkTop) / Math.max(1, geometry.networkHeight * .5 - height));
  const mobile = innerWidth <= 767;
  const earthScale = mobile ? 1 - .05 * earthProgress : .9 - .15 * earthProgress;
  network.style.setProperty('--network-bg-y', `${earthProgress * 100}px`);
  network.style.setProperty('--network-scale', String(earthScale));
  network.style.setProperty('--network-blur', `${earthProgress * 10}px`);

  const rawProgress = clamp((visualY - geometry.processTop) / geometry.processDistance);
  // Original timeline: .2 + .2 introduction, .5 horizontal travel, .2 release.
  const from = mobile ? .2 / .9 : .4 / 1.1;
  const until = mobile ? .7 / .9 : .9 / 1.1;
  const travel = clamp((rawProgress - from) / (until - from));
  if (!reduced) {
    process.style.setProperty('--process-x', `${-geometry.trackDistance * travel}px`);
    process.style.setProperty('--process-intro-opacity', String(1 - clamp(rawProgress / from)));
    process.style.setProperty('--process-progress', String(travel));
  } else {
    process.style.removeProperty('--process-x');
    process.style.removeProperty('--process-intro-opacity');
  }
  network.style.setProperty('--network-opacity', String(1 - .55 * clamp(rawProgress / from)));
  $('[data-process="prev"]').disabled = travel < .005;
  $('[data-process="next"]').disabled = travel > .995;
  const contactTop = contact.getBoundingClientRect().top;
  if (contactTop < height) contact.style.setProperty('--orb-shift', `${reduced ? 0 : clamp((height - contactTop) / height) * 75}px`);
  if (visualY !== y && !document.hidden) scrollFrame = requestAnimationFrame(paintScroll);
}
function queueScroll() {
  if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(paintScroll);
}
addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', measure, { passive: true });
new ResizeObserver(measure).observe(processStage);
new ResizeObserver(measure).observe(networkIntro);
document.fonts.ready.then(measure);
measure();

function goToProcessCard(index) {
  const card = processCards[Math.max(0, Math.min(processCards.length - 1, index))];
  if (reducedMotion.matches) { card.scrollIntoView({ block:'nearest', inline:'start', behavior:'instant' }); return; }
  const from = innerWidth <= 767 ? .2 / .9 : .4 / 1.1;
  const until = innerWidth <= 767 ? .7 / .9 : .9 / 1.1;
  const distance = Math.min(geometry.trackDistance, card.offsetLeft);
  const ratio = geometry.trackDistance ? distance / geometry.trackDistance : 0;
  const target = geometry.processTop + (from + ratio * (until - from)) * geometry.processDistance;
  window.scrollTo({ top: target, behavior:'smooth' });
}
function stepProcess(direction) {
  const currentX = -parseFloat(process.style.getPropertyValue('--process-x') || '0');
  const step = processCards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
  const from = innerWidth <= 767 ? .2 / .9 : .4 / 1.1;
  const until = innerWidth <= 767 ? .7 / .9 : .9 / 1.1;
  const ratio = clamp((currentX + direction * step) / Math.max(1, geometry.trackDistance));
  window.scrollTo({ top: geometry.processTop + (from + ratio * (until - from)) * geometry.processDistance, behavior:'smooth' });
}
$$('[data-process]').forEach(button => button.addEventListener('click', () => stepProcess(button.dataset.process === 'next' ? 1 : -1)));
track.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key) || reducedMotion.matches) return;
  event.preventDefault();
  if (event.key === 'Home') goToProcessCard(0);
  else if (event.key === 'End') goToProcessCard(processCards.length - 1);
  else stepProcess(event.key === 'ArrowRight' ? 1 : -1);
});
processCards.forEach((card,index) => card.addEventListener('focus', () => {
  const bounds = card.getBoundingClientRect(), frame = viewport.getBoundingClientRect();
  if (bounds.left < frame.left - 2 || bounds.right > frame.right + 2) goToProcessCard(index);
}));
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    userPaused = true;
    if (finishTransition) finishTransition();
    $$('.reveal').forEach(node => node.classList.add('is-visible'));
    countersInFlight.forEach(node => { node.textContent = node.dataset.count; });
  }
  visualY = scrollY;
  updatePauseButton();
  syncVideo();
  measure();
});
