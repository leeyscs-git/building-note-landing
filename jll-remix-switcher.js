// Design-review controls stay outside the page styles and disappear in comparisons.
(() => {
  if (new URLSearchParams(location.search).has('embed')) return;
  const active = ({v2:'h2', v3:'h3', v4:'h4'})[document.documentElement.dataset.serviceMenu] || 'h';
  const host = document.createElement('aside');
  host.setAttribute('aria-label', '디자인 시안 전환');
  host.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:40;max-width:calc(100vw - 32px)';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>
    :host{font-family:'Pretendard Variable',Arial,sans-serif}
    nav{display:flex;flex-wrap:wrap;align-items:center;gap:3px;padding:5px;background:#fff;border:1px solid #d9dedf;box-shadow:0 4px 20px #00000012;border-radius:7px}
    a{display:flex;align-items:center;justify-content:center;min-height:34px;padding:0 12px;text-decoration:none;color:#45525a;border-radius:3px;font-size:11px;font-weight:500;white-space:nowrap}
    a[aria-current=page]{background:#10252b;color:#fff}a:hover{background:#edf1f2;color:#10252b}a:focus-visible{outline:2px solid #d5092b;outline-offset:2px}
    .compare{border-left:1px solid #d9dedf;border-radius:0;margin-left:3px;padding-left:13px;font-weight:650}
    @media(max-width:420px){a{font-size:8px;min-height:36px;padding-inline:4px}.compare{padding-left:7px;margin-left:0}}
  </style><nav aria-label="디자인 버전"><a href="mastercard.html">A · Mastercard</a><a href="jll.html">B · JLL</a><a href="hyosung.html">C · Hyosung</a><a href="smpmc.html">D · SM PMC</a><a href="jll-remix.html" ${active === 'h' ? 'aria-current="page"' : ''}>H · V1</a><a href="jll-remix-v2.html" ${active === 'h2' ? 'aria-current="page"' : ''}>V2 트윅</a><a class="compare" href="compare.html?view=hh2">V1·V2 비교 ↗</a></nav>`;
  const v3Link = document.createElement('a');
  v3Link.href = 'jll-remix-v3.html';
  v3Link.textContent = 'V3 픽토그램';
  if (active === 'h3') v3Link.setAttribute('aria-current', 'page');
  const compareLink = root.querySelector('.compare');
  compareLink.before(v3Link);
  compareLink.href = 'compare.html?view=h123';
  compareLink.textContent = 'V1·V2·V3 비교 ↗';
  const v4Link = document.createElement('a');
  v4Link.href = 'jll-remix-v4.html';
  v4Link.textContent = 'V4 레퍼런스';
  if (active === 'h4') v4Link.setAttribute('aria-current', 'page');
  compareLink.before(v4Link);
  const iconCompare = document.createElement('a');
  iconCompare.href = 'compare.html?view=hh4';
  iconCompare.textContent = 'V1·V4 픽토그램 비교 ↗';
  iconCompare.className = 'compare';
  compareLink.after(iconCompare);
  document.body.append(host);
})();
