const test=require('node:test');
const assert=require('node:assert/strict');
const {articleHero,heroFrame,navPhotoBounds}=require('../jll-remix-journal-v2.js');

test('portrait opens continuously to full width and clamps in both scroll directions',()=>{
  const start=heroFrame(-1,1230,640,280);
  assert.equal(1230-start.insetX*2,280);
  assert.equal(start.insetBottom,0);
  const middle=heroFrame(.5,1230,640,280);
  assert.ok(middle.insetX>0&&middle.insetX<start.insetX);
  assert.equal(middle.insetBottom,0);
  assert.deepEqual(heroFrame(2,1230,640,280),{insetTop:0,insetX:0,insetBottom:0,scale:1});
  assert.deepEqual(heroFrame(0,1230,640,280),start);
});

function harness(scale=1) {
  const events={},mediaEvents={},queue=[];
  const style=()=>({setProperty(name,value){this[name]=value;},removeProperty(name){delete this[name];}});
  function node(attrs={}) {
    return {
      attrs:{...attrs},style:style(),children:[],
      setAttribute(name,value){this.attrs[name]=value;},
      removeAttribute(name){delete this.attrs[name];},
      append(child){this.children.push(child);child.parent=this;},
      remove(){this.parent.children=this.parent.children.filter(child=>child!==this);},
      querySelectorAll(selector){return this.children.filter(child=>selector==='a'?'href' in child.attrs:selector==='[id]'?'id' in child.attrs:'data-journal-back' in child.attrs);}
    };
  }
  const navInner={cloneNode(){
    const copy=node();
    copy.append(node({id:'iv2-article-back',href:'index.html','data-journal-back':''}));
    copy.append(node({id:'iv2-breadcrumb-back',href:'index.html','data-journal-back':''}));
    copy.append(node({id:'iv2-breadcrumb-current'}));
    return copy;
  }};
  const image={style:style()};
  const frame={style:style(),querySelector:()=>image};
  const article={style:style(),offsetWidth:1038,getBoundingClientRect:()=>({width:1038*scale}),querySelector:selector=>selector==='.iv2-article-content'?content:null};
  const head={height:120,headingOffset:45,getBoundingClientRect:()=>({top:sceneTop()*scale,height:head.height*scale}),querySelector:selector=>selector==='h1'?heading:null};
  const heading={getBoundingClientRect:()=>({top:(sceneTop()+head.headingOffset)*scale,bottom:(sceneTop()+head.height)*scale,height:(head.height-head.headingOffset)*scale})};
  const figure={};
  const overlay={style:style()};
  const intro={style:style(),pinned:false,querySelector:selector=>selector==='.iv2-title-overlay'?overlay:head,toggleAttribute(name,value){this.pinned=value;},getBoundingClientRect:()=>({top:254*scale-win.scrollY})};
  const stage={style:style(),closest:selector=>selector==='.journal-article'?article:selector==='.iv2-article-intro'?intro:figure,querySelector:()=>frame};
  const header={getBoundingClientRect:()=>({height:137*scale})};
  const nav=Object.assign(node(),{
    getBoundingClientRect:()=>{
      const shift=parseFloat(nav.style['--iv2-nav-shift'])||0;
      return {left:0,right:1230*scale,top:(137+shift)*scale,bottom:(206+shift)*scale,width:1230*scale,height:69*scale};
    },
    querySelector:()=>navInner
  });
  const content={getBoundingClientRect:()=>({top:(254+parseFloat(intro.style['--iv2-scene-height'])+parseFloat(intro.style['--iv2-hero-travel']))*scale-win.scrollY})};
  function sceneTop(){
    const travel=parseFloat(intro.style['--iv2-hero-travel'])||0;
    const overlap=parseFloat(article.style['--iv2-reading-overlap'])||0;
    return 254-Math.max(0,win.scrollY/scale-travel-overlap);
  }
  frame.getBoundingClientRect=()=>{
    const overhang=parseFloat(intro.style['--iv2-hero-overhang']);
    const height=parseFloat(intro.style['--iv2-hero-height']);
    const top=(sceneTop()-overhang)*scale;
    return {left:0,right:1230*scale,top,bottom:top+height*scale,width:1230*scale,height:height*scale};
  };
  let visible=true;
  const media={matches:false,addEventListener:(name,callback)=>mediaEvents[name]=callback};
  const win={
    scrollY:0,innerHeight:851*scale,
    document:{createElement:()=>node(),documentElement:{clientWidth:1230*scale},querySelector:selector=>selector==='[data-sps-header]'?header:selector==='.iv2-page-nav'?nav:(visible?stage:null)},
    matchMedia:()=>media,
    getComputedStyle:el=>el===article?{paddingTop:'48px'}:{getPropertyValue:()=> '64px'},
    requestAnimationFrame:callback=>{queue.push(callback);return queue.length;},
    addEventListener:(name,callback)=>events[name]=callback
  };
  const sync=articleHero(win);
  function flush(){while(queue.length)queue.shift()();}
  return {win,stage,intro,head,heading,overlay,frame,image,nav,article,content,media,mediaEvents,events,queue,sync,flush,hide(){visible=false;sync();},show(){visible=true;sync();}};
}

test('scroll progress uses rendered scale, restores on reverse scroll, and stops on the list',()=>{
  for(const scale of [1,.4]){
    const h=harness(scale);
    h.sync();h.flush();
    const initial=h.frame.style.clipPath;
    assert.equal(h.intro.style['--iv2-hero-width'],'1230px');
    assert.equal(h.intro.style['--iv2-scene-top'],'254px');
    assert.equal(h.intro.pinned,true);
    assert.equal(254+parseFloat(h.intro.style['--iv2-scene-height']),851);
    assert.ok(Math.abs(h.frame.getBoundingClientRect().bottom-h.win.innerHeight)<.001);
    assert.ok(initial.endsWith(' 0px)'));
    assert.equal(h.frame.style.clipPath.startsWith('inset(301px 435px'),true);
    assert.equal(1230-parseFloat(h.frame.style.clipPath.split(' ')[1])*2,360);
    h.win.scrollY=350*scale;h.events.scroll();h.flush();
    assert.notEqual(h.frame.style.clipPath,initial);
    h.win.scrollY=1000*scale;h.events.scroll();h.flush();
    assert.equal(h.frame.style.clipPath,'inset(0px 0px 0px)');
    h.win.scrollY=0;h.events.scroll();h.flush();
    assert.equal(h.frame.style.clipPath,initial);
    h.hide();h.events.scroll();
    assert.equal(h.queue.length,0);
    h.show();h.flush();
    assert.equal(h.frame.style.clipPath,initial);
  }
});

test('reduced motion removes the scroll runway and shows the complete photograph',()=>{
  const h=harness();
  h.sync();h.flush();
  h.media.matches=true;h.mediaEvents.change();h.flush();
  assert.equal(h.intro.style['--iv2-hero-travel'],'0px');
  assert.equal(h.intro.pinned,false);
  assert.equal(h.article.style['--iv2-reading-overlap'],'0px');
  assert.equal(h.frame.style.clipPath,'inset(0px 0px 0px)');
  assert.equal(h.image.style.transform,'scale(1)');
  h.media.matches=false;h.mediaEvents.change();h.flush();
  assert.notEqual(h.intro.style['--iv2-hero-travel'],'0px');
  assert.ok(parseFloat(h.article.style['--iv2-reading-overlap'])>0);
  assert.notEqual(h.frame.style.clipPath,'inset(0px 0px 0px)');
});

test('short viewport uses a readable static photo instead of pinning an overlapping title',()=>{
  const h=harness();
  h.win.innerHeight=500;
  h.sync();h.flush();
  assert.equal(h.intro.pinned,false);
  assert.equal(h.article.style['--iv2-reading-overlap'],'0px');
  assert.equal(h.intro.style['--iv2-hero-travel'],'0px');
  assert.equal(h.frame.style.clipPath,'inset(0px 0px 0px)');
  h.win.innerHeight=851;h.events.resize();h.flush();
  assert.equal(h.intro.pinned,true);
  assert.notEqual(h.frame.style.clipPath,'inset(0px 0px 0px)');
});

test('wrapped title sets the starting portrait below it and still allows the photo behind it',()=>{
  const h=harness();
  h.head.height=240;
  h.sync();h.flush();
  assert.equal(h.intro.pinned,true);
  assert.equal(h.intro.style['--iv2-hero-height'],'714px');
  assert.ok(h.frame.style.clipPath.startsWith('inset(421px '));
  assert.equal(parseFloat(h.intro.style['--iv2-scene-height'])+254,851);
  const visibleWidth=1230-parseFloat(h.frame.style.clipPath.split(' ')[1])*2;
  assert.ok(visibleWidth>260&&visibleWidth<360,'the wider crop still fits the remaining height below a wrapped title');
});

test('photo rises from below the heading to behind it while the title clip and shade follow',()=>{
  const state=heroFrame(0,1230,573,280,184);
  assert.equal(state.insetTop,184);
  assert.equal(573-state.insetTop-state.insetBottom,389);
  assert.ok(heroFrame(.7,1230,573,280,184).insetTop<120);
  assert.equal(heroFrame(1,1230,573,280,184).insetTop,0);
  const h=harness();h.sync();h.flush();
  const top=h.intro.style['--iv2-scene-top'];
  assert.equal(h.overlay.style.clipPath,h.frame.style.clipPath);
  assert.equal(h.intro.style['--iv2-hero-shade'],0);
  h.win.scrollY=400;h.events.scroll();h.flush();
  assert.equal(h.overlay.style.clipPath,h.frame.style.clipPath);
  assert.equal(h.intro.style['--iv2-scene-top'],top);
  assert.equal(h.intro.style['--iv2-hero-shade'],1);
  h.win.scrollY=0;h.events.scroll();h.flush();
  assert.equal(h.intro.style['--iv2-hero-shade'],0);
  assert.equal(h.overlay.style.clipPath,h.frame.style.clipPath);
});

test('expanded photo reaches the global header while preserving the starting portrait and title position',()=>{
  for(const scale of [1,.4]){
    const h=harness(scale);h.sync();h.flush();
    const overhang=parseFloat(h.intro.style['--iv2-hero-overhang']);
    assert.equal(overhang,117);
    const first=heroFrame(0,1230,690,280,301);
    const photo=h.frame.getBoundingClientRect();
    assert.equal(photo.top/scale+first.insetTop,438);
    assert.equal(photo.top/scale,137);
    assert.equal(h.intro.style['--iv2-scene-top'],'254px');
    assert.equal(h.intro.style['--iv2-scene-height'],'597px');
  }
});

test('navigation mask tracks partial coverage, full coverage and release in scaled screen coordinates',()=>{
  for(const scale of [1,.4]){
    const rect=(left,top,width,height)=>({left:left*scale,right:(left+width)*scale,top:top*scale,bottom:(top+height)*scale,width:width*scale,height:height*scale});
    const bar=rect(0,137,1230,69);
    const photo=rect(0,137,1230,690);
    assert.equal(navPhotoBounds(photo,heroFrame(0,1230,690,280,301),bar,scale),null);
    const partial=navPhotoBounds(photo,heroFrame(.8,1230,690,280,301),bar,scale);
    assert.ok(partial.top>0&&partial.top<69);
    assert.ok(partial.left>0&&partial.right<1230);
    assert.equal(partial.bottom,69);
    assert.deepEqual(navPhotoBounds(photo,heroFrame(1,1230,690,280,301),bar,scale),
      {left:0,right:1230,top:0,bottom:69,width:1230,height:69});
    assert.equal(navPhotoBounds(rect(0,-600,1230,690),heroFrame(1,1230,690,280,301),bar,scale),null);
  }
});

test('navigation keeps one set of usable links and restores photo contrast after reversing, list and reduced motion',()=>{
  const h=harness();h.sync();h.flush();
  const visual=h.nav.children[0];
  assert.equal(visual.attrs['aria-hidden'],'true');
  assert.ok('inert' in visual.attrs);
  assert.equal(visual.children[0].querySelectorAll('[id]').length,0);
  assert.equal(visual.children[0].querySelectorAll('[data-journal-back]').length,0);
  assert.ok(visual.children[0].children.every(child=>!('href' in child.attrs)));
  assert.equal(visual.hidden,true);
  h.win.scrollY=480;h.events.scroll();h.flush();
  assert.ok('data-photo-backed' in h.nav.attrs);
  assert.equal(visual.hidden,false);
  h.win.scrollY=0;h.events.scroll();h.flush();
  assert.ok(!('data-photo-backed' in h.nav.attrs));
  assert.equal(visual.hidden,true);
  h.win.scrollY=1400;h.events.scroll();h.flush();
  assert.equal(visual.hidden,true);
  h.win.scrollY=480;h.events.scroll();h.flush();
  assert.equal(visual.hidden,false);
  h.media.matches=true;h.mediaEvents.change();h.flush();
  assert.ok(!('data-photo-backed' in h.nav.attrs));
  assert.equal(visual.hidden,true);
  h.media.matches=false;h.mediaEvents.change();h.flush();
  assert.equal(visual.hidden,false);
  h.hide();h.flush();
  assert.ok(!('data-photo-backed' in h.nav.attrs));
  assert.equal(h.nav.children.length,0);
  h.show();h.flush();
  assert.equal(h.nav.children.length,1);
  assert.equal(h.nav.children[0].hidden,false);
});

test('navigation leaves with the title in pinned, reduced-motion and short layouts, then restores on return',()=>{
  const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<.001);
  for(const scale of [1,.4]){
    for(const mode of ['pinned','reduced','short']){
      const h=harness(scale);
      if(mode==='reduced')h.media.matches=true;
      if(mode==='short')h.win.innerHeight=500*scale;
      h.sync();h.flush();
      const titleTop=h.heading.getBoundingClientRect().top;
      const navTop=h.nav.getBoundingClientRect().top;
      const travel=parseFloat(h.intro.style['--iv2-hero-travel']);
      const overlap=parseFloat(h.article.style['--iv2-reading-overlap']);
      const release=travel+overlap;
      const scroll=y=>{h.win.scrollY=y*scale;h.events.scroll();h.flush();};
      for(const y of [0,release/2,release,release+30,release+80,1400,release+30,release,0]){
        scroll(y);
        const titleShift=h.heading.getBoundingClientRect().top-titleTop;
        near(h.nav.getBoundingClientRect().top-navTop,titleShift);
        assert.equal(h.nav.inert,titleShift<=-69*scale);
        if(y<=release)near(titleShift,0);
      }
      scroll(1400);assert.equal(h.nav.children[0].hidden,true);
      h.hide();h.flush();
      assert.equal(h.nav.style['--iv2-nav-shift'],undefined);
      assert.equal(h.nav.inert,false);
      h.show();h.flush();assert.equal(h.nav.inert,true);
      scroll(0);assert.equal(h.nav.inert,false);
      near(h.nav.getBoundingClientRect().top,navTop);
    }
  }
});

test('reading surface releases at equal space above and below the main title, then moves with it',()=>{
  const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<.001,`${actual} ≈ ${expected}`);
  for(const scale of [1,.4]){
    for(const [titleHeight,headingOffset] of [[120,45],[240,45],[145,70],[265,70]]){
      const h=harness(scale);
      h.head.height=titleHeight;
      h.head.headingOffset=headingOffset;
      h.sync();h.flush();
      const initial=h.frame.style.clipPath;
      const travel=parseFloat(h.intro.style['--iv2-hero-travel']);
      const overlap=parseFloat(h.article.style['--iv2-reading-overlap']);
      const scroll=y=>{h.win.scrollY=y*scale;h.events.scroll();h.flush();};
      const photo=()=>h.frame.getBoundingClientRect();
      const surface=()=>h.content.getBoundingClientRect().top/scale;
      const headline=()=>h.heading.getBoundingClientRect();
      assert.ok(overlap>0);
      scroll(travel);
      assert.equal(h.frame.style.clipPath,'inset(0px 0px 0px)');
      near(surface(),photo().bottom/scale);
      const pinnedTop=photo().top/scale;
      const spaceAbove=headline().top/scale-pinnedTop;
      scroll(travel+overlap/2);
      near(photo().top/scale,pinnedTop);
      assert.ok(surface()<photo().bottom/scale);
      assert.ok(surface()-headline().bottom/scale>spaceAbove);
      scroll(travel+overlap);
      near(photo().top/scale,pinnedTop);
      near(surface()-headline().bottom/scale,spaceAbove);
      const handoff=surface();
      const titleAtHandoff=headline().top/scale;
      scroll(travel+overlap+80);
      near(photo().top/scale,pinnedTop-80);
      near(surface(),handoff-80);
      near(headline().top/scale,titleAtHandoff-80);
      near(surface()-headline().bottom/scale,spaceAbove);
      scroll(travel+overlap/2);
      near(photo().top/scale,pinnedTop);
      scroll(0);
      assert.equal(h.frame.style.clipPath,initial);
      h.hide();h.flush();
      assert.equal(h.article.style['--iv2-reading-overlap'],undefined);
    }
  }
});

test('balanced handoff recalculates after the title wraps while the scene is already released',()=>{
  for(const scale of [1,.4]){
    const h=harness(scale);h.sync();h.flush();
    const travel=parseFloat(h.intro.style['--iv2-hero-travel']);
    const originalOverlap=parseFloat(h.article.style['--iv2-reading-overlap']);
    h.win.scrollY=(travel+originalOverlap+40)*scale;
    h.events.scroll();h.flush();
    h.head.height=265;h.head.headingOffset=70;
    h.events.resize();h.flush();
    const nextOverlap=parseFloat(h.article.style['--iv2-reading-overlap']);
    assert.ok(nextOverlap>0&&nextOverlap<originalOverlap);
    h.win.scrollY=(travel+nextOverlap)*scale;
    h.events.scroll();h.flush();
    const title=h.heading.getBoundingClientRect();
    const above=title.top-h.frame.getBoundingClientRect().top;
    const below=h.content.getBoundingClientRect().top-title.bottom;
    assert.ok(Math.abs(above-below)<.001);
  }
});

test('photo contrast stops behind the header and restores as the title and navigation return',()=>{
  for(const scale of [1,.4]){
    const h=harness(scale);h.sync();h.flush();
    const release=parseFloat(h.intro.style['--iv2-hero-travel'])+parseFloat(h.article.style['--iv2-reading-overlap']);
    const scroll=y=>{h.win.scrollY=y*scale;h.events.scroll();h.flush();};
    scroll(release+30);
    assert.equal(h.nav.inert,false);assert.equal(h.nav.children[0].hidden,false);
    scroll(release+80);
    assert.equal(h.nav.inert,true);assert.equal(h.nav.children[0].hidden,true);
    assert.ok(!('data-photo-backed' in h.nav.attrs));
    scroll(release+30);
    assert.equal(h.nav.inert,false);assert.equal(h.nav.children[0].hidden,false);
    scroll(0);
    assert.equal(h.nav.inert,false);assert.equal(h.nav.children[0].hidden,true);
  }
});
