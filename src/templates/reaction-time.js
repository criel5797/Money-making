'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('reaction-time');
  var gameHTML = `
    <h1 data-game-title="reaction-time">⚡ ${title.ko}</h1>
    ${getGameTitleScript('reaction-time', '⚡')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="reaction.desc">빨간색에서 초록색으로 바뀌면 최대한 빠르게 클릭하세요!</p>
      <div id="reaction-box" style="width:100%;height:300px;background:#e74c3c;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;color:white;font-weight:bold;cursor:pointer;user-select:none;margin:24px 0;transition:background 0.1s" data-i18n-game="reaction.clickToStart">클릭해서 시작</div>
      <div id="result" style="margin:16px 0;font-size:20px;font-weight:bold;min-height:30px;color:#333"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="reaction.attempts">시도 횟수</div><div id="attempts" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="reaction.average">평균</div><div id="average" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="reaction.best">최고 기록</div><div id="best" class="stat-value">-</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var box=document.getElementById('reaction-box'),result=document.getElementById('result'),attemptsEl=document.getElementById('attempts'),averageEl=document.getElementById('average'),bestEl=document.getElementById('best'),state='ready',startTime=0,attempts=0,bestTime=null,totalTime=0,validAttempts=0,timeout=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('reaction-time','reactionTime');if(saved!==null){bestTime=saved;bestEl.textContent=saved+'ms';}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('reaction-time','reactionTime');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'ms</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function resetBox(){setTimeout(function(){box.style.background='#3498db';box.textContent=window.i18n[window.currentLang].games.reaction.clickNext;state='ready';},1500);}
      function startGame(){if(state!=='ready')return;state='countdown';var count=3;box.style.background='#f39c12';box.textContent=window.i18n[window.currentLang].games.reaction.ready+count;var countInterval=setInterval(function(){count--;if(count>0){box.textContent=window.i18n[window.currentLang].games.reaction.ready+count;}else{clearInterval(countInterval);state='waiting';box.style.background='#e74c3c';box.textContent=window.i18n[window.currentLang].games.reaction.waitGreen;result.textContent='';var waitTime=2000+Math.random()*3000;timeout=setTimeout(function(){if(state==='waiting'){state='green';box.style.background='#27ae60';box.textContent=window.i18n[window.currentLang].games.reaction.clickNow;startTime=Date.now();}},waitTime);}},1000);}
      box.addEventListener('click',function(){if(state==='ready'){startGame();}else if(state==='countdown'){result.textContent=window.i18n[window.currentLang].games.reaction.waitCountdown;result.style.color='#f39c12';}else if(state==='waiting'){clearTimeout(timeout);state='tooEarly';box.style.background='#95a5a6';box.textContent=window.i18n[window.currentLang].games.reaction.tooFast;result.textContent=window.i18n[window.currentLang].games.reaction.waitUntilGreen;result.style.color='#e74c3c';attempts++;attemptsEl.textContent=attempts;resetBox();}else if(state==='green'){var reactionTime=Date.now()-startTime;attempts++;validAttempts++;totalTime+=reactionTime;attemptsEl.textContent=attempts;var avg=Math.round(totalTime/validAttempts);averageEl.textContent=avg+'ms';result.textContent='✅ '+reactionTime+'ms';result.style.color='#27ae60';var isNewBest=window.GameRecord.save('reaction-time','reactionTime',reactionTime);if(isNewBest){bestTime=reactionTime;bestEl.textContent=reactionTime+'ms';result.textContent+=window.i18n[window.currentLang].games.reaction.newRecord;}else if(bestTime===null||reactionTime<bestTime){bestTime=reactionTime;bestEl.textContent=reactionTime+'ms';}var message='';if(reactionTime<200)message=window.i18n[window.currentLang].games.reaction.msg1;else if(reactionTime<250)message=window.i18n[window.currentLang].games.reaction.msg2;else if(reactionTime<300)message=window.i18n[window.currentLang].games.reaction.msg3;else if(reactionTime<400)message=window.i18n[window.currentLang].games.reaction.msg4;else message=window.i18n[window.currentLang].games.reaction.msg5;result.textContent+=message;state='done';if(historyVisible)renderHistory();resetBox();}});
    </script>
  `;
  return gameHTML;
};
