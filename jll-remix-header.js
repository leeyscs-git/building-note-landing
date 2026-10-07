/* H main and introduction share this header, its navigation and menu behavior. */
(() => {
  'use strict';
  const header = document.querySelector('[data-sps-header]');
  if (!header) return;
  const isAbout = header.dataset.page === 'about';
  const isJournal = header.dataset.page === 'journal';
  const isSupport = header.dataset.page === 'support';
  const isSubpage = isAbout || isJournal || isSupport;
  const variant = document.documentElement.dataset.serviceMenu;
  const prefix = ['v2', 'v3', 'v4'].includes(variant) ? `jll-remix-${variant}` : 'jll-remix';
  const home = `${prefix}.html`;
  const about = `${prefix}-about.html`;
  const sectionHref = id => `${isSubpage ? home : ''}#${id}`;
  const links = [
    { label: 'SPS 소개', href: about, current: isAbout },
    { label: '서비스', href: sectionHref('services'), section: 'services' },
    { label: '공간과 가치', href: sectionHref('spaces'), section: 'spaces' },
    { label: '인사이트', href: prefix === 'jll-remix' ? 'jll-remix-journal.html' : sectionHref('insights'), current: isJournal, section: prefix === 'jll-remix' ? null : 'insights' },
    { label: '고객지원', href: 'jll-remix-support.html', current: isSupport },
  ];
  function renderLink(link, index, expanded = false) {
    if (link.section === 'services') return `<sps-service-menu${expanded ? ' data-mobile' : ''}></sps-service-menu>`;
    const current = link.current ? ' class="current" aria-current="page"' : '';
    const section = link.section ? ` data-header-section="${link.section}"` : '';
    const extra = expanded ? `<span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>` : '';
    return `<a href="${link.href}" target="_top"${current}${section}>${link.label}${extra}</a>`;
  }
  function renderLocale(mobile = false) {
    // Only offer locales backed by an actual SPS page.
    return `<div class="header-locale${mobile ? ' header-locale-mobile' : ''}" role="group" aria-label="국가 및 언어">
      <svg class="locale-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>
      <label class="locale-field sps-select sps-select--compact"><select aria-label="국가 선택"><option value="kr" selected>대한민국</option></select><sps-chevron></sps-chevron></label>
      <span class="locale-divider" aria-hidden="true"></span>
      <label class="locale-field locale-language sps-select sps-select--compact"><select aria-label="언어 선택"><option value="ko" label="KO" selected>한국어</option></select><sps-chevron></sps-chevron></label>
    </div>`;
  }
  header.innerHTML = `
    <div class="header-main wrap">
      <a class="brand" href="${isSubpage ? home : '#main'}" target="_top" aria-label="SPS 홈">
        <img class="brand-logo" src="assets/logo.svg" alt="SPS" width="120" height="40">
      </a>
      <div class="nav-tools">
        <a class="header-contact" href="jll-remix-support.html#inquiry" data-inquiry aria-haspopup="dialog">문의하기 <sps-arrow-up-right></sps-arrow-up-right></a>
        <button class="icon-button menu-toggle" type="button" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="sps-header-menu"><span></span><span></span></button>
      </div>
    </div>
    <nav class="nav wrap" aria-label="주 메뉴">
      <div class="nav-links" id="nav-links">${links.map((link, i) => renderLink(link, i)).join('')}</div>
      ${renderLocale()}
    </nav>
    <nav class="sps-header-menu" id="sps-header-menu" aria-label="전체 메뉴" hidden>
      ${links.map((link, i) => renderLink(link, i, true)).join('')}
      <a href="jll-remix-support.html#inquiry" data-inquiry aria-haspopup="dialog">문의하기 <span aria-hidden="true">↗</span></a>
      ${renderLocale(true)}
    </nav>`;

  const button = header.querySelector('.menu-toggle');
  const menu = header.querySelector('.sps-header-menu');
  const background = [...document.querySelectorAll('main, body > footer')];
  let previousInert = [];
  function setMenu(open, returnFocus = false) {
    if (open === !menu.hidden) return;
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? '전체 메뉴 닫기' : '전체 메뉴 열기');
    document.body.classList.toggle('sps-menu-open', open);
    if (open) {
      previousInert = background.map(element => element.inert);
      background.forEach(element => { element.inert = true; });
      menu.querySelector('a').focus();
    } else {
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      if (returnFocus || menu.contains(document.activeElement)) button.focus();
    }
  }
  button.addEventListener('click', () => setMenu(menu.hidden));
  header.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !header.contains(event.target)) setMenu(false, true);
  });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const focusable = [...header.querySelectorAll('a,button,select')].filter(element => element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const mobileLayout = matchMedia('(max-width: 600px)');
  mobileLayout.addEventListener('change', event => {
    header.querySelectorAll('sps-service-menu').forEach(item => item.close());
    if (event.matches || menu.hidden) return;
    setMenu(false);
    header.querySelector('.brand').focus();
  });
  const updateHeight = () => document.documentElement.style.setProperty('--sps-header-height', `${header.offsetHeight}px`);
  new ResizeObserver(updateHeight).observe(header);
  updateHeight();
  const updateScroll = () => header.classList.toggle('is-scrolled', scrollY > 20);
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  if (!isSubpage) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        header.querySelectorAll('[data-header-section]').forEach(link => {
          const active = link.dataset.headerSection === entry.target.id;
          link.classList.toggle('current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    links.filter(link => link.section).forEach(link => {
      const section = document.getElementById(link.section);
      if (section) observer.observe(section);
    });
  }
  window.SPSHeader = { home, about, close: () => {
    header.querySelectorAll('sps-service-menu').forEach(item => item.close(true));
    setMenu(false);
  } };

  // Decode the destination hero while the current page is still visible.
  // Keep ordinary links/history; modified clicks and other variants stay native.
  const destinationImages = new Map([
    [new URL(home, location.href).pathname, 'assets/jll/seoul.webp'],
    [new URL(about, location.href).pathname, 'assets/hyosung/city.jpg'],
  ]);
  const preparedImages = new Map();
  function destination(link) {
    if (!link || link.hasAttribute('download') || !['_self', '_top', ''].includes(link.target)) return null;
    const url = new URL(link.href, location.href);
    return url.origin === location.origin && url.pathname !== location.pathname && destinationImages.has(url.pathname) ? url : null;
  }
  function prepare(url) {
    if (!preparedImages.has(url.pathname)) {
      const image = new Image();
      image.src = destinationImages.get(url.pathname);
      const prepared = { image, decoded: false };
      prepared.ready = image.decode().then(() => { prepared.decoded = true; }).catch(() => {});
      preparedImages.set(url.pathname, prepared);
    }
    return preparedImages.get(url.pathname);
  }
  for (const eventName of ['pointerover', 'focusin']) {
    document.addEventListener(eventName, event => {
      const url = destination(event.target.closest?.('a[href]'));
      if (url) prepare(url);
    });
  }
  let navigating = false;
  document.addEventListener('click', async event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    const url = destination(link);
    if (!url) return;
    const { decoded, ready } = prepare(url);
    if (decoded) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    let timeout;
    await Promise.race([ready, new Promise(resolve => { timeout = setTimeout(resolve, 800); })]);
    clearTimeout(timeout);
    // A missing image must not prevent navigation indefinitely.
    (link.target === '_top' ? window.top : window).location.assign(url.href);
  });
  window.addEventListener('pageshow', () => { navigating = false; });
})();
