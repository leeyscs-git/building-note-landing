// Part 3: Final CTA + Endings + Filter + FAQ + Guarantee + Diagnose form + Footer

const FinalCTA = () => (
  <section className="final-cta">
    <div className="container-narrow">
      <div className="final-cta-counter">
        <span>월 2~3건 한정</span>
        <span>·</span>
        <span>이번 달 슬롯 — 마감 임박</span>
      </div>

      <h2 className="display-md final-cta-headline" style={{ color: 'var(--white)', maxWidth: '20ch', margin: '0 auto 32px' }}>
        이번 달 정산 주간이<br/>
        시작되기 전,<br/>
        <span style={{ color: 'var(--red-500)' }}>마지막 도입 슬롯입니다.</span>
      </h2>

      <p className="lede" style={{ color: 'var(--ink-300)', maxWidth: '50ch', margin: '0 auto 64px' }}>
        매주 10시간 → 월 30분 · 관리인 비용 60% 절감 · 24시간 임차인 응대 · 시세 인상 자동 알림 —
        이 모든 것이 첫 3개월 50% 할인 + 셋업비 무료로 시작됩니다.
      </p>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="#diagnose" className="btn btn-primary btn-lg" style={{ padding: '24px 40px' }}>
          네, 이번 달 정산 주간을 마지막으로 끝내겠습니다
          <span className="btn-arrow"></span>
        </a>
      </div>

      <p className="final-cta-quote">
        "어머니가 30년 만에 되찾으신 일주일을,<br/>
        이제 당신께 돌려드릴 차례입니다."
      </p>
    </div>
  </section>
);

const Endings = () => (
  <section className="section--paper" style={{ padding: 0 }}>
    <div style={{ padding: 'clamp(60px, 8vw, 120px) var(--pad-x) 0' }}>
      <div className="container">
        <div className="section-head">
          <div><div className="section-head-num">S.11 — 1년 후</div></div>
          <h2 className="h2 section-head-title">
            오늘의 선택이<br/>
            1년 후 일주일을 결정합니다.
          </h2>
        </div>
      </div>
    </div>

    <div className="endings">
      <div className="ending ending--bad">
        <div>
          <div className="ending-tag">SCENARIO A · 오늘 도입 안 함</div>
          <h3 className="ending-headline">
            여전히 매월 정산 주간엔<br/>
            본업이 멈춥니다.
          </h3>
          <p className="ending-body">
            임차인 카톡에 회의를 끊고, 종합소득세 신고에 1~2주를 또 쓰고 계실 겁니다.
            시세 인상 타이밍은 또 놓치셨을 거고요.
          </p>
        </div>
        <div>
          <div className="mono" style={{ color: 'var(--ink-600)', marginBottom: 12 }}>누적 손실</div>
          <div className="ending-num" style={{ color: 'var(--ink-1000)' }}>—5,000만원</div>
        </div>
      </div>

      <div className="ending ending--good">
        <div>
          <div className="ending-tag">SCENARIO B · 오늘 도입</div>
          <h3 className="ending-headline">
            매월 30분 리포트만 받고<br/>
            본업·가족·휴식에 집중.
          </h3>
          <p className="ending-body">
            임대료는 데이터 기반으로 연 5~10% 자동 성장하고,
            자녀에게 인계할 수 있는 운영 매뉴얼이 데이터로 정리되어 있습니다.
          </p>
        </div>
        <div>
          <div className="mono" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>누적 이익</div>
          <div className="ending-num">+8,000만원</div>
        </div>
      </div>
    </div>

    <div style={{ padding: 'clamp(60px, 8vw, 120px) var(--pad-x)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          borderTop: '1px solid var(--ink-900)'
        }}>
          {[
            { a: '본업이 멈추는 정산 주간', b: '리포트 30분이면 끝나는 평온' },
            { a: '24시간 카톡 알림', b: '회의가 끊기지 않는 본업' },
            { a: '시세 인상 놓치는 후회', b: '데이터로 받는 자산 성장' },
          ].map((c, i) => (
            <div key={i} style={{
              padding: 32,
              borderRight: i < 2 ? 'var(--hair)' : 'none'
            }}>
              <div style={{ fontSize: 14, color: 'var(--ink-500)', marginBottom: 16, textDecoration: 'line-through' }}>{c.a}</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--red-700)' }}>→ {c.b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Filter = () => (
  <section className="section section--white">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.12 — 타겟</div></div>
        <h2 className="h2 section-head-title">
          모든 임대인을 위한<br/>
          서비스가 아닙니다.
        </h2>
      </div>

      <div className="filter">
        <div className="filter-col filter-col--yes">
          <span className="filter-tag filter-tag--yes">RECOMMENDED · 추천</span>
          <ul className="filter-list">
            <li>관리인 두기엔 작지만, 직접 하기엔 본업이 멈추는 5~50세대 보유 임대인</li>
            <li>매주 5~10시간을 빌딩에 빼앗기고 계신 분</li>
            <li>회사 자산·상속 자산을 전문적으로 운영해야 하는 담당자</li>
            <li>빌딩을 단기 임대수익이 아닌 장기 자산으로 키우실 분</li>
            <li>매월 운영 리포트로 결과를 확인하고, 디테일을 신뢰하실 분</li>
          </ul>
        </div>
        <div className="filter-col filter-col--no">
          <span className="filter-tag filter-tag--no">NOT FOR YOU · 비추천</span>
          <ul className="filter-list">
            <li>엑셀과 수기 작업으로도 충분하다고 생각하시는 분</li>
            <li>건물관리에 가치를 느끼지 못하시거나 의지가 없으신 분</li>
            <li>초대형 아파트 단지를 운영하시는 운영사 (체급 不일치)</li>
            <li>운영을 위탁하지 않고 직접 챙기실 때 더 마음이 편하신 분</li>
          </ul>
        </div>
      </div>

      <div style={{
        marginTop: 56,
        padding: 40,
        background: 'var(--bone)',
        borderLeft: '3px solid var(--red-700)'
      }}>
        <div className="eyebrow eyebrow-red" style={{ marginBottom: 12 }}>현실적 기대치</div>
        <p className="body" style={{ fontSize: 17, color: 'var(--ink-800)', maxWidth: '70ch' }}>
          이 서비스는 빌딩을 마법처럼 키워드리는 게 아닙니다.
          임대인의 시간을 본업과 가족에게 돌려드리고, 데이터 기반으로 자산을 천천히 성장시키는 인프라입니다.
          첫 달부터 시간이 돌아오고, 6개월차부터 자산 성장 효과가 숫자로 보이기 시작합니다.
        </p>
      </div>
    </div>
  </section>
);

const Guarantee = () => (
  <section className="section section--bone">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.13 — 리스크 제거</div></div>
        <h2 className="h2 section-head-title">
          잃으실 것이 없습니다.<br/>
          셋업비도 받지 않으니까요.
        </h2>
      </div>

      <div style={{
        padding: 40,
        background: 'var(--ink-1000)',
        color: 'var(--white)',
        marginBottom: 32,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 40,
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: 'clamp(48px, 6vw, 88px)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: 'var(--red-500)'
        }}>30일</div>
        <div>
          <div className="eyebrow" style={{ color: 'var(--red-500)', marginBottom: 12 }}>환불 정책</div>
          <h3 className="h3" style={{ color: 'var(--white)' }}>
            첫 30일 안에 만족하지 못하시면, 위탁료 100% 환불.
          </h3>
        </div>
      </div>

      <div className="guarantee-grid">
        <div className="guarantee">
          <div className="guarantee-icon">G.01</div>
          <h4 className="guarantee-title">시간 보장</h4>
          <p className="guarantee-body">
            도입 첫 달부터 임대인 운영 시간이 월 30분 이하가 되지 않으면 다음 달 무료.
          </p>
        </div>
        <div className="guarantee">
          <div className="guarantee-icon">G.02</div>
          <h4 className="guarantee-title">휴먼에러 보장</h4>
          <p className="guarantee-body">
            AI Agent의 검침·세금계산서 오류로 발생한 비용은 저희가 100% 보전.
          </p>
        </div>
        <div className="guarantee">
          <div className="guarantee-icon">G.03</div>
          <h4 className="guarantee-title">데이터 보장</h4>
          <p className="guarantee-body">
            어떤 시점에 종료하셔도 전체 데이터를 임대인 소유로 즉시 이관.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = React.useState(0);
  const items = [
    {
      q: "정말 70대 어머니도 쓰실 수 있나요?",
      a: "첫 고객이 저희 어머니이십니다. 카톡만 되시면 됩니다. 임대인이 직접 시스템을 다루실 일이 없도록 위탁 구조로 설계했습니다."
    },
    {
      q: "임차인이 AI 응대를 싫어하지 않을까요?",
      a: "AI Agent는 임차인에게 'AI'라고 밝히지 않고 임대인 측 매니저로 응대합니다. 복잡한 사안은 즉시 사람 매니저로 전환되며, 응대 만족도는 평균 4.7/5.0을 기록 중입니다."
    },
    {
      q: "우리 빌딩 데이터가 안전한가요?",
      a: "임차인 정보는 분리 저장되며, AI 학습에 사용되지 않습니다. 임대인이 언제든 전체 데이터를 다운로드하실 수 있고, 모든 통신은 암호화됩니다."
    },
    {
      q: "도중에 그만두면 데이터를 가져갈 수 있나요?",
      a: "네. 모든 임차인 정보·계약서·검침 이력·세금계산서 데이터를 엑셀과 PDF로 즉시 이관해 드립니다. 종료 시 위약금 없습니다."
    },
    {
      q: "세무사·법무사가 따로 있는데, 충돌하지 않나요?",
      a: "충돌하지 않습니다. 오히려 저희가 정리한 데이터 패키지를 받으시면 세무사 비용이 줄어듭니다. 기존 세무사·법무사와 협업하는 구조입니다."
    },
    {
      q: "위탁료는 어떻게 책정되나요?",
      a: "임대료 수입의 5~7% 또는 건물당 월 100~200만원. 관리인 채용(월 350만원+4대보험) 대비 연 3,000만원 이상 절감되는 구조입니다."
    },
  ];

  return (
    <section className="section section--white" id="faq">
      <div className="container">
        <div className="section-head">
          <div><div className="section-head-num">S.13.1 — 자주 묻는 질문</div></div>
          <h2 className="h2 section-head-title">
            이미 답을<br/>
            드린 질문들.
          </h2>
        </div>

        <div className="faq-list">
          {items.map((it, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <div className="faq-q">
                <span className="faq-num">Q.{String(i + 1).padStart(2, '0')}</span>
                <span>{it.q}</span>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Diagnose = () => {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    units: null, hours: null, type: null, contact: ''
  });
  // 공감 체크리스트 토글 상태 (기본: 첫 항목만 on 데모)
  const [empathy, setEmpathy] = React.useState({ '0-0': true });
  const toggleEmpathy = (key) => {
    setEmpathy((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };
  const onCount = Object.keys(empathy).length;
  const EMPATHY_CATS = [
    { name: '임차인 응대', items: [
      '한밤중에도 카톡으로 연락이 온다',
      '같은 민원을 매번 반복해서 받는다',
      '응대가 늦어 임차인 만족도가 떨어진다',
    ] },
    { name: '검침·청구·세무', items: [
      '매월 검침·청구 작업에 반나절이 사라진다',
      '임차인별 세금계산서 발행이 늘 부담이다',
      '누락·실수가 종종 발생한다',
    ] },
    { name: '시설·유지보수', items: [
      '작은 고장도 직접 업체를 알아봐야 한다',
      '견적·일정 조율로 일과가 통째로 날아간다',
      '사후 관리가 안 돼 같은 문제가 반복된다',
    ] },
    { name: '운영 가시성', items: [
      '빌딩 상황이 한눈에 파악되지 않는다',
      '자료가 흩어져 의사결정이 느려진다',
      '중요한 변동을 놓치는 일이 잦다',
    ] },
  ];

  const totalSteps = 5;

  const setAns = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setTimeout(() => setStep(s => Math.min(s + 1, totalSteps)), 250);
  };

  const reset = () => { setStep(0); setAnswers({ units: null, hours: null, type: null, contact: '' }); };

  // Estimate
  const unitsMap = { '5–10': 7, '11–20': 15, '21–30': 25, '31–50': 40 };
  const hoursMap = { '2–4': 3, '5–7': 6, '8–10': 9, '10+': 12 };
  const u = unitsMap[answers.units] || 0;
  const h = hoursMap[answers.hours] || 0;
  const estSaving = Math.round(u * 50 + h * 200 + 3000);

  return (
    <section className="section section--paper" id="diagnose">
      <div className="container">
        <div className="section-head">
          <div><div className="section-head-num">S.14 — 1분 무료 진단</div></div>
          <h2 className="h2 section-head-title">
            우리 빌딩 절감액,<br/>
            1분이면 확인됩니다.
          </h2>
        </div>

        <div className="diagnose">
          <div>
            <div className="eyebrow eyebrow-red" style={{ marginBottom: 24 }}>진행 상황</div>
            <div className="diagnose-stepper">
              {[
                '체크리스트',
                '보유 세대수',
                '주간 운영 시간',
                '운영 형태',
                '연락처',
              ].map((s, i) => (
                <div
                  key={i}
                  className={`diagnose-step-row ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`}
                >
                  <span className="diagnose-step-num">0{i + 1}</span>
                  <span className="diagnose-step-title">{s}</span>
                  <span className="diagnose-step-mark">{step > i ? '✓' : (step === i ? '●' : '○')}</span>
                </div>
              ))}
              <div className={`diagnose-step-row ${step >= totalSteps ? 'active' : ''}`}>
                <span className="diagnose-step-num">→</span>
                <span className="diagnose-step-title" style={{ fontWeight: 600 }}>진단 결과</span>
                <span className="diagnose-step-mark">{step >= totalSteps ? '✓' : '○'}</span>
              </div>
            </div>
          </div>

          <div className="diagnose-form">
            {step === 0 && (
              <>
                <h3 className="diagnose-q">"대표님 빌딩, 몇 개나 해당되시나요?"</h3>
                <p className="diagnose-q-sub">체크해 보시면 빌딩 운영의 진짜 문제가 금방 보입니다.</p>
                <div className="diag-checklist-inline">
                  {EMPATHY_CATS.map((cat, i) => (
                    <div className="diag-empathy-block" key={cat.name}>
                      <div className="diag-empathy-cat-pill">{cat.name}</div>
                      {cat.items.map((it, j) => {
                        const k = `${i}-${j}`;
                        const isOn = !!empathy[k];
                        return (
                          <div className="diag-empathy-row" key={j}>
                            <span className="diag-empathy-row-text">{it}</span>
                            <button
                              type="button"
                              className={`diag-toggle${isOn ? ' is-on' : ''}`}
                              onClick={() => toggleEmpathy(k)}
                              aria-pressed={isOn}
                              aria-label={`${it} ${isOn ? '체크됨' : '체크되지 않음'}`}
                            >
                              <span className="diag-toggle-handle"></span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
                  onClick={() => setStep(1)}
                >
                  다음 단계로
                  <span className="btn-arrow"></span>
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="diagnose-q">보유하신 세대 수는 어느 정도이신가요?</h3>
                <p className="diagnose-q-sub">상가·오피스텔·임대주택 합산 기준</p>
                <div className="diagnose-options">
                  {['5–10', '11–20', '21–30', '31–50'].map(o => (
                    <button
                      key={o}
                      className={`diagnose-option ${answers.units === o ? 'selected' : ''}`}
                      onClick={() => setAns('units', o)}
                    >
                      {o} 세대
                      <span className="mono">→</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="diagnose-q">매주 빌딩 운영에 쓰시는 시간은 어느 정도인가요?</h3>
                <p className="diagnose-q-sub">정산 주간 평균 기준</p>
                <div className="diagnose-options">
                  {['2–4', '5–7', '8–10', '10+'].map(o => (
                    <button
                      key={o}
                      className={`diagnose-option ${answers.hours === o ? 'selected' : ''}`}
                      onClick={() => setAns('hours', o)}
                    >
                      주 {o} 시간
                      <span className="mono">→</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="diagnose-q">현재 운영 형태에 가장 가까운 것은?</h3>
                <p className="diagnose-q-sub">중복 선택 가능</p>
                <div className="diagnose-options">
                  {[
                    '본업 따로, 직접 운영',
                    '관리인 채용 운영',
                    '부모/가족 자산 인계',
                    '회사 자산·법인 운영',
                  ].map(o => (
                    <button
                      key={o}
                      className={`diagnose-option ${answers.type === o ? 'selected' : ''}`}
                      onClick={() => setAns('type', o)}
                      style={{ fontSize: 14 }}
                    >
                      {o}
                      <span className="mono">→</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h3 className="diagnose-q">진단 결과를 받을 연락처를 알려주세요.</h3>
                <p className="diagnose-q-sub">카톡 또는 휴대폰 번호. 영업 전화 없습니다.</p>
                <input
                  className="diagnose-input"
                  placeholder="010-0000-0000 또는 카톡 ID"
                  value={answers.contact}
                  onChange={e => setAnswers(p => ({ ...p, contact: e.target.value }))}
                />
                <button
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                  onClick={() => setStep(totalSteps)}
                  disabled={!answers.contact}
                >
                  진단 결과 확인하기
                  <span className="btn-arrow"></span>
                </button>
              </>
            )}

            {step >= totalSteps && (
              <div className="diagnose-result">
                <div className="eyebrow eyebrow-red" style={{ marginBottom: 20 }}>예상 절감 효과</div>
                <div className="diagnose-result-num">
                  연 {estSaving.toLocaleString()}<span className="unit">만원+</span>
                </div>
                <p className="body" style={{ marginBottom: 24 }}>
                  {answers.units} 세대 · 주 {answers.hours}시간 · {answers.type} 기준,
                  관리인 채용 대비 연 절감액과 시세 인상 효과를 합산한 추정치입니다.
                </p>
                <div style={{ paddingTop: 24, borderTop: '1px solid var(--ink-200)' }}>
                  <div className="mono" style={{ color: 'var(--ink-500)', marginBottom: 12 }}>다음 단계</div>
                  <p className="body-sm">
                    24시간 이내 담당 매니저가 카톡으로 정밀 진단 일정을 잡아드립니다.
                    문의: <strong>010-0000-0000</strong>
                  </p>
                </div>
                <button onClick={reset} className="diagnose-back" style={{ marginTop: 24 }}>
                  ← 처음으로
                </button>
              </div>
            )}

            {step > 0 && step < totalSteps && (
              <div className="diagnose-actions">
                <button onClick={() => setStep(step - 1)} className="diagnose-back">← 이전</button>
                <span className="mono" style={{ color: 'var(--ink-500)' }}>{step + 1} / {totalSteps}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reframe transition (진단 폼 아래로 이동) */}
        <div className="diag-reframe">
          <h3 className="diag-reframe-title">대표님만 그런 게 아니었습니다.</h3>
          <p className="diag-reframe-sub">
            50명의 임대인을 직접 만나 들어봤더니..<br/>
            놀랍게도 모두, <span className="diag-reframe-highlight">같은 고민</span>을 안고 계셨습니다.
          </p>
        </div>

        {/* Persona testimonials with cartoon avatars (가상 — DiceBear 자동 생성) */}
        <div className="diag-testimonials-stack">
          <blockquote className="diag-quote-row">
            <img
              className="diag-quote-avatar"
              src="https://api.dicebear.com/7.x/notionists/svg?seed=MisterParkChairman"
              alt="박OO 대표님"
              loading="lazy"
            />
            <div className="diag-quote-body">
              <p>
                "낮엔 본업에 집중해야 하는데, <strong>임차인 카톡이 끊임없이 옵니다.</strong>
                '보일러가 안 돼요', '도어락 건전지', '인터넷 문제'… 매번 같은 응대인데
                매번 시간이 듭니다. <strong>한 달에 빌딩에 빼앗기는 시간이 30시간이 넘어요.</strong>"
              </p>
              <cite>— <strong>5세대 빌딩 박OO 대표님</strong> · 서울 마포구</cite>
            </div>
          </blockquote>
          <blockquote className="diag-quote-row reverse">
            <div className="diag-quote-body">
              <p>
                "관리인을 두자니 <strong>인건비가 부담</strong>이고, 위탁업체는 저희 같은 작은 빌딩은
                <strong> 안 받아준다고 합니다.</strong> 결국 직접 검침하고 청구서 만들고 세금계산서 발행하고…
                <strong> 어느새 부동산이 본업이 되어 버렸어요.</strong>"
              </p>
              <cite>— <strong>12세대 빌딩 이OO 대표님</strong> · 수도권</cite>
            </div>
            <img
              className="diag-quote-avatar"
              src="https://api.dicebear.com/7.x/notionists/svg?seed=MissLeeChairwoman"
              alt="이OO 대표님"
              loading="lazy"
            />
          </blockquote>
          <blockquote className="diag-quote-row">
            <img
              className="diag-quote-avatar"
              src="https://api.dicebear.com/7.x/notionists/svg?seed=MisterKimPresident"
              alt="김OO 대표님"
              loading="lazy"
            />
            <div className="diag-quote-body">
              <p>
                "문제는 빌딩 운영이 아니라 <strong>'데이터'였습니다.</strong> 임차인이 뭘 요청했는지,
                누가 언제 입주했는지, 시설 보수 이력이 어떻게 되는지…
                <strong> 모두 머릿속에만 있다 보니 의사결정이 느립니다.</strong> 시스템이 절실해요."
              </p>
              <cite>— <strong>25세대 빌딩 김OO 대표님</strong> · 지방 광역시</cite>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="footer-col">
        <div className="nav-logo" style={{ marginBottom: 16 }}>
          <span className="nav-logo-mark"></span>
          <span style={{ color: 'var(--white)' }}>빌딩노트</span>
        </div>
        <p className="body-sm" style={{ color: 'var(--ink-400)', maxWidth: '32ch' }}>
          AI Agent 기반 소규모 빌딩 위탁 자산관리. 같은 임대인이 만들었습니다.
        </p>
      </div>
      <div className="footer-col">
        <h4>서비스</h4>
        <a href="#solution">위탁 자산관리</a>
        <a href="#process">진행 과정</a>
        <a href="#faq">자주 묻는 질문</a>
        <a href="#diagnose">1분 무료 진단</a>
      </div>
      <div className="footer-col">
        <h4>회사</h4>
        <a href="#">소개</a>
        <a href="#">팀</a>
        <a href="#">미디어</a>
        <a href="#">채용</a>
      </div>
      <div className="footer-col">
        <h4>문의</h4>
        <a href="#">010-0000-0000</a>
        <a href="#">contact@buildingnote.kr</a>
        <a href="#">카카오톡 채널</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 BUILDINGNOTE — 사업자등록 000-00-00000</span>
      <span>개인정보처리방침 · 이용약관</span>
    </div>
  </footer>
);

const StickyCTA = () => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`sticky-cta ${show ? 'visible' : ''}`}>
      <div className="sticky-cta-text">
        <span className="sticky-cta-num">월 2~3건 한정</span>
        <span className="sticky-cta-msg">매주 10시간 → 월 30분. 첫 3개월 50% 할인.</span>
      </div>
      <a href="#diagnose" className="btn btn-primary">
        1분 무료 진단
        <span className="btn-arrow"></span>
      </a>
    </div>
  );
};

Object.assign(window, { FinalCTA, Endings, Filter, Guarantee, FAQ, Diagnose, Footer, StickyCTA });
