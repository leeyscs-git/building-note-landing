const test=require('node:test');
const assert=require('node:assert/strict');
const {start}=require('../jll-remix-main-navigation.js');

function fixture(width=1600){
  let menu=false,dialog=false;
  const host={hidden:false,inert:false,tweakHidden:false,hasAttribute(){return this.tweakHidden;}};
  const tokens={'--content-max':'1200px','--page-gutter':'96px'};
  const observers=[],docEvents={},winEvents={};
  const doc={hidden:false,documentElement:{},body:{classList:{contains:()=>menu}},
    querySelector:selector=>selector==='.main-v4-page-nav'?host:selector==='dialog[open]'&&dialog?{}:null,
    querySelectorAll:()=>[],addEventListener:(name,fn)=>docEvents[name]=fn};
  const win={document:doc,innerWidth:width,getComputedStyle:()=>({getPropertyValue:name=>tokens[name]||''}),addEventListener:(name,fn)=>winEvents[name]=fn,
    MutationObserver:class{constructor(fn){observers.push(fn);}observe(){}}};
  start(win);
  return {host,doc,docEvents,winEvents,tokens,
    resize(width){win.innerWidth=width;winEvents.resize();},
    block(kind,on){if(kind==='menu')menu=on;else if(kind==='dialog')dialog=on;else if(kind==='footer')host.inert=on;else if(kind==='tweak')host.tweakHidden=on;else doc.hidden=on;observers.forEach(fn=>fn());}
  };
}

test('the section rail stays visible without a timer and yields to menus, dialogs and footer',()=>{
  const h=fixture();
  assert.equal(h.host.hidden,false);
  for(const kind of ['menu','dialog','footer']){
    h.block(kind,true);assert.equal(h.host.hidden,true);
    h.block(kind,false);assert.equal(h.host.hidden,false);
  }
  h.block('menu',true);h.block('dialog',true);h.block('menu',false);
  assert.equal(h.host.hidden,true);
  h.block('dialog',false);assert.equal(h.host.hidden,false);
});

test('background and page restoration update visibility without overriding footer state',()=>{
  const h=fixture();
  h.doc.hidden=true;h.docEvents.visibilitychange();assert.equal(h.host.hidden,true);
  h.doc.hidden=false;h.winEvents.pageshow();assert.equal(h.host.hidden,false);
  h.block('footer',true);h.winEvents.pageshow();assert.equal(h.host.hidden,true);
  assert.doesNotThrow(()=>start({document:{querySelector:()=>null}}));
});

test('a manually hidden rail stays hidden across section, menu and page restoration updates',()=>{
  const h=fixture();
  h.block('tweak',true);assert.equal(h.host.hidden,true);
  for(const kind of ['menu','dialog','footer']){
    h.block(kind,true);h.block(kind,false);assert.equal(h.host.hidden,true);
  }
  h.winEvents.pageshow();assert.equal(h.host.hidden,true);
  h.block('footer',true);h.block('tweak',false);assert.equal(h.host.hidden,true);
  h.block('footer',false);assert.equal(h.host.hidden,false);
});

test('mobile and viewports narrower than the full desktop header never show the section menu',()=>{
  for(const width of [320,390,768,850,980,1200,1391]){
    const h=fixture(width);
    assert.equal(h.host.hidden,true,'hidden at '+width);
    h.block('tweak',true);h.block('tweak',false);
    h.winEvents.pageshow();
    assert.equal(h.host.hidden,true,'manual show cannot override narrow layout');
    h.resize(1392);
    assert.equal(h.host.hidden,false,'restored at full header width');
    h.resize(width);
    assert.equal(h.host.hidden,true,'hidden again on resize');
  }
});

test('resizing preserves manual and menu visibility choices',()=>{
  const h=fixture(390);
  h.block('tweak',true);h.resize(1600);
  assert.equal(h.host.hidden,true);
  h.block('tweak',false);assert.equal(h.host.hidden,false);
  h.block('menu',true);h.resize(390);h.resize(1600);
  assert.equal(h.host.hidden,true);
  h.block('menu',false);assert.equal(h.host.hidden,false);
});

test('foundation changes update the header width threshold while mobile always remains hidden',()=>{
  const h=fixture(1400);
  assert.equal(h.host.hidden,false);
  h.tokens['--content-max']='1320px';h.winEvents['sps-theme-change']();
  assert.equal(h.host.hidden,true);
  h.tokens['--page-gutter']='0px';h.winEvents['sps-theme-change']();
  assert.equal(h.host.hidden,false);
  h.tokens['--content-max']='600px';h.resize(850);
  assert.equal(h.host.hidden,true);
  delete h.tokens['--content-max'];delete h.tokens['--page-gutter'];
  h.resize(1463);assert.equal(h.host.hidden,true);
  h.resize(1464);assert.equal(h.host.hidden,false);
});
