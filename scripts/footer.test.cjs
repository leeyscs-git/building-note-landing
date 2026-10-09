const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {routes,markup,mount}=require('../jll-remix-footer.js');
const root=path.resolve(__dirname,'..');
const pages=fs.readdirSync(root).filter(file=>/^jll-remix.*\.html$/.test(file)&&fs.readFileSync(path.join(root,file),'utf8').includes('data-sps-header'));

test('every current SPS page has one shared footer outside main, with its required scripts and style',()=>{
  assert.equal(pages.length,17);
  for(const file of pages){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    const footer=html.indexOf('<footer class="sps-footer"');
    assert.ok(footer>html.indexOf('</main>'),file+' footer is a document landmark');
    assert.equal([...html.matchAll(/<footer\b/g)].length,1,file+' footer count');
    assert.equal([...html.matchAll(/src="jll-remix-footer\.js/g)].length,1,file+' shared script');
    assert.equal([...html.matchAll(/href="jll-remix-footer\.css/g)].length,1,file+' shared styles');
    assert.ok(html.includes('jll-remix-contact.js'),file+' supports the shared inquiry action');
    if(html.includes('jll-remix-hanwha.js'))assert.ok(html.indexOf('jll-remix-footer.js')<html.indexOf('jll-remix-hanwha.js'),file+' footer mounts before scroll measurements');
    if(file==='jll-remix-main-v2.html'||file==='jll-remix-main-v4.html')assert.match(html,/<footer[^>]*id="hw-footer"/);
  }
  const guide=fs.readFileSync(path.join(root,'jll-remix-design-system.html'),'utf8');
  assert.match(guide,/id="footer-component"/);
  assert.match(guide,/data-sps-footer data-footer-preview/);
});

test('footer navigation uses existing pages, supported services and the existing phone number',()=>{
  const html=markup({home:'jll-remix-main-v4.html',about:'jll-remix-about.html',insights:'jll-remix-journal-v2.html',top:'#main'},2026);
  for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
    if(href.startsWith('#')||href.startsWith('tel:'))continue;
    const url=new URL(href,'http://localhost/');
    const target=path.join(root,url.pathname.slice(1));
    assert.ok(fs.existsSync(target),href+' resolves');
    // Inquiry is a dialog route; other fragments must identify authored elements.
    if(url.hash&&url.hash!=='#inquiry')assert.ok(fs.readFileSync(target,'utf8').includes('id="'+url.hash.slice(1)+'"'),href+' fragment resolves');
    if(url.searchParams.has('service'))assert.ok(['management','marketing','interior'].includes(url.searchParams.get('service')));
  }
  const support=fs.readFileSync(path.join(root,'jll-remix-support.html'),'utf8');
  assert.ok(support.includes('tel:0222475799'));
  assert.match(html,/data-inquiry aria-haspopup="dialog"/);
  assert.match(html,/© 2026 SPS/);
  assert.doesNotMatch(html,/href="#"|javascript:|개인정보처리방침/);
});

function fixture({variant='',header={},scoped=false,reduced=false}={}){
  const events={},styles={},scrolled=[],focused=[];
  const note={original:true},inner={children:[],append(node){this.children.push(node);}};
  const top={addEventListener(type,fn){this[type]=fn;}};
  const host={attrs:{},renders:0,style:{setProperty:(key,value)=>styles[key]=value,removeProperty:key=>delete styles[key]},
    hasAttribute(key){return key in this.attrs;},setAttribute(key,value){this.attrs[key]=value;},
    querySelectorAll:()=>[note],querySelector:selector=>selector==='[data-footer-top]'?top:inner,
    set innerHTML(value){this.html=value;this.renders++;}};
  const values={'--surface-cool':'#f1f1f1','--body-size':'18px','--content-max':'1200px'};
  const doc={body:{dataset:{themeScope:scoped?'header':''}},documentElement:{dataset:{serviceMenu:variant}},
    getElementById:()=>({}),querySelectorAll:()=>[host],
    querySelector:selector=>selector==='[data-sps-header]'?{dataset:header}:{focus:options=>focused.push(options)}};
  const win={document:doc,scrollTo:options=>scrolled.push(options),matchMedia:()=>({matches:reduced}),
    SPSThemeSchema:Object.keys(values).map(token=>({token})),
    getComputedStyle:()=>({getPropertyValue:key=>values[key]||''}),addEventListener:(name,fn)=>events[name]=fn};
  return {win,doc,host,inner,note,top,styles,values,events,scrolled,focused};
}

test('footer follows header destinations and renders only once while preserving reference note nodes',()=>{
  const h=fixture({variant:'v3'});
  assert.equal(routes(h.win).home,'jll-remix-v3.html');
  assert.equal(routes(h.win).about,'jll-remix-v3-about.html');
  mount(h.win);mount(h.win);
  assert.equal(h.host.renders,1);
  assert.deepEqual(h.inner.children,[h.note]);
  const custom=fixture({header:{homeHref:'jll-remix-main-v4.html',aboutHref:'jll-remix-about-v2.html'}});
  assert.deepEqual(routes(custom.win),{home:'jll-remix-main-v4.html',about:'jll-remix-about-v2.html',insights:'jll-remix-journal-v2.html',top:'#main'});
  assert.ok(markup({...routes(custom.win),home:'x" onfocus="bad'},2026).includes('x&quot; onfocus=&quot;bad'));
});

test('header-scoped About foundations stay synchronized without overriding other page themes',()=>{
  const h=fixture({scoped:true});mount(h.win);
  assert.equal(h.styles['--surface-cool'],'#f1f1f1');
  assert.equal(h.styles['--body-size'],'18px');
  h.values['--body-size']='20px';delete h.values['--surface-cool'];h.events['sps-theme-change']();
  assert.equal(h.styles['--body-size'],'20px');
  assert.equal(h.styles['--surface-cool'],undefined);
  const normal=fixture();mount(normal.win);assert.deepEqual(normal.styles,{});
});

test('back to top respects reduced motion, returns focus to the header and leaves modified links native',()=>{
  for(const reduced of [false,true]){
    const h=fixture({reduced});mount(h.win);
    let prevented=false;
    const event={button:0,preventDefault(){prevented=true;}};
    h.top.click({...event,ctrlKey:true});assert.equal(h.scrolled.length,0);
    h.top.click({...event,defaultPrevented:true});assert.equal(h.scrolled.length,0);
    h.top.click(event);
    assert.equal(prevented,true);
    assert.deepEqual(h.scrolled,[{top:0,behavior:reduced?'instant':'smooth'}]);
    assert.deepEqual(h.focused,[{preventScroll:true}]);
  }
});
