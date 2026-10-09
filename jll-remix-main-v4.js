/* Original SPS story motion, adapted to V4's three photos and fourth film. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root,typeof slides==='undefined'?[]:slides);
})(typeof window==='undefined'?null:window,function(){
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function start(win,stories){
    const doc=win.document,bar=doc.querySelector('.main-v4-stories');
    if(!bar||!stories.length)return;
    const hero=bar.closest('.hw-hero'),copy=hero.querySelector('.hw-hero-copy');
    const title=hero.querySelector('#hw-title'),shade=hero.querySelector('.hw-hero-shade');
    const video=hero.querySelector('.hw-hero-video'),playButton=bar.querySelector('.main-v4-playback');
    const buttons=[...bar.querySelectorAll('[data-slide]')];
    const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
    let photo=hero.querySelector('.hw-hero-image');
    let current=-1,requestId=0,zoom=null,progress=null,fade=null,previous=null;
    let transitioning=false,heroVisible=true,userPaused=false,focusPaused=false,hoverPaused=false;
    const tracks=buttons.map(button=>{
      const track=doc.createElement('span');track.className='main-v4-story-progress';
      track.setAttribute('aria-hidden','true');button.append(track);return track;
    });
    hero.setAttribute('aria-roledescription','캐러셀');
    function blocked(){
      return reduced.matches||userPaused||doc.hidden||!heroVisible||focusPaused||hoverPaused||
        !!doc.querySelector('dialog[open],.sps-menu-open,.sps-inquiry-open,.main-v4-tweaks[open]');
    }
    function syncPlayback(){
      const paused=blocked();
      for(const animation of [zoom,progress]){
        if(!animation||animation.playState==='finished')continue;
        if(paused||(animation===progress&&transitioning))animation.pause();else animation.play();
      }
      playButton.disabled=reduced.matches;
      playButton.setAttribute('data-paused',String(paused));
      playButton.setAttribute('aria-pressed',String(userPaused));
      playButton.setAttribute('aria-label',reduced.matches?'모션 감소 설정으로 자동 전환 꺼짐':userPaused?'스토리 자동 전환 재생':'스토리 자동 전환 일시정지');
    }
    function resetProgress(){
      progress?.cancel();progress=null;
      if(!reduced.matches&&tracks[current]?.animate){
        progress=tracks[current].animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:7200,easing:'linear',fill:'forwards'});
        progress.onfinish=()=>{if(!blocked()&&!transitioning)choose((current+1)%stories.length);};
      }
      syncPlayback();
    }
    function startPhotoMotion(){
      zoom?.cancel();zoom=null;
      if(current===3||reduced.matches||!photo.complete||!photo.naturalWidth||!photo.animate)return;
      zoom=photo.animate([{transform:'scale(1.055)'},{transform:'scale(1)'}],{duration:8500,easing:'linear',fill:'forwards'});
      syncPlayback();
    }
    function mediaChanged(){win.dispatchEvent(new win.CustomEvent('sps-hero-media-change'));}
    function clearTransition(){
      if(fade){fade.onfinish=null;fade.cancel();fade=null;}
      if(previous===video){video.hidden=true;video.pause();mediaChanged();}
      else previous?.remove();
      previous=null;
    }
    function measure(){
      const inset=parseFloat(win.getComputedStyle(bar).bottom)||0;
      hero.style.setProperty('--main-stories-height',(bar.offsetHeight+inset)+'px');
      hero.style.setProperty('--main-story-copy-height',copy.offsetHeight+'px');
    }
    async function choose(index){
      const story=stories[index];if(!story)return;
      const token=++requestId;
      // Selecting the visible tab also cancels a pending slow image request.
      if(index===current){transitioning=false;resetProgress();return;}
      transitioning=true;syncPlayback();
      let incoming=index===3?video:photo;
      if(current!==-1&&index!==3){
        incoming=doc.createElement('img');incoming.className='hw-hero-image';
        incoming.src=story.image;incoming.alt=story.alt;
        try{await incoming.decode();}catch{
          if(token===requestId){transitioning=false;resetProgress();}
          return;
        }
        if(token!==requestId)return;
      }
      clearTransition();
      const outgoing=current===-1?null:current===3?video:photo;
      if(outgoing&&zoom)outgoing.style.transform=win.getComputedStyle(outgoing).transform;
      zoom?.cancel();zoom=null;
      if(outgoing){outgoing.style.zIndex='0';outgoing.setAttribute('aria-hidden','true');}
      if(index!==3){
        photo=incoming;photo.src=story.image;photo.alt=story.alt;
        if(outgoing)shade.before(photo);
      }
      incoming.hidden=false;incoming.style.zIndex='1';incoming.removeAttribute('aria-hidden');
      if(!outgoing&&index!==3){video.hidden=true;video.pause();}
      current=index;
      mediaChanged();
      title.innerHTML=story.title.split(/<br\s*\/?>/i).map(line=>'<span class="hw-line"><span>'+escape(line)+'</span></span>').join('');
      buttons.forEach(button=>{
        const selected=Number(button.dataset.slide)===index;
        button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));
      });
      startPhotoMotion();measure();resetProgress();
      if(outgoing){
        previous=outgoing;
        if(!reduced.matches&&incoming.animate){
          fade=incoming.animate([{opacity:0},{opacity:1}],{duration:950,easing:'ease-in-out'});
          fade.onfinish=()=>{clearTransition();transitioning=false;syncPlayback();};
          return;
        }
        clearTransition();
      }
      transitioning=false;syncPlayback();
    }
    buttons.forEach(button=>button.addEventListener('click',()=>choose(Number(button.dataset.slide))));
    photo.addEventListener('load',()=>{if(current===0)startPhotoMotion();});
    playButton.addEventListener('click',()=>{userPaused=!userPaused;focusPaused=false;syncPlayback();});
    // Hovering the small playback button must still allow explicit resume.
    bar.addEventListener('pointerover',event=>{hoverPaused=event.pointerType!=='touch'&&!playButton.contains(event.target);syncPlayback();});
    bar.addEventListener('pointerleave',()=>{hoverPaused=false;syncPlayback();});
    hero.addEventListener('focusin',event=>{
      // A touch selection keeps cycling; visible keyboard focus pauses to allow reading.
      focusPaused=!playButton.contains(event.target)&&event.target.matches?.(':focus-visible')!==false;
      syncPlayback();
    });
    hero.addEventListener('focusout',()=>win.requestAnimationFrame(()=>{
      if(!hero.contains(doc.activeElement))focusPaused=false;syncPlayback();
    }));
    doc.addEventListener('visibilitychange',syncPlayback);
    reduced.addEventListener('change',()=>{
      if(reduced.matches){clearTransition();transitioning=false;}
      startPhotoMotion();resetProgress();
    });
    if('IntersectionObserver' in win)new win.IntersectionObserver(entries=>{
      heroVisible=entries[0].isIntersecting;syncPlayback();
    },{threshold:.15}).observe(hero);
    if('MutationObserver' in win){
      const observer=new win.MutationObserver(syncPlayback);
      observer.observe(doc.documentElement,{attributes:true,attributeFilter:['class']});
      observer.observe(doc.body,{attributes:true,attributeFilter:['class']});
      doc.querySelectorAll('dialog,.main-v4-tweaks').forEach(element=>observer.observe(element,{attributes:true,attributeFilter:['open']}));
    }
    if('ResizeObserver' in win){
      const observer=new win.ResizeObserver(measure);
      observer.observe(bar,{box:'border-box'});observer.observe(copy,{box:'border-box'});
    }
    win.addEventListener('resize',measure,{passive:true});
    win.addEventListener('sps-theme-change',measure);
    win.addEventListener('sps-main-layout-change',measure);
    doc.fonts?.ready.then(measure);
    choose(0);
  }
  return {start};
});
