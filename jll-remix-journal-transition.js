/* Carry the selected photo into the article without changing route/history semantics. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.SPSJournalTransition=api.create(root);
})(typeof window==='undefined'?null:window,function(){
  const box=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
  function intersect(a,b){
    const left=Math.max(a.left,b.left),top=Math.max(a.top,b.top);
    return box(left,top,Math.max(0,Math.min(a.right,b.right)-left),Math.max(0,Math.min(a.bottom,b.bottom)-top));
  }
  function photoBox(rect,naturalWidth,naturalHeight,position='50% 50%'){
    const scale=Math.max(rect.width/naturalWidth,rect.height/naturalHeight);
    const width=naturalWidth*scale,height=naturalHeight*scale;
    const parts=position.split(/\s+/);
    const fraction=value=>value==='left'||value==='top'?0:value==='right'||value==='bottom'?1:value==='center'?.5:value?.endsWith('%')?parseFloat(value)/100:.5;
    return box(rect.left+(rect.width-width)*fraction(parts[0]),rect.top+(rect.height-height)*fraction(parts[1]||'50%'),width,height);
  }
  function clippedBox(rect,clip='none',scale=1){
    const match=clip.match(/^inset\(([^)]+)\)/);
    if(!match)return rect;
    const values=match[1].split(' round ')[0].trim().split(/\s+/);
    const sides=[values[0],values[1]||values[0],values[2]||values[0],values[3]||values[1]||values[0]];
    const pixels=sides.map((value,i)=>value.endsWith('%')?parseFloat(value)/100*(i%2?rect.width:rect.height):parseFloat(value)*scale);
    if(pixels.some(value=>!Number.isFinite(value)))return rect;
    return box(rect.left+pixels[3],rect.top+pixels[0],Math.max(0,rect.width-pixels[1]-pixels[3]),Math.max(0,rect.height-pixels[0]-pixels[2]));
  }
  function create(win){
    const doc=win.document;
    const reduce=win.matchMedia('(prefers-reduced-motion: reduce)');
    const remembered=new Map();
    let active=null;
    const viewport=()=>box(0,0,win.innerWidth,win.innerHeight);
    function snapshot(image,crop,fallback){
      if(!image)return null;
      const width=image.naturalWidth||fallback?.width,height=image.naturalHeight||fallback?.height;
      if(!width||!height)return null;
      return {src:image.currentSrc||image.src,width,height,crop:intersect(crop,viewport()),
        photo:photoBox(image.getBoundingClientRect(),width,height,win.getComputedStyle(image).objectPosition)};
    }
    function heroSnapshot(fallback,visibleOnly=false){
      const frame=doc.querySelector('#journal-article .iv2-hero-frame');
      const image=frame?.querySelector('img');
      if(!image)return null;
      const bounds=frame.getBoundingClientRect(),unit=bounds.width/frame.offsetWidth||1;
      let crop=clippedBox(bounds,win.getComputedStyle(frame).clipPath,unit);
      if(visibleOnly){
        const header=doc.querySelector('[data-sps-header]')?.getBoundingClientRect().bottom||0;
        const content=doc.querySelector('#journal-article .iv2-article-content')?.getBoundingClientRect().top??win.innerHeight;
        crop=intersect(crop,box(0,header,win.innerWidth,Math.max(0,Math.min(content,win.innerHeight)-header)));
      }
      return snapshot(image,crop,fallback);
    }
    function usable(shot){return shot&&shot.crop.width>=2&&shot.crop.height>=2;}
    function cancel(){
      const state=active;if(!state)return;
      active=null;
      win.clearTimeout(state.timeout);
      state.animations.forEach(animation=>animation.cancel());
      state.maskedTarget?.removeAttribute('data-iv2-return-target');
      doc.documentElement.removeAttribute('data-iv2-route-flight');
      state.layer.remove();
    }
    function fly(shot,update,getDestination,direction){
      const layer=doc.createElement('div');layer.className='iv2-route-flight';layer.setAttribute('aria-hidden','true');
      const image=doc.createElement('img');image.className='iv2-route-image';image.alt='';image.src=shot.src;
      layer.append(image);doc.body.append(layer);
      // Convert physical viewport coordinates into the scaled desktop canvas.
      const unit=layer.getBoundingClientRect().width/layer.offsetWidth||1;
      layer.style.width=win.innerWidth/unit+'px';layer.style.height=win.innerHeight/unit+'px';
      const origin=layer.getBoundingClientRect();
      const local=rect=>box((rect.left-origin.left)/unit,(rect.top-origin.top)/unit,rect.width/unit,rect.height/unit);
      const clipFor=rect=>{const r=local(rect);return 'inset('+r.top+'px '+(win.innerWidth/unit-r.right)+'px '+(win.innerHeight/unit-r.bottom)+'px '+r.left+'px)';};
      const first=local(shot.photo);
      image.style.width=first.width+'px';image.style.height=first.height+'px';
      const fromTransform='translate('+first.left+'px,'+first.top+'px) scale(1)';
      image.style.transform=fromTransform;layer.style.clipPath=clipFor(shot.crop);
      const state=active={layer,animations:[],timeout:0,maskedTarget:null};
      doc.documentElement.setAttribute('data-iv2-route-flight',direction);
      try{update();}catch(error){cancel();throw error;}
      state.scrollY=win.scrollY;
      state.timeout=win.setTimeout(()=>{if(active===state)cancel();},1800);
      const painted=()=>new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
      async function travel(){
        if(image.decode)await Promise.race([image.decode().catch(()=>{}),new Promise(resolve=>win.setTimeout(resolve,180))]);
        await painted();
        if(active!==state)return;
        const destination=getDestination(state,shot);
        if(!usable(destination)){cancel();return;}
        state.scrollY=win.scrollY;
        const last=local(destination.photo);
        const ease=win.getComputedStyle(doc.documentElement).getPropertyValue('--ease-editorial').trim()||'cubic-bezier(.22,1,.36,1)';
        const timing={duration:850,easing:ease,fill:'both'};
        state.animations.push(layer.animate([{clipPath:clipFor(shot.crop)},{clipPath:clipFor(destination.crop)}],timing));
        state.animations.push(image.animate([{transform:fromTransform},{transform:'translate('+last.left+'px,'+last.top+'px) scale('+last.width/first.width+')'}],timing));
        const entries=direction==='out'?[['#journal-index',100]]:[['#journal-article .journal-article-head',100],['#journal-article .iv2-article-content',220]];
        for(const [selector,delay]of entries){
          const element=doc.querySelector(selector);
          const frames=direction==='out'?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}];
          if(element)state.animations.push(element.animate(frames,{duration:600,delay,easing:ease,fill:'both'}));
        }
        await Promise.allSettled(state.animations.map(animation=>animation.finished));
        if(active===state)cancel();
      }
      travel().catch(()=>{if(active===state)cancel();});
    }
    function open(link,update){
      cancel();
      const source=link.querySelector('img')||link.closest('.iv2-first-read-panel')?.querySelector('img');
      if(reduce.matches||doc.hidden||!source?.complete||!source.naturalWidth||!source.animate){update();return;}
      const shot=snapshot(source,(source.closest('.iv2-photo')||source).getBoundingClientRect());
      if(!usable(shot)){update();return;}
      fly(shot,update,()=>{
        const destination=heroSnapshot(shot);
        if(usable(destination)&&link.dataset?.article)remembered.set(link.dataset.article,{...destination,viewport:viewport()});
        return destination;
      },'in');
    }
    function back(articleId,update){
      cancel();
      if(reduce.matches||doc.hidden){update();return;}
      let shot=heroSnapshot(null,true);
      if(!usable(shot)){
        const saved=remembered.get(articleId);
        if(saved){
          // Reading may have scrolled the real hero away. Reuse its entry composition.
          const ratio=win.innerWidth/saved.viewport.width,dy=win.innerHeight-saved.viewport.height*ratio;
          const resize=rect=>box(rect.left*ratio,rect.top*ratio+dy,rect.width*ratio,rect.height*ratio);
          shot={...saved,photo:resize(saved.photo),crop:intersect(resize(saved.crop),viewport())};
        }
      }
      if(!usable(shot)||!doc.documentElement.animate){update();return;}
      fly(shot,update,(state,fallback)=>{
        const link=[...doc.querySelectorAll('#journal-grid a[data-article]')].find(link=>link.dataset.article===articleId);
        const image=link?.querySelector('img');
        if(!image)return null;
        const crop=image.closest('.iv2-photo')||image;
        const header=doc.querySelector('[data-sps-header]')?.getBoundingClientRect().bottom||0;
        const bounds=crop.getBoundingClientRect();
        if(bounds.bottom<=header+32||bounds.top>=win.innerHeight-32){
          crop.scrollIntoView({block:'center',behavior:'instant'});
        }
        image.setAttribute('data-iv2-return-target','');state.maskedTarget=image;
        link.focus({preventScroll:true});
        return snapshot(image,crop.getBoundingClientRect(),fallback);
      },'out');
    }
    for(const event of ['resize','wheel','touchstart','popstate','pagehide','sps-theme-change'])win.addEventListener(event,cancel,{passive:true});
    win.addEventListener('scroll',()=>{if(active&&win.scrollY!==active.scrollY)cancel();},{passive:true});
    doc.addEventListener('keydown',event=>{if(['Escape','ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))cancel();});
    doc.addEventListener('visibilitychange',()=>{if(doc.hidden)cancel();});
    reduce.addEventListener('change',cancel);
    return {open,back,cancel};
  }
  return {photoBox,clippedBox,intersect,create};
});
