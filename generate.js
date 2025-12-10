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
    'body{font-family:system-ui,-apple-system,sans-serif;max-width:900px;margin:0 auto;padding:24px;line-height:1.6;background:#f5f5f5}' +
    'h1{font-size:32px;margin:16px 0;text-align:center;color:#333}' +
    'h2{font-size:24px;margin:16px 0;color:#444}' +
    'h3{font-size:20px;margin:12px 0;color:#555}' +
    'a{color:#0a66c2;text-decoration:none} a:hover{text-decoration:underline}' +
    '.game-card{background:white;border-radius:12px;padding:24px;margin:16px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:transform 0.2s}' +
    '.game-card:hover{transform:translateY(-4px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}' +
    '.game-emoji{font-size:48px;margin:16px 0;text-align:center}' +
    '.game-title{font-size:24px;font-weight:bold;margin:12px 0;color:#333}' +
    '.game-description{color:#666;margin:8px 0}' +
    '.game-category{display:inline-block;background:#e3f2fd;color:#1976d2;padding:4px 12px;border-radius:12px;font-size:12px;margin:8px 0}' +
    '.play-btn{display:inline-block;background:#0a66c2;color:white;padding:12px 32px;border-radius:8px;margin:16px 0;font-size:18px;font-weight:bold;cursor:pointer;border:none;transition:background 0.2s;text-align:center}' +
    '.play-btn:hover{background:#084a8f;text-decoration:none}' +
    '.btn{padding:12px 24px;font-size:16px;font-weight:bold;border:none;border-radius:8px;cursor:pointer;transition:all 0.2s}' +
    '.btn-primary{background:#0a66c2;color:white}.btn-primary:hover{background:#084a8f}' +
    '.btn-success{background:#27ae60;color:white}.btn-success:hover{background:#1e8449}' +
    '.btn-danger{background:#e74c3c;color:white}.btn-danger:hover{background:#c0392b}' +
    'input,textarea{padding:12px;font-size:16px;border:2px solid #ddd;border-radius:8px;width:100%;box-sizing:border-box;margin:8px 0}' +
    'input:focus,textarea:focus{outline:none;border-color:#0a66c2}' +
    'footer{color:#777;margin:32px 0;text-align:center;font-size:14px}' +
    '.placeholder{height:90px;background:#f2f2f2;border:1px dashed #ddd;display:flex;align-items:center;justify-content:center;color:#888;font-size:12px;border-radius:8px;margin:24px 0}' +
    'nav{text-align:center;margin:24px 0}' +
    'nav a{margin:0 12px;font-size:16px}' +
    '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}' +
    '.stat-box{background:#f8f9fa;padding:16px;border-radius:8px;text-align:center}' +
    '.stat-label{font-size:14px;color:#666}' +
    '.stat-value{font-size:32px;font-weight:bold;color:#333;margin-top:8px}' +
    '</style>' +
    '</head><body>' +
    '<nav><a href="' + href('/') + '">🏠 홈</a></nav>';

  var tail =
    '<div class="ad">' + ads + '</div>' +
    '<footer>© ' + (new Date().getFullYear()) + ' Fun Mini Games | <a href="' + href('/') + '">전체 게임 보기</a></footer>' +
    '</body></html>';

  return head + body + tail;
}

// 1. 순발력 테스트 게임
function generateReactionGame(){
  var gameHTML = `
    <h1>⚡ 순발력 테스트</h1>
    <div class="game-card" style="text-align:center">
      <p style="color:#666">빨간색에서 초록색으로 바뀌면 최대한 빠르게 클릭하세요!</p>
      <div id="reaction-box" style="width:100%;height:300px;background:#e74c3c;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;color:white;font-weight:bold;cursor:pointer;user-select:none;margin:24px 0">클릭해서 시작</div>
      <div id="result" style="margin:16px 0;font-size:20px;font-weight:bold;min-height:30px;color:#333"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">시도 횟수</div><div id="attempts" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고 기록</div><div id="best" class="stat-value">-</div></div>
      </div>
    </div>
    <script>
      var box=document.getElementById('reaction-box'),result=document.getElementById('result'),attemptsEl=document.getElementById('attempts'),bestEl=document.getElementById('best'),state='ready',startTime=0,attempts=0,bestTime=null,timeout=null;
      function resetBox(){box.style.background='#e74c3c';box.textContent='클릭해서 시작';state='ready';result.textContent='';result.style.color='#333';}
      function startGame(){if(state!=='ready')return;state='waiting';box.style.background='#e74c3c';box.textContent='초록색이 될 때까지 기다리세요...';result.textContent='';var waitTime=2000+Math.random()*3000;timeout=setTimeout(function(){state='green';box.style.background='#27ae60';box.textContent='지금 클릭!';startTime=Date.now();},waitTime);}
      box.addEventListener('click',function(){if(state==='ready'){startGame();}else if(state==='waiting'){clearTimeout(timeout);state='tooEarly';box.style.background='#95a5a6';box.textContent='너무 빨라요!';result.textContent='❌ 초록색으로 바뀔 때까지 기다리세요!';result.style.color='#e74c3c';attempts++;attemptsEl.textContent=attempts;setTimeout(resetBox,2000);}else if(state==='green'){var reactionTime=Date.now()-startTime;attempts++;attemptsEl.textContent=attempts;result.textContent='✅ '+reactionTime+'ms';result.style.color='#27ae60';if(bestTime===null||reactionTime<bestTime){bestTime=reactionTime;bestEl.textContent=reactionTime+'ms';result.textContent+=' 🎉 신기록!';}var message='';if(reactionTime<200)message=' 🔥 놀라워요!';else if(reactionTime<250)message=' 👍 훌륭해요!';else if(reactionTime<300)message=' 😊 좋아요!';else if(reactionTime<400)message=' 👌 괜찮아요!';else message=' 💪 연습하면 더 잘할 수 있어요!';result.textContent+=message;setTimeout(resetBox,2000);}});
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
      <div id="number-display" style="min-height:200px;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:bold;color:#333;margin:24px 0"></div>
      <input type="text" id="number-input" placeholder="숫자 입력" style="font-size:24px;text-align:center;display:none" maxlength="20">
      <button id="start-btn" class="btn btn-primary" style="font-size:18px;padding:16px 48px">시작하기</button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">현재 단계</div><div id="level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label">최고 단계</div><div id="best-level" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var display=document.getElementById('number-display'),input=document.getElementById('number-input'),startBtn=document.getElementById('start-btn'),levelEl=document.getElementById('level'),bestLevelEl=document.getElementById('best-level'),level=1,bestLevel=0,currentNumber='',state='ready';
      function generateNumber(len){var num='';for(var i=0;i<len;i++)num+=Math.floor(Math.random()*10);return num;}
      function showNumber(){currentNumber=generateNumber(level+2);display.textContent=currentNumber;setTimeout(function(){display.textContent='?';input.style.display='block';input.value='';input.focus();},2000);}
      function checkAnswer(){if(input.value===currentNumber){level++;levelEl.textContent=level;if(level>bestLevel){bestLevel=level;bestLevelEl.textContent=bestLevel;}display.textContent='✅ 정답!';display.style.color='#27ae60';setTimeout(showNumber,1500);}else{display.textContent='❌ 틀렸습니다! 정답: '+currentNumber;display.style.color='#e74c3c';level=1;levelEl.textContent=level;setTimeout(function(){display.textContent='';display.style.color='#333';startBtn.style.display='inline-block';input.style.display='none';state='ready';},3000);}input.style.display='none';}
      startBtn.addEventListener('click',function(){if(state==='ready'){state='playing';startBtn.style.display='none';showNumber();}});
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
      <div id="target-text" style="font-size:20px;padding:24px;background:#f8f9fa;border-radius:8px;margin:24px 0;line-height:1.8;color:#333"></div>
      <textarea id="typing-input" placeholder="여기에 입력하세요..." style="height:120px;font-size:16px;resize:none" disabled></textarea>
      <button id="typing-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px">시작하기</button>
      <div id="typing-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">WPM</div><div id="wpm" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label">정확도</div><div id="accuracy" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label">최고 WPM</div><div id="best-wpm" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var texts=['빠른 갈색 여우가 게으른 개를 뛰어넘는다','인생은 자전거를 타는 것과 같다','꿈을 이루는 비결은 시작하는 것이다','성공은 매일의 작은 노력이 쌓여 만들어진다','오늘 할 수 있는 일을 내일로 미루지 마라'];
      var targetText=document.getElementById('target-text'),typingInput=document.getElementById('typing-input'),typingStart=document.getElementById('typing-start'),typingResult=document.getElementById('typing-result'),wpmEl=document.getElementById('wpm'),accuracyEl=document.getElementById('accuracy'),bestWpmEl=document.getElementById('best-wpm'),startTime=0,bestWpm=0,currentText='';
      function startTyping(){currentText=texts[Math.floor(Math.random()*texts.length)];targetText.textContent=currentText;typingInput.value='';typingInput.disabled=false;typingInput.focus();typingStart.style.display='none';typingResult.textContent='';wpmEl.textContent='-';accuracyEl.textContent='-';startTime=Date.now();}
      typingStart.addEventListener('click',startTyping);
      typingInput.addEventListener('input',function(){if(typingInput.value===currentText){var elapsed=(Date.now()-startTime)/1000/60;var wpm=Math.round(currentText.length/5/elapsed);wpmEl.textContent=wpm;accuracyEl.textContent='100%';typingResult.textContent='✅ 완료!';typingResult.style.color='#27ae60';if(wpm>bestWpm){bestWpm=wpm;bestWpmEl.textContent=wpm;}typingInput.disabled=true;typingStart.style.display='inline-block';}});
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
      <div id="color-word" style="font-size:64px;font-weight:bold;margin:48px 0;min-height:80px"></div>
      <div style="display:flex;gap:16px;justify-content:center;margin:24px 0">
        <button id="yes-btn" class="btn btn-success" style="font-size:20px;padding:20px 48px">일치 ✓</button>
        <button id="no-btn" class="btn btn-danger" style="font-size:20px;padding:20px 48px">불일치 ✗</button>
      </div>
      <div id="color-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">점수</div><div id="score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">연속</div><div id="streak" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고점</div><div id="best-score" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var colors=[{name:'빨강',hex:'#e74c3c'},{name:'파랑',hex:'#3498db'},{name:'초록',hex:'#27ae60'},{name:'노랑',hex:'#f1c40f'},{name:'보라',hex:'#9b59b6'}];
      var colorWord=document.getElementById('color-word'),yesBtn=document.getElementById('yes-btn'),noBtn=document.getElementById('no-btn'),colorResult=document.getElementById('color-result'),scoreEl=document.getElementById('score'),streakEl=document.getElementById('streak'),bestScoreEl=document.getElementById('best-score'),score=0,streak=0,bestScore=0,isMatch=false;
      function nextRound(){var wordColor=colors[Math.floor(Math.random()*colors.length)];var displayColor=colors[Math.floor(Math.random()*colors.length)];isMatch=(wordColor.name===displayColor.name);colorWord.textContent=wordColor.name;colorWord.style.color=displayColor.hex;colorResult.textContent='';}
      function checkAnswer(answer){if(answer===isMatch){score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}colorResult.textContent='✅ 정답!';colorResult.style.color='#27ae60';}else{streak=0;streakEl.textContent=streak;colorResult.textContent='❌ 틀렸습니다!';colorResult.style.color='#e74c3c';}setTimeout(nextRound,800);}
      yesBtn.addEventListener('click',function(){checkAnswer(true);});
      noBtn.addEventListener('click',function(){checkAnswer(false);});
      nextRound();
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
      function checkAnswer(){if(parseInt(mathInput.value)===currentAnswer){correct++;correctEl.textContent=correct;mathResult.textContent='✅ 정답!';mathResult.style.color='#27ae60';mathInput.value='';generateQuestion();}else{mathResult.textContent='❌ 오답!';mathResult.style.color='#e74c3c';}}
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
      var aimTimer=document.getElementById('aim-timer'),aimArea=document.getElementById('aim-area'),hitsEl=document.getElementById('hits'),aimAccuracyEl=document.getElementById('aim-accuracy'),bestHitsEl=document.getElementById('best-hits'),hits=0,misses=0,timeLeft=30,started=false,bestHits=0,interval=null,target=null;
      function createTarget(){if(target)target.remove();target=document.createElement('div');var size=Math.random()*40+40;target.style.cssText='position:absolute;width:'+size+'px;height:'+size+'px;background:#e74c3c;border-radius:50%;cursor:pointer';target.style.left=(Math.random()*(aimArea.offsetWidth-size))+'px';target.style.top=(Math.random()*(aimArea.offsetHeight-size))+'px';target.addEventListener('click',function(e){e.stopPropagation();hits++;hitsEl.textContent=hits;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';createTarget();});aimArea.appendChild(target);}
      aimArea.addEventListener('click',function(e){if(e.target!==aimArea)return;if(!started){started=true;hits=0;misses=0;timeLeft=30;hitsEl.textContent=hits;aimAccuracyEl.textContent='0%';aimArea.textContent='';createTarget();interval=setInterval(function(){timeLeft--;aimTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(interval);started=false;if(target)target.remove();if(hits>bestHits){bestHits=hits;bestHitsEl.textContent=bestHits;}aimArea.innerHTML='<span style="font-size:24px;color:#666">완료! '+hits+'개 명중<br><br>클릭해서 다시 시작</span>';}},1000);}else{misses++;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';}});
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
      <p style="color:#666">주어진 글자들로 3글자 이상의 단어를 만드세요!</p>
      <div id="word-letters" style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#333;margin:32px 0"></div>
      <input type="text" id="word-input" placeholder="단어 입력" style="font-size:24px;text-align:center;width:300px" disabled>
      <button id="word-submit" class="btn btn-success" style="font-size:18px;padding:12px 32px;margin:16px 8px" disabled>제출</button>
      <button id="word-start" class="btn btn-primary" style="font-size:18px;padding:12px 32px;margin:16px 8px">시작하기</button>
      <div id="word-list" style="margin:24px 0;min-height:100px">
        <div style="color:#666;font-size:14px">만든 단어들이 여기에 표시됩니다</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label">이번 라운드</div><div id="round-words" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label">최고 기록</div><div id="best-words" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var letterSets=['가나다라마','사랑행복기','친구가족집','학교공부책','음악노래춤','여행바다산','요리음식맛','운동건강몸','게임놀이재','꽃나무풀'];
      var validWords={'가나다':1,'나라':1,'다리':1,'라마':1,'사랑':1,'행복':1,'기쁨':1,'친구':1,'가족':1,'학교':1,'공부':1,'음악':1,'노래':1,'여행':1,'바다':1,'요리':1,'음식':1,'운동':1,'건강':1,'게임':1,'놀이':1};
      var wordLetters=document.getElementById('word-letters'),wordInput=document.getElementById('word-input'),wordSubmit=document.getElementById('word-submit'),wordStart=document.getElementById('word-start'),wordList=document.getElementById('word-list'),roundWordsEl=document.getElementById('round-words'),bestWordsEl=document.getElementById('best-words'),currentLetters='',foundWords=[],bestWords=0;
      function startRound(){currentLetters=letterSets[Math.floor(Math.random()*letterSets.length)];wordLetters.textContent=currentLetters.split('').join(' ');foundWords=[];wordList.innerHTML='<div style="color:#666;font-size:14px">단어를 만들어보세요!</div>';roundWordsEl.textContent='0';wordInput.value='';wordInput.disabled=false;wordSubmit.disabled=false;wordStart.textContent='새 라운드';wordInput.focus();}
      function submitWord(){var word=wordInput.value.trim();if(word.length<2){alert('2글자 이상 입력하세요!');return;}var valid=true;for(var i=0;i<word.length;i++){if(currentLetters.indexOf(word[i])===-1){valid=false;break;}}if(!valid){alert('주어진 글자만 사용하세요!');return;}if(foundWords.indexOf(word)!==-1){alert('이미 입력한 단어입니다!');return;}foundWords.push(word);roundWordsEl.textContent=foundWords.length;if(foundWords.length>bestWords){bestWords=foundWords.length;bestWordsEl.textContent=bestWords;}var wordDiv='<div style="display:inline-block;background:#e3f2fd;padding:8px 16px;border-radius:8px;margin:4px;font-weight:bold;color:#1976d2">'+word+'</div>';if(wordList.querySelector('div').textContent.includes('만들어보세요')){wordList.innerHTML=wordDiv;}else{wordList.innerHTML+=wordDiv;}wordInput.value='';}
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
      '<a href="' + href('/games/' + g.id + '/') + '" class="play-btn">플레이하기</a>' +
      '</div>';
  }

  var body =
    '<h1>🎮 미니게임 모음집</h1>' +
    '<p style="text-align:center;color:#666;font-size:18px;margin-bottom:32px">재미있는 무료 미니게임으로 두뇌를 훈련하세요!</p>' +
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
