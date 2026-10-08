/* Samsung reference behavior, isolated from all other SPS pages.
   Source: /assets/js/app.js and /assets/js/tab.js on samsungcnt.com. */
(function (root) {
  'use strict';
  function nextHeaderState(previous, {y, height, blocked = false, reduced = false}) {
    const position = Math.max(0, y);
    const delta = position - previous.anchor;
    const direction = Math.abs(delta) > 10 ? Math.sign(delta) : previous.direction;
    return {
      anchor: Math.abs(delta) > 10 ? position : previous.anchor,
      direction,
      hidden: !blocked && !reduced && position > height * .7 && direction > 0
    };
  }
  function activeTabOffset({left, width, viewport, scroll, max}) {
    if (left >= scroll && left + width <= scroll + viewport) return scroll;
    return Math.max(0, Math.min(max, left - 100));
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {nextHeaderState, activeTabOffset};
  if (!root.document?.querySelector('.sc-page')) return;

  const doc = root.document;
  const header = doc.querySelector('[data-sps-header]');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const tabs = doc.querySelector('.sc-tabs ul');
  const table = doc.querySelector('.sc-table-scroll');
  const hint = doc.querySelector('.sc-table-hint');
  const related = doc.querySelector('.sc-related');
  const summary = related.querySelector('summary');
  let state = {anchor:Math.max(0,scrollY), direction:1, hidden:false};
  let frame = 0;
  function paint() {
    frame = 0;
    const blocked = doc.body.classList.contains('sps-menu-open')
      || Boolean(doc.querySelector('dialog[open]'))
      || Boolean(header.querySelector('sps-service-menu [aria-expanded="true"]'))
      || header.contains(doc.activeElement)
      || (matchMedia('(hover:hover)').matches && header.matches(':hover'));
    state = nextHeaderState(state,{y:scrollY,height:innerHeight,blocked,reduced:reduced.matches});
    header.classList.toggle('sc-header-hidden', state.hidden);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function showTab(link) {
    if (!link || tabs.scrollWidth <= tabs.clientWidth + 1) return;
    const box = link.getBoundingClientRect();
    const parent = tabs.getBoundingClientRect();
    const left = box.left - parent.left + tabs.scrollLeft;
    tabs.scrollTo({left:activeTabOffset({left,width:box.width,viewport:tabs.clientWidth,scroll:tabs.scrollLeft,max:tabs.scrollWidth-tabs.clientWidth}),behavior:'instant'});
  }
  function sizeChanged() {
    hint.hidden = table.scrollWidth <= table.clientWidth + 1;
    showTab(tabs.querySelector('[aria-current]'));
    schedule();
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',sizeChanged,{passive:true});
  addEventListener('pageshow',sizeChanged);
  reduced.addEventListener('change',schedule);
  header.addEventListener('pointerenter',schedule);
  header.addEventListener('pointerleave',schedule);
  header.addEventListener('focusin',schedule);
  header.addEventListener('focusout',schedule);
  new MutationObserver(schedule).observe(header,{subtree:true,attributes:true,attributeFilter:['aria-expanded']});
  new MutationObserver(schedule).observe(doc.body,{attributes:true,attributeFilter:['class']});
  doc.querySelectorAll('dialog').forEach(dialog => {
    new MutationObserver(schedule).observe(dialog,{attributes:true,attributeFilter:['open']});
    dialog.addEventListener('close',schedule);
  });
  new ResizeObserver(sizeChanged).observe(table);
  tabs.addEventListener('focusin',event => showTab(event.target.closest('a')));
  doc.fonts?.ready.then(sizeChanged);
  doc.addEventListener('click', event => {
    if (related.open && !related.contains(event.target)) related.open = false;
  });
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && related.open) {
      const restore = related.contains(doc.activeElement);
      related.open = false;
      if (restore) summary.focus();
      event.preventDefault();
    }
  });
  sizeChanged();
})(typeof window === 'undefined' ? globalThis : window);
