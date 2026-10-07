(() => {
'use strict';
const catalog=window.SPS_G_SERVICES,hub=true;
  const serviceCards=(exclude)=>Object.entries(catalog).filter(([id])=>id!==exclude).map(([id,item],i)=>`<a class="f-service-choice" href="g-service.html?service=${id}" id="service-${id}"><div class="f-choice-image"><img src="${item.image}" alt="소개용 공간 이미지 · 실제 관리 건물 아님" loading="lazy"></div><div><span class="f-eyebrow">${item.english}</span><h2>${item.title}<span aria-hidden="true">↗</span></h2><p>${item.short}</p><span class="f-choice-action">이 서비스 살펴보기 →</span></div></a>`).join('');
  if(hub){
    document.querySelector('#f-detail').innerHTML=`<section class="f-hub-intro wrap"><p class="f-breadcrumb"><a href="g-home.html">SPS 홈</a> / 서비스 소개</p><p class="f-eyebrow">서비스 소개</p><h1>지금 가장 막히는 일부터,<br>맡길 범위를 찾아보세요.</h1><p>같은 건물이어도 필요한 관리는 다릅니다.<br>고민에 가까운 서비스를 선택해, 제공 방식과 조건을 살펴보세요.</p></section><section class="f-service-choices wrap" aria-label="서비스 선택">${serviceCards()}</section><section class="f-hub-note wrap"><p>서비스 범위에 따라 요금이 달라집니다. 개별 포함 업무와 비용은 상담 후 합의합니다.</p><p>소개용 이미지는 실제 관리 건물이나 실적을 나타내지 않습니다.</p><button class="f-button" data-f-consult>상담 신청 <span>↗</span></button></section>`;return;
  }
})();
