(() => {
  'use strict';
  const articles = window.SPSJournalArticles;
  const list = document.getElementById('journal-grid');
  const index = document.getElementById('journal-index');
  const detail = document.getElementById('journal-article');
  const categories = new Set(['all','journal','research']);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let category = 'all';
  let renderedRoute = '';
  const journalUrl = (id, filter = category) => {
    const url = new URL('jll-remix-journal.html', location.href);
    if (filter !== 'all') url.searchParams.set('category', filter);
    if (id) url.searchParams.set('article', id);
    else url.hash = 'archive';
    return url.pathname + url.search + url.hash;
  };
  function cover(article) {
    const book = article.book;
    const photo = book.style.startsWith('photo-');
    return `<span class="book-cover" data-style="${book.style}" data-tone="${book.tone}" aria-hidden="true"><span class="book-imprint">SPS JOURNAL<span>${escape(article.label)}</span></span>${photo ? `<span class="book-photo"><img src="${article.image}" alt="" loading="lazy" width="800" height="500"></span>` : ''}<strong class="book-title">${book.lines.map(line => `<span>${escape(line)}</span>`).join('')}</strong><span class="book-subtitle">${escape(book.note)}</span><span class="book-motif"></span><span class="book-colophon"><img src="assets/logo.svg" alt="" width="54" height="18"><span>공간과 운영에 관한 기록</span></span></span>`;
  }
  function renderList() {
    const shown = articles.filter(a => a.id !== 'why-we-work' && (category === 'all' || a.collection === category));
    document.querySelectorAll('.journal-filters [data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    document.getElementById('journal-count').textContent = shown.length ? `${shown.length}개의 글 · 편집 초안` : '0개의 글';
    document.getElementById('journal-category-note').textContent = category === 'research' ? '리서치 · 출처와 분석 근거를 갖춘 자료를 소개합니다.' : category === 'journal' ? '저널 · 우리의 관점, 운영 가이드, 현장의 기록을 담습니다.' : '저널에는 경험과 관점을, 리서치에는 자료와 분석을 담습니다.';
    document.getElementById('journal-empty').hidden = !!shown.length;
    list.hidden = !shown.length;
    list.innerHTML = shown.map(article => `<article class="journal-card"><a href="${journalUrl(article.id)}" data-article="${article.id}"><span class="journal-card-cover">${cover(article)}</span><p class="journal-meta"><span>저널 · ${article.label}</span><span>편집 초안</span></p><h3>${escape(article.title)}</h3><p class="journal-card-summary">${escape(article.summary)}</p><span class="journal-card-read">글 읽기<sps-arrow-up-right></sps-arrow-up-right></span></a></article>`).join('');
    document.getElementById('featured-book-cover').innerHTML = cover(articles.find(a => a.id === 'why-we-work'));
    document.querySelectorAll('.journal-feature [data-article]').forEach(a => { a.href = journalUrl('why-we-work'); });
  }
  function renderArticle(article) {
    const related = articles.filter(a => a.id !== article.id).sort((a,b) => Number(b.category === article.category)-Number(a.category === article.category)).slice(0,2);
    detail.innerHTML = `
      <a class="journal-back" href="${journalUrl()}" data-journal-back><span aria-hidden="true">←</span>인사이트 목록으로</a>
      <header class="journal-article-head"><p class="journal-meta"><span>저널 · ${article.label}</span><span>SPS · 편집 초안</span></p><h1 tabindex="-1">${escape(article.title)}</h1><p class="journal-article-deck">${escape(article.deck)}</p></header>
      ${article.image ? `<figure class="journal-article-hero"><img src="${article.image}" alt="${escape(article.alt)}" width="1200" height="600"><figcaption>이해를 돕는 소개 이미지 · 실제 관리 현장이나 성과 자료가 아닙니다.</figcaption></figure>` : ''}
      <div class="journal-reading"><nav class="journal-toc" aria-label="글 목차"><p>이 글의 흐름</p>${article.sections.map((s,i)=>`<a href="#article-section-${i}">${escape(s.title)}</a>`).join('')}</nav><div class="journal-reading-body"><p>${escape(article.intro)}</p>${article.quote?`<blockquote>${escape(article.quote)}</blockquote>`:''}${article.sections.map((s,i)=>`<section id="article-section-${i}"><h2>${escape(s.title)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}<p class="journal-draft-note">${escape(article.note || '주제와 글의 구성을 검토하기 위한 편집 초안입니다. 발행 전 실제 제공 범위와 현장 자료를 확인하고, 근거가 필요한 내용에는 출처를 추가합니다.')}</p><div class="journal-article-end"><a class="text-link" href="${journalUrl()}" data-journal-back>← 목록으로 돌아가기</a><a class="text-link journal-link" href="jll-remix.html#services">서비스 살펴보기 <sps-arrow-up-right></sps-arrow-up-right></a></div></div></div>
      <aside class="journal-related" aria-labelledby="related-title"><h2 id="related-title">이어서 읽을 기록</h2><div class="journal-related-links">${related.map(a=>`<a href="${journalUrl(a.id)}" data-article="${a.id}"><span><small>${a.label}</small>${escape(a.title)}</span><sps-arrow-up-right></sps-arrow-up-right></a>`).join('')}</div></aside>`;
  }
  function renderRoute({focus = false} = {}) {
    renderedRoute = location.pathname + location.search;
    const params = new URLSearchParams(location.search);
    const requestedCategory = params.get('category');
    category = categories.has(requestedCategory) ? requestedCategory : ['perspective','guide','field'].includes(requestedCategory) ? 'journal' : 'all';
    const article = articles.find(a => a.id === params.get('article'));
    index.hidden = !!article;
    detail.hidden = !article;
    document.title = article ? `${article.title} — SPS 인사이트` : 'SPS 인사이트 — 저널과 리서치';
    if (article) {
      renderArticle(article);
      if (focus) detail.querySelector('h1').focus({preventScroll:true});
    } else renderList();
  }
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    const url = new URL(journalUrl(), location.href);
    history.replaceState({...history.state, category}, '', url);
    renderList();
  }));
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-article],a[data-journal-back]');
    if (!link) return;
    event.preventDefault();
    window.SPSHeader.close();
    if (link.hasAttribute('data-article')) {
      const listScroll = index.hidden ? history.state?.listScroll : window.scrollY;
      const returnUrl = index.hidden ? history.state?.returnUrl : location.pathname + location.search + '#archive';
      if (!index.hidden) history.replaceState({...history.state, scroll:window.scrollY, focusId:link.dataset.article}, '');
      history.pushState({listScroll:listScroll || 0, returnUrl, fromList:true}, '', link.href);
      renderRoute({focus:true});
      window.scrollTo({top:0, behavior:'instant'});
    } else {
      const scroll = history.state?.listScroll;
      const returnUrl = history.state?.returnUrl || link.href;
      history.pushState({scroll:scroll ?? 0}, '', returnUrl);
      renderRoute();
      if (scroll !== undefined) window.scrollTo({top:scroll,behavior:'instant'});
      else document.getElementById('archive').scrollIntoView({behavior:'instant'});
      document.querySelector(`.journal-filters [data-category="${category}"]`).focus({preventScroll:true});
    }
  });
  window.addEventListener('popstate', () => {
    // Native in-article anchors keep the current content and scroll normally.
    if (renderedRoute === location.pathname + location.search) return;
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
