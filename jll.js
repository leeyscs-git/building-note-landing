'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const slides = [
  { title: '더 나은 내일을 위한<br>부동산의 가능성을<br>열어갑니다.', description: '사람을 이해하고, 공간을 연결하고, 가치를 만들어갑니다.<br>당신의 부동산 파트너, SPS.', image: 'assets/jll/seoul.webp', alt: '노을이 내려앉은 서울의 도심과 남산 전경', cta: 'SPS 알아보기', target: 'about.html?from=b' },
  { title: '자산의 오늘을 읽고,<br>더 나은 내일을<br>준비합니다.', description: '시설부터 임차인, 매일의 운영 현황까지.<br>현장의 경험과 기술로 연결하는 자산관리.', image: 'assets/landing/architecture.jpg', alt: '도심에 서 있는 현대적인 오피스 빌딩', cta: '자산관리 솔루션 보기', target: '#services' },
  { title: '사람을 위한 공간,<br>함께 성장하는<br>새로운 가능성.', description: '사람을 이해하는 것에서 공간의 변화는 시작됩니다.<br>머물고 싶은 곳, 함께 성장하는 공간을 만듭니다.', image: 'assets/jll/spaces.webp', alt: '원목 계단과 녹지가 어우러진 개방적인 공간', cta: '공간의 가치 살펴보기', target: '#spaces' },
  { title: '새로운 관점으로,<br>부동산의 다음을<br>발견합니다.', description: '매일의 운영에서 미래의 공간까지.<br>당신의 선택에 깊이를 더하는 SPS 인사이트.', image: 'assets/landing/city.jpg', alt: '도시 속 빌딩과 거리의 전경', cta: '인사이트 살펴보기', target: '#insights' },
];
function closeMenu() { $('.nav-links').classList.remove('open'); $('.menu-toggle').setAttribute('aria-expanded', 'false'); $('.menu-toggle').setAttribute('aria-label', '메뉴 열기'); }
$('.menu-toggle').addEventListener('click', () => { const open = $('.nav-links').classList.toggle('open'); $('.menu-toggle').setAttribute('aria-expanded', String(open)); $('.menu-toggle').setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); });
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
const sectionObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) $$('.nav-links a').forEach(link => link.classList.toggle('current', link.hash === `#${entry.target.id}`)); }); }, { rootMargin: '-20% 0px -60% 0px' });
['about', 'services', 'spaces', 'insights'].forEach(id => sectionObserver.observe(document.getElementById(id)));

function openDialog(dialog) { closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (!$('dialog[open]')) document.body.classList.remove('modal-open'); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
});

const details = {
  management: { category: 'Property management', title: '건물의 일상을,<br>빈틈없이 관리합니다.', image: 'architecture', lead: '건물마다 다른 상황을 이해하고, 필요한 관리 업무를 하나로 연결합니다.', sections: [['시설과 유지보수', '정기 점검, 보수 이력, 협력업체 대응을 체계적으로 기록합니다. 문제가 발생한 뒤의 대응뿐 아니라, 미리 확인해야 할 항목을 함께 관리합니다.'], ['임차인 커뮤니케이션', '문의와 요청을 한곳에서 정리하고 처리 과정을 기록합니다. 반복되는 안내는 일관되게, 현장 판단이 필요한 요청은 담당자가 확인합니다.'], ['운영 현황의 가시화', '월별 수입·지출과 미수금, 시설 이슈를 정리해 자산의 현재 상태를 쉽게 파악할 수 있도록 돕습니다.']] },
  leasing: { category: 'Leasing & operations', title: '공간과 사람의,<br>더 좋은 만남을 만듭니다.', image: 'workplace', lead: '공간의 특성과 임차인의 필요를 함께 살펴, 안정적인 운영의 방향을 찾습니다.', sections: [['공간의 강점 발견', '입지, 동선, 시설 상태와 주변 환경을 정리해 공간에 어울리는 임대 방향을 검토합니다.'], ['계약과 일정 관리', '입·퇴실, 계약 갱신, 정기 안내 등 놓치기 쉬운 일정을 체계적으로 관리합니다.'], ['머무는 경험 개선', '임차인의 의견에서 운영 개선점을 찾고, 공용 공간과 일상 서비스의 만족도를 살펴봅니다.']] },
  technology: { category: 'Technology & insights', title: '반복은 가볍게,<br>판단은 더 명확하게.', image: 'city', lead: '기술의 목적은 복잡함을 더하는 것이 아니라, 더 중요한 일에 집중할 시간을 만드는 것입니다.', sections: [['반복 업무 정리', '검침, 청구, 입금 확인처럼 반복되는 흐름을 정리하고 자동화할 수 있는 지점을 찾습니다.'], ['하나로 이어지는 기록', '흩어진 계약 정보와 운영 내역을 연결해 담당자가 바뀌어도 건물의 이력이 이어지도록 합니다.'], ['의사결정을 위한 데이터', '월별 변동과 예외 항목을 한눈에 볼 수 있게 정리합니다. 데이터는 현장의 판단을 보완하는 도구로 활용합니다.']] },
  spaces: { category: 'People at the heart', title: '좋은 공간의 기준은,<br>그 안의 사람입니다.', image: 'interior', lead: '공간을 관리한다는 것은 그곳의 하루를 살피는 일입니다.', sections: [['편안하게 머무는 곳', '적절한 빛과 온도, 쾌적한 공용 공간, 불편함에 대한 빠른 응대. 작은 경험이 모여 좋은 공간을 만듭니다.'], ['신뢰가 쌓이는 운영', '임대인에게는 투명한 현황을, 임차인에게는 명확한 안내를 제공합니다. 서로의 기대를 이해하면 운영도 더 단단해집니다.'], ['오늘을 넘어 내일로', '눈앞의 문제 해결과 함께 장기적인 유지관리 관점에서 공간을 바라봅니다. 오래 쓰일수록 좋은 공간을 지향합니다.']] },
  report: { category: '운영 가이드 · 5 min read', title: '좋은 월간 리포트의 조건', image: 'city', lead: '운영 리포트는 숫자의 모음에서 끝나지 않아야 합니다. 현재를 이해하고 다음 달의 우선순위를 정할 수 있어야 합니다.', sections: [['01. 같은 기준으로 비교하기', '수입과 지출 항목을 일관되게 분류하세요. 전월과 다른 지출은 일회성인지 반복될 비용인지 구분하면 변화의 이유를 이해하기 쉽습니다.'], ['02. 예외를 먼저 보여주기', '미수금, 계약 만료 예정, 미완료 시설 보수처럼 확인이 필요한 항목을 별도로 정리하세요. 모든 내역을 읽지 않아도 중요한 현황을 확인할 수 있습니다.'], ['03. 다음 행동으로 연결하기', '항목별 담당자와 확인 일정을 적어두세요. “누가 언제 무엇을 확인하는지”가 명확하면 기록이 실행으로 이어집니다.']] },
  workplace: { category: '공간 이야기 · 4 min read', title: '다시 찾고 싶은 오피스는<br>무엇이 다를까요?', image: 'workplace', lead: '화려한 인테리어보다 중요한 것은 그 공간에서 보내는 하루의 경험입니다.', sections: [['집중과 연결의 균형', '집중이 필요한 업무와 대화가 필요한 업무는 서로 다른 환경을 요구합니다. 공간을 사용하는 사람의 흐름부터 관찰해 보세요.'], ['작지만 반복되는 불편', '회의실 예약, 온도 조절, 소음처럼 매일 겪는 작은 불편을 정리해 보세요. 자주 발생하는 요청부터 개선하면 변화를 체감하기 쉽습니다.'], ['의견이 반영되는 공간', '새로운 공간을 만든 뒤에도 사용자의 의견을 듣고 조정해야 합니다. 좋은 오피스는 완성된 결과물이면서, 계속 자라는 과정입니다.']] },
  automation: { category: '운영 가이드 · 6 min read', title: '작은 반복을 줄이면,<br>더 큰 가능성이 보입니다.', image: 'architecture', lead: '건물 운영을 바꾸는 첫 단계는 큰 시스템을 도입하는 일이 아니라, 반복되는 업무를 명확히 이해하는 일입니다.', sections: [['01. 반복 업무를 적어보기', '매주, 매월 수행하는 검침과 안내, 청구 업무를 나열하세요. 시작 시점, 필요한 정보, 완료 조건을 함께 정리합니다.'], ['02. 기준부터 통일하기', '서로 다른 양식과 파일 이름을 통일하고 누락을 확인하는 방법을 정하세요. 데이터가 일관되어야 자동화도 안정적으로 작동합니다.'], ['03. 예외에는 사람의 판단을', '자동화는 정해진 규칙에 강하지만 예상 밖의 상황에는 한계가 있습니다. 금액 차이, 특이 요청 등 예외를 담당자가 확인하는 절차를 남겨두세요.']] },
};
function showDetail(key) {
  const item = details[key];
  if (!item) return;
  $('#detail-content').innerHTML = `<img class="dialog-image" src="assets/landing/${item.image}.jpg" alt="${item.category}"><p class="eyebrow"><span></span>${item.category}</p><h2 id="detail-heading">${item.title}</h2><p class="dialog-lead">${item.lead}</p>${item.sections.map(([title, text]) => `<section class="dialog-section"><h3>${title}</h3><p>${text}</p></section>`).join('')}<a class="button button-dark" href="#contact" data-close-detail>우리 건물에 맞는 방향 찾기 <span>↗</span></a>`;
  $('#detail-dialog').setAttribute('aria-labelledby', 'detail-heading');
  $('[data-close-detail]').addEventListener('click', () => $('#detail-dialog').close());
  openDialog($('#detail-dialog'));
  $('#detail-dialog').scrollTop = 0;
}
$$('[data-detail]').forEach(button => button.addEventListener('click', () => showDetail(button.dataset.detail)));
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(filter => { const selected = filter === button; filter.classList.toggle('active', selected); filter.setAttribute('aria-pressed', String(selected)); });
  $$('.insight-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
}));

const searchItems = [
  { title: 'SPS 소개 — 공간의 가능성을 연결합니다', tags: '소개 회사 sps 가치', href: 'about.html?from=b' },
  { title: '자산관리 — 시설·임차인·운영 리포트', tags: '서비스 자산관리 시설 건물 빌딩 관리', detail: 'management' },
  { title: '임대 운영 — 공간과 사람을 연결합니다', tags: '서비스 임대 임차 계약 공실', detail: 'leasing' },
  { title: '스마트 운영 — 기술과 데이터', tags: '서비스 스마트 운영 기술 데이터 자동화 ai', detail: 'technology' },
  { title: '공간 이야기 — 다시 찾고 싶은 오피스', tags: '인사이트 공간 오피스 사람', detail: 'workplace' },
  { title: '운영 가이드 — 좋은 월간 리포트의 조건', tags: '인사이트 월간 리포트 수입 지출', detail: 'report' },
  { title: '우리 건물 진단하기', tags: '문의 상담 진단 건물', href: '#contact' },
];
function renderSearch() {
  const query = $('#site-search').value.trim().toLocaleLowerCase();
  const matches = searchItems.filter(item => `${item.title} ${item.tags}`.toLocaleLowerCase().includes(query));
  const results = $('#search-results');
  results.replaceChildren();
  if (!matches.length) { const empty = document.createElement('p'); empty.className = 'search-empty'; empty.textContent = '검색 결과가 없습니다. “자산관리”, “공간”, “진단”으로 다시 검색해 보세요.'; results.append(empty); return; }
  matches.forEach(item => { const button = document.createElement('button'); button.className = 'search-result'; const label = document.createElement('span'); label.textContent = item.title; const arrow = document.createElement('span'); arrow.textContent = '↗'; button.append(label, arrow); button.addEventListener('click', () => { $('#search-dialog').close(); if (item.detail) showDetail(item.detail); else if (item.href.startsWith('#')) location.hash = item.href; else window.top.location.href = item.href; }); results.append(button); });
}
$('.search-toggle').addEventListener('click', () => { $('#site-search').value = ''; renderSearch(); openDialog($('#search-dialog')); $('#site-search').focus(); });
$('#site-search').addEventListener('input', renderSearch);

const priorities = {
  management: { label: '시설 관리와 임차인 응대', title: '안정적인 일상 관리부터 시작해 보세요.', items: ['시설 점검 항목과 최근 보수 이력을 한곳에 정리하세요.', '임차인 문의 창구를 통일하고 요청별 처리 상태를 기록하세요.', '긴급 상황의 연락망과 대응 순서를 미리 확인하세요.'] },
  leasing: { label: '임대 일정과 공실 관리', title: '계약과 공간의 현황을 먼저 살펴보세요.', items: ['호실별 계약 만료일과 입·퇴실 일정을 달력으로 정리하세요.', '공실의 시설 상태와 주변 공간 대비 차별점을 확인하세요.', '임차인의 반복 요청을 살펴 개선할 운영 항목을 정하세요.'] },
  technology: { label: '반복 업무와 운영 현황', title: '반복 업무를 연결하는 것부터 시작해 보세요.', items: ['매달 반복되는 검침·청구·입금 확인의 흐름을 적어보세요.', '운영 파일의 양식과 항목 이름을 일관되게 정리하세요.', '자동 처리할 항목과 담당자가 확인할 예외를 구분하세요.'] },
};
function renderDiagnose() {
  $('#diagnose-content').innerHTML = `<p class="eyebrow"><span></span>Your next possibility</p><h2 id="diagnose-heading">우리 건물의 관리 방향,<br>함께 찾아볼까요?</h2><p class="dialog-lead">3가지 질문으로 우선 확인할 항목을 알아보세요.<br>개인 정보를 입력하지 않아도 됩니다.</p><form id="diagnose-form"><label class="field">01. 어떤 공간인가요?<select name="type" required><option value="">건물 유형 선택</option><option>오피스·업무시설</option><option>상가·근린생활시설</option><option>주거·복합 건물</option></select></label><label class="field">02. 관리하는 공간의 규모는 어느 정도인가요?<select name="size" required><option value="">관리 호실 수 선택</option><option>10개 이하</option><option>11–30개</option><option>31개 이상</option></select></label><label class="field">03. 가장 고민되는 부분은 무엇인가요?<select name="priority" required><option value="">관리 고민 선택</option>${Object.entries(priorities).map(([key,item]) => `<option value="${key}">${item.label}</option>`).join('')}</select></label><button class="button button-dark" type="submit">나에게 맞는 관리 방향 보기 <span>↗</span></button><p class="dialog-footnote">선택한 정보는 서버에 전송하거나 저장하지 않습니다.</p></form>`;
  $('#diagnose-dialog').setAttribute('aria-labelledby', 'diagnose-heading');
  $('#diagnose-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const priority = priorities[data.get('priority')];
    const sizeTip = data.get('size') === '10개 이하' ? '간단한 점검표와 운영 캘린더부터 만들어 보세요. 적은 항목이라도 꾸준히 기록하는 것이 중요합니다.' : data.get('size') === '11–30개' ? '호실별 기록을 표준화하고 월별 운영 현황을 통합해 보세요. 담당자별 역할을 구분하면 누락을 줄일 수 있습니다.' : '여러 담당자가 같은 기준으로 기록할 수 있도록 업무 절차와 접근 권한을 정리하세요. 전체 현황과 예외를 나눠 살펴보는 체계가 도움이 됩니다.';
    $('#diagnose-content').innerHTML = `<p class="eyebrow"><span></span>Your starting point</p><h2 id="diagnose-heading">${priority.title}</h2><div class="diagnose-summary"><strong>${data.get('type')} · ${data.get('size')}</strong>${priority.label} 중심의 관리 가이드</div><section class="dialog-section"><h3>먼저 확인할 3가지</h3><ol class="result-list">${priority.items.map(item => `<li>${item}</li>`).join('')}</ol></section><section class="dialog-section"><h3>규모에 맞는 시작</h3><p>${sizeTip}</p></section><p class="dialog-footnote">선택한 답변을 바탕으로 한 일반적인 운영 가이드입니다. 실제 관리 범위는 건물 현황에 따라 달라질 수 있습니다.</p><div class="diagnose-actions"><button class="button button-dark" id="diagnose-service">관련 서비스 살펴보기 <span>↗</span></button><button class="text-link" id="diagnose-reset">다시 진단하기 <span>↻</span></button></div>`;
    $('#diagnose-service').addEventListener('click', () => { $('#diagnose-dialog').close(); showDetail(data.get('priority')); });
    $('#diagnose-reset').addEventListener('click', () => { renderDiagnose(); $('#diagnose-dialog').scrollTop = 0; $('#diagnose-heading').tabIndex = -1; $('#diagnose-heading').focus(); });
    $('#diagnose-dialog').scrollTop = 0;
    $('#diagnose-heading').tabIndex = -1;
    $('#diagnose-heading').focus();
  });
}
$$('[data-diagnose]').forEach(button => button.addEventListener('click', () => { renderDiagnose(); openDialog($('#diagnose-dialog')); }));
