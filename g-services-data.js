'use strict';
// G groups the existing operations and arrears scope. F remains an archived comparison.
window.SPS_G_SERVICES = Object.freeze({
  management: {
    ...window.SPS_F_SERVICES.management,
    title: '부동산 자산관리',
    english: 'Property management',
    short: '시설·임차인 요청부터 입금 확인·미납 대응까지.<br>맡긴 일의 현재와 남은 일을 함께 확인합니다.',
    approachTitle: '시설과 미납을 함께 살피고,<br>남은 일을 분명하게.',
    steps: [
      ['현재와 맡길 범위를 확인합니다.', '시설 문제, 임차인 요청, 계약·입금 자료를 살펴봅니다. 기존 담당자와의 역할, 필요한 업무와 대응 권한을 먼저 협의합니다.'],
      ['업무별 상태와 근거를 정리합니다.', '시설은 접수·일정 조율·완료를 구분하고, 미납은 계약과 입금을 대조해 확인된 내용과 자료 부족을 구분합니다. 확인 중인 금액을 0원으로 표시하지 않습니다.'],
      ['합의한 대응과 다음 확인을 연결합니다.', '맡기기로 한 시설·요청 업무와 미납 대응을 진행하고, 처리 근거와 남은 확인을 함께 정리하는 방식입니다. 건물주의 비용 승인이나 추가 자료가 필요한 일도 구분합니다.']
    ],
    owner: '보수 범위·비용 승인, 계약·입금 자료의 제공 범위, 연락·대응 권한을 함께 정합니다. 출동·공사·법률 업무의 담당과 비용은 별도로 확인합니다.',
    reportTitle: '시설은 어디까지 처리됐는지,<br>미납은 어디까지 확인됐는지.',
    records: ['F-01', 'R-01'],
    scope: [
      ['시설·임차인 요청', '현장 진단 후 맡길 시설 관리와 임차인 응대 범위를 합의합니다.'],
      ['입금 확인·미납 대응', '계약·입금 자료를 대조하고 미확인 항목을 정리합니다. 이후 맡길 연락·대응 업무와 권한을 합의하며, 범위에 따라 요금이 달라집니다.'],
      ['임대·공실 업무', '공실 현황과 임대 진행에 관한 업무가 필요하면 별도 서비스의 범위로 함께 협의합니다.'],
      ['별도 확인', '출동·공사비, 긴급 대응 조건, 중개·법률 업무의 담당과 비용은 별도로 확인합니다. 채권 회수 결과를 보장하지 않습니다.']
    ],
    preparation: ['건물 현황과 미완료 시설·임차인 요청', '관련 계약 조건과 확인 가능한 입금 자료', '기존 담당자의 업무와 맡기고 싶은 대응 범위'],
    extraFaqs: [[window.SPS_F_SERVICES.arrears.question, window.SPS_F_SERVICES.arrears.answer]]
  },
  leasing: {
    ...window.SPS_F_SERVICES.leasing,
    title: '임대 운영관리',
    short: '임차 현황부터 공실·임대 진행까지.<br>필요한 업무와 다음 확인을 연결합니다.'
  }
});

// Keep bookmarked G arrears links working within the consolidated service.
window.spsGServiceKey = requested => requested === 'arrears' ? 'management' : Object.hasOwn(window.SPS_G_SERVICES, requested) ? requested : 'management';
