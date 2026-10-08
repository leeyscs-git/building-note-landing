const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {makeGrains,grainAt,inkAt,scrollFrame,mask,start}=require('../jll-remix-vision-particles.js');
const {visionTimeline,keywordState,sceneState}=require('../jll-remix-hanwha.js');
const html=fs.readFileSync(require.resolve('../jll-remix-main-v4.html'),'utf8');
const bootstrap=html.match(/<script>\s*\/\/ Reserve the vision[\s\S]*?<\/script>/)[0].replace(/<\/?script>/g,'');

function fixture({reduced=false,unsupported=false,scale=1,loading=false}={}){
  const events=()=>({listeners:{},addEventListener(k,fn){this.listeners[k]=fn;},removeEventListener(k){delete this.listeners[k];}});
  const doc=events(),win=events(),frames=new Map(),timers=new Map(),properties={},attributes={},rootAttributes={},canvases=[],observers=[];
  let frameId=0,timerId=0,sectionTop=1200,probing=true,resolveFonts;
  const reduce={...events(),matches:reduced},contrast={...events(),matches:false};
  const styles={fontSize:'59px',fontStyle:'normal',fontWeight:'350',fontFamily:'Pretendard',letterSpacing:'-2.36px',color:'#10252b',getPropertyValue:()=>'.9'};
  const title={offsetWidth:1000,offsetHeight:600,
    getBoundingClientRect:()=>({left:0,top:Math.max(137,sectionTop)*scale,bottom:(Math.max(137,sectionTop)+600)*scale,width:title.offsetWidth*scale,height:title.offsetHeight*scale}),
    style:{setProperty(k,v){properties[k]=v;},removeProperty(k){delete properties[k];}},
    setAttribute(k,v){attributes[k]=v;},removeAttribute(k){delete attributes[k];},append(canvas){canvas.attached=true;},
    closest:selector=>selector==='.hw-vision-stage'?{clientHeight:600}:{getBoundingClientRect:()=>({top:sectionTop*scale})}};
  const nodes=['새로운 도전에서 출발해','끊임없는 혁신을 더하고,','더 나은 내일을 향해','가능성을 넓혀갑니다.'].map((textContent,row)=>({textContent,row,parentElement:{closest:()=>true}}));
  const makeContext=()=>({fills:[],points:[],scale(){},clearRect(){this.points=[];},beginPath(){},arc(x,y,r){this.points.push([x,y,r]);},fill(){},
    fillText(text,x,y){this.fills.push({text,x,y});},measureText:()=>({width:30,fontBoundingBoxAscent:45,fontBoundingBoxDescent:10}),
    getImageData(x,y,width,height){const data=new Uint8ClampedArray(width*height*4);for(const p of this.fills){
      for(let yy=Math.floor(p.y-8);yy<p.y;yy++)for(let xx=Math.floor(p.x);xx<p.x+8;xx++)data[(yy*width+xx)*4+3]=255;
    }return {data};}});
  doc.hidden=false;doc.activeElement=null;
  doc.fonts={...events(),status:loading?'loading':'loaded',ready:loading?new Promise(resolve=>resolveFonts=resolve):Promise.resolve()};
  doc.querySelector=selector=>selector.includes('data-particle-slogan')?title:{getBoundingClientRect:()=>({bottom:137*scale})};
  doc.documentElement={setAttribute(k,v){rootAttributes[k]=v;},removeAttribute(k){delete rootAttributes[k];}};
  doc.createElement=()=>{const context=makeContext();const canvas={style:{},context,
    setAttribute(k,v){this[k]=v;},getContext:()=>unsupported?null:context,remove(){this.removed=true;}};
    if(!probing)canvases.push(canvas);return canvas;};
  doc.createTreeWalker=()=>{let i=0;return {nextNode:()=>nodes[i++]};};
  doc.createRange=()=>{let node,offset;return {setStart(n,i){node=n;offset=i;},setEnd(){},getBoundingClientRect(){
    return {left:(220+offset*30)*scale,top:title.getBoundingClientRect().top+(120+node.row*80)*scale,width:30*scale,height:55*scale};}};};
  Object.assign(win,{document:doc,innerHeight:800*scale,devicePixelRatio:2,
    matchMedia:q=>q.includes('reduced-motion')?reduce:contrast,getComputedStyle:()=>styles,
    requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id),
    setTimeout(fn,delay){timers.set(++timerId,{fn,delay});return timerId;},clearTimeout:id=>timers.delete(id),
    IntersectionObserver:class{constructor(fn){this.callback=fn;}observe(){}disconnect(){}},
    ResizeObserver:class{constructor(fn){observers.push(fn);}observe(){}disconnect(){}}});
  vm.runInNewContext(bootstrap,{window:win,document:doc,matchMedia:win.matchMedia,setTimeout:win.setTimeout,clearTimeout:win.clearTimeout});
  probing=false;const dispose=start(win);
  function flushTimers(select){for(const [id,{fn,delay}]of [...timers])if(select(delay)){timers.delete(id);fn();}}
  return {doc,win,title,styles,attributes,rootAttributes,properties,canvases,frames,timers,reduce,contrast,observers,
    dispose:()=>dispose?.(),enter(progress=0){sectionTop=137-progress*600/scale;win.listeners.scroll?.();},
    leave(){sectionTop=1200;win.listeners.scroll?.();},settle(){flushTimers(delay=>delay<=120);},expire(){flushTimers(delay=>delay>=5000);},
    tick(time){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(time));},
    fontsReady(){doc.fonts.status='loaded';resolveFonts?.();doc.fonts.listeners.loadingdone?.();}};
}

test('fine grains arrive from all directions and blend into native ink without a hold',()=>{
  const points=Array.from({length:16000},(_,i)=>({x:340+i%200,y:300+i%45}));let seed=14;
  const grains=makeGrains(points,900,640,59,()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296));
  assert.equal(grains.length,12000);const directions=Array(8).fill(0);
  for(const grain of grains){
    const angle=(Math.atan2((grain.sy-320)/316,(grain.sx-450)/446)+Math.PI*2)%(Math.PI*2);directions[Math.floor(angle/(Math.PI/4))]++;
    assert.ok(grain.radius>=.2&&grain.radius<=.58);assert.equal(grainAt(grain,0).alpha,0);
    assert.deepEqual(grainAt(grain,1700),{x:grain.x,y:grain.y,alpha:grain.alpha});
  }
  assert.ok(directions.every(n=>n>=grains.length*.12));
  assert.equal(inkAt(800),0);assert.equal(inkAt(1300),.5);assert.equal(inkAt(1700),1);
  const arrival=Math.max(...grains.map(g=>g.delay+g.travel));assert.ok(inkAt(arrival)>0&&inkAt(arrival)<1);
});

test('glyph masking retains all four lines and matches desktop-canvas scaling',()=>{
  for(const scale of [1,.4]){
    const h=fixture({scale}),shape=mask(h.win,h.title);assert.equal(shape.width,1000);assert.equal(shape.height,600);
    const rows=new Set(h.canvases[0].context.fills.map(p=>Math.round((p.y-165)/80)));
    assert.deepEqual([...rows],[0,1,2,3]);assert.ok(shape.targets.length>2000);h.dispose();
  }
});

test('scroll determines particle positions, freezes when stopped, and reverses with the same grains',async()=>{
  for(const scale of [1,.4]){
    const h=fixture({scale});await Promise.resolve();h.tick(100);h.expire();assert.equal(h.canvases.length,0);
    h.enter(.45);h.tick(200);assert.equal(h.attributes['data-grains-active'],'');
    const canvas=h.canvases[1],points=JSON.stringify(canvas.context.points),ink=h.properties['--vision-title-ink'];
    assert.ok(Number(ink)>0&&Number(ink)<1);assert.equal(h.frames.size,0);
    h.tick(10000);assert.equal(h.properties['--vision-title-ink'],ink);assert.equal(JSON.stringify(canvas.context.points),points);
    h.enter(.8);h.tick(10100);assert.ok(Number(h.properties['--vision-title-ink'])>Number(ink));
    h.enter(1);h.tick(10200);assert.equal(canvas.hidden,true);assert.equal(h.attributes['data-grains-active'],undefined);
    h.enter(.45);h.tick(10300);assert.equal(canvas.hidden,false);assert.equal(h.properties['--vision-title-ink'],ink);
    assert.equal(JSON.stringify(canvas.context.points),points);assert.equal(h.canvases.length,2);h.dispose();
  }
});

test('the full title completes before keyword travel and each film keeps its original relative timing',()=>{
  assert.equal(scrollFrame(-.25).progress,0);assert.equal(scrollFrame(.9).ink,1);
  assert.equal(keywordState(visionTimeline(.9,.9)).restOpacity,1);
  assert.equal(keywordState(visionTimeline(.9,.9)).moveX,0);
  assert.equal(sceneState(visionTimeline(.9,.9),0).visible,false);
  for(const t of [-.4,0,.5,1.1,1.6,3.6,5.6,7.6]){
    assert.ok(Math.abs(visionTimeline(t+.9,.9)-t)<1e-10);
    assert.equal(visionTimeline(t),t,'V2 and the reference retain their existing time');
  }
});

test('a deep link shows native words immediately and can still reveal particles on reverse scroll',async()=>{
  const h=fixture();h.enter(3);await Promise.resolve();h.tick(100);
  assert.equal(h.rootAttributes['data-v4-vision-pending'],undefined);assert.equal(h.canvases.length,0);
  h.enter(.5);h.tick(200);assert.equal(h.canvases.length,2);assert.equal(h.attributes['data-grains-active'],'');h.dispose();
});

test('palette updates keep the same positions; layout changes remask at the current scroll position',async()=>{
  const h=fixture();await Promise.resolve();h.enter(.45);h.tick(100);
  const points=JSON.stringify(h.canvases[1].context.points),ink=h.properties['--vision-title-ink'];
  h.styles.color='#ffffff';h.win.listeners['sps-vision-palette-change']();h.tick(600);
  assert.equal(h.canvases.length,2);assert.equal(h.canvases[1].context.fillStyle,'#ffffff');assert.equal(JSON.stringify(h.canvases[1].context.points),points);
  h.title.offsetWidth=900;h.win.listeners.resize();h.tick(700);assert.equal(h.canvases[1].removed,true);assert.equal(h.canvases.length,4);
  assert.equal(h.properties['--vision-title-ink'],ink);h.dispose();
});

test('background tabs and leaving the viewport stop work without resetting the scroll position',async()=>{
  const h=fixture();await Promise.resolve();h.enter(.45);h.tick(100);const ink=h.properties['--vision-title-ink'];
  h.enter(.5);h.doc.hidden=true;h.doc.listeners.visibilitychange();assert.equal(h.frames.size,0);
  h.doc.hidden=false;h.doc.listeners.visibilitychange();h.tick(200);assert.equal(h.canvases.length,2);
  h.leave();h.tick(300);assert.equal(h.frames.size,0);h.enter(.45);h.tick(400);assert.equal(h.properties['--vision-title-ink'],ink);
  h.win.listeners.pagehide();h.win.listeners.pageshow();h.tick(500);assert.equal(h.canvases.length,2);h.dispose();
});

test('reduced motion, unsupported canvas and delayed fonts fail open to accessible text',async()=>{
  for(const options of [{reduced:true},{unsupported:true},{loading:true}]){
    const h=fixture(options);await Promise.resolve();h.enter(.5);h.tick(100);h.expire();
    assert.equal(h.rootAttributes['data-v4-vision-pending'],undefined);
    h.fontsReady();await Promise.resolve();h.tick(200);assert.equal(h.frames.size,0);assert.equal(h.attributes['data-grains-active'],undefined);h.dispose();
  }
  const h=fixture();await Promise.resolve();h.enter(.5);h.tick(100);h.reduce.matches=true;h.reduce.listeners.change();h.tick(200);
  assert.equal(h.rootAttributes['data-v4-vision-pending'],undefined);assert.equal(h.frames.size,0);h.dispose();
});

test('only V4 owns the particle boot; Insights uses its existing upward reveal',()=>{
  const insights=fs.readFileSync(require.resolve('../../../../../jll-remix-journal-v2.html'),'utf8');
  assert.ok(!/particles|title-pending/.test(insights));
  assert.match(insights,/<section class="iv2-heading wrap"[^>]*data-iv2-reveal>/);
  assert.ok(html.indexOf('// Reserve the vision')<html.indexOf('pretendardvariable.css'));
  for(const file of ['jll-remix-main-v2.html','jll-remix-hanwha.html'])assert.ok(!fs.readFileSync(require.resolve('../../../../../'+file),'utf8').includes('vision-particles.js'));
});
