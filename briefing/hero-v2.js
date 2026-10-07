'use strict';
// A persuasion proposal, not a change to the adopted CONCEPT.md rules or shared facts.
window.SPS_HERO = {
  intro() {
    return `<section class="persuasion-hero" aria-labelledby="opening-title">
      <div class="persuasion-visual"><img src="../assets/landing/architecture.jpg" alt="하늘을 향해 선 건물 외관 — 소개용 이미지" fetchpriority="high"></div><span class="visual-caption">소개용 이미지 · 실제 관리 건물 아님</span>
      <div class="persuasion-inner wrap"><div class="persuasion-copy">
        <p class="hero-audience">건물주를 위한 운영·관리 대행 <span>제공 계획</span></p>
        <h1 id="opening-title">맡긴 건물,<br>지금 어떻게<br>관리되고 있나요?</h1>
        <p class="hero-promise">필요한 관리는 맡기고,<br>현재 상태와 다음 대응은 알 수 있도록.</p>
        <p class="hero-scope">시설·임차인 요청부터 미납·공실 관리까지. <br>운영 대행과 보고를 함께 제공하는 관리를 준비합니다.</p>
        <div class="hero-actions"><a class="button button-white" href="#contact">관리 상담 안내 <span aria-hidden="true">→</span></a><a class="hero-secondary" href="#report">보고 방식 보기 <span aria-hidden="true">↓</span></a></div>
        <p class="hero-condition">관리 범위와 요금은 상담 후 합의합니다.</p>
      </div>
      <aside class="report-preview" aria-labelledby="preview-heading">
        <div class="preview-heading"><p>맡긴 뒤에 확인할 것</p><span>보고 방식 · 제공 계획</span></div>
        <h2 id="preview-heading">지금 남아 있는 일부터,<br>다음 확인까지.</h2>
        <dl class="preview-points"><div><dt>현재 상태</dt><dd>어떤 일이 남아 있는지</dd></div><div><dt>확인 근거</dt><dd>무엇을 확인했고, 무엇이 부족한지</dd></div><div><dt>다음 대응</dt><dd>누가 무엇을 더 확인할지</dd></div></dl>
        <a class="text-link" href="#report">이렇게 보고합니다 · 예시 보기 <span aria-hidden="true">↗</span></a>
      </aside></div>
    </section>
    <section class="origin-note wrap" aria-label="SPS를 시작한 계기"><p class="origin-label">SPS를 시작한 이유</p><p>소장에게 맡겼지만, 미납 규모도 시설 상태도 알기 어려웠습니다.<br><span>설립자의 그 경험에서 출발한 관리 방식입니다.</span></p><a class="text-link" href="#about">우리의 출발점 <span aria-hidden="true">↗</span></a></section>`;
  },
  reportLead() {
    return `<section class="value-explanation wrap" aria-labelledby="value-heading"><div class="value-heading"><p class="kicker section-kicker">운영을 맡긴 뒤의 경험 · 제공 계획</p><h2 id="value-heading">일은 맡기되,<br>판단의 근거는 남도록.</h2><p>보고서의 모양보다 중요한 것은<br>무엇을 알게 되는가입니다.</p></div>
      <div class="value-points"><div><span class="value-index">01</span><div><h3>맡길 일부터 정합니다.</h3><p>시설·임차인 요청, 미납 대응, 임차 관리·공실 임대 중 필요한 업무와 책임 범위를 협의합니다.</p></div></div><div><span class="value-index">02</span><div><h3>상태와 남은 일을 구분합니다.</h3><p>확인 중인 금액을 0원으로, 일정 조율을 보수 완료로 표현하지 않는 보고 방식을 제안합니다.</p></div></div><div><span class="value-index">03</span><div><h3>궁금한 항목은 근거까지 봅니다.</h3><p>요약에서 관련 기록으로 들어가 확인하고, 다시 전체 상황으로 돌아옵니다.</p></div></div></div>
    </section><div class="report-introduction wrap"><p class="kicker section-kicker">보고 방식 살펴보기</p><h2>어떤 내용을 확인하는지,<br>예시로 살펴보세요.</h2><p>아래는 실제 건물이나 실적이 아닌 가상 예시입니다. 앱·월간 보고서의 이용 가능 여부와 제공 주기는 확정 전입니다.</p></div>`;
  },
  reportNext() {
    return `<div class="report-next wrap"><div><p>보고 방식을 살펴보셨다면,</p><strong>이제 우리 건물에 맡길 범위를 생각해 보세요.</strong></div><a class="button button-dark" href="#contact">상담 조건·비용 확인 <span aria-hidden="true">→</span></a></div>`;
  }
};
