(() => {
  'use strict';
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 761px) and (min-height: 620px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const homes = { a: 'mastercard.html', b: 'jll.html', c: 'hyosung.html', d: 'smpmc.html' };
  const requestedFrom = new URLSearchParams(location.search).get('from');
  const home = Object.hasOwn(homes, requestedFrom) ? homes[requestedFrom] : homes.b;
  qa('[data-home]').forEach(link => { link.href = home; link.target = '_top'; });
  qa('[data-home-section]').forEach(link => { link.href = requestedFrom === 'c' ? window.SPSCNavigation.href(link.dataset.homeSection) : `${home}#${link.dataset.homeSection}`; link.target = '_top'; });

  qa('.circle-link').forEach(link => {
    const word = q('.link-word', link);
    const context = q('.sr-only', link)?.textContent.trim();
    if (!link.hasAttribute('aria-label')) link.setAttribute('aria-label', context ? `${context} 살펴보기` : word.textContent);
    word.setAttribute('aria-hidden', 'true');
    const mask = document.createElement('span');
    mask.className = 'link-word-window';
    word.before(mask);
    mask.append(word);
  });

  const header = q('.about-header');
  const menuButton = q('.menu-toggle');
  const menu = q('#about-menu');
  const main = q('main');
  const footer = q('footer');
  function setMenu(open, returnFocus = false) {
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '전체 메뉴 닫기' : '전체 메뉴 열기');
    document.body.classList.toggle('menu-open', open);
    main.inert = open;
    footer.inert = open;
    if (open) { header.classList.remove('is-hidden'); q('a', menu).focus(); }
    else if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  qa('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (!menu.hidden && !header.contains(event.target) && !menu.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const focusable = qa('a,button', header).concat(qa('a', menu)).filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Hanwha's split composition, with a stronger SPS motion treatment.
  // The document always scrolls natively. Only decorative layers trail it.
  const hero = q('.about-hero');
  const story = q('.story');
  const stage = q('.story-stage');
  const panels = q('.story-panels');
  const steps = qa('.story-step');
  const copies = qa('.story-copy');
  const storyButtons = qa('[data-story]');
  const statementLines = qa('.statement-line');
  const introAnimations = [];
  const exitTimers = new Map();
  const cinematicEase = 'cubic-bezier(.16,1,.3,1)';
  const smoothStep = p => p * p * (3 - 2 * p);
  let enhanced = false;
  let activeStory = -1;
  let storyBounds = { top: 0, height: 1 };
  let lineBounds = [];
  let heroHeight = hero.offsetHeight;
  let visualY = scrollY;
  let lastTime = 0;
  let viewportWidth = innerWidth;
  let viewportHeight = innerHeight;
  let frameId = 0;
  let measureFrame = 0;
  let previousY = scrollY;

  // Keep each heading semantic, and use nested masks only for its visual lines.
  copies.forEach(copy => {
    const heading = q('h3', copy);
    const lines = heading.innerHTML.split(/<br\s*\/?>/i);
    heading.replaceChildren(...lines.map((text, index) => {
      const mask = document.createElement('span');
      mask.className = 'copy-line';
      const inner = document.createElement('span');
      inner.className = 'copy-line-inner';
      inner.textContent = text;
      inner.style.setProperty('--line-delay', `${index * 110}ms`);
      mask.append(inner);
      return mask;
    }));
    copy.dataset.revealGroup = '';
  });

  const groups = qa('.space-card,.spaces-heading');
  groups.forEach(group => {
    group.dataset.revealGroup = '';
    qa('[data-reveal]', group).forEach((child, i) => {
      child.removeAttribute('data-reveal');
      child.dataset.revealChild = '';
      child.style.setProperty('--reveal-delay', `${i * 140}ms`);
    });
  });
  qa('.vision-principles > li').forEach((li, i) => li.style.setProperty('--principle-delay', `${i * 150}ms`));
  const revealTargets = qa('[data-reveal],[data-reveal-group]');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  revealTargets.forEach(element => {
    if (reduced.matches || element.getBoundingClientRect().bottom < 0) element.classList.add('is-visible');
    else revealObserver.observe(element);
  });
  document.documentElement.classList.add('motion-enabled');
  document.documentElement.classList.toggle('motion-rich', !reduced.matches);
  document.addEventListener('focusin', event => {
    event.target.closest('[data-reveal],[data-reveal-group]')?.classList.add('is-visible');
  });

  // A close city view pulls back while two lines rise independently through masks.
  if (!reduced.matches && !location.hash && scrollY < 100) {
    const finalHeight = hero.offsetHeight;
    introAnimations.push(hero.animate([
      { height: `${Math.max(finalHeight, innerHeight)}px`, clipPath: 'inset(4% 3% 0% 3%)' },
      { height: `${finalHeight}px`, clipPath: 'inset(0% 0% 0% 0%)' }
    ], { duration: 1450, easing: cinematicEase }));
    introAnimations.push(q('.hero-photo').animate([
      { transform: 'translateY(5%) scale(1.28)' },
      { transform: 'translateY(-5%) scale(1)' }
    ], { duration: 1900, easing: cinematicEase }));
    introAnimations.push(q('.hero-label').animate([
      { opacity: 0, transform: 'translateY(32px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 800, delay: 280, easing: cinematicEase, fill: 'backwards' }));
    qa('.title-line-inner').forEach((line, index) => {
      introAnimations.push(line.animate([
        { opacity: 0, transform: 'translateY(115%) rotate(3deg)' },
        { opacity: 1, transform: 'translateY(0) rotate(0deg)' }
      ], { duration: 1150, delay: 400 + index * 160, easing: cinematicEase, fill: 'backwards' }));
    });
    introAnimations.push(q('.hero-scroll').animate([
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 700, delay: 1000, easing: cinematicEase, fill: 'backwards' }));
  }

  function setActiveStory(index) {
    if (index === activeStory) return;
    const previous = activeStory;
    activeStory = index;
    story.dataset.direction = index < previous ? 'backward' : 'forward';
    copies.forEach((copy, i) => {
      clearTimeout(exitTimers.get(copy));
      copy.classList.remove('is-leaving');
      if (i === previous && i !== index) {
        copy.classList.add('is-leaving');
        exitTimers.set(copy, setTimeout(() => copy.classList.remove('is-leaving'), 260));
      }
      copy.classList.toggle('is-active', i === index);
      copy.inert = i !== index;
      copy.setAttribute('aria-hidden', String(i !== index));
      // A changing scene must not leave keyboard focus inside an inert panel.
      if (i !== index && copy.contains(document.activeElement) && index >= 0) storyButtons[index].focus({ preventScroll: true });
    });
    storyButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }

  function measure() {
    measureFrame = 0;
    heroHeight = hero.offsetHeight;
    const rect = story.getBoundingClientRect();
    storyBounds = { top: rect.top + scrollY, height: rect.height };
    lineBounds = statementLines.map(line => line.getBoundingClientRect().top + scrollY);
    scheduleDraw();
  }
  function scheduleMeasure() { if (!measureFrame) measureFrame = requestAnimationFrame(measure); }
  function configureStory() {
    const next = desktop.matches && !reduced.matches;
    document.documentElement.classList.toggle('motion-rich', !reduced.matches);
    if (next !== enhanced) {
      enhanced = next;
      activeStory = -1;
      exitTimers.forEach(timer => clearTimeout(timer));
      copies.forEach(copy => copy.classList.remove('is-active', 'is-leaving'));
      if (enhanced) {
        copies.forEach(copy => panels.append(copy));
        stage.hidden = false;
        story.classList.add('is-enhanced');
        setActiveStory(-2);
      } else {
        story.classList.remove('is-enhanced');
        copies.forEach((copy, i) => {
          steps[i].append(copy);
          copy.inert = false;
          copy.removeAttribute('aria-hidden');
          // Observe again if mobile copy has not entered its new position yet.
          if (!copy.classList.contains('is-visible')) revealObserver.observe(copy);
        });
        stage.hidden = true;
      }
    }
    visualY = scrollY;
    scheduleMeasure();
  }

  function draw(time) {
    frameId = 0;
    const y = scrollY;
    const delta = y - previousY;
    if (menu.hidden && !q('dialog[open]')) {
      if (y < 80 || delta < -4) header.classList.remove('is-hidden');
      else if (delta > 4 && y > 130 && !header.contains(document.activeElement)) header.classList.add('is-hidden');
    }
    header.classList.toggle('is-scrolled', y > 20);
    previousY = y;
    const dt = lastTime ? Math.min(64, time - lastTime) : 16.7;
    lastTime = time;
    if (reduced.matches || Math.abs(y - visualY) > innerHeight * 1.8) visualY = y;
    else visualY += (y - visualY) * (1 - Math.exp(-dt / 80));
    if (Math.abs(visualY - y) < .15) visualY = y;
    if (visualY !== y && !document.hidden) scheduleDraw();

    const heroProgress = reduced.matches ? 0 : clamp(visualY / Math.max(1, heroHeight));
    hero.style.setProperty('--hero-shift', `${heroProgress * heroHeight * .26}px`);
    hero.style.setProperty('--hero-scale', String(1 + heroProgress * .14));
    hero.style.setProperty('--hero-opacity', String(1 - heroProgress * .9));
    hero.style.setProperty('--title-shift', `${-heroProgress * 90}px`);
    hero.style.setProperty('--hero-inset', `${enhanced ? heroProgress * 3 : 0}%`);

    statementLines.forEach((line, i) => {
      const ink = reduced.matches ? 1 : clamp((visualY + innerHeight * .82 - lineBounds[i]) / (innerHeight * .32));
      line.style.setProperty('--ink-progress', `${ink * 100}%`);
      line.style.setProperty('--ink-shift', `${reduced.matches ? 0 : (1 - ink) * 22}px`);
    });
    if (!enhanced) return;
    const travel = Math.max(1, storyBounds.height - stage.offsetHeight);
    const progress = clamp((visualY - storyBounds.top) / travel);
    const centers = [0, .32, .68];
    const active = visualY < storyBounds.top - innerHeight * .45 ? -1 : progress < .32 ? 0 : progress < .68 ? 1 : 2;
    setActiveStory(active);
    story.style.setProperty('--story-progress', String(progress));
    steps.forEach((step, i) => {
      const entry = i === 0 ? 1 : smoothStep(clamp((progress - centers[i] + .10) / .20));
      const local = clamp((progress - (centers[i] || 0)) / .32);
      step.style.setProperty('--scene-cover', `${(1 - entry) * 100}%`);
      step.style.setProperty('--scene-y', `${(1 - entry) * 12}%`);
      step.style.setProperty('--scene-scale', String(1.10 + (1 - entry) * .14 - local * .10));
    });
  }
  function scheduleDraw() { if (!frameId) frameId = requestAnimationFrame(draw); }
  storyButtons.forEach((button, index) => button.addEventListener('click', () => {
    const travel = Math.max(1, storyBounds.height - stage.offsetHeight);
    window.scrollTo({ top: storyBounds.top + [0, .48, .92][index] * travel, behavior: reduced.matches ? 'instant' : 'smooth' });
  }));
  q('.story-navigation').addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const current = storyButtons.indexOf(document.activeElement);
    if (current < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (current + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    storyButtons[target].focus();
    storyButtons[target].click();
  });
  addEventListener('scroll', scheduleDraw, { passive: true });
  addEventListener('resize', () => {
    if (innerWidth !== viewportWidth || innerHeight !== viewportHeight) {
      introAnimations.forEach(animation => animation.cancel());
      viewportWidth = innerWidth;
      viewportHeight = innerHeight;
    }
    visualY = scrollY;
    scheduleMeasure();
  }, { passive: true });
  addEventListener('pageshow', scheduleMeasure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
    else { lastTime = 0; visualY = scrollY; scheduleMeasure(); }
  });
  desktop.addEventListener('change', configureStory);
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      introAnimations.forEach(animation => animation.cancel());
      revealTargets.forEach(element => element.classList.add('is-visible'));
      revealObserver.disconnect();
    }
    configureStory();
  });
  new ResizeObserver(scheduleMeasure).observe(main);
  if (document.fonts) document.fonts.ready.then(scheduleMeasure);
  configureStory();

  const spaceDetails = {
    office: { label: 'OFFICE', title: '일하기 좋은 공간의 기준을 만듭니다.', lead: '쾌적한 업무 환경과 안정적인 건물 운영을 함께 살핍니다. 임대인과 임차인이 같은 방향을 바라볼 수 있도록 현장의 정보를 연결합니다.', points: ['냉난방·조명·공용부 등 시설 상태와 유지보수 이력 관리', '임차인의 요청 접수와 처리 과정 공유', '계약 일정과 월별 운영 현황을 정리한 리포트'] },
    retail: { label: 'RETAIL', title: '다시 찾고 싶은 공간을 생각합니다.', lead: '방문자의 경험과 입점 공간의 일상은 긴밀하게 이어집니다. 작은 불편을 줄이고, 상업 공간의 운영이 원활하게 이어지도록 돕습니다.', points: ['출입 동선과 공용 공간의 청결·안전 점검', '입점 임차인과의 일관된 커뮤니케이션', '입·퇴실과 시설 보수 등 주요 운영 일정 관리'] },
    building: { label: 'BUILDING', title: '매일의 관리가 자산의 내일이 됩니다.', lead: '건물별로 다른 시설과 운영 환경을 먼저 이해합니다. 필요한 업무의 우선순위를 정하고, 기록이 쌓일수록 관리의 방향이 더 명확해지도록 합니다.', points: ['정기 점검과 긴급 대응 절차의 체계화', '수입·지출·미수금 등 운영 정보 정리', '시설 보수 이력과 향후 유지관리 과제 확인'] },
    mixed: { label: 'MIXED-USE', title: '서로 다른 일상을 하나의 가치로 연결합니다.', lead: '업무와 상업, 다양한 쓰임이 공존하는 공간에서는 균형 있는 운영이 필요합니다. 공통 영역과 개별 공간의 필요를 함께 살펴 관리의 빈틈을 줄입니다.', points: ['공간별 사용 특성을 반영한 관리 기준 마련', '공용 시설과 동선의 운영 이슈 조율', '여러 담당자가 같은 기준으로 이어가는 업무 기록'] }
  };
  const dialog = q('.space-dialog');
  qa('[data-space]').forEach(button => button.addEventListener('click', () => {
    const item = spaceDetails[button.dataset.space];
    if (!item) return;
    q('#space-dialog-label').textContent = item.label;
    q('#space-dialog-title').textContent = item.title;
    q('#space-dialog-lead').textContent = item.lead;
    q('#space-dialog-points').replaceChildren(...item.points.map(point => {
      const li = document.createElement('li'); li.textContent = point; return li;
    }));
    dialog.showModal();
    document.body.classList.add('modal-open');
  }));
  q('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
})();
