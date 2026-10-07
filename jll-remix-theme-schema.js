/* Shared editor contract. Original defaults remain available for reset. */
(function(root, factory) {
  const schema = factory();
  if (typeof module === 'object' && module.exports) module.exports = schema;
  else root.SPSThemeSchema = schema;
})(typeof window === 'undefined' ? this : window, function() {
  const color = (token, label, value, section = 'colors') => ({token, label, value, section, type:'color'});
  const size = (token, label, value, min, max, section, step = 1) => ({token, label, value, min, max, section, step, type:'number', unit:'px'});
  const font = (token, label, value, min, max, group) => ({...size(token,label,value,min,max,'type'),group});
  return [
    color('--ink','제목·본문 / Ink','#10252b'), color('--red','강조·초점 / Red','#d5092b'),
    color('--rose-soft','문의 버튼 배경','#ffd7de'), color('--rose-hover','문의 버튼 호버','#f9c6cb'),
    color('--surface','기본 바탕','#ffffff'), color('--peach','자산관리 설명 배경','#f4ebe4'),
    color('--surface-sage','공간 설명 배경','#eaf0ed'), color('--surface-blue','기술 설명 배경','#e9eff2'),
    color('--surface-cool','선택·참고 영역','#edf1f2'), color('--muted','보조 설명','#5c686c'),
    color('--line','구분선','#dce1e2'), color('--red-section','하단 문의 영역','#d2082b'),
    size('--logo-width','로고 너비 · 데스크톱',120,80,180,'brand'),
    size('--logo-width-mobile','로고 너비 · 모바일',105,70,120,'brand'),
    font('--nav-font-size','헤더 메뉴 · PC',13,11,20,'header'),
    font('--nav-font-mobile','펼침 메뉴 · 모바일',23,18,32,'header'),
    font('--contact-font-size','문의 버튼',13,12,16,'header'),
    font('--locale-font-size','국가·언어 선택',12,10,16,'header'),
    font('--hero-title-size','히어로 제목 · 데스크톱',59,36,76,'content'),
    font('--hero-title-mobile','히어로 제목 · 모바일',39,28,48,'content'),
    font('--section-title-size','서비스 제목 · 데스크톱',43,28,56,'content'),
    font('--section-title-mobile','서비스 제목 · 모바일',35,24,44,'content'),
    font('--card-title-size','카드 제목',24,18,30,'content'),
    font('--body-size','기본 본문',16,14,20,'content'),
    font('--story-font-size','스토리 항목',12,11,16,'components'),
    font('--field-font-size','선택 입력',14,13,18,'components'),
    font('--faq-font-size','FAQ 질문',14,13,18,'components'),
    size('--content-max','본문 최대 너비',1320,1000,1560,'layout',10),
    size('--page-gutter','좌우 여백 · 데스크톱',72,32,100,'layout',2),
    size('--page-gutter-mobile','좌우 여백 · 모바일',20,16,32,'layout',2),
    size('--card-gap','카드 사이 간격',28,16,48,'layout',2),
    size('--radius-control','버튼·입력 모서리',3,0,24,'surfaces'),
    size('--radius-panel','패널·대화상자 모서리',4,0,28,'surfaces'),
    {...size('--reveal-duration','스크롤 등장 시간',800,200,1600,'expression',50),unit:'ms'},
    size('--reveal-distance','스크롤 등장 거리',28,0,60,'expression',2),
    size('--contact-height','문의 버튼 최소 높이',44,44,64,'buttons',2),
    size('--contact-padding','문의 버튼 좌우 여백',19,10,30,'buttons'),
    size('--contact-gap','문의 버튼 문구·화살표 간격',24,8,36,'buttons',2),
    size('--button-height','주요 버튼 최소 높이',49,44,68,'buttons'),
    size('--header-height','헤더 상단 · 데스크톱',87,72,110,'navigation'),
    size('--header-height-mobile','헤더 상단 · 모바일',75,68,90,'navigation'),
    size('--header-top-space','로고 위 추가 여백',16,0,40,'navigation',2),
    size('--chevron-size','아래 꺾쇠 크기',14,12,22,'icons'),
    size('--chevron-stroke','아래 꺾쇠 선 두께',1.6,1,2.4,'icons',0.2),
    color('--chevron-color','아래 꺾쇠 색상','#5c686c','icons'),
    size('--story-padding','스토리 항목 안쪽 여백',12,8,22,'stories'),
    color('--story-active-bg','선택한 스토리 배경','#edf1f2','stories'),
    size('--editorial-padding','서비스 설명 세로 여백',64,36,88,'editorial',2),
    size('--insight-image-height','카드 사진 높이 · 데스크톱',232,160,300,'cards',4),
    size('--insight-image-mobile','카드 사진 높이 · 모바일',235,180,300,'cards',5),
    size('--field-height','선택 입력 최소 높이',50,44,68,'fields',2),
    size('--faq-height','FAQ 질문 최소 높이',75,60,96,'disclosure'),
    size('--dialog-width','대화상자 최대 너비',640,480,800,'dialogs',10),
    size('--dialog-padding','대화상자 안쪽 여백 · 데스크톱',52,28,64,'dialogs',2)
  ];
});
