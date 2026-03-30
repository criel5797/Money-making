# JSON to TypeScript 변환기 - 배포 및 수익화 가이드

## 완성된 파일

```
WEB_TOOLS/json-to-typescript/
└── index.html    ← 이 파일 하나가 전부
```

---

## Step 1: Vercel 배포 (3분)

### 방법 A: 드래그 앤 드롭
1. https://vercel.com 접속 (GitHub으로 로그인)
2. 우측 상단 "Add New..." > "Project"
3. "Import Third-Party Git Repository" 대신 아래로 스크롤
4. **또는** https://vercel.com/new 에서 폴더 드래그앤드롭
5. `json-to-typescript` 폴더 통째로 업로드
6. Deploy 클릭
7. 완료! `xxx.vercel.app` 주소 받음

### 방법 B: CLI (더 빠름)
```bash
npm i -g vercel
cd json-to-typescript
vercel
```

---

## Step 2: 커스텀 도메인 연결 (선택)

### 도메인 구매 추천
- **Namecheap**: jsonts.dev, json2ts.com 등 (~$10/년)
- **Cloudflare**: 도메인 + 무료 CDN

### Vercel에서 연결
1. Vercel 프로젝트 > Settings > Domains
2. 도메인 입력
3. DNS 설정 (Vercel이 안내해줌)

---

## Step 3: Google AdSense 신청 (수익화)

### 조건
- 사이트가 최소 2-4주 운영
- 유용한 콘텐츠 (이미 포함됨)
- 개인정보처리방침 페이지

### 신청 순서
1. https://adsense.google.com 접속
2. 사이트 URL 입력
3. 코드 받아서 `index.html`의 `<head>`에 추가:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
```

4. 승인 대기 (보통 1-2주)

### 광고 배치 위치 (이미 준비됨)
- `id="ad-top"`: 상단 배너
- `id="ad-middle"`: 중간 배너
- `id="ad-bottom"`: 하단 배너

승인 후 각 위치에 광고 코드 삽입.

---

## Step 4: SEO 최적화 (트래픽 확보)

### 이미 적용된 SEO
- ✅ 메타 태그 (title, description, keywords)
- ✅ Open Graph 태그
- ✅ 시맨틱 HTML
- ✅ SEO 콘텐츠 섹션

### 추가로 할 것

#### Google Search Console 등록
1. https://search.google.com/search-console
2. 사이트 추가
3. 소유권 확인 (HTML 태그 방식 추천)
4. sitemap.xml 제출

#### sitemap.xml 생성
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## Step 5: 트래픽 확보 전략

### 무료 마케팅

#### Reddit
- r/webdev
- r/typescript
- r/programming
- r/javascript

게시글 예시:
```
Title: I built a free JSON to TypeScript converter

Just shipped a simple tool I've been using.
Paste JSON, get TypeScript interfaces.

- No signup
- Works offline
- Privacy-focused (nothing sent to server)

[link]

Happy to hear feedback!
```

#### Twitter/X
```
🚀 Just launched: JSON to TypeScript Converter

Paste JSON → Get TypeScript interfaces instantly.

✅ Free
✅ No signup
✅ Works offline
✅ Privacy-focused

jsonts.dev

#TypeScript #WebDev #JavaScript
```

#### Hacker News
- "Show HN: JSON to TypeScript Converter"

#### Dev.to
- 튜토리얼 글 작성: "How I Built a JSON to TypeScript Converter"

### 검색 유입 키워드 (타겟)
- json to typescript
- json to typescript converter
- json to ts
- convert json to typescript interface
- typescript interface generator
- json to typescript online

---

## 예상 수익

### 트래픽 기반 AdSense 수익

| 월 방문자 | 예상 RPM | 월 수익 |
|----------|---------|--------|
| 1,000 | $1-2 | $1-2 |
| 10,000 | $1-2 | $10-20 |
| 50,000 | $1-2 | $50-100 |
| 100,000 | $1-2 | $100-200 |

개발자 도구는 RPM이 낮은 편이지만, 트래픽 확보가 상대적으로 쉬움.

### 수익 극대화 방법
1. **더 많은 도구 추가** (같은 도메인에)
   - TypeScript to JSON
   - JSON Formatter
   - JSON Validator
   - Base64 Encoder/Decoder

2. **프리미엄 기능** (나중에)
   - API 제공 (유료)
   - VS Code 확장 (유료)

---

## 다음 도구 추천

같은 사이트에 추가할 도구들:
1. JSON Formatter / Validator
2. Base64 Encoder/Decoder
3. URL Encoder/Decoder
4. Regex Tester
5. Color Converter (HEX/RGB/HSL)
6. Markdown to HTML
7. CSS Minifier

각 도구 = 추가 검색 유입 = 더 많은 광고 수익

---

## 체크리스트

- [ ] index.html 파일 확인
- [ ] Vercel 배포
- [ ] (선택) 커스텀 도메인 연결
- [ ] Google Search Console 등록
- [ ] Google AdSense 신청
- [ ] Reddit/Twitter 마케팅
- [ ] 승인 후 광고 코드 삽입

---

## 문제 해결

### AdSense 승인 거부 시
- 개인정보처리방침 페이지 추가
- 콘텐츠 더 추가 (블로그 섹션)
- 2주 후 재신청

### 트래픽이 안 나올 때
- 더 많은 도구 추가
- 블로그 글 작성
- 백링크 확보 (dev.to, medium 글)
