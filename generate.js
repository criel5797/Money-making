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
var LEGACY_REPO_PATH = repoName || path.basename(process.cwd()) || 'Money-making';
var autoBasePath = repoName ? '/' + repoName : '';
var rawBasePath = process.env.BASE_PATH || parsedBaseUrl.pathname.replace(/\/$/, '') || autoBasePath || '';
if (!process.env.BASE_PATH && parsedBaseUrl.hostname && !/github\.io$/i.test(parsedBaseUrl.hostname)) {
  rawBasePath = '';
}
var BASE_PATH = rawBasePath;
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

var STATIC_PAGE_LANGS = ['ko', 'en', 'ja'];
var GOOGLE_ANALYTICS_ID = 'G-CGCL4G4YMY';

function getStaticPagePath(canonicalPath, lang) {
  return getToolLocalePath(canonicalPath, lang, 'ko');
}

function buildGoogleAnalyticsTags() {
  return '' +
    '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ANALYTICS_ID + '"></script>' +
    '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js", new Date());gtag("config", "' + GOOGLE_ANALYTICS_ID + '");</script>';
}

function buildLocalePathMap(canonicalPath, languages, defaultLang) {
  var map = {};
  (languages || []).forEach(function(lang) {
    map[lang] = getToolLocalePath(canonicalPath, lang, defaultLang);
  });
  return map;
}

function formatLocalizedCount(template, count) {
  return safeText(template, '{count} items').replace('{count}', String(count));
}

function getLocalizedCatalogValue(value, lang, fallbackLang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return safeText(
    value[lang],
    safeText(value[fallbackLang], safeText(value.en, safeText(value.ko, safeText(value.ja, ''))))
  );
}

function getLocalizedItemTitle(item, lang) {
  return safeText(getLocalizedCatalogValue(item && item.title, lang, 'en'), item && item.id);
}

function getLocalizedItemDescription(item, lang, fallbackText) {
  return safeText(
    getLocalizedCatalogValue((item && (item.description || item.desc)) || '', lang, 'en'),
    fallbackText || 'Free online tool'
  );
}

function buildLocalizedStaticEntries(entries, languages, defaultLang) {
  var localizedEntries = [];
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    for (var j = 0; j < languages.length; j++) {
      localizedEntries.push({
        url: getToolLocalePath(entry.url, languages[j], defaultLang),
        priority: entry.priority,
        changefreq: entry.changefreq
      });
    }
  }
  return localizedEntries;
}

function writeLocalizedStaticPages(outputDir, canonicalPath, renderPage, options) {
  options = options || {};
  var languages = options.languages || STATIC_PAGE_LANGS;
  var defaultLang = options.defaultLang || 'ko';
  var alternateLocales = buildLocalePathMap(canonicalPath, languages, defaultLang);

  languages.forEach(function(lang) {
    var page = renderPage(lang, alternateLocales) || {};
    write(
      path.join(outputDir, getToolLocaleFilename(lang, defaultLang)),
      layout(
        page.title,
        alternateLocales[lang],
        page.body || '',
        page.includeAdScript !== false,
        page.description,
        page.jsonLd,
        page.relatedContent,
        {
          locale: lang,
          defaultLang: defaultLang,
          alternateLocales: alternateLocales,
          localizedNavigation: true,
          includeI18nScript: page.includeI18nScript === true
        }
      )
    );
  });

  return alternateLocales;
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
  var toolId = options.toolId || '';
  var toolData = options.toolData || null;
  var toolType = options.toolType || 'webTool';
  var categoryLabel = toolType === 'webTool' ? 'Developer Tools' : 'Utilities & Fun Tools';
  var pagePath = getToolLocalePath(canonicalPath, lang, defaultLang);
  var canonical = escapeHtml(absUrl(pagePath));
  var metaTitle = escapeHtml(buildToolSeoTitle(toolId, toolData, toolType, lang));
  var metaDescription = escapeHtml(buildToolSeoDescription(toolId, toolData, toolType, lang, categoryLabel));
  var altTags = buildAlternateHreflangTags(canonicalPath, availableLanguages, defaultLang);
  var ogLocale = getLocaleOpenGraphValue(lang);
  var ogAlternateTags = ['ko', 'en', 'ja'].filter(function(locale) {
    return availableLanguages[locale] && locale !== lang;
  }).map(function(locale) {
    return '<meta property="og:locale:alternate" content="' + getLocaleOpenGraphValue(locale) + '">';
  }).join('');

  content = ensureHtmlLang(content, lang);
  content = String(content || '')
    .replace(/<meta[^>]+name=["']viewport["'][^>]*>/ig, '')
    .replace(/<title>[\s\S]*?<\/title>/ig, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/ig, '')
    .replace(/<meta[^>]+name=["']keywords["'][^>]*>/ig, '')
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/ig, '')
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/ig, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/ig, '')
    .replace(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:title["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:description["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:type["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:locale(?::alternate)?["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:image["'][^>]*>/ig, '')
    .replace(/<meta[^>]+property=["']og:site_name["'][^>]*>/ig, '')
    .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/ig, '')
    .replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/ig, '');

  var ogImage = escapeHtml(BASE_URL + '/og-image.svg');
  var mobileSafeCss = '<style>*,*:before,*:after{box-sizing:border-box}html,body{max-width:100%;overflow-x:hidden}table{table-layout:fixed;max-width:100%;word-break:break-word}pre{overflow-x:auto;max-width:100%;white-space:pre-wrap;word-break:break-word}img,video,iframe{max-width:100%;height:auto}input,textarea,select,button{max-width:100%}.container,.wrapper,[class*="container"],[class*="wrapper"]{max-width:100%}</style>';
  var seoTags = '' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + metaTitle + '</title>' +
    '<meta name="description" content="' + metaDescription + '">' +
    '<meta name="robots" content="index,follow,max-image-preview:large">' +
    '<link rel="canonical" href="' + canonical + '">' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:url" content="' + canonical + '">' +
    '<meta property="og:title" content="' + metaTitle + '">' +
    '<meta property="og:description" content="' + metaDescription + '">' +
    '<meta property="og:image" content="' + ogImage + '">' +
    '<meta property="og:locale" content="' + ogLocale + '">' +
    '<meta property="og:site_name" content="InstaIdea">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + metaTitle + '">' +
    '<meta name="twitter:description" content="' + metaDescription + '">' +
    '<meta name="twitter:image" content="' + ogImage + '">' +
    ogAlternateTags +
    altTags +
    buildToolStructuredDataScripts(toolId, toolData, toolType, pagePath, lang) +
    buildGoogleAnalyticsTags() +
    mobileSafeCss;

  if (lang === 'en' && getToolSeoGuide(toolId, toolData, toolType)) {
    content = injectBeforeClosingTag(content, '</head>', buildToolGuideStyles());
    content = injectBeforeClosingTag(content, '</body>', buildToolGuideSection(toolId, toolData, toolType, lang));
  }

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

function injectForcedPageLocale(content, lang) {
  return injectBeforeClosingTag(
    content,
    '</body>',
    '<script>(function(){try{localStorage.setItem("lang",' + JSON.stringify(lang) + ');}catch(e){}window.currentLang=' + JSON.stringify(lang) + ';if(typeof setLanguage==="function"){setLanguage(' + JSON.stringify(lang) + ');}})();</script>'
  );
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

function buildGameSeoTitle(game, lang) {
  var locale = lang || 'en';
  var gameMeta = {
    'reaction-time': {
      title: 'Reaction Time Test - Measure Reflex Speed Online',
      description: 'Measure reaction time in milliseconds with a fast browser-based reflex test. Retry instantly, compare scores, and practice online for free.'
    },
    'typing-speed': {
      title: 'Typing Speed Test - Free WPM Keyboard Test Online',
      description: 'Check typing speed, WPM, and accuracy with a free online keyboard test. Practice short rounds and track improvement over time.'
    },
    'click-speed': {
      title: 'Click Speed Test - Free CPS Test Online',
      description: 'Test click speed online and measure CPS in a short browser challenge. Compare your score and practice for a faster click rhythm.'
    },
    'memory-number': {
      title: 'Number Memory Test - Remember Longer Digits Online',
      description: 'Train number recall with a free online memory test. Repeat longer digit sequences, compare your score, and improve short-term memory.'
    },
    'sequence-memory': {
      title: 'Sequence Memory Game - Test Recall Order Online',
      description: 'Play a free online sequence memory game and repeat the correct order under pressure. Track progress and improve recall accuracy.'
    },
    'visual-memory': {
      title: 'Visual Memory Test - Remember Flashing Tiles Online',
      description: 'Test visual recall with a free browser memory game. Remember tile positions, retry quickly, and improve pattern recognition.'
    },
    'verbal-memory': {
      title: 'Verbal Memory Test - Check Word Recall Online',
      description: 'Train verbal memory with a free online word recall test. Spot seen versus new words and build a better long-term memory score.'
    },
    'chimp-test': {
      title: 'Chimp Test - Memory and Number Order Challenge',
      description: 'Play the chimp test online and click numbers in the correct order after they disappear. Compare your score and sharpen working memory.'
    },
    'aim-trainer': {
      title: 'Aim Trainer - Free Mouse Accuracy Test Online',
      description: 'Improve mouse accuracy and speed with a free online aim trainer. Hit targets quickly, repeat rounds, and build better control.'
    },
    'stroop-test': {
      title: 'Stroop Test - Free Attention and Focus Test Online',
      description: 'Take a free Stroop test online to challenge attention, focus, and response control. Compare scores and repeat short focus drills.'
    },
    'number-speed': {
      title: 'Number Speed Test - Compare Numbers Faster Online',
      description: 'Train number recognition and decision speed with a free online test. Pick larger numbers quickly and track accuracy over time.'
    },
    'math-quiz': {
      title: 'Math Quiz Game - Solve Arithmetic Faster Online',
      description: 'Practice arithmetic speed with a free online math quiz. Solve mental math problems quickly and improve accuracy through short rounds.'
    },
    'pattern-memory': {
      title: 'Pattern Memory Game - Repeat Visual Patterns Online',
      description: 'Test pattern memory with a free online brain game. Watch the pattern, repeat it correctly, and improve recall through repetition.'
    },
    'color-match': {
      title: 'Color Match Game - Focus and Color Response Test',
      description: 'Challenge focus and processing speed with a free online color match game. Respond to color cues quickly and compare each round.'
    },
    'color-blind-test': {
      title: 'Color Blind Test - Spot Different Colors Online',
      description: 'Check color perception with a free online color blind test. Find the different shade quickly and compare results across rounds.'
    },
    'hearing-test': {
      title: 'Hearing Test - Check High Frequency Range Online',
      description: 'Test the highest frequency you can hear with a free browser hearing test. Run a quick audio check online with no install.'
    },
    'target-tracker': {
      title: 'Target Tracker - Moving Target Accuracy Game Online',
      description: 'Track a moving target and click precisely in a free online reaction game. Practice fast visual tracking and control.'
    },
    'word-puzzle': {
      title: 'Word Puzzle Game - Make Words from Letters Online',
      description: 'Play a free online word puzzle game and build words from shuffled letters. Improve vocabulary speed and spelling under time pressure.'
    }
  };
  if (locale === 'en' && gameMeta[game && game.id] && gameMeta[game.id].title) {
    return gameMeta[game.id].title;
  }
  var keyword = getLocalizedCatalogValue(game && game.title, locale, 'en') || 'Brain Training Game';
  if (locale === 'ko') return keyword + ' - 무료 온라인 두뇌 훈련 게임 | InstaIdea';
  if (locale === 'ja') return keyword + ' - 無料オンライン脳トレゲーム | InstaIdea';
  return keyword + ' - Free Online Game';
}

function buildGameSeoDescription(game, lang) {
  var locale = lang || 'en';
  var gameMeta = {
    'reaction-time': 'Measure reaction time in milliseconds with a fast browser-based reflex test. Retry instantly, compare scores, and practice online for free.',
    'typing-speed': 'Check typing speed, WPM, and accuracy with a free online keyboard test. Practice short rounds and track improvement over time.',
    'click-speed': 'Test click speed online and measure CPS in a short browser challenge. Compare your score and practice for a faster click rhythm.',
    'memory-number': 'Train number recall with a free online memory test. Repeat longer digit sequences, compare your score, and improve short-term memory.',
    'sequence-memory': 'Play a free online sequence memory game and repeat the correct order under pressure. Track progress and improve recall accuracy.',
    'visual-memory': 'Test visual recall with a free browser memory game. Remember tile positions, retry quickly, and improve pattern recognition.',
    'verbal-memory': 'Train verbal memory with a free online word recall test. Spot seen versus new words and build a better long-term memory score.',
    'chimp-test': 'Play the chimp test online and click numbers in the correct order after they disappear. Compare your score and sharpen working memory.',
    'aim-trainer': 'Improve mouse accuracy and speed with a free online aim trainer. Hit targets quickly, repeat rounds, and build better control.',
    'stroop-test': 'Take a free Stroop test online to challenge attention, focus, and response control. Compare scores and repeat short focus drills.',
    'number-speed': 'Train number recognition and decision speed with a free online test. Pick larger numbers quickly and track accuracy over time.',
    'math-quiz': 'Practice arithmetic speed with a free online math quiz. Solve mental math problems quickly and improve accuracy through short rounds.',
    'pattern-memory': 'Test pattern memory with a free online brain game. Watch the pattern, repeat it correctly, and improve recall through repetition.',
    'color-match': 'Challenge focus and processing speed with a free online color match game. Respond to color cues quickly and compare each round.',
    'color-blind-test': 'Check color perception with a free online color blind test. Find the different shade quickly and compare results across rounds.',
    'hearing-test': 'Test the highest frequency you can hear with a free browser hearing test. Run a quick audio check online with no install.',
    'target-tracker': 'Track a moving target and click precisely in a free online reaction game. Practice fast visual tracking and control.',
    'word-puzzle': 'Play a free online word puzzle game and build words from shuffled letters. Improve vocabulary speed and spelling under time pressure.'
  };
  if (locale === 'en' && gameMeta[game && game.id]) {
    return gameMeta[game.id];
  }
  var keyword = getLocalizedCatalogValue(game && game.title, locale, 'en') || 'Brain Training Game';
  var teaser = getLocalizedCatalogValue(game && game.description, locale, 'en') || 'Train your brain with this free online game.';
  return keyword + ' - ' + teaser + ' Play free online, track your best score, and improve with practical tips.';
}

var TOOL_META_OVERRIDES = {
  'password-generator': {
    title: 'Password Generator Online | Create Strong Random Passwords',
    description: 'Generate strong random passwords with length, symbol, and character set controls. Create secure passwords instantly in your browser.'
  },
  'qr-generator': {
    title: 'QR Code Generator | Create QR Codes Online Free',
    description: 'Create QR codes online for URLs, Wi-Fi, text, and contact details. Generate and download clean QR images in your browser.'
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator | Format JSON Online',
    description: 'Format, validate, and beautify JSON online. Fix messy payloads, inspect API responses, and copy clean JSON in one step.'
  },
  'uuid-generator': {
    title: 'UUID Generator | Create UUID v4 Online',
    description: 'Generate UUIDs online for databases, APIs, and application records. Create random identifiers instantly with no install.'
  },
  'base64-tool': {
    title: 'Base64 Encoder and Decoder | Convert Text Online',
    description: 'Encode and decode Base64 online for text, tokens, and small payloads. Convert values quickly in your browser.'
  },
  'diff-checker': {
    title: 'Diff Checker Online | Compare Text Side by Side',
    description: 'Compare two text blocks or code snippets online and highlight added, removed, and changed lines instantly.'
  },
  'regex-tester': {
    title: 'Regex Tester | Test Regular Expressions Online',
    description: 'Test regular expressions online with instant matches, flags, and sample text. Debug regex patterns faster in your browser.'
  },
  'word-counter': {
    title: 'Word Counter | Count Words, Characters, and Lines',
    description: 'Count words, characters, spaces, and lines online. Check text length quickly for writing, SEO, and content editing.'
  },
  'timestamp-converter': {
    title: 'Unix Timestamp Converter | Epoch to Date Online',
    description: 'Convert Unix timestamps to human-readable dates and back online. Check epoch time values quickly in your browser.'
  },
  'jwt-decoder': {
    title: 'JWT Decoder | Decode JSON Web Tokens Online',
    description: 'Decode JWT tokens online and inspect header, payload, and expiry details without installing extra tools.'
  },
  'json-to-typescript': {
    title: 'JSON to TypeScript | Generate Types Online',
    description: 'Convert JSON into TypeScript interfaces online. Generate starter types for APIs, mocks, and frontend models fast.'
  },
  'markdown-to-html': {
    title: 'Markdown to HTML Converter | Preview and Export',
    description: 'Convert Markdown to HTML online with instant preview. Clean up docs, copy HTML output, and speed up content workflows.'
  },
  'sql-formatter': {
    title: 'SQL Formatter | Format SQL Queries Online',
    description: 'Format SQL queries online for better readability. Clean up long statements and review complex SQL faster.'
  },
  'html-minifier': {
    title: 'HTML Minifier | Compress HTML Online',
    description: 'Minify HTML online to reduce file size and remove extra whitespace. Clean up markup quickly before deploy.'
  },
  'css-minifier': {
    title: 'CSS Minifier | Compress CSS Online',
    description: 'Minify CSS online and shrink stylesheets fast. Remove extra whitespace and optimize browser-ready CSS in one step.'
  },
  'slug-generator': {
    title: 'Slug Generator | Create SEO-Friendly URL Slugs',
    description: 'Generate clean URL slugs online for blog posts, product pages, and SEO workflows. Convert text into readable slugs fast.'
  },
  'text-case-converter': {
    title: 'Text Case Converter | Uppercase, Lowercase, Title Case',
    description: 'Convert text case online with uppercase, lowercase, sentence case, and title case options. Clean up copy instantly.'
  },
  'binary-hex': {
    title: 'Binary Hex Converter | Binary, Decimal, and Hex Online',
    description: 'Convert binary, decimal, and hexadecimal values online. Switch between bases quickly for debugging and study tasks.'
  },
  'meta-tag-generator': {
    title: 'Meta Tag Generator | Build SEO Meta Tags Online',
    description: 'Generate SEO meta tags online for titles, descriptions, Open Graph, and social previews without manual markup.'
  },
  'image-to-base64': {
    title: 'Image to Base64 Converter | Encode Images Online',
    description: 'Convert images to Base64 online for quick embeds, previews, and development workflows. Encode image files in the browser.'
  },
  'char-counter': {
    title: 'Character Counter | Count Characters, Words, and Spaces',
    description: 'Count characters, words, lines, and spaces online. Check text length for social posts, forms, and writing tasks.'
  },
  'age-calculator': {
    title: 'Age Calculator | Calculate Exact Age from Birth Date',
    description: 'Calculate exact age online from a birth date. Check years, months, and days quickly with a simple browser calculator.'
  },
  'bmi-calculator': {
    title: 'BMI Calculator | Calculate Body Mass Index Online',
    description: 'Calculate BMI online from height and weight. Check body mass index quickly with a simple browser-based calculator.'
  },
  'percent-calculator': {
    title: 'Percentage Calculator | Find Percent Change Online',
    description: 'Calculate percentage, increase, decrease, and ratios online. Solve common percent math problems quickly.'
  },
  'unit-converter': {
    title: 'Unit Converter | Convert Length, Weight, and Temperature',
    description: 'Convert common units online for length, weight, temperature, and more. Switch values quickly in your browser.'
  }
};

function buildToolSeoTitle(toolId, tool, toolType, lang) {
  var locale = lang || 'en';
  var keyword = getLocalizedCatalogValue(tool && tool.title, locale, 'en') || safeText(tool && tool.title && tool.title.en, 'Online Tool');
  var metaOverride = TOOL_META_OVERRIDES[toolId];
  if (locale === 'en' && metaOverride && metaOverride.title) return metaOverride.title;
  if (locale === 'ko') return keyword + (toolType === 'webTool' ? ' - 무료 온라인 웹 개발 도구 | InstaIdea' : ' - 무료 온라인 유틸리티 도구 | InstaIdea');
  if (locale === 'ja') return keyword + (toolType === 'webTool' ? ' - 無料オンラインWebツール | InstaIdea' : ' - 無料オンラインユーティリティ | InstaIdea');
  return keyword + ' - Free Online Tool | InstaIdea';
}

function buildToolSeoDescription(toolId, tool, toolType, lang, categoryLabel) {
  var locale = lang || 'en';
  var metaOverride = TOOL_META_OVERRIDES[toolId];
  if (locale === 'en' && metaOverride && metaOverride.description) return metaOverride.description;
  var keyword = getLocalizedCatalogValue(tool && tool.title, locale, 'en') || safeText(tool && tool.title && tool.title.en, 'online tool');
  var purpose = getLocalizedCatalogValue(tool && tool.desc, locale, 'en') || safeText(tool && tool.desc && tool.desc.en, 'fast browser-based utility');
  if (locale === 'ko') return keyword + ' 온라인 도구입니다. ' + purpose + '. 설치 없이 브라우저에서 무료로 바로 사용할 수 있습니다.';
  if (locale === 'ja') return keyword + 'をオンラインで無料で使えます。' + purpose + '。インストール・登録不要でブラウザですぐに使えます。';
  return 'Use ' + keyword + ' online for free. ' + purpose + '. No install, no signup, and optimized for desktop and mobile. Category: ' + categoryLabel + '.';
}

var TOOL_SEO_GUIDES = {};

function findCatalogItemById(id) {
  var catalogs = [webTools, consumerTools];
  for (var c = 0; c < catalogs.length; c++) {
    for (var i = 0; i < catalogs[c].length; i++) {
      if (catalogs[c][i].id === id) return catalogs[c][i];
    }
  }
  return null;
}

function buildToolFaqItems(toolId, toolData, toolType, lang) {
  if ((lang || 'en') !== 'en') return [];
  var guide = getToolSeoGuide(toolId, toolData, toolType);
  if (guide && Array.isArray(guide.faqs)) return guide.faqs;
  return [];
}

function buildToolGuideStyles() {
  return '' +
    '<style id="insta-seo-tool-style">' +
      '.insta-seo-content{max-width:1100px;margin:40px auto 28px;padding:0 20px}' +
      '.insta-seo-card{background:#fff;border:1px solid #e2e8f0;border-radius:22px;padding:28px;color:#0f172a;box-shadow:0 20px 60px rgba(15,23,42,0.08)}' +
      '.insta-seo-card h2{margin:0 0 12px;font-size:1.4rem;color:#0f172a}' +
      '.insta-seo-card h3{margin:18px 0 8px;font-size:1.05rem;color:#0f172a}' +
      '.insta-seo-card p,.insta-seo-card li{color:#334155;line-height:1.75}' +
      '.insta-seo-card ul,.insta-seo-card ol{margin:0 0 18px 22px}' +
      '.insta-seo-card pre{margin:0 0 18px;padding:16px;border-radius:14px;background:#0f172a;color:#e2e8f0;overflow:auto}' +
      '.insta-seo-card a{color:#1d4ed8;text-decoration:none}' +
      '.insta-seo-card a:hover{text-decoration:underline}' +
      '@media (max-width:700px){.insta-seo-content{padding:0 14px}.insta-seo-card{padding:20px}}' +
    '</style>';
}

function inferToolGuideFamily(toolId, toolData, toolType) {
  var haystack = [
    toolId || '',
    safeText(toolData && toolData.title && toolData.title.en, ''),
    safeText(toolData && toolData.desc && toolData.desc.en, '')
  ].join(' ').toLowerCase();
  if (/(generator|password|qr code|uuid|slug|name|lorem|meta tag)/.test(haystack)) return 'generator';
  if (/(converter|base64|binary|hex|encode|decode|timestamp|unit|image)/.test(haystack)) return 'converter';
  if (/(formatter|minifier|beautify|format)/.test(haystack)) return 'formatter';
  if (/(counter|analyzer|count)/.test(haystack)) return 'counter';
  if (/(calculator|bmi|age|gpa|percent|loan|tip|d-day|dday)/.test(haystack)) return 'calculator';
  if (/(tester|test|checker|decoder|preview|scanner|lookup|info|validator|quiz)/.test(haystack)) return 'inspector';
  if (/(timer|stopwatch|clock|pomodoro|countdown|metronome)/.test(haystack)) return 'timer';
  if (/(tracker|manager|planner|organizer|watchlist|list|journal|log|notepad|notes|board)/.test(haystack)) return 'organizer';
  if (/(picker|roller|flip|draw|random|wheel|dice|coin)/.test(haystack)) return 'picker';
  return toolType === 'webTool' ? 'utility' : 'daily';
}

function normalizeToolPurposePhrase(toolData) {
  var text = safeText(toolData && toolData.desc && toolData.desc.en, 'handle quick browser tasks').replace(/[.]+$/g, '');
  if (!text) return { mode: 'topic', text: 'quick browser tasks' };
  var lowered = text.charAt(0).toLowerCase() + text.slice(1);
  if (/^(generate|create|convert|format|count|check|calculate|test|decode|encode|compare|look up|lookup|preview|track|manage|plan|pick|roll|flip|scan|minify|parse|measure|solve|inspect|clean|build|organize)\b/i.test(text)) {
    return { mode: 'action', text: lowered };
  }
  return { mode: 'topic', text: lowered };
}

function buildFallbackToolGuide(toolId, toolData, toolType) {
  var keyword = safeText(toolData && toolData.title && toolData.title.en, toolId);
  var purpose = normalizeToolPurposePhrase(toolData);
  var family = inferToolGuideFamily(toolId, toolData, toolType);
  var overviewByFamily = {
    generator: keyword + ' is a browser-based tool for creating fresh output quickly when you need repeatable results without opening extra software.',
    converter: keyword + ' is a browser-based tool for moving values between formats quickly so you can reuse the result in docs, code, or support workflows.',
    formatter: keyword + ' is a browser-based cleanup tool that makes messy input easier to read, review, and reuse.',
    counter: keyword + ' is a browser-based measurement tool for checking size, length, or text-related metrics in a few seconds.',
    calculator: keyword + ' is a browser-based calculator for quick estimates and exact value checks without spreadsheet setup.',
    inspector: keyword + ' is a browser-based inspection tool for checking data, output, or patterns quickly during review and debugging work.',
    timer: keyword + ' is a browser-based timing tool that helps you stay on schedule with simple start-and-check workflows.',
    organizer: keyword + ' is a lightweight browser-based organizer for quick planning, tracking, and list management tasks.',
    picker: keyword + ' is a fast browser-based picker for random choices, simple selection flows, and lightweight decision tasks.',
    utility: keyword + ' is a browser-based utility that helps you finish a small task quickly without switching away from your current workflow.',
    daily: keyword + ' is a lightweight browser tool for quick everyday tasks, small calculations, and repeatable utility work.'
  };
  var usageLine = purpose.mode === 'action'
    ? 'It is useful when you need to ' + purpose.text + ' quickly in one tab.'
    : 'It is useful for ' + purpose.text + ' in a quick browser workflow.';
  var contentByFamily = {
    generator: {
      steps: ['Choose the options or fields you want to use.', 'Generate a new result and review the output.', 'Copy or export the final value into your workflow.'],
      useCases: ['Creating fresh output for docs, product work, or quick setup tasks.', 'Producing repeatable values without writing one-off scripts.', 'Generating a result that can be copied directly into another tool or form.'],
      tips: ['Double-check the final output before sharing it publicly.', 'Regenerate a few times if you need a different style or pattern.', 'Keep the output close to the workflow where you plan to use it.'],
      faqs: [{ q: 'Why use this generator in the browser?', a: 'It gives you fast output without extra software or setup.' }, { q: 'Can I generate multiple results?', a: 'Yes. Browser generators are useful because you can repeat the action until the result fits your task.' }, { q: 'When is a generator useful?', a: 'It is useful when you need quick, repeatable output for a task, form, or workflow.' }]
    },
    converter: {
      steps: ['Enter or paste the source value.', 'Choose the target format or output style.', 'Copy the converted result and use it where needed.'],
      useCases: ['Switching values between formats during development or QA.', 'Preparing data for docs, tickets, or handoff notes.', 'Checking conversion output quickly before using it elsewhere.'],
      tips: ['Confirm the source and target formats before converting.', 'Test a small sample first when the input looks unusual.', 'Keep one verified example for future reference.'],
      faqs: [{ q: 'Why use an online converter?', a: 'It lets you switch formats quickly without opening another application.' }, { q: 'What should I verify after conversion?', a: 'Check that the source input and final output are in the formats you expected.' }, { q: 'Who uses converters most often?', a: 'Developers, writers, QA teams, and operations teams often use them for quick data changes.' }]
    },
    formatter: {
      steps: ['Paste the raw input into the tool.', 'Run formatting or cleanup to improve readability.', 'Review and copy the cleaned result back into your editor or ticket.'],
      useCases: ['Cleaning up copied input before review.', 'Making output easier to scan in docs and issue reports.', 'Improving readability before sharing examples with teammates.'],
      tips: ['Keep the original input nearby when formatting important content.', 'Use formatting before asking for review so others can scan faster.', 'Check edge cases such as long lines or nested structures after cleanup.'],
      faqs: [{ q: 'Why format content before review?', a: 'Readable structure makes it easier to spot mistakes and discuss changes.' }, { q: 'Does formatting change the underlying meaning?', a: 'Formatting is mainly for readability, but you should still verify the final output before reuse.' }, { q: 'When is an online formatter useful?', a: 'It is useful when you need a quick cleanup step without opening a heavier editor.' }]
    },
    counter: {
      steps: ['Paste or type the content you want to measure.', 'Review the count metrics the page shows.', 'Edit the input until it fits the limit or target you need.'],
      useCases: ['Checking copy length for forms, content, and social posts.', 'Comparing drafts by size before publishing.', 'Validating limits quickly during editing or QA.'],
      tips: ['Watch multiple metrics if your target platform has more than one limit.', 'Trim repeated filler phrases before cutting essential details.', 'Keep a target range in mind before rewriting the text.'],
      faqs: [{ q: 'What does this tool count?', a: 'It measures the text or value metrics shown in the interface so you can review size quickly.' }, { q: 'Why count content before publishing?', a: 'Length limits and readability targets often matter before a draft is ready to ship.' }, { q: 'Can this help with editing?', a: 'Yes. It gives quick feedback while you shorten or expand a draft.' }]
    },
    calculator: {
      steps: ['Enter the values the calculation requires.', 'Adjust units or options if the tool provides them.', 'Review the result and compare it with your target or estimate.'],
      useCases: ['Running a quick estimate without opening a spreadsheet.', 'Checking values before sharing them with someone else.', 'Saving time on repetitive everyday calculations.'],
      tips: ['Double-check input units before trusting the result.', 'Use recent and accurate values for better estimates.', 'Keep a note of assumptions if you share the result with others.'],
      faqs: [{ q: 'Why use this calculator online?', a: 'It gives a fast answer without spreadsheet setup or manual formula work.' }, { q: 'What should I verify before using the result?', a: 'Check that the inputs and units match your real scenario.' }, { q: 'When is a browser calculator useful?', a: 'It is useful for quick checks, rough planning, and repeated small calculations.' }]
    },
    inspector: {
      steps: ['Paste or enter the value you want to inspect.', 'Run the check and review the fields, matches, or results.', 'Copy the important output into your notes or workflow.'],
      useCases: ['Debugging a value, pattern, or response quickly.', 'Checking data before you reuse it in another step.', 'Explaining results during review, QA, or support work.'],
      tips: ['Start with a small sample when the input is noisy.', 'Check the most important fields first so you can decide quickly.', 'Keep one working example for future debugging.'],
      faqs: [{ q: 'Why use this tool during debugging?', a: 'It lets you inspect output quickly without writing a throwaway script.' }, { q: 'Can I use sample data first?', a: 'Yes. Testing with a smaller example often makes the result easier to understand.' }, { q: 'What makes inspection tools useful?', a: 'They reduce the time needed to understand what a value or pattern is doing.' }]
    },
    timer: {
      steps: ['Set the duration or mode you want to use.', 'Start the timer and keep the page open while it runs.', 'Pause, reset, or restart the session when your task changes.'],
      useCases: ['Running short focus sessions in one browser tab.', 'Tracking breaks, study blocks, or simple routines.', 'Keeping timing visible without opening a separate app.'],
      tips: ['Use realistic session lengths you can repeat consistently.', 'Keep the tab visible or pinned if the timer matters to your workflow.', 'Reset between sessions so your timing stays easy to read.'],
      faqs: [{ q: 'Why use a browser timer?', a: 'It is quick to open and easy to keep alongside your main task.' }, { q: 'What workflows benefit from a timer?', a: 'Focus sessions, breaks, practice drills, and simple routines all benefit from visible timing.' }, { q: 'Does a timer help with consistency?', a: 'Yes. Repeating the same session length often makes routines easier to keep.' }]
    },
    organizer: {
      steps: ['Add the items, notes, or values you want to track.', 'Update the list or records as your task changes.', 'Review the final set and keep or export the information you need.'],
      useCases: ['Managing a lightweight list without installing another app.', 'Tracking small workflows during planning or review.', 'Keeping one simple page open for repeated reference.'],
      tips: ['Keep entries short so the list stays easy to scan.', 'Update items as soon as something changes.', 'Review the final list before sharing it with other people.'],
      faqs: [{ q: 'Why use a simple browser organizer?', a: 'It is useful for lightweight planning without the setup cost of a bigger system.' }, { q: 'What kinds of tasks fit this type of tool?', a: 'Lists, checklists, simple tracking, and personal workflow notes fit well.' }, { q: 'When is a lightweight organizer better than full software?', a: 'It is better when the task is small, temporary, or needs a quick shared reference.' }]
    },
    picker: {
      steps: ['Enter the options or values you want to choose from.', 'Run the selection or randomization action.', 'Accept the result or repeat the process if you need another outcome.'],
      useCases: ['Making simple random choices during games, planning, or group tasks.', 'Breaking ties quickly without manual selection.', 'Generating one fast answer in a lightweight workflow.'],
      tips: ['Check the option list before you run the picker.', 'Rerun the tool only when your process allows another random result.', 'Keep the input list simple so the outcome stays easy to review.'],
      faqs: [{ q: 'Why use an online picker?', a: 'It is a fast way to choose between options without doing the selection manually.' }, { q: 'Can I rerun the result?', a: 'Yes, but you should decide in advance whether rerunning is fair for your use case.' }, { q: 'When is a picker useful?', a: 'It is useful for quick decisions, random choices, and light group activities.' }]
    },
    utility: {
      steps: ['Open the tool and enter the input it needs.', 'Run the main action the page provides.', 'Review the output and copy it into your workflow.'],
      useCases: ['Solving a small browser task without another app.', 'Cleaning up or checking data during day-to-day work.', 'Reducing context switching in a repeatable workflow.'],
      tips: ['Test with a small sample first if the input is unfamiliar.', 'Verify the output before using it in an important workflow.', 'Keep the page bookmarked if you return to the same task often.'],
      faqs: [{ q: 'Why use a browser utility?', a: 'It is fast to open and usually removes the need for extra setup.' }, { q: 'Who benefits from simple online tools?', a: 'Developers, writers, marketers, students, and support teams all benefit from quick utilities.' }, { q: 'What is the main advantage of this type of tool?', a: 'The main advantage is speed. You can complete a small task without leaving the browser.' }]
    },
    daily: {
      steps: ['Open the page and add the values or options it needs.', 'Run the main action and review the result.', 'Keep or repeat the result depending on your task.'],
      useCases: ['Handling a small personal or everyday task quickly.', 'Checking a value or result without manual math.', 'Using one simple page for repeatable lightweight workflows.'],
      tips: ['Keep the input simple the first time you use the tool.', 'Repeat the workflow a few times until the result looks consistent.', 'Use the page as a lightweight helper, not a replacement for deeper systems.'],
      faqs: [{ q: 'Why use a small browser tool for daily tasks?', a: 'It helps you finish a small task quickly without setup friction.' }, { q: 'Can I use this kind of tool on mobile?', a: 'Most lightweight browser tools are convenient on both desktop and mobile.' }, { q: 'When is a simple utility page enough?', a: 'It is enough when you need a quick result, not a complex long-term workflow.' }]
    }
  };
  var pack = contentByFamily[family] || contentByFamily.utility;
  return {
    overview: overviewByFamily[family] + ' ' + usageLine,
    steps: pack.steps,
    useCases: pack.useCases,
    tips: pack.tips,
    faqs: pack.faqs,
    related: []
  };
}

function getToolSeoGuide(toolId, toolData, toolType) {
  return TOOL_SEO_GUIDES[toolId] || buildFallbackToolGuide(toolId, toolData, toolType);
}

TOOL_SEO_GUIDES['password-generator'] = {
  overview: 'A password generator helps you create unique credentials for work accounts, personal logins, and shared team tools without reusing weak passwords.',
  steps: [
    'Choose password length and the character groups you want to include.',
    'Generate a new password until the mix matches your security policy.',
    'Copy the result and save it in a password manager instead of a plain text note.'
  ],
  useCases: [
    'Creating strong passwords for new SaaS accounts and admin users.',
    'Rotating credentials after a security review or team handoff.',
    'Generating unique one-off passwords for client or vendor access.'
  ],
  tips: [
    'Use 16 or more characters for important accounts whenever allowed.',
    'Avoid reusing one password across email, banking, and work systems.',
    'Pair strong passwords with a password manager and MFA.'
  ],
  faqs: [
    { q: 'Does this password generator run locally?', a: 'Yes. Password creation happens in the browser so you can generate values without a separate desktop tool.' },
    { q: 'What makes a strong password?', a: 'Length matters most. A longer password with mixed character types is usually more resistant to guessing and reuse risk.' },
    { q: 'Should I memorize generated passwords?', a: 'For most accounts, storing them in a reputable password manager is a better workflow than trying to memorize many long random strings.' }
  ],
  related: ['hash-generator', 'jwt-decoder', 'qr-generator']
};

TOOL_SEO_GUIDES['qr-generator'] = {
  overview: 'A QR code generator lets you turn links, text, Wi-Fi credentials, or contact details into a scan-ready code that works on phones and tablets.',
  steps: [
    'Select the content type such as URL, text, Wi-Fi, or contact details.',
    'Enter the exact value you want users to scan.',
    'Generate the QR code, test it with a phone, and download the image.'
  ],
  useCases: [
    'Adding scan links to posters, menus, packaging, or event materials.',
    'Sharing Wi-Fi credentials in offices, cafes, or temporary venues.',
    'Creating fast mobile entry points for landing pages or app downloads.'
  ],
  tips: [
    'Test the code on more than one phone camera before publishing it.',
    'Keep the destination short and stable when possible.',
    'Use enough contrast between the QR code and its background.'
  ],
  faqs: [
    { q: 'Can I generate a QR code for a website link?', a: 'Yes. URL QR codes are one of the most common use cases because they send mobile users directly to a page.' },
    { q: 'Will the QR code still work after I download it?', a: 'Yes, as long as the encoded destination remains valid. The image simply stores the scan pattern.' },
    { q: 'What should I test before printing a QR code?', a: 'Check scan distance, contrast, and the final destination URL so users do not hit a broken or incorrect page.' }
  ],
  related: ['url-encoder', 'slug-generator', 'meta-tag-generator']
};

TOOL_SEO_GUIDES['json-formatter'] = {
  overview: 'A JSON formatter is useful when API responses, logs, or copied payloads arrive as one long line and you need to read or validate them quickly.',
  steps: [
    'Paste the JSON payload into the editor.',
    'Format or validate the content to reveal structure and syntax issues.',
    'Copy the cleaned result back into docs, tickets, or your editor.'
  ],
  useCases: [
    'Inspecting API responses during frontend or backend debugging.',
    'Cleaning copied payloads before adding examples to docs.',
    'Checking whether a JSON snippet is valid before commit or deploy.'
  ],
  tips: [
    'Validate before reusing a payload in tests or fixtures.',
    'Watch for trailing commas and missing quotes when pasted from chat or docs.',
    'Keep a formatted copy in tickets when teammates need to review the same payload.'
  ],
  faqs: [
    { q: 'What does a JSON formatter help with?', a: 'It turns compact or messy JSON into readable indentation so nested objects, arrays, and syntax mistakes are easier to spot.' },
    { q: 'Can I use it to validate JSON?', a: 'Yes. Formatting and validation usually go together because invalid syntax prevents reliable parsing.' },
    { q: 'Who typically uses a JSON formatter?', a: 'Developers, QA engineers, support teams, and technical writers all use it when they need readable payloads fast.' }
  ],
  related: ['json-to-typescript', 'diff-checker', 'regex-tester']
};

TOOL_SEO_GUIDES['uuid-generator'] = {
  overview: 'A UUID generator creates unique identifiers for records, uploads, database rows, and test data without depending on a custom script.',
  steps: [
    'Choose the UUID version or output style if the tool offers options.',
    'Generate one or more identifiers.',
    'Copy the values into your app, database seed, or test fixture.'
  ],
  useCases: [
    'Creating IDs for mock API responses and frontend states.',
    'Preparing sample database rows or import files.',
    'Generating stable-looking test values during QA and debugging.'
  ],
  tips: [
    'Confirm which UUID version your application expects before generation.',
    'Use batch generation when you need many sample records at once.',
    'Keep generated IDs separate from production identifiers in shared docs.'
  ],
  faqs: [
    { q: 'Why use a UUID generator in the browser?', a: 'It removes the need for a separate script when you only need a few identifiers quickly.' },
    { q: 'Are UUIDs useful for test data?', a: 'Yes. They are commonly used in mocks, fixtures, and sample imports because they look realistic and avoid collisions.' },
    { q: 'Should I use the same UUID twice?', a: 'Usually no. The point of a UUID is to create a fresh identifier for a distinct object or record.' }
  ],
  related: ['json-formatter', 'jwt-decoder', 'hash-generator']
};

TOOL_SEO_GUIDES['diff-checker'] = {
  overview: 'A diff checker compares two text blocks and highlights inserted, removed, or changed lines so edits are easier to review than with a manual scan.',
  steps: [
    'Paste the original version into the first panel.',
    'Paste the updated version into the second panel.',
    'Run the comparison and review changed lines side by side.'
  ],
  useCases: [
    'Reviewing copy edits before publishing updated content.',
    'Comparing API payloads, config files, or SQL statements during debugging.',
    'Checking what changed between two drafts without opening Git.'
  ],
  tips: [
    'Normalize line endings before comparing copied content from different systems.',
    'Compare smaller sections when a file is large and noisy.',
    'Use the tool for quick inspection, then confirm important changes in source control.'
  ],
  faqs: [
    { q: 'What is a diff checker used for?', a: 'It helps you compare old and new text quickly by surfacing only the lines that changed.' },
    { q: 'Can I compare code as well as plain text?', a: 'Yes. Diff tools are often used for both prose and code snippets when you need a fast browser comparison.' },
    { q: 'When is an online diff checker useful?', a: 'It is useful when you need a quick review in one tab and do not want to open desktop comparison software.' }
  ],
  related: ['json-formatter', 'sql-formatter', 'regex-tester']
};

TOOL_SEO_GUIDES['regex-tester'] = {
  overview: 'A regex tester helps you validate regular expressions against sample text so you can debug patterns faster and avoid trial-and-error in production code.',
  steps: [
    'Paste your regex pattern and sample text into the tool.',
    'Toggle the flags you need such as global, multiline, or case-insensitive mode.',
    'Review matches, groups, and misses until the pattern behaves as expected.'
  ],
  useCases: [
    'Debugging validation rules for forms and API inputs.',
    'Testing search-and-replace patterns before using them in an editor.',
    'Teaching or documenting how a regex behaves with real sample data.'
  ],
  tips: [
    'Start with a narrow sample string, then test noisy real-world input.',
    'Check edge cases such as empty values, spacing, and punctuation.',
    'Document the final pattern together with example matches.'
  ],
  faqs: [
    { q: 'Why use a regex tester?', a: 'It gives instant feedback on matches so you can adjust a pattern before it ships to code or content workflows.' },
    { q: 'Should I test regex with real sample data?', a: 'Yes. Synthetic samples help at first, but real inputs reveal spacing, casing, and punctuation issues much faster.' },
    { q: 'What usually breaks a regex pattern?', a: 'Flags, anchors, greedy groups, and unescaped special characters are common sources of unexpected matches.' }
  ],
  related: ['diff-checker', 'json-formatter', 'text-case-converter']
};

TOOL_SEO_GUIDES['word-counter'] = {
  overview: 'A word counter gives you fast length checks for articles, scripts, prompts, emails, and social copy when every character or word limit matters.',
  steps: [
    'Paste or type your text into the editor.',
    'Review word, character, line, and space counts.',
    'Trim or expand the copy until it fits your target channel.'
  ],
  useCases: [
    'Checking article length before publishing or pitching content.',
    'Staying inside character limits for forms, ads, and social posts.',
    'Reviewing prompt or script length during editing.'
  ],
  tips: [
    'Check both word count and characters when a platform has multiple limits.',
    'Remove repeated filler phrases before cutting important details.',
    'Keep a rough target range in mind before you start writing.'
  ],
  faqs: [
    { q: 'Who uses a word counter?', a: 'Writers, marketers, students, developers, and support teams all use it when content length affects delivery.' },
    { q: 'Why check character count as well as words?', a: 'Many platforms enforce hard character limits even when your draft looks short enough by word count.' },
    { q: 'Can a word counter help with editing?', a: 'Yes. It gives immediate feedback when you are trimming or expanding text to hit a target size.' }
  ],
  related: ['text-case-converter', 'slug-generator', 'markdown-to-html']
};

TOOL_SEO_GUIDES['timestamp-converter'] = {
  overview: 'A timestamp converter is useful when logs, API payloads, or database fields show epoch values and you need to read the real date immediately.',
  steps: [
    'Paste a Unix timestamp or enter a calendar date.',
    'Convert the value in the direction you need.',
    'Copy the result into logs, tickets, or debugging notes.'
  ],
  useCases: [
    'Reading event times in logs and audit trails.',
    'Converting API values while debugging backend integrations.',
    'Preparing exact time values for tests, scripts, or support responses.'
  ],
  tips: [
    'Double-check whether the value is in seconds or milliseconds.',
    'Note the timezone when you share converted times with other people.',
    'Keep both formats in a ticket when engineers and non-engineers are collaborating.'
  ],
  faqs: [
    { q: 'Why are timestamps useful in systems?', a: 'They are compact and easy for software to compare, sort, and store across services.' },
    { q: 'What is the common source of timestamp mistakes?', a: 'Seconds versus milliseconds is the mistake that causes the biggest visible offset.' },
    { q: 'When should I convert timestamps manually?', a: 'Manual conversion is useful when you are reading logs, validating API behavior, or preparing reproducible bug reports.' }
  ],
  related: ['json-formatter', 'uuid-generator', 'jwt-decoder']
};

TOOL_SEO_GUIDES['jwt-decoder'] = {
  overview: 'A JWT decoder helps you inspect token headers and payload claims quickly when authentication issues are blocking a login or API call.',
  steps: [
    'Paste the token into the decoder input.',
    'Review the decoded header and payload claims.',
    'Check fields such as issuer, audience, subject, and expiry.'
  ],
  useCases: [
    'Checking whether a token expired before an API request.',
    'Inspecting claims during auth integration debugging.',
    'Reviewing test tokens shared between frontend and backend teams.'
  ],
  tips: [
    'Never treat decoding as full signature verification on its own.',
    'Avoid pasting production secrets or highly sensitive tokens into shared environments.',
    'Check exp, iat, and aud values first when auth behavior looks wrong.'
  ],
  faqs: [
    { q: 'Does decoding a JWT verify the signature?', a: 'No. Decoding reveals readable claims, but signature verification still requires the correct signing context.' },
    { q: 'What claims should I inspect first?', a: 'exp, iat, iss, aud, and sub usually explain most login and authorization failures.' },
    { q: 'Why use an online JWT decoder?', a: 'It speeds up debugging when you need a quick look at claims without opening a REPL or writing a script.' }
  ],
  related: ['json-formatter', 'timestamp-converter', 'password-generator']
};

TOOL_SEO_GUIDES['json-to-typescript'] = {
  overview: 'A JSON to TypeScript converter helps you turn sample payloads into starter interfaces so frontend work can move faster with fewer manual type definitions.',
  steps: [
    'Paste a representative JSON sample into the converter.',
    'Generate TypeScript interfaces or types from the payload shape.',
    'Review optional fields, nested arrays, and naming before copying the output.'
  ],
  useCases: [
    'Creating starter types for frontend API integration work.',
    'Generating quick mocks and fixtures for component development.',
    'Documenting data contracts during backend and frontend handoff.'
  ],
  tips: [
    'Use a realistic sample payload with optional fields when possible.',
    'Review inferred array and null types before shipping generated code.',
    'Treat the output as a strong starting point, not the final source of truth.'
  ],
  faqs: [
    { q: 'Why convert JSON to TypeScript?', a: 'It saves time when you need fast starter interfaces from an existing payload.' },
    { q: 'Should I edit the generated type definitions?', a: 'Yes. Generated output is best used as a draft you refine for naming, optionals, and shared models.' },
    { q: 'What makes a good sample payload?', a: 'A realistic payload that includes nested objects, arrays, and optional fields creates better starter types.' }
  ],
  related: ['json-formatter', 'markdown-to-html', 'uuid-generator']
};

TOOL_SEO_GUIDES['markdown-to-html'] = {
  overview: 'A Markdown to HTML converter is useful when docs, release notes, or content drafts need clean HTML for publishing systems and custom templates.',
  steps: [
    'Paste the Markdown source into the editor.',
    'Preview the rendered HTML and check headings, lists, and links.',
    'Copy the HTML output into your CMS, docs system, or email template.'
  ],
  useCases: [
    'Turning release notes or README content into publish-ready HTML.',
    'Preparing help-center articles and email blocks from Markdown drafts.',
    'Reviewing how Markdown syntax renders before deployment.'
  ],
  tips: [
    'Check tables, code blocks, and nested lists in preview before exporting.',
    'Keep original Markdown in version control even after converting to HTML.',
    'Use the HTML output as a draft, then test it in the target CMS or email client.'
  ],
  faqs: [
    { q: 'Why convert Markdown to HTML?', a: 'Many publishing systems accept HTML directly even when your drafting workflow starts in Markdown.' },
    { q: 'What should I verify after conversion?', a: 'Check links, code blocks, table rendering, and any custom HTML elements before publishing.' },
    { q: 'Who benefits from this converter?', a: 'Developers, technical writers, marketers, and support teams often use it during documentation workflows.' }
  ],
  related: ['html-minifier', 'slug-generator', 'word-counter']
};

TOOL_SEO_GUIDES['sql-formatter'] = {
  overview: 'A SQL formatter makes long queries easier to read by adding structure, spacing, and line breaks before review, debugging, or documentation.',
  steps: [
    'Paste the SQL query into the formatter.',
    'Format the statement so keywords, joins, and clauses are easier to scan.',
    'Copy the cleaned query back into your editor, ticket, or docs.'
  ],
  useCases: [
    'Reviewing large queries during debugging or peer review.',
    'Cleaning SQL examples before sharing them in docs and tickets.',
    'Making joins, filters, and nested conditions easier to inspect.'
  ],
  tips: [
    'Format before asking for query review so teammates can scan logic faster.',
    'Keep original indentation style consistent across your docs and snippets.',
    'Use formatting together with query analysis, not as a replacement for it.'
  ],
  faqs: [
    { q: 'Why format SQL before review?', a: 'Readable structure makes joins, conditions, and nested clauses much easier to inspect.' },
    { q: 'Can formatting improve query performance?', a: 'Formatting itself does not change performance, but it helps people spot logic issues faster.' },
    { q: 'When is an online SQL formatter useful?', a: 'It is useful for quick cleanup when you do not want to open a full editor or database client.' }
  ],
  related: ['diff-checker', 'json-formatter', 'html-minifier']
};

TOOL_SEO_GUIDES['char-counter'] = {
  overview: 'A character counter is useful when you need to fit text into platform limits for bios, forms, ad copy, prompts, or short messages.',
  steps: [
    'Paste or type the text into the editor.',
    'Review character, word, line, and space counts.',
    'Trim or rewrite the text until it fits your target limit.'
  ],
  useCases: [
    'Checking social captions, bios, and platform-specific limits.',
    'Reviewing short UI copy before it goes into a product screen.',
    'Validating form text for onboarding, support, or marketing flows.'
  ],
  tips: [
    'Watch both raw character count and spaces when a platform is strict.',
    'Shorten repeated phrasing before cutting important details.',
    'Keep a target limit in mind before you start editing.'
  ],
  faqs: [
    { q: 'What is the difference between a character counter and a word counter?', a: 'A character counter focuses on total characters and spacing, which matters for many strict platform limits.' },
    { q: 'Who uses character counters most often?', a: 'Marketers, writers, product teams, and support teams often rely on them for UI and channel limits.' },
    { q: 'Can a character counter help with social posts?', a: 'Yes. It is one of the fastest ways to check whether a draft will fit a platform before you publish.' }
  ],
  related: ['word-counter', 'text-case-converter', 'insta-caption']
};

TOOL_SEO_GUIDES['age-calculator'] = {
  overview: 'An age calculator helps you measure exact age from a birth date without manual date math, which is useful for forms, planning, and quick checks.',
  steps: [
    'Enter the birth date you want to measure from.',
    'Choose the target date if the tool supports age at a specific point in time.',
    'Review the result in years, months, and days.'
  ],
  useCases: [
    'Checking exact age for forms and eligibility steps.',
    'Calculating age on a future event date.',
    'Answering quick support or admin questions without manual math.'
  ],
  tips: [
    'Double-check the target date when age matters for an event or deadline.',
    'Use exact age rather than rough year math for official forms.',
    'Keep timezone and date format consistent when sharing results.'
  ],
  faqs: [
    { q: 'Why use an age calculator instead of manual subtraction?', a: 'It handles months, days, and leap year boundaries more accurately than rough year math.' },
    { q: 'Can I calculate age on a future date?', a: 'Yes, many age workflows depend on a target date rather than only the current date.' },
    { q: 'Where is exact age useful?', a: 'Forms, eligibility checks, planning, and scheduling often require more precision than a rough age estimate.' }
  ],
  related: ['dday-calculator', 'bmi-calculator', 'percent-calculator']
};

TOOL_SEO_GUIDES['bmi-calculator'] = {
  overview: 'A BMI calculator gives a fast body mass index estimate from height and weight so you can check a simple health-related metric in one step.',
  steps: [
    'Enter your height and weight values.',
    'Choose the correct unit system if the tool supports more than one.',
    'Review the BMI result and category range.'
  ],
  useCases: [
    'Checking a quick BMI estimate during personal health tracking.',
    'Comparing changes over time as weight changes.',
    'Preparing simple reference values before a health consultation.'
  ],
  tips: [
    'Use accurate recent measurements for better estimates.',
    'Treat BMI as a rough screening metric, not a full health assessment.',
    'Track the trend over time instead of overreacting to one reading.'
  ],
  faqs: [
    { q: 'What does BMI measure?', a: 'BMI estimates body mass index using height and weight to provide a simple screening value.' },
    { q: 'Is BMI a full health diagnosis?', a: 'No. It is a simple estimate and should be interpreted with broader health context when needed.' },
    { q: 'Why use an online BMI calculator?', a: 'It gives a fast, convenient estimate without manual formula work or spreadsheet setup.' }
  ],
  related: ['age-calculator', 'percent-calculator', 'unit-converter']
};

function buildToolGuideSection(toolId, toolData, toolType, lang) {
  if ((lang || 'en') !== 'en') return '';
  var guide = getToolSeoGuide(toolId, toolData, toolType);
  if (!guide) return '';
  var keyword = safeText(toolData && toolData.title && toolData.title.en, toolId);
  var purpose = safeText(toolData && toolData.desc && toolData.desc.en, 'browser-based utility');
  var sectionHub = toolType === 'webTool' ? getStaticPagePath('/dev-tools/', 'en') : getStaticPagePath('/utilities/', 'en');
  var relatedLinks = '';
  var relatedPool = toolType === 'webTool' ? webTools : consumerTools;
  var relatedPathPrefix = toolType === 'webTool' ? '/tools/web/' : '/tools/fun/';
  var relatedIds = Array.isArray(guide.related) ? guide.related : [];
  if (relatedIds.length) {
    for (var i = 0; i < relatedIds.length; i++) {
      var item = findCatalogItemById(relatedIds[i]);
      if (!item) continue;
      var itemPath = (webTools.some(function(tool) { return tool.id === item.id; }) ? '/tools/web/' : '/tools/fun/') + item.id + '/';
      relatedLinks += '<li><a href="' + href(itemPath) + '">' + escapeHtml(item.title.en || item.id) + '</a></li>';
    }
  } else {
    var fallbackRelated = getRelatedTools(toolId, relatedPool, relatedPathPrefix, 3);
    for (var r = 0; r < fallbackRelated.length; r++) {
      relatedLinks += '<li><a href="' + fallbackRelated[r].href + '">' + escapeHtml(fallbackRelated[r].label) + '</a></li>';
    }
  }
  var faqHtml = '';
  var faqItems = buildToolFaqItems(toolId, toolData, toolType, lang);
  for (var j = 0; j < faqItems.length; j++) {
    faqHtml += '<h3>' + escapeHtml(faqItems[j].q) + '</h3><p>' + escapeHtml(faqItems[j].a) + '</p>';
  }
  var stepsHtml = '';
  for (var s = 0; s < guide.steps.length; s++) stepsHtml += '<li>' + escapeHtml(guide.steps[s]) + '</li>';
  var useCasesHtml = '';
  for (var u = 0; u < guide.useCases.length; u++) useCasesHtml += '<li>' + escapeHtml(guide.useCases[u]) + '</li>';
  var tipsHtml = '';
  for (var t = 0; t < guide.tips.length; t++) tipsHtml += '<li>' + escapeHtml(guide.tips[t]) + '</li>';
  return '' +
    '<section class="insta-seo-content" aria-label="Tool guide">' +
      '<div class="insta-seo-card">' +
        '<h2>What is ' + escapeHtml(keyword) + '?</h2>' +
        '<p>' + escapeHtml(guide.overview) + '</p>' +
        '<p>' + escapeHtml(keyword) + ' helps when you need ' + escapeHtml(purpose) + ' in one tab instead of switching to desktop software or a temporary script.</p>' +
        '<h2>How to use this tool</h2>' +
        '<ol>' + stepsHtml + '</ol>' +
        '<h2>Common use cases</h2>' +
        '<ul>' + useCasesHtml + '</ul>' +
        '<h2>Tips for better results</h2>' +
        '<ul>' + tipsHtml + '</ul>' +
        '<h2>Example workflow</h2>' +
        '<pre><code>' + escapeHtml(getToolExample(toolId)) + '</code></pre>' +
        '<h2>FAQ</h2>' + faqHtml +
        (relatedLinks ? '<h2>Related tools</h2><ul>' + relatedLinks + '</ul>' : '') +
        '<h2>Browse more pages</h2>' +
        '<ul>' +
          '<li><a href="' + href(sectionHub) + '">Browse this topic hub</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/', 'en')) + '">See all tools</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/all-pages/', 'en')) + '">Open the full site directory</a></li>' +
        '</ul>' +
      '</div>' +
    '</section>';
}

function buildToolStructuredDataScripts(toolId, toolData, toolType, pagePath, lang) {
  var locale = lang || 'en';
  var sectionLabel = toolType === 'webTool' ? 'Developer Tools' : 'Utilities & Fun Tools';
  var sectionPath = toolType === 'webTool' ? '/dev-tools/' : '/utilities/';
  var schemas = [
    buildBreadcrumbSchema([
      { name: 'Home', url: absUrl(getStaticPagePath('/', locale)) },
      { name: sectionLabel, url: absUrl(getStaticPagePath(sectionPath, locale)) },
      { name: getLocalizedCatalogValue(toolData && toolData.title, locale, 'en') || toolId, url: absUrl(pagePath) }
    ]),
    buildToolSchema(toolData, pagePath, locale)
  ];
  var faqItems = buildToolFaqItems(toolId, toolData, toolType, locale);
  if (faqItems.length) schemas.push(buildFAQSchema(faqItems));
  return schemas.map(function(schema) {
    return '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>';
  }).join('');
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

function buildGameSeoContent(game, faqs, lang) {
  if (!game) return '';

  var locale = lang || 'en';
  var title = getLocalizedCatalogValue(game.title, locale, 'en') || game.id;
  var summary = getLocalizedCatalogValue(game.description, locale, 'en') || 'Free online brain training game.';
  var averageGuide = buildGameAverageGuide(game.id, game.category);
  var relatedGames = getRecommendedGames(game, 6);

  var relatedList = relatedGames.map(function(item) {
    var label = getLocalizedCatalogValue(item.title, locale, 'en') || item.id;
    return '<li><a href=\"' + href(getToolLocalePath('/games/' + item.id + '/', locale, 'ko')) + '\">' + escapeHtml(label) + '</a></li>';
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
        '<li><a href=\"' + href(getStaticPagePath('/games/', locale)) + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + href('/tools/web/') + '\">Web Developer Tools</a></li>' +
        '<li><a href=\"' + href('/tools/fun/') + '\">Daily Utility Tools</a></li>' +
        '<li><a href=\"' + href(getStaticPagePath('/dev-tools/', locale)) + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + href(getStaticPagePath('/utilities/', locale)) + '\">Utilities & Fun Tools</a></li>' +
        '<li><a href=\"' + href(getStaticPagePath('/all-pages/', locale)) + '\">Site Directory</a></li>' +
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
  if (toolId === 'password-generator') return 'length: 20\\noptions: upper, lower, numbers, symbols\\nresult: uP7!xL92#qT8vN4@dK1s';
  if (toolId === 'qr-generator') return 'type: URL\\nvalue: https://instaidea.org/tools/web/\\noutput: downloadable QR image';
  if (toolId === 'diff-checker') return 'old: Hello world\\nnew: Hello brave world';
  if (toolId === 'word-counter') return 'Draft length: 824 words\\nCharacters with spaces: 4,912';
  if (toolId === 'jwt-decoder') return 'header.alg: HS256\\npayload.sub: user_123\\npayload.exp: 1700000000';
  if (toolId === 'json-to-typescript') return '{\"id\":1,\"name\":\"Ada\"}\\n=> interface Example { id: number; name: string; }';
  return 'Input example\\nOutput example';
}

var HOME_FEATURED = {
  games: ['reaction-time', 'typing-speed', 'memory-number', 'visual-memory', 'stroop-test', 'word-puzzle'],
  web: ['password-generator', 'json-formatter', 'uuid-generator', 'qr-generator', 'regex-tester', 'timestamp-converter'],
  fun: ['pomodoro-focus', 'focus-music', 'world-clock', 'notepad', 'currency-converter', 'expense-tracker']
};

var HUB_UI = {
  ko: {
    eyebrow: 'Browser-first toolkit',
    heroTitle: '필요한 기능을 더 빨리 찾고 바로 실행하세요',
    heroIntro: '게임, 생활 유틸리티, 개발 도구를 한곳에 모았습니다. 회원가입 없이 바로 열리고, 기록은 브라우저에만 저장됩니다.',
    heroBrowse: '전체 디렉터리 보기',
    heroGames: '게임 보기',
    heroDev: '개발 도구 보기',
    heroUtilities: '생활 도구 보기',
    quickTitle: '빠른 이동',
    quickDesc: '처음 보는 사용자도 길을 잃지 않도록 주요 섹션부터 바로 안내합니다.',
    searchTitle: '원하는 기능 찾기',
    searchDesc: '게임 이름, 변환기, 생성기, 계산기, 타이머 같은 키워드로 바로 검색하세요.',
    searchPlaceholder: '예: 반응속도, JSON formatter, pomodoro, currency',
    resultsTitle: '검색 결과',
    resultsEmpty: '조건에 맞는 항목이 없습니다. 검색어를 바꾸거나 전체 디렉터리를 열어보세요.',
    findInSection: '이 섹션에서 찾기',
    findInSectionDesc: '제목과 설명 기준으로 즉시 필터링됩니다.',
    clearFilters: '필터 초기화',
    noMatches: '조건에 맞는 항목이 없습니다. 검색어를 줄이거나 전체 보기를 눌러보세요.',
    seeAll: '전체 보기',
    fastLabel: '왜 빠른가',
    badgeInstant: '설치 없이 즉시 실행',
    badgeNoSignup: '회원가입 없음',
    badgePrivate: '기록은 기기에만 저장',
    guideTitle: '이 섹션을 더 빠르게 쓰는 방법',
    guideOne: '먼저 검색으로 필요한 항목을 좁힌 뒤, 자주 쓰는 페이지를 브라우저에 고정해두세요.',
    guideTwo: '유사한 도구는 설명을 비교해 가장 짧은 경로의 페이지를 고르는 편이 효율적입니다.',
    dirGamesTitle: '브레인 게임',
    dirGamesDesc: '반응속도, 기억력, 집중력 테스트',
    dirDevTitle: '개발 도구',
    dirDevDesc: '포맷터, 생성기, 변환기, 검증기',
    dirUtilTitle: '생활 도구',
    dirUtilDesc: '집중, 기록, 계산, 개인 생산성',
    dirDirectoryTitle: '전체 디렉터리',
    dirDirectoryDesc: '모든 페이지를 한 번에 탐색',
    gamesLead: '짧게 플레이하며 집중력과 반응 속도를 확인할 수 있습니다.',
    webLead: '개발 중 바로 꺼내 쓰는 포맷터, 인코더, 생성기 중심입니다.',
    funLead: '일상 계산, 집중, 기록, 개인 생산성에 바로 쓰는 도구 모음입니다.',
    searchGameBadge: '게임',
    searchWebBadge: '개발 도구',
    searchFunBadge: '생활 도구'
  },
  en: {
    eyebrow: 'Browser-first toolkit',
    heroTitle: 'Find the right tool faster and launch it instantly',
    heroIntro: 'Games, daily utilities, and developer tools live in one place. Everything opens in-browser, with no signup and local-first score storage.',
    heroBrowse: 'Open full directory',
    heroGames: 'Browse games',
    heroDev: 'Browse dev tools',
    heroUtilities: 'Browse utilities',
    quickTitle: 'Quick paths',
    quickDesc: 'New visitors should understand the product surface in one glance.',
    searchTitle: 'Search what you need',
    searchDesc: 'Use keywords like timer, generator, formatter, calculator, or reaction to jump straight to the right page.',
    searchPlaceholder: 'Example: reaction, JSON formatter, pomodoro, currency',
    resultsTitle: 'Search results',
    resultsEmpty: 'No matching items found. Try a broader keyword or open the full directory.',
    findInSection: 'Find within this section',
    findInSectionDesc: 'Results update instantly from titles and descriptions.',
    clearFilters: 'Reset filters',
    noMatches: 'No matching items found. Reduce the keyword or open the full directory.',
    seeAll: 'See all',
    fastLabel: 'Why it feels fast',
    badgeInstant: 'Instant launch',
    badgeNoSignup: 'No signup',
    badgePrivate: 'Local-first records',
    guideTitle: 'How to use this section faster',
    guideOne: 'Start with search to narrow intent, then pin the pages you return to most.',
    guideTwo: 'When multiple pages seem similar, compare descriptions and choose the one with the shortest path to output.',
    dirGamesTitle: 'Brain games',
    dirGamesDesc: 'Reaction, memory, and focus tests',
    dirDevTitle: 'Developer tools',
    dirDevDesc: 'Formatters, generators, converters, validators',
    dirUtilTitle: 'Daily utilities',
    dirUtilDesc: 'Focus, tracking, calculations, personal workflow',
    dirDirectoryTitle: 'Full directory',
    dirDirectoryDesc: 'Browse every major page at once',
    gamesLead: 'Quick sessions to measure reaction speed, focus, and memory.',
    webLead: 'Formatters, encoders, and generators you can open during real work.',
    funLead: 'Practical tools for daily planning, tracking, and personal productivity.',
    searchGameBadge: 'Game',
    searchWebBadge: 'Dev tool',
    searchFunBadge: 'Utility'
  },
  ja: {
    eyebrow: 'Browser-first toolkit',
    heroTitle: '必要な機能をすばやく見つけてすぐ使えます',
    heroIntro: 'ゲーム、日常ツール、開発ツールを一か所にまとめました。会員登録なしで開き、記録はブラウザに保存されます。',
    heroBrowse: '全体ディレクトリを見る',
    heroGames: 'ゲームを見る',
    heroDev: '開発ツールを見る',
    heroUtilities: '生活ツールを見る',
    quickTitle: 'クイック移動',
    quickDesc: '初めて来た人でも主要な導線をすぐ理解できる構成です。',
    searchTitle: '必要な機能を検索',
    searchDesc: 'ゲーム名、タイマー、変換、生成、計算などのキーワードで直接探せます。',
    searchPlaceholder: '例: reaction, JSON formatter, pomodoro, currency',
    resultsTitle: '検索結果',
    resultsEmpty: '一致する項目がありません。別のキーワードか全体ディレクトリを試してください。',
    findInSection: 'このセクション内を検索',
    findInSectionDesc: 'タイトルと説明をもとにすぐ絞り込みます。',
    clearFilters: 'フィルターをリセット',
    noMatches: '一致する項目がありません。条件をゆるめるか全体表示を試してください。',
    seeAll: 'すべて見る',
    fastLabel: '速く使える理由',
    badgeInstant: 'すぐ起動',
    badgeNoSignup: '登録不要',
    badgePrivate: '記録は端末保存',
    guideTitle: 'このセクションを速く使うコツ',
    guideOne: 'まず検索で候補を絞り、よく使うページはブラウザに固定してください。',
    guideTwo: '似たページが複数ある場合は説明を比べ、最短で結果に届くページを選ぶのが効率的です。',
    dirGamesTitle: '脳トレゲーム',
    dirGamesDesc: '反応速度、記憶、集中テスト',
    dirDevTitle: '開発ツール',
    dirDevDesc: 'フォーマッタ、生成、変換、検証',
    dirUtilTitle: '生活ツール',
    dirUtilDesc: '集中、記録、計算、個人ワークフロー',
    dirDirectoryTitle: '全体ディレクトリ',
    dirDirectoryDesc: '主要ページをまとめて見る',
    gamesLead: '短時間で反応速度や集中力を確認できます。',
    webLead: '実作業中にすぐ開けるフォーマッタや生成ツールを中心にしています。',
    funLead: '日常の計算、記録、集中、個人の生産性にすぐ使える道具です。',
    searchGameBadge: 'ゲーム',
    searchWebBadge: '開発ツール',
    searchFunBadge: '生活ツール'
  }
};

function getHubUi(lang) {
  return HUB_UI[lang] || HUB_UI.en;
}

function findItemsByIds(items, ids) {
  return ids.map(function(id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }).filter(Boolean);
}

function getLocalizedItemPath(pathPrefix, itemId, lang) {
  return href(getToolLocalePath(pathPrefix + itemId + '/', lang, 'ko'));
}

function buildDirectoryCard(title, desc, cardHref, kicker) {
  return '' +
    '<a class="directory-card" href="' + cardHref + '">' +
      '<div class="directory-kicker">' + escapeHtml(kicker || '') + '</div>' +
      '<div class="directory-title">' + escapeHtml(title) + '</div>' +
      '<div class="directory-kicker">' + escapeHtml(desc) + '</div>' +
    '</a>';
}

function buildCatalogCard(item, options) {
  options = options || {};
  var lang = options.lang || 'en';
  var pathPrefix = options.pathPrefix || '/';
  var actionLabel = options.actionLabel || 'Open';
  var category = options.category || 'all';
  var categoryLabel = options.categoryLabel || '';
  var title = getLocalizedItemTitle(item, lang);
  var description = getLocalizedItemDescription(item, lang, 'Free online tool');
  var search = [item.id, title, description, categoryLabel].join(' ').toLowerCase();
  return '' +
    '<article class="game-card" data-search="' + escapeHtml(search) + '" data-category="' + escapeHtml(category) + '">' +
      (categoryLabel ? '<span class="game-category">' + escapeHtml(categoryLabel) + '</span>' : '') +
      '<div class="game-emoji">' + item.emoji + '</div>' +
      '<div class="game-title">' + escapeHtml(title) + '</div>' +
      '<div class="game-description">' + escapeHtml(description) + '</div>' +
      '<a href="' + getLocalizedItemPath(pathPrefix, item.id, lang) + '" class="play-btn">' + escapeHtml(actionLabel) + '</a>' +
    '</article>';
}

function buildCollectionFilterScript(options) {
  return '<script>(function(){' +
    'var cfg=' + JSON.stringify(options) + ';' +
    'var input=document.getElementById(cfg.searchId);' +
    'var grid=document.getElementById(cfg.gridId);' +
    'var empty=document.getElementById(cfg.emptyId);' +
    'var chipRoot=document.getElementById(cfg.chipGroupId);' +
    'if(!grid)return;' +
    'var cards=[].slice.call(grid.querySelectorAll(".game-card"));' +
    'var chips=chipRoot?[].slice.call(chipRoot.querySelectorAll("[data-filter-chip]")):[];' +
    'var active="all";' +
    'function apply(){' +
      'var q=input?(input.value||"").trim().toLowerCase():"";' +
      'var visible=0;' +
      'cards.forEach(function(card){' +
        'var matchesQuery=!q||((card.getAttribute("data-search")||"").indexOf(q)!==-1);' +
        'var matchesCategory=active==="all"||card.getAttribute("data-category")===active;' +
        'var show=matchesQuery&&matchesCategory;' +
        'card.classList.toggle("is-hidden",!show);' +
        'if(show)visible++;' +
      '});' +
      'if(empty)empty.classList.toggle("is-visible",visible===0);' +
    '}' +
    'chips.forEach(function(chip){chip.addEventListener("click",function(){active=chip.getAttribute("data-filter-chip")||"all";chips.forEach(function(node){node.classList.toggle("active",node===chip);});apply();});});' +
    'if(input)input.addEventListener("input",apply);' +
    'var reset=document.getElementById(cfg.resetId);' +
    'if(reset)reset.addEventListener("click",function(){if(input)input.value="";active="all";chips.forEach(function(node){node.classList.toggle("active",(node.getAttribute("data-filter-chip")||"all")==="all");});apply();});' +
    'apply();' +
  '})();</script>';
}

function buildHomeSearchScript(options) {
  return '<script>(function(){' +
    'var cfg=' + JSON.stringify(options) + ';' +
    'var input=document.getElementById(cfg.searchId);' +
    'var section=document.getElementById(cfg.sectionId);' +
    'var grid=document.getElementById(cfg.gridId);' +
    'var empty=document.getElementById(cfg.emptyId);' +
    'if(!input||!section||!grid)return;' +
    'function render(){' +
      'var q=(input.value||"").trim().toLowerCase();' +
      'if(q.length<2){section.hidden=true;grid.innerHTML="";if(empty)empty.classList.remove("is-visible");return;}' +
      'section.hidden=false;' +
      'var matches=cfg.items.filter(function(item){return item.search.indexOf(q)!==-1;}).slice(0,cfg.limit);' +
      'grid.innerHTML=matches.map(function(item){return item.html;}).join("");' +
      'if(empty)empty.classList.toggle("is-visible",matches.length===0);' +
    '}' +
    'input.addEventListener("input",render);' +
  '})();</script>';
}

function buildHubPageBody(options) {
  options = options || {};
  var lang = options.lang || 'en';
  var title = options.title || '';
  var subtitle = options.subtitle || '';
  var intro = options.intro || '';
  var items = options.items || [];
  var pathPrefix = options.pathPrefix || '/';
  var actionLabel = options.actionLabel || 'Open';
  var relatedGamesHref = href(getStaticPagePath('/games/', lang));
  var relatedDevToolsHref = href(getStaticPagePath('/dev-tools/', lang));
  var relatedUtilitiesHref = href(getStaticPagePath('/utilities/', lang));
  var cards = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemHref = pathPrefix + item.id + '/';
    if (pathPrefix === '/games/') itemHref = getToolLocalePath(itemHref, lang, 'ko');
    cards += '' +
      '<div class=\"game-card\">' +
        '<div class=\"game-emoji\">' + item.emoji + '</div>' +
        '<div class=\"game-title\">' + escapeHtml(getLocalizedItemTitle(item, lang)) + '</div>' +
        '<div class=\"game-description\">' + escapeHtml(getLocalizedItemDescription(item, lang, 'Free online tool')) + '</div>' +
        '<a href=\"' + href(itemHref) + '\" class=\"play-btn\">' + escapeHtml(actionLabel) + '</a>' +
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
        '<li><a href=\"' + relatedGamesHref + '\">Brain Training Games</a></li>' +
        '<li><a href=\"' + relatedDevToolsHref + '\">Developer Tools</a></li>' +
        '<li><a href=\"' + relatedUtilitiesHref + '\">Utilities & Fun Tools</a></li>' +
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

function buildGameSchema(game, pathname, lang) {
  var locale = lang || 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': getLocalizedCatalogValue(game.title, locale, 'en') || game.id,
    'alternateName': [game.title.ko, game.title.ja].filter(Boolean),
    'url': absUrl(pathname),
    'applicationCategory': 'Game',
    'operatingSystem': 'Any',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'inLanguage': ['ko', 'en', 'ja'],
    'browserRequirements': 'Requires JavaScript',
    'description': getLocalizedCatalogValue(game.description, locale, 'en') || 'Free online game'
  };
}

function buildToolSchema(tool, pathname, lang) {
  var locale = lang || 'en';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': getLocalizedCatalogValue(tool && tool.title, locale, 'en') || (tool.title.en || tool.title.ko),
    'alternateName': [tool.title.ko, tool.title.ja].filter(Boolean),
    'url': absUrl(pathname),
    'applicationCategory': 'Utility',
    'operatingSystem': 'Any',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'inLanguage': ['ko', 'en', 'ja'],
    'browserRequirements': 'Requires JavaScript',
    'description': getLocalizedCatalogValue(tool && tool.desc, locale, 'en') || tool.desc.en || tool.desc.ko
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

function buildRelatedSection(currentId, allItems, type, count, lang) {
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
    var itemHref = bp + item.id + '/';
    if (type === 'game') itemHref = getToolLocalePath(itemHref, lang || 'ko', 'ko');
    var displayLang = lang || 'ko';
    var displayTitle = itemTitle[displayLang] || itemTitle.en || itemTitle.ko || '';
    var displayDesc = itemDesc[displayLang] || itemDesc.en || itemDesc.ko || '';
    cards +=
      '<a href="' + href(itemHref) + '" class="related-card" data-related=\'' + relData + '\'>' +
      '<div class="related-emoji">' + item.emoji + '</div>' +
      '<div class="related-title" data-i18n-related-title>' + displayTitle + '</div>' +
      '<div class="related-desc" data-i18n-related-desc>' + displayDesc + '</div>' +
      '</a>';
  }

  var sectionTitle = type === 'game' ? 'More Brain Tests' : 'More Useful Tools';

  var relHeadingsEn = type === 'game' ? 'More Brain Tests' : 'More Useful Tools';
  var relHeadingsJa = type === 'game' ? 'もっと試す' : 'もっと便利なツール';
  return '<section class="related-section">' +
    '<h2 data-i18n-related-heading>' + sectionTitle + '</h2>' +
    '<div class="related-grid">' + cards + '</div>' +
    '<script>' +
    'window.addEventListener("load",function(){' +
    '(function patchRelated(lang){' +
    'document.querySelectorAll("[data-related]").forEach(function(card){' +
    'var d=JSON.parse(card.getAttribute("data-related"));' +
    'var t=card.querySelector("[data-i18n-related-title]");' +
    'var desc=card.querySelector("[data-i18n-related-desc]");' +
    'if(t&&d.title&&d.title[lang])t.textContent=d.title[lang];' +
    'if(desc&&d.desc&&d.desc[lang])desc.textContent=d.desc[lang];' +
    '});' +
    'var h=document.querySelector("[data-i18n-related-heading]");' +
    'if(h){' +
    'var headings={ko:"' + sectionTitle + '",en:"' + relHeadingsEn + '",ja:"' + relHeadingsJa + '"};' +
    'h.textContent=headings[lang]||headings.en;' +
    '}' +
    '})(window.currentLang||"ko");' +
    'if(typeof setLanguage==="function"){' +
    'var _origRelated=setLanguage;' +
    'setLanguage=function(lang){_origRelated(lang);' +
    'document.querySelectorAll("[data-related]").forEach(function(card){' +
    'var d=JSON.parse(card.getAttribute("data-related"));' +
    'var t=card.querySelector("[data-i18n-related-title]");' +
    'var desc=card.querySelector("[data-i18n-related-desc]");' +
    'if(t&&d.title&&d.title[lang])t.textContent=d.title[lang];' +
    'if(desc&&d.desc&&d.desc[lang])desc.textContent=d.desc[lang];' +
    '});};' +
    '}' +
    '});' +
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
    { q: 'How can I improve my number memory?', a: 'Practice chunking numbers into groups, create associations, and practice regularly. Most people can remember 7 plus or minus 2 digits.' },
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
function layout(title, pathname, body, includeAdScript, description, jsonLd, relatedContent, options) {
  options = options || {};
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
    relatedContent: relatedContent || '',
    locale: options.locale,
    defaultLang: options.defaultLang,
    alternateLocales: options.alternateLocales,
    localizedNavigation: options.localizedNavigation,
    includeI18nScript: options.includeI18nScript,
    ogImage: options.ogImage
  });
}

// Game generation wrappers that call template modules
var templateOptions = {
  getGameTitle: getGameTitle,
  getGameTitleScript: getGameTitleScript
};

// Generic game wrapper with JSON-LD, FAQ, and related content
function wrapGame(gameId, generateFn, koTitle, description, lang) {
  var locale = lang || 'ko';
  var gameHTML = generateFn(templateOptions);
  var game = games.find(function(g) { return g.id === gameId; });
  var canonicalPath = '/games/' + gameId + '/';
  var pathname = getToolLocalePath(canonicalPath, locale, 'ko');
  var alternateLocales = buildLocalePathMap(canonicalPath, STATIC_PAGE_LANGS, 'ko');
  var localizedTitle = game ? (getLocalizedCatalogValue(game.title, locale, 'en') || koTitle) : koTitle;

  // Build JSON-LD array: BreadcrumbList + WebApplication + FAQPage
  var breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: absUrl(getStaticPagePath('/', locale)) },
    { name: safeText(i18n[locale] && i18n[locale].gamesSection, 'Games'), url: absUrl(getStaticPagePath('/games/', locale)) },
    { name: localizedTitle, url: absUrl(pathname) }
  ]);
  var appSchema = game ? buildGameSchema(game, pathname, locale) : null;
  var faqs = gameFAQs[gameId] || defaultGameFAQ;
  var faqSchema = buildFAQSchema(faqs);

  var jsonLdArr = [breadcrumb];
  if (appSchema) jsonLdArr.push(appSchema);
  jsonLdArr.push(faqSchema);

  var seoContent = buildGameSeoContent(game, faqs, locale);
  var shareLabels = { ko: '⚡ 기록 공유', en: '⚡ Share Result', ja: '⚡ 記録をシェア' };
  var shareLabel = shareLabels[locale] || shareLabels.en;
  var shareSection = '<div style="text-align:center;margin:18px 0">' +
    '<button onclick="(function(){var r=window._shareResult||{title:document.title,text:document.title,url:window.location.href};window.openShareModal&&window.openShareModal(r);})()" ' +
    'style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;padding:12px 28px;border-radius:24px;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(102,126,234,0.4)">' +
    shareLabel + '</button></div>';
  var body = gameHTML + shareSection + seoContent;
  var related = buildRelatedSection(gameId, games, 'game', 6, locale);
  related += '' +
    '<section class=\"related-section\">' +
      '<h2>Browse More Categories</h2>' +
      '<div class=\"related-grid\">' +
        '<a href=\"' + href(getStaticPagePath('/games/', locale)) + '\" class=\"related-card\"><div class=\"related-emoji\">Games</div><div class=\"related-title\">Brain Training Games</div><div class=\"related-desc\">All reaction, memory, speed, and focus tests</div></a>' +
        '<a href=\"' + href(getStaticPagePath('/dev-tools/', locale)) + '\" class=\"related-card\"><div class=\"related-emoji\">Dev</div><div class=\"related-title\">Developer Tools</div><div class=\"related-desc\">Formatter, converter, validator, and builder tools</div></a>' +
        '<a href=\"' + href(getStaticPagePath('/utilities/', locale)) + '\" class=\"related-card\"><div class=\"related-emoji\">Util</div><div class=\"related-title\">Utilities & Fun</div><div class=\"related-desc\">Daily tools, calculators, and practical helpers</div></a>' +
      '</div>' +
    '</section>';

  var pageTitle = game ? buildGameSeoTitle(game, locale) : (koTitle + ' - Free Online Game');
  var pageDescription = game ? buildGameSeoDescription(game, locale) : description;

  var gameOgImage = BASE_URL + '/games/' + gameId + '/og-image.svg';
  return injectForcedPageLocale(
    layout(pageTitle, pathname, body, true, pageDescription, jsonLdArr, related, {
      locale: locale,
      defaultLang: 'ko',
      alternateLocales: alternateLocales,
      localizedNavigation: true,
      includeI18nScript: true,
      ogImage: gameOgImage
    }),
    locale
  );
}

function wrapReactionGame(lang) {
  return wrapGame(
    'reaction-time',
    generateReactionGame,
    'Reaction Time Test',
    'Test how quickly you react to a visual signal and improve your average response time.',
    lang
  );
}

function wrapMemoryNumberGame(lang) {
  return wrapGame(
    'memory-number',
    generateMemoryNumberGame,
    'Number Memory Test',
    'Memorize increasingly longer numbers and train short-term memory.',
    lang
  );
}

function wrapTypingSpeedGame(lang) {
  return wrapGame(
    'typing-speed',
    generateTypingSpeedGame,
    'Typing Speed Test',
    'Measure typing speed in WPM with accuracy tracking and repeat practice.',
    lang
  );
}

function wrapColorMatchGame(lang) {
  return wrapGame(
    'color-match',
    generateColorMatchGame,
    'Color Match Test',
    'Train focus and processing speed by matching text meaning and color.',
    lang
  );
}

function wrapMathQuizGame(lang) {
  return wrapGame(
    'math-quiz',
    generateMathQuizGame,
    'Math Quiz Game',
    'Solve mental math questions under time pressure and improve calculation speed.',
    lang
  );
}

function wrapPatternMemoryGame(lang) {
  return wrapGame(
    'pattern-memory',
    generatePatternMemoryGame,
    'Pattern Memory Test',
    'Remember visual patterns and repeat them correctly to advance levels.',
    lang
  );
}

function wrapClickSpeedGame(lang) {
  return wrapGame(
    'click-speed',
    generateClickSpeedGame,
    'Click Speed Test',
    'Measure how many clicks per second you can perform in a timed challenge.',
    lang
  );
}

function wrapAimTrainerGame(lang) {
  return wrapGame(
    'aim-trainer',
    generateAimTrainerGame,
    'Aim Trainer',
    'Practice target tracking, mouse control, and fast click accuracy.',
    lang
  );
}

function wrapSequenceMemoryGame(lang) {
  return wrapGame(
    'sequence-memory',
    generateSequenceMemoryGame,
    'Sequence Memory Test',
    'Remember and repeat number sequences in the correct order.',
    lang
  );
}

function wrapWordPuzzleGame(lang) {
  return wrapGame(
    'word-puzzle',
    generateWordPuzzleGame,
    'Word Puzzle Game',
    'Create valid words from letter sets and improve vocabulary recall.',
    lang
  );
}

function wrapVisualMemoryGame(lang) {
  return wrapGame(
    'visual-memory',
    generateVisualMemoryGame,
    'Visual Memory Test',
    'Memorize tile positions and test your visual recall under pressure.',
    lang
  );
}

function wrapStroopTestGame(lang) {
  return wrapGame(
    'stroop-test',
    generateStroopTestGame,
    'Stroop Test',
    'Test cognitive flexibility by identifying color under conflicting text cues.',
    lang
  );
}

function wrapVerbalMemoryGame(lang) {
  return wrapGame(
    'verbal-memory',
    generateVerbalMemoryGame,
    'Verbal Memory Test',
    'Decide whether words are new or previously seen to train verbal recall.',
    lang
  );
}

function wrapChimpTestGame(lang) {
  return wrapGame(
    'chimp-test',
    generateChimpTestGame,
    'Chimp Test',
    'Challenge short-term sequence memory with disappearing number targets.',
    lang
  );
}

function wrapHearingTestGame(lang) {
  return wrapGame(
    'hearing-test',
    generateHearingTestGame,
    'Hearing Test',
    'Check the highest audible frequency you can hear in a quick browser test.',
    lang
  );
}

function wrapColorBlindTestGame(lang) {
  return wrapGame(
    'color-blind-test',
    generateColorBlindTestGame,
    'Color Blind Test',
    'Find subtle color differences and assess color perception performance.',
    lang
  );
}

function wrapNumberSpeedGame(lang) {
  return wrapGame(
    'number-speed',
    generateNumberSpeedGame,
    'Number Speed Test',
    'Choose larger numbers quickly and improve comparison speed.',
    lang
  );
}

function wrapTargetTrackerGame(lang) {
  return wrapGame(
    'target-tracker',
    generateTargetTrackerGame,
    'Target Tracker',
    'Track a moving target and test hand-eye coordination in real time.',
    lang
  );
}

function writeLocalizedGamePages(gameId, renderFn) {
  var gameDir = path.join(OUT, 'games', gameId);
  for (var i = 0; i < STATIC_PAGE_LANGS.length; i++) {
    var lang = STATIC_PAGE_LANGS[i];
    write(path.join(gameDir, getToolLocaleFilename(lang, 'ko')), renderFn(lang));
  }
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
      title: i18n.ko.privacy.title + ' - 무료 게임 & 도구 | InstaIdea',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    en: {
      title: i18n.en.privacy.title + ' | Mini Games & Tools - InstaIdea',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    ja: {
      title: i18n.ja.privacy.title + ' - 無料ゲーム & ツール | InstaIdea',
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

function layout(title, pathname, body, includeAdScript, description, jsonLd, relatedContent, options) {
  options = options || {};
  return createLayout({
    title: title,
    description: description || (title + ' - Free mini games, browser tools, and utilities'),
    pathname: pathname,
    body: body,
    includeAdScript: includeAdScript,
    monetagSiteId: ADS_CLIENT,
    basePath: BASE_PATH,
    baseUrl: BASE_URL,
    i18nData: i18n,
    jsonLd: jsonLd,
    relatedContent: relatedContent || '',
    locale: options.locale,
    defaultLang: options.defaultLang,
    alternateLocales: options.alternateLocales,
    localizedNavigation: options.localizedNavigation,
    includeI18nScript: options.includeI18nScript,
    ogImage: options.ogImage
  });
}

function renderIndex() {
  var totalCount = games.length + webTools.length + consumerTools.length;

  writeLocalizedStaticPages(OUT, '/', function(lang) {
    var localizedMainTitle = safeText(i18n[lang] && i18n[lang].mainTitle, 'Mini Games & Tools Collection');
    var localizedMainDesc = safeText(i18n[lang] && i18n[lang].mainDesc, 'Fun games and useful tools in one place.');
    var localizedCount = formatLocalizedCount(i18n[lang] && i18n[lang].totalCount, totalCount);
    var localizedGamesTitle = safeText(i18n[lang] && i18n[lang].gamesSection, 'Brain Training Games');
    var localizedGamesDesc = safeText(i18n[lang] && i18n[lang].gamesSectionDesc, 'Reaction, memory, and focus tests.');
    var localizedWebToolsTitle = safeText(i18n[lang] && i18n[lang].webToolsSection, 'Developer Tools');
    var localizedWebToolsDesc = safeText(i18n[lang] && i18n[lang].webToolsSectionDesc, 'Useful tools for development workflows.');
    var localizedFunToolsTitle = safeText(i18n[lang] && i18n[lang].funToolsSection, 'Fun & Utility Tools');
    var localizedFunToolsDesc = safeText(i18n[lang] && i18n[lang].funToolsSectionDesc, 'Calculators, fun tools, and daily helpers.');
    var playLabel = safeText(i18n[lang] && i18n[lang].playBtn, 'Play');
    var useLabel = safeText(i18n[lang] && i18n[lang].useBtn, 'Use');
    var gameList = '';
    var webToolsList = '';
    var consumerToolsList = '';

    for (var i = 0; i < games.length; i++) {
      var g = games[i];
      gameList += '' +
        '<div class="game-card">' +
          '<div class="game-emoji">' + g.emoji + '</div>' +
          '<span class="game-category">' + escapeHtml(safeText(i18n[lang] && i18n[lang].categories && i18n[lang].categories[g.category], g.category)) + '</span>' +
          '<div class="game-title">' + escapeHtml(getLocalizedCatalogValue(g.title, lang, 'en')) + '</div>' +
          '<div class="game-description">' + escapeHtml(getLocalizedCatalogValue(g.description, lang, 'en')) + '</div>' +
          '<a href="' + href(getToolLocalePath('/games/' + g.id + '/', lang, 'ko')) + '" class="play-btn">' + escapeHtml(playLabel) + '</a>' +
        '</div>';
    }

    for (var j = 0; j < webTools.length; j++) {
      var webTool = webTools[j];
      webToolsList += '' +
        '<div class="game-card">' +
          '<div class="game-emoji">' + webTool.emoji + '</div>' +
          '<div class="game-title">' + escapeHtml(getLocalizedItemTitle(webTool, lang)) + '</div>' +
          '<div class="game-description">' + escapeHtml(getLocalizedItemDescription(webTool, lang, 'Free online tool')) + '</div>' +
          '<a href="' + href('/tools/web/' + webTool.id + '/') + '" class="play-btn">' + escapeHtml(useLabel) + '</a>' +
        '</div>';
    }

    for (var k = 0; k < consumerTools.length; k++) {
      var consumerTool = consumerTools[k];
      consumerToolsList += '' +
        '<div class="game-card">' +
          '<div class="game-emoji">' + consumerTool.emoji + '</div>' +
          '<div class="game-title">' + escapeHtml(getLocalizedItemTitle(consumerTool, lang)) + '</div>' +
          '<div class="game-description">' + escapeHtml(getLocalizedItemDescription(consumerTool, lang, 'Free online tool')) + '</div>' +
          '<a href="' + href('/tools/fun/' + consumerTool.id + '/') + '" class="play-btn">' + escapeHtml(useLabel) + '</a>' +
        '</div>';
    }

    var body =
      '<div class="header-section">' +
        '<h1>' + escapeHtml(localizedMainTitle) + '</h1>' +
        '<p style="text-align:center;font-size:20px;margin:16px 0;font-weight:500">' + escapeHtml(localizedMainDesc) + '</p>' +
        '<p style="text-align:center;font-size:16px;margin:8px 0;opacity:0.9">' + escapeHtml(localizedCount) + '</p>' +
      '</div>' +
      '<section class="seo-content">' +
        '<h2>Explore by Directory</h2>' +
        '<p>Use section directories to find tools faster and help crawlers understand topic clusters.</p>' +
        '<ul>' +
          '<li><a href="' + href(getStaticPagePath('/tools/web/', lang)) + '">Web Developer Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/fun/', lang)) + '">Utility Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/all-pages/', lang)) + '">Full Site Directory</a></li>' +
        '</ul>' +
      '</section>' +
      '<div style="margin:40px 0 20px">' +
        '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px">' + escapeHtml(localizedGamesTitle) + '</h2>' +
        '<p style="text-align:center;color:#94a3b8;margin-bottom:30px">' + escapeHtml(localizedGamesDesc) + '</p>' +
      '</div>' +
      '<div class="grid">' + gameList + '</div>' +
      '<div style="margin:60px 0 20px">' +
        '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px">' + escapeHtml(localizedWebToolsTitle) + '</h2>' +
        '<p style="text-align:center;color:#94a3b8;margin-bottom:30px">' + escapeHtml(localizedWebToolsDesc) + '</p>' +
      '</div>' +
      '<div class="grid">' + webToolsList + '</div>' +
      '<div style="margin:60px 0 20px">' +
        '<h2 style="font-size:2rem;text-align:center;margin-bottom:10px">' + escapeHtml(localizedFunToolsTitle) + '</h2>' +
        '<p style="text-align:center;color:#94a3b8;margin-bottom:30px">' + escapeHtml(localizedFunToolsDesc) + '</p>' +
      '</div>' +
      '<div class="grid">' + consumerToolsList + '</div>';

    var websiteSchema = buildWebSiteSchema();
    websiteSchema.url = absUrl(getStaticPagePath('/', lang));
    websiteSchema.description = localizedMainDesc;

    return {
      title: safeText(i18n[lang] && i18n[lang].siteTitle, 'Mini Games & Tools Collection'),
      description: localizedMainDesc + ' ' + localizedCount,
      body: body,
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: [
        websiteSchema,
        buildItemListSchema([
          { name: 'Online Tools Directory', url: absUrl(getStaticPagePath('/tools/', lang)) },
          { name: localizedGamesTitle, url: absUrl(getStaticPagePath('/games/', lang)) },
          { name: 'Developer Tools', url: absUrl(getStaticPagePath('/dev-tools/', lang)) },
          { name: 'Utilities & Fun Tools', url: absUrl(getStaticPagePath('/utilities/', lang)) },
          { name: 'Web Developer Tools Directory', url: absUrl(getStaticPagePath('/tools/web/', lang)) },
          { name: 'Utility Tools Directory', url: absUrl(getStaticPagePath('/tools/fun/', lang)) },
          { name: 'Full Site Directory', url: absUrl(getStaticPagePath('/all-pages/', lang)) }
        ], 'Site Hub Pages'),
        buildItemListSchema(games.map(function(g) {
          return { name: getLocalizedCatalogValue(g.title, lang, 'en'), url: absUrl(getToolLocalePath('/games/' + g.id + '/', lang, 'ko')) };
        }), localizedGamesTitle),
        buildItemListSchema(webTools.map(function(t) {
          return { name: getLocalizedItemTitle(t, lang), url: absUrl('/tools/web/' + t.id + '/') };
        }), localizedWebToolsTitle),
        buildItemListSchema(consumerTools.map(function(t) {
          return { name: getLocalizedItemTitle(t, lang), url: absUrl('/tools/fun/' + t.id + '/') };
        }), localizedFunToolsTitle)
      ]
    };
  });
}

function buildHubSeoTitle(title, lang) {
  var suffixes = {
    ko: ' - 무료 온라인 컬렉션 | InstaIdea',
    ja: ' - 無料オンライン一覧 | InstaIdea',
    en: ' | Free Browser Collection - InstaIdea'
  };
  return title + (suffixes[lang] || suffixes.en);
}

function renderSectionHubs() {
  function hubCollectionSchema(name, canonicalPath, description, items, lang, itemPathPrefix) {
    return [
      buildBreadcrumbSchema([
        { name: 'Home', url: absUrl(getStaticPagePath('/', lang)) },
        { name: name, url: absUrl(getStaticPagePath(canonicalPath, lang)) }
      ]),
      buildCollectionPageSchema(name, getStaticPagePath(canonicalPath, lang), description),
      buildItemListSchema(items.map(function(item) {
        var itemUrl = itemPathPrefix + item.id + '/';
        if (itemPathPrefix === '/games/') itemUrl = getToolLocalePath(itemUrl, lang, 'ko');
        return {
          name: getLocalizedItemTitle(item, lang),
          url: absUrl(itemUrl)
        };
      }), name)
    ];
  }

  writeLocalizedStaticPages(path.join(OUT, 'games'), '/games/', function(lang) {
    var title = safeText(i18n[lang] && i18n[lang].gamesSection, 'Brain Training Games');
    var intro = safeText(i18n[lang] && i18n[lang].gamesSectionDesc, 'Reaction, memory, focus, and speed challenges.');
    return {
      title: buildHubSeoTitle(title, lang),
      description: (intro + ' ' + formatLocalizedCount(i18n[lang] && i18n[lang].gameCount, games.length) + (lang === 'ko' ? ' 무료 온라인 게임, 설치 없이 플레이.' : lang === 'ja' ? '無料ブラウザゲーム、インストール不要。' : '')).trim(),
      body: buildHubPageBody({
        lang: lang,
        title: title,
        subtitle: formatLocalizedCount(i18n[lang] && i18n[lang].gameCount, games.length),
        intro: intro,
        items: games,
        pathPrefix: '/games/',
        actionLabel: safeText(i18n[lang] && i18n[lang].playBtn, 'Play')
      }),
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: hubCollectionSchema(title, '/games/', intro, games, lang, '/games/')
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'dev-tools'), '/dev-tools/', function(lang) {
    var title = safeText(i18n[lang] && i18n[lang].webToolsSection, 'Developer Tools');
    var intro = safeText(i18n[lang] && i18n[lang].webToolsSectionDesc, 'Useful browser-based tools for technical workflows.');
    return {
      title: buildHubSeoTitle(title, lang),
      description: (intro + ' ' + webTools.length + '+ browser tools.' + (lang === 'ko' ? ' 설치 없이 브라우저에서 무료로 사용.' : lang === 'ja' ? 'ブラウザで無料利用可能。' : '')).trim(),
      body: buildHubPageBody({
        lang: lang,
        title: title,
        subtitle: webTools.length + '+ Free Browser Tools',
        intro: intro,
        items: webTools,
        pathPrefix: '/tools/web/',
        actionLabel: safeText(i18n[lang] && i18n[lang].useBtn, 'Use')
      }),
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: hubCollectionSchema(title, '/dev-tools/', intro, webTools, lang, '/tools/web/')
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'utilities'), '/utilities/', function(lang) {
    var title = safeText(i18n[lang] && i18n[lang].funToolsSection, 'Utilities & Fun Tools');
    var intro = safeText(i18n[lang] && i18n[lang].funToolsSectionDesc, 'Everyday helpers, calculators, and lightweight fun tools.');
    return {
      title: buildHubSeoTitle(title, lang),
      description: (intro + ' ' + consumerTools.length + '+ utility tools.' + (lang === 'ko' ? ' 무료 온라인 유틸리티, 설치 없이 사용.' : lang === 'ja' ? '無料オンラインツール、登録不要。' : '')).trim(),
      body: buildHubPageBody({
        lang: lang,
        title: title,
        subtitle: consumerTools.length + '+ Free Daily Utilities',
        intro: intro,
        items: consumerTools,
        pathPrefix: '/tools/fun/',
        actionLabel: safeText(i18n[lang] && i18n[lang].useBtn, 'Use')
      }),
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: hubCollectionSchema(title, '/utilities/', intro, consumerTools, lang, '/tools/fun/')
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'tools', 'web'), '/tools/web/', function(lang) {
    var title = 'Web Developer Tools Directory';
    var intro = 'Browse all developer-focused browser tools in one directory.';
    return {
      title: buildHubSeoTitle(title, lang),
      description: intro,
      body: buildHubPageBody({
        lang: lang,
        title: title,
        subtitle: webTools.length + '+ Technical Tools',
        intro: intro,
        items: webTools,
        pathPrefix: '/tools/web/',
        actionLabel: safeText(i18n[lang] && i18n[lang].useBtn, 'Use')
      }),
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: hubCollectionSchema(title, '/tools/web/', intro, webTools, lang, '/tools/web/')
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'tools', 'fun'), '/tools/fun/', function(lang) {
    var title = 'Utility Tools Directory';
    var intro = 'Browse all utility and lifestyle-friendly tools in one place.';
    return {
      title: buildHubSeoTitle(title, lang),
      description: intro,
      body: buildHubPageBody({
        lang: lang,
        title: title,
        subtitle: consumerTools.length + '+ Everyday Tools',
        intro: intro,
        items: consumerTools,
        pathPrefix: '/tools/fun/',
        actionLabel: safeText(i18n[lang] && i18n[lang].useBtn, 'Use')
      }),
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: hubCollectionSchema(title, '/tools/fun/', intro, consumerTools, lang, '/tools/fun/')
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'tools'), '/tools/', function(lang) {
    var body = '' +
      '<div class="header-section">' +
        '<h1>Online Tools Directory</h1>' +
        '<p style="text-align:center;font-size:18px;margin:12px 0;opacity:0.95">Developer tools and daily utilities in one place</p>' +
      '</div>' +
      '<section class="seo-content">' +
        '<h2>Tools Categories</h2>' +
        '<p>This directory separates technical tools and everyday utilities into clear categories.</p>' +
        '<ul>' +
          '<li><a href="' + href(getStaticPagePath('/tools/web/', lang)) + '">Web Developer Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/fun/', lang)) + '">Utility Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/dev-tools/', lang)) + '">Developer Tools</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/utilities/', lang)) + '">Utilities & Fun Tools</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/games/', lang)) + '">Brain Training Games</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/all-pages/', lang)) + '">Full Site Directory</a></li>' +
        '</ul>' +
      '</section>';
    return {
      title: 'Online Tools Directory - InstaIdea',
      description: 'Developer tools and utility directories for the full site.',
      body: body,
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl(getStaticPagePath('/', lang)) },
          { name: 'Online Tools Directory', url: absUrl(getStaticPagePath('/tools/', lang)) }
        ]),
        buildCollectionPageSchema('Online Tools Directory', getStaticPagePath('/tools/', lang), 'Top-level tools directory for developer and utility categories.')
      ]
    };
  });

  writeLocalizedStaticPages(path.join(OUT, 'all-pages'), '/all-pages/', function(lang) {
    var toList = function(items, pathPrefix) {
      var html = '';
      for (var i = 0; i < items.length; i++) {
        var itemHref = pathPrefix + items[i].id + '/';
        if (pathPrefix === '/games/') itemHref = getToolLocalePath(itemHref, lang, 'ko');
        html += '<li><a href="' + href(itemHref) + '">' + escapeHtml(getLocalizedItemTitle(items[i], lang)) + '</a></li>';
      }
      return html;
    };

    var body = '' +
      '<div class="header-section">' +
        '<h1>Full Site Directory</h1>' +
        '<p style="text-align:center;font-size:18px;margin:12px 0;opacity:0.95">Browse every major page by section</p>' +
      '</div>' +
      '<section class="seo-content">' +
        '<h2>Core Hubs</h2>' +
        '<ul>' +
          '<li><a href="' + href(getStaticPagePath('/', lang)) + '">Home</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/', lang)) + '">Online Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/games/', lang)) + '">Brain Training Games</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/dev-tools/', lang)) + '">Developer Tools</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/utilities/', lang)) + '">Utilities & Fun Tools</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/web/', lang)) + '">Web Developer Tools Directory</a></li>' +
          '<li><a href="' + href(getStaticPagePath('/tools/fun/', lang)) + '">Utility Tools Directory</a></li>' +
        '</ul>' +
        '<h2>All Brain Training Games</h2>' +
        '<ul>' + toList(games, '/games/') + '</ul>' +
        '<h2>All Web Developer Tools</h2>' +
        '<ul>' + toList(webTools, '/tools/web/') + '</ul>' +
        '<h2>All Utility Tools</h2>' +
        '<ul>' + toList(consumerTools, '/tools/fun/') + '</ul>' +
      '</section>';

    var allPageLinks = [{ name: 'Home', url: absUrl(getStaticPagePath('/', lang)) }]
      .concat(games.map(function(item) { return { name: getLocalizedItemTitle(item, lang), url: absUrl(getToolLocalePath('/games/' + item.id + '/', lang, 'ko')) }; }))
      .concat(webTools.map(function(item) { return { name: getLocalizedItemTitle(item, lang), url: absUrl('/tools/web/' + item.id + '/') }; }))
      .concat(consumerTools.map(function(item) { return { name: getLocalizedItemTitle(item, lang), url: absUrl('/tools/fun/' + item.id + '/') }; }));

    return {
      title: 'Full Site Directory - InstaIdea',
      description: 'Complete directory of games, developer tools, and utilities.',
      body: body,
      includeAdScript: true,
      includeI18nScript: false,
      jsonLd: [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl(getStaticPagePath('/', lang)) },
          { name: 'Full Site Directory', url: absUrl(getStaticPagePath('/all-pages/', lang)) }
        ]),
        buildCollectionPageSchema('Full Site Directory', getStaticPagePath('/all-pages/', lang), 'Complete internal links page for all major sections and tools.'),
        buildItemListSchema(allPageLinks, 'Full Site Directory')
      ]
    };
  });
}

function renderPrivacy() {
  var privacyMeta = {
    ko: {
      title: safeText(i18n.ko && i18n.ko.privacy && i18n.ko.privacy.title, 'Privacy Policy') + ' - 무료 게임 & 도구 | InstaIdea',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    en: {
      title: safeText(i18n.en && i18n.en.privacy && i18n.en.privacy.title, 'Privacy Policy') + ' | Mini Games & Tools - InstaIdea',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    },
    ja: {
      title: safeText(i18n.ja && i18n.ja.privacy && i18n.ja.privacy.title, 'Privacy Policy') + ' - 無料ゲーム & ツール | InstaIdea',
      description: 'Privacy policy for cookies, ads, local storage, and third-party services.'
    }
  };
  var today = new Date().toISOString().split('T')[0];

  writeLocalizedStaticPages(path.join(OUT, 'privacy'), '/privacy/', function(lang) {
    var privacy = (i18n[lang] && i18n[lang].privacy) || (i18n.en && i18n.en.privacy) || {};
    var body =
      '<h1>' + escapeHtml(privacy.heading || privacyMeta[lang].title) + '</h1>' +
      '<div class="game-card">' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section1Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section1Desc || '') + '</p>' +
        '<ul style="color:#555">' +
          '<li>' + escapeHtml(privacy.section1Item1 || '') + '</li>' +
          '<li>' + escapeHtml(privacy.section1Item2 || '') + '</li>' +
          '<li>' + escapeHtml(privacy.section1Item3 || '') + '</li>' +
          '<li>' + escapeHtml(privacy.section1Item4 || '') + '</li>' +
        '</ul>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section2Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section2Desc1 || '') + '</p>' +
        '<p style="color:#555"><span>' + escapeHtml(privacy.section2Desc2 || '') + '</span> <a href="https://www.google.com/settings/ads" style="color:#667eea" target="_blank" rel="noopener">' + escapeHtml(privacy.section2Link || 'Google Ad Settings') + '</a></p>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section3Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section3Desc || '') + '</p>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section4Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section4Desc || '') + '</p>' +
        '<ul style="color:#555">' +
          '<li>' + escapeHtml(privacy.section4Item1 || '') + '</li>' +
          '<li>' + escapeHtml(privacy.section4Item2 || '') + '</li>' +
        '</ul>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section5Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section5Desc || '') + '</p>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section6Title || '') + '</h3>' +
        '<p style="color:#555"><span>' + escapeHtml(privacy.section6Desc || '') + '</span> <a href="mailto:pjhk579700@naver.com" style="color:#667eea">pjhk579700@naver.com</a></p>' +
        '<h3 style="color:#333">' + escapeHtml(privacy.section7Title || '') + '</h3>' +
        '<p style="color:#555">' + escapeHtml(privacy.section7Desc || '') + '</p>' +
        '<p style="color:#555"><span>' + escapeHtml(privacy.lastUpdate || 'Last updated: ') + '</span>' + today + '</p>' +
      '</div>';

    return {
      title: privacyMeta[lang].title,
      description: privacyMeta[lang].description,
      body: body,
      includeAdScript: false,
      includeI18nScript: false,
      jsonLd: [
        buildBreadcrumbSchema([
          { name: 'Home', url: absUrl(getStaticPagePath('/', lang)) },
          { name: 'Privacy Policy', url: absUrl(getStaticPagePath('/privacy/', lang)) }
        ])
      ]
    };
  });
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

function createLegacyRepoPathMirror() {
  if (!LEGACY_REPO_PATH) return;
  var legacyDir = path.join(OUT, LEGACY_REPO_PATH);
  ensureDir(legacyDir);
  var entries = fs.readdirSync(OUT, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (entry.name === LEGACY_REPO_PATH) continue;
    var srcPath = path.join(OUT, entry.name);
    var destPath = path.join(legacyDir, entry.name);
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
    seoTitle: buildToolSeoTitle(toolId, toolData, toolType, 'en'),
    seoDescription: buildToolSeoDescription(toolId, toolData, toolType, 'en', categoryLabel),
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
        defaultLang: defaultLang,
        toolId: toolId,
        toolData: toolData,
        toolType: toolType
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
      defaultLang: defaultLang,
      toolId: toolId,
      toolData: toolData,
      toolType: toolType
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
  writeLocalizedGamePages('reaction-time', wrapReactionGame);
  writeLocalizedGamePages('memory-number', wrapMemoryNumberGame);
  writeLocalizedGamePages('typing-speed', wrapTypingSpeedGame);
  writeLocalizedGamePages('color-match', wrapColorMatchGame);
  writeLocalizedGamePages('math-quiz', wrapMathQuizGame);
  writeLocalizedGamePages('pattern-memory', wrapPatternMemoryGame);
  writeLocalizedGamePages('click-speed', wrapClickSpeedGame);
  writeLocalizedGamePages('aim-trainer', wrapAimTrainerGame);
  writeLocalizedGamePages('sequence-memory', wrapSequenceMemoryGame);
  writeLocalizedGamePages('word-puzzle', wrapWordPuzzleGame);
  writeLocalizedGamePages('visual-memory', wrapVisualMemoryGame);
  writeLocalizedGamePages('stroop-test', wrapStroopTestGame);
  writeLocalizedGamePages('verbal-memory', wrapVerbalMemoryGame);
  writeLocalizedGamePages('chimp-test', wrapChimpTestGame);
  writeLocalizedGamePages('hearing-test', wrapHearingTestGame);
  writeLocalizedGamePages('color-blind-test', wrapColorBlindTestGame);
  writeLocalizedGamePages('number-speed', wrapNumberSpeedGame);
  writeLocalizedGamePages('target-tracker', wrapTargetTrackerGame);

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
  var staticCanonicalEntries = [
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
  var staticEntries = buildLocalizedStaticEntries(staticCanonicalEntries, STATIC_PAGE_LANGS, 'ko');
  var gameEntries = buildLocalizedStaticEntries(games.map(function(game) {
    return { url: '/games/' + game.id + '/', priority: '0.8', changefreq: 'monthly' };
  }), STATIC_PAGE_LANGS, 'ko');
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

  write(path.join(OUT, 'sw.js'), [
    'self.addEventListener("install", function(){ self.skipWaiting(); });',
    'self.addEventListener("activate", function(event){ event.waitUntil(self.clients.claim()); });',
    'self.addEventListener("fetch", function(){});'
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

  // ===== Per-game OG Images =====
  var gameGradients = {
    'reaction-time':  ['#f7971e', '#ffd200'],
    'memory-number':  ['#4776E6', '#8E54E9'],
    'typing-speed':   ['#f7971e', '#ffd200'],
    'color-match':    ['#11998e', '#38ef7d'],
    'math-quiz':      ['#0575E6', '#021B79'],
    'pattern-memory': ['#4776E6', '#8E54E9'],
    'click-speed':    ['#f093fb', '#f5576c'],
    'aim-trainer':    ['#11998e', '#38ef7d'],
    'sequence-memory':['#4776E6', '#8E54E9'],
    'word-puzzle':    ['#f7971e', '#ffd200'],
    'visual-memory':  ['#667eea', '#764ba2'],
    'stroop-test':    ['#0575E6', '#021B79'],
    'verbal-memory':  ['#4776E6', '#8E54E9'],
    'chimp-test':     ['#11998e', '#38ef7d'],
    'hearing-test':   ['#56ccf2', '#2f80ed'],
    'color-blind-test':['#11998e', '#38ef7d'],
    'number-speed':   ['#f093fb', '#f5576c'],
    'target-tracker': ['#11998e', '#38ef7d']
  };
  games.forEach(function(game) {
    var grads = gameGradients[game.id] || ['#667eea', '#764ba2'];
    var enTitle = (game.title && game.title.en) ? escapeHtml(game.title.en) : escapeHtml(game.id);
    var emoji = escapeHtml(game.emoji || '🎮');
    var gameSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">' +
      '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" style="stop-color:' + grads[0] + '"/>' +
      '<stop offset="100%" style="stop-color:' + grads[1] + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="1200" height="630" fill="url(#bg)"/>' +
      '<text x="600" y="230" text-anchor="middle" fill="white" font-size="160" font-family="Segoe UI Emoji,Apple Color Emoji,sans-serif">' + emoji + '</text>' +
      '<text x="600" y="360" text-anchor="middle" fill="white" font-size="68" font-weight="bold" font-family="Arial,sans-serif">' + enTitle + '</text>' +
      '<text x="600" y="440" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="32" font-family="Arial,sans-serif">Free Online Game</text>' +
      '<text x="600" y="530" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="26" font-family="Arial,sans-serif">InstaIdea · ' + escapeHtml(SITE_HOST) + '</text>' +
      '</svg>';
    var gameOgDir = path.join(OUT, 'games', game.id);
    if (!fs.existsSync(gameOgDir)) fs.mkdirSync(gameOgDir, { recursive: true });
    write(path.join(gameOgDir, 'og-image.svg'), gameSvg);
  });

  if (!BASE_PATH && LEGACY_REPO_PATH) {
    createLegacyRepoPathMirror();
  }

  console.log('Generated ' + games.length + ' game(s), ' + webTools.length + ' web tool(s), ' + consumerTools.length + ' consumer tool(s), and main page');
  console.log('SEO enhancements: JSON-LD, enhanced sitemap, manifest.json, OG image, related content sections');
}

build();


