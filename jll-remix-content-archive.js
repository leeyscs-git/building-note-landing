/* Shared content archive: Insights and Service Cases. Existing iv2 class names are compatibility hooks. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.SPSContentArchive=api;
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function emptyState({title, actionLabel, href} = {}) {
    const tag = href ? 'a' : 'button';
    const action = href ? `href="${escape(href)}"` : 'type="button"';
    return `<h2 aria-live="polite" aria-atomic="true">${escape(title)}</h2>
      <${tag} class="iv2-empty-cta" ${action}>${escape(actionLabel)}<sps-arrow-up-right></sps-arrow-up-right></${tag}>`;
  }
  function cards(items, {hrefFor, labelFor, readLabel = '읽기', linkAttribute = 'data-article'} = {}) {
    return items.map((article, index) => `
      <article class="iv2-post" data-iv2-reveal>
        <a href="${escape(hrefFor(article))}" ${linkAttribute}="${escape(article.id)}">
          <span class="iv2-photo"><img src="${escape(article.image)}" alt="${escape(article.alt)}" width="800" height="600" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async"></span>
          <div class="iv2-copy">
            <p class="iv2-meta">${escape(labelFor(article))}</p>
            <h2>${escape(article.title)}</h2>
            <span class="iv2-read">${escape(readLabel)} <sps-arrow-up-right></sps-arrow-up-right></span>
          </div>
        </a>
      </article>`).join('');
  }
  // Grow a new breadcrumb from the right edge; its ancestors naturally move left.
  function breadcrumbMotion(win, root) {
    if(!root)return update=>update();
    const reduce=win.matchMedia('(prefers-reduced-motion: reduce)');
    let expanded=null,active=null;
    function finish(){
      const state=active;if(!state)return;
      active=null;
      state.motions.forEach(motion=>motion.cancel());
      state.nodes.forEach(node=>{
        node.hidden=!state.expanded;
        node.inert=false;
        node.removeAttribute('aria-hidden');
      });
    }
    for(const event of ['resize','sps-theme-change','pagehide'])win.addEventListener(event,finish,{passive:true});
    win.document.addEventListener('visibilitychange',()=>{if(win.document.hidden)finish();});
    reduce.addEventListener('change',event=>{if(event.matches)finish();});
    return update=>{
      const previous=root.querySelector('[data-breadcrumb-step]');
      const wasExpanded=expanded;
      const moving=Boolean(active);
      const style=previous&&!previous.hidden?win.getComputedStyle(previous):null;
      const from=style?{
        width:style.width,
        marginLeft:style.marginLeft,
        opacity:style.opacity
      }:null;
      finish();
      update();
      const step=root.querySelector('[data-breadcrumb-step]');
      if(!step)return;
      expanded=!step.hidden;
      if(wasExpanded===null||wasExpanded===expanded||reduce.matches||win.document.hidden||!step.animate)return;
      // The photo-backed visual copy must move with the original breadcrumb.
      const nodes=[...root.querySelectorAll('[data-breadcrumb-step]')];
      nodes.forEach(node=>{node.hidden=false;node.inert=!expanded;if(!expanded)node.setAttribute('aria-hidden','true');});
      const width=step.offsetWidth;
      const gap=parseFloat(win.getComputedStyle(step.parentElement).columnGap)||0;
      const collapsed={width:'0px',marginLeft:-gap+'px',opacity:0};
      const full={width:width+'px',marginLeft:'0px',opacity:1};
      const styles=win.getComputedStyle(win.document.documentElement);
      const timing={
        duration:parseFloat(styles.getPropertyValue('--reveal-duration'))||800,
        easing:styles.getPropertyValue('--ease-editorial').trim()||'cubic-bezier(.22,1,.36,1)',
        fill:'both'
      };
      const state=active={expanded,nodes,motions:[]};
      const first=moving&&from?from:wasExpanded?full:collapsed;
      state.motions=nodes.map(node=>node.animate([first,expanded?full:collapsed],timing));
      state.motions[0].onfinish=()=>{if(active===state)finish();};
    };
  }
  function start(win, {revealSelector = '[data-iv2-reveal], .journal-reading-body > section, .journal-related'} = {}) {
    const doc = win.document;
    const reduce = win.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet();
    const observer = 'IntersectionObserver' in win ? new win.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target, Number(entry.target.dataset.iv2Delay || 0));
      });
    }, {threshold:.08}) : null;
    const animations = new Set();
    function reveal(element, delay = 0) {
      if (seen.has(element)) return;
      seen.add(element);
      // Returning cards must hold still while the hero photo lands in its old slot.
      if (doc.documentElement.getAttribute('data-iv2-route-flight') === 'out') return;
      if (reduce.matches || !element.animate) return;
      const styles = win.getComputedStyle(doc.documentElement);
      const duration = parseFloat(styles.getPropertyValue('--reveal-duration')) || 800;
      const configuredDistance = parseFloat(styles.getPropertyValue('--reveal-distance'));
      const distance = Number.isFinite(configuredDistance) ? configuredDistance : 28;
      const ease = styles.getPropertyValue('--ease-editorial').trim() || 'cubic-bezier(.22,1,.36,1)';
      const motion = element.animate([
        {opacity:0,transform:'translateY(' + distance + 'px)'},
        {opacity:1,transform:'translateY(0)'}
      ], {duration,delay,easing:ease,fill:'backwards'});
      animations.add(motion);
      motion.onfinish = motion.oncancel = () => animations.delete(motion);
    }
    function observeContent() {
      observer?.disconnect();
      const elements = doc.querySelectorAll(revealSelector);
      let postIndex = 0;
      elements.forEach(element => {
        if (!element.getClientRects().length || seen.has(element)) return;
        element.dataset.iv2Delay = String(element.classList.contains('iv2-post') ? (postIndex++ % 3) * 80 : 0);
        if (observer) observer.observe(element); else reveal(element);
      });
    }
    const tabs = doc.querySelector('.iv2-filters');
    const indicator = doc.querySelector('.iv2-tab-indicator');
    function positionIndicator() {
      const active = tabs?.querySelector('[aria-pressed="true"]');
      if (!active || !indicator || !tabs.getClientRects().length) return;
      const activeRect=active.getBoundingClientRect();
      const tabsRect=tabs.getBoundingClientRect();
      const scale=tabsRect.width/tabs.offsetWidth||1;
      const left=(activeRect.left-tabsRect.left)/scale+(tabs.scrollLeft||0);
      const visibleWidth=tabs.clientWidth||tabs.offsetWidth;
      const maxScroll=Math.max(0,(tabs.scrollWidth||visibleWidth)-visibleWidth);
      // Keep direct links and Back-selected categories visible in the mobile rail.
      // Do not use scrollIntoView: it would move the entire document as well.
      if(maxScroll){
        const current=tabs.scrollLeft||0;
        const next=left<current+8?left-8:left+active.offsetWidth>current+visibleWidth-8?left+active.offsetWidth-visibleWidth+8:current;
        tabs.scrollLeft=Math.max(0,Math.min(maxScroll,next));
      }
      indicator.style.width = active.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + left + 'px)';
      tabs.classList.add('has-indicator');
    }
    if (tabs && 'ResizeObserver' in win) new win.ResizeObserver(positionIndicator).observe(tabs);
    else win.addEventListener('resize',positionIndicator,{passive:true});
    doc.fonts?.ready.then(positionIndicator);
    reduce.addEventListener('change',event => {
      if (!event.matches) return;
      animations.forEach(animation => animation.cancel());
      animations.clear();
    });
    win.addEventListener('pageshow',positionIndicator);
    win.addEventListener('sps-theme-change',positionIndicator);
    return {refresh(){positionIndicator();observeContent();}};
  }
  return {cards,emptyState,breadcrumbMotion,start};
});
