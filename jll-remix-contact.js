/* Shared, browser-only inquiry. No submission endpoint or persistent PII storage. */
(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else model.mount();
})(typeof window === 'undefined' ? this : window, function () {
  'use strict';
  const services = { undecided:'상담 후 결정', management:'부동산 자산관리', marketing:'임대 마케팅', interior:'실내건축', documents:'등록·면허 자료 문의' };
  const inquiryTypes = { consultation:'상담 문의', quote:'견적 문의' };
  const usages = { unknown:'상담 시 확인', office:'업무시설', retail:'상가·근린생활시설', residential:'주거시설', mixed:'복합용도', other:'기타' };
  const situations = {
    operation:{ service:'management', label:'건물 운영 위탁', title:'건물 운영을 함께 정리해 볼까요?', example:'관리를 맡기고 있는데, 매달 어떤 일이 처리됐는지 확인하기 어렵습니다.' },
    arrears:{ service:'management', label:'임대료·미납 내역 정리', title:'미납 현황부터 함께 살펴볼까요?', example:'미납이 있는 것 같은데, 정확한 금액부터 정리하고 싶습니다.' },
    vacancy:{ service:'marketing', label:'공실의 임차인 유치', title:'공실 문제를 상담하고 싶으시군요.', example:'공실이 오래됐는데 임대조건을 어떻게 조정해야 할지 모르겠습니다.' },
    interior:{ service:'interior', label:'오래된 공간 개선', title:'어떤 공간을 바꾸고 싶으신가요?', example:'건물 전체가 아니라, 공용부만 개선할 수 있을까요?' }
  };
  // Entry changes context without replacing a draft the visitor has already written.
  function applyEntry(data, entry = {}) {
    const next = { ...data, type:inquiryTypes[data.type] ? data.type : 'consultation' };
    const situation = situations[entry.situation];
    if (situation) { next.situation=entry.situation;next.service=situation.service; }
    else if (services[entry.service]) { next.service=entry.service;next.situation=''; }
    if (inquiryTypes[entry.type]) next.type=entry.type;
    if (!next.message?.trim() && entry.example && situation) next.message=situation.example;
    return next;
  }
  function validate(data) {
    const errors = {};
    if (!data.name?.trim()) errors.name = '성함 또는 담당자명을 입력해 주세요.';
    const contact = data.contact?.trim() || '';
    if (data.method === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) errors.contact = '이메일 주소를 확인해 주세요. 예: name@example.com';
    } else if (!/^[+\d\s()-]+$/.test(contact) || contact.replace(/\D/g,'').length < 7 || contact.replace(/\D/g,'').length > 15) {
      errors.contact = '연락받을 전화번호를 입력해 주세요. 숫자, 공백, 하이픈을 사용할 수 있습니다.';
    }
    if (!data.message?.trim()) errors.message = '현재 고민이나 문의하실 내용을 적어 주세요.';
    return errors;
  }
  function rows(data) {
    const result = [['문의 유형',inquiryTypes[data.type] || inquiryTypes.consultation],['상담 주제',services[data.service] || services.undecided]];
    const situation=situations[data.situation];
    if (situation?.service===data.service) result.push(['선택한 상황',situation.label]);
    result.push(['성함·담당자',data.name.trim()],[data.method==='email'?'이메일':'전화번호',data.contact.trim()],['건물 위치',data.location?.trim() || '상담 시 확인']);
    if (data.type==='quote') result.push(['건물 용도',usages[data.usage] || usages.unknown],['대략적인 규모',data.scale?.trim() || '상담 시 확인'],['희망 업무',data.scope?.trim() || '상담 시 확인']);
    result.push(['문의 내용',data.message.trim()]);
    return result;
  }
  function summarize(data) {
    return '주식회사 신의프라퍼티솔루션 · 상담·견적 준비 내용\n아직 접수되지 않은 작성 내용입니다.\n\n' + rows(data).map(([label,value]) => `${label}: ${value}`).join('\n');
  }
  function mount() {
    if (document.getElementById('sps-inquiry')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'sps-inquiry';
    dialog.className = 'sps-inquiry';
    dialog.dataset.spsFoundation = '';
    dialog.setAttribute('aria-labelledby','inquiry-title');
    dialog.setAttribute('aria-describedby','inquiry-notice');
    dialog.innerHTML = `
      <div class="inquiry-top"><p>SPS · 상담·견적 문의</p><button type="button" class="inquiry-close" aria-label="문의 창 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
      <div class="inquiry-grid"><aside class="inquiry-aside"><p class="eyebrow">LET’S TALK</p><h2 id="inquiry-title" tabindex="-1">지금의 고민을<br> 들려주세요.</h2><p id="inquiry-context-help">어떤 업무를 맡길지 몰라도 괜찮습니다. 현재 어려운 일부터 함께 정리합니다.</p><ol class="inquiry-progress" aria-label="문의 작성 단계"><li aria-current="step"><span>01</span> 내용 작성</li><li><span>02</span> 내용 확인</li></ol><a class="inquiry-phone" href="tel:0222475799">02 2247 5799 <sps-arrow-up-right></sps-arrow-up-right></a></aside>
      <div class="inquiry-panel"><p class="inquiry-notice" id="inquiry-notice">온라인 접수 준비 중입니다. 입력 내용은 전송되지 않습니다. 내용을 확인·복사한 뒤 전화 상담으로 이어가실 수 있습니다.</p>
        <form id="inquiry-form" novalidate>
          <input type="hidden" name="situation" id="inquiry-situation" value="">
          <fieldset class="inquiry-kind"><legend>어떤 문의를 준비할까요?</legend><div class="inquiry-kind-options">
            <label><input type="radio" name="type" value="consultation" checked><span><strong>상담 문의</strong><small>맡길 일을 함께 정리하고 싶어요.</small></span></label>
            <label><input type="radio" name="type" value="quote"><span><strong>견적 문의</strong><small>업무 범위와 비용을 알고 싶어요.</small></span></label>
          </div></fieldset>
          <p class="inquiry-context-status" id="inquiry-context-status" role="status" hidden></p>
          <div class="inquiry-error-summary" id="inquiry-errors" role="alert" hidden><p>입력 내용을 확인해 주세요.</p><ul></ul></div>
          <div class="inquiry-fields">
            <div class="inquiry-field"><label for="inquiry-service">상담 주제 <span>선택</span></label><span class="sps-select"><select id="inquiry-service" name="service">${Object.entries(services).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select><sps-chevron></sps-chevron></span></div>
            <div class="inquiry-pair"><div class="inquiry-field"><label for="inquiry-name">성함 또는 담당자명 <span>필수</span></label><input id="inquiry-name" name="name" autocomplete="name" maxlength="60" required aria-describedby="inquiry-name-error"><p class="inquiry-error" id="inquiry-name-error" hidden></p></div><div class="inquiry-field"><label for="inquiry-location">건물 위치 <span>선택</span></label><input id="inquiry-location" name="location" placeholder="시·구 정도로 적어 주세요" maxlength="120" autocomplete="off"></div></div>
            <fieldset class="inquiry-field inquiry-contact-field"><legend>연락받을 방법 · 필수</legend><div class="inquiry-method"><label><input type="radio" name="method" value="phone" checked> 전화</label><label><input type="radio" name="method" value="email"> 이메일</label></div><label for="inquiry-contact" id="inquiry-contact-label">전화번호 <span>필수</span></label><input id="inquiry-contact" name="contact" type="tel" inputmode="tel" autocomplete="tel" placeholder="010 0000 0000" maxlength="120" required aria-describedby="inquiry-contact-error"><p class="inquiry-error" id="inquiry-contact-error" hidden></p></fieldset>
            <fieldset class="inquiry-quote" id="inquiry-quote" hidden disabled><legend>견적을 위한 건물 정보 <span>선택</span></legend><p>모르는 항목은 비워두셔도 됩니다. 건물 위치는 위 입력란에 적어 주세요.</p>
              <div class="inquiry-pair">
                <div class="inquiry-field"><label for="inquiry-usage">건물 용도</label><span class="sps-select"><select name="usage" id="inquiry-usage"><option value="unknown">잘 모르겠어요</option><option value="office">업무시설</option><option value="retail">상가·근린생활시설</option><option value="residential">주거시설</option><option value="mixed">복합용도</option><option value="other">기타</option></select><sps-chevron></sps-chevron></span></div>
                <div class="inquiry-field"><label for="inquiry-scale">대략적인 규모</label><input id="inquiry-scale" name="scale" maxlength="100" placeholder="예: 지상 5층, 연면적 약 300평"></div>
              </div>
              <div class="inquiry-field"><label for="inquiry-scope">희망 업무</label><input id="inquiry-scope" name="scope" maxlength="300" placeholder="예: 시설 점검과 공용부 보수"></div>
              <p class="inquiry-quote-note">비용은 건물 현황과 요청 업무를 확인한 뒤 안내합니다. 문의 작성만으로 계약이나 비용이 확정되지는 않습니다.</p>
            </fieldset>
            <div class="inquiry-field"><label for="inquiry-message">문의 내용 <span>필수</span></label><textarea id="inquiry-message" name="message" rows="4" maxlength="2000" placeholder="예: 관리를 맡기고 있지만 미납 현황과 시설 처리 상황을 파악하기 어렵습니다." required aria-describedby="inquiry-message-help inquiry-message-error"></textarea><p id="inquiry-message-help" class="inquiry-status" style="margin:0;font-size:12px">계좌번호·주민등록번호 등 민감한 정보는 적지 마세요. 최대 2,000자.</p><p class="inquiry-error" id="inquiry-message-error" hidden></p></div>
          </div>
          <div class="inquiry-actions"><button type="submit" class="button">문의 내용 확인 <sps-arrow-up-right></sps-arrow-up-right></button></div>
        </form>
        <section class="inquiry-review" id="inquiry-review" aria-labelledby="inquiry-review-title" hidden><h3 id="inquiry-review-title" tabindex="-1">작성한 내용을 확인해 주세요.</h3><button type="button" class="inquiry-text-button" id="inquiry-edit">내용 수정하기</button><dl id="inquiry-summary"></dl><div class="inquiry-local-note"><strong>아직 접수되지 않았습니다.</strong>담당자에게 전달되지 않은 내용입니다. 아래에서 내용을 복사해 두거나 전화로 상담해 주세요.</div><div class="inquiry-actions"><button type="button" class="button" id="inquiry-copy">문의 내용 복사 <span aria-hidden="true">↗</span></button><a class="inquiry-text-button" href="tel:0222475799">전화로 상담하기</a></div><p class="inquiry-status" id="inquiry-copy-status" role="status"></p><div class="inquiry-field" id="inquiry-copy-fallback" hidden><label for="inquiry-copy-text">복사할 문의 내용</label><textarea id="inquiry-copy-text" readonly rows="6"></textarea></div></section>
        <div class="inquiry-clear"><p>창을 닫아도 이 페이지에서는 입력 내용이 유지됩니다.<br>새로고침하거나 페이지를 이동하면 지워집니다.</p><button type="button" class="inquiry-text-button" id="inquiry-reset-request">입력 지우기</button></div>
        <div class="inquiry-discard" id="inquiry-discard" hidden><p>작성한 내용을 모두 지울까요?</p><div class="inquiry-actions"><button class="inquiry-text-button" type="button" id="inquiry-reset-cancel">계속 작성하기</button><button class="button" type="button" id="inquiry-reset-confirm">모두 지우기</button></div></div>
      </div></div>`;
    document.body.append(dialog);
    const $ = selector => dialog.querySelector(selector);
    const form = $('#inquiry-form');
    let opener, snapshot;
    let contactMethod = 'phone';
    const contacts = {phone:'',email:''};
    function syncTheme() {
      const source = document.body.dataset.themeScope === 'header' ? document.querySelector('[data-sps-header]') : document.documentElement;
      const computed = getComputedStyle(source);
      document.querySelectorAll('[data-sps-foundation]').forEach(scope => {
        (window.SPSThemeSchema || []).forEach(field => {
          const value = computed.getPropertyValue(field.token);
          if (value.trim()) scope.style.setProperty(field.token,value);
          else scope.style.removeProperty(field.token);
        });
      });
    }
    window.addEventListener('sps-theme-change',syncTheme);
    syncTheme();
    function read() { return Object.fromEntries(new FormData(form)); }
    function syncContext() {
      const service=$('#inquiry-service').value;
      let situation=situations[$('#inquiry-situation').value];
      if (situation && situation.service!==service) { $('#inquiry-situation').value='';situation=null; }
      const quote=form.elements.type.value==='quote';
      $('#inquiry-quote').hidden=!quote;
      $('#inquiry-quote').disabled=!quote;
      $('#inquiry-title').textContent=situation?.title || (quote?'필요한 업무와 비용을 알아보세요.':'지금의 고민을 들려주세요.');
      $('#inquiry-context-help').textContent=situation ? '선택한 서비스: '+services[service]+'. 건물 위치와 현재 고민을 알려주세요. 자세한 조건은 상담하면서 확인합니다.' : '어떤 업무를 맡길지 몰라도 괜찮습니다. 현재 어려운 일부터 함께 정리합니다.';
      $('#inquiry-message').placeholder=situation?.example || '현재 고민과 상담에서 확인하고 싶은 내용을 알려주세요.';
    }
    $('#inquiry-service').addEventListener('change',()=>{ syncContext();$('#inquiry-context-status').hidden=true; });
    dialog.querySelectorAll('[name=type]').forEach(radio=>radio.addEventListener('change',syncContext));
    function clearErrors() {
      $('#inquiry-errors').hidden = true;
      $('#inquiry-errors ul').replaceChildren();
      dialog.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      dialog.querySelectorAll('.inquiry-error').forEach(error => { error.hidden=true;error.textContent=''; });
    }
    function setStage(review) {
      form.hidden = review;
      $('#inquiry-review').hidden = !review;
      $('#inquiry-discard').hidden = true;
      dialog.querySelectorAll('.inquiry-progress li').forEach((step,index) => {
        if (index === Number(review)) step.setAttribute('aria-current','step'); else step.removeAttribute('aria-current');
      });
    }
    function focusTop(element) { dialog.scrollTop=0;element.focus({preventScroll:true}); }
    function open(trigger) {
      opener = trigger;
      window.SPSHeader?.close();
      document.querySelectorAll('dialog[open]').forEach(other => { if(other!==dialog)other.close(); });
      const previous=read();
      const next=applyEntry(previous, {
        service:trigger?.dataset.inquiryService, situation:trigger?.dataset.inquirySituation,
        type:trigger?.dataset.inquiryType, example:trigger?.hasAttribute('data-inquiry-example')
      });
      const contextChanged=next.service!==previous.service || next.situation!==previous.situation || next.type!==previous.type;
      $('#inquiry-service').value=next.service;
      $('#inquiry-situation').value=next.situation || '';
      form.elements.type.value=next.type;
      $('#inquiry-message').value=next.message || '';
      $('#inquiry-context-status').hidden=!(contextChanged && previous.message?.trim());
      $('#inquiry-context-status').textContent='이전에 작성한 내용은 유지했습니다. 선택한 주제에 맞게 확인해 주세요.';
      if(contextChanged || trigger?.hasAttribute('data-inquiry-example')) { clearErrors();setStage(false); }
      syncContext();
      syncTheme();
      dialog.showModal();
      document.body.classList.add('sps-inquiry-open');
      focusTop(form.hidden ? $('#inquiry-review-title') : $('#inquiry-title'));
    }
    document.addEventListener('click',event => {
      const trigger = event.target.closest('[data-inquiry]');
      if (!trigger || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button>0) return;
      event.preventDefault();open(trigger);
    });
    $('.inquiry-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{
      document.body.classList.remove('sps-inquiry-open');
      const target=opener?.getClientRects().length ? opener : document.querySelector('.header-contact');
      target?.focus({preventScroll:true});
    });
    dialog.querySelectorAll('[name=method]').forEach(radio=>radio.addEventListener('change',()=>{
      contacts[contactMethod]=$('#inquiry-contact').value;
      contactMethod=radio.value;
      const email=contactMethod==='email';
      $('#inquiry-contact').type=email?'email':'tel';
      $('#inquiry-contact').inputMode=email?'email':'tel';
      $('#inquiry-contact').autocomplete=email?'email':'tel';
      $('#inquiry-contact').placeholder=email?'name@example.com':'010 0000 0000';
      $('#inquiry-contact').value=contacts[contactMethod];
      $('#inquiry-contact-label').innerHTML=`${email?'이메일':'전화번호'} <span>필수</span>`;
      clearErrors();
    }));
    form.addEventListener('submit',event=>{
      event.preventDefault();clearErrors();
      const data=read(),errors=validate(data);
      if(Object.keys(errors).length){
        for(const [name,message] of Object.entries(errors)){
          const field=$(`#inquiry-${name}`),error=$(`#inquiry-${name}-error`);
          field.setAttribute('aria-invalid','true');error.hidden=false;error.textContent=message;
          const li=document.createElement('li'),link=document.createElement('a');
          link.href=`#inquiry-${name}`;link.textContent=message;
          link.addEventListener('click',e=>{e.preventDefault();field.focus();});li.append(link);$('#inquiry-errors ul').append(li);
        }
        $('#inquiry-errors').hidden=false;
        $(`#inquiry-${Object.keys(errors)[0]}`).focus();return;
      }
      snapshot=data;
      $('#inquiry-summary').replaceChildren();
      rows(data).forEach(([label,value])=>{
        const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
        dt.textContent=label;dd.textContent=value;row.append(dt,dd);$('#inquiry-summary').append(row);
      });
      $('#inquiry-copy-status').textContent='';$('#inquiry-copy-fallback').hidden=true;
      setStage(true);focusTop($('#inquiry-review-title'));
    });
    $('#inquiry-edit').addEventListener('click',()=>{setStage(false);focusTop($('#inquiry-name'));});
    $('#inquiry-copy').addEventListener('click',async()=>{
      try { await navigator.clipboard.writeText(summarize(snapshot));$('#inquiry-copy-status').textContent='내용을 복사했습니다. 문의가 접수된 것은 아닙니다.'; }
      catch { $('#inquiry-copy-fallback').hidden=false;$('#inquiry-copy-text').value=summarize(snapshot);$('#inquiry-copy-text').focus();$('#inquiry-copy-text').select();$('#inquiry-copy-status').textContent='자동 복사가 지원되지 않습니다. 아래 내용을 선택해 복사해 주세요.'; }
    });
    $('#inquiry-reset-request').addEventListener('click',()=>{$('#inquiry-discard').hidden=false;$('#inquiry-reset-cancel').focus();});
    $('#inquiry-reset-cancel').addEventListener('click',()=>{$('#inquiry-discard').hidden=true;$('#inquiry-reset-request').focus();});
    $('#inquiry-reset-confirm').addEventListener('click',()=>{
      form.reset();contacts.phone='';contacts.email='';contactMethod='phone';snapshot=null;
      $('#inquiry-situation').value='';$('#inquiry-context-status').hidden=true;syncContext();
      $('#inquiry-contact').type='tel';$('#inquiry-contact').inputMode='tel';$('#inquiry-contact').autocomplete='tel';$('#inquiry-contact').placeholder='010 0000 0000';$('#inquiry-contact-label').innerHTML='전화번호 <span>필수</span>';
      $('#inquiry-summary').replaceChildren();$('#inquiry-copy-text').value='';$('#inquiry-copy-status').textContent='';clearErrors();setStage(false);focusTop($('#inquiry-name'));
    });
    syncContext();
    if(location.hash==='#inquiry')open(document.querySelector('.header-contact'));
  }
  return {validate,rows,summarize,applyEntry,mount};
});
