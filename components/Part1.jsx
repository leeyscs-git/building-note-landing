// Part 1: Empathy + Pain Points + AS-IS/TO-BE + Story

const Empathy = () => (
  <section className="section section--bone" id="problem">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-head-num">S.02 — 공감</div>
        </div>
        <h2 className="h2 section-head-title">
          혹시 이번 달 정산 주간에도,<br />
          본업이 멈췄던 그 한 주가<br />
          또 시작되셨나요?
        </h2>
      </div>

      <div className="pain-grid">
        <div className="pain-item">
          <span className="pain-item-num">01</span>
          <p className="pain-item-text">
            검침지 사진을 카톡으로 받아 엑셀에 다시 옮겨 적고, 관리비 계산해서 청구하고,
            입금 통장 확인하고, 홈택스에서 세금계산서를 호별로 발급합니다.
            <strong style={{ color: 'var(--red-700)', fontWeight: 500 }}> 이 일주일은 본업이 멈춥니다.</strong>
          </p>
        </div>
        <div className="pain-item">
          <span className="pain-item-num">02</span>
          <p className="pain-item-text">
            회의 중에 임차인 카톡이 울립니다. "보일러가 안 돼요", "도어락 건전지", "인터넷이 끊겼어요"…
            <strong style={{ color: 'var(--red-700)', fontWeight: 500 }}> 끊고 나가야 할지 무시해야 할지 매번 갈등합니다.</strong>
          </p>
        </div>
        <div className="pain-item">
          <span className="pain-item-num">03</span>
          <p className="pain-item-text">
            신규 입주나 퇴실이 한 호실 생기면 그것만으로 3~5시간이 또 추가됩니다.
            계약서, 검침지 이양, 세금계산서, 시설 점검까지.
          </p>
        </div>
        <div className="pain-item">
          <span className="pain-item-num">04</span>
          <p className="pain-item-text">
            1년에 두 번, 종합소득세 신고와 분기 미납 정리 시점이 오면
            <strong style={{ color: 'var(--red-700)', fontWeight: 500 }}> 1~2주를 또 데이터 정리에 씁니다.</strong>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 96, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, paddingTop: 40, borderTop: '1px solid var(--ink-900)' }}>
        <div className="eyebrow">실패 경험</div>
        <div>
          <p className="lede" style={{ color: 'var(--ink-800)', marginBottom: 32 }}>
            자체 엑셀 양식도 만들어 보셨죠. 일반 ERP도 깔아 보셨고요.
            그런데 두 달 못 가서 다시 손으로 돌아오셨을 겁니다.
            <strong style={{ color: 'var(--ink-1000)' }}> 우리 빌딩 현실에 맞는 시스템이 아니었으니까요.</strong>
          </p>
          <p className="body">
            관리인 채용도 알아보셨지만, 월 350만원에 4대보험·휴가·병가 리스크까지 생각하면
            이 규모엔 부담이었을 겁니다.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Compare = () => (
  <section className="section section--paper" id="solution">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-head-num">S.03 — 진짜 문제</div>
        </div>
        <h2 className="h2 section-head-title">
          진짜 문제는 "운영을 못하는 것"이 아닙니다.<br />
          소규모 빌딩에 맞는<br />
          <span style={{ color: 'var(--red-700)' }}>운영 인프라가 시장에 없는 것</span>이 문제입니다.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 80 }}>
        <div style={{ padding: 40, border: '1px solid var(--ink-200)', background: 'var(--white)' }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>기존 PM사</div>
          <p className="body" style={{ fontSize: 17, color: 'var(--ink-800)' }}>
            1인이 3~5개 빌딩만 맡습니다. 인건비 구조상 소규모 빌딩은 단가가 안 나와
            거절당하거나, 받아도 '관리사 시각'에서 비용을 줄이고 임대인 시간을 더 빼앗습니다.
          </p>
        </div>
        <div style={{ padding: 40, border: '1px solid var(--ink-200)', background: 'var(--white)' }}>
          <div className="eyebrow" style={{ marginBottom: 20 }}>일반 ERP</div>
          <p className="body" style={{ fontSize: 17, color: 'var(--ink-800)' }}>
            모든 산업의 평균에 맞춰져 있어, 우리 빌딩의 검침·세금계산서·임차인 응대 디테일을
            담지 못합니다. 두 달이면 다시 엑셀로 돌아갑니다.
          </p>
        </div>
      </div>

      <div className="compare">
        <div className="compare-col">
          <span className="compare-tag">AS-IS · 현재</span>
          <h3 className="h3" style={{ marginBottom: 24, color: 'var(--ink-1000)' }}>
            본업이 따로 있는데도<br />
            매월 정산 주간엔 본업을 멈추고,
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, color: 'var(--ink-700)' }}>
            <li>— 임차인 카톡은 24시간 울리며</li>
            <li>— 관리인 채용은 부담스럽고</li>
            <li>— 시스템은 현실에 안 맞고</li>
            <li>— "직접 다 하면서도 전문적이지 않은" 상태</li>
          </ul>
        </div>
        <div className="compare-arrow">→</div>
        <div className="compare-col compare-col--to">
          <span className="compare-tag">TO-BE · 미래</span>
          <h3 className="h3" style={{ marginBottom: 24, color: 'var(--white)' }}>
            월 30분 리포트만 받고<br />
            본업·가족에 집중하며,
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, color: 'var(--ink-300)' }}>
            <li>— 임차인 응대는 AI가 24시간 처리</li>
            <li>— 휴먼에러로 인한 분쟁 0건</li>
            <li>— 시세 인상 타이밍 자동 알림</li>
            <li>— 빌딩 가치 데이터 기반 연 5~10% 성장</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const Story = () => (
  <section className="section section--white">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-head-num">S.04 — 변화 내러티브</div>
        </div>
        <h2 className="h2 section-head-title">
          첫 고객은<br />
          저희 어머니였습니다.
        </h2>
      </div>

      <div className="story-grid">
        <div>
          <div style={{
            aspectRatio: '3/4',
            background: 'var(--bone)',
            position: 'sticky',
            top: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 32,
            border: '1px solid var(--ink-200)'
          }}>
            <div>
              <div className="mono" style={{ color: 'var(--ink-500)' }}>FIG. 02 / 첫 고객</div>
              <div className="mono" style={{ color: 'var(--ink-500)' }}>30년차 임대인 · 70대</div>
            </div>
            <div style={{
              fontSize: 'clamp(40px, 4vw, 64px)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--red-700)'
            }}>
              30년 만에<br/>되찾은<br/>일주일.
            </div>
            <div className="mono" style={{ color: 'var(--ink-500)', textAlign: 'right' }}>
              운영자 어머니 사례
            </div>
          </div>
        </div>

        <div>
          <div className="story-step">
            <span className="story-step-tag">BEFORE</span>
            <div>
              <h3 className="story-step-title">매월 정산 주간이 되면 일주일이 사라졌습니다.</h3>
              <p className="story-step-body">
                저희 어머니는 30년 넘게 빌딩을 직접 운영하셨습니다.
                작은 노트에 검침을 적고, 계산기 두드리고, 통장 정리하고,
                홈택스를 호실별로 한 건씩 켜고 끄셨습니다.
                회사 다니던 저는 어머니의 부담을 옆에서만 지켜보았습니다.
              </p>
            </div>
          </div>

          <div className="story-step">
            <span className="story-step-tag">TURNING POINT</span>
            <div>
              <h3 className="story-step-title">"내가 너무 늙어서 그래"</h3>
              <p className="story-step-body">
                어느 날 검침 오기 한 번으로 임차인과 다툼이 생겼고,
                어머니는 그렇게 자책하셨습니다.
                그때 깨달았습니다 — 이건 어머니의 문제가 아니라
                <strong style={{ color: 'var(--ink-1000)' }}> 시스템의 문제</strong>라고.
                그래서 직접 만들기로 했습니다.
              </p>
            </div>
          </div>

          <div className="story-step">
            <span className="story-step-tag">AFTER</span>
            <div>
              <h3 className="story-step-title">매월 30분 리포트만 보십니다.</h3>
              <p className="story-step-body">
                검침지 노트는 서랍 깊숙이 들어갔고, 임차인 카톡은 AI가 24시간 응대합니다.
                종합소득세 신고는 데이터 패키지 한 번에 끝납니다.
                어머니가 비로소 '쉬어도 되는 임대인'이 되셨습니다.
              </p>
            </div>
          </div>

          <div className="story-step" style={{ borderBottom: '1px solid var(--ink-900)' }}>
            <span className="story-step-tag">PROMISE</span>
            <div>
              <h3 className="story-step-title" style={{ color: 'var(--red-700)' }}>
                같은 임대인이<br/>만든 서비스입니다.
              </h3>
              <p className="story-step-body">
                어머니에게 드린 그 30분의 평온을, 이제 같은 고민을 가진
                임대인 동료들께 드립니다. 관리사가 아니라, 같은 임대인이 만든 서비스입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { Empathy, Compare, Story });
