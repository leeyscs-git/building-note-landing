// Top nav + Hero section
const Nav = () => (
  <nav className="nav">
    <a href="#" className="nav-logo">
      <span className="nav-logo-mark"></span>
      <span>빌딩노트</span>
    </a>
    <div className="nav-links">
      <a href="#problem">문제 인식</a>
      <a href="#solution">서비스</a>
      <a href="#process">진행 과정</a>
      <a href="#proof">실제 성과</a>
      <a href="#faq">자주 묻는 질문</a>
    </div>
    <a href="#diagnose" className="nav-cta">1분 무료 진단 →</a>
  </nav>
);

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
      <div className="hero-meta">
        <span className="eyebrow eyebrow-red">소규모 빌딩 위탁 자산관리</span>
        <span className="hero-meta-line"></span>
        <span className="mono" style={{ color: 'var(--ink-500)' }}>S.01 — INTRO</span>
      </div>

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
