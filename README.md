# 빌딩노트 랜딩페이지

AI Agent 기반 소규모 빌딩 위탁 자산관리 서비스 — JLL 카테고리 컨벤션을 참고한 오리지널 디자인 시스템(Brick Red)으로 구성된 13섹션 롱폼 랜딩페이지입니다.

## 구조
- `index.html` — 엔트리 (React 18 + Babel CDN, type="text/babel")
- `styles.css` — 디자인 토큰 + 컴포넌트 스타일
- `components/` — HeroNav / Part1 / Part2 / Part3 / Tweaks
- `tweaks-panel.jsx` — 우측 하단 Tweaks 패널 (red tone, density 등)

## 로컬 실행
정적 서버로 띄워주세요(파일 프로토콜에서는 fetch 차단됨):

```bash
npx serve .
# or
python -m http.server 8000
```

## 배포
Vercel 정적 배포. `vercel.json`에서 `.jsx`를 `text/babel` MIME으로 서빙합니다.
