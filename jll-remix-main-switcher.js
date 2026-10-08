(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(){
  function href(version,search,hash){
    const source=new URLSearchParams(search),params=new URLSearchParams();
    if(['desktop','responsive'].includes(source.get('layout')))params.set('layout',source.get('layout'));
    const anchors=['#main','#about','#services','#spaces','#insights','#faq','#contact'];
    const fromReference={'#hw-intro':'#main','#hw-vision':'#about','#hw-business':'#services','#hw-news':'#insights','#hw-future':'#spaces','#hw-footer':'#contact'};
    const toReference={'#main':'#hw-intro','#about':'#hw-vision','#services':'#hw-business','#insights':'#hw-news','#spaces':'#hw-future','#faq':'#hw-footer','#contact':'#hw-footer'};
    const original=fromReference[hash]||hash;
    const section=anchors.includes(original)?original:'#main';
    const pages={a:'jll-remix.html',b:'jll-remix-main-v2.html',c:'jll-remix-main-v4.html',d:'jll-remix-main-v4.html'};
    const fragment=version==='a'?section:toReference[section];
    return (pages[version]||pages.a)+(params.size?'?'+params:'')+fragment;
  }
  function start(win){
    const doc=win.document,params=new URLSearchParams(win.location.search);
    const active=win.location.pathname.endsWith('jll-remix-main-v4.html')?'c':win.location.pathname.endsWith('jll-remix-main-v2.html')?'b':'a';
    // V4 is finalized; comparison controls remain on the other drafts only.
    if(active==='c'||params.has('embed'))return;
    const host=doc.createElement('aside');
    host.setAttribute('aria-label','메인 원본·V2·V4 비교');
    host.style.cssText='position:fixed;bottom:16px;left:16px;z-index:45;max-width:calc(100 * var(--sps-vw,1vw) - 32px)';
    const shadow=host.attachShadow({mode:'open'});
    shadow.innerHTML=`<style>
      :host{font-family:var(--font)}
      nav{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:6px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-control)}
      span{padding:0 8px;font-size:12px;color:var(--muted)}
      a{display:flex;align-items:center;min-height:44px;padding:0 12px;color:var(--ink);text-decoration:none;font-size:12px;border-radius:var(--radius-control);white-space:nowrap}
      a[aria-current]{background:var(--ink);color:var(--surface)}
      a:hover{background:var(--rose-hover);color:var(--ink)}
      a:focus-visible{outline:2px solid var(--red);outline-offset:-2px}
      @media(max-width:480px){span{display:none}a{font-size:11px;padding-inline:6px}}
    </style><nav aria-label="메인 페이지 시안"><span>메인 비교</span><a data-version="a" ${active==='a'?'aria-current="page"':''}>A · 원본</a><a data-version="b" ${active==='b'?'aria-current="page"':''}>B · V2</a><a data-version="c">C · V4</a><a href="jll-remix-main-compare.html">비교 ↗</a></nav>`;
    function update(){shadow.querySelectorAll('[data-version]').forEach(a=>a.href=href(a.dataset.version,win.location.search,win.location.hash));}
    update();win.addEventListener('hashchange',update);
    doc.body.append(host);
  }
  return {href,start};
});
