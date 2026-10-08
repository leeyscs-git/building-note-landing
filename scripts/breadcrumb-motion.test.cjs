const test=require('node:test');
const assert=require('node:assert/strict');
const {breadcrumbMotion}=require('../jll-remix-content-archive.js');

function fixture({gap=12,reduced=false,hidden=false,animate=true}={}){
  const motions=[],events={},docEvents={},parent={},documentElement={};
  const media={matches:reduced,addEventListener(name,fn){this[name]=fn;}};
  function item(){
    const node={hidden:true,inert:false,offsetWidth:80,parentElement:parent,attrs:{},live:null,
      setAttribute(name,value){this.attrs[name]=value;},removeAttribute(name){delete this.attrs[name];}
    };
    if(animate)node.animate=(frames,timing)=>{
      const motion={frames,timing,cancel(){this.cancelled=true;node.live=null;},finish(){this.onfinish?.();}};
      node.live=frames[0];motions.push(motion);return motion;
    };
    return node;
  }
  const step=item();let copy=item();
  const root={querySelector:()=>step,querySelectorAll:()=>[step,copy]};
  const doc={hidden,documentElement,addEventListener(name,fn){docEvents[name]=fn;}};
  const win={document:doc,matchMedia:()=>media,addEventListener(name,fn){events[name]=fn;},
    getComputedStyle(node){
      if(node===documentElement)return {getPropertyValue:key=>({'--reveal-duration':'800','--ease-editorial':'ease-out'}[key]||'')};
      if(node===parent)return {columnGap:gap+'px'};
      return node.live||{width:node.offsetWidth+'px',marginLeft:'0px',opacity:'1'};
    }
  };
  const update=breadcrumbMotion(win,root);
  function render(expanded){update(()=>{
    step.hidden=!expanded;
    // The article controller replaces the photo-backed copy on every route.
    copy=item();copy.hidden=!expanded;
  });}
  return {render,step,copy:()=>copy,motions,events,docEvents,media,doc};
}

test('adding a breadcrumb grows left without a gap jump, including its photo-backed copy',()=>{
  for(const gap of [12,6]){
    const h=fixture({gap});h.render(false);assert.equal(h.motions.length,0);
    h.render(true);assert.equal(h.motions.length,2);
    const motion=h.motions[0],from=motion.frames[0],to=motion.frames[1];
    assert.equal(parseFloat(from.width)+parseFloat(from.marginLeft)+gap,0,'existing crumbs start at their old position');
    assert.equal(parseFloat(to.width)+parseFloat(to.marginLeft)+gap,80+gap,'ancestors shift by exactly the new step width');
    assert.equal(from.opacity,0);assert.equal(to.opacity,1);
    assert.deepEqual(h.motions[1].frames,motion.frames);
    assert.equal(motion.timing.duration,800);
    motion.finish();assert.equal(h.step.hidden,false);assert.equal(h.copy().hidden,false);
    assert.ok(h.motions.every(motion=>motion.cancelled));
  }
});

test('returning collapses the reading step before hiding it and excludes it from accessibility immediately',()=>{
  const h=fixture();h.render(true);assert.equal(h.motions.length,0,'direct article loads without a synthetic transition');
  h.render(false);
  assert.equal(h.step.hidden,false);assert.equal(h.step.inert,true);assert.equal(h.step.attrs['aria-hidden'],'true');
  const motion=h.motions[0];
  assert.equal(motion.frames[0].width,'80px');assert.equal(motion.frames[1].width,'0px');
  motion.finish();assert.equal(h.step.hidden,true);assert.equal(h.copy().hidden,true);
  assert.equal(h.step.inert,false);assert.equal(h.step.attrs['aria-hidden'],undefined);
});

test('rapid navigation reverses from the displayed width and stale completion cannot hide the new route',()=>{
  const h=fixture();h.render(false);h.render(true);const opening=h.motions[0];
  h.step.live={width:'36px',marginLeft:'-6px',opacity:'.5'};
  h.render(false);const closing=h.motions[2];
  assert.equal(opening.cancelled,true);assert.equal(closing.frames[0].width,'36px');
  h.step.live={width:'20px',marginLeft:'-9px',opacity:'.25'};
  h.render(true);const reopening=h.motions[4];
  assert.equal(reopening.frames[0].width,'20px');assert.equal(closing.cancelled,true);
  closing.finish();assert.equal(h.step.hidden,false);
  reopening.finish();assert.equal(h.step.hidden,false);assert.equal(h.step.inert,false);
});

test('same-route renders and reduced, background or unsupported motion settle directly',()=>{
  for(const options of [{reduced:true},{hidden:true},{animate:false}]){
    const h=fixture(options);h.render(false);h.render(true);assert.equal(h.motions.length,0);assert.equal(h.step.hidden,false);
    h.render(false);assert.equal(h.step.hidden,true);
  }
  const h=fixture();h.render(false);h.render(false);assert.equal(h.motions.length,0);
  h.render(true);h.render(true);assert.equal(h.motions.length,2);assert.equal(h.step.hidden,false);
  assert.ok(h.motions.every(motion=>motion.cancelled));
});

test('resize, theme changes and motion preferences clean up the current route without stale inline widths',()=>{
  for(const cancel of [h=>h.events.resize(),h=>h.events['sps-theme-change'](),h=>h.media.change({matches:true}),h=>{h.doc.hidden=true;h.docEvents.visibilitychange();}]){
    const h=fixture();h.render(true);h.render(false);cancel(h);
    assert.equal(h.step.hidden,true);assert.equal(h.step.live,null);assert.ok(h.motions.every(motion=>motion.cancelled));
  }
});
