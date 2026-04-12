# Playwright QA Loop Design

**Date:** 2026-04-12  
**Project:** instaidea.org (E:\Money\Money-making)  
**Status:** Approved

---

## 개요

Playwright로 전체 페이지를 병렬 탭(5개씩)으로 전수 검사하고, 발견된 문제를 자동으로 수정·빌드·커밋하는 `/loop` 기반 품질 감사 시스템.

---

## 아키텍처

```
/loop 30m [프롬프트]
       │
       ▼
  qa-audit.js (Playwright)
       │
       ├─ 전체 페이지 목록 수집 (dist/ 스캔)
       ├─ 5개 탭 병렬 배치 처리
       │     각 탭: 스크린샷 + 콘솔 에러 + DOM 분석 + 네트워크 감시
       └─ qa-report.json 저장
              │
              ▼
         Claude (레이어 1 기술 체크 + 레이어 2 감성 체크)
              │
         ┌────┴────┐
     문제 없음    문제 발견
         │            │
     로그 커밋   src/ 수정 + 에셋 조달
                 node generate.js
                 git commit
```

**생성 파일:**
```
E:\Money\Money-making\
├── qa-audit.js          ← Playwright 감사 스크립트 (1회 생성)
├── qa-report.json       ← 매 루프마다 덮어씌워짐 (.gitignore)
└── qa-screenshots/      ← 페이지별 스크린샷 (.gitignore)
```

---

## `/loop` 프롬프트 전체 텍스트

아래 내용을 `/loop 30m` 뒤에 붙여 사용한다.

---

```
당신은 instaidea.org (E:\Money\Money-making) 품질 감사 에이전트입니다.
매 루프마다 아래 5단계를 완전히 수행합니다.

## STEP 1: Playwright 전수 감사
`node qa-audit.js` 실행 → qa-report.json 생성
(5개 탭 병렬, 전체 페이지 대상)

## STEP 2: 레이어 1 — 기술 체크리스트
qa-report.json 기반으로 위반 항목을 목록으로 정리합니다.

### 🎨 시각적 품질
- [ ] 동일 행 카드/버튼 높이 균일 (±20px 이내)
- [ ] 텍스트가 컨테이너를 벗어나지 않음 (overflow 없음)
- [ ] 빈 공백 섹션 100px 이상 방치 없음
- [ ] 모바일(375px) 가로 스크롤 없음
- [ ] 배경 대비 텍스트 가독성 (연회색 on 흰 배경 금지)
- [ ] CSS 애니메이션 정상 (`animationh:` 같은 오타 없음)
- [ ] Above the fold 영역에 CTA(플레이 버튼)가 가장 눈에 띄는 요소로 존재

### 🖼️ 에셋 무결성
- [ ] 404 응답 리소스 없음
- [ ] naturalWidth === 0 깨진 이미지 없음
- [ ] favicon 정상 로드

### 🌐 로컬라이제이션
- [ ] en 페이지에서 한국어 문자([\uAC00-\uD7A3]) 미감지
- [ ] ja 페이지에서 한국어 문자 미감지
- [ ] 버튼·라벨·placeholder 3개 언어 모두 번역됨
- [ ] 게임 진행 중 동적 메시지 번역됨
- [ ] 언어 전환 버튼(ko/en/ja) 정상 동작
- [ ] data-i18n 키가 번역 안 된 채로 노출 안 됨

### 🎮 기능 동작
- [ ] 게임 시작 버튼 클릭 → 3초 내 게임 화면 전환
- [ ] 게임 완주 후 결과 화면 표시 (NaN·undefined·null 미노출)
- [ ] 재시작 버튼 정상 동작
- [ ] JS 콘솔 에러 없음 (TypeError, ReferenceError)
- [ ] 공유 모달 열림·닫힘 정상

### 💰 수익화 영역
- [ ] 광고(AdSense)가 게임/콘텐츠를 가리지 않음
- [ ] 광고가 레이아웃을 무너뜨리지 않음
- [ ] 광고보다 게임 CTA가 시각적으로 더 강조됨

### 🔍 SEO / 메타데이터
- [ ] title 30자 이상, 페이지별 고유
- [ ] meta description 50자 이상
- [ ] og:title·og:description·og:image 모두 존재
- [ ] og:image 비율 1200×630 (SNS 미리보기 잘림 없음)
- [ ] JSON-LD structured data 존재 (BreadcrumbList + WebApplication)
- [ ] canonical URL 존재

### 🔗 내비게이션 / 링크
- [ ] 내부 링크 중 404 없음
- [ ] 홈·게임 허브 링크 정상
- [ ] 브레드크럼 링크 정상

### 🌙 다크 모드
- [ ] prefers-color-scheme:dark 에서 텍스트/배경이 깨지지 않음

### 📈 리텐션
- [ ] 게임 종료 후 "다음 게임 추천" 섹션이 바로 보이는가
- [ ] 최고 기록(베스트 스코어)이 localStorage에 저장되고 표시되는가
- [ ] "이전 기록 갱신!" 등 재도전 동기 부여 문구가 있는가
- [ ] 재시작 버튼이 결과 화면에서 가장 눈에 띄는 위치에 있는가
- [ ] 난이도가 점진적으로 상승하는가 (같은 게임을 계속 하고 싶게)
- [ ] 공유 버튼 텍스트가 호기심 유발형인가
  좋음: "내 반응속도 234ms ⚡ 너도 해봐"
  나쁨: "공유하기"

### 📣 바이럴 / 노출
- [ ] 공유 텍스트가 수동적("공유")이 아니라 능동적("도전해봐")인가
- [ ] og:image가 게임별로 다르고 결과값·브랜드명이 포함됐는가
- [ ] title/description에 롱테일 검색 키워드 포함됐는가
  예: "반응속도 테스트 무료" "순발력 측정 온라인" "기억력 게임"
- [ ] 게임 페이지 하단에 관련 게임 내부 링크가 있는가 (크롤러 + 리텐션)
- [ ] 게임 결과가 숫자/등급으로 나와 자랑하고 싶게 만드는가
  예: "상위 12%", "평균보다 0.3초 빠름"

---

## STEP 3: 레이어 2 — 감성 체크 (처음 온 사용자 관점)
qa-screenshots/ 스크린샷을 보며 아래를 자문합니다:

- "처음 온 사람이 3초 안에 여기서 뭘 하면 되는지 아는가?"
- "플레이 버튼이 페이지에서 가장 눈에 띄는 요소인가?"
- "결과 화면이 다시 하고 싶게 만드는가?"
- "전체 톤이 가볍고 즐거운 느낌인가, 아니면 무겁고 밋밋한가?"
- "있으면 나쁜 것이 있는가? (자동재생 소리, 지나친 팝업, 광고 도배)"
- "게임 완주 후 자연스럽게 다음 게임으로 유도되는가?"

발견한 감성적 문제도 수정 목록에 포함합니다.

---

## STEP 4: 수정

심각도 순서로 수정합니다:
1. 매우 높음 — 기능 오류·에셋 404·수익화 영역 붕괴
2. 높음 — i18n 누락·시각적 어색함·감성 체크 실패·리텐션 미흡
3. 중간 — SEO 미비·다크 모드·링크 오류·바이럴 요소 부재

수정 위치:
- HTML/JS 로직: src/ 파일 수정 → node generate.js → dist/ 자동 생성
- 에셋(아이콘·이미지): dist/Money-making/common/ 에 직접 저장 (generate.js가 에셋을 복사하지 않으므로)

### 에셋 부족 시 자동 조달 규칙
에셋이 누락·깨짐·placeholder 수준일 때, 즉시 다음 우선순위로 조달합니다:

1. SVG 인라인 생성 (아이콘, 단순 일러스트)
   - 별도 HTTP 요청 없음, 가장 빠름
   - 게임 아이콘, 배지, UI 요소에 적합

2. Iconify API (범용 아이콘)
   - URL: https://api.iconify.design/{collection}/{icon}.svg
   - 컬렉션: twemoji(이모지 스타일), game-icons(게임), mdi(일반 UI)
   - 다운로드 후 dist/Money-making/common/icons/ 에 저장

3. CSS Gradient (배경 이미지 대체)
   - 네트워크 요청 없음, 즉시 적용 가능
   - 게임별 색상 테마로 배경 구성

4. Unsplash Source API (사진 필요 시, og:image 전용)
   - URL: https://source.unsplash.com/1200x630/?{keyword}
   - 반드시 다운로드 후 dist/에 저장 (외부 URL 직접 참조 금지)

조달 후 확인사항:
- 라이선스: Iconify·Unsplash 모두 무료 상업 사용 가능
- 파일 크기: 아이콘 5KB 이하, 이미지 100KB 이하
- 색상이 기존 사이트 톤과 어울리는지

---

## STEP 5: 커밋 + 요약
git add src/ dist/
git commit -m "QA: [수정 유형] - [페이지/항목]"

루프 종료 전 한 줄 요약 출력:
"발견 N건 / 수정 N건 / 미수정(수동 필요) N건"
```

---

## 구현 필요 파일

### qa-audit.js (Playwright 스크립트)

```javascript
// 핵심 동작:
// 1. dist/ 스캔으로 전체 페이지 URL 목록 생성
// 2. 5개 탭 병렬로 각 페이지 방문
// 3. 각 페이지에서 수집:
//    - 콘솔 에러 (page.on('console'))
//    - 실패한 요청 (page.on('requestfailed'))
//    - 404 응답 (page.on('response'))
//    - 깨진 이미지 (naturalWidth === 0)
//    - 한국어 텍스트 (en/ja 페이지에서)
//    - SEO 메타 정보
//    - 스크린샷 (fullPage: true)
// 4. qa-report.json 저장
```

---

## 판단 기준 요약

| 심각도 | 항목 |
|--------|------|
| 매우 높음 | 기능 오류, 에셋 404, 수익화 영역 붕괴 |
| 높음 | i18n 누락, 시각적 어색함, 리텐션 미흡 |
| 중간 | SEO, 다크 모드, 바이럴 요소 |

---

## .gitignore 추가 필요

```
qa-report.json
qa-screenshots/
```
