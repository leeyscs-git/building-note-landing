/* Service case content uses the same archive presentation as Insights. */
(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./jll-remix-content-archive.js'):root.SPSContentArchive,node?require('./jll-remix-cases-data.js'):root.SPSCaseSamples);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(archive,samples){
  'use strict';
  const categories={all:'서비스 사례',management:'부동산 자산관리',marketing:'임대 마케팅',interior:'실내건축',other:'기타'};
  function categoryFor(search){
    const requested=new URLSearchParams(search).get('category');
    return Object.hasOwn(categories,requested)?requested:'all';
  }
  function start(win){
    const doc=win.document;
    const buttons=[...doc.querySelectorAll('[data-case-category]')];
    if(!buttons.length)return;
    const presentation=archive.start(win);
    const inquiry=doc.querySelector('#cases-consultation [data-inquiry]');
    const grid=doc.getElementById('cases-grid'),empty=doc.getElementById('cases-empty');
    let renderedCategory=null;
    function render(){
      const category=categoryFor(win.location.search);
      const shown=(samples||[]).filter(item=>category==='all'||item.category===category);
      buttons.forEach(button=>{
        const selected=button.dataset.caseCategory===category;
        button.setAttribute('aria-pressed',String(selected));
        button.classList.toggle('active',selected);
      });
      doc.getElementById('cases-status').textContent=categories[category];
      doc.getElementById('cases-empty-title').textContent=category==='all'?'공개할 사례를 준비하고 있습니다.':categories[category]+' 사례를 준비하고 있습니다.';
      grid.hidden=!shown.length;
      empty.hidden=Boolean(shown.length);
      if(renderedCategory!==category){
        grid.innerHTML=archive.cards(shown,{
          hrefFor:()=> 'jll-remix.html#services',
          labelFor:item=>categories[item.category]+(item.sample?' · 샘플':''),
          readLabel:'서비스 안내 보기',linkAttribute:'data-case'
        });
        renderedCategory=category;
      }
      if(category==='all')delete inquiry.dataset.inquiryService;
      else inquiry.dataset.inquiryService=category==='other'?'undecided':category;
      win.requestAnimationFrame(()=>presentation.refresh());
    }
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const url=new URL(win.location.href);
      if(button.dataset.caseCategory==='all')url.searchParams.delete('category');
      else url.searchParams.set('category',button.dataset.caseCategory);
      if(url.href!==win.location.href)win.history.pushState(win.history.state,'',url);
      render();
    }));
    win.addEventListener('popstate',render);
    render();
  }
  return {categoryFor,start};
});
