# V4 비전 파티클 보관본

2026-10-08 요청에 따라 스크롤로 입자가 모이는 버전을 보관하고, 현재 V4는 기존 문구 상승 효과로 복원했습니다. 이 폴더의 파일은 현재 페이지에서 불러오지 않습니다.

- `jll-remix-vision-particles.js`: 사방에서 모이는 미세 입자, 스크롤 진행률·역방향 재생, 폰트 전환, 접근성 및 실패 시 대체 동작.
- `jll-remix-main-v4.html`: 초기 텍스트 숨김과 5초 복구 장치, `data-particle-slogan`, 스크립트 로드 순서를 포함한 당시 마크업.
- `jll-remix-main-v4.css`: 파티클 전용 스타일과 0.9 화면 높이의 추가 스크롤 구간을 포함한 당시 스타일.
- `jll-remix-hanwha.js`: `visionTimeline`, `particleTravel` 측정 및 키워드·영상 타이밍 연결을 포함한 당시 공통 엔진.
- `scripts/vision-particles.test.cjs`: 당시 파티클 테스트. 파티클 관련 코드는 이 보관본을 사용하며, 인사이트·V2·한화 페이지 확인은 현재 프로젝트 파일을 참조하도록 경로만 조정했습니다.

프로젝트 루트에서 검증:

```powershell
node --test design/jll-remix/archive/vision-particles-2026-10-08/scripts/vision-particles.test.cjs
```

다시 적용할 때는 현재 페이지 전체를 옛 파일로 덮어쓰지 말고 파티클 컨트롤러, HTML 초기화·속성·스크립트, CSS 전용 블록, 공통 엔진의 타이밍 보정 부분만 가져옵니다. 현재 내비게이션·팔레트·콘텐츠 수정은 유지해야 합니다. HTML/CSS 전체본은 비교용 스냅샷이며 독립 실행 페이지가 아닙니다.
