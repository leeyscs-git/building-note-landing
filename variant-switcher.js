// Design-review controls stay outside the page styles and disappear in comparisons.
(() => {
  if (new URLSearchParams(location.search).has('embed')) return;
  const active = location.pathname.includes('smpmc') ? 'd' : location.pathname.includes('mastercard') ? 'a' : document.documentElement.hasAttribute('data-c-site') || location.pathname.includes('hyosung') ? 'c' : 'b';
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
  </style><nav aria-label="디자인 버전"><a href="mastercard.html" ${active === 'a' ? 'aria-current="page"' : ''}>A · Mastercard</a><a href="jll.html" ${active === 'b' ? 'aria-current="page"' : ''}>B · JLL</a><a href="hyosung.html" ${active === 'c' ? 'aria-current="page"' : ''}>C · Hyosung</a><a href="smpmc.html" ${active === 'd' ? 'aria-current="page"' : ''}>D · SM PMC</a><a class="compare" href="compare.html">비교 ↗</a></nav>`;
  document.body.append(host);
})();
