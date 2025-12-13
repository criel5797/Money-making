'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('pattern-memory');
  var gameHTML = `
    <h1 data-game-title="pattern-memory">🔲 ${title.ko}</h1>
    ${getGameTitleScript('pattern-memory', '🔲')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="pattern.desc">깜빡이는 패턴을 기억하고 순서대로 클릭하세요!</p>
      <div id="pattern-grid" style="display:grid;grid-template-columns:repeat(3,120px);gap:12px;justify-content:center;margin:32px auto"></div>
      <button id="pattern-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="pattern.start">시작하기</button>
      <div id="pattern-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="pattern.currentLevel">현재 단계</div><div id="pattern-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="pattern.bestLevel">최고 단계</div><div id="pattern-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var patternGrid=document.getElementById('pattern-grid'),patternStart=document.getElementById('pattern-start'),patternResult=document.getElementById('pattern-result'),patternLevelEl=document.getElementById('pattern-level'),patternBestEl=document.getElementById('pattern-best'),level=1,bestLevel=0,pattern=[],playerPattern=[],playing=false;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('pattern-memory','level');if(saved!==null){bestLevel=saved;patternBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('pattern-memory','level');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">Lv.'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      for(var i=0;i<9;i++){var btn=document.createElement('div');btn.style.cssText='width:120px;height:120px;background:#3498db;border-radius:12px;cursor:pointer;transition:all 0.2s';btn.dataset.index=i;btn.addEventListener('click',function(){if(!playing)return;var idx=parseInt(this.dataset.index);this.style.background='#2980b9';setTimeout(function(){document.querySelectorAll('#pattern-grid div')[idx].style.background='#3498db';}.bind(this),200);playerPattern.push(idx);var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.pattern;if(playerPattern[playerPattern.length-1]!==pattern[playerPattern.length-1]){patternResult.textContent=txt.wrong;patternResult.style.color='#e74c3c';playing=false;window.GameRecord.save('pattern-memory','level',level);if(historyVisible)renderHistory();level=1;patternLevelEl.textContent=level;patternStart.style.display='inline-block';}else if(playerPattern.length===pattern.length){level++;patternLevelEl.textContent=level;if(level>bestLevel){bestLevel=level;patternBestEl.textContent=bestLevel;window.GameRecord.save('pattern-memory','level',bestLevel);}patternResult.textContent=txt.correct;patternResult.style.color='#27ae60';setTimeout(showPattern,1500);}});patternGrid.appendChild(btn);}
      function showPattern(){playing=false;playerPattern=[];pattern.push(Math.floor(Math.random()*9));var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.pattern;patternResult.textContent=txt.remember;var i=0;var interval=setInterval(function(){if(i>=pattern.length){clearInterval(interval);patternResult.textContent=txt.clickNow;playing=true;return;}var idx=pattern[i];var cells=document.querySelectorAll('#pattern-grid div');cells[idx].style.background='#f1c40f';setTimeout(function(){cells[idx].style.background='#3498db';},400);i++;},800);}
      patternStart.addEventListener('click',function(){patternStart.style.display='none';pattern=[];level=1;patternLevelEl.textContent=level;showPattern();});
    </script>
  `;
  return gameHTML;
};
