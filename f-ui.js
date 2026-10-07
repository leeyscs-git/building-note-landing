(() => {
  'use strict';
  const services = window.SPS_F_SERVICES;
  const requested = new URLSearchParams(location.search).get('service');
  const key = Object.hasOwn(services, requested) ? requested : 'management';
  const detail = document.body.dataset.fPage === 'service';
  const item = detail ? services[key] : null;
  const link = (id) => `f-service.html?service=${id}`;
  const links = Object.entries(services).map(([id,s]) => `<a href="${link(id)}"${detail && id === key ? ' aria-current="page"' : ''}>${s.title}</a>`).join('');
  document.querySelector('[data-f-navigation]').outerHTML = `<header class="c-header f-header${document.body.dataset.fPage === 'home' ? '' : ' is-scrolled'}"><a class="c-brand" href="f-home.html" aria-label="SPS 홈"><img src="assets/logo.svg" alt="SPS" width="120" height="40"></a><nav class="c-primary" aria-label="주 메뉴"><a href="f-services.html"${document.body.dataset.fPage === 'services' ? ' aria-current="page"' : ''}>서비스</a>${links}</nav><div class="c-tools"><button class="c-contact" data-f-consult>상담 안내 <span aria-hidden="true">↗</span></button><button class="c-icon c-menu-toggle" aria-label="서비스 메뉴 열기" aria-expanded="false" aria-controls="f-menu"><span></span><span></span></button></div></header>`;
  const footer = document.querySelector('[data-f-footer]');
  if (footer) footer.outerHTML = `<footer class="f-footer wrap"><a href="f-home.html" aria-label="SPS 홈"><img src="assets/logo.svg" width="108" height="40" alt="SPS"></a><p>Spaces. People. Solutions.</p><a href="f-services.html">서비스 살펴보기 ↗</a><span>© 2026 SPS</span></footer>`;
  document.body.insertAdjacentHTML('beforeend',`<dialog class="c-nav-dialog c-menu" id="f-menu" aria-labelledby="f-menu-title"><button class="c-dialog-close" data-f-close aria-label="메뉴 닫기">×</button><div class="c-menu-inner"><p class="c-eyebrow">Choose your service</p><h2 id="f-menu-title">어떤 일을 맡기고 싶으신가요?</h2><nav aria-label="서비스 메뉴"><a href="f-home.html">SPS 홈 <span>↗</span></a><a href="f-services.html">전체 서비스 <span>↗</span></a>${links}</nav><p class="c-menu-note">운영은 맡기고, 현재와 남은 일을 확인하도록.</p></div></dialog><dialog class="f-dialog" id="f-dialog" aria-labelledby="f-dialog-title"><div class="f-dialog-body"></div></dialog>`);
  const header = document.querySelector('.f-header');
  const menu = document.querySelector('#f-menu');
  const dialog = document.querySelector('#f-dialog');
  const menuToggle = document.querySelector('.c-menu-toggle');
  const origins = new WeakMap();
  function open(target, trigger) {
    origins.set(target,{trigger,y:scrollY});
    target.showModal(); document.body.classList.add('f-modal-open');
    const heading = target.querySelector('h2');
    if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    menuToggle.setAttribute('aria-expanded',String(menu.open));
  }
  [menu,dialog].forEach(target => {
    target.addEventListener('close',() => {
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('f-modal-open');
      menuToggle.setAttribute('aria-expanded',String(menu.open));
      const origin = origins.get(target);
      if (origin) { window.scrollTo({top:origin.y,behavior:'instant'}); origin.trigger?.focus({preventScroll:true}); }
    });
    target.addEventListener('click',event => {
      if (event.target.closest('[data-f-close]')) target.close();
      else if (event.target === target) { const b=target.getBoundingClientRect(); if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom) target.close(); }
    });
  });
  menuToggle.addEventListener('click',()=>open(menu,menuToggle));
  function show(title,html,trigger) {
    dialog.querySelector('.f-dialog-body').innerHTML=`<button class="f-close" data-f-close aria-label="안내 닫기">×</button><p class="f-eyebrow">SPS / ${item ? item.title : '관리 상담'}</p><h2 id="f-dialog-title">${title}</h2>${html}<button class="f-button" data-f-close>읽던 곳으로 돌아가기 <span aria-hidden="true">↩</span></button>`;
    dialog.scrollTop=0; open(dialog,trigger);
  }
  document.addEventListener('click',event => {
    const consult = event.target.closest('[data-f-consult]');
    if (consult) show('상담부터 관리까지,<br>이렇게 협의합니다.',`<p class="f-notice"><strong>상담이 신청된 것은 아닙니다.</strong>지금은 절차 안내만 제공합니다. 개인정보 입력·전송·예약은 이루어지지 않습니다.</p>${item ? `<p class="f-context">살펴본 서비스: <strong>${item.title}</strong></p>` : ''}<ol class="f-dialog-steps">${window.SPS_CONTENT.steps.map(([t,d])=>`<li><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol><h3>미리 살펴볼 내용</h3><ul>${(item?.preparation||['건물의 현재 상황','기존 관리 방식','맡기고 싶은 업무']).map(t=>`<li>${t}</li>`).join('')}</ul><p>${window.SPS_CONTENT.price}</p><p>${window.SPS_CONTENT.exclusions}</p><p>현장 진단 비용·서비스 지역·수용 가능한 건물 규모는 확정 전입니다.</p>`,consult);
    const evidence=event.target.closest('[data-f-evidence]');
    if(evidence){const record=window.SPS_CONTENT.records.find(r=>r.id===evidence.dataset.fEvidence);if(record)show(`${record.category}<br>${record.status}`,`<p class="f-small">${window.SPS_CONTENT.sampleLabel}<br>${window.SPS_CONTENT.asOf}</p><p class="f-context">${record.location} · ${record.id}</p><h3>현재 확인된 내용</h3><p>${record.finding}</p><div class="f-notice"><strong>${record.missing}</strong>${record.caution}</div><h3>남은 확인</h3><p>${record.nextDetail}</p><dl class="f-evidence-meta"><div><dt>출처</dt><dd>${record.note}</dd></div><div><dt>담당 역할</dt><dd>${record.owner} · 처리 기한 미정</dd></div></dl>`,evidence);}
    const prepare=event.target.closest('[data-f-prepare]');
    if(prepare)show('자료를 확인한 뒤,<br>진행 상황을 정리합니다.',`<p class="f-small">보고 구성 예시 · 실제 공실 정보가 아닙니다.</p><p>현재는 건물·계약·공실 자료가 제공되지 않았습니다. 공실 수나 임대 진행 상태를 임의로 표시하지 않습니다.</p><ul>${services.leasing.preparation.map(t=>`<li>${t}</li>`).join('')}</ul><p>확인할 자료와 중개 담당·조건은 상담에서 협의합니다.</p>`,prepare);
  });
  function updateHeader(){header.classList.toggle('is-scrolled',document.body.dataset.fPage!=='home'||scrollY>50);}
  addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  // Anchors stay in their preview frame and preserve native Back navigation.
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const target=document.getElementById(a.hash.slice(1));if(target){target.tabIndex=-1;target.focus({preventScroll:true});}}));
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('f-visible');observer.unobserve(e.target);}}),{threshold:.06});
  document.querySelectorAll('[data-f-reveal]').forEach(el=>observer.observe(el));
  if(!reduced.matches)document.documentElement.classList.add('f-motion-ready');
  reduced.addEventListener('change',()=>{if(reduced.matches)document.documentElement.classList.remove('f-motion-ready');});
})();
