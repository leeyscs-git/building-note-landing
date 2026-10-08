/* V4's real four-line vision resolves from fine grains with scroll, before keyword travel. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(){
  const clamp=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
  const duration=1700;
  function makeGrains(targets,width,height,fontSize,random=Math.random){
    const count=Math.min(targets.length,12000);
    return Array.from({length:count},(_,i)=>{
      const target=targets[Math.floor(i*targets.length/count)];
      const x=target.x+(random()-.5)*.65,y=target.y+(random()-.5)*.65;
      const angle=(i%8+random())*Math.PI/4,spread=.78+random()*.2;
      const sx=width/2+Math.cos(angle)*Math.max(0,width/2-4)*spread;
      const sy=height/2+Math.sin(angle)*Math.max(0,height/2-4)*spread;
      const distance=Math.hypot(x-sx,y-sy)||1;
      return {x,y,sx,sy,normalX:-(y-sy)/distance,normalY:(x-sx)/distance,
        bend:(random()-.5)*fontSize*.6,phase:random()*Math.PI*2,delay:random()*240,
        travel:1100+random()*300,radius:.2+Math.pow(random(),1.8)*.38,alpha:.5+random()*.5};
    });
  }
  function grainAt(grain,time){
    const t=clamp((time-grain.delay)/grain.travel);
    if(t===1)return {x:grain.x,y:grain.y,alpha:grain.alpha};
    const ease=1-Math.pow(1-t,3),curl=Math.sin(t*Math.PI)*(1-t);
    const drift=Math.sin(time*.012+grain.phase)*curl*.65;
    return {x:grain.sx+(grain.x-grain.sx)*ease+grain.normalX*(grain.bend*curl+drift),
      y:grain.sy+(grain.y-grain.sy)*ease+grain.normalY*(grain.bend*curl+drift),
      alpha:grain.alpha*smooth((time-grain.delay)/160)};
  }
  function inkAt(time){return smooth((time-900)/800);}

  // Measure rendered glyphs so line breaks, tracking and desktop-canvas scaling match.
  function mask(win,title){
    const doc=win.document,rect=title.getBoundingClientRect();
    const width=title.offsetWidth,height=title.offsetHeight,scale=rect.width/width;
    const fontSize=parseFloat(win.getComputedStyle(title).fontSize);
    if(!width||!height||!scale||!fontSize)return null;
    const surface=doc.createElement('canvas');surface.width=width;surface.height=height;
    const ctx=surface.getContext('2d',{willReadFrequently:true});
    if(!ctx)return null;
    ctx.fillStyle='#000';ctx.textAlign='left';ctx.textBaseline='alphabetic';
    const walker=doc.createTreeWalker(title,4),range=doc.createRange();
    let node,minY=height,maxY=0;
    while((node=walker.nextNode())){
      if(!node.textContent.trim()||!node.parentElement.closest('.hw-slogan-line'))continue;
      const styles=win.getComputedStyle(node.parentElement);
      ctx.font=styles.fontStyle+' '+styles.fontWeight+' '+styles.fontSize+' '+styles.fontFamily;
      let offset=0;
      for(const glyph of node.textContent){
        range.setStart(node,offset);offset+=glyph.length;range.setEnd(node,offset);
        if(!glyph.trim())continue;
        const box=range.getBoundingClientRect();
        if(!box.width||!box.height)continue;
        const metrics=ctx.measureText(glyph);
        const ascent=metrics.fontBoundingBoxAscent??metrics.actualBoundingBoxAscent??fontSize*.8;
        const descent=metrics.fontBoundingBoxDescent??metrics.actualBoundingBoxDescent??fontSize*.2;
        const x=(box.left-rect.left)/scale,y=(box.top-rect.top)/scale;
        const baseline=y+(box.height/scale-ascent-descent)/2+ascent;
        ctx.fillText(glyph,x,baseline);
        minY=Math.min(minY,y);maxY=Math.max(maxY,y+box.height/scale);
      }
    }
    const pixels=ctx.getImageData(0,0,width,height).data,targets=[];
    const step=Math.max(1,fontSize/59);
    for(let y=Math.max(0,minY-2);y<Math.min(height,maxY+2);y+=step){
      for(let x=0;x<width;x+=step){
        if(pixels[(Math.floor(y)*width+Math.floor(x))*4+3]>150)targets.push({x,y});
      }
    }
    return targets.length?{width,height,fontSize,targets}:null;
  }

  function scrollFrame(rawProgress,travel=.9){
    const progress=clamp((rawProgress+.25)/(Math.max(.1,travel)+.25));
    const time=duration*progress;
    return {progress,time,ink:inkAt(time)};
  }
  function start(win){
    const doc=win.document,title=doc.querySelector('.hw-main-v4 [data-particle-slogan]');
    if(!title)return;
    const section=title.closest('.hw-vision'),stage=title.closest('.hw-vision-stage');
    const header=doc.querySelector('[data-sps-header]');
    const reduce=win.matchMedia('(prefers-reduced-motion: reduce)'),contrast=win.matchMedia('(forced-colors: active)');
    const boot=win.SPSVisionParticlesBoot,root=doc.documentElement;
    let ready=false,failed=Boolean(!boot||boot.released),disposed=false,frame=0,fontTimer=0;
    let canvas=null,ctx=null,shape=null,grains=[],activeLayout='',intersection=null,resize=null;
    function showNative(){
      title.removeAttribute('data-grains-active');title.style.removeProperty('--vision-title-ink');
      if(canvas)canvas.hidden=true;
      boot?.release();root.removeAttribute('data-v4-vision-pending');
    }
    function fail(){
      failed=true;win.clearTimeout(fontTimer);fontTimer=0;
      canvas?.remove();canvas=null;ctx=null;shape=null;grains=[];showNative();
    }
    function layoutKey(){
      const style=win.getComputedStyle(title);
      return [title.offsetWidth,title.offsetHeight,style.fontSize,style.fontFamily,style.fontWeight,style.letterSpacing].join('|');
    }
    function scene(){
      const rect=title.getBoundingClientRect(),headerBottom=header?.getBoundingClientRect().bottom||0;
      // Use the same stage units and intro offset as the shared film controller.
      const height=Math.max(1,stage.clientHeight);
      const rawProgress=(headerBottom-section.getBoundingClientRect().top)/height;
      const travel=parseFloat(win.getComputedStyle(section).getPropertyValue('--vision-particle-travel'))||.9;
      return {...scrollFrame(rawProgress,travel),visible:!doc.hidden&&rect.width>0&&rect.height>0&&rect.bottom>headerBottom&&rect.top<win.innerHeight};
    }
    function build(){
      canvas?.remove();canvas=null;
      shape=mask(win,title);
      if(!shape)return false;
      grains=makeGrains(shape.targets,shape.width,shape.height,shape.fontSize);
      canvas=doc.createElement('canvas');ctx=canvas.getContext('2d');
      if(!ctx)return false;
      const dpr=Math.min(win.devicePixelRatio||1,2);
      canvas.width=Math.ceil(shape.width*dpr);canvas.height=Math.ceil(shape.height*dpr);
      canvas.className='vision-title-grains';canvas.setAttribute('aria-hidden','true');
      ctx.scale(dpr,dpr);title.append(canvas);activeLayout=layoutKey();
      return true;
    }
    function paint(){
      frame=0;
      if(disposed||doc.hidden)return;
      if(failed||reduce.matches||contrast.matches){showNative();return;}
      try{
        const state=scene();
        // Later scenes always show the original, moving words. Keep grains for reversal.
        if(state.progress>=1){showNative();return;}
        if(!state.visible||!ready||doc.fonts?.status==='loading')return;
        if(!canvas||activeLayout!==layoutKey())if(!build()){fail();return;}
        canvas.hidden=false;title.setAttribute('data-grains-active','');
        title.style.setProperty('--vision-title-ink',String(state.ink));
        root.removeAttribute('data-v4-vision-pending');
        ctx.clearRect(0,0,shape.width,shape.height);
        ctx.fillStyle=win.getComputedStyle(title).color;
        for(const grain of grains){
          const point=grainAt(grain,state.time);ctx.globalAlpha=point.alpha*(1-state.ink);
          ctx.beginPath();ctx.arc(point.x,point.y,grain.radius,0,Math.PI*2);ctx.fill();
        }
        // No time loop: stopping the scroll freezes the exact particle positions.
      }catch(_){fail();}
    }
    function schedule(){if(!disposed&&!doc.hidden&&!frame)frame=win.requestAnimationFrame(paint);}
    function suspend(){win.cancelAnimationFrame(frame);frame=0;}
    function visibility(){if(doc.hidden)suspend();else schedule();}
    if(failed||reduce.matches||contrast.matches){showNative();return;}
    boot.claim();fontTimer=win.setTimeout(fail,5000);
    win.addEventListener('scroll',schedule,{passive:true});
    win.addEventListener('resize',schedule,{passive:true});
    win.addEventListener('sps-theme-change',schedule);
    win.addEventListener('sps-vision-palette-change',schedule);
    win.addEventListener('pageshow',schedule);win.addEventListener('pagehide',suspend);
    doc.addEventListener('visibilitychange',visibility);
    doc.fonts?.addEventListener('loadingdone',schedule);
    reduce.addEventListener('change',schedule);contrast.addEventListener('change',schedule);
    if('IntersectionObserver' in win){intersection=new win.IntersectionObserver(schedule,{threshold:[0,.5,.8,1]});intersection.observe(title);}
    if('ResizeObserver' in win){resize=new win.ResizeObserver(schedule);resize.observe(title);}
    Promise.resolve(doc.fonts?.ready).then(()=>{
      ready=true;win.clearTimeout(fontTimer);fontTimer=0;schedule();
    }).catch(fail);
    schedule();
    return function dispose(){
      disposed=true;suspend();win.clearTimeout(fontTimer);fontTimer=0;
      canvas?.remove();canvas=null;showNative();intersection?.disconnect();resize?.disconnect();
      win.removeEventListener('scroll',schedule);win.removeEventListener('resize',schedule);
      win.removeEventListener('sps-theme-change',schedule);win.removeEventListener('sps-vision-palette-change',schedule);
      win.removeEventListener('pageshow',schedule);win.removeEventListener('pagehide',suspend);
      doc.removeEventListener('visibilitychange',visibility);doc.fonts?.removeEventListener('loadingdone',schedule);
      reduce.removeEventListener('change',schedule);contrast.removeEventListener('change',schedule);
    };
  }
  return {makeGrains,grainAt,inkAt,scrollFrame,mask,start};
});
