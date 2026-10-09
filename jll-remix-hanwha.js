/* Source notes and deliberate deviations: design/jll-remix/hanwha-reference.json.
   Native sticky stages + source-derived scroll ratios; no wheel locking. */
(function (root) {
  'use strict';
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const mix = (a, b, p) => a + (b - a) * clamp(p);
  const range = (n, a, b) => clamp((n - a) / (b - a));
  function sceneState(t, index, exitWithFinalScene = false) {
    const start = 1.6 + index * 2;
    const holdForExit = exitWithFinalScene && index === 2;
    const enter = range(t, start - 1, start);
    // V4 releases the sticky stage with the last film still covering it.
    const leave = holdForExit ? 0 : range(t, start + 1, start + 2);
    return {
      visible: t > start - 1 && t < start + 2,
      enter, leave,
      size: 66 + 34 * enter - (index < 2 ? 34 * leave : 0),
      radius: 4.25 * (1 - enter + (index < 2 ? leave : 0)),
      y: 1 - enter - leave,
      innerY: -90 * (1 - enter) + 40 * leave,
      text: range(t, start - .05, start + .3) * (holdForExit ? 1 : 1 - range(t, start + .9, start + 1.25)),
      active: t >= start - .7 && (holdForExit || t < start + 1.3),
      rocket: range(t, start - 1, start + 1)
    };
  }
  function keywordState(t) {
    return {
      reveal: range(t, -.4, 0),
      restOpacity: 1 - range(t, 0, .5),
      baseWeight: 1 - range(t, .1, .6),
      filmWeight: range(t, 1.2, 1.6),
      moveX: range(t, .5, 1),
      moveY: range(t, 1.1, 1.6),
      travel: t >= 0,
      list: t >= 1.6
    };
  }
  function futureState(t) {
    return { expand: range(t, .2, 1.2), heading: 1 - range(t, .1, .65), top: range(t, 1.15, 1.6), bottom: range(t, 1.75, 2.35) };
  }
  function heroOffset(scroll, heroTop, headerHeight, overlayHeader = false) {
    return Math.max(0, (scroll + (overlayHeader ? heroTop : headerHeight) - heroTop) * .5);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { clamp, mix, range, sceneState, futureState, keywordState, heroOffset };
  if (!root.document) return;

  const doc = root.document;
  const page = doc.querySelector('.hw-page');
  if (!page) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-aspect-ratio:1/1)');
  const compactPanels = matchMedia('(max-width:850px), (max-aspect-ratio:1/1)');
  const shortViewport = matchMedia('(max-width:1000px) and (max-height:600px)');
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  const header = doc.querySelector('[data-sps-header]');
  const hero = doc.querySelector('.hw-hero');
  const heroMedia = doc.querySelector('.hw-hero-media');
  const vision = doc.querySelector('.hw-vision');
  const stage = doc.querySelector('.hw-vision-stage');
  const slogan = doc.querySelector('.hw-slogan');
  const sloganRest = [...doc.querySelectorAll('.hw-slogan-rest')];
  const sloganLines = [...doc.querySelectorAll('.hw-slogan-line')];
  const sloganInner = sloganLines.map(el => el.firstElementChild);
  const from = [...doc.querySelectorAll('[data-key-from]')];
  const targets = [...doc.querySelectorAll('[data-key-to]')];
  const keyList = doc.querySelector('.hw-keywords');
  const scenes = [...doc.querySelectorAll('[data-scene]')].map((el, i) => ({
    el, frame: el.querySelector('.hw-scene-frame'), content: el.querySelector('.hw-scene-content'),
    videos: [...el.querySelectorAll('video')], copy: doc.querySelector('[data-scene-copy="' + i + '"]')
  }));
  const rocket = doc.querySelector('.hw-rocket');
  const smoke = doc.querySelector('.hw-smoke');
  const sky = doc.querySelector('.hw-sky');
  const mountains = [doc.querySelector('.hw-mountain-back'), doc.querySelector('.hw-mountain-front')];
  const rocketWorld = doc.querySelector('.hw-rocket-world');
  const future = doc.querySelector('.hw-future');
  const futurePicture = doc.querySelector('.hw-future-picture');
  const futureImage = futurePicture.querySelector('img');
  const futureHeading = doc.querySelector('.hw-future-heading');
  const futureTop = doc.querySelector('.hw-future-top');
  const futureBottom = doc.querySelector('.hw-future-bottom');
  const nav = doc.querySelector('.hw-section-nav');
  const navLinks = [...nav.querySelectorAll('a')];
  const sections = navLinks.map(a => doc.querySelector(a.getAttribute('href')));
  const footer = doc.querySelector('[data-sps-footer]') || doc.querySelector('.hw-footer');
  const videos = [...doc.querySelectorAll('[data-video]')];
  const heroVideo = doc.querySelector('.hw-hero-video');
  const videoButton = doc.querySelector('.hw-video-toggle');
  let metrics, layoutPending = true, paintPending = true, rafID = 0;
  let userPaused = reduced.matches, lenis = null, mode = false, time = 0;
  let pointerX = 0, pointerY = 0, pointerCurrentX = 0, pointerCurrentY = 0;
  const activeVideo = new WeakMap();
  let activeSection = -1;

  function configure() {
    mode = !reduced.matches && !(shortViewport.matches && !doc.documentElement.hasAttribute('data-sps-desktop'));
    doc.documentElement.classList.toggle('hw-motion', mode);
    if (lenis) { lenis.destroy(); lenis = null; }
    // The reference uses Lenis defaults; touch keeps native scrolling.
    if (mode && root.Lenis) {
      lenis = new root.Lenis();
    }
    if (!mode) {
      vision.style.removeProperty('--hw-vision-base-weight');
      vision.style.removeProperty('--hw-vision-film-weight');
      const animated = [heroMedia, ...sloganLines, ...sloganInner, ...sloganRest, ...from, keyList, ...scenes.flatMap(s => [s.el, s.frame, s.content, s.copy]), rocket, smoke, sky, ...mountains, rocketWorld, futurePicture, futureImage, futureHeading, futureTop, futureBottom];
      animated.forEach(el => el.removeAttribute('style'));
      slogan.classList.remove('is-keyword-travel', 'is-keyword-list');
      from.forEach(el => el.classList.remove('is-active'));
      if (reduced.matches) userPaused = true;
      doc.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'));
    }
    setPauseLabel();
    layoutPending = paintPending = true;
    wake();
  }
  function setPauseLabel() {
    if (!videoButton) return;
    videoButton.setAttribute('aria-pressed', String(userPaused));
    videoButton.innerHTML = userPaused ? '영상 재생 <span aria-hidden="true">▶</span>' : '영상 일시정지 <span aria-hidden="true">Ⅱ</span>';
  }
  function setVideo(video, active) {
    const deviceVisible = !(video.hasAttribute('data-mobile') && !portrait.matches) && !(video.hasAttribute('data-desktop') && portrait.matches);
    const shouldPlay = Boolean(active && deviceVisible && !video.hidden && !userPaused && !doc.hidden && !video.dataset.unavailable);
    if (activeVideo.get(video) === shouldPlay) return;
    activeVideo.set(video, shouldPlay);
    if (shouldPlay) {
      video.play().catch(() => {
        // A poster remains visible if media/autoplay is unavailable.
        activeVideo.set(video, false);
      });
    } else video.pause();
  }
  videoButton?.addEventListener('click', () => {
    userPaused = !userPaused;
    setPauseLabel();
    paintPending = true;
    wake();
  });
  videos.forEach(video => {
    video.addEventListener('error', () => {
      video.dataset.unavailable = 'true';
      if (video === heroVideo) {
        userPaused = true;
        setPauseLabel();
      }
    });
  });

  function measure() {
    const headerH = header.getBoundingClientRect().height;
    const height = mode ? stage.clientHeight : Math.max(1, innerHeight - headerH);
    const width = doc.documentElement.clientWidth;
    page.style.setProperty('--hw-width', width + 'px');
    const rect = stage.getBoundingClientRect();
    // Measure the untransformed source, even after a resize mid-animation.
    const measured = [...sloganInner, ...from];
    const savedTransforms = measured.map(el => el.style.transform);
    measured.forEach(el => { el.style.transform = 'none'; });
    const coordinates = from.map((el, i) => {
      const a = el.getBoundingClientRect(), b = targets[i].getBoundingClientRect();
      return { x: a.left - rect.left, y: a.top - rect.top, toX: b.left - rect.left, toY: b.top - rect.top };
    });
    measured.forEach((el, i) => { el.style.transform = savedTransforms[i]; });
    metrics = {
      headerH, height, width, coordinates,
      heroTop: hero.getBoundingClientRect().top + scrollY,
      visionTop: vision.getBoundingClientRect().top + scrollY,
      futureTop: future.getBoundingClientRect().top + scrollY,
      footerTop: footer.getBoundingClientRect().top + scrollY,
      sections: sections.map(el => el.getBoundingClientRect().top + scrollY),
      portraitWidth: Math.min(width <= 600 ? width * .48 : width * .35, 360, height * .45),
    };
    layoutPending = false;
  }
  function paint() {
    if (!metrics) return;
    const {headerH, height: h, width: w} = metrics;
    const y = scrollY + headerH;
    const t = (y - metrics.visionTop) / h;
    const ft = (y - metrics.futureTop) / h;
    const inHero = scrollY < metrics.visionTop;
    const keyword = keywordState(t);
    setVideo(heroVideo, inHero);
    if (mode) {
      // Fixed-reference hero rises at half the native scroll speed.
      heroMedia.style.transform = 'translateY(' + heroOffset(scrollY, metrics.heroTop, headerH, page.hasAttribute('data-overlay-header')) + 'px)';
      if (vision.hasAttribute('data-vision-palette')) {
        vision.style.setProperty('--hw-vision-base-weight', (keyword.baseWeight * 100) + '%');
        vision.style.setProperty('--hw-vision-film-weight', (keyword.filmWeight * 100) + '%');
      }
      slogan.classList.toggle('is-keyword-travel', keyword.travel);
      slogan.classList.toggle('is-keyword-list', keyword.list);
      sloganRest.forEach(el => { el.style.opacity = keyword.restOpacity; });
      sloganInner.forEach(el => { el.style.transform = 'translateY(' + ((1 - keyword.reveal) * 110) + '%)'; });
      // Move the original words. There is no second painted copy and no handoff.
      from.forEach((el, i) => {
        const c = metrics.coordinates[i];
        el.style.transform = 'translate(' + ((c.toX-c.x)*keyword.moveX) + 'px,' + ((c.toY-c.y)*keyword.moveY) + 'px)';
      });
      scenes.forEach((s, i) => {
        const state = sceneState(t, i, vision.dataset.visionExit === 'with-last-scene');
        s.el.style.visibility = state.visible ? 'visible' : 'hidden';
        s.el.style.transform = 'translateY(' + (state.y * h) + 'px)';
        const inset = (100 - state.size) / 2;
        s.frame.style.clipPath = 'inset(' + inset + '% round ' + state.radius + 'vw)';
        s.content.style.transform = 'translateY(' + state.innerY + '%)';
        s.copy.style.opacity = state.text;
        s.copy.style.transform = 'translateY(' + ((1 - state.text) * 35) + 'px)';
        from[i].classList.toggle('is-active', state.active);
        s.videos.forEach(video => setVideo(video, state.visible));
        s.content.querySelectorAll('video:not([data-desktop])').forEach(video => {
          video.style.objectPosition = '50% ' + (range(t, .6+i*2,3.6+i*2)*100) + '%';
        });
        if (i === 0) {
          rocket.style.transform = 'translateZ(3vw) translate(' + (-6+state.enter*6) + '%,' + (100-state.rocket*100-state.leave*60) + '%)';
          smoke.style.transform = 'translateZ(-2vw) translate(' + (-6+state.enter*6) + '%,' + (85-state.rocket*80) + '%)';
          mountains.forEach((el, n) => {
            const offset = n ? 60 : 70;
            el.style.transform = 'translateZ(' + (n ? 12 : 11.5) + 'vw) translateY(' + ((1-state.rocket)*offset) + '%) scale(' + (2-state.rocket) + ')';
          });
          sky.style.transform = 'translateZ(-30vw) scale(1.3) translate(' + mix(-5,0,range(t,.6,3.6)) + '%,' + mix(0,-15,range(t,.6,3.6)) + '%)';
        }
      });
      const f = futureState(ft);
      const pw = metrics.portraitWidth, ph = pw * 468 / 360;
      futurePicture.style.width = mix(pw,w,f.expand) + 'px';
      futurePicture.style.height = mix(ph,h,f.expand) + 'px';
      futurePicture.style.top = mix(68,50,f.expand) + '%';
      futurePicture.style.borderRadius = (8*(1-f.expand)) + 'px';
      futureImage.style.transform = 'translate(-50%,-50%) scale(' + mix(.6,1,f.expand) + ')';
      futureHeading.style.opacity = f.heading;
      futureHeading.style.transform = 'translateY(' + (-30*(1-f.heading)) + 'px)';
      futureTop.style.opacity = f.top;
      futureTop.style.transform = 'translateY(' + (35*(1-f.top)) + 'px)';
      futureBottom.style.opacity = f.bottom;
      futureBottom.style.transform = 'translateY(' + (35*(1-f.bottom)) + 'px)';
      // Invisible links must not receive focus before their scene is revealed.
      futureBottom.inert = f.bottom < .1;
    } else {
      futureBottom.inert = false;
      scenes.forEach(s => {
        const box = s.el.getBoundingClientRect();
        s.videos.forEach(v => setVideo(v, box.bottom > headerH && box.top < innerHeight));
      });
    }
    let index = 0;
    metrics.sections.forEach((top,i) => { if (top <= y+h*.4) index = i; });
    if (activeSection !== index) {
      activeSection = index;
      navLinks.forEach((a,i) => {
        if (i === index) a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }
    const lightVision = vision.dataset.visionPalette === 'black-white'
      ? !mode || keyword.baseWeight > .5 || keyword.filmWeight > .5
      : !['v1','v2','v4'].includes(vision.dataset.visionPalette) || (mode && keyword.baseWeight < .5);
    nav.classList.toggle('is-light', index === 0 || (index === 1 && lightVision) || (index === 4 && ft > 1));
    const footerVisible = scrollY + innerHeight > metrics.footerTop + 50;
    nav.style.opacity = footerVisible ? '0' : '1';
    nav.inert = footerVisible;
    paintPending = false;
  }

  function frame(now) {
    rafID = 0;
    if (doc.hidden) return;
    if (lenis) lenis.raf(now);
    if (layoutPending) measure();
    if (paintPending || lenis?.isScrolling) paint();
    const dt = Math.min(60,now-time || 16); time = now;
    const amount = 1-Math.exp(-dt/130);
    pointerCurrentX += (pointerX-pointerCurrentX)*amount;
    pointerCurrentY += (pointerY-pointerCurrentY)*amount;
    if (mode && Math.abs(pointerCurrentX)+Math.abs(pointerCurrentY) > .005) {
      rocketWorld.style.transform = 'rotateY(' + (-4*pointerCurrentX) + 'deg) rotateX(' + (-pointerCurrentY) + 'deg)';
    } else rocketWorld.style.transform = '';
    if (lenis || paintPending || Math.abs(pointerCurrentX-pointerX)+Math.abs(pointerCurrentY-pointerY) > .005) wake();
  }
  function wake() { if (!rafID && !doc.hidden) rafID = requestAnimationFrame(frame); }
  addEventListener('scroll', () => { paintPending = true; wake(); }, {passive:true});
  addEventListener('sps-hero-media-change', () => { paintPending = true; wake(); });
  addEventListener('sps-vision-palette-change', () => { paintPending = true; wake(); });
  addEventListener('resize', () => { layoutPending = paintPending = true; wake(); }, {passive:true});
  addEventListener('sps-theme-change', () => { layoutPending = paintPending = true; wake(); });
  const layoutObserver = new ResizeObserver(() => { layoutPending = paintPending = true; wake(); });
  layoutObserver.observe(header, {box:'border-box'});
  layoutObserver.observe(hero, {box:'border-box'});
  doc.fonts?.ready.then(() => { layoutPending = paintPending = true; wake(); });
  vision.addEventListener('pointermove', event => {
    if (!mode || !finePointer.matches || portrait.matches) return;
    pointerX = clamp((event.clientX / innerWidth -.5)*2,-1,1);
    pointerY = clamp(((event.clientY-metrics.headerH)/metrics.height -.5)*2,-1,1);
    wake();
  });
  vision.addEventListener('pointerleave', () => { pointerX = pointerY = 0; wake(); });
  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) videos.forEach(video => setVideo(video,false));
    else { layoutPending = paintPending = true; wake(); }
  });
  reduced.addEventListener('change', configure);
  shortViewport.addEventListener('change', configure);
  portrait.addEventListener('change', () => { layoutPending = paintPending = true; wake(); });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.1});
  doc.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  function scrollToElement(element, focus = true, duration = 1.1) {
    if (layoutPending) measure();
    const top = element.getBoundingClientRect().top + scrollY - metrics.headerH;
    const after = () => {
      if (!focus) return;
      if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex','-1');
      element.focus({preventScroll:true});
    };
    if (lenis) lenis.scrollTo(Math.max(0,top), {duration, onComplete:after});
    else { root.scrollTo({top:Math.max(0,top),behavior:reduced.matches?'instant':'smooth'}); after(); }
  }
  page.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#hw-"]');
    if (!link) return;
    const target = doc.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    history.pushState(null,'',link.getAttribute('href'));
    scrollToElement(target);
  });

  const panels = [...doc.querySelectorAll('.hw-business-panel')];
  const panelGroup = doc.querySelector('.hw-business-panels');
  function choosePanel(panel) {
    panels.forEach(el => {
      const active = el === panel;
      el.classList.toggle('is-active',active);
      const expanded=active || compactPanels.matches || reduced.matches;
      el.querySelector('button').setAttribute('aria-expanded',String(expanded));
      el.querySelector('.hw-business-detail').inert = !expanded;
    });
  }
  let aligning = false;
  function alignPanels() {
    if (!mode || compactPanels.matches || aligning) return;
    const rect = panelGroup.getBoundingClientRect();
    const gap = rect.top-metrics.headerH;
    if (Math.abs(gap) > 8 && Math.abs(gap) < metrics.height*.5 && lenis) {
      aligning = true;
      lenis.scrollTo(panelGroup,{offset:-metrics.headerH,duration:.8,easing:t=>t<.5?16*t**5:1-((-2*t+2)**5)/2,onComplete:()=>{aligning=false;}});
      setTimeout(()=>{aligning=false;},1000);
    }
  }
  panels.forEach(panel => {
    panel.addEventListener('pointerenter', () => {
      if (finePointer.matches) { choosePanel(panel); alignPanels(); }
    });
    panel.addEventListener('focusin', () => choosePanel(panel));
    panel.querySelector('button').addEventListener('click', () => {
      choosePanel(panel.classList.contains('is-active') ? null : panel);
      alignPanels();
    });
  });
  panelGroup.addEventListener('pointerleave', () => {
    if (!panelGroup.contains(doc.activeElement)) choosePanel(null);
  });
  panelGroup.addEventListener('focusout', event => {
    if (!panelGroup.contains(event.relatedTarget)) choosePanel(null);
  });
  compactPanels.addEventListener('change', () => choosePanel(null));
  reduced.addEventListener('change', () => choosePanel(null));
  choosePanel(null);

  const peek = doc.querySelector('.hw-peek-panel');
  const peekButton = doc.querySelector('.hw-peek-toggle');
  const peekLabel = peekButton?.dataset.peekLabel || '한화 소식';
  function showPeek(open) {
    peek.classList.toggle('is-open',open);
    peek.inert = !open;
    peek.setAttribute('aria-hidden',String(!open));
    peekButton.setAttribute('aria-expanded',String(open));
    peekButton.setAttribute('aria-label',`${peekLabel} ${open ? '닫기' : '열기'}`);
  }
  peekButton?.addEventListener('click', () => showPeek(peekButton.getAttribute('aria-expanded') !== 'true'));
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && peek?.classList.contains('is-open')) { showPeek(false); peekButton.focus(); }
  });

  // Pause smooth scrolling while shared menus/dialogs own the screen.
  let overlayBlocked = false;
  const overlays = new MutationObserver(() => {
    const blocked = Boolean(doc.querySelector('dialog[open]')) || doc.body.classList.contains('sps-menu-open');
    if (blocked === overlayBlocked) return;
    overlayBlocked = blocked;
    if (lenis) blocked ? lenis.stop() : lenis.start();
  });
  overlays.observe(doc.body,{attributes:true,attributeFilter:['class']});
  doc.querySelectorAll('dialog').forEach(el => {
    el.setAttribute('data-lenis-prevent','');
    overlays.observe(el,{attributes:true,attributeFilter:['open']});
  });
  doc.querySelectorAll('.sps-header-menu').forEach(el => el.setAttribute('data-lenis-prevent',''));
  configure();
  if (location.hash.startsWith('#hw-')) requestAnimationFrame(() => {
    const target = doc.getElementById(location.hash.slice(1));
    if (target) scrollToElement(target,false,.01);
  });
})(typeof window === 'undefined' ? globalThis : window);
