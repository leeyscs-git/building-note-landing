/* Shared article cards for the H homepage and Insights archive.
   Edit content and featured order in jll-remix-journal-data.js. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const articles = [...(window.SPSJournalArticles || [])].sort((a, b) => (a.featured || Infinity) - (b.featured || Infinity));
  const url = (article, category = 'all') => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (article) params.set('article', article.id);
    return `jll-remix-journal.html${params.size ? `?${params}` : ''}${article ? '' : '#archive'}`;
  };
  const cards = (items, category = 'all') => items.map(article => `
    <article class="insight-card" data-category="${escape(article.collection)}">
      <a class="insight-card-link" href="${escape(url(article, category))}" data-article="${escape(article.id)}">
        <span class="insight-image"><img src="${escape(article.image)}" alt="${escape(article.alt)}" loading="lazy" width="800" height="520"></span>
        <div class="insight-copy">
          <p class="article-meta">${escape(article.label)}<span>${escape(article.series)}</span></p>
          <h3>${escape(article.title)}</h3>
          <p>${escape(article.summary)}</p>
          <span class="text-link insight-read">인사이트 읽기 <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>`).join('');
  window.SPSInsights = { articles, cards, url };

  document.querySelectorAll('[data-insights-preview]').forEach(section => {
    const grid = section.querySelector('.insight-grid');
    const empty = section.querySelector('[data-insights-empty]');
    const more = section.querySelector('[data-insights-more]');
    const filters = section.querySelectorAll('[data-insights-filter]');
    const render = (category = 'all') => {
      const items = articles.filter(a => category === 'all' || a.collection === category).slice(0, 3);
      grid.innerHTML = cards(items, category);
      grid.hidden = !items.length;
      empty.hidden = !!items.length;
      more.href = url(null, category);
      filters.forEach(button => {
        const selected = button.dataset.insightsFilter === category;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    };
    filters.forEach(button => button.addEventListener('click', () => render(button.dataset.insightsFilter)));
    render();
  });
})();
