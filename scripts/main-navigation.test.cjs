const test=require('node:test');
const assert=require('node:assert/strict');
const {start}=require('../jll-remix-main-navigation.js');

function fixture(){
  let menu=false,dialog=false;
  const host={hidden:false,inert:false,tweakHidden:false,hasAttribute(){return this.tweakHidden;}};
  const observers=[],docEvents={},winEvents={};
  const doc={hidden:false,body:{classList:{contains:()=>menu}},
    querySelector:selector=>selector==='.main-v4-page-nav'?host:selector==='dialog[open]'&&dialog?{}:null,
    querySelectorAll:()=>[],addEventListener:(name,fn)=>docEvents[name]=fn};
  const win={document:doc,addEventListener:(name,fn)=>winEvents[name]=fn,
    MutationObserver:class{constructor(fn){observers.push(fn);}observe(){}}};
  start(win);
  return {host,doc,docEvents,winEvents,
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
