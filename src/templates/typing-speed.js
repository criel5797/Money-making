'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('typing-speed');
  var gameHTML = `
    <h1 data-game-title="typing-speed">⌨️ ${title.ko}</h1>
    ${getGameTitleScript('typing-speed', '⌨️')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="typing.desc">아래 문장을 빠르고 정확하게 타이핑하세요!</p>
      <div id="target-text" style="font-size:20px;padding:24px;background:#f8f9fa;border-radius:8px;margin:24px 0;line-height:1.8;font-family:monospace"></div>
      <textarea id="typing-input" data-i18n-game-placeholder="typing.placeholder" placeholder="여기에 입력하세요..." style="height:120px;font-size:18px;resize:none;font-family:monospace" disabled></textarea>
      <button id="typing-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="typing.start">시작하기</button>
      <div id="typing-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.wpm">WPM</div><div id="wpm" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.accuracyLabel">정확도</div><div id="accuracy" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.bestWpm">최고 WPM</div><div id="best-wpm" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      function getTexts(){var lang=window.currentLang||'ko';return window.i18n[lang].games.typing.texts||window.i18n.ko.games.typing.texts;}
      var targetText=document.getElementById('target-text'),typingInput=document.getElementById('typing-input'),typingStart=document.getElementById('typing-start'),typingResult=document.getElementById('typing-result'),wpmEl=document.getElementById('wpm'),accuracyEl=document.getElementById('accuracy'),bestWpmEl=document.getElementById('best-wpm'),startTime=0,bestWpm=0,currentText='',errors=0;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('typing-speed','wpm');if(saved!==null){bestWpm=saved;bestWpmEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('typing-speed','wpm');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+' WPM</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function startTyping(){var texts=getTexts();currentText=texts[Math.floor(Math.random()*texts.length)];targetText.innerHTML=currentText;typingInput.value='';errors=0;typingInput.disabled=false;typingInput.focus();typingStart.style.display='none';typingResult.textContent='';wpmEl.textContent='0';accuracyEl.textContent='100%';startTime=Date.now();}
      function updateDisplay(){var typed=typingInput.value;var html='';errors=0;for(var i=0;i<currentText.length;i++){if(i<typed.length){if(typed[i]===currentText[i]){html+='<span style="color:#27ae60;background:#d4edda">'+currentText[i]+'</span>';}else{html+='<span style="color:#e74c3c;background:#f8d7da;text-decoration:underline">'+currentText[i]+'</span>';errors++;}}else if(i===typed.length){html+='<span style="background:#fff3cd">'+currentText[i]+'</span>';}else{html+='<span style="color:#666">'+currentText[i]+'</span>';}}targetText.innerHTML=html;var elapsed=(Date.now()-startTime)/1000/60;if(elapsed>0){var wpm=Math.round((typed.length/5)/elapsed);wpmEl.textContent=wpm;}var acc=typed.length>0?Math.round(((typed.length-errors)/typed.length)*100):100;accuracyEl.textContent=acc+'%';}
      typingStart.addEventListener('click',startTyping);
      typingInput.addEventListener('input',function(){updateDisplay();if(typingInput.value===currentText){var elapsed=(Date.now()-startTime)/1000/60;var wpm=Math.round(currentText.length/5/elapsed);wpmEl.textContent=wpm;var finalAcc=Math.round(((currentText.length-errors)/currentText.length)*100);accuracyEl.textContent=finalAcc+'%';typingResult.textContent=window.i18n[window.currentLang].games.typing.complete+wpm+window.i18n[window.currentLang].games.typing.accuracy+finalAcc+'%';typingResult.style.color='#27ae60';window.GameRecord.save('typing-speed','wpm',wpm);if(wpm>bestWpm){bestWpm=wpm;bestWpmEl.textContent=wpm;}if(historyVisible)renderHistory();typingInput.disabled=true;typingStart.style.display='inline-block';}});
    </script>
  `;
  return gameHTML;
};
