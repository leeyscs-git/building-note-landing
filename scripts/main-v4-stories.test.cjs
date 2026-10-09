const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {start}=require('../jll-remix-main-v4.js');
const {start:startSwitcher}=require('../jll-remix-main-switcher.js');

function fixture({reduceMotion=false,deferImages=false}={}){
  const source=fs.readFileSync(require.resolve('../jll-remix.js'),'utf8');
  const context={window:{SPSHeader:{about:'jll-remix-about.html'}}};
  vm.runInNewContext(source.slice(0,source.indexOf('function closeMenu'))+';globalThis.storyData=slides;',context);
  const stories=Array.from(context.storyData),events={},values={},observers=[],dispatched=[],motions=[],intersections=[],pending=[];
  function element(tag='div'){
    return {tag,attributes:{},children:[],style:{},events:{},hidden:false,complete:true,naturalWidth:1600,
      setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];},
      addEventListener(name,callback){this.events[name]=callback;},append(child){this.children.push(child);},
      contains(target){return target===this||this.children.includes(target);},remove(){this.removed=true;},
      animate(frames,options){
        const animation={target:this,frames,options,playState:'running',cancel(){this.cancelled=true;this.playState='idle';},pause(){this.playState='paused';},play(){this.playState='running';},finish(){this.playState='finished';this.onfinish?.();}};
        motions.push(animation);return animation;
      },
      decode(){return deferImages?new Promise((resolve,reject)=>pending.push({image:this,resolve,reject})):Promise.resolve();}
    };
  }
  const buttons=stories.map((_,index)=>({...element('button'),dataset:{slide:String(index)},active:false,
    classList:{toggle(name,value){buttons[index].active=value;}}}));
  const title={html:'',writes:0,get innerHTML(){return this.html;},set innerHTML(value){this.html=value;this.writes++;}};
  const copy={offsetHeight:230},photo=element('img'),video={...element('video'),hidden:true,pauses:0,pause(){this.pauses++;}};
  const layers=[photo,video],shade={before(image){layers.push(image);}};
  const hero={...element(),offsetWidth:1480,style:{setProperty(name,value){values[name]=value;}},querySelector:selector=>({'.hw-hero-copy':copy,'#hw-title':title,'.hw-hero-image':photo,'.hw-hero-video':video,'.hw-hero-shade':shade})[selector]};
  const playButton=element('button');
  const bar={...element(),offsetWidth:1200,offsetHeight:138,bottom:24,closest:()=>hero,querySelectorAll:()=>buttons,querySelector:()=>playButton};
  const reduced={matches:reduceMotion,addEventListener(name,callback){this[name]=callback;}};
  const doc={hidden:false,modal:false,createElement:element,querySelector:s=>s==='.main-v4-stories'?bar:doc.modal?{}:null,addEventListener(name,callback){events['doc:'+name]=callback;}};
  const win={document:doc,matchMedia:()=>reduced,getComputedStyle:e=>({bottom:e===bar?bar.bottom+'px':'auto',transform:'matrix(1.02,0,0,1.02,0,0)'}),requestAnimationFrame:fn=>fn(),addEventListener(name,callback){events[name]=callback;},dispatchEvent(event){dispatched.push(event.type);},CustomEvent:class{constructor(type){this.type=type;}},
    IntersectionObserver:class{constructor(callback){intersections.push(callback);}observe(){}},
    ResizeObserver:class{constructor(callback){this.callback=callback;}observe(target,options){observers.push({target,options,callback:this.callback});}}};
  start(win,stories);
  return {stories,buttons,title,copy,hero,bar,events,values,observers,photo,video,dispatched,motions,intersections,reduced,doc,layers,playButton,pending,
    choose:index=>buttons[index].events.click(),
    motion:duration=>motions.findLast(m=>m.options.duration===duration),
    photos:()=>layers.filter(layer=>layer.tag==='img'&&!layer.removed)
  };
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('manual selection crossfades loaded photos and maintains one selected story and image after each transition',async()=>{
  const h=fixture();
  assert.ok(h.title.innerHTML.includes('더 나은 내일을 위한'));
  for(const index of [1,2,3,0]){
    await h.choose(index);
    assert.equal(h.buttons.filter(button=>button.attributes['aria-pressed']==='true').length,1);
    assert.equal(h.buttons[index].active,true);
    for(const line of h.stories[index].title.split('<br>'))assert.ok(h.title.innerHTML.includes(line));
    assert.deepEqual(h.motion(950).frames,[{opacity:0},{opacity:1}]);
    h.motion(950).finish();
    assert.equal(h.photos().length,index===3?0:1);
    assert.equal(h.video.hidden,index!==3);
    if(index!==3)assert.equal(h.photos()[0].src,h.stories[index].image);
  }
  assert.ok(h.video.pauses>0);
});

test('automatic playback advances after 7200ms, waits for the fade, and wraps from film to first photo',async()=>{
  const h=fixture();
  for(const index of [1,2,3,0]){
    h.motion(7200).finish();await settle();
    assert.equal(h.buttons[index].active,true);
    assert.equal(h.motion(7200).playState,'paused','do not count reading time during the fade');
    h.motion(950).finish();assert.equal(h.motion(7200).playState,'running');
  }
});

test('superseded image loads, repeated tabs and failed loads leave a readable current story',async()=>{
  const h=fixture({deferImages:true});
  const slow=h.choose(1),latest=h.choose(2);
  h.pending[1].resolve();await latest;h.pending[0].resolve();await slow;
  assert.equal(h.buttons[2].active,true);assert.equal(h.photos().length,2);
  h.motion(950).finish();assert.equal(h.photos().length,1);
  const writes=h.title.writes;await h.choose(2);assert.equal(h.title.writes,writes);
  const pending=h.choose(1);await h.choose(2);h.pending[2].resolve();await pending;
  assert.equal(h.buttons[2].active,true);assert.equal(h.title.writes,writes);
  const failed=h.choose(0);h.pending[3].reject(Error('image offline'));await failed;
  assert.equal(h.buttons[2].active,true);assert.equal(h.photos().length,1);
  assert.equal(h.motion(7200).playState,'running');
});

test('rapid selections discard interrupted image layers and cancel their animations',async()=>{
  const h=fixture();await h.choose(1);const fade=h.motion(950),zoom=h.motion(8500);
  await h.choose(2);
  assert.equal(fade.cancelled,true);assert.equal(zoom.cancelled,true);
  assert.equal(h.photos().length,2);
  h.motion(950).finish();assert.equal(h.photos().length,1);
  await h.choose(3);await h.choose(1);
  h.motion(950).finish();assert.equal(h.video.hidden,true);assert.equal(h.photos().length,1);
});

test('offscreen, hidden, hover, focus, dialog and explicit pause gates stop automatic progress and photo zoom',()=>{
  const h=fixture();
  const state=expected=>{assert.equal(h.motion(7200).playState,expected);assert.equal(h.motion(8500).playState,expected);};
  state('running');
  h.intersections[0]([{isIntersecting:false}]);state('paused');
  h.intersections[0]([{isIntersecting:true}]);state('running');
  h.doc.hidden=true;h.events['doc:visibilitychange']();state('paused');
  h.doc.hidden=false;h.events['doc:visibilitychange']();state('running');
  h.bar.events.pointerover({target:h.buttons[0]});state('paused');
  h.bar.events.pointerleave();state('running');
  h.hero.events.focusin({target:h.buttons[0]});state('paused');
  h.hero.events.focusout();state('running');
  h.doc.modal=true;h.events['doc:visibilitychange']();state('paused');
  h.doc.modal=false;h.events['doc:visibilitychange']();state('running');
  h.playButton.events.click();state('paused');assert.equal(h.playButton.attributes['aria-pressed'],'true');
  h.intersections[0]([{isIntersecting:false}]);h.intersections[0]([{isIntersecting:true}]);state('paused');
  h.playButton.events.click();state('running');
});

test('reduced motion disables autoplay, zoom and fades while preserving manual selection',async()=>{
  const h=fixture({reduceMotion:true});
  assert.equal(h.motions.length,0);assert.equal(h.playButton.disabled,true);
  await h.choose(1);assert.equal(h.buttons[1].active,true);assert.equal(h.photos().length,1);assert.equal(h.motions.length,0);
  h.reduced.matches=false;h.reduced.change();assert.equal(h.playButton.disabled,false);
  assert.equal(h.motion(7200).playState,'running');
  await h.choose(2);const fade=h.motion(950);h.reduced.matches=true;h.reduced.change();
  assert.equal(fade.cancelled,true);assert.equal(h.photos().length,1);
  assert.equal(h.motion(8500).cancelled,true);assert.equal(h.motion(7200).cancelled,true);
});

test('mobile indicators keep autoplay after touch selection but pause for keyboard reading',async()=>{
  const h=fixture();
  const indicator=h.buttons[1];
  indicator.matches=()=>false;
  h.bar.events.pointerover({target:indicator,pointerType:'touch'});
  h.hero.events.focusin({target:indicator});
  assert.equal(h.motion(7200).playState,'running');
  await h.choose(1);
  assert.equal(indicator.attributes['aria-pressed'],'true');
  h.motion(950).finish();
  assert.equal(h.motion(7200).playState,'running');
  h.motion(7200).finish();await settle();
  assert.equal(h.buttons[2].active,true);
  h.motion(950).finish();
  indicator.matches=()=>true;
  h.hero.events.focusin({target:indicator});
  assert.equal(h.motion(7200).playState,'paused');
  h.playButton.events.click();
  h.bar.events.pointerover({target:indicator,pointerType:'touch'});
  indicator.matches=()=>false;h.hero.events.focusin({target:indicator});
  assert.equal(h.motion(7200).playState,'paused','touch does not undo an explicit pause');
});

test('the title follows the measured floating bar on mobile, resizing, theme edits and inset-only edits',()=>{
  const h=fixture();
  assert.equal(h.values['--main-stories-height'],'162px');
  for(const width of [320,390,768,1480]){
    const barHeight=width<=850?52:220;
    h.hero.offsetWidth=width;h.bar.offsetHeight=barHeight;h.copy.offsetHeight=280;h.bar.bottom=32;
    h.events['sps-main-layout-change']();
    assert.equal(h.values['--main-stories-height'],(barHeight+32)+'px');assert.equal(h.values['--main-story-copy-height'],'280px');
  }
  h.bar.offsetHeight=180;h.observers.find(item=>item.target===h.bar).callback();
  assert.equal(h.values['--main-stories-height'],'212px');
  h.copy.offsetHeight=300;h.events['sps-theme-change']();assert.equal(h.values['--main-story-copy-height'],'300px');
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

test('V4 uses the neutral black-to-white vision without loading the old palette switcher',()=>{
  const html=fs.readFileSync(require.resolve('../jll-remix-main-v4.html'),'utf8');
  const css=fs.readFileSync(require.resolve('../jll-remix-main-v4.css'),'utf8');
  assert.doesNotMatch(html,/jll-remix-main-switcher/);
  assert.match(html,/id="hw-vision"[^>]*data-vision-palette="black-white"[^>]*data-vision-exit="with-last-scene"/);
  assert.match(css,/--vision-black:#181818/);
  assert.match(css,/data-vision-exit="with-last-scene"[^}]*height:calc\(var\(--hw-height\) \* 6\.6 \+ var\(--hw-stage-height\)\)/);
  assert.doesNotMatch(css,/data-vision-palette="v[234]"/);
});


test('V4 removes the down link and its control, retaining the foundation radius and accessible playback control',()=>{
  const html=fs.readFileSync(require.resolve('../jll-remix-main-v4.html'),'utf8');
  assert.doesNotMatch(html,/hw-down|main-v4-down-toggle/);
  assert.match(html,/class="main-v4-playback"[^>]*aria-label=/);
  assert.match(html,/id="hw-story-copy" aria-live="off"/);
});
