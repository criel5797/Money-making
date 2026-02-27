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
var BASE_URL = RAW_BASE_URL;

var repoEnv = (process.env.GITHUB_REPOSITORY || '');
var repoName = repoEnv.split('/')[1] || '';
var autoBasePath = repoName ? '/' + repoName : '';
var BASE_PATH = BASE_URL
  ? (new URL(BASE_URL).pathname.replace(/\/$/, '') || '')
  : (process.env.BASE_PATH || autoBasePath);

var ADS_CLIENT = process.env.MONETAG_SITE_ID || '';
var PUB_ID = ADS_CLIENT.replace('ca-pub-', '');

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function write(p, c){ ensureDir(path.dirname(p)); fs.writeFileSync(p, c); }
function href(p){ return BASE_PATH + p; }
function absUrl(p){ return BASE_URL + p; }

// ===== JSON-LD Structured Data Generators =====

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'InstaIdea - Mini Games & Tools',
    'alternateName': ['미니게임 & 도구 모음집', 'ミニゲーム＆ツールコレクション'],
    'url': BASE_URL + '/',
    'description': 'Free brain training games, developer tools, and fun utilities',
    'inLanguage': ['ko', 'en', 'ja'],
    'potentialAction': {
      '@type': 'SearchAction',
      'target': BASE_URL + '/?q={search_term_string}',
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

  var sectionTitle = type === 'game' ? '관련 게임' : '관련 도구';

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
    'var headings={ko:"' + sectionTitle + '",en:"' + (type === 'game' ? 'Related Games' : 'Related Tools') + '",ja:"' + (type === 'game' ? '関連ゲーム' : '関連ツール') + '"};' +
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
    { q: 'How can I improve my number memory?', a: 'Practice chunking numbers into groups, create associations, and practice regularly. Most people can remember 7±2 digits.' },
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
    description: description || title + ' - 무료 두뇌 훈련 미니게임. 반응속도, 기억력, 집중력을 테스트하세요!',
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
    { name: 'Games', url: absUrl('/') + '#games' },
    { name: game ? (game.title.en || game.title.ko) : koTitle, url: absUrl(pathname) }
  ]);
  var appSchema = game ? buildGameSchema(game, pathname) : null;
  var faqs = gameFAQs[gameId] || defaultGameFAQ;
  var faqSchema = buildFAQSchema(faqs);

  var jsonLdArr = [breadcrumb];
  if (appSchema) jsonLdArr.push(appSchema);
  jsonLdArr.push(faqSchema);

  var related = buildRelatedSection(gameId, games, 'game', 4);

  return layout(koTitle, pathname, gameHTML, true, description, jsonLdArr, related);
}

function wrapReactionGame() {
  return wrapGame('reaction-time', generateReactionGame, '순발력 테스트',
    '무료 반응속도 테스트 게임. 초록색이 되면 최대한 빠르게 클릭하여 당신의 반응속도를 측정하세요!');
}

function wrapMemoryNumberGame() {
  return wrapGame('memory-number', generateMemoryNumberGame, '숫자 기억력',
    '무료 숫자 기억력 테스트. 점점 길어지는 숫자를 기억하고 입력하여 기억력을 향상시키세요!');
}

function wrapTypingSpeedGame() {
  return wrapGame('typing-speed', generateTypingSpeedGame, '타이핑 속도',
    '무료 타이핑 속도 테스트. 문장을 빠르고 정확하게 타이핑하여 WPM을 측정하세요!');
}

function wrapColorMatchGame() {
  return wrapGame('color-match', generateColorMatchGame, '색깔 맞추기',
    '무료 색깔 맞추기 게임. 글자의 색깔과 의미가 일치하는지 빠르게 판단하여 집중력을 테스트하세요!');
}

function wrapMathQuizGame() {
  return wrapGame('math-quiz', generateMathQuizGame, '암산 게임',
    '무료 암산 게임. 수학 문제를 빠르게 풀어 두뇌를 훈련하고 계산 능력을 향상시키세요!');
}

function wrapPatternMemoryGame() {
  return wrapGame('pattern-memory', generatePatternMemoryGame, '패턴 기억',
    '무료 패턴 기억 게임. 깜빡이는 패턴을 기억하고 순서대로 클릭하여 시각적 기억력을 훈련하세요!');
}

function wrapClickSpeedGame() {
  return wrapGame('click-speed', generateClickSpeedGame, '클릭 속도',
    '무료 클릭 속도 테스트. 10초 동안 최대한 많이 클릭하여 CPS(초당 클릭 수)를 측정하세요!');
}

function wrapAimTrainerGame() {
  return wrapGame('aim-trainer', generateAimTrainerGame, '목표물 클릭',
    '무료 에임 트레이너 게임. 나타나는 원을 빠르게 클릭하여 마우스 정확도와 반응속도를 훈련하세요!');
}

function wrapSequenceMemoryGame() {
  return wrapGame('sequence-memory', generateSequenceMemoryGame, '순서 기억',
    '무료 순서 기억 게임. 숫자가 나타나는 순서를 기억하고 클릭하여 순차적 기억력을 테스트하세요!');
}

function wrapWordPuzzleGame() {
  return wrapGame('word-puzzle', generateWordPuzzleGame, '단어 만들기',
    '무료 단어 만들기 게임. 주어진 글자들로 단어를 만들어 어휘력과 창의력을 테스트하세요!');
}

function wrapVisualMemoryGame() {
  return wrapGame('visual-memory', generateVisualMemoryGame, '시각 기억력',
    '무료 시각 기억력 테스트. 깜빡이는 타일의 위치를 기억하고 클릭하여 시각적 기억력을 향상시키세요!');
}

function wrapStroopTestGame() {
  return wrapGame('stroop-test', generateStroopTestGame, '스트룹 테스트',
    '무료 스트룹 테스트. 글자의 색깔을 빠르게 판단하여 인지 유연성과 집중력을 테스트하세요!');
}

function wrapVerbalMemoryGame() {
  return wrapGame('verbal-memory', generateVerbalMemoryGame, '언어 기억력',
    '무료 언어 기억력 테스트. 본 단어와 새 단어를 구분하여 언어 기억력을 테스트하세요!');
}

function wrapChimpTestGame() {
  return wrapGame('chimp-test', generateChimpTestGame, '침팬지 테스트',
    '무료 침팬지 테스트. 숫자를 순서대로 기억하고 클릭하여 단기 기억력을 테스트하세요! 침팬지보다 잘할 수 있나요?');
}

function wrapHearingTestGame() {
  return wrapGame('hearing-test', generateHearingTestGame, '청력 테스트',
    '무료 청력 테스트. 들을 수 있는 최고 주파수를 측정하여 청력 상태를 확인하세요! 헤드폰 착용 권장.');
}

function wrapColorBlindTestGame() {
  return wrapGame('color-blind-test', generateColorBlindTestGame, '색맹 테스트',
    '무료 색맹 테스트. 다른 색깔의 타일을 찾아 클릭하여 색각 인지 능력을 테스트하세요!');
}

function wrapNumberSpeedGame() {
  return wrapGame('number-speed', generateNumberSpeedGame, '숫자 비교 속도',
    '무료 숫자 비교 속도 테스트. 두 숫자 중 더 큰 숫자를 빠르게 선택하여 판단력을 테스트하세요!');
}

function wrapTargetTrackerGame() {
  return wrapGame('target-tracker', generateTargetTrackerGame, '목표 추적',
    '무료 목표 추적 게임. 움직이는 목표물을 따라가며 클릭하여 시각 추적 능력을 테스트하세요!');
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
    '<p style="text-align:center;font-size:20px;margin:16px 0;font-weight:500" data-i18n="mainDesc">재미있는 게임과 유용한 도구로 일상을 더 풍요롭게!</p>' +
    '<p id="total-count" style="text-align:center;font-size:16px;margin:8px 0;opacity:0.9" data-count="' + totalCount + '">총 ' + totalCount + '개의 게임과 도구가 준비되어 있습니다</p>' +
    '</div>' +

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
  var homeJsonLd = [websiteSchema, gameListSchema, webToolListSchema, funToolListSchema];

  write(path.join(OUT, 'index.html'), layout('미니게임 & 도구 모음집 - 두뇌 훈련, 개발자 도구, 유틸리티', '/', body, true,
    '무료 미니게임, 개발자 도구, 재미있는 유틸리티 모음집 - ' + totalCount + '개 이상의 게임과 도구로 일상을 더 풍요롭게 만드세요!',
    homeJsonLd));
}

// Privacy Policy 페이지 생성
function renderPrivacy() {
  var today = new Date().toISOString().split('T')[0];
  var body =
    '<h1 data-i18n-privacy="heading">개인정보처리방침</h1>' +
    '<div class="game-card">' +

    '<h3 style="color:#333" data-i18n-privacy="section1Title">1. 수집하는 정보</h3>' +
    '<p style="color:#555" data-i18n-privacy="section1Desc">본 웹사이트는 사용자로부터 직접적인 개인정보를 수집하지 않습니다. 다만, 서비스 개선을 위해 다음과 같은 정보가 자동으로 수집될 수 있습니다:</p>' +
    '<ul style="color:#555">' +
    '<li data-i18n-privacy="section1Item1">브라우저 유형 및 버전</li>' +
    '<li data-i18n-privacy="section1Item2">운영 체제</li>' +
    '<li data-i18n-privacy="section1Item3">방문 일시</li>' +
    '<li data-i18n-privacy="section1Item4">언어 설정</li>' +
    '</ul>' +

    '<h3 style="color:#333" data-i18n-privacy="section2Title">2. 쿠키 및 광고</h3>' +
    '<p style="color:#555" data-i18n-privacy="section2Desc1">본 웹사이트는 Google AdSense를 통해 광고를 게재합니다. Google은 사용자의 관심사에 기반한 광고를 표시하기 위해 쿠키를 사용할 수 있습니다.</p>' +
    '<p style="color:#555"><span data-i18n-privacy="section2Desc2">사용자는 Google 광고 설정에서 맞춤 광고를 비활성화할 수 있습니다.</span> <a href="https://www.google.com/settings/ads" style="color:#667eea" target="_blank" rel="noopener" data-i18n-privacy="section2Link">Google 광고 설정</a></p>' +

    '<h3 style="color:#333" data-i18n-privacy="section3Title">3. 로컬 스토리지</h3>' +
    '<p style="color:#555" data-i18n-privacy="section3Desc">게임 점수 및 언어 설정을 저장하기 위해 브라우저의 로컬 스토리지를 사용합니다. 이 데이터는 사용자의 기기에만 저장되며 서버로 전송되지 않습니다.</p>' +

    '<h3 style="color:#333" data-i18n-privacy="section4Title">4. 제3자 서비스</h3>' +
    '<p style="color:#555" data-i18n-privacy="section4Desc">본 웹사이트는 다음 제3자 서비스를 사용합니다:</p>' +
    '<ul style="color:#555">' +
    '<li data-i18n-privacy="section4Item1">Google AdSense (광고)</li>' +
    '<li data-i18n-privacy="section4Item2">GitHub Pages (호스팅)</li>' +
    '</ul>' +

    '<h3 style="color:#333" data-i18n-privacy="section5Title">5. 아동 개인정보 보호</h3>' +
    '<p style="color:#555" data-i18n-privacy="section5Desc">본 웹사이트는 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.</p>' +

    '<h3 style="color:#333" data-i18n-privacy="section6Title">6. 문의</h3>' +
    '<p style="color:#555"><span data-i18n-privacy="section6Desc">개인정보처리방침에 관한 문의사항이 있으시면 아래 이메일로 연락해 주세요:</span> <a href="mailto:pjhk579700@naver.com" style="color:#667eea">pjhk579700@naver.com</a></p>' +

    '<h3 style="color:#333" data-i18n-privacy="section7Title">7. 변경사항</h3>' +
    '<p style="color:#555" data-i18n-privacy="section7Desc">본 개인정보처리방침은 필요에 따라 변경될 수 있습니다. 변경 시 이 페이지에 업데이트됩니다.</p>' +
    '<p style="color:#555"><span data-i18n-privacy="lastUpdate">최종 업데이트: </span>' + today + '</p>' +
    '</div>' +
    '<script>' +
    'window.addEventListener("load",function(){' +
    'var origSetLang=setLanguage;' +
    'setLanguage=function(lang){' +
    'origSetLang(lang);' +
    'if(i18nData[lang]&&i18nData[lang].privacy){' +
    'var p=i18nData[lang].privacy;' +
    'document.querySelectorAll("[data-i18n-privacy]").forEach(function(el){' +
    'var key=el.getAttribute("data-i18n-privacy");' +
    'if(p[key])el.textContent=p[key];' +
    '});' +
    'document.title=p.title;' +
    '}' +
    '};' +
    'setLanguage(currentLang);' +
    '});' +
    '</script>';

  write(path.join(OUT, 'privacy', 'index.html'), layout('Privacy Policy - 개인정보처리방침', '/privacy/', body, false,
    '미니게임 모음집 개인정보처리방침. 쿠키, 광고, 데이터 수집에 관한 정책을 확인하세요.'));
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

// Create tool wrapper with language switching
var createToolWrapper = require('./src/templates/tool-wrapper.js');

function processToolDirectory(srcPath, destPath, toolId, toolData) {
  if (!fs.existsSync(srcPath)) return;

  ensureDir(destPath);

  // Check if we have centralized i18n data for this tool
  var i18nData = toolContentI18n[toolId];

  if (i18nData) {
    // New Logic: Generate content files using language-specific source files
    var handlerPath = href('/common/tool-i18n-handler.js');
    var shareModalPath = href('/common/share-modal.js');
    var handlerScript = '<script src="' + shareModalPath + '"></script><script src="' + handlerPath + '"></script>';
    var availableLanguages = { ko: false, en: false, ja: false };

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
        var content = fs.readFileSync(path.join(srcPath, sourceFile), 'utf8');
        var contentWithHandler = content.replace('</body>', handlerScript + '</body>');
        var injection = '<script>window.currentLang="' + lang + '";window.toolI18n=' + JSON.stringify(i18nData) + ';</script>';
        var finalContent = contentWithHandler.replace('</head>', injection + '</head>');
        fs.writeFileSync(path.join(destPath, 'content-' + lang + '.html'), finalContent);
        availableLanguages[lang] = true;
      }
    });

    // At least one language must be available
    if (availableLanguages.ko || availableLanguages.en || availableLanguages.ja) {
      // Create wrapper
      var toolTitle = toolData.title.ko || toolData.title.en || toolId;
      var wrapperHtml = createToolWrapper(toolId, toolTitle, 'tool', availableLanguages);
      fs.writeFileSync(path.join(destPath, 'index.html'), wrapperHtml);

      // Copy other assets
      var files = fs.readdirSync(srcPath);
      files.forEach(function(file) {
        if (!file.match(/^index.*\.html$/)) {
          var s = path.join(srcPath, file);
          var d = path.join(destPath, file);
          if (fs.statSync(s).isDirectory()) copyDir(s, d);
          else fs.copyFileSync(s, d);
        }
      });
      return; // Done
    }
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
      availableLanguages.ko = true;
      languageFiles.ko = file;
    } else if (file === 'index-en.html') {
      availableLanguages.en = true;
      languageFiles.en = file;
    } else if (file === 'index-ja.html') {
      availableLanguages.ja = true;
      languageFiles.ja = file;
    }
  });

  // Determine default file language
  if (languageFiles.default) {
    if (!availableLanguages.ko && !availableLanguages.en && !availableLanguages.ja) {
      // Only index.html exists - assume Korean
      availableLanguages.ko = true;
      languageFiles.ko = languageFiles.default;
    } else if (availableLanguages.en && !availableLanguages.ko) {
      // index.html + index-en.html -> index.html is probably Korean
      availableLanguages.ko = true;
      languageFiles.ko = languageFiles.default;
    } else if (!availableLanguages.en && !availableLanguages.ko) {
      // Use as fallback
      availableLanguages.ko = true;
      languageFiles.ko = languageFiles.default;
    }
  }

  // Copy all language files with renamed filenames
  Object.keys(languageFiles).forEach(function(lang) {
    if (lang === 'default') return;
    var srcFile = path.join(srcPath, languageFiles[lang]);
    var destFile = path.join(destPath, 'content-' + lang + '.html');
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
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

  // Get tool title from toolData
  var toolTitle = toolData.title.ko || toolData.title.en || toolId;

  // Create wrapper index.html
  var wrapperHtml = createToolWrapper(toolId, toolTitle, 'tool', availableLanguages);
  fs.writeFileSync(path.join(destPath, 'index.html'), wrapperHtml);
}

function build(){
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // 메인 페이지 생성
  renderIndex();

  // Privacy Policy 페이지 생성
  renderPrivacy();

  // 각 게임 페이지 생성
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
        processToolDirectory(srcPath, destPath, tool.id, tool);
      }
    }
  }

  // Process Consumer Tools with language switching
  var consumerToolsSrc = path.join(process.cwd(), 'src', 'external-tools', 'fun');
  if (fs.existsSync(consumerToolsSrc)) {
    for (var i = 0; i < consumerTools.length; i++) {
      var tool = consumerTools[i];
      var srcPath = path.join(consumerToolsSrc, tool.id);
      var destPath = path.join(OUT, 'tools', 'fun', tool.id);
      if (fs.existsSync(srcPath)) {
        processToolDirectory(srcPath, destPath, tool.id, tool);
      }
    }
  }

  // ===== Enhanced Sitemap with lastmod & priority =====
  var today = new Date().toISOString().split('T')[0];
  var sitemapEntries = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/privacy/', priority: '0.3', changefreq: 'yearly' }
  ];
  for (var i = 0; i < games.length; i++) {
    sitemapEntries.push({ url: '/games/' + games[i].id + '/', priority: '0.8', changefreq: 'monthly' });
  }
  for (var i = 0; i < webTools.length; i++) {
    sitemapEntries.push({ url: '/tools/web/' + webTools[i].id + '/', priority: '0.7', changefreq: 'monthly' });
  }
  for (var i = 0; i < consumerTools.length; i++) {
    sitemapEntries.push({ url: '/tools/fun/' + consumerTools[i].id + '/', priority: '0.6', changefreq: 'monthly' });
  }

  var sm = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (var i = 0; i < sitemapEntries.length; i++) {
    var entry = sitemapEntries[i];
    sm.push(
      '<url>' +
      '<loc>' + absUrl(entry.url) + '</loc>' +
      '<lastmod>' + today + '</lastmod>' +
      '<changefreq>' + entry.changefreq + '</changefreq>' +
      '<priority>' + entry.priority + '</priority>' +
      '</url>'
    );
  }
  sm.push('</urlset>');
  write(path.join(OUT, 'sitemap.xml'), sm.join('\n'));
  write(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + absUrl('/sitemap.xml'));

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

  // CNAME 파일 생성 (커스텀 도메인용)
  write(path.join(OUT, 'CNAME'), 'instaidea.org');

  // Google Search Console 인증 파일
  var googleVerifyFile = path.join(process.cwd(), 'google8c26ce59e7acdd58.html');
  if (fs.existsSync(googleVerifyFile)) {
    fs.copyFileSync(googleVerifyFile, path.join(OUT, 'google8c26ce59e7acdd58.html'));
  }

  // ===== PWA Manifest =====
  var manifest = {
    name: 'InstaIdea - Mini Games & Tools',
    short_name: 'InstaIdea',
    description: 'Free brain training games, developer tools, and fun utilities',
    start_url: '/',
    display: 'standalone',
    background_color: '#667eea',
    theme_color: '#667eea',
    lang: 'ko',
    categories: ['games', 'utilities', 'entertainment'],
    icons: [
      { src: '/og-image.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
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
    '<text x="600" y="200" text-anchor="middle" fill="white" font-size="120" font-family="Arial,sans-serif">🎮</text>' +
    '<text x="600" y="320" text-anchor="middle" fill="white" font-size="64" font-weight="bold" font-family="Arial,sans-serif">InstaIdea</text>' +
    '<text x="600" y="400" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="32" font-family="Arial,sans-serif">Mini Games &amp; Tools Collection</text>' +
    '<text x="600" y="460" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="24" font-family="Arial,sans-serif">' + (games.length + webTools.length + consumerTools.length) + '+ Free Games &amp; Tools</text>' +
    '<text x="600" y="560" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="20" font-family="Arial,sans-serif">instaidea.org</text>' +
    '</svg>';
  write(path.join(OUT, 'og-image.svg'), ogSvg);

  console.log('Generated ' + games.length + ' game(s), ' + webTools.length + ' web tool(s), ' + consumerTools.length + ' consumer tool(s), and main page');
  console.log('SEO enhancements: JSON-LD, enhanced sitemap, manifest.json, OG image, related content sections');
}

build();
