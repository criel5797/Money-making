'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist', 'Money-making');
const PARALLEL_TABS = 5;
const SCREENSHOT_DIR = path.join(__dirname, 'qa-screenshots');

// dist/ 하위의 모든 HTML 페이지 수집
function collectPages() {
  const pages = [];

  function scan(dir, urlPath) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), urlPath + entry.name + '/');
      } else if (['index.html', 'index-en.html', 'index-ja.html'].includes(entry.name)) {
        const lang = entry.name === 'index-en.html' ? 'en'
                   : entry.name === 'index-ja.html' ? 'ja' : 'ko';
        pages.push({
          filePath: path.join(dir, entry.name),
          urlPath: urlPath + entry.name,
          lang,
        });
      }
    }
  }

  scan(DIST_DIR, '/');
  return pages;
}

// 단일 페이지 감사
async function auditPage(context, pageInfo) {
  const page = await context.newPage();
  const issues = [];
  const consoleErrors = [];
  const failedRequests = [];
  const notFoundUrls = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', req => failedRequests.push(req.url()));
  page.on('response', res => {
    if (res.status() === 404) notFoundUrls.push(res.url());
  });

  try {
    const fileUrl = 'file:///' + pageInfo.filePath.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(800); // 애니메이션·동적 렌더링 + tool-i18n-handler 대기

    // 스크린샷 (1280px 데스크탑)
    if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const shotName = pageInfo.urlPath.replace(/\//g, '__').replace(/\.html$/, '') + '.png';
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, shotName), fullPage: true });

    // ── 콘솔 에러 (file:// 아티팩트 제외) ────────────────────────
    const realConsoleErrors = consoleErrors.filter(e =>
      !e.includes('ERR_FILE_NOT_FOUND') &&
      !e.includes('net::ERR_') &&
      !e.includes("from origin 'null'") &&   // file:// CORS false positive
      !e.includes('Cross-Origin')
    );
    if (realConsoleErrors.length) {
      issues.push({ type: 'console-error', severity: 'very-high', items: realConsoleErrors });
    }

    // ── 실패 요청 / 404 (file:// 경로 아티팩트 제외) ───────────────
    // External HTTPS requests fail from file:// (null origin CORS) — not real failures
    const realFailedRequests = failedRequests.filter(u =>
      !u.startsWith('file:///') && !u.startsWith('https://')
    );
    if (realFailedRequests.length) {
      issues.push({ type: 'failed-request', severity: 'very-high', items: realFailedRequests });
    }
    if (notFoundUrls.length) {
      issues.push({ type: '404-resource', severity: 'very-high', items: notFoundUrls });
    }

    // ── 깨진 이미지 ─────────────────────────────────────────────
    const currentHref = page.url();
    const brokenImages = await page.evaluate((pageHref) =>
      Array.from(document.images)
        .filter(img => img.naturalWidth === 0 && img.src && img.src !== pageHref && !img.src.startsWith('data:'))
        .map(img => img.src)
    , currentHref);
    if (brokenImages.length) {
      issues.push({ type: 'broken-images', severity: 'very-high', items: brokenImages });
    }

    // ── i18n: en/ja 페이지에서 한국어 문자 감지 ─────────────────
    if (pageInfo.lang !== 'ko') {
      const koreanItems = await page.evaluate(() => {
        const results = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const text = node.textContent.trim();
          if (text && /[\uAC00-\uD7A3]/.test(text)) {
            const parent = node.parentElement;
            if (!parent) continue;
            if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) continue;
            // 언어 스위처 버튼 제외 ('한국어' 단독 텍스트)
            if (text === '한국어') continue;
            // data-lang 버튼 제외
            if (parent.closest('[data-lang]') || parent.closest('.lang-btn') || parent.closest('.lang-switcher')) continue;
            // number-to-korean 툴은 의도적으로 한국어 출력 (Korean numeral converter)
            if (location.pathname.includes('number-to-korean')) continue;
            results.push({ text: text.substring(0, 60), tag: parent.tagName });
          }
        }
        return results;
      });
      if (koreanItems.length) {
        issues.push({ type: 'i18n-korean-in-foreign-page', severity: 'high', items: koreanItems });
      }
    }

    // ── SEO 메타데이터 ──────────────────────────────────────────
    const seo = await page.evaluate(() => {
      // og:title is the canonical SEO title (not overwritten by JS timers/counters)
      const ogTitle = document.querySelector('meta[property="og:title"]')?.content ?? '';
      const effectiveTitle = ogTitle || document.title;
      return {
        title: effectiveTitle,
        titleLen: effectiveTitle.length,
        desc: document.querySelector('meta[name="description"]')?.content ?? '',
        ogTitle: ogTitle,
        ogImage: document.querySelector('meta[property="og:image"]')?.content ?? '',
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
        jsonLd: !!document.querySelector('script[type="application/ld+json"]'),
      };
    });

    if (seo.titleLen < 30) {
      issues.push({ type: 'seo-short-title', severity: 'medium', value: seo.title, length: seo.titleLen });
    }
    if (seo.desc.length < 50) {
      issues.push({ type: 'seo-short-description', severity: 'medium', length: seo.desc.length });
    }
    if (!seo.ogImage) {
      issues.push({ type: 'seo-missing-og-image', severity: 'medium' });
    }
    if (!seo.jsonLd) {
      issues.push({ type: 'seo-missing-json-ld', severity: 'medium' });
    }
    if (!seo.canonical) {
      issues.push({ type: 'seo-missing-canonical', severity: 'medium' });
    }

    // ── 모바일(375px) 가로 스크롤 ──────────────────────────────
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    const hasHScroll = await page.evaluate(() => {
      // html 또는 body에 overflow-x:hidden이 있으면 실제 스크롤 불가 → false
      const htmlOvf = window.getComputedStyle(document.documentElement).overflowX;
      const bodyOvf = window.getComputedStyle(document.body).overflowX;
      if (htmlOvf === 'hidden' || bodyOvf === 'hidden') return false;
      return document.body.scrollWidth > window.innerWidth;
    });
    if (hasHScroll) {
      issues.push({ type: 'mobile-horizontal-scroll', severity: 'high' });
    }

    // ── Above the fold: CTA 버튼 존재 여부 ────────────────────
    await page.setViewportSize({ width: 1280, height: 720 });
    const ctaVisible = await page.evaluate(() => {
      const ctaKeywords = ['play', '시작', '플레이', 'start', 'スタート', 'click', '클릭', 'クリック', 'tap', 'begin', '시작하기', '開始', 'テスト', 'ゲーム', '挑戦', 'プレイ', '게임', 'games'];
      // Check buttons and links
      const btns = document.querySelectorAll('a[href], button');
      for (const btn of btns) {
        const rect = btn.getBoundingClientRect();
        const text = btn.textContent.toLowerCase();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight &&
            ctaKeywords.some(k => text.includes(k))) {
          return true;
        }
      }
      // Also check any visible element with cursor:pointer and CTA text (game areas)
      const allEls = document.querySelectorAll('[onclick], [data-i18n-game]');
      for (const el of allEls) {
        const rect = el.getBoundingClientRect();
        const text = el.textContent.toLowerCase();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0 &&
            ctaKeywords.some(k => text.includes(k))) {
          return true;
        }
      }
      return false;
    });
    // 게임 페이지에서만 CTA 체크
    const isGamePage = pageInfo.urlPath.includes('/games/') &&
                       !pageInfo.urlPath.match(/\/games\/index/);
    if (isGamePage && !ctaVisible) {
      issues.push({ type: 'no-cta-above-fold', severity: 'high' });
    }

    // ── 리텐션: 결과 화면 after 게임 추천 링크 ─────────────────
    if (isGamePage) {
      const hasNextGameLink = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href*="/games/"]'));
        return links.length >= 2; // 자기 자신 제외 최소 1개
      });
      if (!hasNextGameLink) {
        issues.push({ type: 'retention-no-next-game-link', severity: 'high' });
      }
    }

    // ── 바이럴: 공유 버튼 존재 여부 ────────────────────────────
    if (isGamePage) {
      const hasShareBtn = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('button, a'));
        return all.some(el => {
          const t = el.textContent.toLowerCase();
          return t.includes('share') || t.includes('공유') || t.includes('シェア');
        });
      });
      if (!hasShareBtn) {
        issues.push({ type: 'viral-no-share-button', severity: 'medium' });
      }
    }

  } catch (err) {
    issues.push({ type: 'page-load-error', severity: 'very-high', message: err.message });
  } finally {
    await page.close();
  }

  return {
    urlPath: pageInfo.urlPath,
    lang: pageInfo.lang,
    issueCount: issues.length,
    issues,
  };
}

async function main() {
  console.log('📋 페이지 목록 수집 중...');
  const pages = collectPages();
  console.log(`   총 ${pages.length}개 페이지 발견\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });

  const results = [];
  const totalBatches = Math.ceil(pages.length / PARALLEL_TABS);

  for (let i = 0; i < pages.length; i += PARALLEL_TABS) {
    const batch = pages.slice(i, i + PARALLEL_TABS);
    const batchNum = Math.floor(i / PARALLEL_TABS) + 1;
    console.log(`🔍 배치 ${batchNum}/${totalBatches}: ${batch.map(p => p.urlPath).join(', ')}`);
    const batchResults = await Promise.all(batch.map(p => auditPage(context, p)));
    results.push(...batchResults);
  }

  await browser.close();

  const totalIssues = results.reduce((s, r) => s + r.issueCount, 0);
  const pagesWithIssues = results.filter(r => r.issueCount > 0).length;

  // 심각도별 집계
  const bySeverity = { 'very-high': 0, high: 0, medium: 0 };
  for (const r of results) {
    for (const issue of r.issues) {
      bySeverity[issue.severity] = (bySeverity[issue.severity] || 0) + 1;
    }
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: pages.length,
      totalIssues,
      pagesWithIssues,
      bySeverity,
    },
    results,
  };

  fs.writeFileSync('qa-report.json', JSON.stringify(report, null, 2));

  console.log('\n✅ 감사 완료');
  console.log(`📊 ${pages.length}개 페이지 / 문제 ${totalIssues}건`);
  console.log(`   매우높음: ${bySeverity['very-high']} | 높음: ${bySeverity['high']} | 중간: ${bySeverity['medium']}`);
  console.log(`📁 qa-report.json 저장됨`);
  console.log(`📸 qa-screenshots/ (${pages.length}개)\n`);
  console.log('─'.repeat(50));
  console.log('문제 있는 페이지:');
  for (const r of results.filter(r => r.issueCount > 0)) {
    console.log(`  ${r.urlPath} → ${r.issues.map(i => i.type).join(', ')}`);
  }
}

main().catch(err => {
  console.error('❌ 감사 실패:', err.message);
  process.exit(1);
});
