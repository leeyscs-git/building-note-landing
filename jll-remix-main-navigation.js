/* Section links and current-section tracking belong to the shared scroll engine. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else api.start(root);
})(typeof window==='undefined'?null:window,function(){
  function start(win){
    const doc=win.document,host=doc.querySelector('.main-v4-page-nav');
    if(!host)return;
    function sync(){
      host.hidden=host.hasAttribute('data-tweak-hidden')||doc.hidden||host.inert||doc.body.classList.contains('sps-menu-open')||Boolean(doc.querySelector('dialog[open]'));
    }
    doc.addEventListener('visibilitychange',sync);
    win.addEventListener('pageshow',sync);
    if('MutationObserver' in win){
      const observer=new win.MutationObserver(sync);
      observer.observe(host,{attributes:true,attributeFilter:['inert','data-tweak-hidden']});
      observer.observe(doc.body,{attributes:true,attributeFilter:['class']});
      doc.querySelectorAll('dialog').forEach(dialog=>observer.observe(dialog,{attributes:true,attributeFilter:['open']}));
    }
    sync();
  }
  return {start};
});
