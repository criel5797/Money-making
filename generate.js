'use strict';

var fs = require('fs');
var path = require('path');

// Import modules
var i18n = require('./src/i18n/index.js');
var toolContentI18n = require('./src/i18n/tools-content.js');
var games = require('./src/common/games.js');
var tools = require('./src/common/tools.js');
var webTools = tools.webTools;
var consumerTools = tools.consumerTools;
var createLayout = require('./src/common/layout.js').createLayout;

// Import game templates
var generateReactionGame = require('./src/templates/reaction-time.js');
var generateMemoryNumberGame = require('./src/templates/memory-number.js');
var generateTypingSpeedGame = require('./src/templates/typing-speed.js');
var generateColorMatchGame = require('./src/templates/color-match.js');
var generateMathQuizGame = require('./src/templates/math-quiz.js');
var generatePatternMemoryGame = require('./src/templates/pattern-memory.js');
var generateClickSpeedGame = require('./src/templates/click-speed.js');
var generateAimTrainerGame = require('./src/templates/aim-trainer.js');
var generateSequenceMemoryGame = require('./src/templates/sequence-memory.js');
var generateWordPuzzleGame = require('./src/templates/word-puzzle.js');
var generateVisualMemoryGame = require('./src/templates/visual-memory.js');
var generateStroopTestGame = require('./src/templates/stroop-test.js');
var generateVerbalMemoryGame = require('./src/templates/verbal-memory.js');
var generateChimpTestGame = require('./src/templates/chimp-test.js');
var generateHearingTestGame = require('./src/templates/hearing-test.js');
var generateColorBlindTestGame = require('./src/templates/color-blind-test.js');
var generateNumberSpeedGame = require('./src/templates/number-speed.js');
var generateTargetTrackerGame = require('./src/templates/target-tracker.js');

var OUT = path.join(process.cwd(), 'dist');

var RAW_BASE_URL = (process.env.BASE_URL || 'https://instaidea.org').replace(/\/+$/, '');
var parsedBaseUrl = new URL(RAW_BASE_URL);
var BASE_ORIGIN = parsedBaseUrl.origin;

var repoEnv = (process.env.GITHUB_REPOSITORY || '');
var repoName = repoEnv.split('/')[1] || '';
var autoBasePath = repoName ? '/' + repoName : '';
var BASE_PATH = process.env.BASE_PATH || parsedBaseUrl.pathname.replace(/\/$/, '') || autoBasePath || '';
if (BASE_PATH === '/') BASE_PATH = '';
if (BASE_PATH && BASE_PATH.charAt(0) !== '/') BASE_PATH = '/' + BASE_PATH;
BASE_PATH = BASE_PATH.replace(/\/+$/, '');
var BASE_URL = BASE_ORIGIN + BASE_PATH;

var ADS_CLIENT = process.env.MONETAG_SITE_ID || '';
var PUB_ID = ADS_CLIENT.replace('ca-pub-', '');
var SITE_HOST = parsedBaseUrl.hostname;

function dedupeById(items) {
  var seen = {};
  var unique = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var id = item && item.id;
    if (!id) {
      unique.push(item);
      continue;
    }
    if (seen[id]) {
      console.warn('[build] Skipping duplicate catalog id: ' + id);
      continue;
    }
    seen[id] = true;
    unique.push(item);
  }
  return unique;
}

games = dedupeById(games);
webTools = dedupeById(webTools);
consumerTools = dedupeById(consumerTools);

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function write(p, c){ ensureDir(path.dirname(p)); fs.writeFileSync(p, c); }
function href(p){ return BASE_PATH + p; }
function absUrl(p){ return BASE_URL + p; }
function safeText(v, fallback){ return (v && String(v).trim()) || fallback || ''; }
function escapeHtml(v){
  return String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pickDefaultToolLanguage(availableLanguages) {
  if (availableLanguages.ko) return 'ko';
  if (availableLanguages.en) return 'en';
  if (availableLanguages.ja) return 'ja';
  return 'en';
}

function getToolLocaleFilename(lang, defaultLang) {
  return lang === defaultLang ? 'index.html' : 'index-' + lang + '.html';
}

function getToolLocalePath(canonicalPath, lang, defaultLang) {
  return canonicalPath + (lang === defaultLang ? '' : ('index-' + lang + '.html'));
}

function getLocaleOpenGraphValue(lang) {
  if (lang === 'ko') return 'ko_KR';
  if (lang === 'ja') return 'ja_JP';
  return 'en_US';
}

function ensureHtmlLang(content, lang) {
  var text = String(content || '');
  if (/<html\b[^>]*\blang=["'][^"']*["']/i.test(text)) {
    return text.replace(/(<html\b[^>]*\blang=["'])[^"']*(["'][^>]*>)/i, '$1' + lang + '$2');
  }
  if (/<html\b/i.test(text)) {
    return text.replace(/<html\b([^>]*)>/i, '<html lang="' + lang + '"$1>');
  }
  return text;
}

function buildAlternateHreflangTags(canonicalPath, availableLanguages, defaultLang) {
  var tags = [];
  ['ko', 'en', 'ja'].forEach(function(lang) {
    if (!availableLanguages[lang]) return;
    tags.push(
      '<link rel="alternate" hreflang="' + lang + '" href="' +
      escapeHtml(absUrl(getToolLocalePath(canonicalPath, lang, defaultLang))) +
      '">'
    );
  });

  tags.push(
    '<link rel="alternate" hreflang="x-default" href="' +
    escapeHtml(absUrl(getToolLocalePath(canonicalPath, defaultLang, defaultLang))) +
    '">'
  );

  return tags.join('');
}

function injectToolContentSeo(content, options) {
  options = options || {};
  var canonicalPath = options.canonicalPath || '/';
  var lang = options.lang || 'en';
  var availableLanguages = options.availableLanguages || {};
  var defaultLang = options.defaultLang || pickDefaultToolLanguage(availableLanguages);
  var pagePath = getToolLocalePath(canonicalPath, lang, defaultLang);
  var canonical = escapeHtml(absUrl(pagePath));
  var altTags = buildAlternateHreflangTags(canonicalPath, availableLanguages, defaultLang);
  var ogLocale = getLocaleOpenGraphValue(lang);
  var ogAlternateTags = ['ko', 'en', 'ja'].filter(function(locale) {
    return availableLanguages[locale] && locale !== lang;
  }).map(function(locale) {
    return '<meta property="og:locale:alternate" content="' + getLocaleOpenGraphValue(locale) + '">';
  }).join('');

  content = ensureHtmlLang(content, lang);
  content = String(content || '')
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/ig, '')
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/ig, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/ig, '')
    .replace(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:locale(?::alternate)?["'][^>]*>/ig, '');

  var seoTags = '' +
    '<meta name="robots" content="index,follow,max-image-preview:large">' +
    '<link rel="canonical" href="' + canonical + '">' +
    '<meta property="og:url" content="' + canonical + '">' +
    '<meta property="og:locale" content="' + ogLocale + '">' +
    ogAlternateTags +
    altTags;

  if (/<head[^>]*>/i.test(content)) {
    return content.replace(/<head[^>]*>/i, function(match) {
      return match + seoTags;
    });
  }

  return '<!doctype html><html lang="' + lang + '"><head>' + seoTags + '</head><body>' + content + '</body></html>';
}

function injectBeforeClosingTag(content, closingTag, injection) {
  var normalizedTag = String(closingTag || '').toLowerCase();
  var text = String(content || '');

  if (normalizedTag === '</head>') {
    var headMatch = /<\/head>/i.exec(text);
    if (headMatch && typeof headMatch.index === 'number') {
      return text.slice(0, headMatch.index) + injection + text.slice(headMatch.index);
    }
    return text + injection;
  }

  if (normalizedTag === '</body>') {
    var bodyBeforeHtmlMatch = /<\/body>(\s*<\/html>\s*)$/i.exec(text);
    if (bodyBeforeHtmlMatch && typeof bodyBeforeHtmlMatch.index === 'number') {
      return text.slice(0, bodyBeforeHtmlMatch.index) + injection + text.slice(bodyBeforeHtmlMatch.index);
    }
  }

  var idx = text.lastIndexOf(closingTag);
  if (idx === -1) return text + injection;
  return text.slice(0, idx) + injection + text.slice(idx);
}

function countRegexMatches(content, pattern) {
  var matches = String(content || '').match(pattern);
  return matches ? matches.length : 0;
}

function hasSeverelyCorruptedText(content) {
  return countRegexMatches(content, /\uFFFD/g) >= 20 ||
    countRegexMatches(content, /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) >= 20;
}

function readToolSourceContent(srcFile, logLabel) {
  var content = fs.readFileSync(srcFile, 'utf8');
  if (hasSeverelyCorruptedText(content)) {
    console.warn('[build] Skipping corrupted tool source: ' + logLabel);
    return null;
  }
  return content;
}

function buildLegacyToolLinkMap(sourceFileByLang, availableLanguages, hasIndexHtml, defaultLang) {
  var linkMap = {};
  Object.keys(sourceFileByLang).forEach(function(lang) {
    if (sourceFileByLang[lang]) {
      linkMap[sourceFileByLang[lang]] = getToolLocaleFilename(lang, defaultLang);
    }
  });

  if (hasIndexHtml && !linkMap['index.html']) {
    if (availableLanguages.ko) linkMap['index.html'] = getToolLocaleFilename('ko', defaultLang);
    else if (availableLanguages.en) linkMap['index.html'] = getToolLocaleFilename('en', defaultLang);
    else if (availableLanguages.ja) linkMap['index.html'] = getToolLocaleFilename('ja', defaultLang);
  }

  return linkMap;
}

function rewriteLegacyToolLinks(content, linkMap) {
  return String(content || '').replace(/((?:href|src)=["'])(index(?:-(?:ko|en|ja))?\.html)([^"']*)(["'])/ig, function(match, prefix, target, suffix, quote) {
    var rewritten = linkMap[target];
    if (!rewritten) return match;
    return prefix + rewritten + suffix + quote;
  });
}

function buildGameSeoTitle(game) {
  var keyword = safeText(game && game.title && game.title.en, 'Brain Training Game');
  return keyword + ' - Check Your Score Free Online';
}

function buildGameSeoDescription(game) {
  var keyword = safeText(game && game.title && game.title.en, 'Brain Training Game');
  var teaser = safeText(game && game.description && game.description.en, 'Train your brain with this free online game.');
  return keyword + ' - ' + teaser + ' Play free online, track your best score, and improve with practical tips.';
}

function buildToolSeoTitle(tool) {
  var keyword = safeText(tool && tool.title && tool.title.en, 'Online Tool');
  return keyword + ' - Free Online ' + keyword + ' Tool';
}

function buildToolSeoDescription(tool, categoryLabel) {
  var keyword = safeText(tool && tool.title && tool.title.en, 'online tool');
  var purpose = safeText(tool && tool.desc && tool.desc.en, 'fast browser-based utility');
  return 'Use ' + keyword + ' online for free. ' + purpose + '. No install, no signup, and optimized for desktop and mobile. Category: ' + categoryLabel + '.';
}

function buildLocalizedToolSitemapEntries(canonicalPath, availableLanguages, defaultLang, priority) {
  var entries = [];
  ['ko', 'en', 'ja'].forEach(function(lang) {
    if (!availableLanguages[lang]) return;
    entries.push({
      url: getToolLocalePath(canonicalPath, lang, defaultLang),
      priority: priority,
      changefreq: 'monthly'
    });
  });
  return entries;
}

function buildGameAverageGuide(gameId, category) {
  if (gameId === 'reaction-time') return 'Most people score between 200 and 300 milliseconds on desktop. Under 200ms is considered fast.';
  if (gameId === 'click-speed') return 'Most players land around 5 to 8 CPS. Competitive players often reach 10+ CPS with good rhythm.';
  if (gameId === 'typing-speed') return 'Average typing speed is around 40 WPM. A practical target is 60+ WPM with consistent accuracy.';
  if (gameId === 'memory-number') return 'Many players can remember 6 to 8 digits at first. Regular practice can push this range higher.';
  if (category === 'memory') return 'Memory scores improve quickly when practice is frequent and session length is short but consistent.';
  if (category === 'reaction') return 'Reaction-based games reward stable focus and repeated short attempts instead of long sessions.';
  if (category === 'speed') return 'Speed scores usually jump after players improve rhythm, reduce hesitation, and keep movements simple.';
  return 'Performance varies by device, screen size, and experience level. Use your own trend as the main benchmark.';
}

function getRecommendedGames(currentGame, count) {
  count = count || 6;
  var sameCategory = games.filter(function(item) {
    return item.id !== currentGame.id && item.category === currentGame.category;
  });
  var fallback = games.filter(function(item) {
    return item.id !== currentGame.id && item.category !== currentGame.category;
  });
  return sameCategory.concat(fallback).slice(0, count);
}

function buildGameSeoContent(game, faqs) {
  if (!game) return '';

  var title = safeText(game.title.en, game.id);
  var summary = safeText(game.description.en, 'Free online brain training game.');
  var averageGuide = buildGameAverageGuide(game.id, game.category);
  var relatedGames = getRecommendedGames(game, 6);

  var relatedList = relatedGames.map(function(item) {
    var label = safeText(item.title.en, item.id);
    return '<li><a href=\"' + href('/games/' + item.id + '/') + '\">' + escapeHtml(label) + '</a></li>';
  }).join('');

  var faqHtml = '';
  for (var i = 0; i < faqs.length; i++) {
    faqHtml += '<h3>' + escapeHtml(faqs[i].q) + '</h3><p>' + escapeHtml(faqs[i].a) + '</p>';
  }

  return '' +
    '<section class=\"seo-content\" aria-label=\"Game guide content\">' +
      '<h2>What is ' + escapeHtml(title) + '?</h2>' +
      '<p>' + escapeHtml(title) + ' is a free browser game designed for fast, repeatable practice. ' + escapeHtml(summary) + ' The goal is to give you instant feedback so you can improve over multiple short sessions instead of relying on one long attempt.</p>' +
      '<p>This page includes a playable test plus a complete guide section so both users and search engines can understand the purpose of the game. The content explains scoring, average performance ranges, training strategy, and common questions players ask before they start.</p>' +

      '<h2>Average Human Performance</h2>' +
      '<p>' + escapeHtml(averageGuide) + ' Results can change based on input device, screen latency, browser performance, and whether you are playing on mobile or desktop. Use your own baseline first, then compare each new session against your recent best and average.</p>' +
      '<p>Consistent improvement is usually more meaningful than one peak score. Track your trend for at least a week with short daily sessions. Most players see better consistency when they practice in focused blocks and avoid distractions between attempts.</p>' +

      '<h2>How to Improve Your Score</h2>' +
      '<ol>' +
        '<li>Warm up with 3 to 5 easy attempts before chasing a personal best.</li>' +
        '<li>Use a stable posture and keep your hand movement minimal.</li>' +
        '<li>Prioritize accuracy first, then increase speed gradually.</li>' +
        '<li>Play short sessions daily instead of one long weekly session.</li>' +
        '<li>Review your average score and not only your single best result.</li>' +
      '</ol>' +

      '<h2>Why This Test Is Useful</h2>' +
      '<p>Fast reaction and decision games are useful for anyone who wants to train focus, timing, and input control. Students, gamers, and office workers can all use these tests as short concentration drills during breaks. Because the game runs in the browser, there is no installation barrier and no account friction.</p>' +
      '<p>Another benefit is repeatability. You can run the same test on different days and compare performance under similar conditions. This makes it easy to track progress and identify which habits lead to improvement.</p>' +

      '<h2>FAQ</h2>' +
      faqHtml +

      '<h2>More Brain Tests</h2>' +
      '<ul>' + relatedList + '</ul>' +

      '<h2>Browse by Topic</h2>' +
      '<ul>' +
        '<li><a href=\"' + href('/games/') + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + href('/tools/web/') + '\">Web Developer Tools</a></li>' +
        '<li><a href=\"' + href('/tools/fun/') + '\">Daily Utility Tools</a></li>' +
        '<li><a href=\"' + href('/dev-tools/') + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + href('/utilities/') + '\">Utilities & Fun Tools</a></li>' +
        '<li><a href=\"' + href('/all-pages/') + '\">Site Directory</a></li>' +
      '</ul>' +
    '</section>';
}

function buildHubLinksForTools() {
  return [
    { href: href('/games/'), label: 'Brain Training Games' },
    { href: href('/tools/web/'), label: 'All Web Developer Tools' },
    { href: href('/tools/fun/'), label: 'All Utility Tools' },
    { href: href('/dev-tools/'), label: 'Developer Tools' },
    { href: href('/utilities/'), label: 'Utilities & Fun Tools' },
    { href: href('/all-pages/'), label: 'Full Site Directory' }
  ];
}

function getRelatedTools(toolId, pool, pathPrefix, count) {
  count = count || 6;
  var result = [];
  for (var i = 0; i < pool.length; i++) {
    if (pool[i].id === toolId) continue;
    result.push({
      href: href(pathPrefix + pool[i].id + '/'),
      label: safeText(pool[i].title.en, pool[i].id)
    });
    if (result.length >= count) break;
  }
  return result;
}

function getToolExample(toolId) {
  if (toolId === 'json-formatter') return '{\"name\":\"test\",\"age\":20}';
  if (toolId === 'regex-tester') return 'Pattern: ^[a-z0-9_]{3,16}$\\nText: user_name_01';
  if (toolId === 'base64-tool') return 'input: Hello World\\noutput: SGVsbG8gV29ybGQ=';
  if (toolId === 'timestamp-converter') return '1700000000 -> 2023-11-14 22:13:20 UTC';
  return 'Input example\\nOutput example';
}

function buildHubPageBody(title, subtitle, intro, items, pathPrefix, actionLabel) {
  var cards = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    cards += '' +
      '<div class=\"game-card\">' +
        '<div class=\"game-emoji\">' + item.emoji + '</div>' +
        '<div class=\"game-title\">' + escapeHtml(safeText(item.title.en, item.id)) + '</div>' +
        '<div class=\"game-description\">' + escapeHtml(safeText(item.description && item.description.en, safeText(item.desc && item.desc.en, 'Free online tool'))) + '</div>' +
        '<a href=\"' + href(pathPrefix + item.id + '/') + '\" class=\"play-btn\">' + escapeHtml(actionLabel) + '</a>' +
      '</div>';
  }

  return '' +
    '<div class=\"header-section\">' +
      '<h1>' + escapeHtml(title) + '</h1>' +
      '<p style=\"text-align:center;font-size:18px;margin:12px 0;opacity:0.95\">' + escapeHtml(subtitle) + '</p>' +
    '</div>' +
    '<section class=\"seo-content\">' +
      '<h2>About This Section</h2>' +
      '<p>' + escapeHtml(intro) + '</p>' +
      '<p>Each page includes playable or usable functionality and a readable guide section. This structure improves crawlability, helps users compare options faster, and creates stronger topical clusters for search engines.</p>' +
      '<p>Instead of isolated pages, this hub groups related tools and games under a clear topic. Search crawlers can follow category links, understand the domain focus, and connect detailed pages back to a central overview. That improves internal link equity distribution and makes indexing more consistent.</p>' +
      '<h2>How to Use This Hub Effectively</h2>' +
      '<ol>' +
        '<li>Start with one target task and open 2-3 relevant pages in separate tabs.</li>' +
        '<li>Use each page guide to compare use cases and pick the best fit.</li>' +
        '<li>Save frequently used pages to your workflow docs or bookmarks.</li>' +
        '<li>Return regularly to track newly added tools in the same category.</li>' +
      '</ol>' +
      '<h2>FAQ</h2>' +
      '<p><strong>Are all pages free?</strong> Yes, each page is free to access in a web browser.</p>' +
      '<p><strong>Do pages work on mobile?</strong> Yes, pages are responsive and support mobile and desktop.</p>' +
      '<p><strong>How are pages organized?</strong> Pages are clustered by topic so both users and search engines can navigate the site structure more clearly.</p>' +
      '<ul>' +
        '<li><a href=\"' + href('/games/') + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + href('/dev-tools/') + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + href('/utilities/') + '\">Utilities & Fun Tools</a></li>' +
      '</ul>' +
    '</section>' +
    '<div class=\"grid\">' + cards + '</div>';
}

// ===== JSON-LD Structured Data Generators =====

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'InstaIdea - Mini Games & Tools',
    'alternateName': ['Mini Games & Tools', 'InstaIdea'],
    'url': absUrl('/'),
    'description': 'Free brain training games, developer tools, and fun utilities',
    'inLanguage': ['ko', 'en', 'ja'],
    'potentialAction': {
      '@type': 'SearchAction',
      'target': absUrl('/?q={search_term_string}'),
      'query-input': 'required name=search_term_string'
    }
  };
}

function buildItemListSchema(items, listName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': listName,
    'numberOfItems': items.length,
    'itemListElement': items.map(function(item, idx) {
      return {
        '@type': 'ListItem',
        'position': idx + 1,
        'name': item.name,
        'url': item.url
      };
    })
  };
}

function buildBreadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map(function(c, idx) {
      return {
        '@type': 'ListItem',
        'position': idx + 1,
        'name': c.name,
        'item': c.url
      };
    })
  };
}

function buildGameSchema(game, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': game.title.en || game.title.ko,
    'alternateName': [game.title.ko, game.title.ja].filter(Boolean),
    'url': absUrl(pathname),
    'applicationCategory': 'Game',
    'operatingSystem': 'Any',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'inLanguage': ['ko', 'en', 'ja'],
    'browserRequirements': 'Requires JavaScript',
    'description': game.description.en || game.description.ko
  };
}

function buildToolSchema(tool, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.title.en || tool.title.ko,
    'alternateName': [tool.title.ko, tool.title.ja].filter(Boolean),
    'url': absUrl(pathname),
    'applicationCategory': 'Utility',
    'operatingSystem': 'Any',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'inLanguage': ['ko', 'en', 'ja'],
    'browserRequirements': 'Requires JavaScript',
    'description': tool.desc.en || tool.desc.ko
  };
}

function buildFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(function(faq) {
      return {
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      };
    })
  };
}

// ===== Related Content Builder =====

function buildRelatedSection(currentId, allItems, type, count) {
  count = count || 4;
  // Pick items excluding current, shuffle-like with deterministic pick
  var others = allItems.filter(function(item) { return item.id !== currentId; });
  // Deterministic but varied: use currentId hash-ish approach
  var hash = 0;
  for (var i = 0; i < currentId.length; i++) hash = ((hash << 5) - hash) + currentId.charCodeAt(i);
  hash = Math.abs(hash);
  var picked = [];
  for (var i = 0; i < count && others.length > 0; i++) {
    var idx = (hash + i * 7) % others.length;
    picked.push(others.splice(idx, 1)[0]);
  }

  var basePaths = { game: '/games/', webTool: '/tools/web/', funTool: '/tools/fun/' };
  var bp = basePaths[type] || '/games/';

  var cards = '';
  for (var i = 0; i < picked.length; i++) {
    var item = picked[i];
    var itemTitle = item.title || {};
    var itemDesc = item.description || item.desc || {};
    var relData = JSON.stringify({ title: itemTitle, desc: itemDesc });
    cards +=
      '<a href="' + href(bp + item.id + '/') + '" class="related-card" data-related=\'' + relData + '\'>' +
      '<div class="related-emoji">' + item.emoji + '</div>' +
      '<div class="related-title" data-i18n-related-title>' + (itemTitle.ko || '') + '</div>' +
      '<div class="related-desc" data-i18n-related-desc>' + (itemDesc.ko || '') + '</div>' +
      '</a>';
  }

  var sectionTitle = type === 'game' ? 'More Brain Tests' : 'More Useful Tools';

  return '<section class="related-section">' +
    '<h2 data-i18n-related-heading>' + sectionTitle + '</h2>' +
    '<div class="related-grid">' + cards + '</div>' +
    '<script>' +
    '(function(){' +
    'var origSet=setLanguage;' +
    'setLanguage=function(lang){' +
    'origSet(lang);' +
    'document.querySelectorAll("[data-related]").forEach(function(card){' +
    'var d=JSON.parse(card.getAttribute("data-related"));' +
    'var t=card.querySelector("[data-i18n-related-title]");' +
    'var desc=card.querySelector("[data-i18n-related-desc]");' +
    'if(t&&d.title&&d.title[lang])t.textContent=d.title[lang];' +
    'if(desc&&d.desc&&d.desc[lang])desc.textContent=d.desc[lang];' +
    '});' +
    'var h=document.querySelector("[data-i18n-related-heading]");' +
    'if(h){' +
    'var headings={ko:"' + sectionTitle + '",en:"' + (type === 'game' ? 'More Brain Tests' : 'More Useful Tools') + '",ja:"' + (type === 'game' ? 'More Brain Tests' : 'More Useful Tools') + '"};' +
    'h.textContent=headings[lang]||headings.ko;' +
    '}' +
    '};' +
    'setLanguage(currentLang);' +
    '})();' +
    '</script>' +
    '</section>';
}

// ===== FAQ Data for Games =====

var gameFAQs = {
  'reaction-time': [
    { q: 'How do I test my reaction time?', a: 'Click the start button, wait for the screen to turn green, then click as fast as you can. Your reaction time in milliseconds will be displayed.' },
    { q: 'What is a good reaction time?', a: 'Average human reaction time is around 200-250ms. Under 200ms is considered fast, and under 150ms is exceptional.' },
    { q: 'Is this test free?', a: 'Yes, this reaction time test is completely free to use with no registration required.' }
  ],
  'memory-number': [
    { q: 'How does the number memory test work?', a: 'A sequence of numbers is displayed briefly. You need to remember and type them in the correct order. The sequence gets longer each round.' },
    { q: 'How can I improve my number memory?', a: 'Practice chunking numbers into groups, create associations, and practice regularly. Most people can remember 7짹2 digits.' },
    { q: 'Is this test free?', a: 'Yes, this number memory test is completely free with no signup needed.' }
  ],
  'typing-speed': [
    { q: 'How is typing speed measured?', a: 'Typing speed is measured in WPM (Words Per Minute). A word is defined as 5 characters. Your accuracy percentage is also tracked.' },
    { q: 'What is a good typing speed?', a: 'Average typing speed is 40 WPM. 60-80 WPM is good, and over 100 WPM is considered fast.' },
    { q: 'Can I practice in different languages?', a: 'Yes, this test supports Korean, English, and Japanese typing practice.' }
  ],
  'color-match': [
    { q: 'What is the color match game?', a: 'You see a color word displayed in a different color. You must quickly decide if the text meaning matches the display color.' },
    { q: 'What does this test measure?', a: 'This is based on the Stroop Effect and measures your cognitive processing speed and ability to handle conflicting information.' },
    { q: 'Is it free to play?', a: 'Yes, completely free with no registration required.' }
  ],
  'math-quiz': [
    { q: 'What types of math problems are included?', a: 'The quiz includes addition, subtraction, multiplication, and division with increasing difficulty levels.' },
    { q: 'How does the difficulty increase?', a: 'Problems start simple and progressively use larger numbers and more complex operations as you advance.' },
    { q: 'Is this suitable for children?', a: 'Yes, the starting level is simple enough for children and gradually increases in difficulty.' }
  ],
  'click-speed': [
    { q: 'How is CPS calculated?', a: 'CPS (Clicks Per Second) is calculated by dividing total clicks by the time duration (10 seconds).' },
    { q: 'What is a good CPS score?', a: 'Average CPS is 6-7. A CPS of 10+ is considered fast, and 14+ is exceptional.' },
    { q: 'Can I use this on mobile?', a: 'Yes, this test works on both desktop and mobile devices with touch support.' }
  ],
  'aim-trainer': [
    { q: 'How does the aim trainer work?', a: 'Targets appear at random positions on screen. Click them as quickly as possible. Your average reaction time and accuracy are tracked.' },
    { q: 'Will this improve my gaming aim?', a: 'Regular practice can improve hand-eye coordination and mouse accuracy, which translates to better gaming performance.' },
    { q: 'Is this free to use?', a: 'Yes, this aim trainer is completely free with no downloads required.' }
  ]
};

// Default FAQ for games without specific FAQs
var defaultGameFAQ = [
  { q: 'Is this brain training game free?', a: 'Yes, all our brain training games are completely free to play with no registration or download required.' },
  { q: 'Does this game work on mobile?', a: 'Yes, all games are optimized for both desktop and mobile devices with responsive design.' },
  { q: 'Can I track my progress?', a: 'Yes, your best scores are automatically saved in your browser so you can track improvement over time.' }
];

// Game helper functions
function getGameTitle(gameId) {
  var game = games.find(function(g) { return g.id === gameId; });
  return game ? game.title : {};
}

function getGameTitleScript(gameId, emoji) {
  var title = getGameTitle(gameId);
  return (
    '<script>' +
    'window.gameTitle=' + JSON.stringify(title) + ';' +
    'window.titleEmoji="' + emoji + '";' +
    '</script>'
  );
}

// Layout wrapper using the createLayout function from layout.js
function layout(title, pathname, body, includeAdScript, description, jsonLd, relatedContent) {
  return createLayout({
    title: title,
    description: description || title + ' - 무료 미니게임 모음집. 뇌훈련, 개발자 도구, 유틸리티를 즐겨보세요!',
    pathname: pathname,
    body: body,
    includeAdScript: includeAdScript,
    monetagSiteId: ADS_CLIENT,
    basePath: BASE_PATH,
    baseUrl: BASE_URL,
    i18nData: i18n,
    jsonLd: jsonLd,
    relatedContent: relatedContent || ''
  });
}

// Game generation wrappers that call template modules
var templateOptions = {
  getGameTitle: getGameTitle,
  getGameTitleScript: getGameTitleScript
};

// Generic game wrapper with JSON-LD, FAQ, and related content
function wrapGame(gameId, generateFn, koTitle, description) {
  var gameHTML = generateFn(templateOptions);
  var game = games.find(function(g) { return g.id === gameId; });
  var pathname = '/games/' + gameId + '/';

  // Build JSON-LD array: BreadcrumbList + WebApplication + FAQPage
  var breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: absUrl('/') },
    { name: 'Games', url: absUrl('/games/') },
    { name: game ? (game.title.en || game.title.ko) : koTitle, url: absUrl(pathname) }
  ]);
  var appSchema = game ? buildGameSchema(game, pathname) : null;
  var faqs = gameFAQs[gameId] || defaultGameFAQ;
  var faqSchema = buildFAQSchema(faqs);

  var jsonLdArr = [breadcrumb];
  if (appSchema) jsonLdArr.push(appSchema);
  jsonLdArr.push(faqSchema);

  var seoContent = buildGameSeoContent(game, faqs);
  var body = gameHTML + seoContent;
  var related = buildRelatedSection(gameId, games, 'game', 6);
  related += '' +
    '<section class=\"related-section\">' +
      '<h2>Browse More Categories</h2>' +
      '<div class=\"related-grid\">' +
        '<a href=\"' + href('/games/') + '\" class=\"related-card\"><div class=\"related-emoji\">Games</div><div class=\"related-title\">Brain Training Games</div><div class=\"related-desc\">All reaction, memory, speed, and focus tests</div></a>' +
        '<a href=\"' + href('/dev-tools/') + '\" class=\"related-card\"><div class=\"related-emoji\">Dev</div><div class=\"related-title\">Developer Tools</div><div class=\"related-desc\">Formatter, converter, validator, and builder tools</div></a>' +
        '<a href=\"' + href('/utilities/') + '\" class=\"related-card\"><div class=\"related-emoji\">Util</div><div class=\"related-title\">Utilities & Fun</div><div class=\"related-desc\">Daily tools, calculators, and practical helpers</div></a>' +
      '</div>' +
    '</section>';

  var pageTitle = game ? buildGameSeoTitle(game) : (koTitle + ' - Free Online Game');
  var pageDescription = game ? buildGameSeoDescription(game) : description;

  return layout(pageTitle, pathname, body, true, pageDescription, jsonLdArr, related);
}

function wrapReactionGame() {
  return wrapGame(
    'reaction-time',
    generateReactionGame,
    'Reaction Time Test',
    'Test how quickly you react to a visual signal and improve your average response time.'
  );
}

function wrapMemoryNumberGame() {
  return wrapGame(
    'memory-number',
    generateMemoryNumberGame,
    'Number Memory Test',
    'Memorize increasingly longer numbers and train short-term memory.'
  );
}

function wrapTypingSpeedGame() {
  return wrapGame(
    'typing-speed',
    generateTypingSpeedGame,
    'Typing Speed Test',
    'Measure typing speed in WPM with accuracy tracking and repeat practice.'
  );
}

function wrapColorMatchGame() {
  return wrapGame(
    'color-match',
    generateColorMatchGame,
    'Color Match Test',
    'Train focus and processing speed by matching text meaning and color.'
  );
}

function wrapMathQuizGame() {
  return wrapGame(
    'math-quiz',
    generateMathQuizGame,
    'Math Quiz Game',
    'Solve mental math questions under time pressure and improve calculation speed.'
  );
}

function wrapPatternMemoryGame() {
  return wrapGame(
    'pattern-memory',
    generatePatternMemoryGame,
    'Pattern Memory Test',
    'Remember visual patterns and repeat them correctly to advance levels.'
  );
}

function wrapClickSpeedGame() {
  return wrapGame(
    'click-speed',
    generateClickSpeedGame,
    'Click Speed Test',
    'Measure how many clicks per second you can perform in a timed challenge.'
  );
}

function wrapAimTrainerGame() {
  return wrapGame(
    'aim-trainer',
    generateAimTrainerGame,
    'Aim Trainer',
    'Practice target tracking, mouse control, and fast click accuracy.'
  );
}

function wrapSequenceMemoryGame() {
  return wrapGame(
    'sequence-memory',
    generateSequenceMemoryGame,
    'Sequence Memory Test',
    'Remember and repeat number sequences in the correct order.'
  );
}

function wrapWordPuzzleGame() {
  return wrapGame(
    'word-puzzle',
    generateWordPuzzleGame,
    'Word Puzzle Game',
    'Create valid words from letter sets and improve vocabulary recall.'
  );
}

function wrapVisualMemoryGame() {
  return wrapGame(
    'visual-memory',
    generateVisualMemoryGame,
    'Visual Memory Test',
    'Memorize tile positions and test your visual recall under pressure.'
  );
}

function wrapStroopTestGame() {
  return wrapGame(
    'stroop-test',
    generateStroopTestGame,
    'Stroop Test',
    'Test cognitive flexibility by identifying color under conflicting text cues.'
  );
}

function wrapVerbalMemoryGame() {
  return wrapGame(
    'verbal-memory',
    generateVerbalMemoryGame,
    'Verbal Memory Test',
    'Decide whether words are new or previously seen to train verbal recall.'
  );
}

function wrapChimpTestGame() {
  return wrapGame(
    'chimp-test',
    generateChimpTestGame,
    'Chimp Test',
    'Challenge short-term sequence memory with disappearing number targets.'
  );
}

function wrapHearingTestGame() {
  return wrapGame(
    'hearing-test',
    generateHearingTestGame,
    'Hearing Test',
    'Check the highest audible frequency you can hear in a quick browser test.'
  );
}

function wrapColorBlindTestGame() {
  return wrapGame(
    'color-blind-test',
    generateColorBlindTestGame,
    'Color Blind Test',
    'Find subtle color differences and assess color perception performance.'
  );
}

function wrapNumberSpeedGame() {
  return wrapGame(
    'number-speed',
    generateNumberSpeedGame,
    'Number Speed Test',
    'Choose larger numbers quickly and improve comparison speed.'
  );
}

function wrapTargetTrackerGame() {
  return wrapGame(
    'target-tracker',
    generateTargetTrackerGame,
    'Target Tracker',
    'Track a moving target and test hand-eye coordination in real time.'
  );
}

// Main page generation
function renderIndex(){
  var gameList = '';
  for (var i = 0; i < games.length; i++) {
    var g = games[i];
    var gameData = JSON.stringify({
      title: g.title,
      description: g.description,
      category: g.category
    });
    gameList +=
      '<div class="game-card" data-game=\'' + gameData + '\'>' +
      '<div class="game-emoji">' + g.emoji + '</div>' +
      '<span class="game-category" data-i18n-category="' + g.category + '">' + i18n.ko.categories[g.category] + '</span>' +
      '<div class="game-title" data-i18n-game-title>' + g.title.ko + '</div>' +
      '<div class="game-description" data-i18n-game-desc>' + g.description.ko + '</div>' +
      '<a href="' + href('/games/' + g.id + '/') + '" class="play-btn" data-i18n="playBtn">플레이하기 →</a>' +
      '</div>';
  }

  // Generate web tools cards
  var webToolsList = '';
  for (var i = 0; i < webTools.length; i++) {
    var t = webTools[i];
    var toolData = JSON.stringify({
      title: t.title,
      desc: t.desc
    });
    webToolsList +=
      '<div class="game-card" data-tool=\'' + toolData + '\'>' +
      '<div class="game-emoji">' + t.emoji + '</div>' +
      '<div class="game-title" data-i18n-tool-title>' + t.title.ko + '</div>' +
      '<div class="game-description" data-i18n-tool-desc>' + t.desc.ko + '</div>' +
      '<a href="' + href('/tools/web/' + t.id + '/') + '" class="play-btn" data-i18n="useBtn">사용하기 →</a>' +
      '</div>';
  }

  // Generate consumer tools cards
  var consumerToolsList = '';
  for (var i = 0; i < consumerTools.length; i++) {
    var t = consumerTools[i];
    var toolData = JSON.stringify({
      title: t.title,
      desc: t.desc
    });
    consumerToolsList +=
      '<div class="game-card" data-tool=\'' + toolData + '\'>' +
      '<div class="game-emoji">' + t.emoji + '</div>' +
      '<div class="game-title" data-i18n-tool-title>' + t.title.ko + '</div>' +
      '<div class="game-description" data-i18n-tool-desc>' + t.desc.ko + '</div>' +
      '<a href="' + href('/tools/fun/' + t.id + '/') + '" class="play-btn" data-i18n="useBtn">사용하기 →</a>' +
      '</div>';
  }

  var totalCount = games.length + webTools.length + consumerTools.length;

  var body =
    '<div class="header-section">' +
    '<h1 data-i18n="mainTitle">🎮 미니게임 & 도구 모음집</h1>' +
    '<p style="text-align:center;font-size:20px;margin:16px 0;font-weight:500" data-i18n="mainDesc">재미있는 게임과 유용한 도구로 일상을 더 풍요롭게 만드세요!</p>' +
    '<p id="total-count" style="text-align:center;font-size:16px;margin:8px 0;opacity:0.9" data-count="' + totalCount + '">총 ' + totalCount + '개의 재미있는 도구가 준비되어 있습니다</p>' +
    '</div>' +
    '<section class="seo-content">' +
    '<h2>Explore by Directory</h2>' +
    '<p>Use section directories to find tools faster and help crawlers understand topic clusters.</p>' +
    '<ul>' +
    '<li><a href="' + href('/tools/web/') + '">Web Developer Tools Directory</a></li>' +
    '<li><a href="' + href('/tools/fun/') + '">Utility Tools Directory</a></li>' +
    '<li><a href="' + href('/all-pages/') + '">Full Site Directory</a></li>' +
    '</ul>' +
    '</section>' +

    // Games Section
    '<div style="margin:40px 0 20px">' +
    '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px" data-i18n="gamesSection">🎮 두뇌 훈련 게임</h2>' +
    '<p style="text-align:center;color:#94a3b8;margin-bottom:30px" data-i18n="gamesSectionDesc">반응속도, 기억력, 집중력을 테스트하세요!</p>' +
    '</div>' +
    '<div class="grid">' + gameList + '</div>' +

    // Web Tools Section
    '<div style="margin:60px 0 20px">' +
    '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px" data-i18n="webToolsSection">🛠️ 개발자 도구</h2>' +
    '<p style="text-align:center;color:#94a3b8;margin-bottom:30px" data-i18n="webToolsSectionDesc">개발과 디자인에 유용한 도구들</p>' +
    '</div>' +
    '<div class="grid">' + webToolsList + '</div>' +

    // Consumer Tools Section
    '<div style="margin:60px 0 20px">' +
    '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px" data-i18n="funToolsSection">✨ 재미 & 유틸리티</h2>' +
    '<p style="text-align:center;color:#94a3b8;margin-bottom:30px" data-i18n="funToolsSectionDesc">운세, 계산기, 테스트 등 다양한 도구</p>' +
    '</div>' +
    '<div class="grid">' + consumerToolsList + '</div>' +
    '<script>' +
    'window.addEventListener("load",function(){' +
    'var originalSetLanguage=setLanguage;' +
    'setLanguage=function(lang){' +
    'originalSetLanguage(lang);' +
    'var count=document.getElementById("total-count").getAttribute("data-count");' +
    'document.getElementById("total-count").textContent=i18nData[lang].totalCount.replace("{count}",count);' +
    'document.querySelectorAll(".game-card[data-game]").forEach(function(card){' +
    'var data=JSON.parse(card.getAttribute("data-game"));' +
    'card.querySelector("[data-i18n-game-title]").textContent=data.title[lang];' +
    'card.querySelector("[data-i18n-game-desc]").textContent=data.description[lang];' +
    'var catEl=card.querySelector("[data-i18n-category]");' +
    'var cat=catEl.getAttribute("data-i18n-category");' +
    'catEl.textContent=i18nData[lang].categories[cat];' +
    '});' +
    'document.querySelectorAll(".game-card[data-tool]").forEach(function(card){' +
    'var data=JSON.parse(card.getAttribute("data-tool"));' +
    'card.querySelector("[data-i18n-tool-title]").textContent=data.title[lang];' +
    'card.querySelector("[data-i18n-tool-desc]").textContent=data.desc[lang];' +
    '});' +
    '};' +
    'setLanguage(currentLang);' +
    '});' +
    '</script>';

  // Build homepage JSON-LD
  var websiteSchema = buildWebSiteSchema();
  var gameItems = games.map(function(g) { return { name: g.title.en || g.title.ko, url: absUrl('/games/' + g.id + '/') }; });
  var webToolItems = webTools.map(function(t) { return { name: t.title.en || t.title.ko, url: absUrl('/tools/web/' + t.id + '/') }; });
  var funToolItems = consumerTools.map(function(t) { return { name: t.title.en || t.title.ko, url: absUrl('/tools/fun/' + t.id + '/') }; });
  var gameListSchema = buildItemListSchema(gameItems, 'Brain Training Games');
  var webToolListSchema = buildItemListSchema(webToolItems, 'Developer Tools');
  var funToolListSchema = buildItemListSchema(funToolItems, 'Fun & Utility Tools');
  var coreHubSchema = buildItemListSchema([
    { name: 'Online Tools Directory', url: absUrl('/tools/') },
    { name: 'Brain Training Games', url: absUrl('/games/') },
    { name: 'Developer Tools', url: absUrl('/dev-tools/') },
    { name: 'Utilities & Fun Tools', url: absUrl('/utilities/') },
    { name: 'Web Developer Tools Directory', url: absUrl('/tools/web/') },
    { name: 'Utility Tools Directory', url: absUrl('/tools/fun/') },
    { name: 'Full Site Directory', url: absUrl('/all-pages/') }
  ], 'Site Hub Pages');
  var homeJsonLd = [websiteSchema, coreHubSchema, gameListSchema, webToolListSchema, funToolListSchema];

  write(path.join(OUT, 'index.html'), layout('미니게임 & 도구 모음집 - 무료 게임, 개발자 도구, 유틸리티', '/', body, true,
    '무료 미니게임, 개발자 도구, 유용한 유틸리티 모음집 - ' + totalCount + '개 이상의 게임과 도구를 즐겨보세요!',
    homeJsonLd));
}

// Privacy Policy 페이지 생성

function renderSectionHubs() {
  var gameItems = games.map(function(g) {
    return { name: safeText(g.title.en, g.id), url: absUrl('/games/' + g.id + '/') };
  });
  var webToolItems = webTools.map(function(t) {
    return { name: safeText(t.title.en, t.id), url: absUrl('/tools/web/' + t.id + '/') };
  });
  var utilityItems = consumerTools.map(function(t) {
    return { name: safeText(t.title.en, t.id), url: absUrl('/tools/fun/' + t.id + '/') };
  });
  var toList = function(items, pathPrefix) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
      html += '<li><a href="' + href(pathPrefix + items[i].id + '/') + '">' + escapeHtml(safeText(items[i].title.en, items[i].id)) + '</a></li>';
    }
    return html;
  };

  var gamesBody = buildHubPageBody(
    'Brain Training Games',
    games.length + '+ Free Online Brain Tests',
    'Explore reaction time, memory, focus, and speed games in one place. Every game is playable instantly and includes score tracking so you can monitor progress over time.',
    games,
    '/games/',
    'Play Now'
  );
  write(
    path.join(OUT, 'games', 'index.html'),
    layout(
      'Brain Training Games - 50+ Free Online Brain Tests',
      '/games/',
      gamesBody,
      true,
      'Play free brain training games online. Test reaction time, memory, focus, and speed with score tracking and improvement guides.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Brain Training Games', url: absUrl('/games/') }
        ]),
        buildCollectionPageSchema('Brain Training Games', '/games/', 'Free browser games for reaction, memory, focus, and speed training.'),
        buildItemListSchema(gameItems, 'Brain Training Games')
      ]
    )
  );

  var devToolsBody = buildHubPageBody(
    'Developer Tools',
    webTools.length + '+ Free Browser Tools',
    'Use practical developer tools for formatting, encoding, validation, generation, and quick debugging tasks. Each tool opens instantly and works in-browser.',
    webTools,
    '/tools/web/',
    'Open Tool'
  );
  write(
    path.join(OUT, 'dev-tools', 'index.html'),
    layout(
      'Developer Tools - Free Online Formatter, Converter, and Validator Tools',
      '/dev-tools/',
      devToolsBody,
      true,
      'Explore free developer tools online: JSON formatter, regex tester, hash generator, converters, and more.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Tools', url: absUrl('/tools/') },
          { name: 'Developer Tools', url: absUrl('/dev-tools/') }
        ]),
        buildCollectionPageSchema('Developer Tools', '/dev-tools/', 'Formatters, validators, generators, and converters for developers.'),
        buildItemListSchema(webToolItems, 'Developer Tools')
      ]
    )
  );

  var utilityBody = buildHubPageBody(
    'Utilities & Fun Tools',
    consumerTools.length + '+ Free Daily Utilities',
    'Find practical daily tools such as timers, calculators, productivity helpers, and lightweight fun tools. This section is built for quick tasks and repeat use.',
    consumerTools,
    '/tools/fun/',
    'Open Utility'
  );
  write(
    path.join(OUT, 'utilities', 'index.html'),
    layout(
      'Utilities - Free Online Daily Utility Tools',
      '/utilities/',
      utilityBody,
      true,
      'Browse free utility tools for daily use, productivity, and quick calculations.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Tools', url: absUrl('/tools/') },
          { name: 'Utilities', url: absUrl('/utilities/') }
        ]),
        buildCollectionPageSchema('Utilities & Fun Tools', '/utilities/', 'Daily utility tools for productivity, reminders, and quick tasks.'),
        buildItemListSchema(utilityItems, 'Utilities & Fun Tools')
      ]
    )
  );

  var webDirectoryBody = buildHubPageBody(
    'Web Developer Tools',
    webTools.length + '+ Technical Tools',
    'Browse all developer-focused browser tools in a single directory. This page groups formatting, encoding, conversion, and validation workflows for quick access.',
    webTools,
    '/tools/web/',
    'Open Tool'
  );
  write(
    path.join(OUT, 'tools', 'web', 'index.html'),
    layout(
      'Web Developer Tools - Complete Online Tools Directory',
      '/tools/web/',
      webDirectoryBody,
      true,
      'Browse all web developer tools including formatters, converters, validators, and generators in one directory.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Tools', url: absUrl('/tools/') },
          { name: 'Web Developer Tools', url: absUrl('/tools/web/') }
        ]),
        buildCollectionPageSchema('Web Developer Tools', '/tools/web/', 'Directory of browser-based web development tools.'),
        buildItemListSchema(webToolItems, 'Web Developer Tools')
      ]
    )
  );

  var funDirectoryBody = buildHubPageBody(
    'Utility Tools Directory',
    consumerTools.length + '+ Everyday Tools',
    'Browse all utility and lifestyle-friendly tools in one place. This directory covers calculators, organizers, reminders, and daily helper tools.',
    consumerTools,
    '/tools/fun/',
    'Open Utility'
  );
  write(
    path.join(OUT, 'tools', 'fun', 'index.html'),
    layout(
      'Utility Tools Directory - Free Everyday Online Tools',
      '/tools/fun/',
      funDirectoryBody,
      true,
      'Browse all free utility tools for daily workflows, planning, and quick calculations.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Tools', url: absUrl('/tools/') },
          { name: 'Utility Tools', url: absUrl('/tools/fun/') }
        ]),
        buildCollectionPageSchema('Utility Tools Directory', '/tools/fun/', 'Directory of daily utility and productivity tools.'),
        buildItemListSchema(utilityItems, 'Utility Tools Directory')
      ]
    )
  );

  var toolsOverviewBody = '' +
    '<div class=\"header-section\">' +
      '<h1>Online Tools Directory</h1>' +
      '<p style=\"text-align:center;font-size:18px;margin:12px 0;opacity:0.95\">Developer tools and daily utilities in one place</p>' +
    '</div>' +
    '<section class=\"seo-content\">' +
      '<h2>Tools Categories</h2>' +
      '<p>This directory separates technical tools and everyday utilities into clear categories. Use Developer Tools for formatting, parsing, testing, and conversion workflows. Use Utilities for calculators, timers, and practical daily helpers.</p>' +
      '<ul>' +
        '<li><a href=\"' + href('/tools/web/') + '\">Web Developer Tools Directory</a></li>' +
        '<li><a href=\"' + href('/tools/fun/') + '\">Utility Tools Directory</a></li>' +
        '<li><a href=\"' + href('/dev-tools/') + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + href('/utilities/') + '\">Utilities & Fun Tools</a></li>' +
        '<li><a href=\"' + href('/games/') + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + href('/all-pages/') + '\">Full Site Directory</a></li>' +
      '</ul>' +
      '<h2>Why This Structure Matters</h2>' +
      '<p>Category hubs help users navigate quickly and help search engines understand topical relevance. This improves crawl efficiency and makes it easier to rank long-tail queries for specific tool intents.</p>' +
    '</section>';

  write(
    path.join(OUT, 'tools', 'index.html'),
    layout(
      'Online Tools Directory - Developer Tools and Utilities',
      '/tools/',
      toolsOverviewBody,
      true,
      'Explore online developer tools and utilities with structured category navigation.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Tools', url: absUrl('/tools/') }
        ]),
        buildCollectionPageSchema('Online Tools Directory', '/tools/', 'Top-level tools directory for developer and utility categories.'),
        buildItemListSchema(webToolItems, 'Developer Tools'),
        buildItemListSchema(utilityItems, 'Utilities & Fun Tools')
      ]
    )
  );

  var allPagesBody = '' +
    '<div class=\"header-section\">' +
      '<h1>Full Site Directory</h1>' +
      '<p style=\"text-align:center;font-size:18px;margin:12px 0;opacity:0.95\">Browse every major page by section</p>' +
    '</div>' +
    '<section class=\"seo-content\">' +
      '<h2>Why this page exists</h2>' +
      '<p>This directory gives users and crawlers a complete internal link map. It improves discoverability for deep pages and reinforces topical clusters across games, developer tools, and utility tools.</p>' +
      '<p>Use this page to jump directly to any section or tool type. All major hubs and detail pages are grouped below for efficient navigation.</p>' +
      '<h2>Core Hubs</h2>' +
      '<ul>' +
        '<li><a href=\"' + href('/') + '\">Home</a></li>' +
        '<li><a href=\"' + href('/tools/') + '\">Online Tools Directory</a></li>' +
        '<li><a href=\"' + href('/games/') + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + href('/dev-tools/') + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + href('/utilities/') + '\">Utilities & Fun Tools</a></li>' +
        '<li><a href=\"' + href('/tools/web/') + '\">Web Developer Tools Directory</a></li>' +
        '<li><a href=\"' + href('/tools/fun/') + '\">Utility Tools Directory</a></li>' +
      '</ul>' +
      '<h2>All Brain Training Games</h2>' +
      '<ul>' + toList(games, '/games/') + '</ul>' +
      '<h2>All Web Developer Tools</h2>' +
      '<ul>' + toList(webTools, '/tools/web/') + '</ul>' +
      '<h2>All Utility Tools</h2>' +
      '<ul>' + toList(consumerTools, '/tools/fun/') + '</ul>' +
    '</section>';

  var allPageLinks = [{ name: 'Home', url: absUrl('/') }]
    .concat(gameItems)
    .concat(webToolItems)
    .concat(utilityItems);

  write(
    path.join(OUT, 'all-pages', 'index.html'),
    layout(
      'Full Site Directory - Games, Developer Tools, and Utilities',
      '/all-pages/',
      allPagesBody,
      true,
      'Complete directory of games, developer tools, and utilities with categorized internal links.',
      [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl('/') },
          { name: 'Full Site Directory', url: absUrl('/all-pages/') }
        ]),
        buildCollectionPageSchema('Full Site Directory', '/all-pages/', 'Complete internal links page for all major sections and tools.'),
        buildItemListSchema(allPageLinks, 'Full Site Directory')
      ]
    )
  );
}
function renderPrivacy() {
  var privacy = i18n.ko.privacy;
  var privacyMeta = {
    ko: {
      title: i18n.ko.privacy.title + ' - Mini Games & Tools',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    en: {
      title: i18n.en.privacy.title + ' - Mini Games & Tools',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    ja: {
      title: i18n.ja.privacy.title + ' - Mini Games & Tools',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    }
  };
  var today = new Date().toISOString().split('T')[0];
  var body =
    '<h1 data-i18n-privacy="heading">' + escapeHtml(privacy.heading) + '</h1>' +
    '<div class="game-card">' +
    '<h3 style="color:#333" data-i18n-privacy="section1Title">' + escapeHtml(privacy.section1Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section1Desc">' + escapeHtml(privacy.section1Desc) + '</p>' +
    '<ul style="color:#555">' +
    '<li data-i18n-privacy="section1Item1">' + escapeHtml(privacy.section1Item1) + '</li>' +
    '<li data-i18n-privacy="section1Item2">' + escapeHtml(privacy.section1Item2) + '</li>' +
    '<li data-i18n-privacy="section1Item3">' + escapeHtml(privacy.section1Item3) + '</li>' +
    '<li data-i18n-privacy="section1Item4">' + escapeHtml(privacy.section1Item4) + '</li>' +
    '</ul>' +
    '<h3 style="color:#333" data-i18n-privacy="section2Title">' + escapeHtml(privacy.section2Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section2Desc1">' + escapeHtml(privacy.section2Desc1) + '</p>' +
    '<p style="color:#555"><span data-i18n-privacy="section2Desc2">' + escapeHtml(privacy.section2Desc2) + '</span> <a href="https://www.google.com/settings/ads" style="color:#667eea" target="_blank" rel="noopener" data-i18n-privacy="section2Link">' + escapeHtml(privacy.section2Link) + '</a></p>' +
    '<h3 style="color:#333" data-i18n-privacy="section3Title">' + escapeHtml(privacy.section3Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section3Desc">' + escapeHtml(privacy.section3Desc) + '</p>' +
    '<h3 style="color:#333" data-i18n-privacy="section4Title">' + escapeHtml(privacy.section4Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section4Desc">' + escapeHtml(privacy.section4Desc) + '</p>' +
    '<ul style="color:#555">' +
    '<li data-i18n-privacy="section4Item1">' + escapeHtml(privacy.section4Item1) + '</li>' +
    '<li data-i18n-privacy="section4Item2">' + escapeHtml(privacy.section4Item2) + '</li>' +
    '</ul>' +
    '<h3 style="color:#333" data-i18n-privacy="section5Title">' + escapeHtml(privacy.section5Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section5Desc">' + escapeHtml(privacy.section5Desc) + '</p>' +
    '<h3 style="color:#333" data-i18n-privacy="section6Title">' + escapeHtml(privacy.section6Title) + '</h3>' +
    '<p style="color:#555"><span data-i18n-privacy="section6Desc">' + escapeHtml(privacy.section6Desc) + '</span> <a href="mailto:pjhk579700@naver.com" style="color:#667eea">pjhk579700@naver.com</a></p>' +
    '<h3 style="color:#333" data-i18n-privacy="section7Title">' + escapeHtml(privacy.section7Title) + '</h3>' +
    '<p style="color:#555" data-i18n-privacy="section7Desc">' + escapeHtml(privacy.section7Desc) + '</p>' +
    '<p style="color:#555"><span data-i18n-privacy="lastUpdate">' + escapeHtml(privacy.lastUpdate) + '</span>' + today + '</p>' +
    '</div>' +
    '<script>' +
    'window.addEventListener("load",function(){' +
    'var origSetLang=setLanguage;' +
    'var meta=' + JSON.stringify(privacyMeta) + ';' +
    'setLanguage=function(lang){' +
    'origSetLang(lang);' +
    'if(i18nData[lang]&&i18nData[lang].privacy){' +
    'var p=i18nData[lang].privacy;' +
    'document.querySelectorAll("[data-i18n-privacy]").forEach(function(el){' +
    'var key=el.getAttribute("data-i18n-privacy");' +
    'if(p[key])el.textContent=p[key];' +
    '});' +
    'if(meta[lang]){' +
    'document.title=meta[lang].title;' +
    'document.querySelectorAll(\'meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]\').forEach(function(el){el.setAttribute("content",meta[lang].description);});' +
    'document.querySelectorAll(\'meta[property="og:title"],meta[name="twitter:title"]\').forEach(function(el){el.setAttribute("content",meta[lang].title);});' +
    '}' +
    '}' +
    '};' +
    'setLanguage(currentLang);' +
    '});' +
    '</script>';

  write(path.join(OUT, 'privacy', 'index.html'), layout(privacyMeta.ko.title, '/privacy/', body, false, privacyMeta.ko.description));
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  var entries = fs.readdirSync(src, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var srcPath = path.join(src, entry.name);
    var destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function findDuplicateIds(items) {
  var counts = {};
  var duplicates = [];
  for (var i = 0; i < items.length; i++) {
    var id = items[i].id;
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] === 2) duplicates.push(id);
  }
  return duplicates;
}

function findUncataloguedToolDirs(srcRoot, catalog) {
  if (!fs.existsSync(srcRoot)) return [];
  var known = {};
  for (var i = 0; i < catalog.length; i++) {
    known[catalog[i].id] = true;
  }

  return fs.readdirSync(srcRoot, { withFileTypes: true })
    .filter(function(entry) {
      return entry.isDirectory() && !known[entry.name];
    })
    .map(function(entry) {
      return entry.name;
    })
    .filter(function(dirName) {
      var dirPath = path.join(srcRoot, dirName);
      return fs.readdirSync(dirPath).some(function(file) {
        return /^index.*\.html$/i.test(file);
      });
    });
}

function validateCatalogs() {
  var issues = [];
  var duplicateGames = findDuplicateIds(games);
  var duplicateWebTools = findDuplicateIds(webTools);
  var duplicateConsumerTools = findDuplicateIds(consumerTools);

  if (duplicateGames.length) issues.push('Duplicate game ids: ' + duplicateGames.join(', '));
  if (duplicateWebTools.length) issues.push('Duplicate web tool ids: ' + duplicateWebTools.join(', '));
  if (duplicateConsumerTools.length) issues.push('Duplicate consumer tool ids: ' + duplicateConsumerTools.join(', '));

  var uncataloguedWebTools = findUncataloguedToolDirs(path.join(process.cwd(), 'src', 'external-tools', 'web'), webTools);
  var uncataloguedConsumerTools = findUncataloguedToolDirs(path.join(process.cwd(), 'src', 'external-tools', 'fun'), consumerTools);

  if (uncataloguedWebTools.length) issues.push('Uncatalogued web tool directories: ' + uncataloguedWebTools.join(', '));
  if (uncataloguedConsumerTools.length) issues.push('Uncatalogued consumer tool directories: ' + uncataloguedConsumerTools.join(', '));

  if (issues.length) {
    throw new Error('Catalog validation failed:\n- ' + issues.join('\n- '));
  }
}

// Create tool wrapper with language switching
var createToolWrapper = require('./src/templates/tool-wrapper.js');

function buildToolWrapperOptions(toolId, toolData, toolType) {
  var isWebTool = toolType === 'webTool';
  var pathPrefix = isWebTool ? '/tools/web/' : '/tools/fun/';
  var pool = isWebTool ? webTools : consumerTools;
  var categoryLabel = isWebTool ? 'Developer Tools' : 'Utilities & Fun Tools';
  var keyword = safeText(toolData && toolData.title && toolData.title.en, toolId);
  var faqItems = [
    { q: 'What is ' + keyword + '?', a: keyword + ' is a browser-based tool for fast, repeatable tasks with no installation.' },
    { q: 'How do I use this tool?', a: 'Open the interface, paste input, run the action, then copy or export the result.' },
    { q: 'Is this tool free and mobile-friendly?', a: 'Yes. It is free to use and supports modern desktop and mobile browsers.' }
  ];

  return {
    seoTitle: buildToolSeoTitle(toolData),
    seoDescription: buildToolSeoDescription(toolData, categoryLabel),
    canonicalPath: pathPrefix + toolId + '/',
    baseUrl: BASE_URL,
    basePath: BASE_PATH,
    sectionLabel: categoryLabel,
    sectionPath: isWebTool ? '/dev-tools/' : '/utilities/',
    sectionDirectoryPath: pathPrefix,
    allPagesPath: '/all-pages/',
    keywords: keyword + ', free online tool, ' + (isWebTool ? 'developer tool' : 'utility tool'),
    faqItems: faqItems,
    relatedLinks: getRelatedTools(toolId, pool, pathPrefix, 6),
    hubLinks: buildHubLinksForTools(),
    exampleCode: getToolExample(toolId)
  };
}

function buildCollectionPageSchema(name, pathname, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': name,
    'url': absUrl(pathname),
    'description': description,
    'inLanguage': ['ko', 'en', 'ja']
  };
}

function processToolDirectory(srcPath, destPath, toolId, toolData, toolType) {
  if (!fs.existsSync(srcPath)) return;

  ensureDir(destPath);
  var pathPrefix = toolType === 'webTool' ? '/tools/web/' : '/tools/fun/';
  var canonicalPath = pathPrefix + toolId + '/';

  // Check if we have centralized i18n data for this tool
  var i18nData = toolContentI18n[toolId];

  if (i18nData) {
    // New Logic: Generate content files using language-specific source files
    var handlerPath = href('/common/tool-i18n-handler.js');
    var shareModalPath = href('/common/share-modal.js');
    var handlerScript = '<script src="' + shareModalPath + '"></script><script src="' + handlerPath + '"></script>';
    var availableLanguages = { ko: false, en: false, ja: false };
    var sourceFileByLang = {};
    var localizedSources = [];

    // Generate for each language using its dedicated source file
    ['ko', 'en', 'ja'].forEach(function(lang) {
      // Priority: index-{lang}.html > index.html (for ko) > index.html (fallback)
      var sourceFile = null;
      var langFile = 'index-' + lang + '.html';

      if (fs.existsSync(path.join(srcPath, langFile))) {
        sourceFile = langFile;
      } else if (lang === 'ko' && fs.existsSync(path.join(srcPath, 'index-ko.html'))) {
        sourceFile = 'index-ko.html';
      } else if (lang === 'ko' && fs.existsSync(path.join(srcPath, 'index.html'))) {
        // For Korean, index.html can be used as fallback
        sourceFile = 'index.html';
      }

      if (sourceFile && fs.existsSync(path.join(srcPath, sourceFile))) {
        var rawContent = readToolSourceContent(path.join(srcPath, sourceFile), toolType + ':' + toolId + ':' + lang);
        if (!rawContent) return;
        sourceFileByLang[lang] = sourceFile;
        localizedSources.push({ lang: lang, content: rawContent });
        availableLanguages[lang] = true;
      }
    });

    if (!(availableLanguages.ko || availableLanguages.en || availableLanguages.ja)) {
      return null;
    }

    var defaultLang = pickDefaultToolLanguage(availableLanguages);
    var localizedLinkMap = buildLegacyToolLinkMap(sourceFileByLang, availableLanguages, fs.existsSync(path.join(srcPath, 'index.html')), defaultLang);

    localizedSources.forEach(function(entry) {
      var content = rewriteLegacyToolLinks(entry.content, localizedLinkMap);
      content = injectToolContentSeo(content, {
        canonicalPath: canonicalPath,
        lang: entry.lang,
        availableLanguages: availableLanguages,
        defaultLang: defaultLang
      });
      var contentWithHandler = injectBeforeClosingTag(content, '</body>', handlerScript);
      var injection = '<script>window.currentLang="' + entry.lang + '";window.toolI18n=' + JSON.stringify(i18nData) + ';</script>';
      var finalContent = injectBeforeClosingTag(contentWithHandler, '</head>', injection);
      fs.writeFileSync(path.join(destPath, getToolLocaleFilename(entry.lang, defaultLang)), finalContent);
    });

    // Copy other assets
    var localizedFiles = fs.readdirSync(srcPath);
    localizedFiles.forEach(function(file) {
      if (!file.match(/^index.*\.html$/)) {
        var s = path.join(srcPath, file);
        var d = path.join(destPath, file);
        if (fs.statSync(s).isDirectory()) copyDir(s, d);
        else fs.copyFileSync(s, d);
      }
    });

    return {
      availableLanguages: availableLanguages,
      defaultLang: defaultLang
    };
  }

  // Fallback to legacy logic (copying individual files)
  var files = fs.readdirSync(srcPath);
  var availableLanguages = { ko: false, en: false, ja: false };
  var languageFiles = {};

  // Detect language files
  files.forEach(function(file) {
    if (file === 'index.html') {
      languageFiles.default = file;
    } else if (file === 'index-ko.html') {
      languageFiles.ko = file;
    } else if (file === 'index-en.html') {
      languageFiles.en = file;
    } else if (file === 'index-ja.html') {
      languageFiles.ja = file;
    }
  });

  // Determine default file language
  if (languageFiles.default) {
    if (!languageFiles.ko && !languageFiles.en && !languageFiles.ja) {
      // Only index.html exists - assume Korean
      languageFiles.ko = languageFiles.default;
    } else if (languageFiles.en && !languageFiles.ko) {
      // index.html + index-en.html -> index.html is probably Korean
      languageFiles.ko = languageFiles.default;
    } else if (!languageFiles.en && !languageFiles.ko) {
      // Use as fallback
      languageFiles.ko = languageFiles.default;
    }
  }

  var legacySources = [];
  var sourceFileByLang = {};

  // Copy all language files with renamed filenames
  Object.keys(languageFiles).forEach(function(lang) {
    if (lang === 'default') return;
    var srcFile = path.join(srcPath, languageFiles[lang]);
    if (fs.existsSync(srcFile)) {
      var legacyContent = readToolSourceContent(srcFile, toolType + ':' + toolId + ':' + lang);
      if (!legacyContent) return;
      availableLanguages[lang] = true;
      sourceFileByLang[lang] = languageFiles[lang];
      legacySources.push({ lang: lang, content: legacyContent });
    }
  });

  if (!(availableLanguages.ko || availableLanguages.en || availableLanguages.ja)) {
    console.warn('[build] Skipping tool with no valid localized content: ' + toolType + ':' + toolId);
    return null;
  }

  var defaultLang = pickDefaultToolLanguage(availableLanguages);
  var legacyLinkMap = buildLegacyToolLinkMap(sourceFileByLang, availableLanguages, !!languageFiles.default, defaultLang);

  legacySources.forEach(function(entry) {
    var destFile = path.join(destPath, getToolLocaleFilename(entry.lang, defaultLang));
    var legacyContent = rewriteLegacyToolLinks(entry.content, legacyLinkMap);
    fs.writeFileSync(destFile, injectToolContentSeo(legacyContent, {
      canonicalPath: canonicalPath,
      lang: entry.lang,
      availableLanguages: availableLanguages,
      defaultLang: defaultLang
    }));
  });

  // Copy other files (not index*.html)
  files.forEach(function(file) {
    if (!file.match(/^index.*\.html$/)) {
      var srcFile = path.join(srcPath, file);
      var destFile = path.join(destPath, file);
      var stat = fs.statSync(srcFile);
      if (stat.isFile()) {
        fs.copyFileSync(srcFile, destFile);
      } else if (stat.isDirectory()) {
        copyDir(srcFile, destFile);
      }
    }
  });

  return {
    availableLanguages: availableLanguages,
    defaultLang: defaultLang
  };
}

function build(){
  validateCatalogs();
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // 硫붿씤 ?섏씠吏 ?앹꽦
  renderIndex();

  // Topic hub pages
  renderSectionHubs();

  // Privacy Policy ?섏씠吏 ?앹꽦
  renderPrivacy();

  // 媛?寃뚯엫 ?섏씠吏 ?앹꽦
  write(path.join(OUT, 'games', 'reaction-time', 'index.html'), wrapReactionGame());
  write(path.join(OUT, 'games', 'memory-number', 'index.html'), wrapMemoryNumberGame());
  write(path.join(OUT, 'games', 'typing-speed', 'index.html'), wrapTypingSpeedGame());
  write(path.join(OUT, 'games', 'color-match', 'index.html'), wrapColorMatchGame());
  write(path.join(OUT, 'games', 'math-quiz', 'index.html'), wrapMathQuizGame());
  write(path.join(OUT, 'games', 'pattern-memory', 'index.html'), wrapPatternMemoryGame());
  write(path.join(OUT, 'games', 'click-speed', 'index.html'), wrapClickSpeedGame());
  write(path.join(OUT, 'games', 'aim-trainer', 'index.html'), wrapAimTrainerGame());
  write(path.join(OUT, 'games', 'sequence-memory', 'index.html'), wrapSequenceMemoryGame());
  write(path.join(OUT, 'games', 'word-puzzle', 'index.html'), wrapWordPuzzleGame());
  write(path.join(OUT, 'games', 'visual-memory', 'index.html'), wrapVisualMemoryGame());
  write(path.join(OUT, 'games', 'stroop-test', 'index.html'), wrapStroopTestGame());
  write(path.join(OUT, 'games', 'verbal-memory', 'index.html'), wrapVerbalMemoryGame());
  write(path.join(OUT, 'games', 'chimp-test', 'index.html'), wrapChimpTestGame());
  write(path.join(OUT, 'games', 'hearing-test', 'index.html'), wrapHearingTestGame());
  write(path.join(OUT, 'games', 'color-blind-test', 'index.html'), wrapColorBlindTestGame());
  write(path.join(OUT, 'games', 'number-speed', 'index.html'), wrapNumberSpeedGame());
  write(path.join(OUT, 'games', 'target-tracker', 'index.html'), wrapTargetTrackerGame());

  // Process Web Tools with language switching
  var webToolsSrc = path.join(process.cwd(), 'src', 'external-tools', 'web');
  var webToolEntries = [];
  
  // Copy common JS files (tool-i18n-handler.js, share-modal.js)
  var commonDest = path.join(OUT, 'common');
  ensureDir(commonDest);
  var commonFiles = ['tool-i18n-handler.js', 'share-modal.js'];
  commonFiles.forEach(function(file) {
    var srcFile = path.join(process.cwd(), 'src', 'common', file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, path.join(commonDest, file));
    }
  });

  if (fs.existsSync(webToolsSrc)) {
    for (var i = 0; i < webTools.length; i++) {
      var tool = webTools[i];
      var srcPath = path.join(webToolsSrc, tool.id);
      var destPath = path.join(OUT, 'tools', 'web', tool.id);
      if (fs.existsSync(srcPath)) {
        var webToolBuild = processToolDirectory(srcPath, destPath, tool.id, tool, 'webTool');
        if (webToolBuild) {
          webToolEntries = webToolEntries.concat(
            buildLocalizedToolSitemapEntries('/tools/web/' + tool.id + '/', webToolBuild.availableLanguages, webToolBuild.defaultLang, '0.7')
          );
        }
      }
    }
  }

  // Process Consumer Tools with language switching
  var consumerToolsSrc = path.join(process.cwd(), 'src', 'external-tools', 'fun');
  var funToolEntries = [];
  if (fs.existsSync(consumerToolsSrc)) {
    for (var i = 0; i < consumerTools.length; i++) {
      var tool = consumerTools[i];
      var srcPath = path.join(consumerToolsSrc, tool.id);
      var destPath = path.join(OUT, 'tools', 'fun', tool.id);
      if (fs.existsSync(srcPath)) {
        var funToolBuild = processToolDirectory(srcPath, destPath, tool.id, tool, 'funTool');
        if (funToolBuild) {
          funToolEntries = funToolEntries.concat(
            buildLocalizedToolSitemapEntries('/tools/fun/' + tool.id + '/', funToolBuild.availableLanguages, funToolBuild.defaultLang, '0.6')
          );
        }
      }
    }
  }

  // ===== Enhanced Sitemap with segmented files + index =====
  var today = new Date().toISOString().split('T')[0];
  var staticEntries = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/tools/', priority: '0.9', changefreq: 'weekly' },
    { url: '/games/', priority: '0.9', changefreq: 'weekly' },
    { url: '/dev-tools/', priority: '0.8', changefreq: 'weekly' },
    { url: '/utilities/', priority: '0.8', changefreq: 'weekly' },
    { url: '/tools/web/', priority: '0.8', changefreq: 'weekly' },
    { url: '/tools/fun/', priority: '0.8', changefreq: 'weekly' },
    { url: '/all-pages/', priority: '0.7', changefreq: 'weekly' },
    { url: '/privacy/', priority: '0.3', changefreq: 'yearly' }
  ];
  var gameEntries = games.map(function(game) {
    return { url: '/games/' + game.id + '/', priority: '0.8', changefreq: 'monthly' };
  });
  var buildUrlSetXml = function(entries) {
    var xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      xml.push(
        '<url>' +
        '<loc>' + absUrl(entry.url) + '</loc>' +
        '<lastmod>' + today + '</lastmod>' +
        '<changefreq>' + entry.changefreq + '</changefreq>' +
        '<priority>' + entry.priority + '</priority>' +
        '</url>'
      );
    }
    xml.push('</urlset>');
    return xml.join('\n');
  };

  var allEntries = staticEntries.concat(gameEntries, webToolEntries, funToolEntries);
  write(path.join(OUT, 'sitemap.xml'), buildUrlSetXml(allEntries));
  write(path.join(OUT, 'sitemap-static.xml'), buildUrlSetXml(staticEntries));
  write(path.join(OUT, 'sitemap-games.xml'), buildUrlSetXml(gameEntries));
  write(path.join(OUT, 'sitemap-web-tools.xml'), buildUrlSetXml(webToolEntries));
  write(path.join(OUT, 'sitemap-fun-tools.xml'), buildUrlSetXml(funToolEntries));

  var sitemapFiles = [
    '/sitemap-static.xml',
    '/sitemap-games.xml',
    '/sitemap-web-tools.xml',
    '/sitemap-fun-tools.xml'
  ];
  var sitemapIndexXml = ['<?xml version="1.0" encoding="UTF-8"?>', '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (var i = 0; i < sitemapFiles.length; i++) {
    sitemapIndexXml.push(
      '<sitemap>' +
      '<loc>' + absUrl(sitemapFiles[i]) + '</loc>' +
      '<lastmod>' + today + '</lastmod>' +
      '</sitemap>'
    );
  }
  sitemapIndexXml.push('</sitemapindex>');
  write(path.join(OUT, 'sitemap-index.xml'), sitemapIndexXml.join('\n'));

  write(
    path.join(OUT, 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      'Sitemap: ' + absUrl('/sitemap.xml'),
      'Sitemap: ' + absUrl('/sitemap-index.xml')
    ].join('\n')
  );

  if(PUB_ID){
    write(path.join(OUT, 'ads.txt'), 'google.com, ' + PUB_ID + ', DIRECT, f08c47fec0942fa0');
  }

  // Monetag service worker (verification only, no Multitag)
  write(path.join(OUT, 'sw.js'), [
    'self.options = {',
    '    "domain": "3nbf4.com",',
    '    "zoneId": 10652551',
    '}',
    'self.lary = ""',
    '// importScripts disabled to prevent Vignette overlay ads'
  ].join('\n'));

  // CNAME ?뚯씪 ?앹꽦 (而ㅼ뒪? ?꾨찓?몄슜)
  write(path.join(OUT, 'CNAME'), 'instaidea.org');

  // Google Search Console ?몄쬆 ?뚯씪
  var googleVerifyFile = path.join(process.cwd(), 'google8c26ce59e7acdd58.html');
  if (fs.existsSync(googleVerifyFile)) {
    fs.copyFileSync(googleVerifyFile, path.join(OUT, 'google8c26ce59e7acdd58.html'));
  }

  // ===== PWA Manifest =====
  var manifest = {
    name: 'InstaIdea - Mini Games & Tools',
    short_name: 'InstaIdea',
    description: 'Free brain training games, developer tools, and fun utilities',
    start_url: href('/'),
    scope: href('/'),
    display: 'standalone',
    background_color: '#667eea',
    theme_color: '#667eea',
    lang: 'ko',
    categories: ['games', 'utilities', 'entertainment'],
    icons: [
      { src: href('/og-image.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
    ]
  };
  write(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // ===== OG Image (SVG) =====
  var ogSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">' +
    '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" style="stop-color:#667eea"/>' +
    '<stop offset="50%" style="stop-color:#764ba2"/>' +
    '<stop offset="100%" style="stop-color:#f093fb"/>' +
    '</linearGradient></defs>' +
    '<rect width="1200" height="630" fill="url(#bg)"/>' +
    '<text x="600" y="200" text-anchor="middle" fill="white" font-size="72" font-weight="bold" font-family="Arial,sans-serif">PLAY</text>' +
    '<text x="600" y="320" text-anchor="middle" fill="white" font-size="64" font-weight="bold" font-family="Arial,sans-serif">InstaIdea</text>' +
    '<text x="600" y="400" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="32" font-family="Arial,sans-serif">Mini Games &amp; Tools Collection</text>' +
    '<text x="600" y="460" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="24" font-family="Arial,sans-serif">' + (games.length + webTools.length + consumerTools.length) + '+ Free Games &amp; Tools</text>' +
    '<text x="600" y="560" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="20" font-family="Arial,sans-serif">' + escapeHtml(SITE_HOST) + '</text>' +
    '</svg>';
  write(path.join(OUT, 'og-image.svg'), ogSvg);

  console.log('Generated ' + games.length + ' game(s), ' + webTools.length + ' web tool(s), ' + consumerTools.length + ' consumer tool(s), and main page');
  console.log('SEO enhancements: JSON-LD, enhanced sitemap, manifest.json, OG image, related content sections');
}

build();


