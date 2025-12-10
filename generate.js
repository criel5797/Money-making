'use strict';

var fs = require('fs');
var path = require('path');

var OUT = path.join(process.cwd(), 'dist');

// 절대 URL(예: https://USER.github.io/Money-making). 없으면 BASE_PATH만 사용.
var RAW_BASE_URL = (process.env.BASE_URL || '').replace(/\/+$/, '');
var BASE_URL = RAW_BASE_URL;

// BASE_PATH: 내부 링크 접두 경로. BASE_URL이 있으면 그 pathname, 없으면 /REPO 자동 계산.
var repoEnv = (process.env.GITHUB_REPOSITORY || '');
var repoName = repoEnv.split('/')[1] || '';
var autoBasePath = repoName ? '/' + repoName : '';
var BASE_PATH = BASE_URL
  ? (new URL(BASE_URL).pathname.replace(/\/$/, '') || '')
  : (process.env.BASE_PATH || autoBasePath);

var ADS_CLIENT = process.env.ADSENSE_CLIENT || ''; // 예: ca-pub-XXXXXXXX
var PUB_ID = ADS_CLIENT.replace('ca-pub-', '');

// 게임 목록
var games = [
  {
    id: 'reaction-time',
    title: '순발력 테스트',
    description: '당신의 반응 속도를 측정해보세요!',
    emoji: '⚡'
  }
  // 추후 더 많은 게임 추가 가능
];

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function write(p, c){ ensureDir(path.dirname(p)); fs.writeFileSync(p, c); }
function canonical(pathname){ return BASE_URL ? (BASE_URL + pathname) : (BASE_PATH + pathname); }
function href(p){ return BASE_PATH + p; }

function layout(title, pathname, body, includeAdScript){
  var adsScript = '';
  if (includeAdScript && ADS_CLIENT) {
    adsScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS_CLIENT + '" crossorigin="anonymous"></script>';
  }

  var ads = ADS_CLIENT
    ? (
      '<ins class="adsbygoogle" style="display:block;margin:24px 0" data-ad-format="auto" data-full-width-responsive="true"></ins>' +
      '<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>'
    )
    : '<div class="placeholder">AdSense 승인 후 광고가 표시됩니다</div>';

  var head =
    '<!doctype html><html lang="ko"><head>' +
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + '</title>' +
    '<meta name="description" content="' + title + ' - 무료 미니게임 모음집">' +
    '<link rel="canonical" href="' + canonical(pathname) + '"/>' +
    '<meta name="robots" content="index,follow">' +
    adsScript +
    '<style>' +
    'body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:24px;line-height:1.6;background:#f5f5f5}' +
    'h1{font-size:32px;margin:16px 0;text-align:center;color:#333}' +
    'h2{font-size:24px;margin:16px 0;color:#444}' +
    'a{color:#0a66c2;text-decoration:none} a:hover{text-decoration:underline}' +
    '.game-card{background:white;border-radius:12px;padding:24px;margin:16px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.2s}' +
    '.game-card:hover{transform:translateY(-4px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}' +
    '.game-emoji{font-size:48px;margin:16px 0}' +
    '.game-title{font-size:24px;font-weight:bold;margin:12px 0;color:#333}' +
    '.game-description{color:#666;margin:8px 0}' +
    '.play-btn{display:inline-block;background:#0a66c2;color:white;padding:12px 32px;border-radius:8px;margin:16px 0;font-size:18px;font-weight:bold;cursor:pointer;border:none;transition:background 0.2s}' +
    '.play-btn:hover{background:#084a8f;text-decoration:none}' +
    'footer{color:#777;margin:32px 0;text-align:center;font-size:14px}' +
    '.placeholder{height:90px;background:#f2f2f2;border:1px dashed #ddd;display:flex;align-items:center;justify-content:center;color:#888;font-size:12px;border-radius:8px;margin:24px 0}' +
    'nav{text-align:center;margin:24px 0}' +
    'nav a{margin:0 12px;font-size:16px}' +
    '</style>' +
    '</head><body>' +
    '<nav><a href="' + href('/') + '">🏠 홈</a></nav>';

  var tail =
    '<div class="ad">' + ads + '</div>' +
    '<footer>© ' + (new Date().getFullYear()) + ' Fun Mini Games</footer>' +
    '</body></html>';

  return head + body + tail;
}

// 순발력 테스트 게임 HTML 생성
function generateReactionGame(){
  var gameHTML = `
    <h1>⚡ 순발력 테스트</h1>
    <div class="game-card" style="text-align:center">
      <div id="instructions" style="margin:24px 0;font-size:18px">
        <p>아래 박스가 <span style="color:#e74c3c;font-weight:bold">빨간색</span>에서 <span style="color:#27ae60;font-weight:bold">초록색</span>으로 바뀌면 최대한 빠르게 클릭하세요!</p>
        <p style="color:#888;font-size:14px">너무 일찍 클릭하면 실패입니다.</p>
      </div>

      <div id="reaction-box" style="width:100%;height:300px;background:#e74c3c;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;color:white;font-weight:bold;cursor:pointer;user-select:none">
        클릭해서 시작
      </div>

      <div id="result" style="margin:24px 0;font-size:24px;font-weight:bold;min-height:40px"></div>

      <div id="stats" style="margin:24px 0">
        <h3>📊 통계</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;text-align:center">
          <div class="stat-box" style="background:#f8f9fa;padding:16px;border-radius:8px">
            <div style="font-size:14px;color:#666">시도 횟수</div>
            <div id="attempts" style="font-size:32px;font-weight:bold;color:#333">0</div>
          </div>
          <div class="stat-box" style="background:#f8f9fa;padding:16px;border-radius:8px">
            <div style="font-size:14px;color:#666">최고 기록</div>
            <div id="best" style="font-size:32px;font-weight:bold;color:#27ae60">-</div>
          </div>
        </div>
      </div>
    </div>

    <script>
      var box = document.getElementById('reaction-box');
      var result = document.getElementById('result');
      var attemptsEl = document.getElementById('attempts');
      var bestEl = document.getElementById('best');

      var state = 'ready'; // ready, waiting, green, tooEarly
      var startTime = 0;
      var attempts = 0;
      var bestTime = null;
      var timeout = null;

      function resetBox() {
        box.style.background = '#e74c3c';
        box.textContent = '클릭해서 시작';
        state = 'ready';
        result.textContent = '';
        result.style.color = '#333';
      }

      function startGame() {
        if (state !== 'ready') return;

        state = 'waiting';
        box.style.background = '#e74c3c';
        box.textContent = '초록색이 될 때까지 기다리세요...';
        result.textContent = '';

        // 2-5초 사이 랜덤 대기
        var waitTime = 2000 + Math.random() * 3000;

        timeout = setTimeout(function() {
          state = 'green';
          box.style.background = '#27ae60';
          box.textContent = '지금 클릭!';
          startTime = Date.now();
        }, waitTime);
      }

      function handleClick() {
        if (state === 'ready') {
          startGame();
        } else if (state === 'waiting') {
          // 너무 일찍 클릭
          clearTimeout(timeout);
          state = 'tooEarly';
          box.style.background = '#95a5a6';
          box.textContent = '너무 빨라요! 다시 시도';
          result.textContent = '❌ 초록색으로 바뀔 때까지 기다리세요!';
          result.style.color = '#e74c3c';
          attempts++;
          attemptsEl.textContent = attempts;

          setTimeout(resetBox, 2000);
        } else if (state === 'green') {
          // 성공!
          var reactionTime = Date.now() - startTime;
          attempts++;
          attemptsEl.textContent = attempts;

          result.textContent = '✅ ' + reactionTime + 'ms';
          result.style.color = '#27ae60';

          if (bestTime === null || reactionTime < bestTime) {
            bestTime = reactionTime;
            bestEl.textContent = reactionTime + 'ms';
            result.textContent += ' 🎉 신기록!';
          }

          // 평가 메시지
          var message = '';
          if (reactionTime < 200) message = ' 🔥 놀라워요!';
          else if (reactionTime < 250) message = ' 👍 훌륭해요!';
          else if (reactionTime < 300) message = ' 😊 좋아요!';
          else if (reactionTime < 400) message = ' 👌 괜찮아요!';
          else message = ' 💪 연습하면 더 잘할 수 있어요!';

          result.textContent += message;

          setTimeout(resetBox, 2000);
        }
      }

      box.addEventListener('click', handleClick);
    </script>
  `;

  return layout('순발력 테스트', '/games/reaction-time/', gameHTML, true);
}

// 메인 페이지 생성
function renderIndex(){
  var gameList = '';
  for (var i = 0; i < games.length; i++) {
    var g = games[i];
    gameList +=
      '<div class="game-card">' +
      '<div class="game-emoji">' + g.emoji + '</div>' +
      '<div class="game-title">' + g.title + '</div>' +
      '<div class="game-description">' + g.description + '</div>' +
      '<a href="' + href('/games/' + g.id + '/') + '" class="play-btn">플레이하기</a>' +
      '</div>';
  }

  var body =
    '<h1>🎮 미니게임 모음집</h1>' +
    '<p style="text-align:center;color:#666;font-size:18px">재미있는 무료 미니게임을 즐겨보세요!</p>' +
    gameList;

  write(path.join(OUT, 'index.html'), layout('미니게임 모음집', '/', body, true));
}

function build(){
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // 메인 페이지 생성
  renderIndex();

  // 순발력 테스트 게임 생성
  write(path.join(OUT, 'games', 'reaction-time', 'index.html'), generateReactionGame());

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
