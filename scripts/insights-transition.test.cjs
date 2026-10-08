const test=require('node:test');
const assert=require('node:assert/strict');
const {photoBox,clippedBox,create}=require('../jll-remix-journal-transition.js');
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}

test('cover geometry preserves photo proportions while interpolating different crops',()=>{
  assert.deepEqual(photoBox(rect(20,30,300,300),1200,800),rect(-55,30,450,300));
  assert.deepEqual(photoBox(rect(20,30,600,200),1200,800),rect(20,-70,600,400));
  assert.deepEqual(photoBox(rect(20,30,600,200),1200,800,'50% 100%'),rect(20,-170,600,400));
});

test('hero clipping includes the portrait inset and phone desktop scale',()=>{
  assert.deepEqual(clippedBox(rect(0,137,1230,690),'inset(301px 475px 25px)'),rect(475,438,280,364));
  const scaled=clippedBox(rect(0,54.8,492,276),'inset(301px 475px 25px)',.4);
  assert.ok(Math.abs(scaled.width-112)<.001);assert.ok(Math.abs(scaled.height-145.6)<.001);
  assert.deepEqual(clippedBox(rect(10,20,200,100),'inset(10% 20%)'),rect(50,30,120,80));
  assert.deepEqual(clippedBox(rect(10,20,200,100),'none'),rect(10,20,200,100));
});

function harness({scale=1,reduced=false,loaded=true,missingTarget=false}={}){
  const queue=[],motions=[],timers=new Map(),events={},docEvents={},layers=[];
  let serial=0,updates=0;
  const physical=box=>rect(box.left*scale,box.top*scale,box.width*scale,box.height*scale);
  const element=name=>({name,style:{},attrs:{},children:[],removed:false,
    setAttribute(key,value){this.attrs[key]=value;},removeAttribute(key){delete this.attrs[key];},
    append(child){this.children.push(child);},remove(){this.removed=true;},
    animate(frames,timing){const done=deferred();const animation={name,frames,timing,finished:done.promise,cancel(){done.reject(Error('cancelled'));},finish:done.resolve};motions.push(animation);return animation;}
  });
  const crop={getBoundingClientRect:()=>physical(rect(860,420,280,207))};
  const source=Object.assign(element('source'),{complete:loaded,naturalWidth:1200,naturalHeight:800,src:'photo.jpg',currentSrc:'photo.jpg',closest:()=>crop,getBoundingClientRect:()=>physical(rect(851.6,413.79,296.8,219.42))});
  const target=Object.assign(element('target'),{complete:true,naturalWidth:1200,naturalHeight:800,src:'photo.jpg',currentSrc:'photo.jpg',getBoundingClientRect:()=>physical(rect(-24.6,123.2,1279.2,717.6))});
  const frame={offsetWidth:1230,querySelector:()=>target,getBoundingClientRect:()=>physical(rect(0,137,1230,690))};
  const heading=element('heading'),content=element('content'),root=element('root'),index=element('index');
  content.getBoundingClientRect=()=>rect(0,900*scale,1230*scale,1000*scale);
  const doc={hidden:false,documentElement:root,body:{append(layer){layers.push(layer);}},
    createElement(tag){const el=element(tag);if(tag==='div'){
      Object.defineProperty(el,'offsetWidth',{get:()=>parseFloat(el.style.width)||1230});
      el.getBoundingClientRect=()=>rect(0,0,el.offsetWidth*scale,(parseFloat(el.style.height)||900)*scale);
    }else el.decode=()=>Promise.resolve();return el;},
    querySelector:selector=>selector.endsWith('.iv2-hero-frame')?(missingTarget?null:frame):selector.endsWith('.journal-article-head')?heading:selector.endsWith('.iv2-article-content')?content:selector==='#journal-index'?index:null,
    querySelectorAll:()=>[link],
    addEventListener:(name,fn)=>docEvents[name]=fn
  };
  const media={matches:reduced,addEventListener(name,fn){this[name]=fn;}};
  const win={document:doc,scrollY:600,innerWidth:1230*scale,innerHeight:900*scale,matchMedia:()=>media,
    getComputedStyle:el=>el===frame?{clipPath:'inset(301px 475px 25px)'}:el===root?{getPropertyValue:()=>''}:{objectPosition:'50% 50%'},
    requestAnimationFrame(fn){queue.push(fn);},
    setTimeout(fn){const id=++serial;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),
    addEventListener:(name,fn)=>events[name]=fn
  };
  const api=create(win),link={dataset:{article:'why-we-work'},querySelector:()=>source,closest:()=>null,focus(){this.focused=true;}};
  const update=()=>{updates++;win.scrollY=0;};
  async function settle(){await flush();while(queue.length)queue.shift()();await flush();}
  return {api,win,doc,root,link,source,target,frame,crop,content,motions,layers,timers,events,docEvents,media,settle,updates:()=>updates,
    back:()=>api.back('why-we-work',update),
    open:()=>api.open(link,update),finish:async()=>{motions.forEach(m=>m.finish());await settle();}
  };
}

test('photo flight reaches the clipped hero and releases native content at every desktop scale',async()=>{
  for(const scale of [1,.4]){
    const h=harness({scale});h.open();assert.equal(h.updates(),1);assert.ok('data-iv2-route-flight' in h.root.attrs);
    h.events.scroll();await h.settle();assert.equal(h.motions.length,4);
    const clip=h.motions.find(m=>m.name==='div');
    assert.equal(clip.timing.duration,850);
    const values=clip.frames[1].clipPath.match(/[-\d.]+/g).map(Number);
    for(const [i,expected]of [438,475,98,475].entries())assert.ok(Math.abs(values[i]-expected)<.001);
    const photo=h.motions.find(m=>m.name==='img');assert.match(photo.frames[1].transform,/scale\([^,]+\)/);
    assert.equal(h.motions.find(m=>m.name==='heading').timing.delay,100);
    await h.finish();assert.equal(h.layers[0].removed,true);assert.equal('data-iv2-route-flight' in h.root.attrs,false);
  }
});

test('reduced motion and unloaded photos navigate immediately without hiding the article',async()=>{
  for(const options of [{reduced:true},{loaded:false}]){
    const h=harness(options);h.open();await h.settle();assert.equal(h.updates(),1);assert.equal(h.layers.length,0);
    assert.equal('data-iv2-route-flight' in h.root.attrs,false);
  }
});

test('scroll, resize and history interruption remove the overlay without a second navigation',async()=>{
  for(const event of ['wheel','resize','popstate','scroll']){
    const h=harness();h.open();await h.settle();
    if(event==='scroll')h.win.scrollY=10;
    h.events[event]();await h.settle();assert.equal(h.layers[0].removed,true);assert.equal(h.updates(),1);
    assert.equal('data-iv2-route-flight' in h.root.attrs,false);
  }
});

test('rapid second navigation cancels pending geometry; missing targets and timeouts fail open',async()=>{
  const h=harness();h.open();h.open();await h.settle();
  assert.equal(h.updates(),2);assert.equal(h.layers[0].removed,true);assert.equal(h.motions.length,4);
  await h.finish();assert.equal(h.layers[1].removed,true);
  const missing=harness({missingTarget:true});missing.open();await missing.settle();assert.equal(missing.layers[0].removed,true);
  const stalled=harness();stalled.open();[...stalled.timers.values()][0]();await stalled.settle();
  assert.equal(stalled.layers[0].removed,true);assert.equal(stalled.motions.length,0);
});


test('reverse flight returns the hero to its own list image and releases the hidden destination',async()=>{
  for(const scale of [1,.4]){
    const h=harness({scale});h.back();assert.equal(h.updates(),1);
    assert.equal(h.root.attrs['data-iv2-route-flight'],'out');
    await h.settle();assert.equal(h.motions.length,3);
    const clip=h.motions.find(m=>m.name==='div');
    const values=clip.frames[1].clipPath.match(/[-\d.]+/g).map(Number);
    for(const [i,expected]of [420,90,273,860].entries())assert.ok(Math.abs(values[i]-expected)<.001);
    assert.equal('data-iv2-return-target' in h.source.attrs,true);
    assert.equal(h.link.focused,true);
    assert.deepEqual(h.motions.find(m=>m.name==='index').frames,[{opacity:0},{opacity:1}]);
    await h.finish();assert.equal('data-iv2-return-target' in h.source.attrs,false);
    assert.equal(h.layers[0].removed,true);assert.equal('data-iv2-route-flight' in h.root.attrs,false);
  }
});

test('return from a deep reading position reuses the entry photo instead of losing the transition',async()=>{
  const h=harness();h.open();await h.settle();await h.finish();
  h.frame.getBoundingClientRect=()=>rect(0,-1600,1230,690);
  h.target.getBoundingClientRect=()=>rect(-24.6,-1613.8,1279.2,717.6);
  h.content.getBoundingClientRect=()=>rect(0,-910,1230,2000);
  h.back();assert.equal(h.updates(),2);await h.settle();assert.equal(h.layers.length,2);
  const clip=h.motions.filter(m=>m.name==='div').at(-1);
  assert.match(clip.frames[0].clipPath,/438px/);
  await h.finish();assert.equal(h.layers[1].removed,true);
});

test('reverse cancellation restores the card, and missing cards or reduced motion fail open',async()=>{
  const h=harness();h.back();await h.settle();h.events.wheel();await h.settle();
  assert.equal('data-iv2-return-target' in h.source.attrs,false);
  assert.equal(h.layers[0].removed,true);
  const missing=harness();missing.doc.querySelectorAll=()=>[];missing.back();await missing.settle();
  assert.equal(missing.updates(),1);assert.equal(missing.layers[0].removed,true);
  const reduced=harness({reduced:true});reduced.back();assert.equal(reduced.updates(),1);assert.equal(reduced.layers.length,0);
});
