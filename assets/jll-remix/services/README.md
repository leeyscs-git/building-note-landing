# SPS 서비스 픽토그램 · 생성 이미지 보관본

2026-10-07 사용자 선택에 따라 V1 메뉴는 기존 선형 SVG로 복원했고, V4는 제공된 참고 이미지의 선과 색면을 적용한 SVG로 작성했다. 현재 두 안은 jll-remix-components.js의 공통 픽토그램을 사용하며 compare.html?view=hh4에서 비교한다. 아래 PNG와 프롬프트는 이전 생성 결과를 보존한 기록이다.

생성일: 2026-10-07. 내장 image_gen 도구를 사용해 투명 배경 PNG 세 개를 생성했다. 기존 SVG는 V2·V3 비교용으로 보존한다.

- [부동산 자산관리](property-management-v1.png): 상업용 건물과 관리 기록
- [임대 마케팅](leasing-marketing-v1.png): 공실 건물과 홍보 도구
- [인테리어](interior-v1.png): 공간 구성과 작업 도구

이미지는 실제 건물·실적 자료가 아닌 장식용 일러스트다. 이미지에 회색 기준선이나 배경 타일을 추가하지 않는다. PC 96px, 모바일 80px의 동일한 상자로 크기를 관리하며 이미지 고유 비율을 유지한다. 래스터 이미지 색상은 파운데이션 색상 편집 시 자동으로 변하지 않으므로 이미지 수정은 이 프롬프트와 원본을 기준으로 한다.

## 생성 프롬프트

### property-management

도구: image_gen.imagegen · transparent_background: true

원본: C:/Users/leeys/.codex/generated_images/01a0a7b6-1ed7-72e3-915d-872012499d0f/exec-211adc04-e636-4b88-b764-016683307413.png

```text
Use case: logo-brand.
Asset type: one standalone transparent PNG service pictogram for an established Korean real-estate company's website mega-menu. The logo is a formal black serif SPS wordmark with red circular marks. This is a small supporting illustration, NOT a logo.
Style: restrained professional architectural line illustration, precise dark ink outlines, economical geometry, very subtle white solid fills within objects, one small deep-red accent. No cute cartoon, no playful rounded blobs, no 3D clay, no gradients, no glossy effects.
Palette: dark ink #10252B outlines, red #D5092B accent, white object interiors. Truly transparent background with alpha.
Composition: square canvas, one cohesive centered object group, roughly 82% canvas width and height, equal clear margins, no cropping. Consistent medium-weight clean strokes that remain readable when displayed at 96px wide. Simple iconic silhouette, avoid dense micro-details.
Text: absolutely no text, letters, numbers, labels, logos or watermark.
Critical: NO background tile, NO colored square, NO circle badge backdrop, NO floor/ground baseline beneath the illustration, NO grey horizontal underline, NO shadow or reflection.
Subject: PROPERTY MANAGEMENT. An elegant mid-rise commercial office building paired with a small operations ledger/clipboard in the foreground, with two simple ledger lines and one red check mark. The building dominates. Convey organized ongoing building operations and accountability. Use an understated slightly angled architectural view, not a house, no shields or floating particles.
```

### leasing-marketing

도구: image_gen.imagegen · transparent_background: true

원본: C:/Users/leeys/.codex/generated_images/01a0a7b6-1ed7-72e3-915d-872012499d0f/exec-7036ef32-0304-43ce-bc69-ec31d714718f.png

```text
Use case: logo-brand.
Asset type: one standalone transparent PNG service pictogram for an established Korean real-estate company's website mega-menu. The logo is a formal black serif SPS wordmark with red circular marks. This is a small supporting illustration, NOT a logo.
Style: restrained professional architectural line illustration, precise dark ink outlines, economical geometry, very subtle white solid fills within objects, one small deep-red accent. No cute cartoon, no playful rounded blobs, no 3D clay, no gradients, no glossy effects.
Palette: dark ink #10252B outlines, red #D5092B accent, white object interiors. Truly transparent background with alpha.
Composition: square canvas, one cohesive centered object group, roughly 82% canvas width and height, equal clear margins, no cropping. Consistent medium-weight clean strokes that remain readable when displayed at 96px wide. Simple iconic silhouette, avoid dense micro-details.
Text: absolutely no text, letters, numbers, labels, logos or watermark.
Critical: NO background tile, NO colored square, NO circle badge backdrop, NO floor/ground baseline beneath the illustration, NO grey horizontal underline, NO shadow or reflection.
Subject: LEASING MARKETING. A commercial office facade with a clearly identifiable compact megaphone in the lower foreground, its small cone opening in red. Convey promoting vacant business space and attracting tenants. One integrated simple architectural composition, understated slightly angled view. No dollar signs, no contracts, no magnifying glass, no text, no sound-wave decoration outside the object group.
```

### interior

도구: image_gen.imagegen · transparent_background: true

원본: C:/Users/leeys/.codex/generated_images/01a0a7b6-1ed7-72e3-915d-872012499d0f/exec-072c13e4-b56d-4d70-b363-59c7c0dbbf7a.png

```text
Use case: logo-brand.
Asset type: one standalone transparent PNG service pictogram for an established Korean real-estate company's website mega-menu. The logo is a formal black serif SPS wordmark with red circular marks. This is a small supporting illustration, NOT a logo.
Style: restrained professional architectural line illustration, precise dark ink outlines, economical geometry, very subtle white solid fills within objects, one small deep-red accent. No cute cartoon, no playful rounded blobs, no 3D clay, no gradients, no glossy effects.
Palette: dark ink #10252B outlines, red #D5092B accent, white object interiors. Truly transparent background with alpha.
Composition: square canvas, one cohesive centered object group, roughly 82% canvas width and height, equal clear margins, no cropping. Consistent medium-weight clean strokes that remain readable when displayed at 96px wide. Simple iconic silhouette, avoid dense micro-details.
Text: absolutely no text, letters, numbers, labels, logos or watermark.
Critical: NO background tile, NO colored square, NO circle badge backdrop, NO floor/ground baseline beneath the illustration, NO grey horizontal underline, NO shadow or reflection.
Subject: INTERIOR IMPROVEMENT. A carefully composed architectural interior vignette: one refined straight-edged lounge chair, a clean vertical wall/window frame behind it, and one compact red-accent paint roller leaning alongside. Convey space planning and interior renovation. Understated slightly angled architectural view. Do not draw a room floor slab or a baseline beneath the composition. No plant, no household clutter, no ruler numbers.
```
