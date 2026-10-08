(() => {
  'use strict';
  const articles = window.SPSInsights.articles;
  const list = document.getElementById('journal-grid');
  const index = document.getElementById('journal-index');
  const detail = document.getElementById('journal-article');
  const categories = new Set(['all','journal','research']);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let category = 'all';
  let renderedRoute = '';
  let renderedArticleId = null;
  const journalUrl = (id, filter = category) => {
    if (window.SPSJournalPresentation) return window.SPSJournalPresentation.urlFor(id ? {id} : null, filter, location.search);
    const url = new URL('jll-remix-journal-v2.html', location.href);
    if (new URLSearchParams(location.search).get('layout') === 'desktop') url.searchParams.set('layout', 'desktop');
    if (filter !== 'all') url.searchParams.set('category', filter);
    if (id) url.searchParams.set('article', id);
    else url.hash = 'archive';
    return url.pathname + url.search + url.hash;
  };
  function renderList() {
    const shown = articles.filter(a => category === 'all' || a.collection === category);
    document.querySelectorAll('.journal-filters [data-category]').forEach(button => {
      const selected = button.dataset.category === category;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('active', selected);
    });
    const count = document.getElementById('journal-count');
    if (count) count.textContent = shown.length ? `${shown.length}개의 글 · 편집 초안` : '0개의 글';
    const categoryNote = document.getElementById('journal-category-note');
    if (categoryNote) categoryNote.textContent = category === 'research' ? '리서치 · 출처와 분석 근거를 갖춘 자료를 소개합니다.' : category === 'journal' ? 'CEO 저널 · 우리의 관점, 운영 가이드, 현장의 기록을 담습니다.' : 'CEO 저널에는 경험과 관점을, 리서치에는 자료와 분석을 담습니다.';
    document.getElementById('journal-empty').hidden = !!shown.length;
    list.hidden = !shown.length;
    list.innerHTML = (window.SPSJournalPresentation || window.SPSInsights).cards(shown, category);
    document.dispatchEvent(new CustomEvent('sps-journal-render', {detail:{view:'list', category}}));
  }
  function renderArticle(article) {
    const collectionLabel = article.collection === 'research' ? '리서치' : 'CEO 저널';
    const related = articles.filter(a => a.id !== article.id).sort((a,b) => Number(b.category === article.category)-Number(a.category === article.category)).slice(0,2);
    detail.innerHTML = `
      <div class="iv2-article-intro"><div class="iv2-article-scene">
      <header class="journal-article-head"><p class="journal-meta"><span>${collectionLabel}</span></p><h1 tabindex="-1">${escape(article.title)}</h1></header>
      ${article.image ? `<figure class="journal-article-hero" aria-describedby="iv2-image-caption"><div class="iv2-hero-stage"><div class="iv2-hero-frame"><img src="${escape(article.image)}" alt="${escape(article.alt)}" width="1200" height="600" fetchpriority="high"></div></div></figure>` : ''}
      ${article.image ? `<div class="iv2-title-overlay" aria-hidden="true"><div class="iv2-title-copy"><p class="journal-meta"><span>${collectionLabel}</span></p><p class="iv2-overlay-heading">${escape(article.title)}</p></div></div>` : ''}
      </div></div>
      <div class="iv2-article-content">
      <div class="journal-reading"><div class="journal-reading-body"><p>${escape(article.intro)}</p>${article.quote?`<blockquote>${escape(article.quote)}</blockquote>`:''}${article.sections.map((s,i)=>`<section id="article-section-${i}"><h2>${escape(s.title)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}<div class="journal-article-end"><a class="text-link" href="${journalUrl()}" data-journal-back>← 목록으로 돌아가기</a><a class="text-link journal-link" href="jll-remix.html#services">서비스 살펴보기 <sps-arrow-up-right></sps-arrow-up-right></a></div></div></div>
      <aside class="journal-related" aria-labelledby="related-title"><h2 id="related-title">이어서 읽을 기록</h2><div class="journal-related-links">${related.map(a=>`<a href="${journalUrl(a.id)}" data-article="${a.id}"><span><small>${a.collection === 'research' ? '리서치' : 'CEO 저널'}</small>${escape(a.title)}</span><sps-arrow-up-right></sps-arrow-up-right></a>`).join('')}</div></aside>
      ${article.image ? `<p id="iv2-image-caption" class="iv2-hero-caption">이해를 돕는 소개 이미지 · 실제 관리 현장이나 성과 자료가 아닙니다.</p>` : ''}
      </div>`;
  }
  function renderRoute({focus = false} = {}) {
    renderedRoute = location.pathname + location.search;
    const params = new URLSearchParams(location.search);
    const requestedCategory = params.get('category');
    category = categories.has(requestedCategory) ? requestedCategory : ['perspective','guide','field'].includes(requestedCategory) ? 'journal' : 'all';
    const article = articles.find(a => a.id === params.get('article'));
    renderedArticleId = article?.id || null;
    index.hidden = !!article;
    detail.hidden = !article;
    document.title = article ? `${article.title} — SPS 인사이트` : 'SPS 인사이트 — CEO 저널과 리서치';
    if (article) {
      renderArticle(article);
      document.dispatchEvent(new CustomEvent('sps-journal-render', {detail:{view:'article', category}}));
      if (focus) detail.querySelector('h1').focus({preventScroll:true});
    } else renderList();
  }
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    window.SPSJournalTransition?.cancel();
    category = button.dataset.category;
    const url = new URL(journalUrl(), location.href);
    history.replaceState({...history.state, category}, '', url);
    renderList();
  }));
  function restoreList(scroll, focusId) {
    renderRoute();
    if (scroll !== undefined) window.scrollTo({top:scroll,behavior:'instant'});
    else document.getElementById('archive').scrollIntoView({behavior:'instant'});
    const card = focusId && document.querySelector(`#journal-grid [data-article="${focusId}"]`);
    (card || document.querySelector(`.journal-filters [data-category="${category}"]`))?.focus({preventScroll:true});
  }
  function returnPhoto(articleId, navigate) {
    if (articleId && window.SPSJournalTransition?.back) window.SPSJournalTransition.back(articleId,navigate);
    else { window.SPSJournalTransition?.cancel(); navigate(); }
  }
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-article],a[data-journal-back],[data-sps-header] a[href]');
    if (!link) return;
    const targetUrl = new URL(link.href,location.href);
    const headerReturn = !detail.hidden && window.SPSJournalTransition &&
      targetUrl.origin === location.origin && targetUrl.pathname === location.pathname && !targetUrl.searchParams.has('article');
    if (!link.hasAttribute('data-article') && !link.hasAttribute('data-journal-back') && !headerReturn) return;
    event.preventDefault();
    window.SPSHeader.close();
    if (link.hasAttribute('data-article')) {
      const listScroll = index.hidden ? history.state?.listScroll : window.scrollY;
      const returnUrl = index.hidden ? history.state?.returnUrl : location.pathname + location.search + '#archive';
      const navigate = () => {
        if (!index.hidden) history.replaceState({...history.state, scroll:window.scrollY, focusId:link.dataset.article}, '');
        history.pushState({listScroll:listScroll || 0, returnUrl, fromList:true}, '', link.href);
        renderRoute({focus:true});
        window.scrollTo({top:0, behavior:'instant'});
      };
      if (window.SPSJournalTransition) window.SPSJournalTransition.open(link,navigate);
      else navigate();
    } else {
      const articleId = renderedArticleId;
      const scroll = history.state?.listScroll;
      const returnUrl = history.state?.returnUrl || link.href;
      returnPhoto(articleId, () => {
        history.pushState({scroll:scroll ?? 0, focusId:articleId}, '', returnUrl);
        restoreList(scroll,articleId);
      });
    }
  });
  window.addEventListener('popstate', () => {
    window.SPSJournalTransition?.cancel();
    // Native in-article anchors keep the current content and scroll normally.
    if (renderedRoute === location.pathname + location.search) return;
    const nextArticleId = new URLSearchParams(location.search).get('article');
    if (renderedArticleId && !articles.some(article => article.id === nextArticleId)) {
      const articleId = renderedArticleId;
      returnPhoto(articleId, () => restoreList(history.state?.scroll || 0,articleId));
      return;
    }
    renderRoute();
    requestAnimationFrame(() => {
      const section = !detail.hidden && /^#article-section-\d+$/.test(location.hash)
        ? document.querySelector(location.hash) : null;
      if (section) section.scrollIntoView({behavior:'instant'});
      else window.scrollTo({top:history.state?.scroll || 0, behavior:'instant'});
      const focusId=history.state?.focusId;
      if(!index.hidden && focusId) document.querySelector(`[data-article="${focusId}"]`)?.focus({preventScroll:true});
    });
  });
  renderRoute();
})();
