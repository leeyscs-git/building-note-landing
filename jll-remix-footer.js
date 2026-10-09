/* Shared SPS footer and business details. Page-specific notes remain in the host. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.SPSFooter=api;api.mount(root);}
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const arrow='<sps-arrow-up-right></sps-arrow-up-right>';
  // Transcribed from the business registration certificate supplied by the user.
  const company=Object.freeze({
    name:'주식회사 신의프라퍼티솔루션',
    representative:'이영수',
    registration:'219-87-04014',
    address:'서울특별시 동대문구 장한로 85, 20층 2007호 (장안동, 장안현대벤처빌)'
  });
  function companyDetails(includeName=false){
    const rows=[...(includeName?[['상호',company.name]]:[]),['대표자',company.representative],['사업자등록번호',company.registration],['주소',company.address]];
    return `<dl class="sps-company-details">${rows.map(([label,value])=>`<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
  }
  function routes(win){
    const doc=win.document;
    const header=doc.querySelector('[data-sps-header]');
    const variant=doc.documentElement.dataset.serviceMenu;
    const prefix=['v2','v3','v4'].includes(variant)?'jll-remix-'+variant:'jll-remix';
    return {
      home:header?.dataset.homeHref||prefix+'.html',
      about:header?.dataset.aboutHref||prefix+'-about.html',
      insights:header?.dataset.journalHref||'jll-remix-journal-v2.html',
      top:doc.getElementById('main')?'#main':'#overview'
    };
  }
  function markup(paths,year){
    const link=(href,label)=>`<a href="${escape(href)}" target="_top">${label}</a>`;
    return `<div class="sps-footer-inner">
      <div class="sps-footer-lead">
        <h2 class="sps-footer-statement">공간을 이해합니다.<br>가능성을 연결합니다.</h2>
        <a class="sps-footer-consult" href="jll-remix-support.html#inquiry" data-inquiry aria-haspopup="dialog">상담·견적 문의 ${arrow}</a>
      </div>
      <div class="sps-footer-directory">
        <div class="sps-footer-company">
          <a class="sps-footer-logo" href="${escape(paths.home)}" target="_top" aria-label="SPS 홈"><img src="assets/logo.svg" alt="SPS" width="120" height="40" loading="lazy"></a>
          <p>${escape(company.name)}</p>
          <a class="sps-footer-phone" href="tel:0222475799"><span>대표전화</span>02 2247 5799</a>
          ${companyDetails()}
        </div>
        <nav class="sps-footer-nav" aria-label="하단 메뉴">
          <div class="sps-footer-group"><h3>서비스</h3>
            ${link('jll-remix.html?service=management#services','부동산 자산관리')}
            ${link('jll-remix.html?service=marketing#services','임대 마케팅')}
            ${link('jll-remix.html?service=interior#services','실내건축')}
          </div>
          <div class="sps-footer-group"><h3>SPS 알아보기</h3>
            ${link(paths.about,'SPS 소개')}
            ${link('jll-remix-cases.html','서비스 사례')}
            ${link(paths.insights,'인사이트')}
          </div>
          <div class="sps-footer-group"><h3>고객지원</h3>
            ${link('jll-remix-support.html','고객지원 안내')}
            ${link('jll-remix-support.html#questions','자주 묻는 질문')}
            ${link('jll-remix-about.html#credentials','등록·면허 자료')}
          </div>
        </nav>
      </div>
      <div class="sps-footer-bottom">
        <p>© ${escape(year)} SPS. All rights reserved.</p>
        <a class="sps-footer-top" href="${escape(paths.top)}" data-footer-top>맨 위로 <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M10 16V4m-6 6 6-6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </div>
    </div>`;
  }
  function mount(win){
    const doc=win.document;
    doc.querySelectorAll('[data-sps-company-details]').forEach(host=>{host.innerHTML=companyDetails(true);});
    const hosts=[...doc.querySelectorAll('[data-sps-footer]')].filter(host=>!host.hasAttribute('data-footer-ready'));
    if(!hosts.length)return;
    const paths=routes(win);
    hosts.forEach(host=>{
      const notes=[...host.querySelectorAll('[data-footer-note]')];
      host.innerHTML=markup(paths,new Date().getFullYear());
      const inner=host.querySelector('.sps-footer-inner');
      notes.forEach(note=>inner.append(note));
      host.setAttribute('data-footer-ready','');
      host.querySelector('[data-footer-top]').addEventListener('click',event=>{
        if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        event.preventDefault();
        win.scrollTo({top:0,behavior:win.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
        const firstLink=doc.querySelector('[data-sps-header] .brand, .ds-top a');
        firstLink?.focus({preventScroll:true});
      });
    });
    // About variants scope foundation edits to the header; share those values here too.
    if(doc.body.dataset.themeScope==='header'){
      const source=doc.querySelector('[data-sps-header]');
      function syncTheme(){
        const style=win.getComputedStyle(source);
        hosts.forEach(host=>(win.SPSThemeSchema||[]).forEach(field=>{
          const value=style.getPropertyValue(field.token);
          if(value.trim())host.style.setProperty(field.token,value);
          else host.style.removeProperty(field.token);
        }));
      }
      win.addEventListener('sps-theme-change',syncTheme);
      syncTheme();
    }
  }
  return {routes,markup,mount,company,companyDetails};
});
