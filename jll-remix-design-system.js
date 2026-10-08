(() => {
  'use strict';
  const styles = getComputedStyle(document.documentElement);
  const groups = {
    brand: [
      ['--ink', 'Ink', '제목·본문·진한 버튼'],
      ['--red', 'Signal Red', '현재 메뉴·활성 상태·방향·초점'],
      ['--rose-soft', 'Contact Surface', '헤더 문의 버튼'],
      ['--rose-hover', 'Contact Hover', '문의 호버·텍스트 선택']
    ],
    surface: [
      ['--surface', 'White', '기본 바탕·대화상자'],
      ['--peach', 'Peach', '자산관리 설명 면'],
      ['--surface-sage', 'Sage', '공간·사람 설명 면'],
      ['--surface-blue', 'Blue Gray', '기술 설명 면'],
      ['--surface-cool', 'Cool Neutral', '선택·참고 결과 영역'],
      ['--muted', 'Muted Ink', '보조 설명'],
      ['--line', 'Line', '구획·구분선·헤더 호버'],
      ['--red-section', 'Section Red', '하단 문의 영역']
    ]
  };
  const toast = document.querySelector('#ds-toast');
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }
  Object.entries(groups).forEach(([group, colors]) => {
    const swatches = document.querySelector('#ds-swatches-' + group);
    colors.forEach(([token, name, role]) => {
      const value = styles.getPropertyValue(token).trim().toUpperCase();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ds-swatch';
      button.dataset.colorToken = token;
      button.dataset.colorName = name;
      button.setAttribute('aria-label', name + ' ' + value + ' 복사');
      const lightText = ['--ink', '--red', '--red-section', '--muted'].includes(token);
      button.innerHTML = '<span class="ds-swatch-paint" style="background:var(' + token + ');color:' + (lightText ? '#fff' : 'var(--ink)') + '" aria-hidden="true">↗</span><span class="ds-swatch-info"><strong>' + name + '</strong><code>' + value + '</code><small>' + role + '</small><small>' + token + '</small></span>';
      button.addEventListener('click', async () => {
        const current = getComputedStyle(document.documentElement).getPropertyValue(token).trim().toUpperCase();
        try { await navigator.clipboard.writeText(current); notify(current + ' 복사했습니다.'); }
        catch { notify('복사할 색상 값: ' + current); }
      });
      swatches.append(button);
    });
  });
  function luminance(hex) {
    const rgb = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  }
  const ink = luminance(styles.getPropertyValue('--ink').trim());
  const rose = luminance(styles.getPropertyValue('--rose-soft').trim());
  document.querySelector('#ds-contrast').textContent = '이 두 색의 계산 대비 ' + ((Math.max(ink, rose) + .05) / (Math.min(ink, rose) + .05)).toFixed(2) + ' : 1';
  function refreshThemeMeasurements() {
    const current = getComputedStyle(document.documentElement);
    document.querySelectorAll('[data-color-token]').forEach(button => {
      const value = current.getPropertyValue(button.dataset.colorToken).trim().toUpperCase();
      button.querySelector('code').textContent = value;
      button.setAttribute('aria-label', button.dataset.colorName + ' ' + value + ' 복사');
      button.querySelector('.ds-swatch-paint').style.color = luminance(value) > .35 ? '#10252b' : '#fff';
    });
    const inkNow=luminance(current.getPropertyValue('--ink').trim()), roseNow=luminance(current.getPropertyValue('--rose-soft').trim());
    document.querySelector('#ds-contrast').textContent='이 두 색의 계산 대비 '+((Math.max(inkNow,roseNow)+.05)/(Math.min(inkNow,roseNow)+.05)).toFixed(2)+' : 1';
    const mobile=document.querySelector('.ds-type-board').dataset.size==='mobile';
    const value=(token,fallback)=>window.SPSTheme?.value(token)??fallback;
    document.querySelector('[data-type-size="hero"]').textContent=value(mobile?'--hero-title-mobile':'--hero-title-size',mobile?39:59)+'px / '+(mobile?'1.28':'1.23');
    document.querySelector('[data-type-size="section"]').textContent=value(mobile?'--section-title-mobile':'--section-title-size',mobile?35:43)+'px / 1.3';
    document.querySelector('.ds-type-row:nth-child(3) b').textContent=value('--card-title-size',24)+'px / 1.4';
    document.querySelector('.ds-type-row:nth-child(4) b').textContent=value('--body-size',16)+'px / 1.65';
    document.querySelector('.ds-state-matrix>div:first-child code').textContent=current.getPropertyValue('--rose-soft').trim().toUpperCase();
    document.querySelector('.ds-state-matrix>div:nth-child(2) code').textContent=current.getPropertyValue('--rose-hover').trim().toUpperCase()+' · 104% · 220ms';
  }
  window.addEventListener('sps-theme-change',refreshThemeMeasurements);
  refreshThemeMeasurements();

  document.querySelectorAll('[data-type-view]').forEach(button => button.addEventListener('click', () => {
    const mobile = button.dataset.typeView === 'mobile';
    document.querySelector('.ds-type-board').dataset.size = button.dataset.typeView;
    document.querySelectorAll('[data-type-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelector('[data-type-size="hero"]').textContent = mobile ? '39px / 1.28' : '59px / 1.23';
    document.querySelector('[data-type-tracking]').textContent = mobile ? '500 · −0.055em' : '500 · −0.045em';
    document.querySelector('[data-type-size="section"]').textContent = mobile ? '35px / 1.3' : '43px / 1.3';
    document.querySelector('[data-type-size="label"]').textContent = mobile ? '9px / 1.5' : '11px / 1.5';
    refreshThemeMeasurements();
  }));
  if (matchMedia('(max-width:600px)').matches) document.querySelector('[data-type-view="mobile"]').click();

  document.querySelectorAll('[data-demo-action]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#ds-action-result').textContent = button.dataset.demoAction;
    notify(button.dataset.demoAction);
  }));
  document.querySelectorAll('.ds-demo-nav > button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.ds-demo-nav > button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelector('#ds-nav-result').textContent = '선택: ' + button.textContent + ' · 현재 위치 표시만 변경하며 실제 페이지로 이동하지 않습니다.';
  }));
  document.querySelectorAll('[data-service-menu-preview]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-service-menu-preview]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const menu = document.createElement('sps-service-menu');
    menu.dataset.variant = button.dataset.serviceMenuPreview;
    document.querySelector('.ds-header-stage sps-service-menu').replaceWith(menu);
  }));

  const stories = [
    {title: '더 나은 내일을 위한\n부동산의 가능성', image: 'assets/jll/seoul.webp', alt: '서울 도심과 남산 전경'},
    {title: '기술과 경험으로 만드는\n스마트한 자산관리', image: 'assets/landing/workplace.jpg', alt: '유리 파티션으로 정돈된 업무 공간'},
    {title: '사람이 중심이 되는\n새로운 공간의 기준', image: 'assets/jll/spaces.webp', alt: '원목 계단과 녹지가 있는 업무 공간'}
  ];
  document.querySelectorAll('[data-story]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.story);
    const story = stories[index];
    document.querySelectorAll('[data-story]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    document.querySelector('#ds-story-title').textContent = story.title;
    const image = document.querySelector('#ds-story-image');
    image.src = story.image;
    image.alt = story.alt;
    document.querySelector('#ds-story-counter').textContent = '0' + (index + 1) + ' / 03';
  }));

  document.querySelectorAll('[data-card-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.cardFilter;
    document.querySelectorAll('[data-card-filter]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    let count = 0;
    document.querySelectorAll('.ds-card-grid [data-category]').forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) count++;
    });
    document.querySelector('#ds-filter-result').textContent = button.textContent + ' · ' + count + '개 견본';
  }));
  document.querySelector('#ds-building-type').addEventListener('change', event => {
    document.querySelector('#ds-selection-status').textContent = event.target.value ? '선택: ' + event.target.value + ' · 화면 예시이며 저장·전송되지 않습니다.' : '선택 전 · 저장하거나 전송하지 않는 화면 예시입니다.';
  });

  const dialog = document.querySelector('#ds-dialog');
  const detailContent = {
    dialog: ['필요한 내용을 읽고, 원래 자리로.', '닫기 버튼 또는 Escape로 이 창을 닫아보세요. 실행한 버튼으로 초점이 돌아갑니다. 내용이 길어지면 대화상자 안에서 스크롤할 수 있습니다.'],
    management: ['자산관리 솔루션', 'H의 서비스 설명이 상세 대화상자로 연결되는 구조를 보여주는 견본입니다. 시설 관리·임차인 커뮤니케이션·운영 리포트는 메인에 기재된 항목이며, 이 문서에서 별도의 제공 범위나 성과를 추가하지 않았습니다.'],
    report: ['좋은 월간 리포트의 조건', '분류·제목·요약에서 상세 읽기로 이어지는 견본입니다. 카드의 사진, 제목, 읽기 링크는 이 같은 내용을 엽니다. 여기에는 실제 건물의 보고서나 성과 자료를 넣지 않았습니다.'],
    workplace: ['다시 찾고 싶은 오피스', '공간 이야기 분류에서 선택한 카드의 상세 견본입니다. 이 창을 닫으면 공간 이야기 필터와 원래 읽기 버튼의 초점이 유지됩니다.'],
    automation: ['작은 반복을 줄이는 운영', '운영 가이드 카드에서 이어지는 상세 견본입니다. 본문과 닫기 동작을 확인하기 위한 내용이며 실제 자동화 서비스 실행 화면은 아닙니다.']
  };
  let opener;
  document.querySelectorAll('[data-open-demo]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    const [title, copy] = detailContent[button.dataset.openDemo];
    document.querySelector('#ds-dialog-title').textContent = title;
    document.querySelector('#ds-dialog-copy').textContent = copy;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  dialog.querySelectorAll('button').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus({preventScroll: true});
  });

  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let animation;
  document.querySelector('#ds-replay').addEventListener('click', () => {
    animation?.cancel();
    const message = document.querySelector('#ds-motion-status');
    if (reduced.matches) { message.textContent = '움직임 감소 설정에 따라 정적으로 표시합니다.'; return; }
    const duration=window.SPSTheme?.value('--reveal-duration')??800;
    const distance=window.SPSTheme?.value('--reveal-distance')??28;
    animation = document.querySelector('.ds-motion-card').animate([{opacity: 0, transform: 'translateY('+distance+'px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration, easing: styles.getPropertyValue('--ease-editorial').trim()});
    message.textContent = duration+'ms / '+distance+'px 등장 모션을 재생했습니다.';
  });
  reduced.addEventListener('change', () => { if (reduced.matches) animation?.cancel(); });

  // Section location belongs to the documentation UI, not the product navigation.
  const navLinks = [...document.querySelectorAll('.ds-sidebar nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  let queued = false;
  function updateLocation() {
    queued = false;
    const line = matchMedia('(max-width:720px)').matches ? 245 : 185;
    let current = 'overview';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    }
    navLinks.forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateLocation); } }, {passive: true});
  updateLocation();
})();
