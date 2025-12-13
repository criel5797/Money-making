'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('color-match');
  var gameHTML = `
    <h1 data-game-title="color-match">🎨 ${title.ko}</h1>
    ${getGameTitleScript('color-match', '🎨')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="colorMatch.desc">글자의 <strong>색깔</strong>이 글자의 <strong>의미</strong>와 일치하나요?</p>
      <div id="color-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="color-word" style="font-size:64px;font-weight:bold;margin:48px 0;min-height:80px"></div>
      <div style="display:flex;gap:16px;justify-content:center;margin:24px 0">
        <button id="yes-btn" class="btn btn-success" style="font-size:20px;padding:20px 48px" disabled data-i18n-game="colorMatch.match">일치 ✓</button>
        <button id="no-btn" class="btn btn-danger" style="font-size:20px;padding:20px 48px" disabled data-i18n-game="colorMatch.noMatch">불일치 ✗</button>
      </div>
      <button id="color-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin:16px 0" data-i18n-game="colorMatch.start">시작하기</button>
      <div id="color-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorMatch.score">점수</div><div id="score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorMatch.streakLabel">연속</div><div id="streak" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorMatch.bestScore">최고점</div><div id="best-score" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var getColorNames=function(){var lang=window.currentLang||'ko';var colorData=window.i18n[lang].games.colorMatch.colors;return[{name:colorData.red,hex:'#e74c3c'},{name:colorData.blue,hex:'#3498db'},{name:colorData.green,hex:'#27ae60'},{name:colorData.yellow,hex:'#f1c40f'},{name:colorData.purple,hex:'#9b59b6'}];};
      var colorWord=document.getElementById('color-word'),colorTimer=document.getElementById('color-timer'),yesBtn=document.getElementById('yes-btn'),noBtn=document.getElementById('no-btn'),colorStart=document.getElementById('color-start'),colorResult=document.getElementById('color-result'),scoreEl=document.getElementById('score'),streakEl=document.getElementById('streak'),bestScoreEl=document.getElementById('best-score'),score=0,streak=0,bestScore=0,isMatch=false,timeLeft=60,started=false,timerInterval=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('color-match','score');if(saved!==null){bestScore=saved;bestScoreEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('color-match','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function nextRound(){var colors=getColorNames();var wordColor=colors[Math.floor(Math.random()*colors.length)];var displayColor=colors[Math.floor(Math.random()*colors.length)];isMatch=(wordColor.name===displayColor.name);colorWord.textContent=wordColor.name;colorWord.style.color=displayColor.hex;colorResult.textContent='';}
      function checkAnswer(answer){if(!started)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.colorMatch;if(answer===isMatch){score++;streak++;scoreEl.textContent=score;streakEl.textContent=streak;if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}colorResult.textContent=txt.correct;if(streak>=5)colorResult.textContent+=txt.streak+streak+txt.streakText;colorResult.style.color='#27ae60';}else{if(streak>=5)colorResult.textContent=txt.streakEnd+streak+txt.streakEndText;else colorResult.textContent=txt.wrong;colorResult.style.color='#e74c3c';streak=0;streakEl.textContent=streak;}setTimeout(nextRound,600);}
      function startGame(){started=true;score=0;streak=0;timeLeft=60;scoreEl.textContent=score;streakEl.textContent=streak;yesBtn.disabled=false;noBtn.disabled=false;colorStart.style.display='none';colorResult.textContent='';nextRound();timerInterval=setInterval(function(){timeLeft--;colorTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);started=false;yesBtn.disabled=true;noBtn.disabled=true;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.colorMatch;colorWord.textContent=txt.timeUp;colorWord.style.color='#666';window.GameRecord.save('color-match','score',score);if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}colorResult.textContent=txt.totalScore+score+txt.points;colorResult.style.color='#0a66c2';if(historyVisible)renderHistory();colorStart.style.display='inline-block';}},1000);}
      yesBtn.addEventListener('click',function(){checkAnswer(true);});
      noBtn.addEventListener('click',function(){checkAnswer(false);});
      colorStart.addEventListener('click',startGame);
    </script>
  `;
  return gameHTML;
};
