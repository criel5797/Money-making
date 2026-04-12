'use strict';

function escapeHtml(input) {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createToolWrapper(toolId, toolName, category, availableLanguages, seoOptions) {
  seoOptions = seoOptions || {};

  // availableLanguages: { ko: boolean, en: boolean, ja: boolean }
  var defaultLang = availableLanguages.ko ? 'ko' : (availableLanguages.en ? 'en' : 'ja');
  var homeTexts = { ko: '홈', en: 'Home', ja: 'ホーム' };
  var defaultHomeText = homeTexts[defaultLang] || 'Home';

  var seoTitle = seoOptions.seoTitle || (toolName + ' - Free Online Tool');
  var seoDescription = seoOptions.seoDescription || ('Use the free ' + toolName + ' online. No signup required.');
  var canonicalPath = seoOptions.canonicalPath || '/';
  var keywords = seoOptions.keywords || '';
  var baseUrl = seoOptions.baseUrl || 'https://instaidea.org';
  var basePath = seoOptions.basePath || '';
  var sectionLabel = seoOptions.sectionLabel || 'Tools';
  var sectionPath = seoOptions.sectionPath || '/tools/';
  var sectionDirectoryPath = seoOptions.sectionDirectoryPath || '/tools/';
  var allPagesPath = seoOptions.allPagesPath || '/all-pages/';
  var faqItems = Array.isArray(seoOptions.faqItems) && seoOptions.faqItems.length
    ? seoOptions.faqItems
    : [
        { q: 'Is this tool free to use?', a: 'Yes, this tool is free and available directly in your browser.' },
        { q: 'Does this tool work on mobile?', a: 'Yes, both desktop and mobile browsers are supported.' },
        { q: 'Do I need an account?', a: 'No signup is required for basic usage.' }
      ];
  var relatedLinks = Array.isArray(seoOptions.relatedLinks) ? seoOptions.relatedLinks : [];
  var hubs = Array.isArray(seoOptions.hubLinks) ? seoOptions.hubLinks : [];
  var exampleCode = seoOptions.exampleCode || '';
  var navHref = function(p) { return basePath + p; };

  var schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: sectionLabel, item: baseUrl + sectionPath },
        { '@type': 'ListItem', position: 3, name: toolName, item: baseUrl + canonicalPath }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: toolName,
      url: baseUrl + canonicalPath,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: seoDescription
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(function(item) {
        return {
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a
          }
        };
      })
    }
  ];

  var langButtons = '';
  if (availableLanguages.ko) langButtons += '<button class="lang-btn" data-lang="ko">한국어</button>';
  if (availableLanguages.en) langButtons += '<button class="lang-btn" data-lang="en">English</button>';
  if (availableLanguages.ja) langButtons += '<button class="lang-btn" data-lang="ja">日本語</button>';

  var relatedHtml = relatedLinks.map(function(link) {
    return '<li><a href="' + escapeHtml(link.href) + '">' + escapeHtml(link.label) + '</a></li>';
  }).join('');

  var hubHtml = hubs.map(function(link) {
    return '<li><a href="' + escapeHtml(link.href) + '">' + escapeHtml(link.label) + '</a></li>';
  }).join('');

  var exampleBlock = '';
  if (exampleCode) {
    exampleBlock = '<h2>Example</h2><pre><code>' + escapeHtml(exampleCode) + '</code></pre>';
  }

  return `<!DOCTYPE html>
<html lang="${defaultLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(seoTitle)}</title>
  <meta name="description" content="${escapeHtml(seoDescription)}">
  ${keywords ? '<meta name=\"keywords\" content=\"' + escapeHtml(keywords) + '\">' : ''}
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(seoTitle)}">
  <meta property="og:description" content="${escapeHtml(seoDescription)}">
  <meta property="og:image" content="${escapeHtml(baseUrl)}/og-image.svg">
  <meta property="og:url" content="${escapeHtml(baseUrl)}${escapeHtml(canonicalPath)}">
  <meta property="og:site_name" content="InstaIdea">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(seoTitle)}">
  <meta name="twitter:description" content="${escapeHtml(seoDescription)}">
  <meta name="twitter:image" content="${escapeHtml(baseUrl)}/og-image.svg">
  <link rel="canonical" href="${escapeHtml(baseUrl)}${escapeHtml(canonicalPath)}">
  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      background: #f3f4f6;
      color: #111827;
      line-height: 1.65;
    }
    .tool-header {
      background: linear-gradient(135deg, #1d4ed8, #0f766e);
      padding: 12px 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .tool-nav { display: flex; gap: 12px; align-items: center; }
    .home-link {
      color: white;
      text-decoration: none;
      font-size: 14px;
      padding: 8px 16px;
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .home-link:hover { background: rgba(255,255,255,0.32); }
    .lang-switcher { display: flex; gap: 8px; }
    .lang-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
      font-size: 14px;
    }
    .lang-btn:hover { background: rgba(255,255,255,0.3); }
    .lang-btn.active { background: rgba(255,255,255,0.42); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

    .wrapper { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .hero {
      background: white;
      border-radius: 16px;
      padding: 22px;
      border: 1px solid #e5e7eb;
      margin-bottom: 16px;
    }
    .hero h1 { font-size: clamp(1.5rem, 3vw, 2.1rem); margin-bottom: 8px; color: #0f172a; }
    .hero p { color: #4b5563; font-size: 1rem; }
    .breadcrumb { margin-bottom: 8px; font-size: 13px; color: #6b7280; }
    .breadcrumb a { color: #2563eb; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    .tool-iframe {
      width: 100%;
      height: min(980px, calc(100vh - 220px));
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      display: block;
      background: white;
      margin-bottom: 18px;
    }

    .seo-block {
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      padding: 24px;
    }
    .seo-block h2 { margin: 14px 0 8px; font-size: 1.25rem; color: #111827; }
    .seo-block p, .seo-block li { color: #374151; }
    .seo-block ul, .seo-block ol { margin: 8px 0 14px 20px; }
    .seo-block pre {
      margin: 10px 0 16px;
      padding: 14px;
      border-radius: 10px;
      background: #111827;
      color: #e5e7eb;
      overflow: auto;
    }
    .seo-block a { color: #1d4ed8; text-decoration: none; }
    .seo-block a:hover { text-decoration: underline; }

    @media (max-width: 700px) {
      .tool-header { padding: 10px 15px; }
      .home-link, .lang-btn { padding: 6px 12px; font-size: 12px; }
      .wrapper { padding: 14px; }
      .hero, .seo-block { padding: 16px; }
      .tool-iframe { height: min(760px, calc(100vh - 250px)); }
    }
  </style>
</head>
<body>
  <div class="tool-header">
    <div class="tool-nav">
      <a href="${escapeHtml(navHref('/'))}" class="home-link">🏠 <span>${defaultHomeText}</span></a>
      <a href="${escapeHtml(navHref(sectionDirectoryPath))}" class="home-link">📚 <span>${escapeHtml(sectionLabel)}</span></a>
      <a href="${escapeHtml(navHref(allPagesPath))}" class="home-link">🗂 <span>Directory</span></a>
    </div>
    <div class="lang-switcher">
      ${langButtons}
    </div>
  </div>

  <main class="wrapper">
    <section class="hero">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="${escapeHtml(navHref('/'))}">Home</a> / <a href="${escapeHtml(navHref(sectionPath))}">${escapeHtml(sectionLabel)}</a> / <span>${escapeHtml(toolName)}</span>
      </nav>
      <h1>${escapeHtml(toolName)}</h1>
      <p>${escapeHtml(seoDescription)}</p>
    </section>

    <iframe id="toolFrame" class="tool-iframe" src="content-${defaultLang}.html" title="${escapeHtml(toolName)}"></iframe>

    <article class="seo-block">
      <h2>What is ${escapeHtml(toolName)}?</h2>
      <p>${escapeHtml(toolName)} is a browser-based utility you can use instantly. This page includes readable HTML text so search engines can understand the tool topic, intent, and usage scenarios beyond JavaScript UI rendering.</p>

      <h2>How to use</h2>
      <ol>
        <li>Open the tool interface above.</li>
        <li>Paste or enter your input data.</li>
        <li>Run the main action and review the output.</li>
        <li>Copy results or export them to your workflow.</li>
      </ol>

      <h2>Why this tool helps</h2>
      <p>Quick online tools reduce context switching when you need to solve a small task fast. Instead of opening desktop software or writing one-off scripts, you can complete the task in one tab and move on. This is especially useful for debugging, content editing, and repetitive conversions.</p>
      <p>Teams also use these pages as lightweight references. The same URL can be shared in onboarding docs, runbooks, and issue comments so everyone uses the same workflow. This reduces confusion, keeps output formats consistent, and helps new users complete tasks without extra setup.</p>

      <h2>Common use cases</h2>
      <ul>
        <li>Quick data cleanup before commit or deploy.</li>
        <li>Validation checks while debugging API responses.</li>
        <li>Generating formatted output for docs and tickets.</li>
        <li>Fast conversions during QA, support, or review tasks.</li>
      </ul>

      <h2>Performance and privacy notes</h2>
      <p>Most tasks run directly in the browser, which keeps turnaround time low for small and medium inputs. For sensitive data, avoid sharing raw secrets in any external environment and prefer local-safe workflows. Use this tool as a fast utility layer, then validate final output in your primary production pipeline.</p>

      ${exampleBlock}

      <h2>FAQ</h2>
      <p><strong>Is this tool free?</strong> Yes. It runs directly in the browser with no account required.</p>
      <p><strong>Does it work on mobile?</strong> Yes. The interface supports both desktop and mobile browsers.</p>
      <p><strong>Can I share this page?</strong> Yes. Use the URL in your docs, notes, or team chat.</p>

      ${relatedHtml ? '<h2>More Tools</h2><ul>' + relatedHtml + '</ul>' : ''}
      ${hubHtml ? '<h2>Browse Sections</h2><ul>' + hubHtml + '</ul>' : ''}
    </article>
  </main>

  <script>
    var currentLang = '${defaultLang}';
    var availableLangs = ${JSON.stringify(availableLanguages)};

    function switchToolLanguage(lang) {
      if (!availableLangs[lang]) {
        lang = availableLangs.ko ? 'ko' : (availableLangs.en ? 'en' : 'ja');
      }

      currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);

      var iframe = document.getElementById('toolFrame');
      var newSrc = 'content-' + lang + '.html';
      if (iframe.src.indexOf(newSrc) === -1) {
        iframe.src = newSrc;
      }

      document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
      });

      var homeTexts = { ko: '홈', en: 'Home', ja: 'ホーム' };
      document.querySelector('.home-link span').textContent = homeTexts[lang] || 'Home';
    }

    function hideIframeLanguageSwitcher() {
      try {
        var iframeDoc = document.getElementById('toolFrame').contentDocument ||
                        document.getElementById('toolFrame').contentWindow.document;
        var style = iframeDoc.createElement('style');
        style.textContent = [
          '.lang-switch,',
          '.lang-switcher,',
          '[class*="lang-btn"],',
          '[class*="language"],',
          'a[href*="index-ko.html"],',
          'a[href*="index-en.html"],',
          'a[href*="index-ja.html"],',
          'a[href*="index.html"][hreflang]{display:none!important;}'
        ].join('');
        iframeDoc.head.appendChild(style);
      } catch (e) {}
    }

    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchToolLanguage(this.getAttribute('data-lang'));
      });
    });

    document.getElementById('toolFrame').addEventListener('load', hideIframeLanguageSwitcher);

    window.addEventListener('load', function() {
      var savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && availableLangs[savedLang]) switchToolLanguage(savedLang);
      else switchToolLanguage(currentLang);
    });
  </script>
</body>
</html>`;
}

module.exports = createToolWrapper;
