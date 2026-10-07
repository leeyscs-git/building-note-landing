'use strict';
const content = window.SPS_CONTENT;
const isAfter = document.body.dataset.variant === 'after';
// Optional proposal, loaded only by hero-v2.html. Existing comparison paths keep their rendering.
const heroProposal = document.body.dataset.hero === 'persuasion' ? window.SPS_HERO : null;
const arrow = '<span aria-hidden="true">↗</span>';
const logo = '<img class="brand-logo" src="../assets/logo.svg" width="120" height="40" alt="SPS">';
const evidenceButton = item => `<button class="text-link evidence-link" id="evidence-${item.id}" data-evidence="${item.id}" aria-haspopup="dialog" aria-label="${item.id} ${item.category} 근거 보기">근거 보기 ${arrow}</button>`;

function header() {
  return `<a class="skip-link" href="#main">본문으로 바로가기</a>
  <header class="nav-shell"><div class="header-main wrap">
    <a class="brand" href="#main" aria-label="SPS 홈">${logo}<span class="brand-tagline">SEE THE POSSIBILITIES</span></a>
    <div class="nav-tools"><span class="locale">대한민국 · 한국어</span><a class="header-contact" href="#contact">관리 상담 안내 ${arrow}</a><button class="icon-button menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button></div></div>
    <nav class="nav wrap" aria-label="주 메뉴"><div class="nav-links" id="nav-links"><a href="#about">SPS 소개</a><a href="#services">서비스</a><a href="#report">보고 예시</a><a href="#guide">운영 가이드</a><a href="#faq">고객 지원</a></div><span class="nav-note">Spaces. People. Solutions.</span></nav>
  </header>`;
}

function intro() {
  return `<section class="opening wrap" aria-labelledby="opening-title">
    ${!isAfter ? '<img class="opening-image" src="../assets/jll/seoul.webp" alt="서울 전경 — 소개용 이미지" fetchpriority="high">' : ''}
    <div class="opening-title"><p class="kicker">Spaces. People. Solutions. <span>제공 계획</span></p><h1 id="opening-title">관리는 맡기고,<br>상황은 알고.</h1></div>
    <div class="opening-copy"><p>${content.promise}</p><a class="text-link" href="${isAfter ? '#report' : '#services'}">${isAfter ? '보고 방식 살펴보기' : 'SPS 서비스 살펴보기'} <span aria-hidden="true">↓</span></a></div>
    ${!isAfter ? '<span class="photo-caption">소개용 이미지 · 실제 관리 건물 아님</span>' : ''}
  </section>`;
}

function report() {
  return `<section class="report-section wrap" id="report" aria-labelledby="report-title">
    <div class="report-sheet">
      <div class="report-meta"><p class="kicker">관리 보고 예시</p><p class="sample-label">${content.sampleLabel}</p></div>
      <div class="report-heading"><div><p class="dateline">${content.building} <span>예시 기준 ${content.asOf}</span></p><h2 id="report-title">${content.summary}</h2></div>
      ${isAfter ? '<figure class="report-photo"><img src="../assets/jll/seoul.webp" alt="서울 전경 — 소개용 이미지"><figcaption>소개용 이미지 · 실제 관리 건물 아님</figcaption></figure>' : ''}</div>
      <div class="report-items">${content.records.map(item => `<article class="record" data-record="${item.id}"><div class="record-label"><span class="record-id">${item.id}</span><h3>${item.category}</h3><p>${item.location}</p></div><div class="record-status"><strong>${item.status}</strong><p><span>다음 확인</span> ${item.next}</p></div><div class="record-action">${evidenceButton(item)}</div></article>`).join('')}</div>
      <p class="report-plan">${content.reportPlan}</p>
    </div>
  </section>`;
}

function about() {
  return `<section class="about-section wrap" id="about"><div><p class="kicker section-kicker">SPS 소개</p><h2>맡긴 뒤의 막막함에서<br>시작했습니다.</h2></div><div class="about-text"><p>소장에게 관리를 맡겼지만 미납 규모를 알기 어려웠고, 시설 관리가 충분히 이루어지지 않는 문제를 겪었습니다.</p><p>그 경험을 바탕으로, 운영을 맡긴 뒤에도 건물의 현재와 남은 일을 이해할 수 있는 관리 방식을 준비합니다.</p><p class="small-note">설립자의 문제 경험입니다. 관리 개선 성과를 입증하는 사례는 아닙니다.</p><a class="text-link" href="#report">보고 방식 살펴보기 ${arrow}</a></div></section>`;
}

function services() {
  return `<section class="service-section" id="services"><div class="wrap section-title"><p class="kicker section-kicker">서비스 · 제공 계획</p><h2>우리 건물에 필요한 만큼,<br>맡길 범위를 정합니다.</h2><p>개별 포함 업무와 별도 업무는 상담에서 합의합니다.</p></div><div class="service-list">${content.services.map((item,i) => `<article class="scope-row ${i % 2 ? 'reverse' : ''}"><div class="scope-image"><img src="../assets/landing/${item.image}.jpg" alt="${item.alt}" loading="lazy"><p>소개용 이미지 · 실제 관리 건물 아님</p></div><div class="scope-copy"><p class="kicker section-kicker">${String(i+1).padStart(2,'0')} / SERVICE</p><h3>${item.title}</h3><p>${item.text}</p><a class="text-link" href="#faq-scope" data-faq="scope">포함 범위 확인 ${arrow}</a></div></article>`).join('')}</div></section>`;
}

function guide() {
  return `<section class="guide-section wrap" id="guide"><div><p class="kicker section-kicker">운영 가이드</p><h2>좋은 월간 리포트의 조건</h2><p>숫자의 모음에서 끝나지 않고, 다음 확인으로 이어지도록.</p></div><details class="guide-disclosure"><summary>운영 가이드 읽기 <span aria-hidden="true">+</span></summary><div><h3>같은 기준으로 비교하기</h3><p>수입과 지출을 같은 기준으로 정리하고, 일회성 비용과 반복 비용을 구분합니다.</p><h3>예외를 먼저 보여주기</h3><p>미납 내역, 계약 만료 예정, 미완료 보수처럼 확인이 필요한 항목을 따로 설명합니다.</p><h3>다음 행동으로 연결하기</h3><p>누가 무엇을 확인할지 적습니다. 일정이 정해지지 않았다면 미정이라고 표시합니다.</p></div></details></section>`;
}

function faq() {
  return `<section class="faq wrap" id="faq"><div><p class="kicker section-kicker">상담 전 확인할 내용</p><h2>궁금한 점을<br>먼저 살펴보세요.</h2></div><div class="faq-list">${content.faqs.map(item => `<details id="faq-${item.id}"><summary>${item.q}<span aria-hidden="true">+</span></summary><p>${item.a}</p></details>`).join('')}</div></section>`;
}

function contact() {
  return `<section class="decision-section wrap" id="contact"><div><p class="kicker section-kicker">관리 상담 안내</p><h2>무엇을 맡길지,<br>어떻게 확인할지.</h2><p class="decision-intro">상담에서 정할 범위와 절차를 살펴보세요.</p></div><div class="decision-content"><p class="price-line">${content.price}</p><p class="muted">${content.exclusions}</p><a class="text-link terms-link" href="#faq-price" data-faq="price">비용·조건 자세히 보기 ${arrow}</a><div class="cta-area"><button class="button button-dark" id="consultation-open" data-consult aria-haspopup="dialog">관리 상담 안내 <span aria-hidden="true">→</span></button><p class="small-note">절차 안내만 제공합니다.<br>이 페이지에서는 상담이 접수되지 않습니다.</p></div></div></section>`;
}

function footer() {
  return `<footer class="briefing-footer"><div class="wrap"><div class="footer-brand"><a class="brand" href="#main" aria-label="SPS 홈">${logo}</a><p>Spaces. People. Solutions.</p></div><div class="footer-links"><a href="#about">SPS 소개</a><a href="#services">서비스</a><a href="#report">보고 예시</a><a href="#faq">고객 지원</a><a href="#main">맨 위로 ↑</a></div><p class="footer-legal">© 2026 SPS. <span>대한민국 · 한국어</span></p></div></footer>`;
}

const sections = isAfter
  ? `${heroProposal ? heroProposal.intro() : intro()}${heroProposal ? heroProposal.reportLead() : ''}${report()}${heroProposal ? heroProposal.reportNext() : ''}${services()}${contact()}${faq()}${about()}${guide()}`
  : `${intro()}${about()}${services()}${guide()}${report()}${faq()}${contact()}`;
document.getElementById('app').innerHTML = `${header()}<main id="main">${sections}</main>${footer()}
  <dialog class="dialog briefing-dialog" id="evidence-dialog" aria-labelledby="evidence-heading"><div class="dialog-inner"></div></dialog>
  <dialog class="dialog briefing-dialog" id="consultation-dialog" aria-labelledby="consultation-heading"><div class="dialog-inner"></div></dialog>`;

const menuButton = document.querySelector('.menu-toggle');
const menu = document.getElementById('nav-links');
function closeMenu(restoreFocus = false) {
  const wasOpen = menu.classList.contains('open');
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false');
  menuButton.setAttribute('aria-label','메뉴 열기');
  if (restoreFocus && wasOpen) menuButton.focus({preventScroll:true});
}
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !document.querySelector('dialog[open]')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (link.dataset.faq) target.open = true;
  // Native anchors retain browser Back behavior; move keyboard reading context too.
  const focusTarget = target.matches('details') ? target.querySelector('summary') : target;
  if (!target.matches('details')) focusTarget.tabIndex = -1;
  requestAnimationFrame(() => focusTarget.focus({preventScroll:true}));
}));

// The same modal and restoration behavior is used on both sides of the comparison.
const returns = new WeakMap();
function openDialog(dialog, trigger, html) {
  closeMenu();
  returns.set(dialog,{trigger, x:window.scrollX, y:window.scrollY});
  dialog.querySelector('.dialog-inner').innerHTML = html;
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
  dialog.querySelector('[data-dialog-heading]').focus({preventScroll:true});
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-close]')) dialog.close();
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    const previous = returns.get(dialog);
    if (!previous) return;
    window.scrollTo({left:previous.x,top:previous.y,behavior:'instant'});
    previous.trigger?.focus({preventScroll:true});
  });
});

function evidence(item, trigger) {
  const dialog = document.getElementById('evidence-dialog');
  openDialog(dialog,trigger,`<div class="dialog-top"><p class="kicker">${content.building} / ${item.id}</p><button class="icon-button close-control" data-close aria-label="근거 닫기">×</button></div>
    <p class="sample-label">${content.sampleLabel}</p>
    <h2 id="evidence-heading" data-dialog-heading tabindex="-1">${item.category}<br>${item.status}</h2>
    <p class="detail-subtitle">${item.location} · ${item.id}</p><p class="detail-context">${content.summary}</p>
    <dl class="evidence-meta"><div><dt>예시 기준</dt><dd>${content.asOf}</dd></div><div><dt>출처</dt><dd>${item.note}</dd></div></dl>
    <section class="evidence-section"><h3>현재 확인된 내용</h3><p>${item.finding}</p></section>
    <aside class="missing-material"><strong>${item.missing}</strong><p>${item.caution}</p></aside>
    <section class="evidence-section"><h3>남은 확인</h3><p>${item.nextDetail}</p><p class="small-note">담당 역할: ${item.owner} · 처리 기한 미정</p></section>
    <div class="dialog-bottom"><button class="button button-dark" data-close>읽던 보고 예시로 돌아가기 <span aria-hidden="true">↩</span></button><p class="small-note">열람으로 금액이나 처리 상태가 바뀌지 않습니다.</p></div>`);
}
document.querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => evidence(content.records.find(item => item.id === button.dataset.evidence),button)));

document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => {
  openDialog(document.getElementById('consultation-dialog'),button,`<div class="dialog-top"><p class="kicker">SPS / 상담 절차</p><button class="icon-button close-control" data-close aria-label="상담 안내 닫기">×</button></div>
    <h2 id="consultation-heading" data-dialog-heading tabindex="-1">상담부터 관리까지,<br>이렇게 협의합니다.</h2><p class="dialog-lead">제공 계획에 따른 절차입니다. 실제 진행 조건은 상담에서 확인해야 합니다.</p>
    <p class="no-submission"><strong>상담이 신청된 것은 아닙니다.</strong>지금은 절차 안내만 볼 수 있습니다. 개인정보 입력, 전송, 예약은 이루어지지 않습니다.</p>
    <ol class="process-list">${content.steps.map(([title, description],i) => `<li><span class="process-number">${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${description}</p></div></li>`).join('')}</ol>
    <div class="consultation-terms"><p>${content.price}</p><p>${content.exclusions}</p><p>현장 진단 비용, 서비스 지역과 수용 가능한 건물 규모는 확정 전입니다.</p><p>${content.reportPlan}</p></div>
    <div class="dialog-bottom"><button class="button button-dark" data-close>안내 닫기 <span aria-hidden="true">↩</span></button></div>`);
}));

// Stage shortcuts are controlled only by the same-origin comparison page.
function navigatePreview(state) {
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  closeMenu();
  // Let modal close restoration finish before moving to a requested comparison state.
  requestAnimationFrame(() => {
    const target = {s1:'main',s2:'report',s3:'faq',s4:'contact'}[state];
    if (!target) return;
    const top = document.getElementById(target).getBoundingClientRect().top + window.scrollY;
    const inset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    // Scroll only this preview, never its comparison-page ancestors.
    window.scrollTo({top:Math.max(0,top-inset),behavior:'instant'});
    if (state === 's3') document.getElementById('faq-price').open = true;
    if (state === 's2') document.querySelector('[data-evidence="R-01"]').click();
    if (state === 's4') document.getElementById('consultation-open').click();
  });
}
window.addEventListener('message',event => {
  if (event.origin !== location.origin || event.source !== window.parent || event.source === window) return;
  if (event.data?.type === 'sps-preview-state') navigatePreview(event.data.state);
});
