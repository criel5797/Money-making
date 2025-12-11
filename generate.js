'use strict';

var fs = require('fs');
var path = require('path');

// Import modules
var i18n = require('./src/i18n/index.js');
var games = require('./src/common/games.js');
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
    'var gameTitle=' + JSON.stringify(title) + ';' +
    'var titleEmoji="' + emoji + '";' +
    'if(typeof window.setLanguage!=="undefined"){' +
    'var origSetLang=window.setLanguage;' +
    'window.setLanguage=function(lang){' +
    'origSetLang(lang);' +
    'var h1=document.querySelector("h1");' +
    'if(h1&&gameTitle[lang])h1.textContent=titleEmoji+" "+gameTitle[lang];' +
    '};' +
    '}' +
    '</script>'
  );
}

// Layout wrapper using the createLayout function from layout.js
function layout(title, pathname, body, includeAdScript) {
  return createLayout({
    title: title,
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
  return layout('순발력 테스트', '/games/reaction-time/', gameHTML, true);
}

function wrapMemoryNumberGame() {
  var gameHTML = generateMemoryNumberGame(templateOptions);
  return layout('숫자 기억력', '/games/memory-number/', gameHTML, true);
}

function wrapTypingSpeedGame() {
  var gameHTML = generateTypingSpeedGame(templateOptions);
  return layout('타이핑 속도', '/games/typing-speed/', gameHTML, true);
}

function wrapColorMatchGame() {
  var gameHTML = generateColorMatchGame(templateOptions);
  return layout('색깔 맞추기', '/games/color-match/', gameHTML, true);
}

function wrapMathQuizGame() {
  var gameHTML = generateMathQuizGame(templateOptions);
  return layout('암산 게임', '/games/math-quiz/', gameHTML, true);
}

function wrapPatternMemoryGame() {
  var gameHTML = generatePatternMemoryGame(templateOptions);
  return layout('패턴 기억', '/games/pattern-memory/', gameHTML, true);
}

function wrapClickSpeedGame() {
  var gameHTML = generateClickSpeedGame(templateOptions);
  return layout('클릭 속도', '/games/click-speed/', gameHTML, true);
}

function wrapAimTrainerGame() {
  var gameHTML = generateAimTrainerGame(templateOptions);
  return layout('목표물 클릭', '/games/aim-trainer/', gameHTML, true);
}

function wrapSequenceMemoryGame() {
  var gameHTML = generateSequenceMemoryGame(templateOptions);
  return layout('순서 기억', '/games/sequence-memory/', gameHTML, true);
}

function wrapWordPuzzleGame() {
  var gameHTML = generateWordPuzzleGame(templateOptions);
  return layout('단어 만들기', '/games/word-puzzle/', gameHTML, true);
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
      '<div class="game-category" data-category="' + g.category + '">' + i18n.ko.categories[g.category] + '</div>' +
      '<div class="game-title" data-game-title>' + g.title.ko + '</div>' +
      '<div class="game-description" data-game-desc>' + g.description.ko + '</div>' +
      '<a href="' + href('/games/' + g.id + '/') + '" class="play-btn" data-i18n="playBtn">플레이하기 →</a>' +
      '</div>';
  }

  var body =
    '<div class="header-section">' +
    '<h1 data-i18n="mainTitle">🎮 미니게임 모음집</h1>' +
    '<p style="text-align:center;font-size:20px;margin:16px 0;font-weight:500" data-i18n="mainDesc">재미있는 무료 미니게임으로 두뇌를 훈련하세요!</p>' +
    '<p id="game-count" style="text-align:center;font-size:16px;margin:8px 0;opacity:0.9" data-count="' + games.length + '">총 ' + games.length + '개의 게임이 준비되어 있습니다</p>' +
    '</div>' +
    '<div class="grid">' + gameList + '</div>' +
    '<script>' +
    'var originalSetLanguage=setLanguage;' +
    'setLanguage=function(lang){' +
    'originalSetLanguage(lang);' +
    'var count=document.getElementById("game-count").getAttribute("data-count");' +
    'document.getElementById("game-count").textContent=i18nData[lang].gameCount.replace("{count}",count);' +
    'document.querySelectorAll(".game-card").forEach(function(card){' +
    'var data=JSON.parse(card.getAttribute("data-game"));' +
    'card.querySelector("[data-game-title]").textContent=data.title[lang];' +
    'card.querySelector("[data-game-desc]").textContent=data.description[lang];' +
    'var cat=card.querySelector("[data-category]").getAttribute("data-category");' +
    'card.querySelector("[data-category]").textContent=i18nData[lang].categories[cat];' +
    '});' +
    '};' +
    'setLanguage(currentLang);' +
    '</script>';

  write(path.join(OUT, 'index.html'), layout('미니게임 모음집 - 두뇌 훈련 & 반응속도 게임', '/', body, true));
}

function build(){
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // 메인 페이지 생성
  renderIndex();

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

  // sitemap / robots
  var urls = ['/'];
  for (var i = 0; i < games.length; i++) {
    urls.push('/games/' + games[i].id + '/');
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

  console.log('Generated ' + games.length + ' game(s) and main page');
}

build();
