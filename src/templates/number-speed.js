'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('number-speed');
  var gameHTML = `
    <h1 data-game-title="number-speed">⚡ ${title.ko}</h1>
    ${getGameTitleScript('number-speed', '⚡')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="numberSpeed.desc">두 숫자 중 큰 숫자를 빠르게 선택하세요!</p>
      <div id="ns-timer" style="font-size:24px;font-weight:bold;color:#667eea;margin:15px 0">30s</div>
      <div id="ns-numbers" style="display:flex;justify-content:center;gap:30px;margin:30px 0">
        <button id="ns-left" class="num-btn" style="width:140px;height:140px;font-size:48px;font-weight:bold;border:none;border-radius:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;cursor:pointer;transition:all 0.2s">--</button>
        <button id="ns-right" class="num-btn" style="width:140px;height:140px;font-size:48px;font-weight:bold;border:none;border-radius:20px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;cursor:pointer;transition:all 0.2s">--</button>
      </div>
      <button id="ns-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px" data-i18n-game="numberSpeed.start">시작하기</button>
      <div id="ns-result" style="margin:20px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="numberSpeed.correctLabel">정답</div><div id="ns-correct" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="numberSpeed.avgTime">평균 시간</div><div id="ns-avg" class="stat-value">--</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="numberSpeed.best">최고점</div><div id="ns-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var nsLeft=document.getElementById('ns-left'),nsRight=document.getElementById('ns-right'),nsStart=document.getElementById('ns-start');
      var nsResult=document.getElementById('ns-result'),nsTimerEl=document.getElementById('ns-timer');
      var nsCorrectEl=document.getElementById('ns-correct'),nsAvgEl=document.getElementById('ns-avg'),nsBestEl=document.getElementById('ns-best');
      var correct=0,bestScore=0,playing=false,timer=null,nextRoundTimeout=null,timeLeft=30,leftNum=0,rightNum=0,roundStart=0,times=[];
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('number-speed','score');if(saved!==null){bestScore=saved;nsBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('number-speed','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function generateNumbers(){
        if(!playing)return;
        var max=10+correct*5;
        leftNum=Math.floor(Math.random()*max)+1;
        do{rightNum=Math.floor(Math.random()*max)+1;}while(rightNum===leftNum);
        nsLeft.textContent=leftNum;nsRight.textContent=rightNum;
        nsLeft.style.background='linear-gradient(135deg,#667eea,#764ba2)';
        nsRight.style.background='linear-gradient(135deg,#667eea,#764ba2)';
        roundStart=Date.now();
      }

      function handleChoice(chosenLeft){
        if(!playing)return;
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.numberSpeed;
        var elapsed=Date.now()-roundStart;
        var isCorrect=(chosenLeft&&leftNum>rightNum)||(!chosenLeft&&rightNum>leftNum);
        var correctBtn=leftNum>rightNum?nsLeft:nsRight;
        var wrongBtn=leftNum>rightNum?nsRight:nsLeft;
        if(isCorrect){
          correct++;times.push(elapsed);
          nsCorrectEl.textContent=correct;
          correctBtn.style.background='#27ae60';
          nsResult.textContent=txt.correct+' ('+elapsed+'ms)';nsResult.style.color='#27ae60';
          var avg=Math.round(times.reduce(function(a,b){return a+b;},0)/times.length);
          nsAvgEl.textContent=avg+'ms';
        }else{
          correctBtn.style.background='#27ae60';wrongBtn.style.background='#e74c3c';
          nsResult.textContent=txt.wrong;nsResult.style.color='#e74c3c';
        }
        if(nextRoundTimeout)clearTimeout(nextRoundTimeout);
        nextRoundTimeout=setTimeout(function(){nextRoundTimeout=null;generateNumbers();},500);
      }

      nsLeft.addEventListener('click',function(){handleChoice(true);});
      nsRight.addEventListener('click',function(){handleChoice(false);});

      function endGame(){
        playing=false;clearInterval(timer);timer=null;
        if(nextRoundTimeout){clearTimeout(nextRoundTimeout);nextRoundTimeout=null;}
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.numberSpeed;
        var nsMsg=correct>=35?txt.msg1:correct>=28?txt.msg2:correct>=22?txt.msg3:correct>=16?txt.msg4:correct>=10?txt.msg5:txt.msg6;nsResult.textContent=txt.timeUp+' '+txt.finalScore+correct+nsMsg;nsResult.style.color='#667eea';
        if(correct>bestScore){bestScore=correct;nsBestEl.textContent=bestScore;}
        window.GameRecord.save('number-speed','score',correct);if(historyVisible)renderHistory();var lang=window.currentLang||'ko';var shtxt=lang==='ko'?'⚡ 숫자 비교 '+correct+'점 달성! 너도 해봐!':lang==='ja'?'⚡ 数字比較'+correct+'点達成！あなたも挑戦！':'⚡ Scored '+correct+' on number speed! Can you beat it?';window._shareResult={title:shtxt,text:shtxt,url:window.location.href};
        nsStart.style.display='inline-block';
        nsLeft.textContent='--';nsRight.textContent='--';
      }

      function startGame(){
        if(timer)clearInterval(timer);
        if(nextRoundTimeout){clearTimeout(nextRoundTimeout);nextRoundTimeout=null;}
        correct=0;timeLeft=30;times=[];playing=true;
        nsCorrectEl.textContent='0';nsAvgEl.textContent='--';nsTimerEl.textContent='30s';
        nsStart.style.display='none';nsResult.textContent='';
        generateNumbers();
        timer=setInterval(function(){
          timeLeft--;nsTimerEl.textContent=timeLeft+'s';
          if(timeLeft<=0)endGame();
        },1000);
      }

      nsStart.addEventListener('click',startGame);
    </script>
  `;
  return gameHTML;
};
