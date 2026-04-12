'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('stroop-test');
  var gameHTML = `
    <h1 data-game-title="stroop-test">🧪 ${title.ko}</h1>
    ${getGameTitleScript('stroop-test', '🧪')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="stroop.desc">글자의 색깔을 보고 빠르게 선택하세요!</p>
      <div id="stroop-word" style="font-size:72px;font-weight:bold;margin:40px 0;min-height:100px;line-height:100px"></div>
      <div id="stroop-question" style="font-size:18px;margin-bottom:20px;color:#666" data-i18n-game="stroop.question">이 글자의 색깔은?</div>
      <div id="stroop-buttons" style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:24px 0"></div>
      <button id="stroop-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="stroop.start">시작하기</button>
      <div id="stroop-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="stroop-timer" style="font-size:24px;color:#667eea;font-weight:bold;margin:12px 0">30s</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="stroop.score">점수</div><div id="stroop-score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="stroop.accuracy">정확도</div><div id="stroop-accuracy" class="stat-value">0%</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="stroop.bestScore">최고점</div><div id="stroop-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var stroopWord=document.getElementById('stroop-word'),stroopButtons=document.getElementById('stroop-buttons'),stroopStart=document.getElementById('stroop-start'),stroopResult=document.getElementById('stroop-result');
      var stroopScoreEl=document.getElementById('stroop-score'),stroopAccEl=document.getElementById('stroop-accuracy'),stroopBestEl=document.getElementById('stroop-best'),stroopTimerEl=document.getElementById('stroop-timer');
      var score=0,correct=0,total=0,bestScore=0,playing=false,timer=null,timeLeft=30;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      var colors={red:'#e74c3c',blue:'#3498db',green:'#27ae60',yellow:'#f1c40f',purple:'#9b59b6',orange:'#e67e22'};
      var colorKeys=Object.keys(colors);

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('stroop-test','score');if(saved!==null){bestScore=saved;stroopBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('stroop-test','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function getColorName(key){var lang=window.currentLang||'ko';return window.i18n[lang].games.stroop.colors[key]||key;}

      function createButtons(){
        stroopButtons.innerHTML='';
        colorKeys.forEach(function(key){
          var btn=document.createElement('button');
          btn.className='btn';
          btn.style.cssText='background:'+colors[key]+';color:white;padding:12px 24px;font-size:16px;border:none;border-radius:8px;cursor:pointer;min-width:80px;text-shadow:1px 1px 2px rgba(0,0,0,0.3)';
          btn.textContent=getColorName(key);
          btn.dataset.color=key;
          btn.addEventListener('click',handleAnswer);
          stroopButtons.appendChild(btn);
        });
      }

      function nextWord(){
        var wordKey=colorKeys[Math.floor(Math.random()*colorKeys.length)];
        var colorKey=colorKeys[Math.floor(Math.random()*colorKeys.length)];
        stroopWord.textContent=getColorName(wordKey);
        stroopWord.style.color=colors[colorKey];
        stroopWord.dataset.answer=colorKey;
      }

      function handleAnswer(e){
        if(!playing)return;
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.stroop;
        total++;
        if(e.target.dataset.color===stroopWord.dataset.answer){
          correct++;score+=10;
          stroopResult.textContent=txt.correct;stroopResult.style.color='#27ae60';
        }else{
          score=Math.max(0,score-5);
          stroopResult.textContent=txt.wrong;stroopResult.style.color='#e74c3c';
        }
        stroopScoreEl.textContent=score;
        stroopAccEl.textContent=Math.round(correct/total*100)+'%';
        nextWord();
      }

      function endGame(){
        playing=false;clearInterval(timer);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.stroop;
        stroopResult.textContent=txt.timeUp+' '+txt.finalScore+score;stroopResult.style.color='#667eea';
        if(score>bestScore){bestScore=score;stroopBestEl.textContent=bestScore;}
        window.GameRecord.save('stroop-test','score',score);if(historyVisible)renderHistory();var stroopLang=lang||'ko';var stroopSharePerc=score>=200?' 상위 1%!':score>=150?' 상위 5%!':score>=100?' 상위 20%!':'';var stroopShareMsg=stroopLang==='ko'?'🧪 스트룹 테스트 '+score+'점 달성!'+stroopSharePerc+' 너도 해봐!':stroopLang==='ja'?'🧪 ストループテスト '+score+'点達成！'+(score>=100?' 上位20%！':'')+' あなたも挑戦！':'🧪 Stroop test score: '+score+'!'+(score>=150?' Top 5%!':'')+' Can you beat it?';window._shareResult={title:stroopShareMsg,text:stroopShareMsg,url:window.location.href};
        stroopStart.style.display='inline-block';stroopWord.textContent='';
      }

      function startGame(){
        score=0;correct=0;total=0;timeLeft=30;playing=true;
        stroopScoreEl.textContent='0';stroopAccEl.textContent='0%';stroopTimerEl.textContent='30s';
        stroopStart.style.display='none';stroopResult.textContent='';
        createButtons();nextWord();
        timer=setInterval(function(){
          timeLeft--;stroopTimerEl.textContent=timeLeft+'s';
          if(timeLeft<=0)endGame();
        },1000);
      }

      stroopStart.addEventListener('click',startGame);
      window.addEventListener('languageChanged',function(){if(playing){createButtons();nextWord();}});
    </script>
  `;
  return gameHTML;
};
