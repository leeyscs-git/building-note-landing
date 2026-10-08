/* Keep navigation native: anchors/history work even without this enhancement. */
(() => {
  'use strict';
  const chapters=document.querySelector('.company-chapters');
  if(!chapters)return;
  const links=[...chapters.querySelectorAll('a[href^="#"]')];
  const sections=links.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean);
  const header=document.querySelector('[data-sps-header]');
  let frame=0;
  let current='';
  function update(){
    frame=0;
    const headerHeight=header?.getBoundingClientRect().height || 0;
    const navHeight=chapters.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--company-chapters-height',navHeight+'px');
    let active=sections[0];
    for(const section of sections){
      if(section.getBoundingClientRect().top<=headerHeight+navHeight+48)active=section;
    }
    if(!active || current===active.id)return;
    current=active.id;
    links.forEach(link=>{
      if(link.hash==='#'+current)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  new ResizeObserver(schedule).observe(chapters);
  if(header)new ResizeObserver(schedule).observe(header);
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('hashchange',schedule);
  addEventListener('pageshow',schedule);
  document.fonts?.ready.then(schedule);
  update();
})();
