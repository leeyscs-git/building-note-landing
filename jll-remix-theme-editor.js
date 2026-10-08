(() => {
  'use strict';
  const theme=window.SPSTheme;
  const labels={brand:'로고',colors:'색상',type:'타이포그래피',layout:'레이아웃',surfaces:'모서리',expression:'모션',buttons:'버튼',navigation:'헤더',icons:'아래 꺾쇠',stories:'스토리 항목',editorial:'서비스 설명',cards:'카드',fields:'입력',disclosure:'FAQ',dialogs:'대화상자'};
  const bar=document.createElement('div');bar.className='ds-live-bar';bar.id='ds-live-bar';
  bar.innerHTML='<div><span class="ds-live-dot" aria-hidden="true"></span><strong>H 사이트와 연결</strong><span id="ds-save-status" role="status" aria-live="polite">저장 연결 확인 중</span></div><div><button type="button" id="ds-save-retry" hidden>저장 다시 시도</button><a href="jll-remix.html" target="_blank" rel="noopener">사이트 함께 보기 ↗</a><button type="button" id="ds-reset-theme">전체 기본값 복원</button></div>';
  document.querySelector('.ds-top').after(bar);
  const help=document.createElement('p');help.className='ds-edit-intro';
  help.innerHTML='폰트 크기는 <a href="#type"><b>파운데이션 → 타이포그래피</b></a>에서 모아 조절합니다. 컴포넌트에서는 높이·여백·색 등 나머지 값을 조정합니다. 헤더의 폰트·로고·치수는 H 메인과 SPS 소개에 함께 반영됩니다. 변경값은 <a href="design/jll-remix/theme.json">H 전용 설정 파일</a>에 자동 저장됩니다. 아래 설명의 고정 수치는 최초 기본 규격이며, 현재 편집값은 조절 도구에서 확인하세요. 모바일 전용 항목은 별도로 적용됩니다.';
  document.querySelector('.ds-cover').after(help);
  for(const [section,title] of Object.entries(labels)){
    const fields=theme.schema.filter(field=>field.section===section);
    const host=document.querySelector('#'+section);
    if(!host||!fields.length)continue;
    const panel=document.createElement('details');panel.className='ds-editor';panel.open=true;
    panel.innerHTML='<summary><span>'+title+' <b>값 조정</b></span><small>견본 + H 메인에 적용 <sps-chevron></sps-chevron></small></summary><div class="ds-editor-grid"></div><p class="ds-editor-note">입력 후 자동 저장 · 기본값 버튼으로 이 항목만 되돌릴 수 있습니다.</p>';
    const grid=panel.querySelector('.ds-editor-grid');
    const typeGroups=new Map();
    if(section==='type'){
      grid.className='ds-type-edit-groups';
      const groups=[
        ['header','헤더·내비게이션','메인과 SPS 소개의 공통 헤더에 함께 적용됩니다.'],
        ['content','제목·본문','H 메인의 대표 제목·본문 크기입니다. 소개 본문은 별도 스타일을 유지합니다.'],
        ['pages','콘텐츠 분류','인사이트 V2의 콘텐츠 분류 탭을 조절합니다. 페이지 제목은 위 제목·본문 그룹의 히어로 제목(59px)을 함께 사용하며 모바일 탭은 기본 본문 값을 사용합니다.'],
        ['components','스토리·입력·FAQ','컴포넌트에 흩어져 있던 폰트 크기를 이곳에서 관리합니다.']
      ];
      for(const [key,label,description] of groups){
        const group=document.createElement('fieldset');group.className='ds-type-edit-group';group.id='type-'+key;
        const legend=document.createElement('legend');legend.textContent=label;
        const note=document.createElement('p');note.className='ds-type-group-note';note.textContent=description;
        const controls=document.createElement('div');controls.className='ds-editor-grid';
        group.append(legend,note,controls);grid.append(group);typeGroups.set(key,controls);
      }
    }
    for(const field of fields){
      const row=document.createElement('div');row.className='ds-edit-field';row.dataset.token=field.token;
      const id='edit-'+field.token.slice(2);
      const label=document.createElement('label');label.htmlFor=id;label.textContent=field.label;row.append(label);
      const controls=document.createElement('div');controls.className='ds-edit-controls';
      const primary=document.createElement('input');
      primary.type=field.type==='color'?'color':'range';primary.className='ds-edit-primary';primary.setAttribute('aria-label',field.label+(field.type==='color'?' 색상 선택':' 슬라이더'));
      const value=document.createElement('input');value.id=id;value.className='ds-edit-value';
      value.type=field.type==='color'?'text':'number';value.autocomplete='off';value.spellcheck=false;
      if(field.type==='color'){value.pattern='#[0-9a-fA-F]{6}';value.maxLength=7;}
      else {for(const input of [primary,value]){input.min=field.min;input.max=field.max;input.step=field.step;}}
      const suffix=document.createElement('span');suffix.textContent=field.type==='color'?'HEX':field.unit;
      const reset=document.createElement('button');reset.type='button';reset.textContent='기본값';reset.setAttribute('aria-label',field.label+' 기본값 복원');
      const error=document.createElement('span');error.className='ds-edit-error';error.id=id+'-error';error.hidden=true;
      value.setAttribute('aria-describedby',error.id);
      function change(input){
        const v=field.type==='color'?input.value.toLowerCase():input.value===''?NaN:Number(input.value);
        if(!theme.edit(field.token,v)){
          error.textContent=field.type==='color'?'#을 포함한 6자리 색상을 입력해 주세요.':field.min+'–'+field.max+field.unit+' 범위로 입력해 주세요.';
          error.hidden=false;value.setAttribute('aria-invalid','true');reset.disabled=false;return;
        }
        error.hidden=true;value.removeAttribute('aria-invalid');
      }
      primary.addEventListener('input',()=>change(primary));value.addEventListener('input',()=>change(value));
      reset.addEventListener('click',()=>{error.hidden=true;value.removeAttribute('aria-invalid');theme.edit(field.token,null);});
      controls.append(primary,value,suffix,reset);row.append(controls,error);(typeGroups.get(field.group)||grid).append(row);
    }
    host.querySelector('.ds-heading').after(panel);
    if(['buttons','navigation','stories','cards','editorial','fields','disclosure'].includes(section)){
      const shortcut=document.createElement('p');shortcut.className='ds-type-shortcut';
      shortcut.innerHTML='폰트 크기는 <a href="#type">파운데이션 → 타이포그래피</a>에서 조절합니다.';
      panel.before(shortcut);
    }
  }
  document.querySelector('#ds-save-retry').addEventListener('click',()=>theme.retry());
  document.querySelector('#ds-reset-theme').addEventListener('click',()=>theme.reset());
  function update(){
    const state=theme.snapshot();
    const status=document.querySelector('#ds-save-status');
    bar.dataset.status=state.error?'error':state.saving||state.pending?'pending':'saved';
    status.textContent=state.error?'미저장 · '+state.error:state.saving?'파일에 저장 중…':state.pending?'변경 반영됨 · 저장 대기':state.connected?(state.updatedAt?'저장됨 · '+new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false,timeZone:'Asia/Seoul'}).format(new Date(state.updatedAt)):'연결됨 · 기본값 적용 중'):'저장 연결 확인 중';
    document.querySelector('#ds-save-retry').hidden=!state.error;
    document.querySelectorAll('.ds-edit-field').forEach(row=>{
      const token=row.dataset.token,value=theme.value(token),field=theme.schema.find(f=>f.token===token);
      row.classList.toggle('is-modified',value!==field.value);
      for(const input of row.querySelectorAll('input')){
        if(input!==document.activeElement)input.value=value;
      }
      row.querySelector('button').disabled=value===field.value;
    });
    // Measurements represented by product tokens are updated beside their specimens.
    const pairs=[
      ['.ds-logo-sizes>div:first-child span','Desktop / '+theme.value('--logo-width')+'px'],
      ['.ds-logo-sizes>div:last-child span','Mobile / '+theme.value('--logo-width-mobile')+'px'],
      ['.ds-shape-item:first-child .ds-radius-demo>span',theme.value('--radius-control')],
      ['.ds-shape-item:nth-child(2) .ds-radius-demo>span',theme.value('--radius-panel')],
      ['.ds-grid-board .ds-measure-line','CONTENT WIDTH · MAX '+theme.value('--content-max')+'px'],
      ['[data-layout-gutter]',theme.value('--page-gutter')+'px'],
      ['[data-layout-tablet-wide]',Math.min(theme.value('--page-gutter'),48)+'px'],
      ['[data-layout-tablet]',Math.min(theme.value('--page-gutter'),32)+'px'],
      ['[data-layout-mobile]',theme.value('--page-gutter-mobile')+'px'],
      ['.ds-dimension-side','min '+theme.value('--contact-height')+'px'],
      ['.ds-button-dimension .ds-measure-top',theme.value('--contact-padding')+'px / label / '+theme.value('--contact-gap')+'px gap / icon / '+theme.value('--contact-padding')+'px'],
      ['.ds-modal-notes>div:first-child b',theme.value('--dialog-width')+'px'],
      ['.ds-modal-notes>div:nth-child(3) b',theme.value('--radius-panel')+'px']
    ];
    for(const [selector,text] of pairs){const el=document.querySelector(selector);if(el)el.textContent=text;}
  }
  window.addEventListener('sps-theme-change',update);update();
})();
