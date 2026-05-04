// Part 2: Process + Stats + Testimonials + Chat sim + ROI + Authority + Benefits + Bonus

const Process = () => (
  <section className="section section--paper" id="process">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.05 — 솔루션</div></div>
        <h2 className="h2 section-head-title">
          한 달이면 정산 주간이<br />
          사라집니다.
        </h2>
      </div>

      <div className="process">
        <div className="process-step">
          <div className="process-num">STEP 01</div>
          <div className="process-title">무료 진단</div>
          <p className="process-body">
            우리 빌딩 운영 데이터·임차인·계약서 구조 파악.
            관리인 채용 대비 절감액과 도입 적합도 분석.
          </p>
          <span className="process-time">소요 1일</span>
        </div>
        <div className="process-step">
          <div className="process-num">STEP 02</div>
          <div className="process-title">셋업</div>
          <p className="process-body">
            임차인 마이그레이션, 세금계산서 시스템 연동, AI Agent 학습.
            임대인 개입 없이 저희가 진행합니다.
          </p>
          <span className="process-time">소요 1~2주</span>
        </div>
        <div className="process-step">
          <div className="process-num">STEP 03</div>
          <div className="process-title">위탁 운영</div>
          <p className="process-body">
            검침·청구·미납 추적·임차인 응대·세금계산서 자동.
            첫 정산 주간이 30분으로 줄어듭니다.
          </p>
          <span className="process-time">진행 상시</span>
        </div>
        <div className="process-step">
          <div className="process-num">STEP 04</div>
          <div className="process-title">월간 리포트</div>
          <p className="process-body">
            매월 30분 리포트 + 분기 자산가치 리포트로 결과 확인.
            시세 인상 타이밍 자동 알림.
          </p>
          <span className="process-time">월 1회 / 분기 1회</span>
        </div>
      </div>

      <div style={{
        marginTop: 80,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 32
      }}>
        {[
          { wk: '1주 차', body: '임차인 카톡이 AI로 옮겨가 본업 회의가 끊기지 않습니다.' },
          { wk: '1개월 차', body: '첫 정산 주간이 사라집니다. 일주일이 통째로 돌아옵니다.' },
          { wk: '3개월 차', body: '휴먼에러로 인한 임차인 분쟁이 0건이 됩니다.' },
          { wk: '6개월 차', body: '시세 인상 타이밍을 데이터로 받고, 연 5~10% 추가 수익이 발생합니다.' },
        ].map((m, i) => (
          <div key={i}>
            <div className="mono" style={{ color: 'var(--red-700)', marginBottom: 12 }}>{m.wk}</div>
            <p className="body-sm" style={{ color: 'var(--ink-800)', fontSize: 15 }}>{m.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ChatSim = () => {
  const [step, setStep] = React.useState(0);
  const messages = [
    { from: 'tenant', text: '301호 보일러가 안 돼요. 너무 추워요 ㅠㅠ', t: '14:22' },
    { from: 'ai', text: '안녕하세요 301호님. 즉시 출장 기사 배정해드리겠습니다. 잠시만요.', t: '14:22' },
    { from: 'ai', text: '✅ 출장 기사 14:30 도착 예정입니다. 보일러 모델 확인했고 부품 가져갑니다.', t: '14:23' },
    { from: 'ai', text: '오늘 안에 해결되지 않으면 전기난로 임시 지원해드릴게요. 결과 보고 드리겠습니다.', t: '14:23' },
    { from: 'tenant', text: '와 진짜 빠르네요! 감사합니다 🙏', t: '14:24' },
  ];

  React.useEffect(() => {
    const id = setInterval(() => {
      setStep(s => (s >= messages.length ? 0 : s + 1));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section section--white">
      <div className="container">
        <div className="section-head">
          <div><div className="section-head-num">S.05.1 — 실제 작동</div></div>
          <h2 className="h2 section-head-title">
            본업 회의 중,<br />
            보일러 민원이 와도<br />
            끊고 나가지 않습니다.
          </h2>
        </div>

        <div className="chat-sim">
          <div className="chat-window">
            <div className="chat-header">
              빌딩노트 운영팀 · 301호 임차인
            </div>
            <div className="chat-msgs">
              {messages.slice(0, step).map((m, i) => (
                <React.Fragment key={i}>
                  <div className={`chat-msg ${m.from}`}>{m.text}</div>
                  <div className="chat-msg-time" style={{ alignSelf: m.from === 'ai' ? 'flex-end' : 'flex-start' }}>{m.t}</div>
                </React.Fragment>
              ))}
              {step < messages.length && step > 0 && (
                <div className={`chat-msg typing ${messages[step]?.from || 'ai'}`}>
                  <span></span><span></span><span></span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="eyebrow eyebrow-red" style={{ marginBottom: 24 }}>FIG. 03 / AI AGENT 응대 시뮬레이션</div>
            <h3 className="h2" style={{ marginBottom: 24, fontSize: 'clamp(28px, 3vw, 40px)' }}>
              임대인 개입 0회.<br/>
              해결 완료 8분.
            </h3>
            <p className="body" style={{ fontSize: 17, marginBottom: 32 }}>
              AI Agent는 임차인에게 'AI'라고 밝히지 않고 임대인 측 매니저로 응대합니다.
              복잡한 사안은 즉시 사람 매니저로 전환되며, 임대인은 결과 보고만 받습니다.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 32, borderTop: '1px solid var(--ink-200)' }}>
              <div>
                <div className="mono" style={{ color: 'var(--ink-500)', marginBottom: 8 }}>이전</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>회의 5분 중단</div>
              </div>
              <div>
                <div className="mono" style={{ color: 'var(--red-700)', marginBottom: 8 }}>지금</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--red-700)' }}>회의 0분 중단</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsBlock = () => (
  <section className="section section--dark" id="proof">
    <div className="container">
      <div className="section-head section-head--dark">
        <div><div className="section-head-num" style={{ color: 'var(--ink-400)' }}>S.06 — 숫자로 보는 성과</div></div>
        <h2 className="h2 section-head-title" style={{ color: 'var(--white)' }}>
          소규모 빌딩 30세대 기준,<br />
          연간 환산 수치입니다.
        </h2>
      </div>

      <div className="stats-panel">
        <div className="stat-cell">
          <div className="stat-cell-num">30분<span className="unit">/월</span></div>
          <div className="stat-cell-label">
            기존 30~40시간이 30분으로.
            <br/><span className="accent" style={{ color: 'var(--red-500)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>—95%</span>
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-num">3,000<span className="unit">만+</span></div>
          <div className="stat-cell-label">
            관리인 채용 대비 연 절감액.
            <br/><span style={{ color: 'var(--red-500)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>4대보험 + 휴가 리스크 0</span>
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-num">1,500<span className="unit">만+</span></div>
          <div className="stat-cell-label">
            적기 시세 인상으로 연 추가 수익.
            <br/><span style={{ color: 'var(--red-500)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>30세대 기준</span>
          </div>
        </div>
        <div className="stat-cell">
          <div className="stat-cell-num">0<span className="unit">건</span></div>
          <div className="stat-cell-label">
            휴먼에러로 인한 정정 건수.
            <br/><span style={{ color: 'var(--red-500)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>임차인 분쟁 0</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 80, display: 'flex', gap: 80, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="mono" style={{ color: 'var(--red-500)', marginBottom: 16 }}>RUNTIME CAPACITY</div>
          <p className="body" style={{ color: 'var(--ink-300)', fontSize: 17 }}>
            AI Agent 1대 = 임대인 1,000세대·20개 고객사 운영 가능 체급.
            <br/>일반 PM사(1인 3~5개)가 따라올 수 없는 비용 구조.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="mono" style={{ color: 'var(--red-500)', marginBottom: 16 }}>METHODOLOGY</div>
          <p className="body" style={{ color: 'var(--ink-300)', fontSize: 17 }}>
            초기 베타 운영 사례 + 가족 운영 빌딩 데이터 기준.
            정식 도입 후 연간 누적 데이터로 보강 예정.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="section section--paper" id="testimonials">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.06.1 — 고객 후기</div></div>
        <h2 className="h2 section-head-title">
          가장 까다로운 검수자가<br />
          가장 가까이에 있었습니다.
        </h2>
      </div>

      <div className="testimonials">
        <div className="testimonial">
          <div className="testimonial-quote">
            검침지 노트를 들고 다니던 30년이 한 달 만에 끝났습니다.
            매월 정산 주간에 사라지던 일주일이 다시 제 시간이 되었어요.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-avatar">M.K</div>
            <div>
              <div className="testimonial-name">운영자의 어머니</div>
              <div className="testimonial-role">70대, 30년 차 임대인 · 8세대</div>
            </div>
          </div>
        </div>
        <div className="testimonial">
          <div className="testimonial-quote">
            회의 중에 보일러 민원이 와도 끊고 나가지 않게 됐습니다.
            본업 매출이 회복됐어요.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-avatar">J.L</div>
            <div>
              <div className="testimonial-name">회사 임원 임대인</div>
              <div className="testimonial-role">40대, 12세대 보유 · 베타 고객</div>
            </div>
          </div>
        </div>
        <div className="testimonial">
          <div className="testimonial-quote">
            엑셀이 머릿속에 있던 어머니에게서 인계받느라 막막했는데, 셋업 2주 만에 데이터가 정리됐습니다.
            이제 자녀에게도 인계할 수 있어요.
          </div>
          <div className="testimonial-author">
            <div className="testimonial-avatar">S.H</div>
            <div>
              <div className="testimonial-name">상속 자산 운영자</div>
              <div className="testimonial-role">30대, 부모 빌딩 인수 · 22세대</div>
            </div>
          </div>
        </div>
      </div>

      <p className="mono" style={{ color: 'var(--ink-500)', marginTop: 32, textAlign: 'center' }}>
        * 초기 베타 운영 사례 — 추가 후기는 인터뷰 진행 후 보강 예정
      </p>
    </div>
  </section>
);

const ROI = () => {
  const [units, setUnits] = React.useState(20);
  const [hours, setHours] = React.useState(8);

  // calculations
  const annualHourSaving = Math.round(hours * 4 * 12 * 0.95);
  const annualMoneySaving = Math.round(units * 50 + 3000); // 만원 단위
  const totalSaving = annualMoneySaving;

  return (
    <section className="section section--paper">
      <div className="container">
        <div className="section-head">
          <div><div className="section-head-num">S.06.2 — ROI 시뮬레이션</div></div>
          <h2 className="h2 section-head-title">
            우리 빌딩 기준,<br/>
            절감액을 직접 확인해보세요.
          </h2>
        </div>

        <div className="roi">
          <div>
            <div className="mono" style={{ color: 'var(--red-500)', marginBottom: 32 }}>INPUT</div>

            <div className="roi-input-row">
              <span className="roi-input-label">보유 세대수</span>
              <input
                type="range"
                className="roi-slider"
                min="5" max="50" value={units}
                onChange={e => setUnits(+e.target.value)}
              />
              <span className="roi-input-value">{units} 세대</span>
            </div>

            <div className="roi-input-row">
              <span className="roi-input-label">매주 빌딩에 쓰는 시간</span>
              <input
                type="range"
                className="roi-slider"
                min="2" max="20" value={hours}
                onChange={e => setHours(+e.target.value)}
              />
              <span className="roi-input-value">{hours} 시간</span>
            </div>
          </div>

          <div>
            <div className="mono roi-result-label">예상 연간 절감 효과</div>
            <div className="roi-result-num">
              {totalSaving.toLocaleString()}<span className="unit">만원+</span>
            </div>

            <div className="roi-breakdown">
              <div className="roi-breakdown-row">
                <span>관리인 채용 대비 절감</span>
                <span className="v">3,000만원</span>
              </div>
              <div className="roi-breakdown-row">
                <span>적기 시세 인상 추가 수익</span>
                <span className="v">{(units * 50).toLocaleString()}만원</span>
              </div>
              <div className="roi-breakdown-row">
                <span>본업 회복 시간</span>
                <span className="v">연 {annualHourSaving}h+</span>
              </div>
              <div className="roi-breakdown-row">
                <span>휴먼에러 정정 비용</span>
                <span className="v">0원</span>
              </div>
            </div>

            <p className="mono" style={{ color: 'var(--ink-500)', marginTop: 24, fontSize: 11 }}>
              * 30세대 기준 평균치. 실제 결과는 빌딩 구조에 따라 달라집니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Authority = () => (
  <section className="section section--white">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.07 — 권위</div></div>
        <h2 className="h2 section-head-title">
          관리사가 만든 게 아니라,<br/>
          지금도 직접 운영하는<br/>
          임대인이 만들었습니다.
        </h2>
      </div>

      <div className="authority">
        <div className="authority-cell">
          <div className="authority-num">2세대</div>
          <div className="authority-label">건물주 자녀로 자라며 축적한<br/>운영 노하우</div>
        </div>
        <div className="authority-cell">
          <div className="authority-num">5+ 동</div>
          <div className="authority-label">상가건물·오피스텔·임대주택<br/>직접 운영 자산</div>
        </div>
        <div className="authority-cell">
          <div className="authority-num">국내 최초</div>
          <div className="authority-label">AI Agent 통합<br/>임대 자산관리 사례</div>
        </div>
        <div className="authority-cell">
          <div className="authority-num">어머니 ✓</div>
          <div className="authority-label">첫 고객.<br/>가장 까다로운 검수자.</div>
        </div>
      </div>

      <div style={{
        marginTop: 80,
        padding: 56,
        background: 'var(--bone)',
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 48,
        alignItems: 'center'
      }}>
        <div className="mono" style={{ color: 'var(--red-700)' }}>연동 시스템</div>
        <div style={{
          display: 'flex',
          gap: 32,
          flexWrap: 'wrap',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--ink-700)',
          letterSpacing: '0.05em'
        }}>
          <span>홈택스</span>
          <span style={{ color: 'var(--ink-300)' }}>/</span>
          <span>카카오톡 비즈니스</span>
          <span style={{ color: 'var(--ink-300)' }}>/</span>
          <span>주요 통신사</span>
          <span style={{ color: 'var(--ink-300)' }}>/</span>
          <span>시설관리 협력사 네트워크</span>
        </div>
      </div>
    </div>
  </section>
);

const Usability = () => (
  <section className="section section--bone">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.08 — 사용성</div></div>
        <h2 className="h2 section-head-title">
          엑셀도 어려우셨죠?<br/>
          괜찮습니다.<br/>
          <span style={{ color: 'var(--red-700)' }}>위탁이니까요.</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid var(--ink-900)' }}>
        {[
          { num: '01', t: '계약', body: '서면으로 1회. 임대인이 채워야 할 양식은 임차인 연락처와 검침지 노트뿐입니다.' },
          { num: '02', t: '셋업', body: '저희가 진행합니다. 임대인 개입 0회. 임차인 마이그레이션·홈택스 연동·AI 학습.' },
          { num: '03', t: '한 달 후', body: '첫 리포트 수령. 30분이면 한 달 운영이 끝납니다.' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: 48,
            borderRight: i < 2 ? 'var(--hair)' : 'none',
            background: 'var(--white)',
            borderBottom: '1px solid var(--ink-900)'
          }}>
            <div className="mono" style={{ color: 'var(--red-700)', marginBottom: 64 }}>STEP {s.num}</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 16 }}>{s.t}</div>
            <p className="body" style={{ color: 'var(--ink-700)' }}>{s.body}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 80,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'start'
      }}>
        <div>
          <div className="eyebrow eyebrow-red" style={{ marginBottom: 16 }}>지원 시스템</div>
          <h3 className="h3" style={{ marginBottom: 16 }}>임대인 전담 매니저 1:1 배정.</h3>
          <p className="body">
            카톡으로 연락하시면 평일 1시간 이내 응답. 임차인 응대는 AI Agent가 24시간 처리하고,
            임대인 응대는 사람이 직접 합니다.
          </p>
        </div>
        <div>
          <div className="eyebrow eyebrow-red" style={{ marginBottom: 16 }}>초보자 가능 이유</div>
          <h3 className="h3" style={{ marginBottom: 16 }}>70대 어머니가 첫 고객이셨습니다.</h3>
          <p className="body">
            컴퓨터를 못 다루셔도, 엑셀을 모르셔도, 카톡만 되시면 됩니다.
            어머니가 쓸 수 있게 만든 서비스이기 때문입니다.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Benefits = () => (
  <section className="section section--white">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num">S.09 — 혜택 종합</div></div>
        <h2 className="h2 section-head-title">
          관리인 1명 채용 효과를<br/>
          60~70% 비용으로,<br/>
          더 디테일하게.
        </h2>
      </div>

      <div className="benefits">
        {[
          { n: '01', t: '24시간 임차인 응대 AI Agent', s: '관리인 대비 -3,000만/년' },
          { n: '02', t: '자동 검침·청구·세금계산서 발급', s: '월 -30시간' },
          { n: '03', t: '미납 자동 추적 + 법적 절차 가이드', s: '미납 0' },
          { n: '04', t: '매월 운영 리포트 + 분기 자산가치 리포트', s: '월 30분' },
          { n: '05', t: '임대료 시세 인상 타이밍 자동 알림', s: '+1,000~2,000만/년' },
          { n: '06', t: '종합소득세 신고 데이터 패키지 (세무사용)', s: '신고 시간 -90%' },
          { n: '07', t: '임대인 전담 매니저 1:1 배정', s: '평일 1h 이내 응답' },
          { n: '08', t: '시설 출장기사·세무사 협력사 네트워크', s: '단가 -20~30%' },
        ].map((b, i) => (
          <div key={i} className="benefit">
            <span className="benefit-num">{b.n}</span>
            <span className="benefit-title">{b.t}</span>
            <span className="benefit-saving">{b.s}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Bonus = () => (
  <section className="section section--red">
    <div className="container">
      <div className="section-head">
        <div><div className="section-head-num" style={{ color: 'rgba(255,255,255,0.7)' }}>S.09.1 — 초기 도입 한정</div></div>
        <h2 className="h2 section-head-title" style={{ color: 'var(--white)' }}>
          월 2~3건 한정.<br/>
          첫 3개월 위탁료 50% 할인 +<br/>
          셋업비 무료.
        </h2>
      </div>

      <div className="bonus-list">
        <div className="bonus-item">
          <span className="bonus-tag">B.01</span>
          <div>
            <div className="bonus-title">임차인 전수 마이그레이션</div>
            <div className="bonus-value"><s>200만원</s>무료</div>
          </div>
        </div>
        <div className="bonus-item">
          <span className="bonus-tag">B.02</span>
          <div>
            <div className="bonus-title">세금계산서·홈택스 시스템 연동</div>
            <div className="bonus-value"><s>150만원</s>무료</div>
          </div>
        </div>
        <div className="bonus-item">
          <span className="bonus-tag">B.03</span>
          <div>
            <div className="bonus-title">첫 분기 자산가치 리포트</div>
            <div className="bonus-value"><s>50만원</s>무료</div>
          </div>
        </div>
        <div className="bonus-item">
          <span className="bonus-tag">B.04</span>
          <div>
            <div className="bonus-title">1:1 운영 컨설팅 1회</div>
            <div className="bonus-value"><s>30만원</s>무료</div>
          </div>
        </div>
      </div>

      <p className="mono" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 32, textAlign: 'right', letterSpacing: '0.1em' }}>
        AI Agent 학습 데이터 확보 완료 시점부터 신규 가입 셋업비·가격 변동 예정
      </p>
    </div>
  </section>
);

Object.assign(window, { Process, ChatSim, StatsBlock, Testimonials, ROI, Authority, Usability, Benefits, Bonus });
