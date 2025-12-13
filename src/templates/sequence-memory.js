'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('sequence-memory');
  var gameHTML = `
    <h1 data-game-title="sequence-memory">🔢 ${title.ko}</h1>
    ${getGameTitleScript('sequence-memory', '🔢')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="sequence.desc">숫자가 나타나는 순서를 기억하고 순서대로 클릭하세요!</p>
      <div id="seq-grid" style="display:grid;grid-template-columns:repeat(3,100px);gap:12px;justify-content:center;margin:32px auto"></div>
      <button id="seq-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="sequence.start">시작하기</button>
      <div id="seq-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="sequence.currentLevel">현재 단계</div><div id="seq-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="sequence.bestLevel">최고 단계</div><div id="seq-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var seqGrid=document.getElementById('seq-grid'),seqStart=document.getElementById('seq-start'),seqResult=document.getElementById('seq-result'),seqLevelEl=document.getElementById('seq-level'),seqBestEl=document.getElementById('seq-best'),level=1,bestLevel=0,sequence=[],playerSeq=[],playing=false;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('sequence-memory','level');if(saved!==null){bestLevel=saved;seqBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('sequence-memory','level');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">Lv.'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      for(var i=0;i<9;i++){var btn=document.createElement('div');btn.style.cssText='width:100px;height:100px;background:#ecf0f1;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#34495e;cursor:pointer;transition:all 0.2s';btn.dataset.index=i;btn.addEventListener('click',function(){if(!playing)return;var idx=parseInt(this.dataset.index);this.style.background='#3498db';setTimeout(function(el){el.style.background='#ecf0f1';},200,this);playerSeq.push(idx);var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.sequence;if(playerSeq[playerSeq.length-1]!==sequence[playerSeq.length-1]){seqResult.textContent=txt.wrong;seqResult.style.color='#e74c3c';playing=false;window.GameRecord.save('sequence-memory','level',level);if(historyVisible)renderHistory();level=1;seqLevelEl.textContent=level;seqStart.style.display='inline-block';}else if(playerSeq.length===sequence.length){level++;seqLevelEl.textContent=level;if(level>bestLevel){bestLevel=level;seqBestEl.textContent=bestLevel;window.GameRecord.save('sequence-memory','level',bestLevel);}seqResult.textContent=txt.correct;seqResult.style.color='#27ae60';setTimeout(showSequence,1500);}});seqGrid.appendChild(btn);}
      function showSequence(){playing=false;playerSeq=[];sequence.push(Math.floor(Math.random()*9));var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.sequence;seqResult.textContent=txt.remember;var cells=document.querySelectorAll('#seq-grid div');cells.forEach(function(c){c.textContent='';});var i=0;var interval=setInterval(function(){if(i>=sequence.length){clearInterval(interval);setTimeout(function(){seqResult.textContent=txt.clickNow;playing=true;},500);return;}cells[sequence[i]].textContent=i+1;cells[sequence[i]].style.background='#f39c12';setTimeout(function(idx){cells[idx].textContent='';cells[idx].style.background='#ecf0f1';},600,sequence[i]);i++;},800);}
      seqStart.addEventListener('click',function(){seqStart.style.display='none';sequence=[];level=1;seqLevelEl.textContent=level;showSequence();});
    </script>
  `;
  return gameHTML;
};
