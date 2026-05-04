// Top nav + Hero section
const SECTION_NAV_ITEMS = [
  { id: 'problem',      num: '01', label: '혹시, 이런 고민이 있으신가요?' },
  { id: 'solution',     num: '02', label: '이렇게 도와드리겠습니다' },
  { id: 'story',        num: '03', label: '저희가 시작한 이야기' },
  { id: 'process',      num: '04', label: '도입 절차 안내' },
  { id: 'proof',        num: '05', label: '검증된 절감 효과' },
  { id: 'testimonials', num: '06', label: '고객님들의 후기' },
  { id: 'faq',          num: '07', label: '자주 묻는 질문' },
  { id: 'diagnose',     num: '08', label: '무료 진단 신청' },
];

const SERVICE_MEGA_COLS = [
  {
    title: '통합 위탁관리',
    desc: '5–50세대 소규모 빌딩을 위한 AI Agent 기반 종합 위탁관리 솔루션입니다.',
    items: [
      { label: '빌딩 위탁관리', href: '#' },
      { label: 'AI 임차인 응대', href: '#' },
      { label: '24시간 응대 서비스', href: '#' },
    ],
  },
  {
    title: '운영 자동화',
    desc: '검침·청구·세금계산서 발행 등 매월 반복되는 실무를 자동화합니다.',
    items: [
      { label: '자동 검침·청구', href: '#' },
      { label: '세금계산서 발행', href: '#' },
      { label: '종합소득세 패키지', href: '#' },
    ],
  },
  {
    title: '시설·자산 관리',
    desc: '시설 유지보수부터 자산가치 관리까지, 빌딩의 가치를 보존합니다.',
    items: [
      { label: '시설 유지보수', href: '#' },
      { label: '자산가치 관리', href: '#' },
      { label: '임대료 시세 분석', href: '#' },
    ],
  },
  {
    title: '리포트 & 인사이트',
    desc: '월간 30분 리포트로 빌딩 상태와 운영 인사이트를 전달드립니다.',
    items: [
      { label: '월간 운영 리포트', href: '#' },
      { label: '분기 자산가치 리포트', href: '#' },
      { label: '임대료 시세 알림', href: '#' },
    ],
  },
];

const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeId, setActiveId] = React.useState('');
  const [megaOpen, setMegaOpen] = React.useState(false);
  const closeTimer = React.useRef(null);
  const openMega = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 220);
  };
  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      // 스크롤 위치 + 헤더 보정만큼 아래에서 가장 최근에 통과한 섹션이 active
      const offset = 120;
      let currentId = '';
      for (const { id } of SECTION_NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (top - offset <= scrollY) currentId = id;
      }
      setActiveId(currentId);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      {/* nav-top 비활성화 — 톤이 애매해서 일단 숨김. 살리려면 아래 블록 주석 해제 + .nav top:48px / .hero padding-top:188px 복구 */}
      {/*
      <div className={`nav-top${scrolled ? ' is-hidden' : ''}`}>
        <div className="nav-top-links">
          <a href="#">회사소개</a>
          <a href="#">블로그</a>
          <a href="#">채용</a>
          <a href="#">보도자료</a>
        </div>
        <a href="#diagnose" className="nav-top-cta">1분 무료 진단</a>
      </div>
      */}
      <nav className="nav">
        <a href="#" className="nav-logo" aria-label="SPS 홈">
          <img src="assets/logo.svg" alt="SPS" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          <a href="#">회사소개</a>
          <a
            href="#"
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
          >서비스</a>
          <a href="#">관리자산</a>
          <a href="#">리서치</a>
        </div>
        <div className="nav-utility">
          <a href="#diagnose">문의하기</a>
          <span className="nav-utility-divider"></span>
          <a href="#" className="nav-lang">KOR</a>
          <button className="nav-search" aria-label="검색">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.4 9.4 L13 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>
      <div
        className={`nav-mega${megaOpen ? ' open' : ''}`}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
      >
        <div className="nav-mega-inner">
          {SERVICE_MEGA_COLS.map((col) => (
            <div className="nav-mega-col" key={col.title}>
              <a href="#" className="nav-mega-title">
                <span>{col.title}</span>
                <span className="nav-mega-arrow">›</span>
              </a>
              <p className="nav-mega-desc">{col.desc}</p>
              <ul className="nav-mega-list">
                {col.items.map((it) => (
                  <li key={it.label}><a href={it.href}>{it.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <aside className="section-nav" aria-label="페이지 섹션">
        {SECTION_NAV_ITEMS.map(({ id, num, label }) => (
          <a key={id} href={`#${id}`} className={activeId === id ? 'is-active' : ''}>
            <span className="section-nav-num">{num}</span>
            <span className="section-nav-label">{label}</span>
          </a>
        ))}
      </aside>
    </>
  );
};

const HeroFigure = () => (
  <div className="hero-figure">
    <div className="hero-fig-grid">
      {/* Row 1 */}
      <div className="hero-fig-cell label" style={{ gridColumn: 'span 2' }}>월간 리포트 / 30분</div>
      <div className="hero-fig-cell red" style={{ gridColumn: 'span 4' }}></div>
      <div className="hero-fig-cell" style={{ gridColumn: 'span 3' }}></div>
      <div className="hero-fig-cell bone" style={{ gridColumn: 'span 3' }}></div>
      {/* Row 2 */}
      <div className="hero-fig-cell" style={{ gridColumn: 'span 5' }}></div>
      <div className="hero-fig-cell label" style={{ gridColumn: 'span 3' }}>AI Agent / 24h</div>
      <div className="hero-fig-cell red" style={{ gridColumn: 'span 2' }}></div>
      <div className="hero-fig-cell" style={{ gridColumn: 'span 2' }}></div>
      {/* Row 3 */}
      <div className="hero-fig-cell bone" style={{ gridColumn: 'span 3' }}></div>
      <div className="hero-fig-cell" style={{ gridColumn: 'span 2' }}></div>
      <div className="hero-fig-cell" style={{ gridColumn: 'span 4' }}></div>
      <div className="hero-fig-cell label" style={{ gridColumn: 'span 3' }}>BUILDINGNOTE — EST. 2025</div>
    </div>
    {/* Caption */}
    <div style={{
      position: 'absolute', bottom: 32, left: 32, right: 32,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.1em', zIndex: 2
    }}>
      <span>FIG. 01 / 자산관리 인프라 분배도</span>
      <span>5–50세대 / 위탁 자산 / 운영 30분</span>
    </div>
  </div>
);

const Hero = () => (
  <header className="hero section">
    <div className="container">
      <h1 className="display hero-headline">
        매주 빌딩에 빼앗기던<br />
        <span style={{ whiteSpace: 'nowrap' }}>10시간,</span> 이제<br />
        <em>월 30분 리포트</em>로 끝납니다.
      </h1>

      <p className="lede hero-sub">
        직접 운영하는 임대인이 만든 AI Agent 위탁관리.
        검침·청구·세금계산서·임차인 응대까지 모두 자동.
        관리인 비용의 60%로, 더 전문적으로.
        <br /><br />
        <span style={{ color: 'var(--ink-900)', fontWeight: 500 }}>
          첫 고객은 저희 어머니였습니다.
        </span>
      </p>

      <div className="hero-actions">
        <a href="#diagnose" className="btn btn-primary btn-lg">
          1분 만에 우리 빌딩 진단 받기
          <span className="btn-arrow"></span>
        </a>
        <span className="hero-limit-note">
          초기 도입 월 2~3건 한정 · 첫 3개월 50% 할인
        </span>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-num">95<span className="unit">%</span></div>
          <div className="hero-stat-label">월 운영시간 절감<br/>(30~40h → 30분)</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">3,000<span className="unit">만+</span></div>
          <div className="hero-stat-label">관리인 채용 대비<br/>연 절감액</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">24<span className="unit">/7</span></div>
          <div className="hero-stat-label">AI Agent<br/>임차인 응대</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-num">국내 <span className="unit">최초</span></div>
          <div className="hero-stat-label">AI Agent 통합<br/>임대 자산관리</div>
        </div>
      </div>

      <HeroFigure />
    </div>
  </header>
);

const Ticker = () => (
  <div className="ticker">
    <div className="ticker-track">
      <span>임차인 카톡 자동 응대</span>
      <span>검침 · 청구 · 세금계산서</span>
      <span>매월 운영 리포트</span>
      <span>분기 자산가치 리포트</span>
      <span>임대료 시세 인상 알림</span>
      <span>종합소득세 데이터 패키지</span>
      <span>임차인 카톡 자동 응대</span>
      <span>검침 · 청구 · 세금계산서</span>
      <span>매월 운영 리포트</span>
      <span>분기 자산가치 리포트</span>
      <span>임대료 시세 인상 알림</span>
      <span>종합소득세 데이터 패키지</span>
    </div>
  </div>
);

Object.assign(window, { Nav, Hero, Ticker });
