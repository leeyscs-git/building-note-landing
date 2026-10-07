'use strict';
const comparison = document.querySelector('.comparison');
let viewportWidth = 1280;
const views = {
  both: ['original','a','b','c','d','e','f','g','h','h2','h3','h4'], original: ['original'],
  hh4: ['h','h4'], h4: ['h4'],
  hh3: ['h','h3'], h2h3: ['h2','h3'], h123: ['h','h2','h3'], h3: ['h3'],
  hh2: ['h','h2'], h2: ['h2'],
  ab: ['a','b'], bc: ['b','c'], cd: ['c','d'],
  be: ['b','e'], ce: ['c','e'], de: ['d','e'], cf: ['c','f'], ef: ['e','f'],
  a: ['a'], b: ['b'], c: ['c'], d: ['d'], e: ['e'], f: ['f'], g: ['g'], h: ['h'], cg: ['c','g'], fg: ['f','g'], bh: ['b','h'], ch: ['c','h'], gh: ['g','h']
};
function resizePreviews() {
  document.querySelectorAll('.preview-window').forEach(container => {
    if (!container.clientWidth) return;
    const frame = container.querySelector('iframe');
    const scale = Math.min(1, container.clientWidth / viewportWidth);
    frame.style.width = `${viewportWidth}px`;
    const viewportHeight = viewportWidth === 390 ? 844 : 900;
    frame.style.height = `${viewportHeight}px`;
    container.style.height = `${Math.ceil(viewportHeight * scale) + 1}px`;
    frame.style.transform = `scale(${scale})`;
    frame.style.left = `${Math.max(0, (container.clientWidth - viewportWidth * scale) / 2)}px`;
  });
}
function setView(view) {
  comparison.dataset.view = view;
  document.body.dataset.comparison = view;
  document.querySelector('.pictogram-review').hidden = view !== 'hh4';
  const selected = views[view];
  comparison.style.setProperty('--panel-columns', selected.length);
  document.querySelectorAll('.version-panel').forEach(panel => { panel.hidden = !selected.includes(panel.dataset.version); });
  document.querySelectorAll('[data-view]').forEach(button => {
    if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
  // Open both desktop menus for a like-for-like pictogram comparison.
  for (const key of ['h','h4']) {
    const frame = document.querySelector('[data-version="'+key+'"] iframe');
    const url = new URL(frame.getAttribute('src'), location.href);
    const open = view === 'hh4' && viewportWidth !== 390;
    if (open !== url.searchParams.has('menu')) {
      if (open) url.searchParams.set('menu','services'); else url.searchParams.delete('menu');
      frame.src = url.pathname + url.search;
    }
  }
  resizePreviews();
}
document.querySelectorAll('button[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelectorAll('button[data-width]').forEach(button => button.addEventListener('click', () => {
  viewportWidth = Number(button.dataset.width);
  comparison.dataset.device = viewportWidth === 390 ? 'mobile' : 'desktop';
  document.querySelectorAll('button[data-width]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  setView(comparison.dataset.view);
}));
const observer = new ResizeObserver(resizePreviews);
document.querySelectorAll('.preview-window').forEach(container => observer.observe(container));
const requestedView = new URLSearchParams(location.search).get('view');
setView(Object.hasOwn(views, requestedView) ? requestedView : matchMedia('(max-width:600px)').matches ? 'f' : 'both');
resizePreviews();
