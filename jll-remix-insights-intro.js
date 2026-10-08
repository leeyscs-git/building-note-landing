/* Keep the founding journal folded until its arrow is explicitly selected. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(){
  function start(win){
    const doc=win.document,host=doc.querySelector('.iv2-first-read');
    if(!host)return;
    const panel=host.querySelector('.iv2-first-read-panel');
    const toggle=host.querySelector('.iv2-first-read-toggle');
    const link=host.querySelector('[data-article]');
    const index=doc.getElementById('journal-index');
    let open=false;
    function blocked(){
      return doc.hidden||doc.body.classList.contains('sps-menu-open')||Boolean(doc.querySelector('dialog[open]'));
    }
    function setOpen(next){
      open=next;
      host.toggleAttribute('data-open',open);
      panel.inert=!open;
      panel.setAttribute('aria-hidden',String(!open));
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label','우리는 왜 이 일을 하는가 소개 '+(open?'접기':'열기'));
    }
    function sync(){
      const params=new URLSearchParams(win.location.search);
      const enabled=!params.has('embed')&&!index.hidden&&params.get('category')!=='research';
      const unavailable=!enabled||blocked();
      host.hidden=unavailable;
      if(unavailable){
        if(!enabled)setOpen(false);
        return;
      }
      const category=params.get('category')==='journal'?'journal':'all';
      link.href=win.SPSJournalPresentation.urlFor({id:'why-we-work'},category,win.location.search);
    }
    toggle.addEventListener('click',()=>{
      if(!host.hidden)setOpen(!open);
    });
    doc.addEventListener('keydown',event=>{
      if(event.key!=='Escape'||!open||host.hidden)return;
      if(panel.contains(doc.activeElement))toggle.focus({preventScroll:true});
      setOpen(false);
      event.preventDefault();
    });
    doc.addEventListener('sps-journal-render',sync);
    doc.addEventListener('visibilitychange',sync);
    win.addEventListener('pageshow',sync);
    win.addEventListener('popstate',sync);
    if('MutationObserver' in win){
      let wasBlocked=blocked();
      const observer=new win.MutationObserver(()=>{
        const next=blocked();
        if(next!==wasBlocked){wasBlocked=next;sync();}
      });
      observer.observe(doc.body,{subtree:true,attributes:true,attributeFilter:['class','open']});
    }
    setOpen(false);
    sync();
  }
  return {start};
});
