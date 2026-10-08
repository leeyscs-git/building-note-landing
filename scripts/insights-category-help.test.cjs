const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {categoryHelp}=require('../jll-remix-journal-v2.js');
function harness({scale=1,width=350}={}) {
  const docEvents={},winEvents={};
  const rect=(left,w)=>({left:left*scale,right:(left+w)*scale,width:w*scale});
  const wrap={offsetWidth:width,getBoundingClientRect:()=>rect(20,width)};
  const groups=[60,width-50].map(x=>{
    const group={dataset:{},events:{},hovered:false,focused:false};
    const button={events:{},getBoundingClientRect:()=>rect(20+x,28),addEventListener:(name,fn)=>button.events[name]=fn};
    const tip={style:{setProperty(name,value){this[name]=value;}}};
    Object.assign(group,{
      querySelector:selector=>selector==='[data-help-trigger]'?button:tip,
      closest:()=>wrap,
      getBoundingClientRect:()=>button.getBoundingClientRect(),
      addEventListener:(name,fn)=>group.events[name]=fn,
      hasAttribute:name=>name==='data-open'?'open' in group.dataset:'dismissed' in group.dataset,
      contains:target=>[group,button,tip].includes(target),
      button,tip
    });
    return group;
  });
  const doc={
    querySelectorAll:()=>groups,
    addEventListener:(name,fn)=>docEvents[name]=fn
  };
  const win={
    document:doc,
    getComputedStyle:tip=>{
      const group=groups.find(g=>g.tip===tip);
      return {visibility:!('dismissed' in group.dataset)&&(group.hovered||group.focused||'open' in group.dataset)?'visible':'hidden'};
    },
    addEventListener:(name,fn)=>winEvents[name]=fn
  };
  categoryHelp(win);
  return {groups,docEvents,winEvents,wrap};
}
test('tooltip stays within content rails in responsive and scaled desktop views',()=>{
  for(const scale of [1,.32]){
    const {groups,wrap}=harness({scale});
    for(const group of groups){
      group.events.pointerenter({pointerType:'mouse'});
      const width=parseFloat(group.tip.style.width);
      const center=group.getBoundingClientRect().left/scale+parseFloat(group.tip.style.left);
      const bounds=wrap.getBoundingClientRect();
      assert(center-width/2>=bounds.left/scale-.01);
      assert(center+width/2<=bounds.right/scale+.01);
      assert.equal(width,280);
    }
  }
});
test('keyboard Escape dismisses help until re-entry without changing tab selection',()=>{
  const {groups,docEvents}=harness();
  const group=groups[0];
  group.focused=true;
  group.button.events.focus();
  const event={key:'Escape',preventDefault(){this.prevented=true;}};
  docEvents.keydown(event);
  assert.equal(event.prevented,true);
  assert('dismissed' in group.dataset);
  group.button.events.click();
  assert('open' in group.dataset,'keyboard activation can reopen help after Escape');
  group.events.pointerleave({pointerType:'mouse'});
  group.events.pointerenter({pointerType:'mouse'});
  assert(!('dismissed' in group.dataset));
});
test('touch toggles help, retains it after pointer exit and closes outside or on article navigation',()=>{
  const {groups,docEvents}=harness();
  const group=groups[1];
  group.button.events.click();
  group.events.pointerleave({pointerType:'touch'});
  assert('open' in group.dataset);
  docEvents.pointerdown({target:group.tip});
  assert('open' in group.dataset);
  docEvents.pointerdown({target:{}});
  assert(!('open' in group.dataset));
  group.button.events.click();
  assert('open' in group.dataset);
  group.button.events.click();
  assert(!('open' in group.dataset));
  group.button.events.click();
  docEvents['sps-journal-render']({detail:{view:'article'}});
  assert(!('open' in group.dataset));
});

test('moving keyboard focus away dismisses help, and opening another icon closes the previous tooltip',()=>{
  const {groups}=harness();
  groups[0].button.events.click();assert('open' in groups[0].dataset);
  groups[1].button.events.click();assert(!('open' in groups[0].dataset));assert('open' in groups[1].dataset);
  groups[1].events.focusout({relatedTarget:groups[1].tip});assert('open' in groups[1].dataset);
  groups[1].events.focusout({relatedTarget:null});assert(!('open' in groups[1].dataset));
});

test('only the dedicated help icons describe tooltips; category buttons remain independent filter actions',()=>{
  const html=fs.readFileSync(require.resolve('../jll-remix-journal-v2.html'),'utf8');
  for(const [category,name] of [['journal','CEO 저널'],['research','리서치']]){
    const categoryTag=html.match(new RegExp('<button[^>]+data-category="'+category+'"[^>]*>'))[0];
    assert.doesNotMatch(categoryTag,/aria-describedby|data-help-trigger/);
    const helpTag=html.match(new RegExp('<button[^>]+data-help-trigger[^>]+aria-label="'+name+' 설명"[^>]*>'))[0];
    assert.match(helpTag,new RegExp('aria-describedby="iv2-'+category+'-help"'));
    assert.doesNotMatch(helpTag,/data-category|aria-pressed/);
  }
});
