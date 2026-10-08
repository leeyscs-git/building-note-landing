/* V4-only layout previews. Keep foundation colors and the shared motion engine intact. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(){
  const storageKey='sps-main-v4-layout-tweaks-v1';
  function start(win){
    const doc=win.document,panel=doc.querySelector('.main-v4-tweaks');
    if(!panel||new URLSearchParams(win.location.search).has('embed'))return;
    const hero=doc.querySelector('#hw-intro'),nav=doc.querySelector('.main-v4-page-nav');
    const copy=hero?.querySelector('.hw-hero-copy'),bar=hero?.querySelector('.main-v4-stories');
    const down=hero?.querySelector('.hw-down');
    if(!hero||!nav||!copy||!bar||!down)return;
    const toggle=panel.querySelector('#main-v4-nav-toggle');
    const downToggle=panel.querySelector('#main-v4-down-toggle');
    const slider=panel.querySelector('#main-v4-title-position');
    const output=panel.querySelector('#main-v4-title-value');
    const fontSelect=panel.querySelector('#main-v4-title-font');
    const reset=panel.querySelector('#main-v4-tweaks-reset');
    const summary=panel.querySelector('summary');
    const fonts=(win.SPSThemeSchema||[]).filter(field=>field.section==='type'&&field.group==='content'&&field.token.includes('title'));
    const defaultFont=fonts.find(field=>field.token==='--section-title-size')?.token||fonts[0]?.token;
    let showNav=true,showDown=true,requestedOffset=0,fontToken=defaultFont;
    try{
      const saved=JSON.parse(win.localStorage.getItem(storageKey));
      if(typeof saved?.showNav==='boolean')showNav=saved.showNav;
      if(typeof saved?.showDown==='boolean')showDown=saved.showDown;
      if(Number.isFinite(saved?.offset))requestedOffset=Math.max(-20,Math.min(2000,saved.offset));
      if(fonts.some(field=>field.token===saved?.fontToken))fontToken=saved.fontToken;
    }catch{}
    function save(){
      try{win.localStorage.setItem(storageKey,JSON.stringify({showNav,showDown,offset:requestedOffset,fontToken}));}catch{}
    }
    const fontOptions=fonts.map(field=>{
      const option=doc.createElement('option');option.value=field.token;fontSelect.append(option);
      return {field,option};
    });
    fontSelect.disabled=!fonts.length;
    function updateFonts(){
      const computed=win.getComputedStyle(hero);
      fontOptions.forEach(({field,option})=>{
        const inherited=parseFloat(computed.getPropertyValue(field.token));
        const current=win.SPSTheme?.value(field.token)??(Number.isFinite(inherited)?inherited:field.value);
        option.textContent=field.label+' · '+current+'px';
      });
      fontSelect.value=fontToken||'';
    }
    function applyFont(){
      const field=fonts.find(field=>field.token===fontToken);
      if(field)hero.style.setProperty('--main-title-size','var('+field.token+','+field.value+'px)');
      fontSelect.value=fontToken||'';
    }
    function measure(){
      // offsetHeight uses the page's logical pixels, including desktop-canvas zoom.
      const barInset=parseFloat(win.getComputedStyle(bar).bottom)||0;
      const upper=Math.max(0,Math.floor(hero.offsetHeight-bar.offsetHeight-barInset-copy.offsetHeight-56));
      const offset=Math.round(Math.max(-20,Math.min(upper,requestedOffset)));
      slider.max=String(upper);slider.value=String(offset);
      hero.style.setProperty('--main-title-offset',offset+'px');
      const label=offset===0?'기본':(offset>0?'위 ':'아래 ')+Math.abs(offset)+'px';
      output.value=label;slider.setAttribute('aria-valuetext',label);
    }
    function syncNav(){
      toggle.checked=showNav;
      nav.toggleAttribute('data-tweak-hidden',!showNav);
    }
    function syncDown(){
      downToggle.checked=showDown;
      down.hidden=!showDown;
    }
    toggle.addEventListener('change',()=>{showNav=toggle.checked;syncNav();save();});
    downToggle.addEventListener('change',()=>{showDown=downToggle.checked;syncDown();save();});
    slider.addEventListener('input',()=>{requestedOffset=Number(slider.value)||0;measure();save();});
    fontSelect.addEventListener('change',()=>{
      fontToken=fonts.some(field=>field.token===fontSelect.value)?fontSelect.value:defaultFont;
      applyFont();measure();save();
    });
    reset.addEventListener('click',()=>{showNav=true;showDown=true;requestedOffset=0;fontToken=defaultFont;syncNav();syncDown();applyFont();measure();save();});
    panel.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&panel.open){panel.open=false;summary.focus();event.preventDefault();}
    });
    doc.addEventListener('pointerdown',event=>{if(panel.open&&!panel.contains(event.target))panel.open=false;});
    win.addEventListener('resize',measure,{passive:true});
    win.addEventListener('sps-theme-change',()=>{updateFonts();measure();});
    win.addEventListener('pageshow',measure);
    if('ResizeObserver' in win){
      const observer=new win.ResizeObserver(measure);
      [hero,copy,bar].forEach(element=>observer.observe(element,{box:'border-box'}));
    }
    doc.fonts?.ready.then(measure);
    syncNav();syncDown();updateFonts();applyFont();measure();panel.open=false;panel.hidden=false;
  }
  return {start};
});
