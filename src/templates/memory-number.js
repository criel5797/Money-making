'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('memory-number');
  var gameHTML = `
    <h1>🧠 ${title.ko}</h1>
    ${getGameTitleScript('memory-number', '🧠')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="memoryNumber.desc">숫자를 기억하고 입력하세요. 단계가 올라갈수록 길어집니다!</p>
      <div id="number-display" style="min-height:200px;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:bold;color:#333;margin:24px 0;font-family:monospace"></div>
      <input type="text" id="number-input" data-i18n-game-placeholder="memoryNumber.placeholder" placeholder="숫자 입력" style="font-size:24px;text-align:center;display:none;font-family:monospace" maxlength="25">
      <button id="start-btn" class="btn btn-primary" style="font-size:18px;padding:16px 48px" data-i18n-game="memoryNumber.start">시작하기</button>
      <button id="submit-btn" class="btn btn-success" style="font-size:18px;padding:16px 48px;display:none;margin-left:8px" data-i18n-game="memoryNumber.submit">제출</button>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="memoryNumber.currentLevel">현재 단계</div><div id="level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="memoryNumber.digits">자릿수</div><div id="digits" class="stat-value">3</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="memoryNumber.bestLevel">최고 단계</div><div id="best-level" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var display=document.getElementById('number-display'),input=document.getElementById('number-input'),startBtn=document.getElementById('start-btn'),submitBtn=document.getElementById('submit-btn'),levelEl=document.getElementById('level'),digitsEl=document.getElementById('digits'),bestLevelEl=document.getElementById('best-level'),level=1,bestLevel=0,currentNumber='',state='ready';
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){var saved=window.GameRecord.getBest('memory-number','level');if(saved!==null){bestLevel=saved;bestLevelEl.textContent=saved;}}
      function renderHistory(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('memory-number','level');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var d=new Date(h.date);var dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">Lv.'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      loadSavedBest();
      function generateNumber(len){var num='';for(var i=0;i<len;i++)num+=Math.floor(Math.random()*10);return num;}
      function showNumber(){var numDigits=level+2;currentNumber=generateNumber(numDigits);digitsEl.textContent=numDigits;display.textContent=currentNumber;var showTime=Math.min(2000+level*300,5000);setTimeout(function(){display.textContent='?';input.style.display='block';submitBtn.style.display='inline-block';input.value='';input.focus();},showTime);}
      function checkAnswer(){if(input.value===currentNumber){level++;levelEl.textContent=level;if(level>bestLevel){bestLevel=level;bestLevelEl.textContent=bestLevel;window.GameRecord.save('memory-number','level',bestLevel);}display.textContent=window.i18n[window.currentLang].games.memoryNumber.correct;display.style.color='#27ae60';input.style.display='none';submitBtn.style.display='none';setTimeout(showNumber,1500);}else{window.GameRecord.save('memory-number','level',level);if(historyVisible)renderHistory();display.textContent=window.i18n[window.currentLang].games.memoryNumber.wrong+currentNumber;display.style.color='#e74c3c';level=1;levelEl.textContent=level;setTimeout(function(){display.textContent='';display.style.color='#333';startBtn.style.display='inline-block';input.style.display='none';submitBtn.style.display='none';state='ready';},3000);}input.style.display='none';submitBtn.style.display='none';}
      startBtn.addEventListener('click',function(){if(state==='ready'){state='playing';startBtn.style.display='none';showNumber();}});
      submitBtn.addEventListener('click',checkAnswer);
      input.addEventListener('keypress',function(e){if(e.key==='Enter')checkAnswer();});
    </script>
  `;
  return gameHTML;
};
