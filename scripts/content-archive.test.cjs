const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const archive=require('../jll-remix-content-archive.js');
const cases=require('../jll-remix-cases.js');

function fixture({search='',scale=1,reduced=false,flight=null}={}){
  const events={},motions=[],states=[],root={getAttribute:()=>flight};
  const reduce={matches:reduced,addEventListener(name,fn){this[name]=fn;}};
  function element(category,index=0){
    const item={dataset:{caseCategory:category},attributes:{},listeners:{},offsetWidth:80,
      setAttribute(name,value){this.attributes[name]=value;},
      addEventListener(name,fn){this.listeners[name]=fn;},
      getClientRects:()=>[{}],getBoundingClientRect:()=>({left:(50+index*120)*scale,width:80*scale}),
      animate(frames,options){const animation={frames,options,cancel(){this.cancelled=true;this.oncancel?.();}};motions.push(animation);return animation;}
    };
    item.classList={contains:()=>false,toggle(name,on){item.active=on;}};
    return item;
  }
  const buttons=['all','management','marketing','interior','other'].map(element);
  const content=[element(),element(),element()];
  const indicator={style:{}},tabs={offsetWidth:500,scrollLeft:0,classList:{add(){}},
    getClientRects:()=>[{}],getBoundingClientRect:()=>({left:50*scale,width:500*scale}),
    querySelector:()=>buttons.find(button=>button.attributes['aria-pressed']==='true')
  };
  const inquiry={dataset:{}},status={},title={},grid={innerHTML:'',hidden:true},empty={hidden:false};
  const doc={documentElement:root,
    querySelectorAll:selector=>selector==='[data-case-category]'?buttons:content,
    querySelector:selector=>({'.iv2-filters':tabs,'.iv2-tab-indicator':indicator,'#cases-consultation [data-inquiry]':inquiry}[selector]),
    getElementById:id=>({'cases-status':status,'cases-empty-title':title,'cases-grid':grid,'cases-empty':empty}[id])
  };
  const win={document:doc,location:new URL('http://localhost/jll-remix-cases.html'+search),
    matchMedia:()=>reduce,getComputedStyle:()=>({getPropertyValue:name=>({'--reveal-duration':'800','--reveal-distance':'28','--ease-editorial':'linear'}[name]||'')}),
    requestAnimationFrame:fn=>fn(),addEventListener:(name,fn)=>events[name]=fn,
    history:{state:{retained:true},pushState(state,unused,url){states.push(url.href);win.location=new URL(url);this.state=state;}}
  };
  return {win,buttons,content,indicator,tabs,inquiry,status,title,grid,empty,events,motions,states,reduce};
}

test('shared entry motion runs once, honors reduced motion, and leaves returning images still',()=>{
  const h=fixture();const ui=archive.start(h.win);ui.refresh();
  assert.equal(h.motions.length,3);
  assert.deepEqual(h.motions[0].frames,[{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'translateY(0)'}]);
  ui.refresh();assert.equal(h.motions.length,3);
  h.reduce.change({matches:true});assert.ok(h.motions.every(motion=>motion.cancelled));
  for(const options of [{reduced:true},{flight:'out'}]){
    const skipped=fixture(options);archive.start(skipped.win).refresh();assert.equal(skipped.motions.length,0);
  }
});

test('the shared tab underline follows selection in scaled and horizontally scrolled layouts',()=>{
  for(const scale of [1,.4]){
    const h=fixture({scale});h.tabs.scrollLeft=40;
    h.buttons[2].attributes['aria-pressed']='true';
    archive.start(h.win).refresh();
    assert.equal(h.indicator.style.width,'80px');
    assert.equal(h.indicator.style.transform,'translateX(280px)');
  }
});

test('service filters retain URL state, update inquiry context and restore with Back',()=>{
  const h=fixture({search:'?category=management&layout=desktop&embed=1#archive'});cases.start(h.win);
  assert.equal(h.status.textContent,'부동산 자산관리');assert.equal(h.inquiry.dataset.inquiryService,'management');
  assert.equal(h.buttons[1].active,true);assert.equal(h.indicator.style.transform,'translateX(120px)');
  h.buttons[2].listeners.click();
  assert.equal(h.win.location.searchParams.get('category'),'marketing');
  assert.equal(h.win.location.searchParams.get('layout'),'desktop');
  assert.equal(h.win.location.searchParams.get('embed'),'1');assert.equal(h.win.location.hash,'#archive');
  assert.equal(h.title.textContent,'임대 마케팅 사례를 준비하고 있습니다.');
  assert.equal(h.inquiry.dataset.inquiryService,'marketing');
  assert.equal(h.motions.length,3,'filtering does not repeat page entry');
  h.buttons[2].listeners.click();assert.equal(h.states.length,1,'same tab adds no history');
  h.buttons[0].listeners.click();assert.equal(h.win.location.searchParams.has('category'),false);
  assert.equal(h.inquiry.dataset.inquiryService,undefined);
  h.win.location=new URL('http://localhost/jll-remix-cases.html?category=interior');h.events.popstate();
  assert.equal(h.buttons[3].active,true);assert.equal(h.status.textContent,'실내건축');
  assert.equal(h.inquiry.dataset.inquiryService,'interior');
  assert.equal(cases.categoryFor('?category=unknown'),'all');
  assert.equal(cases.categoryFor('?category=__proto__'),'all');
});

test('service samples use the shared card renderer and show only the selected category',()=>{
  const h=fixture();cases.start(h.win);
  const count=()=> (h.grid.innerHTML.match(/class="iv2-post"/g)||[]).length;
  assert.equal(count(),4);assert.equal(h.empty.hidden,true);assert.equal(h.grid.hidden,false);
  assert.equal((h.grid.innerHTML.match(/ · 샘플/g)||[]).length,4);
  assert.equal((h.grid.innerHTML.match(/서비스 안내 보기/g)||[]).length,4);
  assert.doesNotMatch(h.grid.innerHTML,/data-article=/,'sample cards do not navigate to unrelated journal articles');
  h.buttons[1].listeners.click();assert.equal(count(),2);
  assert.match(h.grid.innerHTML,/sample-management-office/);assert.doesNotMatch(h.grid.innerHTML,/sample-marketing/);
  h.buttons[2].listeners.click();assert.equal(count(),2);
  assert.match(h.grid.innerHTML,/sample-marketing-office/);assert.doesNotMatch(h.grid.innerHTML,/sample-management/);
  h.buttons[3].listeners.click();assert.equal(count(),0);assert.equal(h.grid.hidden,true);assert.equal(h.empty.hidden,false);
  h.buttons[4].listeners.click();assert.equal(h.win.location.searchParams.get('category'),'other');
  assert.equal(h.buttons[4].active,true);assert.equal(count(),0);assert.equal(h.empty.hidden,false);
  assert.equal(h.title.textContent,'기타 사례를 준비하고 있습니다.');assert.equal(h.inquiry.dataset.inquiryService,'undecided');
  h.win.location=new URL('http://localhost/jll-remix-cases.html?category=management');h.events.popstate();
  assert.equal(count(),2);assert.equal(h.empty.hidden,true);assert.equal(h.inquiry.dataset.inquiryService,'management');
});

test('sample assets are local and other-category direct links preserve layout and inquiry behavior',()=>{
  const samples=require('../jll-remix-cases-data.js');
  assert.equal(new Set(samples.map(item=>item.id)).size,4);
  for(const item of samples){
    assert.equal(item.sample,true);assert.ok(fs.existsSync(require.resolve('../'+item.image)));
    assert.match(item.alt,/샘플/);
  }
  const h=fixture({search:'?category=other&layout=desktop&embed=1#archive'});cases.start(h.win);
  assert.equal(h.buttons[4].active,true);assert.equal(h.empty.hidden,false);
  assert.equal(h.inquiry.dataset.inquiryService,'undecided');
  h.buttons[2].listeners.click();assert.equal(h.grid.hidden,false);
  assert.equal(h.win.location.searchParams.get('layout'),'desktop');assert.equal(h.win.location.searchParams.get('embed'),'1');
  assert.equal(h.win.location.hash,'#archive');
  const html=fs.readFileSync(require.resolve('../jll-remix-cases.html'),'utf8');
  assert.ok(html.indexOf('jll-remix-cases-data.js')<html.indexOf('jll-remix-cases.js'));
});

test('both pages load the same archive component before their own controller',()=>{
  for(const [page,controller] of [['jll-remix-cases.html','jll-remix-cases.js'],['jll-remix-journal-v2.html','jll-remix-journal-v2.js']]){
    const html=fs.readFileSync(require.resolve('../'+page),'utf8');
    assert.ok(html.includes('jll-remix-content-archive.css'));
    assert.ok(html.indexOf('jll-remix-content-archive.js')<html.indexOf(controller));
    assert.match(html,/content-archive-page/);
  }
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../jll-remix-content-archive.js'),'utf8'),context);
  assert.equal(typeof context.window.SPSContentArchive.start,'function');
});

test('the runnable old cases page retains its own controller, styles and independent URL categories',()=>{
  const directory='../briefing/service-cases-v1-reference/';
  const html=fs.readFileSync(require.resolve(directory+'jll-remix-cases.html'),'utf8');
  assert.match(html,/<base href="\.\.\/\.\.\//);
  assert.match(html,/briefing\/service-cases-v1-reference\/jll-remix-cases.css/);
  assert.match(html,/briefing\/service-cases-v1-reference\/jll-remix-cases.js/);
  assert.doesNotMatch(html,/jll-remix-content-archive/);
  const h=fixture({search:'?category=interior'});
  h.win.document.querySelector=()=>h.inquiry;
  vm.runInNewContext(fs.readFileSync(require.resolve(directory+'jll-remix-cases.js'),'utf8'),{
    document:h.win.document,window:h.win,location:h.win.location,history:h.win.history,URL
  });
  assert.equal(h.status.textContent,'실내건축');assert.equal(h.inquiry.dataset.inquiryService,'interior');
  const comparison=fs.readFileSync(require.resolve('../jll-remix-cases-compare.html'),'utf8');
  assert.match(comparison,/service-cases-v1-reference\/jll-remix-cases.html\?embed=1/);
  assert.match(comparison,/jll-remix-cases.html\?embed=1/);
});


test('narrow category rails reveal direct and history selections without vertical scrolling',()=>{
  for(const scale of [1,.5]){
    const h=fixture({scale,search:'?category=other'});
    h.tabs.offsetWidth=h.tabs.clientWidth=280;h.tabs.scrollWidth=560;
    h.tabs.getBoundingClientRect=()=>({left:20*scale,width:280*scale});
    h.buttons.forEach((button,index)=>button.getBoundingClientRect=()=>({left:(20+index*120-h.tabs.scrollLeft)*scale,width:80*scale}));
    cases.start(h.win);
    assert.equal(h.tabs.scrollLeft,280);
    assert.equal(h.indicator.style.transform,'translateX(480px)');
    h.buttons[0].listeners.click();assert.equal(h.tabs.scrollLeft,0);
    h.win.location=new URL('http://localhost/jll-remix-cases.html?category=interior');h.events.popstate();
    assert.equal(h.tabs.scrollLeft,168);
    assert.equal(h.indicator.style.transform,'translateX(360px)');
    assert.equal(h.buttons[3].attributes['aria-pressed'],'true');
  }
});
