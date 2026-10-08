/* Reuse the original SPS images for tabs 1–3; tab 4 shows the existing test film. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root,typeof slides==='undefined'?[]:slides);
})(typeof window==='undefined'?null:window,function(){
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function start(win,stories){
    const doc=win.document;
    const bar=doc.querySelector('.main-v4-stories');
    if(!bar||!stories.length)return;
    const hero=bar.closest('.hw-hero');
    const copy=hero.querySelector('.hw-hero-copy');
    const title=hero.querySelector('#hw-title');
    const photo=hero.querySelector('.hw-hero-image');
    const video=hero.querySelector('.hw-hero-video');
    const down=hero.querySelector('.hw-down');
    const buttons=[...bar.querySelectorAll('[data-slide]')];
    const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
    let current=-1,zoom=null,heroVisible=true;
    function syncPhotoMotion(){
      if(!zoom||zoom.playState==='finished')return;
      if(doc.hidden||!heroVisible||photo.hidden)zoom.pause();else zoom.play();
    }
    function startPhotoMotion(){
      zoom?.cancel();zoom=null;
      if(photo.hidden||reduced.matches||!photo.complete||!photo.naturalWidth||!photo.animate)return;
      zoom=photo.animate(
        [{transform:'scale(1.055)'},{transform:'scale(1)'}],
        {duration:8500,easing:'linear',fill:'forwards'}
      );
      syncPhotoMotion();
    }
    function measure(){
      const barInset=parseFloat(win.getComputedStyle(bar).bottom)||0;
      hero.style.setProperty('--main-stories-height',(bar.offsetHeight+barInset)+'px');
      hero.style.setProperty('--main-story-copy-height',copy.offsetHeight+'px');
      const sideSpace=(hero.offsetWidth-bar.offsetWidth)/2;
      const downSize=parseFloat(win.getComputedStyle(down).width)||48;
      const beside=sideSpace>=downSize+4;
      hero.style.setProperty('--main-down-right',(beside?Math.min(24,(sideSpace-downSize)/2):Math.max(16,sideSpace))+'px');
      hero.style.setProperty('--main-down-bottom',(beside?24:bar.offsetHeight+barInset+24)+'px');
    }
    function choose(index){
      const story=stories[index];
      if(!story||index===current)return;
      current=index;
      const isVideo=index===3;
      if(!isVideo){photo.src=story.image;photo.alt=story.alt;}
      photo.hidden=isVideo;
      video.hidden=!isVideo;
      startPhotoMotion();
      if(!isVideo)video.pause();
      win.dispatchEvent(new win.CustomEvent('sps-hero-media-change'));
      title.innerHTML=story.title.split(/<br\s*\/?>/i).map(line=>'<span class="hw-line"><span>'+escape(line)+'</span></span>').join('');
      buttons.forEach(button=>{
        const selected=Number(button.dataset.slide)===index;
        button.classList.toggle('active',selected);
        button.setAttribute('aria-pressed',String(selected));
      });
      measure();
    }
    buttons.forEach(button=>button.addEventListener('click',()=>choose(Number(button.dataset.slide))));
    photo.addEventListener('load',startPhotoMotion);
    doc.addEventListener('visibilitychange',syncPhotoMotion);
    reduced.addEventListener('change',startPhotoMotion);
    if('IntersectionObserver' in win){
      new win.IntersectionObserver(entries=>{
        heroVisible=entries[0].isIntersecting;syncPhotoMotion();
      },{threshold:.15}).observe(hero);
    }
    if('ResizeObserver' in win){
      const observer=new win.ResizeObserver(measure);
      observer.observe(bar,{box:'border-box'});
      observer.observe(copy,{box:'border-box'});
    }
    win.addEventListener('resize',measure,{passive:true});
    win.addEventListener('sps-theme-change',measure);
    doc.fonts?.ready.then(measure);
    choose(0);
  }
  return {start};
});
