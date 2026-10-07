/* Category selection is URL-backed; actual cases are not invented for the preview. */
(() => {
  'use strict';
  const categories={all:'서비스 사례',management:'부동산 자산관리',marketing:'임대 마케팅',interior:'실내건축'};
  const buttons=[...document.querySelectorAll('[data-case-category]')];
  function render() {
    const requested=new URL(location.href).searchParams.get('category');
    const category=Object.hasOwn(categories,requested)?requested:'all';
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.caseCategory===category)));
    document.getElementById('cases-status').textContent=categories[category];
    document.getElementById('cases-empty-title').textContent=category==='all'?'공개할 사례를 준비하고 있습니다.':`${categories[category]} 사례를 준비하고 있습니다.`;
    const inquiry=document.querySelector('.cases-next [data-inquiry]');
    if(category==='all')delete inquiry.dataset.inquiryService;else inquiry.dataset.inquiryService=category;
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const url=new URL(location.href);
    if(button.dataset.caseCategory==='all')url.searchParams.delete('category');else url.searchParams.set('category',button.dataset.caseCategory);
    if(url.href!==location.href)history.pushState(null,'',url);
    render();
  }));
  window.addEventListener('popstate',render);
  render();
})();
