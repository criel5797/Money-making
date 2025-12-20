'use strict';

var fs = require('fs');
var path = require('path');

// Import modules
var i18n = require('./src/i18n/index.js');
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

var OUT = path.join(process.cwd(), 'dist');

var RAW_BASE_URL = (process.env.BASE_URL || '').replace(/\/+$/, '');
var BASE_URL = RAW_BASE_URL;

var repoEnv = (process.env.GITHUB_REPOSITORY || '');
var repoName = repoEnv.split('/')[1] || '';
var autoBasePath = repoName ? '/' + repoName : '';
var BASE_PATH = BASE_URL
  ? (new URL(BASE_URL).pathname.replace(/\/$/, '') || '')
  : (process.env.BASE_PATH || autoBasePath);

var ADS_CLIENT = process.env.ADSENSE_CLIENT || '';
var PUB_ID = ADS_CLIENT.replace('ca-pub-', '');

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function write(p, c){ ensureDir(path.dirname(p)); fs.writeFileSync(p, c); }
function href(p){ return BASE_PATH + p; }

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
function layout(title, pathname, body, includeAdScript, description) {
  return createLayout({
    title: title,
    description: description || title + ' - 무료 두뇌 훈련 미니게임. 반응속도, 기억력, 집중력을 테스트하세요!',
    pathname: pathname,
    body: body,
    includeAdScript: includeAdScript,
    adsClient: ADS_CLIENT,
    basePath: BASE_PATH,
    baseUrl: BASE_URL,
    i18nData: i18n
  });
}

// Game generation wrappers that call template modules
var templateOptions = {
  getGameTitle: getGameTitle,
  getGameTitleScript: getGameTitleScript
};

function wrapReactionGame() {
  var gameHTML = generateReactionGame(templateOptions);
  return layout('순발력 테스트', '/games/reaction-time/', gameHTML, true,
    '무료 반응속도 테스트 게임. 초록색이 되면 최대한 빠르게 클릭하여 당신의 반응속도를 측정하세요!');
}

function wrapMemoryNumberGame() {
  var gameHTML = generateMemoryNumberGame(templateOptions);
  return layout('숫자 기억력', '/games/memory-number/', gameHTML, true,
    '무료 숫자 기억력 테스트. 점점 길어지는 숫자를 기억하고 입력하여 기억력을 향상시키세요!');
}

function wrapTypingSpeedGame() {
  var gameHTML = generateTypingSpeedGame(templateOptions);
  return layout('타이핑 속도', '/games/typing-speed/', gameHTML, true,
    '무료 타이핑 속도 테스트. 문장을 빠르고 정확하게 타이핑하여 WPM을 측정하세요!');
}

function wrapColorMatchGame() {
  var gameHTML = generateColorMatchGame(templateOptions);
  return layout('색깔 맞추기', '/games/color-match/', gameHTML, true,
    '무료 색깔 맞추기 게임. 글자의 색깔과 의미가 일치하는지 빠르게 판단하여 집중력을 테스트하세요!');
}

function wrapMathQuizGame() {
  var gameHTML = generateMathQuizGame(templateOptions);
  return layout('암산 게임', '/games/math-quiz/', gameHTML, true,
    '무료 암산 게임. 수학 문제를 빠르게 풀어 두뇌를 훈련하고 계산 능력을 향상시키세요!');
}

function wrapPatternMemoryGame() {
  var gameHTML = generatePatternMemoryGame(templateOptions);
  return layout('패턴 기억', '/games/pattern-memory/', gameHTML, true,
    '무료 패턴 기억 게임. 깜빡이는 패턴을 기억하고 순서대로 클릭하여 시각적 기억력을 훈련하세요!');
}

function wrapClickSpeedGame() {
  var gameHTML = generateClickSpeedGame(templateOptions);
  return layout('클릭 속도', '/games/click-speed/', gameHTML, true,
    '무료 클릭 속도 테스트. 10초 동안 최대한 많이 클릭하여 CPS(초당 클릭 수)를 측정하세요!');
}

function wrapAimTrainerGame() {
  var gameHTML = generateAimTrainerGame(templateOptions);
  return layout('목표물 클릭', '/games/aim-trainer/', gameHTML, true,
    '무료 에임 트레이너 게임. 나타나는 원을 빠르게 클릭하여 마우스 정확도와 반응속도를 훈련하세요!');
}

function wrapSequenceMemoryGame() {
  var gameHTML = generateSequenceMemoryGame(templateOptions);
  return layout('순서 기억', '/games/sequence-memory/', gameHTML, true,
    '무료 순서 기억 게임. 숫자가 나타나는 순서를 기억하고 클릭하여 순차적 기억력을 테스트하세요!');
}

function wrapWordPuzzleGame() {
  var gameHTML = generateWordPuzzleGame(templateOptions);
  return layout('단어 만들기', '/games/word-puzzle/', gameHTML, true,
    '무료 단어 만들기 게임. 주어진 글자들로 단어를 만들어 어휘력과 창의력을 테스트하세요!');
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

  write(path.join(OUT, 'index.html'), layout('미니게임 & 도구 모음집 - 두뇌 훈련, 개발자 도구, 유틸리티', '/', body, true,
    '무료 미니게임, 개발자 도구, 재미있는 유틸리티 모음집 - 70개 이상의 게임과 도구로 일상을 더 풍요롭게 만드세요!'));
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

  // Copy Web Tools
  var webToolsSrc = path.join(process.cwd(), 'src', 'external-tools', 'web');
  if (fs.existsSync(webToolsSrc)) {
    for (var i = 0; i < webTools.length; i++) {
      var toolId = webTools[i].id;
      var srcPath = path.join(webToolsSrc, toolId);
      var destPath = path.join(OUT, 'tools', 'web', toolId);
      if (fs.existsSync(srcPath)) {
        copyDir(srcPath, destPath);
      }
    }
  }

  // Copy Consumer Tools
  var consumerToolsSrc = path.join(process.cwd(), 'src', 'external-tools', 'fun');
  if (fs.existsSync(consumerToolsSrc)) {
    for (var i = 0; i < consumerTools.length; i++) {
      var toolId = consumerTools[i].id;
      var srcPath = path.join(consumerToolsSrc, toolId);
      var destPath = path.join(OUT, 'tools', 'fun', toolId);
      if (fs.existsSync(srcPath)) {
        copyDir(srcPath, destPath);
      }
    }
  }

  // sitemap / robots
  var urls = ['/', '/privacy/'];
  for (var i = 0; i < games.length; i++) {
    urls.push('/games/' + games[i].id + '/');
  }
  for (var i = 0; i < webTools.length; i++) {
    urls.push('/tools/web/' + webTools[i].id + '/');
  }
  for (var i = 0; i < consumerTools.length; i++) {
    urls.push('/tools/fun/' + consumerTools[i].id + '/');
  }

  var abs = function(p){ return BASE_URL ? (BASE_URL + p) : (BASE_PATH + p); };
  var sm = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for(var i = 0; i < urls.length; i++) sm.push('<url><loc>' + abs(urls[i]) + '</loc></url>');
  sm.push('</urlset>');
  write(path.join(OUT, 'sitemap.xml'), sm.join('\n'));
  write(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + abs('/sitemap.xml'));

  if(PUB_ID){
    write(path.join(OUT, 'ads.txt'), 'google.com, ' + PUB_ID + ', DIRECT, f08c47fec0942fa0');
  }

  // CNAME 파일 생성 (커스텀 도메인용)
  write(path.join(OUT, 'CNAME'), 'instaidea.org');

  console.log('Generated ' + games.length + ' game(s), ' + webTools.length + ' web tool(s), ' + consumerTools.length + ' consumer tool(s), and main page');
}

build();
