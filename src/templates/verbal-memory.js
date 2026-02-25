'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('verbal-memory');
  var gameHTML = `
    <h1 data-game-title="verbal-memory">💬 ${title.ko}</h1>
    ${getGameTitleScript('verbal-memory', '💬')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="verbalMemory.desc">단어를 보고 이전에 본 단어인지 새로운 단어인지 판단하세요!</p>
      <div id="verbal-word" style="font-size:48px;font-weight:bold;margin:48px 0;min-height:70px;color:#333"></div>
      <div id="verbal-buttons" style="display:flex;justify-content:center;gap:20px;margin:24px 0">
        <button id="verbal-seen" class="btn" style="background:#667eea;color:white;padding:16px 40px;font-size:18px;border:none;border-radius:8px;cursor:pointer" data-i18n-game="verbalMemory.seen">본 단어</button>
        <button id="verbal-new" class="btn" style="background:#27ae60;color:white;padding:16px 40px;font-size:18px;border:none;border-radius:8px;cursor:pointer" data-i18n-game="verbalMemory.new">새 단어</button>
      </div>
      <button id="verbal-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="verbalMemory.start">시작하기</button>
      <div id="verbal-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="verbal-lives" style="margin:12px 0;font-size:24px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="verbalMemory.score">점수</div><div id="verbal-score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="verbalMemory.bestScore">최고점</div><div id="verbal-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var verbalWord=document.getElementById('verbal-word'),verbalSeen=document.getElementById('verbal-seen'),verbalNew=document.getElementById('verbal-new'),verbalStart=document.getElementById('verbal-start');
      var verbalResult=document.getElementById('verbal-result'),verbalScoreEl=document.getElementById('verbal-score'),verbalBestEl=document.getElementById('verbal-best'),verbalLivesEl=document.getElementById('verbal-lives');
      var score=0,bestScore=0,lives=3,seenWords=[],currentWord='',isNewWord=true,playing=false;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('verbal-memory','score');if(saved!==null){bestScore=saved;verbalBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('verbal-memory','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function getWordList(){var lang=window.currentLang||'ko';return window.i18n[lang].games.verbalMemory.words;}

      function updateLives(){verbalLivesEl.textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);}

      function nextWord(){
        var words=getWordList();
        if(Math.random()<0.4&&seenWords.length>0){
          currentWord=seenWords[Math.floor(Math.random()*seenWords.length)];
          isNewWord=false;
        }else{
          var availableWords=words.filter(function(w){return seenWords.indexOf(w)===-1;});
          if(availableWords.length===0){availableWords=words;}
          currentWord=availableWords[Math.floor(Math.random()*availableWords.length)];
          isNewWord=true;
        }
        verbalWord.textContent=currentWord;
      }

      function handleAnswer(isSeen){
        if(!playing)return;
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.verbalMemory;
        var correctAnswer=!isNewWord;
        if(isSeen===correctAnswer){
          score++;verbalScoreEl.textContent=score;
          verbalResult.textContent=txt.correct;verbalResult.style.color='#27ae60';
          if(isNewWord&&seenWords.indexOf(currentWord)===-1)seenWords.push(currentWord);
        }else{
          lives--;updateLives();
          verbalResult.textContent=txt.wrong;verbalResult.style.color='#e74c3c';
          if(lives<=0){
            playing=false;
            verbalResult.textContent=txt.gameOver+' '+txt.finalScore+score;
            if(score>bestScore){bestScore=score;verbalBestEl.textContent=bestScore;}
            window.GameRecord.save('verbal-memory','score',score);if(historyVisible)renderHistory();
            verbalStart.style.display='inline-block';verbalSeen.style.display='none';verbalNew.style.display='none';
            return;
          }
        }
        nextWord();
      }

      verbalSeen.addEventListener('click',function(){handleAnswer(true);});
      verbalNew.addEventListener('click',function(){handleAnswer(false);});

      function startGame(){
        score=0;lives=3;seenWords=[];playing=true;
        verbalScoreEl.textContent='0';updateLives();verbalResult.textContent='';
        verbalStart.style.display='none';verbalSeen.style.display='inline-block';verbalNew.style.display='inline-block';
        nextWord();
      }

      verbalStart.addEventListener('click',startGame);
      verbalSeen.style.display='none';verbalNew.style.display='none';
    </script>
  `;
  return gameHTML;
};
