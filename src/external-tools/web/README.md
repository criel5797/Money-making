# 개발자 도구 모음 - 완제품 (34개)

## 만들어진 도구들

| # | 도구 | 폴더 | 설명 | 타겟 사용자 |
|---|------|------|------|------------|
| 1 | JSON to TypeScript | `json-to-typescript/` | JSON → TS 인터페이스 변환 | 개발자 |
| 2 | Regex Tester | `regex-tester/` | 정규표현식 실시간 테스트 | 개발자 |
| 3 | Base64 Encoder/Decoder | `base64-tool/` | Base64 인코딩/디코딩 | 개발자 |
| 4 | Color Converter | `color-converter/` | HEX/RGB/HSL 변환 | 디자이너/개발자 |
| 5 | UUID Generator | `uuid-generator/` | UUID v1/v4 생성 | 개발자 |
| 6 | Lorem Ipsum | `lorem-ipsum/` | 더미 텍스트 생성 | 디자이너/개발자 |
| 7 | Password Generator | `password-generator/` | 보안 비밀번호 생성 | 일반 사용자 |
| 8 | QR Generator | `qr-generator/` | QR 코드 생성 | 일반 사용자 |
| 9 | Markdown to HTML | `markdown-to-html/` | 마크다운 → HTML 변환 | 블로거/개발자 |
| 10 | CSS Minifier | `css-minifier/` | CSS 압축/최소화 | 개발자 |
| 11 | JWT Decoder | `jwt-decoder/` | JWT 토큰 파싱 | 개발자 |
| 12 | Timestamp Converter | `timestamp-converter/` | Unix 타임스탬프 변환 | 개발자 |
| 13 | URL Encoder/Decoder | `url-encoder/` | URL 인코딩/디코딩 | 개발자 |
| 14 | Image to Base64 | `image-to-base64/` | 이미지 → Base64 변환 | 개발자 |
| 15 | Hash Generator | `hash-generator/` | MD5/SHA 해시 생성 | 개발자 |
| 16 | Word Counter | `word-counter/` | 단어/글자 수 계산 | 블로거/작가 |
| 17 | JSON Formatter | `json-formatter/` | JSON 포매팅/정리 | 개발자 |
| 18 | HTML Minifier | `html-minifier/` | HTML 압축/최소화 | 개발자 |
| 19 | SQL Formatter | `sql-formatter/` | SQL 쿼리 정리 | 개발자 |
| 20 | Random Name Generator | `name-generator/` | 랜덤 이름 생성 | 개발자/테스터 |
| 21 | Color Palette Generator | `color-palette/` | 컬러 팔레트 생성 | 디자이너 |
| 22 | Cron Expression Generator | `cron-generator/` | Cron 표현식 생성 | 개발자 |
| 23 | Diff Checker | `diff-checker/` | 텍스트 비교 | 개발자 |
| 24 | Pomodoro Timer | `pomodoro-timer/` | 집중 타이머 | 일반 사용자 |
| 25 | Slug Generator | `slug-generator/` | URL 슬러그 생성 | 블로거/개발자 |
| 26 | **IP Address Info** | `ip-info/` | IP 주소 조회 | 개발자/일반 |
| 27 | **CSS Gradient Generator** | `css-gradient/` | CSS 그라디언트 생성 | 디자이너/개발자 |
| 28 | **Box Shadow Generator** | `box-shadow/` | CSS 박스 쉐도우 생성 | 디자이너/개발자 |
| 29 | **Emoji Picker** | `emoji-picker/` | 이모지 검색/복사 | 일반 사용자 |
| 30 | **Text Case Converter** | `text-case-converter/` | 텍스트 케이스 변환 | 개발자/작가 |
| 31 | **Aspect Ratio Calculator** | `aspect-ratio/` | 이미지 비율 계산 | 디자이너/개발자 |
| 32 | **Binary/Hex Converter** | `binary-hex/` | 진법 변환기 | 개발자 |
| 33 | **Meta Tag Generator** | `meta-tag-generator/` | SEO 메타 태그 생성 | 개발자/마케터 |

---

## 신규 추가 도구 (9개) ⭐

| 도구 | 월간 검색량 | 특징 |
|------|------------|------|
| IP Address Info | 300K+ | IP 조회, 위치, ISP 정보 |
| CSS Gradient Generator | 200K+ | 선형/원형/원뿔 그라디언트, 프리셋 |
| Box Shadow Generator | 150K+ | 다중 레이어, 프리셋 |
| Emoji Picker | 400K+ | 카테고리별 검색, 최근 사용 |
| Text Case Converter | 100K+ | 14가지 케이스 변환 |
| Aspect Ratio Calculator | 150K+ | 이미지/비디오 비율, 프리셋 |
| Binary/Hex Converter | 100K+ | 진법 변환, 텍스트↔바이너리 |
| Meta Tag Generator | 200K+ | SEO 메타 태그, OG/Twitter 카드 |

---

## 배포 방법 (5분)

### 옵션 A: Vercel 통합 배포 (추천)
```
devtools.site/
├── /json-to-typescript
├── /regex-tester
├── /base64
├── /ip-info           ← NEW
├── /css-gradient      ← NEW
├── /box-shadow        ← NEW
├── /emoji-picker      ← NEW
├── /text-case         ← NEW
└── ...
```

### 옵션 B: 개별 도메인
일반 사용자용 도구는 별도 도메인 추천:
```
jsonformatter.io
emoji-picker.io
gradient-generator.io
```

---

## Vercel 배포 (1분)

### 방법 1: CLI
```bash
npm i -g vercel
cd WEB_TOOLS
vercel
```

### 방법 2: 웹
1. vercel.com 접속
2. New Project
3. WEB_TOOLS 폴더 드래그앤드롭
4. Deploy

---

## 수익화: Google AdSense

### 1. 사이트 최소 2주 운영
### 2. AdSense 신청 (adsense.google.com)
### 3. 승인 후 광고 코드 삽입

각 index.html에 "Advertisement" 라고 표시된 곳에 광고 코드 삽입:

```html
<div class="ad-banner">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-YOUR_ID"
       data-ad-slot="YOUR_SLOT"
       data-ad-format="auto"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

---

## 예상 수익

| 월 방문자 | RPM $1-2 기준 | 도구 30개 합산 |
|----------|--------------|---------------|
| 10,000 | $10-20 | $300-600 |
| 50,000 | $50-100 | $1,500-3,000 |
| 100,000 | $100-200 | $3,000-6,000 |

**도구 30개 × SEO 최적화 = 다양한 검색 유입**

---

## 특징

- ✅ 다크 테마 통일 디자인
- ✅ 모바일 반응형
- ✅ SEO 메타 태그 포함
- ✅ 광고 배너 위치 지정됨
- ✅ 복사/다운로드 기능
- ✅ 토스트 알림
- ✅ 외부 의존성 최소화
- ✅ LocalStorage 저장 (설정, 통계)

---

## 파일 구조

```
WEB_TOOLS/
├── json-to-typescript/
├── regex-tester/
├── base64-tool/
├── color-converter/
├── uuid-generator/
├── lorem-ipsum/
├── password-generator/
├── qr-generator/
├── markdown-to-html/
├── css-minifier/
├── jwt-decoder/
├── timestamp-converter/
├── url-encoder/
├── image-to-base64/
├── hash-generator/
├── word-counter/
├── json-formatter/
├── html-minifier/
├── sql-formatter/
├── name-generator/
├── color-palette/
├── cron-generator/
├── diff-checker/
├── pomodoro-timer/
├── slug-generator/
├── ip-info/              ← NEW
├── css-gradient/         ← NEW
├── box-shadow/           ← NEW
├── emoji-picker/         ← NEW
├── text-case-converter/  ← NEW
└── README.md
```

**각 index.html은 단독 실행 가능 (외부 의존성 없음, qr-generator만 CDN 사용)**
