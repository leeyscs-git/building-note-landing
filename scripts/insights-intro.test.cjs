const test=require('node:test');
const assert=require('node:assert/strict');
const {start}=require('../jll-remix-insights-intro.js');
const presentation=require('../jll-remix-journal-v2.js');

function harness(search=''){
  let menu=false,dialog=false;
  const docEvents={},winEvents={},observers=[];
  const element=()=>({attrs:{},events:{},hidden:false,
    setAttribute(k,v){this.attrs[k]=v;},
    toggleAttribute(k,on){if(on)this.attrs[k]='';else delete this.attrs[k];},
    addEventListener(k,fn){this.events[k]=fn;}
  });
  const host=element(),panel=element(),toggle=element(),link=element(),index={hidden:false};
  host.querySelector=selector=>({'.iv2-first-read-panel':panel,'.iv2-first-read-toggle':toggle,'[data-article]':link}[selector]);
  panel.contains=target=>[panel,link].includes(target);
  const doc={hidden:false,activeElement:null,body:{classList:{contains:()=>menu}},
    querySelector:selector=>selector==='.iv2-first-read'?host:selector==='dialog[open]'&&dialog?{}:null,
    getElementById:()=>index,addEventListener:(name,fn)=>docEvents[name]=fn
  };
  toggle.focus=()=>{doc.activeElement=toggle;};
  const win={document:doc,location:new URL('http://localhost:3000/jll-remix-journal-v2.html'+search),
    SPSJournalPresentation:presentation,
    setTimeout(){throw Error('Manual card must not schedule automatic opening or closing');},
    requestAnimationFrame(){throw Error('Manual card does not wait for entry animations');},
    addEventListener:(name,fn)=>winEvents[name]=fn,
    MutationObserver:class {constructor(fn){observers.push(fn);}observe(){}}
  };
  start(win);
  return {win,doc,host,panel,toggle,link,index,docEvents,winEvents,
    isOpen:()=>toggle.attrs['aria-expanded']==='true',
    route(search,article=false){win.location.search=search;index.hidden=article;docEvents['sps-journal-render']();},
    block(type,value){if(type==='menu')menu=value;else dialog=value;observers.forEach(fn=>fn());}
  };
}

test('fresh visits and list lifecycle events keep the card folded without entry timers',()=>{
  for(let visit=0;visit<2;visit++){
    const h=harness();
    assert.equal(h.host.hidden,false);assert.equal(h.isOpen(),false);
    assert.equal(h.panel.inert,true);assert.equal(h.panel.attrs['aria-hidden'],'true');
    assert.match(h.toggle.attrs['aria-label'],/열기$/);
    assert.equal(h.winEvents.load,undefined);
    h.docEvents['sps-journal-render']();h.winEvents.pageshow();h.winEvents.popstate();
    assert.equal(h.isOpen(),false);assert.equal(h.doc.activeElement,null);
  }
});

test('the arrow alone opens and closes the card while retaining the article route',()=>{
  const h=harness('?category=journal&layout=desktop&titleLabel=below');
  h.toggle.events.click();assert.equal(h.isOpen(),true);
  assert.equal(h.panel.inert,false);assert.equal(h.panel.attrs['aria-hidden'],'false');
  assert.match(h.toggle.attrs['aria-label'],/접기$/);
  const url=new URL(h.link.href,h.win.location);
  assert.equal(url.searchParams.get('article'),'why-we-work');
  assert.equal(url.searchParams.get('category'),'journal');
  assert.equal(url.searchParams.get('layout'),'desktop');
  assert.equal(url.searchParams.has('titleLabel'),false);
  h.docEvents['sps-journal-render']();assert.equal(h.isOpen(),true);
  h.toggle.events.click();assert.equal(h.isOpen(),false);assert.equal(h.panel.inert,true);
});

test('Escape folds a manually opened card and restores only enclosed focus',()=>{
  const h=harness();h.toggle.events.click();h.doc.activeElement=h.link;
  const escape={key:'Escape',preventDefault(){this.prevented=true;}};
  h.docEvents.keydown(escape);assert.equal(h.isOpen(),false);assert.equal(escape.prevented,true);
  assert.equal(h.doc.activeElement,h.toggle);
  h.toggle.events.click();h.doc.activeElement=null;
  h.docEvents.keydown(escape);assert.equal(h.doc.activeElement,null);assert.equal(h.isOpen(),false);
});

test('article, research and embedded routes hide the card; list returns stay folded',()=>{
  const h=harness();h.toggle.events.click();
  h.route('?category=journal&article=why-we-work',true);
  assert.equal(h.host.hidden,true);assert.equal(h.panel.inert,true);
  h.route('?category=journal');assert.equal(h.host.hidden,false);assert.equal(h.isOpen(),false);
  for(const search of ['?category=research','?embed=1']){
    h.toggle.events.click();h.route(search);assert.equal(h.host.hidden,true);assert.equal(h.isOpen(),false);
    h.route('');assert.equal(h.host.hidden,false);assert.equal(h.isOpen(),false);
    const direct=harness(search);assert.equal(direct.host.hidden,true);assert.equal(direct.isOpen(),false);
  }
  assert.doesNotThrow(()=>start({document:{querySelector:()=>null}}));
});

test('menus, dialogs and background tabs never trigger automatic opening',()=>{
  const h=harness();
  for(const kind of ['menu','dialog']){
    h.block(kind,true);assert.equal(h.host.hidden,true);
    h.toggle.events.click();assert.equal(h.isOpen(),false);
    h.block(kind,false);assert.equal(h.host.hidden,false);assert.equal(h.isOpen(),false);
  }
  h.doc.hidden=true;h.docEvents.visibilitychange();assert.equal(h.host.hidden,true);
  h.doc.hidden=false;h.docEvents.visibilitychange();assert.equal(h.isOpen(),false);
  h.toggle.events.click();h.block('dialog',true);h.block('dialog',false);
  assert.equal(h.isOpen(),true,'an explicitly opened card retains the reader choice');
});
