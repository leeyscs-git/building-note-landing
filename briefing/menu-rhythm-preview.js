'use strict';
// Review-only overrides. Original pages, shared components and saved tokens are untouched.
const frame = document.getElementById('preview-frame');
const stage = document.getElementById('preview-stage');
const choices = [...document.querySelectorAll('[data-mode]')];
const modes = {
  before: { question: '1.50', hero: '1.34', description: '15px', gap: '하단 고정 · 가변', note: '현재 구성입니다. 설명은 15px이며, 216px 높이의 서비스 칸 아래에 픽토그램이 붙어 있습니다.', css: '' },
  balanced: { question: '1.28', hero: '1.18', description: '15px', gap: '24px', note: '설명은 15px로 유지하고, 제목의 줄 간격과 그림까지의 거리를 줄입니다. 가로 비례·색상·그림 크기는 유지합니다.', css: proposal(15, 24) },
  reading: { question: '1.39', hero: '1.26', description: '15px', gap: '28px', note: 'B 조정안: 설명 아래 간격을 4px 넓히고, 세 픽토그램의 실제 윤곽 크기·선 굵기·하단 기준선을 맞췄습니다. 설명은 15px를 유지합니다.', css: proposal(15, 28, 1.39, 1.26) + '.review-topic { display: inline-block; white-space: nowrap; }' }
};
const originalPictures = new WeakMap();
// Review-only redraws on one common keyline: x=25..133, y=24..108.
// The shared 4-unit inset gives every drawing the same visible bottom edge.
// Use the existing ink, surface and red tokens; no new colors or raster assets.
const alignedPictures = {
  management: `
    <path fill="var(--surface)" d="M25 104V39l35-15 29 15v65Z"/>
    <path d="M60 24v80M34 45l17-7m-17 22 17-7m-17 22 17-7m-17 22 17-7M69 45h11m-11 15h11m-11 15h7M39 104V95l12-5v14"/>
    <rect fill="var(--surface)" x="83" y="58" width="50" height="50" rx="2"/>
    <rect fill="var(--surface)" x="99" y="53" width="18" height="10" rx="1"/>
    <path stroke="var(--red)" d="m93 76 4 4 7-9"/>
    <path d="M112 75h11M93 90h30m-30 10h13m9 0h8"/>`,
  marketing: `
    <path fill="var(--surface)" d="M25 108V24h61v84Z"/>
    <path d="M25 40h61M36 32h12m7 0h20M35 108V53h41v55M55 53v55m-20-21h20M60 76v8"/>
    <path fill="var(--surface)" d="m81 88 6 20h10l-6-20Z"/>
    <path fill="var(--surface)" d="M77 77h14l26-14v35L91 87H77Z"/>
    <path d="M91 77v10M77 80h-5v5h5"/>
    <path stroke="var(--red)" d="M117 63v35m9-18h7m-9-12 6-6m-6 30 6 6"/>`,
  interior: `
    <path fill="var(--surface)" d="M25 108V24h69l39 27v57Z"/>
    <path d="M94 24v63M25 108l28-21h41l39 21M35 37h19v23H35Z"/>
    <path fill="var(--surface)" d="M48 83V64a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v19Z"/>
    <path fill="var(--surface)" d="M44 78h10v13h28V78h10v21H44Z"/>
    <path d="M68 61v30M50 99v7m36-7v7M54 84h28"/>
    <rect fill="var(--surface)" stroke="var(--red)" x="105" y="43" width="22" height="11" rx="1"/>
    <path stroke="var(--red)" d="M127 48h6v16h-17v12"/>
    <rect fill="var(--surface)" x="113" y="76" width="6" height="17" rx="1"/>`
};
function applyPictograms(doc, enabled) {
  doc.querySelectorAll('sps-service-pictogram[data-style="classic"]').forEach(pictogram => {
    const artwork = alignedPictures[pictogram.dataset.service];
    if (!artwork) return;
    if (!originalPictures.has(pictogram)) originalPictures.set(pictogram, pictogram.innerHTML);
    pictogram.innerHTML = enabled
      ? `<svg viewBox="0 0 160 128" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><g transform="translate(0 4)">${artwork}</g></svg>`
      : originalPictures.get(pictogram);
  });
}
let currentMode = 'reading';
function proposal(size, gap, questionLine = 1.28, heroLine = 1.18) {
  return `
    sps-service-menu[data-variant=v1] .sps-service-intro h2 { line-height: ${questionLine}; }
    .about-hero h1 { line-height: ${heroLine}; }
    sps-service-menu[data-variant=v1] .sps-service-description { font-size: ${size}px; line-height: 1.65; margin-top: 8px; }
    sps-service-menu[data-variant=v1] .sps-service-link { min-height: 0; }
    sps-service-menu[data-variant=v1] .sps-service-link-copy { padding-bottom: 0; }
    sps-service-menu[data-variant=v1] .sps-service-illustration { margin-top: ${gap}px; height: auto; aspect-ratio: 160 / 128; }
  `;
}
function applyMode() {
  const mode = modes[currentMode];
  choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === currentMode)));
  for (const key of ['question', 'hero', 'description', 'gap']) document.getElementById(`${key}-value`).textContent = mode[key];
  document.getElementById('mode-note').textContent = mode.note;
  const doc = frame.contentDocument;
  if (!doc?.querySelector('.about-hero')) return;
  let style = doc.getElementById('rhythm-review-only');
  if (!style) { style = doc.createElement('style'); style.id = 'rhythm-review-only'; doc.head.append(style); }
  style.textContent = `
    html { scroll-behavior: auto; overflow: hidden; }
    body { overflow: hidden; }
    .hero-content, .hero-photo img, .title-line-inner { transform: none !important; opacity: 1 !important; }
    .hero-backdrop { transform: none !important; opacity: 1 !important; }
  ` + mode.css;
  doc.querySelectorAll('.sps-service-description').forEach(description => {
    description.dataset.reviewText ||= description.textContent;
    const text = currentMode === 'reading'
      ? description.dataset.reviewText.replace(' · 공실 홍보', '').replace('임대조건 검토', '임대조건 분석')
      : description.dataset.reviewText;
    description.replaceChildren();
    if (currentMode !== 'reading') { description.textContent = text; return; }
    const topics = text.split(' · ');
    topics.forEach((topic, index) => {
      const span = doc.createElement('span');
      span.className = 'review-topic';
      span.textContent = topic + (index < topics.length - 1 ? ' ·' : '');
      description.append(span);
      if (index < topics.length - 1) description.append(' ');
    });
  });
  applyPictograms(doc, currentMode === 'reading');
  const menu = doc.querySelector('sps-service-menu:not([data-mobile])');
  if (menu?.setOpen) menu.setOpen(true);
}
choices.forEach(button => button.addEventListener('click', () => { currentMode = button.dataset.mode; applyMode(); }));
frame.addEventListener('load', applyMode);
new ResizeObserver(() => {
  const scale = Math.min(1, stage.clientWidth / 1280);
  frame.style.transform = `scale(${scale})`;
  stage.style.height = `${842 * scale}px`;
}).observe(stage);
