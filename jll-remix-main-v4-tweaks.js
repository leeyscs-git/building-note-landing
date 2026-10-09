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
    if(!hero||!nav||!copy||!bar)return;
    const toggle=panel.querySelector('#main-v4-nav-toggle');
    const slider=panel.querySelector('#main-v4-title-position');
    const output=panel.querySelector('#main-v4-title-value');
    const fontSelect=panel.querySelector('#main-v4-title-font');
    const storySelect=panel.querySelector('#main-v4-story-font');
    const numberSelect=panel.querySelector('#main-v4-number-font');
    const insetSlider=panel.querySelector('#main-v4-bar-inset');
    const insetOutput=panel.querySelector('#main-v4-bar-value');
    const reset=panel.querySelector('#main-v4-tweaks-reset');
    const summary=panel.querySelector('summary');
    const fonts=(win.SPSThemeSchema||[]).filter(field=>field.section==='type'&&field.group==='content'&&field.token.includes('title'));
    const smallFonts=(win.SPSThemeSchema||[]).filter(field=>['--story-font-size','--field-font-size','--body-size'].includes(field.token));
    const defaultFont=fonts.find(field=>field.token==='--display-title-size')?.token||fonts[0]?.token;
    let showNav=true,requestedOffset=0,fontToken=defaultFont,storyToken='--body-size',numberToken='--field-font-size',barInset=24;
    try{
      const saved=JSON.parse(win.localStorage.getItem(storageKey));
      if(typeof saved?.showNav==='boolean')showNav=saved.showNav;
      if(Number.isFinite(saved?.offset))requestedOffset=Math.max(-20,Math.min(2000,saved.offset));
      // Revision 2 adopts the approved larger headline; retain navigation/position preferences.
      if(saved?.version===2&&fonts.some(field=>field.token===saved.fontToken))fontToken=saved.fontToken;
      if(smallFonts.some(field=>field.token===saved?.storyToken))storyToken=saved.storyToken;
      if(smallFonts.some(field=>field.token===saved?.numberToken))numberToken=saved.numberToken;
      if(Number.isFinite(saved?.barInset))barInset=Math.max(0,Math.min(64,saved.barInset));
    }catch{}
    function save(){
      try{win.localStorage.setItem(storageKey,JSON.stringify({version:2,showNav,offset:requestedOffset,fontToken,storyToken,numberToken,barInset}));}catch{}
    }
    const choices=[{select:fontSelect,fields:fonts},{select:storySelect,fields:smallFonts},{select:numberSelect,fields:smallFonts}];
    const fontOptions=choices.flatMap(({select,fields})=>{
      select.disabled=!fields.length;
      return fields.map(field=>{
        const option=doc.createElement('option');option.value=field.token;select.append(option);
        return {field,option};
      });
    });
    function updateFonts(){
      const computed=win.getComputedStyle(hero);
      fontOptions.forEach(({field,option})=>{
        const inherited=parseFloat(computed.getPropertyValue(field.token));
        const current=win.SPSTheme?.value(field.token)??(Number.isFinite(inherited)?inherited:field.value);
        option.textContent=field.label+' · '+current+'px';
      });
      fontSelect.value=fontToken||'';
      storySelect.value=storyToken;numberSelect.value=numberToken;
    }
    function applyFont(){
      [[fontToken,'--main-title-size'],[storyToken,'--main-story-size'],[numberToken,'--main-number-size']].forEach(([token,property])=>{
        const field=[...fonts,...smallFonts].find(field=>field.token===token);
        if(field)hero.style.setProperty(property,'var('+field.token+','+field.value+'px)');
      });
      fontSelect.value=fontToken||'';
      storySelect.value=storyToken;numberSelect.value=numberToken;
    }
    function applyInset(){
      hero.style.setProperty('--main-bar-inset',barInset+'px');
      insetSlider.value=String(barInset);insetOutput.value=barInset+'px';
      insetSlider.setAttribute('aria-valuetext','아래 여백 '+barInset+'px');
      win.dispatchEvent(new win.CustomEvent('sps-main-layout-change'));
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
    toggle.addEventListener('change',()=>{showNav=toggle.checked;syncNav();save();});
    insetSlider.addEventListener('input',()=>{
      barInset=Math.max(0,Math.min(64,Number(insetSlider.value)||0));applyInset();measure();save();
    });
    slider.addEventListener('input',()=>{requestedOffset=Number(slider.value)||0;measure();save();});
    fontSelect.addEventListener('change',()=>{
      fontToken=fonts.some(field=>field.token===fontSelect.value)?fontSelect.value:defaultFont;
      applyFont();measure();save();
    });
    storySelect.addEventListener('change',()=>{
      storyToken=smallFonts.some(field=>field.token===storySelect.value)?storySelect.value:'--body-size';
      applyFont();measure();save();
    });
    numberSelect.addEventListener('change',()=>{
      numberToken=smallFonts.some(field=>field.token===numberSelect.value)?numberSelect.value:'--field-font-size';
      applyFont();measure();save();
    });
    reset.addEventListener('click',()=>{
      showNav=true;requestedOffset=0;fontToken=defaultFont;storyToken='--body-size';numberToken='--field-font-size';barInset=24;
      syncNav();applyFont();applyInset();measure();save();
    });
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
    syncNav();updateFonts();applyFont();applyInset();measure();save();panel.open=false;panel.hidden=false;
  }
  return {start};
});
