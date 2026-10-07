/* A phone's desktop request often exposes a 980px viewport. Keep the 1280px
   desktop composition and scale it as a whole, instead of selecting tablet CSS.
   ?layout=desktop is an explicit, testable override; ?layout=responsive opts out. */
(function (root, factory) {
  const viewport = factory();
  if (typeof module === 'object' && module.exports) module.exports = viewport;
  else viewport.start(root);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  const desktopWidth = 1280;
  function shouldUseDesktop({ mode, width, screenWidth, screenHeight, touchPoints, userAgent, visualScale }) {
    if (mode === 'responsive') return false;
    if (mode === 'desktop') return true;
    if (!(touchPoints > 0) || width < 900) return false;
    const smallScreen = Math.min(screenWidth || Infinity, screenHeight || Infinity) <= 600;
    const desktopAgent = !/Mobile|iPhone|iPod/i.test(userAgent || '');
    const scaledPage = visualScale > 0 && visualScale < .85;
    return (smallScreen && (width > screenWidth * 1.2 || desktopAgent)) || scaledPage;
  }
  function start(win) {
    const doc = win.document;
    const mode = new URLSearchParams(win.location.search).get('layout');
    const active = shouldUseDesktop({
      mode, width: win.innerWidth, screenWidth: win.screen.width,
      screenHeight: win.screen.height, touchPoints: win.navigator.maxTouchPoints,
      userAgent: win.navigator.userAgent, visualScale: win.visualViewport?.scale
    });
    if (!active || !win.CSS.supports('zoom', '1')) return;
    const html = doc.documentElement;
    html.dataset.spsDesktop = '';
    let frame = 0;
    function update() {
      frame = 0;
      const scale = Math.min(1, doc.documentElement.clientWidth / desktopWidth);
      html.style.setProperty('--sps-desktop-scale', scale);
      html.style.setProperty('--sps-vw', `${desktopWidth / 100}px`);
      html.style.setProperty('--sps-vh', `${win.innerHeight / scale / 100}px`);
      html.style.setProperty('--sps-visible-top', `${(win.visualViewport?.offsetTop || 0) / scale}px`);
    }
    const schedule = () => { if (!frame) frame = win.requestAnimationFrame(update); };
    update();
    doc.addEventListener('DOMContentLoaded', () => {
      // Cross-document snapshots use physical pixels and can mismatch a scaled
      // layout. Keep native navigation for this mode, without a broken snapshot.
      const style = doc.createElement('style');
      style.textContent = '@view-transition { navigation: none; }';
      doc.head.append(style);
      schedule();
    }, { once:true });
    win.addEventListener('pageshow', schedule);
    win.addEventListener('resize', schedule, { passive:true });
    win.visualViewport?.addEventListener('resize', schedule, { passive:true });
    win.visualViewport?.addEventListener('scroll', schedule, { passive:true });
    // Keep an explicit choice while navigating among H pages, without a stored
    // preference that could accidentally override a later browser mode change.
    if (mode === 'desktop') doc.addEventListener('click', event => {
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, win.location.href);
      if (url.origin === win.location.origin && /\/jll-remix(?:-v[234])?(?:-about|-journal|-support|-cases)?(?:\.html)?$/.test(url.pathname)) {
        url.searchParams.set('layout', 'desktop');
        anchor.href = url.href;
      }
    }, true);
  }
  return { shouldUseDesktop, desktopWidth, start };
});
