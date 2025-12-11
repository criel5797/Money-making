'use strict';

var fs = require('fs');
var path = require('path');

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

// 게임 목록
var games = [
  { id: 'reaction-time', title: '순발력 테스트', description: '당신의 반응 속도를 측정해보세요!', emoji: '⚡', category: '반응속도' },
  { id: 'memory-number', title: '숫자 기억력', description: '점점 길어지는 숫자를 기억하세요!', emoji: '🧠', category: '기억력' },
  { id: 'typing-speed', title: '타이핑 속도', description: '당신의 타이핑 속도를 측정하세요!', emoji: '⌨️', category: '속도' },
  { id: 'color-match', title: '색깔 맞추기', description: '글자와 색깔이 일치하는지 판단하세요!', emoji: '🎨', category: '집중력' },
  { id: 'math-quiz', title: '암산 게임', description: '빠르게 수학 문제를 풀어보세요!', emoji: '🔢', category: '두뇌' },
  { id: 'pattern-memory', title: '패턴 기억', description: '패턴을 기억하고 따라하세요!', emoji: '🔲', category: '기억력' },
  { id: 'click-speed', title: '클릭 속도', description: '10초 동안 최대한 많이 클릭하세요!', emoji: '👆', category: '속도' },
  { id: 'aim-trainer', title: '목표물 클릭', description: '나타나는 원을 빠르게 클릭하세요!', emoji: '🎯', category: '반응속도' },
  { id: 'sequence-memory', title: '순서 기억', description: '숫자를 순서대로 클릭하세요!', emoji: '🔢', category: '기억력' },
  { id: 'word-puzzle', title: '단어 만들기', description: '주어진 글자로 단어를 만드세요!', emoji: '📝', category: '두뇌' }
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
    '@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}' +
    '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
    '@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}' +
    'body{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;margin:0;padding:0;min-height:100vh;background:linear-gradient(-45deg,#667eea,#764ba2,#f093fb,#4facfe);background-size:400% 400%;animation:gradient 15s ease infinite;overflow-x:hidden}' +
    '.container{max-width:1200px;margin:0 auto;padding:24px;animation:fadeIn 0.8s ease-out}' +
    'h1{font-size:clamp(36px,5vw,56px);margin:32px 0 16px;text-align:center;color:#fff;font-weight:900;text-shadow:0 4px 12px rgba(0,0,0,0.2);letter-spacing:-1px;animation:fadeIn 1s ease-out}' +
    'h2{font-size:28px;margin:24px 0;color:#fff;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,0.15)}' +
    'h3{font-size:22px;margin:16px 0;color:#fff;font-weight:600}' +
    'p{color:#fff;font-size:18px;text-shadow:0 2px 4px rgba(0,0,0,0.1)}' +
    'a{color:#fff;text-decoration:none;transition:all 0.3s}a:hover{opacity:0.8}' +
    '.game-card{background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-radius:24px;padding:32px;margin:16px 0;box-shadow:0 8px 32px rgba(0,0,0,0.1);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,255,255,0.3);position:relative;overflow:hidden;animation:fadeIn 0.6s ease-out backwards}' +
    '.game-card::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);pointer-events:none}' +
    '.game-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 16px 48px rgba(0,0,0,0.15)}' +
    '.game-card:nth-child(1){animation-delay:0.1s}.game-card:nth-child(2){animation-delay:0.2s}.game-card:nth-child(3){animation-delay:0.3s}.game-card:nth-child(4){animation-delay:0.4s}.game-card:nth-child(5){animation-delay:0.5s}.game-card:nth-child(6){animation-delay:0.6s}.game-card:nth-child(7){animation-delay:0.7s}.game-card:nth-child(8){animation-delay:0.8s}.game-card:nth-child(9){animation-delay:0.9s}.game-card:nth-child(10){animation-delay:1s}' +
    '.game-emoji{font-size:64px;margin:16px 0;text-align:center;animation:bounce 2s ease-in-out infinite;display:inline-block}' +
    '.game-card:hover .game-emoji{animation:pulse 0.6s ease-in-out}' +
    '.game-title{font-size:28px;font-weight:800;margin:16px 0;color:#1a1a1a;text-align:center}' +
    '.game-description{color:#555;margin:12px 0;text-align:center;font-size:15px;line-height:1.6}' +
    '.game-category{display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;margin:8px 0;font-weight:600;box-shadow:0 2px 8px rgba(102,126,234,0.3);text-transform:uppercase;letter-spacing:0.5px}' +
    '.play-btn{display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 40px;border-radius:50px;margin:16px 0;font-size:18px;font-weight:700;cursor:pointer;border:none;transition:all 0.3s;text-align:center;box-shadow:0 4px 15px rgba(102,126,234,0.4);position:relative;overflow:hidden}' +
    '.play-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transition:left 0.5s}' +
    '.play-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(102,126,234,0.5)}.play-btn:hover::before{left:100%}' +
    '.play-btn:active{transform:translateY(0)}' +
    '.btn{padding:14px 28px;font-size:16px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.1)}' +
    '.btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(102,126,234,0.4)}' +
    '.btn-success{background:linear-gradient(135deg,#11998e,#38ef7d);color:#fff}.btn-success:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(56,239,125,0.4)}' +
    '.btn-danger{background:linear-gradient(135deg,#eb3349,#f45c43);color:#fff}.btn-danger:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(235,51,73,0.4)}' +
    'input,textarea{padding:14px;font-size:16px;border:2px solid rgba(255,255,255,0.3);border-radius:12px;width:100%;box-sizing:border-box;margin:8px 0;background:rgba(255,255,255,0.9);transition:all 0.3s}' +
    'input:focus,textarea:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);background:#fff}' +
    'footer{color:rgba(255,255,255,0.9);margin:48px 0 24px;text-align:center;font-size:14px;text-shadow:0 2px 4px rgba(0,0,0,0.1)}' +
    'footer a{color:#fff;font-weight:600}' +
    '.placeholder{height:90px;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border:2px dashed rgba(102,126,234,0.3);display:flex;align-items:center;justify-content:center;color:#666;font-size:13px;border-radius:16px;margin:24px 0}' +
    'nav{text-align:center;margin:24px 0;padding:16px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.1)}' +
    'nav a{margin:0 16px;font-size:16px;font-weight:600;color:#fff;padding:8px 16px;border-radius:8px;transition:all 0.3s}' +
    'nav a:hover{background:rgba(255,255,255,0.2)}' +
    '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin:32px 0}' +
    '.stat-box{background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85));backdrop-filter:blur(10px);padding:24px;border-radius:16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid rgba(255,255,255,0.3)}' +
    '.stat-label{font-size:14px;color:#666;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}' +
    '.stat-value{font-size:40px;font-weight:900;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-top:8px}' +
    '.header-section{text-align:center;margin-bottom:48px;padding:32px 0}' +
    '@media(max-width:768px){.grid{grid-template-columns:1fr;gap:16px}h1{font-size:36px}.game-emoji{font-size:48px}}' +
    '</style>' +
    '</head><body>' +
    '<div class="container">' +
    '<nav><a href="' + href('/') + '">🏠 홈</a></nav>';

  var tail =
    '<div class="ad">' + ads + '</div>' +
    '<footer>© ' + (new Date().getFullYear()) + ' Fun Mini Games | <a href="' + href('/') + '">전체 게임 보기</a></footer>' +
    '</div></body></html>';

  return head + body + tail;
}

// 1. 순발력 테스트 게임
function generateReactionGame(){
  var gameHTML = `
    <h1>⚡ 순발력 테스트</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">빨간색에서 초록색으로 바뀌면 최대한 빠르게 클릭하세요!</p>
      <div id="reaction-box" style="width:100%;height:300px;background:#e74c3c;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;color:white;font-weight:bold;cursor:pointer;user-select:none;margin:24px 0;transition:background 0.1s">클릭해서 시작</div>
      <div id="result" style="margin:16px 0;font-size:20px;font-weight:bold;min-height:30px;color:#333"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">시도 횟수</div><div id="attempts" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">평균</div><div id="average" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label">최고 기록</div><div id="best" class="stat-value">-</div></div>
      </div>
    </div>
    <script>
      var box=document.getElementById('reaction-box'),result=document.getElementById('result'),attemptsEl=document.getElementById('attempts'),averageEl=document.getElementById('average'),bestEl=document.getElementById('best'),state='ready',startTime=0,attempts=0,bestTime=null,totalTime=0,validAttempts=0,timeout=null;
      function resetBox(){setTimeout(function(){box.style.background='#3498db';box.textContent='클릭해서 다음 라운드';state='ready';},1500);}
      function startGame(){if(state!=='ready')return;state='countdown';var count=3;box.style.background='#f39c12';box.textContent='준비... '+count;var countInterval=setInterval(function(){count--;if(count>0){box.textContent='준비... '+count;}else{clearInterval(countInterval);state='waiting';box.style.background='#e74c3c';box.textContent='초록색이 될 때까지 기다리세요...';result.textContent='';var waitTime=2000+Math.random()*3000;timeout=setTimeout(function(){if(state==='waiting'){state='green';box.style.background='#27ae60';box.textContent='지금 클릭!';startTime=Date.now();}},waitTime);}},1000);}
      box.addEventListener('click',function(){if(state==='ready'){startGame();}else if(state==='countdown'){result.textContent='⏳ 카운트다운을 기다리세요!';result.style.color='#f39c12';}else if(state==='waiting'){clearTimeout(timeout);state='tooEarly';box.style.background='#95a5a6';box.textContent='너무 빨라요!';result.textContent='❌ 초록색으로 바뀔 때까지 기다리세요!';result.style.color='#e74c3c';attempts++;attemptsEl.textContent=attempts;resetBox();}else if(state==='green'){var reactionTime=Date.now()-startTime;attempts++;validAttempts++;totalTime+=reactionTime;attemptsEl.textContent=attempts;var avg=Math.round(totalTime/validAttempts);averageEl.textContent=avg+'ms';result.textContent='✅ '+reactionTime+'ms';result.style.color='#27ae60';if(bestTime===null||reactionTime<bestTime){bestTime=reactionTime;bestEl.textContent=reactionTime+'ms';result.textContent+=' 🎉 신기록!';}var message='';if(reactionTime<200)message=' 🔥 놀라워요!';else if(reactionTime<250)message=' 👍 훌륭해요!';else if(reactionTime<300)message=' 😊 좋아요!';else if(reactionTime<400)message=' 👌 괜찮아요!';else message=' 💪 연습하면 더 잘할 수 있어요!';result.textContent+=message;state='done';resetBox();}});
    </script>
  `;
  return layout('순발력 테스트', '/games/reaction-time/', gameHTML, true);
}

// 2. 숫자 기억력 게임
function generateMemoryNumberGame(){
  var gameHTML = `
    <h1>🧠 숫자 기억력</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">숫자를 기억하고 입력하세요. 단계가 올라갈수록 길어집니다!</p>
      <div id="number-display" style="min-height:200px;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:bold;color:#333;margin:24px 0;font-family:monospace"></div>
      <input type="text" id="number-input" placeholder="숫자 입력" style="font-size:24px;text-align:center;display:none;font-family:monospace" maxlength="25">
      <button id="start-btn" class="btn btn-primary" style="font-size:18px;padding:16px 48px">시작하기</button>
      <button id="submit-btn" class="btn btn-success" style="font-size:18px;padding:16px 48px;display:none;margin-left:8px">제출</button>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">현재 단계</div><div id="level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label">자릿수</div><div id="digits" class="stat-value">3</div></div>
        <div class="stat-box"><div class="stat-label">최고 단계</div><div id="best-level" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var display=document.getElementById('number-display'),input=document.getElementById('number-input'),startBtn=document.getElementById('start-btn'),submitBtn=document.getElementById('submit-btn'),levelEl=document.getElementById('level'),digitsEl=document.getElementById('digits'),bestLevelEl=document.getElementById('best-level'),level=1,bestLevel=0,currentNumber='',state='ready';
      function generateNumber(len){var num='';for(var i=0;i<len;i++)num+=Math.floor(Math.random()*10);return num;}
      function showNumber(){var numDigits=level+2;currentNumber=generateNumber(numDigits);digitsEl.textContent=numDigits;display.textContent=currentNumber;var showTime=Math.min(2000+level*300,5000);setTimeout(function(){display.textContent='?';input.style.display='block';submitBtn.style.display='inline-block';input.value='';input.focus();},showTime);}
      function checkAnswer(){if(input.value===currentNumber){level++;levelEl.textContent=level;if(level>bestLevel){bestLevel=level;bestLevelEl.textContent=bestLevel;}display.textContent='✅ 정답!';display.style.color='#27ae60';input.style.display='none';submitBtn.style.display='none';setTimeout(showNumber,1500);}else{display.textContent='❌ 틀렸습니다! 정답: '+currentNumber;display.style.color='#e74c3c';level=1;levelEl.textContent=level;setTimeout(function(){display.textContent='';display.style.color='#333';startBtn.style.display='inline-block';input.style.display='none';submitBtn.style.display='none';state='ready';},3000);}input.style.display='none';submitBtn.style.display='none';}
      startBtn.addEventListener('click',function(){if(state==='ready'){state='playing';startBtn.style.display='none';showNumber();}});
      submitBtn.addEventListener('click',checkAnswer);
      input.addEventListener('keypress',function(e){if(e.key==='Enter')checkAnswer();});
    </script>
  `;
  return layout('숫자 기억력', '/games/memory-number/', gameHTML, true);
}

// 3. 타이핑 속도 테스트
function generateTypingSpeedGame(){
  var gameHTML = `
    <h1>⌨️ 타이핑 속도</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">아래 문장을 빠르고 정확하게 타이핑하세요!</p>
      <div id="target-text" style="font-size:20px;padding:24px;background:#f8f9fa;border-radius:8px;margin:24px 0;line-height:1.8;font-family:monospace"></div>
      <textarea id="typing-input" placeholder="여기에 입력하세요..." style="height:120px;font-size:18px;resize:none;font-family:monospace" disabled></textarea>
      <button id="typing-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px">시작하기</button>
      <div id="typing-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">WPM</div><div id="wpm" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label">정확도</div><div id="accuracy" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label">최고 WPM</div><div id="best-wpm" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var texts=['빠른 갈색 여우가 게으른 개를 뛰어넘는다','인생은 자전거를 타는 것과 같다','꿈을 이루는 비결은 시작하는 것이다','성공은 매일의 작은 노력이 쌓여 만들어진다','오늘 할 수 있는 일을 내일로 미루지 마라','천 리 길도 한 걸음부터 시작한다','실패는 성공의 어머니이다','시간은 금이다 낭비하지 말자','노력은 결코 배신하지 않는다','인내는 쓰지만 그 열매는 달다','최선을 다하면 후회가 없다','행복은 마음먹기에 달려있다','건강이 최고의 재산이다','웃는 얼굴에 침 못 뱉는다','백문이 불여일견이다','가는 말이 고와야 오는 말이 곱다','지금 이 순간을 소중히 여기자','배움에는 끝이 없다','긍정적인 생각이 긍정적인 결과를 만든다','하루하루 최선을 다하며 살자','모든 것은 마음먹기에 달려있다','작은 것에 감사하는 마음을 가지자','함께하면 더 큰 힘이 된다','꾸준함이 재능을 이긴다','변화는 항상 지금 이 순간부터 시작된다'];
      var targetText=document.getElementById('target-text'),typingInput=document.getElementById('typing-input'),typingStart=document.getElementById('typing-start'),typingResult=document.getElementById('typing-result'),wpmEl=document.getElementById('wpm'),accuracyEl=document.getElementById('accuracy'),bestWpmEl=document.getElementById('best-wpm'),startTime=0,bestWpm=0,currentText='',errors=0;
      function startTyping(){currentText=texts[Math.floor(Math.random()*texts.length)];targetText.innerHTML=currentText;typingInput.value='';errors=0;typingInput.disabled=false;typingInput.focus();typingStart.style.display='none';typingResult.textContent='';wpmEl.textContent='0';accuracyEl.textContent='100%';startTime=Date.now();}
      function updateDisplay(){var typed=typingInput.value;var html='';errors=0;for(var i=0;i<currentText.length;i++){if(i<typed.length){if(typed[i]===currentText[i]){html+='<span style="color:#27ae60;background:#d4edda">'+currentText[i]+'</span>';}else{html+='<span style="color:#e74c3c;background:#f8d7da;text-decoration:underline">'+currentText[i]+'</span>';errors++;}}else if(i===typed.length){html+='<span style="background:#fff3cd">'+currentText[i]+'</span>';}else{html+='<span style="color:#666">'+currentText[i]+'</span>';}}targetText.innerHTML=html;var elapsed=(Date.now()-startTime)/1000/60;if(elapsed>0){var wpm=Math.round((typed.length/5)/elapsed);wpmEl.textContent=wpm;}var acc=typed.length>0?Math.round(((typed.length-errors)/typed.length)*100):100;accuracyEl.textContent=acc+'%';}
      typingStart.addEventListener('click',startTyping);
      typingInput.addEventListener('input',function(){updateDisplay();if(typingInput.value===currentText){var elapsed=(Date.now()-startTime)/1000/60;var wpm=Math.round(currentText.length/5/elapsed);wpmEl.textContent=wpm;var finalAcc=Math.round(((currentText.length-errors)/currentText.length)*100);accuracyEl.textContent=finalAcc+'%';typingResult.textContent='✅ 완료! WPM: '+wpm+', 정확도: '+finalAcc+'%';typingResult.style.color='#27ae60';if(wpm>bestWpm){bestWpm=wpm;bestWpmEl.textContent=wpm;}typingInput.disabled=true;typingStart.style.display='inline-block';}});
    </script>
  `;
  return layout('타이핑 속도', '/games/typing-speed/', gameHTML, true);
}

// 4. 색깔 맞추기 게임 (Stroop Effect)
function generateColorMatchGame(){
  var gameHTML = `
    <h1>🎨 색깔 맞추기</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">글자의 <strong>색깔</strong>이 글자의 <strong>의미</strong>와 일치하나요?</p>
      <div id="color-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="color-word" style="font-size:64px;font-weight:bold;margin:48px 0;min-height:80px"></div>
      <div style="display:flex;gap:16px;justify-content:center;margin:24px 0">
        <button id="yes-btn" class="btn btn-success" style="font-size:20px;padding:20px 48px" disabled>일치 ✓</button>
        <button id="no-btn" class="btn btn-danger" style="font-size:20px;padding:20px 48px" disabled>불일치 ✗</button>
      </div>
      <button id="color-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin:16px 0">시작하기</button>
      <div id="color-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">점수</div><div id="score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">연속</div><div id="streak" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고점</div><div id="best-score" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var colors=[{name:'빨강',hex:'#e74c3c'},{name:'파랑',hex:'#3498db'},{name:'초록',hex:'#27ae60'},{name:'노랑',hex:'#f1c40f'},{name:'보라',hex:'#9b59b6'}];
      var colorWord=document.getElementById('color-word'),colorTimer=document.getElementById('color-timer'),yesBtn=document.getElementById('yes-btn'),noBtn=document.getElementById('no-btn'),colorStart=document.getElementById('color-start'),colorResult=document.getElementById('color-result'),scoreEl=document.getElementById('score'),streakEl=document.getElementById('streak'),bestScoreEl=document.getElementById('best-score'),score=0,streak=0,bestScore=0,isMatch=false,timeLeft=60,started=false,timerInterval=null;
      function nextRound(){var wordColor=colors[Math.floor(Math.random()*colors.length)];var displayColor=colors[Math.floor(Math.random()*colors.length)];isMatch=(wordColor.name===displayColor.name);colorWord.textContent=wordColor.name;colorWord.style.color=displayColor.hex;colorResult.textContent='';}
      function checkAnswer(answer){if(!started)return;if(answer===isMatch){score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}colorResult.textContent='✅ 정답!';if(streak>=5)colorResult.textContent+=' 🔥 '+streak+' 연속!';colorResult.style.color='#27ae60';}else{if(streak>=5)colorResult.textContent='💔 '+streak+' 연속 종료!';else colorResult.textContent='❌ 틀렸습니다!';colorResult.style.color='#e74c3c';streak=0;streakEl.textContent=streak;}setTimeout(nextRound,600);}
      function startGame(){started=true;score=0;streak=0;timeLeft=60;scoreEl.textContent=score;streakEl.textContent=streak;yesBtn.disabled=false;noBtn.disabled=false;colorStart.style.display='none';colorResult.textContent='';nextRound();timerInterval=setInterval(function(){timeLeft--;colorTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);started=false;yesBtn.disabled=true;noBtn.disabled=true;colorWord.textContent='시간 종료!';colorWord.style.color='#666';if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}colorResult.textContent='총 '+score+'점!';colorResult.style.color='#0a66c2';colorStart.style.display='inline-block';}},1000);}
      yesBtn.addEventListener('click',function(){checkAnswer(true);});
      noBtn.addEventListener('click',function(){checkAnswer(false);});
      colorStart.addEventListener('click',startGame);
    </script>
  `;
  return layout('색깔 맞추기', '/games/color-match/', gameHTML, true);
}

// 5. 암산 게임
function generateMathQuizGame(){
  var gameHTML = `
    <h1>🔢 암산 게임</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">수학 문제를 빠르게 풀어보세요!</p>
      <div id="timer" style="font-size:48px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="math-question" style="font-size:48px;font-weight:bold;color:#333;margin:32px 0;min-height:60px"></div>
      <input type="number" id="math-input" placeholder="답 입력" style="font-size:32px;text-align:center;width:200px" disabled>
      <button id="math-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px">시작하기</button>
      <div id="math-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">맞춘 문제</div><div id="correct" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고 기록</div><div id="best-correct" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var timerEl=document.getElementById('timer'),mathQuestion=document.getElementById('math-question'),mathInput=document.getElementById('math-input'),mathStart=document.getElementById('math-start'),mathResult=document.getElementById('math-result'),correctEl=document.getElementById('correct'),bestCorrectEl=document.getElementById('best-correct'),timeLeft=60,correct=0,bestCorrect=0,currentAnswer=0,timerInterval=null;
      function generateQuestion(){var a=Math.floor(Math.random()*20)+1;var b=Math.floor(Math.random()*20)+1;var ops=['+','-','×'];var op=ops[Math.floor(Math.random()*ops.length)];if(op==='+'){currentAnswer=a+b;mathQuestion.textContent=a+' + '+b+' = ?';}else if(op==='-'){if(a<b){var temp=a;a=b;b=temp;}currentAnswer=a-b;mathQuestion.textContent=a+' - '+b+' = ?';}else{currentAnswer=a*b;mathQuestion.textContent=a+' × '+b+' = ?';}}
      function startGame(){timeLeft=60;correct=0;correctEl.textContent=correct;mathInput.disabled=false;mathInput.value='';mathInput.focus();mathStart.style.display='none';mathResult.textContent='';generateQuestion();timerInterval=setInterval(function(){timeLeft--;timerEl.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);mathInput.disabled=true;mathQuestion.textContent='시간 종료!';if(correct>bestCorrect){bestCorrect=correct;bestCorrectEl.textContent=bestCorrect;}mathResult.textContent='총 '+correct+'문제 맞춤!';mathResult.style.color='#0a66c2';mathStart.style.display='inline-block';}},1000);}
      function checkAnswer(){var userAnswer=parseInt(mathInput.value);if(isNaN(userAnswer)){mathResult.textContent='⚠️ 숫자를 입력하세요!';mathResult.style.color='#f39c12';return;}if(userAnswer===currentAnswer){correct++;correctEl.textContent=correct;mathResult.textContent='✅ 정답!';mathResult.style.color='#27ae60';mathInput.value='';setTimeout(generateQuestion,300);}else{mathResult.textContent='❌ 오답! 정답은 '+currentAnswer;mathResult.style.color='#e74c3c';setTimeout(function(){mathInput.value='';generateQuestion();mathResult.textContent='';},1500);}}
      mathStart.addEventListener('click',startGame);
      mathInput.addEventListener('keypress',function(e){if(e.key==='Enter')checkAnswer();});
    </script>
  `;
  return layout('암산 게임', '/games/math-quiz/', gameHTML, true);
}

// 6. 패턴 기억 게임 (Simon Says)
function generatePatternMemoryGame(){
  var gameHTML = `
    <h1>🔲 패턴 기억</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">깜빡이는 패턴을 기억하고 순서대로 클릭하세요!</p>
      <div id="pattern-grid" style="display:grid;grid-template-columns:repeat(3,120px);gap:12px;justify-content:center;margin:32px auto"></div>
      <button id="pattern-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px">시작하기</button>
      <div id="pattern-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">현재 단계</div><div id="pattern-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label">최고 단계</div><div id="pattern-best" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var patternGrid=document.getElementById('pattern-grid'),patternStart=document.getElementById('pattern-start'),patternResult=document.getElementById('pattern-result'),patternLevelEl=document.getElementById('pattern-level'),patternBestEl=document.getElementById('pattern-best'),level=1,bestLevel=0,pattern=[],playerPattern=[],playing=false;
      for(var i=0;i<9;i++){var btn=document.createElement('div');btn.style.cssText='width:120px;height:120px;background:#3498db;border-radius:12px;cursor:pointer;transition:all 0.2s';btn.dataset.index=i;btn.addEventListener('click',function(){if(!playing)return;var idx=parseInt(this.dataset.index);this.style.background='#2980b9';setTimeout(function(){document.querySelectorAll('#pattern-grid div')[idx].style.background='#3498db';}.bind(this),200);playerPattern.push(idx);if(playerPattern[playerPattern.length-1]!==pattern[playerPattern.length-1]){patternResult.textContent='❌ 틀렸습니다!';patternResult.style.color='#e74c3c';playing=false;level=1;patternLevelEl.textContent=level;patternStart.style.display='inline-block';}else if(playerPattern.length===pattern.length){level++;patternLevelEl.textContent=level;if(level>bestLevel){bestLevel=level;patternBestEl.textContent=bestLevel;}patternResult.textContent='✅ 정답! 다음 단계...';patternResult.style.color='#27ae60';setTimeout(showPattern,1500);}});patternGrid.appendChild(btn);}
      function showPattern(){playing=false;playerPattern=[];pattern.push(Math.floor(Math.random()*9));patternResult.textContent='패턴을 기억하세요...';var i=0;var interval=setInterval(function(){if(i>=pattern.length){clearInterval(interval);patternResult.textContent='이제 클릭하세요!';playing=true;return;}var idx=pattern[i];var cells=document.querySelectorAll('#pattern-grid div');cells[idx].style.background='#f1c40f';setTimeout(function(){cells[idx].style.background='#3498db';},400);i++;},800);}
      patternStart.addEventListener('click',function(){patternStart.style.display='none';pattern=[];level=1;patternLevelEl.textContent=level;showPattern();});
    </script>
  `;
  return layout('패턴 기억', '/games/pattern-memory/', gameHTML, true);
}

// 7. 클릭 속도 측정
function generateClickSpeedGame(){
  var gameHTML = `
    <h1>👆 클릭 속도</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">10초 동안 최대한 많이 클릭하세요!</p>
      <div id="click-timer" style="font-size:48px;font-weight:bold;color:#e74c3c;margin:24px 0">10.0</div>
      <div id="click-area" style="width:100%;height:300px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;color:white;font-weight:bold;cursor:pointer;user-select:none;margin:24px 0">클릭해서 시작!</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">클릭 수</div><div id="clicks" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">CPS</div><div id="cps" class="stat-value">0.0</div></div>
        <div class="stat-box"><div class="stat-label">최고 CPS</div><div id="best-cps" class="stat-value">0.0</div></div>
      </div>
    </div>
    <script>
      var clickTimer=document.getElementById('click-timer'),clickArea=document.getElementById('click-area'),clicksEl=document.getElementById('clicks'),cpsEl=document.getElementById('cps'),bestCpsEl=document.getElementById('best-cps'),clicks=0,timeLeft=10,started=false,bestCps=0,interval=null;
      clickArea.addEventListener('click',function(){if(!started){started=true;clicks=0;timeLeft=10;clickArea.textContent='클릭하세요!';interval=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){timeLeft=0;clearInterval(interval);started=false;var finalCps=(clicks/10).toFixed(1);cpsEl.textContent=finalCps;if(parseFloat(finalCps)>bestCps){bestCps=parseFloat(finalCps);bestCpsEl.textContent=bestCps.toFixed(1);}clickArea.textContent='완료! 다시 클릭해서 시작';clickArea.style.background='linear-gradient(135deg,#f093fb 0%,#f5576c 100%)';}clickTimer.textContent=timeLeft.toFixed(1);},100);}if(started&&timeLeft>0){clicks++;clicksEl.textContent=clicks;}});
    </script>
  `;
  return layout('클릭 속도', '/games/click-speed/', gameHTML, true);
}

// 8. 목표물 클릭 게임 (Aim Trainer)
function generateAimTrainerGame(){
  var gameHTML = `
    <h1>🎯 목표물 클릭</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">30초 동안 나타나는 원을 빠르게 클릭하세요!</p>
      <div id="aim-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">30</div>
      <div id="aim-area" style="width:100%;height:400px;background:#f8f9fa;border-radius:12px;position:relative;cursor:crosshair;margin:24px 0;display:flex;align-items:center;justify-content:center;font-size:24px;color:#666">클릭해서 시작</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">명중</div><div id="hits" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">정확도</div><div id="aim-accuracy" class="stat-value">0%</div></div>
        <div class="stat-box"><div class="stat-label">최고 점수</div><div id="best-hits" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var aimTimer=document.getElementById('aim-timer'),aimArea=document.getElementById('aim-area'),hitsEl=document.getElementById('hits'),aimAccuracyEl=document.getElementById('aim-accuracy'),bestHitsEl=document.getElementById('best-hits'),hits=0,misses=0,timeLeft=30,started=false,bestHits=0,interval=null,target=null,countdown=null;
      function createTarget(){if(target)target.remove();target=document.createElement('div');var size=Math.random()*30+50;var maxX=aimArea.offsetWidth-size-10;var maxY=aimArea.offsetHeight-size-10;var x=Math.max(10,Math.random()*maxX);var y=Math.max(10,Math.random()*maxY);target.style.cssText='position:absolute;width:'+size+'px;height:'+size+'px;background:#e74c3c;border-radius:50%;cursor:pointer;transition:transform 0.1s;box-shadow:0 2px 8px rgba(231,76,60,0.4)';target.style.left=x+'px';target.style.top=y+'px';target.addEventListener('mouseenter',function(){this.style.transform='scale(1.1)';});target.addEventListener('mouseleave',function(){this.style.transform='scale(1)';});target.addEventListener('click',function(e){e.stopPropagation();hits++;hitsEl.textContent=hits;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';this.style.background='#27ae60';this.style.transform='scale(0)';setTimeout(createTarget,100);});aimArea.appendChild(target);}
      function startCountdown(){countdown=3;aimArea.innerHTML='<div style="font-size:72px;font-weight:bold;color:#667eea">'+countdown+'</div>';var countInterval=setInterval(function(){countdown--;if(countdown>0){aimArea.innerHTML='<div style="font-size:72px;font-weight:bold;color:#667eea">'+countdown+'</div>';}else{clearInterval(countInterval);aimArea.textContent='';started=true;hits=0;misses=0;timeLeft=30;hitsEl.textContent=hits;aimAccuracyEl.textContent='0%';createTarget();interval=setInterval(function(){timeLeft--;aimTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(interval);started=false;if(target)target.remove();if(hits>bestHits){bestHits=hits;bestHitsEl.textContent=bestHits;}var acc=hits+misses>0?Math.round(hits/(hits+misses)*100):0;aimArea.innerHTML='<span style="font-size:24px;color:#666">완료! '+hits+'개 명중 (정확도 '+acc+'%)<br><br>클릭해서 다시 시작</span>';}},1000);}},1000);}
      aimArea.addEventListener('click',function(e){if(e.target!==aimArea)return;if(!started&&!countdown){startCountdown();}else if(started){misses++;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';var missIndicator=document.createElement('div');missIndicator.textContent='Miss!';missIndicator.style.cssText='position:absolute;left:'+e.offsetX+'px;top:'+e.offsetY+'px;color:#e74c3c;font-weight:bold;font-size:20px;pointer-events:none;animation:fadeOut 0.5s forwards';aimArea.appendChild(missIndicator);setTimeout(function(){missIndicator.remove();},500);}});
    </script>
  `;
  return layout('목표물 클릭', '/games/aim-trainer/', gameHTML, true);
}

// 9. 순서 기억 게임
function generateSequenceMemoryGame(){
  var gameHTML = `
    <h1>🔢 순서 기억</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">숫자가 나타나는 순서를 기억하고 순서대로 클릭하세요!</p>
      <div id="seq-grid" style="display:grid;grid-template-columns:repeat(3,100px);gap:12px;justify-content:center;margin:32px auto"></div>
      <button id="seq-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px">시작하기</button>
      <div id="seq-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">현재 단계</div><div id="seq-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label">최고 단계</div><div id="seq-best" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var seqGrid=document.getElementById('seq-grid'),seqStart=document.getElementById('seq-start'),seqResult=document.getElementById('seq-result'),seqLevelEl=document.getElementById('seq-level'),seqBestEl=document.getElementById('seq-best'),level=1,bestLevel=0,sequence=[],playerSeq=[],playing=false;
      for(var i=0;i<9;i++){var btn=document.createElement('div');btn.style.cssText='width:100px;height:100px;background:#ecf0f1;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#34495e;cursor:pointer;transition:all 0.2s';btn.dataset.index=i;btn.addEventListener('click',function(){if(!playing)return;var idx=parseInt(this.dataset.index);this.style.background='#3498db';setTimeout(function(el){el.style.background='#ecf0f1';},200,this);playerSeq.push(idx);if(playerSeq[playerSeq.length-1]!==sequence[playerSeq.length-1]){seqResult.textContent='❌ 틀렸습니다!';seqResult.style.color='#e74c3c';playing=false;level=1;seqLevelEl.textContent=level;seqStart.style.display='inline-block';}else if(playerSeq.length===sequence.length){level++;seqLevelEl.textContent=level;if(level>bestLevel){bestLevel=level;seqBestEl.textContent=bestLevel;}seqResult.textContent='✅ 정답! 다음 단계...';seqResult.style.color='#27ae60';setTimeout(showSequence,1500);}});seqGrid.appendChild(btn);}
      function showSequence(){playing=false;playerSeq=[];sequence.push(Math.floor(Math.random()*9));seqResult.textContent='순서를 기억하세요...';var cells=document.querySelectorAll('#seq-grid div');cells.forEach(function(c){c.textContent='';});var i=0;var interval=setInterval(function(){if(i>=sequence.length){clearInterval(interval);setTimeout(function(){seqResult.textContent='이제 순서대로 클릭하세요!';playing=true;},500);return;}cells[sequence[i]].textContent=i+1;cells[sequence[i]].style.background='#f39c12';setTimeout(function(idx){cells[idx].textContent='';cells[idx].style.background='#ecf0f1';},600,sequence[i]);i++;},800);}
      seqStart.addEventListener('click',function(){seqStart.style.display='none';sequence=[];level=1;seqLevelEl.textContent=level;showSequence();});
    </script>
  `;
  return layout('순서 기억', '/games/sequence-memory/', gameHTML, true);
}

// 10. 단어 만들기 게임
function generateWordPuzzleGame(){
  var gameHTML = `
    <h1>📝 단어 만들기</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">주어진 글자들로 2글자 이상의 단어를 만드세요!</p>
      <div id="word-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="word-letters" style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#333;margin:24px 0"></div>
      <input type="text" id="word-input" placeholder="단어 입력" style="font-size:24px;text-align:center;width:300px" disabled>
      <button id="word-submit" class="btn btn-success" style="font-size:18px;padding:12px 32px;margin:16px 8px" disabled>제출</button>
      <button id="word-start" class="btn btn-primary" style="font-size:18px;padding:12px 32px;margin:16px 8px">시작하기</button>
      <div id="word-feedback" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="word-list" style="margin:24px 0;min-height:100px">
        <div style="color:#666;font-size:14px">만든 단어들이 여기에 표시됩니다</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">단어 수</div><div id="round-words" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">점수</div><div id="score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고 점수</div><div id="best-score" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var wordData=[
        {letters:'가나다라마',words:['가나다','나라','다람','라마','가다','나다','다가','마라','나가','가마','다라','마나']},
        {letters:'사랑행복기',words:['사랑','행복','복사','사기','행사','복기','기사','랑기','사행']},
        {letters:'친구가족집',words:['친구','가족','친가','구가','가구','친족','족구','집구','구족']},
        {letters:'학교공부책',words:['학교','공부','학부','교부','책상','부교','학책','교책','부책','공교','공학']},
        {letters:'음악노래춤',words:['음악','노래','춤','악기','노음','래음','음노','악노','악춤']},
        {letters:'여행바다산',words:['여행','바다','산','행바','다산','여산','바행','산행','여다','다행']},
        {letters:'요리음식맛',words:['요리','음식','맛','식요','리음','맛있','식음','요음','리맛','식맛']},
        {letters:'운동건강몸',words:['운동','건강','몸','동강','강몸','운강','건몸','동몸','운건','강동']},
        {letters:'게임놀이재',words:['게임','놀이','재미','놀재','임재','게재','이재','게놀','임이','놀임']},
        {letters:'꽃나무풀밭',words:['꽃','나무','풀','밭','꽃밭','나풀','풀밭','무풀','나밭','꽃풀']},
        {letters:'하늘구름달',words:['하늘','구름','달','늘구','름달','하구','달구','하늘구','늘름','구달']},
        {letters:'강물고기낚',words:['강물','고기','낚시','물고','기낚','강고','물기','낚물','고물','강기']},
        {letters:'책가방연필',words:['책','가방','연필','책방','방연','필가','가연','책필','방필','연가']},
        {letters:'컴퓨터게임',words:['컴퓨터','게임','퓨터','컴게','터게','컴임','퓨임','터임','게터']},
        {letters:'밥국물반찬',words:['밥','국물','반찬','물반','찬국','밥국','반국','밥물','찬밥','국반']}
      ];
      var wordLetters=document.getElementById('word-letters'),wordTimer=document.getElementById('word-timer'),wordInput=document.getElementById('word-input'),wordSubmit=document.getElementById('word-submit'),wordStart=document.getElementById('word-start'),wordFeedback=document.getElementById('word-feedback'),wordList=document.getElementById('word-list'),roundWordsEl=document.getElementById('round-words'),scoreEl=document.getElementById('score'),bestScoreEl=document.getElementById('best-score'),currentSet=null,foundWords=[],score=0,bestScore=0,timeLeft=60,timerInterval=null;
      function startRound(){var idx=Math.floor(Math.random()*wordData.length);currentSet=wordData[idx];wordLetters.textContent=currentSet.letters.split('').join(' ');foundWords=[];score=0;timeLeft=60;wordList.innerHTML='<div style="color:#666;font-size:14px">단어를 만들어보세요!</div>';roundWordsEl.textContent='0';scoreEl.textContent='0';wordFeedback.textContent='';wordInput.value='';wordInput.disabled=false;wordSubmit.disabled=false;wordStart.textContent='새 라운드';wordInput.focus();timerInterval=setInterval(function(){timeLeft--;wordTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);wordInput.disabled=true;wordSubmit.disabled=true;if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}wordFeedback.textContent='시간 종료! 총 '+foundWords.length+'개 단어, '+score+'점';wordFeedback.style.color='#e74c3c';wordStart.style.display='inline-block';}},1000);}
      function submitWord(){var word=wordInput.value.trim();if(word.length<2){wordFeedback.textContent='❌ 2글자 이상 입력하세요!';wordFeedback.style.color='#e74c3c';return;}var valid=true;var letterCount={};for(var i=0;i<currentSet.letters.length;i++){var c=currentSet.letters[i];letterCount[c]=(letterCount[c]||0)+1;}for(var i=0;i<word.length;i++){var c=word[i];if(!letterCount[c]||letterCount[c]<=0){valid=false;break;}letterCount[c]--;}if(!valid){wordFeedback.textContent='❌ 주어진 글자만 사용하세요!';wordFeedback.style.color='#e74c3c';return;}if(foundWords.indexOf(word)!==-1){wordFeedback.textContent='⚠️ 이미 입력한 단어입니다!';wordFeedback.style.color='#f39c12';return;}if(currentSet.words.indexOf(word)===-1){wordFeedback.textContent='❌ 유효하지 않은 단어입니다!';wordFeedback.style.color='#e74c3c';return;}var points=word.length;score+=points;foundWords.push(word);roundWordsEl.textContent=foundWords.length;scoreEl.textContent=score;wordFeedback.textContent='✅ +'+points+'점!';wordFeedback.style.color='#27ae60';var wordDiv='<div style="display:inline-block;background:#e3f2fd;padding:8px 16px;border-radius:8px;margin:4px;font-weight:bold;color:#1976d2">'+word+' (+'+points+')</div>';if(wordList.querySelector('div').textContent.includes('만들어보세요')){wordList.innerHTML=wordDiv;}else{wordList.innerHTML+=wordDiv;}wordInput.value='';wordInput.focus();}
      wordStart.addEventListener('click',startRound);
      wordSubmit.addEventListener('click',submitWord);
      wordInput.addEventListener('keypress',function(e){if(e.key==='Enter')submitWord();});
    </script>
  `;
  return layout('단어 만들기', '/games/word-puzzle/', gameHTML, true);
}

// 메인 페이지 생성
function renderIndex(){
  var gameList = '';
  for (var i = 0; i < games.length; i++) {
    var g = games[i];
    gameList +=
      '<div class="game-card">' +
      '<div class="game-emoji">' + g.emoji + '</div>' +
      '<div class="game-category">' + g.category + '</div>' +
      '<div class="game-title">' + g.title + '</div>' +
      '<div class="game-description">' + g.description + '</div>' +
      '<a href="' + href('/games/' + g.id + '/') + '" class="play-btn">플레이하기 →</a>' +
      '</div>';
  }

  var body =
    '<div class="header-section">' +
    '<h1>🎮 미니게임 모음집</h1>' +
    '<p style="text-align:center;font-size:20px;margin:16px 0;font-weight:500">재미있는 무료 미니게임으로 두뇌를 훈련하세요!</p>' +
    '<p style="text-align:center;font-size:16px;margin:8px 0;opacity:0.9">총 ' + games.length + '개의 게임이 준비되어 있습니다</p>' +
    '</div>' +
    '<div class="grid">' + gameList + '</div>';

  write(path.join(OUT, 'index.html'), layout('미니게임 모음집 - 두뇌 훈련 & 반응속도 게임', '/', body, true));
}

function build(){
  if(fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  // 메인 페이지 생성
  renderIndex();

  // 각 게임 페이지 생성
  write(path.join(OUT, 'games', 'reaction-time', 'index.html'), generateReactionGame());
  write(path.join(OUT, 'games', 'memory-number', 'index.html'), generateMemoryNumberGame());
  write(path.join(OUT, 'games', 'typing-speed', 'index.html'), generateTypingSpeedGame());
  write(path.join(OUT, 'games', 'color-match', 'index.html'), generateColorMatchGame());
  write(path.join(OUT, 'games', 'math-quiz', 'index.html'), generateMathQuizGame());
  write(path.join(OUT, 'games', 'pattern-memory', 'index.html'), generatePatternMemoryGame());
  write(path.join(OUT, 'games', 'click-speed', 'index.html'), generateClickSpeedGame());
  write(path.join(OUT, 'games', 'aim-trainer', 'index.html'), generateAimTrainerGame());
  write(path.join(OUT, 'games', 'sequence-memory', 'index.html'), generateSequenceMemoryGame());
  write(path.join(OUT, 'games', 'word-puzzle', 'index.html'), generateWordPuzzleGame());

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
