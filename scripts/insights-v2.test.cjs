const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const presentation = require('../jll-remix-journal-v2.js');
const root = path.resolve(__dirname, '..');
function articleData() {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'jll-remix-journal-data.js'),'utf8'),context);
  return context.window.SPSJournalArticles;
}
test('V2 links preserve category and desktop/responsive layout without routing to V1', () => {
  for (const layout of ['desktop','responsive']) {
    const href = presentation.urlFor({id:'why-we-work'}, 'journal', '?layout='+layout);
    const url = new URL(href,'http://localhost:3000/');
    assert.equal(url.pathname,'/jll-remix-journal-v2.html');
    assert.equal(url.searchParams.get('category'),'journal');
    assert.equal(url.searchParams.get('article'),'why-we-work');
    assert.equal(url.searchParams.get('layout'),layout);
    const back = new URL(presentation.urlFor(null,'journal','?layout='+layout),'http://localhost:3000/');
    assert.equal(back.hash,'#archive');
    assert.equal(back.searchParams.has('article'),false);
  }
});
test('all original articles use equal news cards with category, title and reading link', () => {
  const articles = articleData();
  const html = presentation.cards(articles);
  assert.equal((html.match(/class="iv2-post/g)||[]).length,7);
  assert.equal((html.match(/iv2-post--featured/g)||[]).length,0);
  assert.equal((html.match(/class="iv2-meta"/g)||[]).length,7);
  assert.ok(!html.includes('iv2-summary'));
  for(const article of articles) assert.ok(html.includes('data-article="'+article.id+'"'));
  assert.equal(presentation.cards([]),'');
});
test('editorial text and link attributes are escaped', () => {
  const html = presentation.cards([{id:'a"&<', title:'<script>alert(1)</script>', image:'x" onerror="bad',label:'<b>',summary:'a & b'}]);
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('src="x" onerror='));
  assert.ok(html.includes('&lt;script&gt;'));
});
function harness(v2=true,search='') {
  const events={},signals=[],scrolls=[];
  function element(dataset={}) { return {
    dataset,hidden:false,innerHTML:'',textContent:'',attributes:{},handlers:{},
    classList:{toggle(){}},setAttribute(name,value){this.attributes[name]=value;},
    addEventListener(name,callback){this.handlers[name]=callback;},
    focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}
  }; }
  const ids={};
  for(const id of ['journal-grid','journal-index','journal-article','journal-count','journal-category-note','journal-empty','archive']) ids[id]=element();
  if(v2) { delete ids['journal-count']; delete ids['journal-category-note']; }
  const heading=element();ids['journal-article'].querySelector=()=>heading;
  const filters=['all','journal','research'].map(category=>element({category}));
  const emptyButton=element({category:'journal'});
  const document={
    title:'',
    getElementById:id=>ids[id],
    querySelectorAll:selector=>selector==='[data-insights-preview]'?[]:selector==='[data-category]'?[...filters,emptyButton]:filters,
    querySelector:selector=>filters.find(f=>selector.includes('"'+f.dataset.category+'"'))||null,
    addEventListener:(name,callback)=>{events[name]=callback;},
    dispatchEvent:event=>signals.push(event.detail)
  };
  const sandbox={
    document,URL,URLSearchParams,
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},
    requestAnimationFrame:callback=>callback(),
    location:new URL('http://localhost:3000/'+(v2?'jll-remix-journal-v2.html':'jll-remix-journal.html')+search),
    window:{SPSHeader:{close(){}},scrollY:0,scrollTo:options=>scrolls.push(options),addEventListener:(name,callback)=>{events[name]=callback;}}
  };
  function navigate(url){sandbox.location=new URL(url,sandbox.location);}
  sandbox.history={
    state:{},
    pushState(state,unused,url){this.state=state;navigate(url);},
    replaceState(state,unused,url){this.state=state;if(url)navigate(url);}
  };
  const sourceRoot=v2?root:path.join(root,'briefing/insights-v1-reference');
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(sourceRoot,'jll-remix-journal-data.js'),'utf8'),sandbox);
  vm.runInContext(fs.readFileSync(path.join(sourceRoot,'jll-remix-insights.js'),'utf8'),sandbox);
  if(v2) sandbox.window.SPSJournalPresentation={...presentation,cards:(items,category)=>presentation.cards(items,category,sandbox.location.search)};
  vm.runInContext(fs.readFileSync(path.join(sourceRoot,'jll-remix-journal.js'),'utf8'),sandbox);
  function clickLink(id) {
    const href=id?presentation.urlFor({id},'journal',sandbox.location.search):presentation.urlFor(null,'journal',sandbox.location.search);
    const link={dataset:{article:id},href:new URL(href,sandbox.location).href,hasAttribute:name=>name==='data-article'?!!id:name==='data-journal-back'&&!id};
    const event={button:0,target:{closest:()=>link},preventDefault(){this.prevented=true;}};
    events.click(event);return event;
  }
  return {sandbox,ids,filters,emptyButton,events,signals,scrolls,heading,clickLink};
}
test('research empty state can return to populated journal with keyboard target retained', () => {
  const h=harness();
  h.filters[2].handlers.click();
  assert.equal(h.ids['journal-grid'].hidden,true);
  assert.equal(h.ids['journal-empty'].hidden,false);
  assert.equal(h.sandbox.location.search,'?category=research');
  h.emptyButton.handlers.click();
  assert.equal(h.ids['journal-empty'].hidden,true);
  assert.equal(h.ids['journal-grid'].hidden,false);
  assert.equal(h.filters[1].attributes['aria-pressed'],'true');
});
test('reading and returning retain V2 path, category and list scroll', () => {
  const h=harness();
  h.filters[1].handlers.click();
  h.sandbox.window.scrollY=780;
  h.clickLink('why-we-work');
  assert.equal(h.sandbox.location.pathname,'/jll-remix-journal-v2.html');
  assert.equal(h.ids['journal-index'].hidden,true);
  assert.equal(h.heading.focused,true);
  assert.equal(h.signals.at(-1).view,'article');
  assert.ok(h.ids['journal-article'].innerHTML.includes('jll-remix-journal-v2.html?category=journal'));
  h.clickLink(null);
  assert.equal(h.ids['journal-index'].hidden,false);
  assert.equal(h.sandbox.location.search,'?category=journal');
  assert.equal(h.scrolls.at(-1).top,780);
  assert.equal(h.filters[1].focused,true);
});
test('original page retains its card renderer and filter behavior', () => {
  const h=harness(false);
  assert.ok(h.ids['journal-grid'].innerHTML.includes('insight-card'));
  assert.ok(!h.ids['journal-grid'].innerHTML.includes('iv2-post'));
  h.filters[2].handlers.click();
  assert.equal(h.sandbox.location.pathname,'/jll-remix-journal.html');
  assert.equal(h.ids['journal-empty'].hidden,false);
});

test('retired preview parameters drop on navigation while embedded comparison remains usable', () => {
  for(const type of ['before','after']){
    const h=harness(true,'?type='+type+'&embed=1&titleLabel=above');
    h.filters[1].handlers.click();
    assert.equal(h.sandbox.location.searchParams.has('type'),false);
    assert.equal(h.sandbox.location.searchParams.has('titleLabel'),false);
    assert.equal(h.sandbox.location.searchParams.get('embed'),'1');
    h.clickLink('why-we-work');
    assert.equal(h.sandbox.location.searchParams.has('type'),false);
    assert.equal(h.sandbox.location.searchParams.has('titleLabel'),false);
    assert.equal(h.sandbox.location.searchParams.get('embed'),'1');
    assert.equal(h.ids['journal-index'].hidden,true);
    h.clickLink(null);
    assert.equal(h.sandbox.location.searchParams.has('type'),false);
    assert.equal(h.sandbox.location.searchParams.has('titleLabel'),false);
    assert.equal(h.sandbox.location.searchParams.get('category'),'journal');
    assert.equal(h.ids['journal-index'].hidden,false);
  }
  const unknown=new URL(presentation.urlFor(null,'all','?type=unknown&embed=0'),'http://localhost');
  assert.equal(unknown.searchParams.has('type'),false);
  assert.equal(unknown.searchParams.has('embed'),false);
});

test('current article removes draft byline and deck while archived article retains both',()=>{
  const current=harness(true,'?article=why-we-work').ids['journal-article'].innerHTML;
  const archived=harness(false,'?article=why-we-work').ids['journal-article'].innerHTML;
  assert.ok(current.includes('iv2-hero-stage'));
  assert.ok(!current.includes('class="journal-back"'));
  assert.ok(!current.includes('journal-toc'));
  assert.equal((current.match(/data-journal-back/g)||[]).length,1);
  assert.ok(current.includes('← 목록으로 돌아가기'));
  assert.ok(!current.includes('journal-article-deck'));
  assert.ok(!current.includes('SPS · 편집 초안'));
  assert.ok(archived.includes('journal-article-deck'));
  assert.ok(archived.includes('SPS · 편집 초안'));
  assert.ok(archived.includes('class="journal-back"'));
  assert.ok(!archived.includes('iv2-hero-stage'));
});

test('homepage cards route to V2 while archived V1 cards stay in the reference',()=>{
  for(const v2 of [true,false]){
    const h=harness(v2);
    const href=h.sandbox.window.SPSInsights.url({id:'why-we-work'},'journal');
    const url=new URL(href,'http://localhost');
    assert.equal(url.pathname,v2?'/jll-remix-journal-v2.html':'/jll-remix-journal.html');
    assert.equal(url.searchParams.get('category'),'journal');
  }
});


test('selected card is handed to the photo transition before replacing the list',()=>{
  const h=harness();let captured=false;
  h.sandbox.window.scrollY=780;
  h.sandbox.window.SPSJournalTransition={open(link,navigate){captured=true;assert.equal(link.dataset.article,'why-we-work');assert.equal(h.ids['journal-index'].hidden,false);navigate();},cancel(){}};
  h.clickLink('why-we-work');assert.equal(captured,true);assert.equal(h.ids['journal-index'].hidden,true);
  assert.equal(h.sandbox.history.state.listScroll,780);
  h.clickLink(null);assert.equal(h.ids['journal-index'].hidden,false);assert.equal(h.scrolls.at(-1).top,780);
});


test('return link and Insights header both reverse the photo while restoring category and list scroll',()=>{
  for(const source of ['back-link','header']){
    const h=harness();h.filters[1].handlers.click();h.sandbox.window.scrollY=780;h.clickLink('why-we-work');
    let reversed=0;
    h.sandbox.window.SPSJournalTransition={cancel(){},back(id,navigate){reversed++;assert.equal(id,'why-we-work');assert.equal(h.ids['journal-article'].hidden,false);navigate();}};
    if(source==='back-link')h.clickLink(null);
    else{
      const link={href:'http://localhost:3000/jll-remix-journal-v2.html',hasAttribute:()=>false};
      const event={button:0,target:{closest:()=>link},preventDefault(){this.prevented=true;}};
      h.events.click(event);assert.equal(event.prevented,true);
    }
    assert.equal(reversed,1);assert.equal(h.ids['journal-index'].hidden,false);
    assert.equal(h.sandbox.location.search,'?category=journal');assert.equal(h.scrolls.at(-1).top,780);
  }
});

test('browser Back reverses the existing article before list rendering without adding history',()=>{
  const h=harness();h.sandbox.window.scrollY=640;h.clickLink('why-we-work');
  let reversed=0;
  h.sandbox.window.SPSJournalTransition={cancel(){},back(id,navigate){reversed++;assert.equal(id,'why-we-work');assert.equal(h.ids['journal-article'].hidden,false);navigate();}};
  h.sandbox.location=new URL('http://localhost:3000/jll-remix-journal-v2.html');
  h.sandbox.history.state={scroll:640,focusId:'why-we-work'};
  h.sandbox.history.pushState=()=>assert.fail('Back must not push another entry');
  h.events.popstate();assert.equal(reversed,1);assert.equal(h.ids['journal-index'].hidden,false);
  assert.equal(h.scrolls.at(-1).top,640);
});

test('modified Insights clicks and same-article fragment history retain their native behavior',()=>{
  const h=harness();h.clickLink('why-we-work');let reversed=0;
  h.sandbox.window.SPSJournalTransition={cancel(){},back(){reversed++;}};
  const link={href:'http://localhost:3000/jll-remix-journal-v2.html',hasAttribute:()=>false};
  h.events.click({button:0,ctrlKey:true,target:{closest:()=>link},preventDefault(){assert.fail('modified click');}});
  h.sandbox.location.hash='#article-section-1';h.events.popstate();
  assert.equal(reversed,0);assert.equal(h.ids['journal-article'].hidden,false);
});
