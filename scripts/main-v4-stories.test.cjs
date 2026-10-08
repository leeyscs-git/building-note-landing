const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {start}=require('../jll-remix-main-v4.js');
const {start:startSwitcher}=require('../jll-remix-main-switcher.js');

function fixture({reduceMotion=false}={}){
  const source=fs.readFileSync(require.resolve('../jll-remix.js'),'utf8');
  const context={window:{SPSHeader:{about:'jll-remix-about.html'}}};
  vm.runInNewContext(source.slice(0,source.indexOf('function closeMenu'))+';globalThis.storyData=slides;',context);
  const stories=Array.from(context.storyData),events={},values={},observers=[],dispatched=[],motions=[],intersections=[];
  const buttons=stories.map((_,index)=>({dataset:{slide:String(index)},attributes:{},active:false,
    classList:{toggle(name,value){buttons[index].active=value;}},
    setAttribute(name,value){this.attributes[name]=value;},addEventListener(name,callback){this[name]=callback;}}));
  const title={html:'',writes:0,get innerHTML(){return this.html;},set innerHTML(value){this.html=value;this.writes++;}};
  const copy={offsetHeight:230};
  const photo={src:'',alt:'',hidden:false,complete:true,naturalWidth:1600,
    addEventListener(name,callback){this[name]=callback;},
    animate(frames,options){const motion={frames,options,playState:'running',cancel(){this.cancelled=true;this.playState='idle';},pause(){this.playState='paused';},play(){this.playState='running';}};motions.push(motion);return motion;}};
  const video={src:'assets/hanwha-reference/hero.mp4',hidden:true,pauses:0,pause(){this.pauses++;}};
  const down={width:48,hidden:false};
  const hero={offsetWidth:1480,style:{setProperty(name,value){values[name]=value;}},querySelector:selector=>({'.hw-hero-copy':copy,'#hw-title':title,'.hw-hero-image':photo,'.hw-hero-video':video,'.hw-down':down})[selector]};
  const bar={offsetWidth:1200,offsetHeight:138,bottom:0,closest:()=>hero,querySelectorAll:()=>buttons};
  const reduced={matches:reduceMotion,addEventListener(name,callback){this[name]=callback;}};
  const doc={hidden:false,querySelector:()=>bar,addEventListener(name,callback){events['doc:'+name]=callback;}};
  const win={document:doc,matchMedia:()=>reduced,getComputedStyle:element=>({width:down.width+'px',bottom:element===bar?bar.bottom+'px':'auto'}),addEventListener(name,callback){events[name]=callback;},dispatchEvent(event){dispatched.push(event.type);},CustomEvent:class{constructor(type){this.type=type;}},
    IntersectionObserver:class{constructor(callback){intersections.push(callback);}observe(){}},
    ResizeObserver:class{constructor(callback){this.callback=callback;}observe(target,options){observers.push({target,options,callback:this.callback});}}};
  start(win,stories);
  return {stories,buttons,title,copy,hero,bar,down,events,values,observers,photo,video,dispatched,motions,intersections,reduced,doc};
}

test('the four tabs select their original headline without requiring a CTA button',()=>{
  const h=fixture();
  assert.equal(h.buttons.length,4);
  assert.deepEqual(h.buttons.map(button=>button.active),[true,false,false,false]);
  assert.ok(h.title.innerHTML.includes('더 나은 내일을 위한'));
  for(const index of [1,2,3,0]){
    h.buttons[index].click();
    const lines=h.stories[index].title.split('<br>');
    for(const line of lines)assert.ok(h.title.innerHTML.includes(line));
    assert.equal((h.title.innerHTML.match(/class="hw-line"/g)||[]).length,lines.length);
    assert.equal(h.buttons.filter(button=>button.attributes['aria-pressed']==='true').length,1);
    assert.equal(h.buttons[index].active,true);
  }
});

test('measured bar and title heights update after wrapping or theme changes',()=>{
  const h=fixture();
  assert.equal(h.values['--main-stories-height'],'138px');
  assert.equal(h.values['--main-story-copy-height'],'230px');
  h.bar.offsetHeight=220;h.copy.offsetHeight=310;
  h.observers.find(item=>item.target===h.bar).callback();
  assert.equal(h.values['--main-stories-height'],'220px');
  assert.equal(h.values['--main-story-copy-height'],'310px');
  h.copy.offsetHeight=280;h.events['sps-theme-change']();
  assert.equal(h.values['--main-story-copy-height'],'280px');
  assert.ok(h.observers.every(item=>item.options.box==='border-box'));
});

test('tabs 1–3 reuse the original images and pause the hidden video; only tab 4 exposes the existing film',()=>{
  const h=fixture();
  for(const index of [0,1,2]){
    h.buttons[index].click();
    assert.equal(h.photo.src,h.stories[index].image);
    assert.equal(h.photo.alt,h.stories[index].alt);
    assert.equal(h.photo.hidden,false);assert.equal(h.video.hidden,true);
  }
  const paused=h.video.pauses;
  h.buttons[3].click();
  assert.equal(h.photo.hidden,true);assert.equal(h.video.hidden,false);
  assert.equal(h.video.src,'assets/hanwha-reference/hero.mp4');
  assert.equal(h.video.pauses,paused);
  h.buttons[1].click();
  assert.equal(h.video.hidden,true);assert.equal(h.video.pauses,paused+1);
  assert.equal(h.photo.src,h.stories[1].image);
  assert.ok(h.dispatched.every(type=>type==='sps-hero-media-change'));
  assert.equal(h.dispatched.length,5);
});

test('shared playback respects tab visibility together with background, motion and viewport pause gates',()=>{
  const source=fs.readFileSync(require.resolve('../jll-remix-hanwha.js'),'utf8');
  const fn=source.slice(source.indexOf('  function setVideo('),source.indexOf("  videoButton?.addEventListener('click'"));
  const context={portrait:{matches:false},userPaused:false,doc:{hidden:false},activeVideo:new WeakMap()};
  vm.runInNewContext(fn+';this.updateVideo=setVideo;',context);
  const video={hidden:true,dataset:{},hasAttribute:()=>false,plays:0,pauses:0,play(){this.plays++;return Promise.resolve();},pause(){this.pauses++;}};
  context.updateVideo(video,true);assert.equal(video.plays,0);
  video.hidden=false;context.updateVideo(video,true);assert.equal(video.plays,1);
  context.updateVideo(video,true);assert.equal(video.plays,1);
  video.hidden=true;context.updateVideo(video,true);assert.equal(video.pauses,2);
  video.hidden=false;context.doc.hidden=true;context.updateVideo(video,true);assert.equal(video.plays,1);
  context.doc.hidden=false;context.userPaused=true;context.updateVideo(video,true);assert.equal(video.plays,1);
  context.userPaused=false;context.updateVideo(video,false);assert.equal(video.plays,1);
  context.updateVideo(video,true);assert.equal(video.plays,2);
});

test('selecting the current tab leaves its headline in place without restarting the reveal',()=>{
  const h=fixture();
  assert.equal(h.title.writes,1);
  h.buttons[1].click();
  assert.equal(h.title.writes,2);
  h.buttons[1].click();
  assert.equal(h.title.writes,2);
  h.buttons[2].click();
  assert.equal(h.title.writes,3);
  assert.equal(h.buttons[2].active,true);
});

test('only loaded photos receive the original slow zoom, with no leftover motion on the video tab',()=>{
  const h=fixture();
  assert.deepEqual(h.motions[0].frames,[{transform:'scale(1.055)'},{transform:'scale(1)'}]);
  assert.equal(h.motions[0].options.duration,8500);
  h.buttons[1].click();assert.equal(h.motions[0].cancelled,true);
  h.photo.complete=false;h.buttons[2].click();
  assert.equal(h.motions[1].cancelled,true);assert.equal(h.motions.length,2);
  h.photo.complete=true;h.photo.load();assert.equal(h.motions.length,3);
  h.buttons[3].click();assert.equal(h.motions[2].cancelled,true);
  h.photo.load();assert.equal(h.motions.length,3);
  h.buttons[0].click();assert.equal(h.motions.length,4);
});

test('photo motion pauses outside the hero or in a background tab and respects reduced motion',()=>{
  const h=fixture();
  h.intersections[0]([{isIntersecting:false}]);assert.equal(h.motions[0].playState,'paused');
  h.intersections[0]([{isIntersecting:true}]);assert.equal(h.motions[0].playState,'running');
  h.doc.hidden=true;h.events['doc:visibilitychange']();assert.equal(h.motions[0].playState,'paused');
  h.doc.hidden=false;h.events['doc:visibilitychange']();assert.equal(h.motions[0].playState,'running');
  h.reduced.matches=true;h.reduced.change();assert.equal(h.motions[0].cancelled,true);
  h.buttons[1].click();assert.equal(h.motions.length,1);
  const reduced=fixture({reduceMotion:true});assert.equal(reduced.motions.length,0);
});

test('down button sits beside the bar when it fits and moves above it on narrow screens, including while hidden',()=>{
  const h=fixture();
  assert.equal(h.values['--main-down-right'],'24px');
  assert.equal(h.values['--main-down-bottom'],'24px');
  h.hero.offsetWidth=1034;h.bar.offsetWidth=938;h.down.width=44;h.events.resize();
  const right=Number.parseFloat(h.values['--main-down-right']);
  assert.ok(right>=0&&right+h.down.width<=(h.hero.offsetWidth-h.bar.offsetWidth)/2);
  assert.equal(h.values['--main-down-bottom'],'24px');
  h.hero.offsetWidth=390;h.bar.offsetWidth=358;h.bar.offsetHeight=220;h.down.hidden=true;h.events.resize();
  assert.equal(h.values['--main-down-right'],'16px');
  assert.equal(h.values['--main-down-bottom'],'244px');
});

test('the retired comparison/palette switcher skips V4; other drafts retain their comparison links',()=>{
  for(const search of ['', '?vision=v2', '?vision=v3', '?vision=v4&embed=1']){
    startSwitcher({location:{pathname:'/jll-remix-main-v4.html',search,hash:'#hw-vision'},document:{
      createElement(){assert.fail('The approved V4 must not add a tweak panel');},
      querySelector(){assert.fail('Old query palettes must not override the approved color');}
    }});
  }
  for(const page of ['jll-remix-main-v2.html','jll-remix.html']){
    const shadow={innerHTML:'',querySelectorAll:()=>[]};let appended=false;
    const host={style:{},setAttribute(){},attachShadow:()=>shadow};
    startSwitcher({location:{pathname:'/'+page,search:'',hash:''},document:{createElement:()=>host,body:{append(){appended=true;}}},addEventListener(){}});
    assert.equal(appended,true);assert.match(host.style.cssText,/bottom:16px;left:16px/);
    assert.match(shadow.innerHTML,/C · V4/);assert.doesNotMatch(shadow.innerHTML,/data-palette|data-down-toggle|<details>/);
  }
});

test('retired V3 redirects to V4 while retaining section and layout state',()=>{
  const html=fs.readFileSync(require.resolve('../jll-remix-main-v3.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const hash of ['','#hw-future']){
    let destination;
    vm.runInNewContext(script,{window:{location:{search:'?layout=desktop&embed=1',hash,replace(url){destination=url;}}}});
    assert.equal(destination,'jll-remix-main-v4.html?layout=desktop&embed=1'+(hash||'#hw-intro'));
  }
});

test('approved V4 uses the cool foundation surface without loading the old palette switcher',()=>{
  const html=fs.readFileSync(require.resolve('../jll-remix-main-v4.html'),'utf8');
  const css=fs.readFileSync(require.resolve('../jll-remix-main-v4.css'),'utf8');
  assert.doesNotMatch(html,/jll-remix-main-switcher/);
  assert.match(html,/id="hw-vision"[^>]*data-vision-palette="v1"/);
  assert.match(css,/--vision-background:var\(--surface-cool\)/);
  assert.doesNotMatch(css,/data-vision-palette="v[234]"/);
});


test('mobile story measurement reserves the section rail and safe area after rotation',()=>{
  const h=fixture();
  for(const width of [320,360,390,430,768]){
    h.hero.offsetWidth=width;h.bar.offsetWidth=width-40;
    h.bar.offsetHeight=210;h.bar.bottom=114;h.copy.offsetHeight=240;
    h.events.resize();
    assert.equal(h.values['--main-stories-height'],'324px');
    assert.equal(h.values['--main-story-copy-height'],'240px');
    assert.equal(h.values['--main-down-bottom'],'348px');
  }
  h.hero.offsetWidth=1440;h.bar.offsetWidth=1200;h.bar.bottom=0;
  h.events.resize();
  assert.equal(h.values['--main-stories-height'],'210px');
  assert.equal(h.values['--main-down-bottom'],'24px');
});
