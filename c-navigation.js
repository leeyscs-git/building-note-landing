(() => {
  'use strict';
  if (!document.documentElement.hasAttribute('data-c-site')) return;
  const routes = [
    ['about', 'SPS 소개', 'about.html?from=c', '회사 소개 비전 관점'],
    ['services', '서비스', 'c-services.html', '자산관리 임대 시설 스마트 운영'],
    ['spaces', '공간과 가치', 'c-spaces.html', '공간 경험 오피스 사람'],
    ['process', '함께하는 과정', 'c-process.html', '진단 설계 연결 개선'],
    ['insights', '인사이트', 'c-insights.html', '리포트 가이드 자동화 이야기'],
    ['contact', '문의하기', 'c-contact.html', '상담 건물 진단'],
  ];
  const current = document.body.dataset.cPage || (location.pathname.endsWith('/about.html') ? 'about' : 'home');
  const link = ([key, label, href], number = false) => `<a href="${href}" target="_top"${key === current ? ' aria-current="page"' : ''}>${number ? `<small>0${routes.findIndex(item => item[0] === key) + 1}</small>` : ''}${label}${number ? '<span aria-hidden="true">↗</span>' : ''}</a>`;
  const header = document.createElement('header');
  header.className = 'c-header';
  header.innerHTML = `<a class="c-brand" href="hyosung.html" target="_top" aria-label="SPS 홈"><img src="assets/logo.svg" alt="SPS" width="120" height="40"></a><nav class="c-primary" aria-label="주 메뉴">${routes.slice(0, 5).map(item => link(item)).join('')}</nav><div class="c-tools"><button class="c-icon c-search-toggle" type="button" aria-label="사이트 검색"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg></button><a class="c-contact" href="c-contact.html" target="_top"${current === 'contact' ? ' aria-current="page"' : ''}>문의하기 <span aria-hidden="true">↗</span></a><button class="c-icon c-menu-toggle" type="button" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="c-menu"><span></span><span></span></button></div>`;
  const placeholder = document.querySelector('[data-c-navigation]');
  if (placeholder) placeholder.replaceWith(header);
  else document.querySelector('.about-header').before(header);

  const menu = document.createElement('dialog');
  menu.id = 'c-menu';
  menu.className = 'c-nav-dialog c-menu';
  menu.setAttribute('aria-label', '전체 메뉴');
  menu.innerHTML = `<button class="c-dialog-close" type="button" aria-label="메뉴 닫기">×</button><div class="c-menu-inner"><a class="c-brand" href="hyosung.html" target="_top" aria-label="SPS 홈"><img src="assets/logo.svg" alt="SPS" width="120" height="40"></a><p class="c-eyebrow">Explore the possibilities.</p><nav aria-label="전체 메뉴 탐색">${routes.map(item => link(item, true)).join('')}</nav><p class="c-menu-note">Spaces. People. Solutions.</p></div>`;
  const search = document.createElement('dialog');
  search.className = 'c-nav-dialog c-search';
  search.setAttribute('aria-labelledby', 'c-search-title');
  search.innerHTML = '<button class="c-dialog-close" type="button" aria-label="검색 닫기">×</button><p class="c-eyebrow">Find your possibilities</p><h2 id="c-search-title">무엇을 찾고 계신가요?</h2><label class="c-search-field"><span class="sr-only">검색어</span><input type="search" placeholder="서비스, 자산관리, 공간 이야기 검색" autocomplete="off"></label><nav aria-label="검색 결과" aria-live="polite"></nav>';
  document.body.append(menu, search);
  const menuToggle = header.querySelector('.c-menu-toggle');
  function closeMenu() { if (menu.open) menu.close(); }
  function open(dialog) {
    closeMenu();
    dialog.showModal();
    document.body.classList.add('c-nav-open');
  }
  [menu, search].forEach(dialog => {
    dialog.querySelector('.c-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (!menu.open && !search.open) document.body.classList.remove('c-nav-open');
      menuToggle.setAttribute('aria-expanded', String(menu.open));
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
  });
  menuToggle.addEventListener('click', () => { open(menu); menuToggle.setAttribute('aria-expanded', 'true'); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  const input = search.querySelector('input');
  function renderSearch() {
    const query = input.value.trim().toLocaleLowerCase();
    const matches = routes.filter(([, label, , tags]) => `${label} ${tags}`.toLocaleLowerCase().includes(query));
    search.querySelector('nav').innerHTML = matches.length ? matches.map(item => link(item, true)).join('') : '<p class="c-search-empty">검색 결과가 없습니다. 다른 검색어를 입력해 주세요.</p>';
  }
  input.addEventListener('input', renderSearch);
  header.querySelector('.c-search-toggle').addEventListener('click', () => { input.value = ''; renderSearch(); open(search); input.focus(); });

  // All C pages share the same dimensions, menu order and scroll behavior.
  let previousY = scrollY;
  let frame = 0;
  function updateHeader() {
    frame = 0;
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 50);
    if (y < 80 || y < previousY - 3 || header.contains(document.activeElement)) header.classList.remove('is-hidden');
    else if (y > 100 && y > previousY + 3 && !document.querySelector('dialog[open]')) header.classList.add('is-hidden');
    previousY = y;
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateHeader); }, { passive: true });
  addEventListener('pageshow', () => { closeMenu(); if (search.open) search.close(); updateHeader(); });
  updateHeader();
  window.SPSCNavigation = { closeMenu, href: key => routes.find(item => item[0] === key)?.[2] || 'hyosung.html' };
})();
