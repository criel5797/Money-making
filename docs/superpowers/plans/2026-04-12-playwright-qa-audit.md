# Playwright QA Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** instaidea.org 전체 페이지를 5개 탭 병렬로 전수 감사하는 `qa-audit.js`를 구현하고, `/loop` 프롬프트와 연동되는 자동 QA 시스템을 완성한다.

**Architecture:** Playwright chromium으로 dist/ 전체 HTML을 file:// 프로토콜로 열고, 5개 탭 병렬 배치로 처리한다. 각 탭에서 콘솔 에러·404·깨진 이미지·i18n·SEO·모바일 스크롤을 수집해 qa-report.json으로 저장한다.

**Tech Stack:** Node.js, Playwright (chromium), fs, path

---

## 파일 구성

| 파일 | 역할 |
|------|------|
| `qa-audit.js` | Playwright 감사 스크립트 (신규 생성) |
| `.gitignore` | qa-report.json, qa-screenshots/ 제외 (신규 생성) |
| `package.json` | playwright 의존성 추가 |

---

### Task 1: Playwright 설치 및 .gitignore 생성

**Files:**
- Modify: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Playwright 설치**

```bash
cd E:\Money\Money-making
npm install --save-dev playwright
npx playwright install chromium
```

Expected: `node_modules/playwright` 생성, chromium 바이너리 다운로드

- [ ] **Step 2: .gitignore 생성**

내용:
```
node_modules/
qa-report.json
qa-screenshots/
```

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add playwright and gitignore for qa artifacts"
```

---

### Task 2: qa-audit.js 핵심 구현

**Files:**
- Create: `qa-audit.js`

- [ ] **Step 1: 페이지 목록 수집 함수 작성**

dist/Money-making/ 하위의 모든 index.html, index-en.html, index-ja.html 파일을 재귀 스캔.

- [ ] **Step 2: 단일 페이지 감사 함수 작성**

각 페이지에서 수집:
- console error 이벤트
- requestfailed 이벤트
- response 404 이벤트
- naturalWidth === 0 이미지
- en/ja 페이지의 한국어 문자
- SEO 메타 (title 길이, description, og:image, json-ld, canonical)
- 모바일(375px) 가로 스크롤
- 전체 페이지 스크린샷

- [ ] **Step 3: 병렬 배치 실행 루프 작성**

5개씩 배치 분할 후 Promise.all로 병렬 처리.

- [ ] **Step 4: qa-report.json 저장**

timestamp, totalPages, totalIssues, results 포함.

- [ ] **Step 5: 커밋**

```bash
git add qa-audit.js
git commit -m "feat: add playwright qa-audit.js with parallel tab scanning"
```

---

### Task 3: 검증

- [ ] **Step 1: 스크립트 실행**

```bash
node qa-audit.js
```

Expected: 콘솔에 배치 진행 상황 출력, qa-report.json 생성

- [ ] **Step 2: 리포트 확인**

```bash
node -e "const r=require('./qa-report.json'); console.log('페이지:', r.totalPages, '/ 문제:', r.totalIssues)"
```

- [ ] **Step 3: 스크린샷 확인**

```bash
ls qa-screenshots/ | head -5
```

- [ ] **Step 4: 최종 커밋**

```bash
git add -A
git commit -m "chore: verify qa-audit runs successfully"
```
