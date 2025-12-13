'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('click-speed');
  var gameHTML = `
    <h1 data-game-title="click-speed">👆 ${title.ko}</h1>
    ${getGameTitleScript('click-speed', '👆')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="clickSpeed.desc">10초 동안 최대한 많이 클릭하세요!</p>
      <div id="click-timer" style="font-size:48px;font-weight:bold;color:#e74c3c;margin:24px 0">10.0</div>
      <div id="click-area" style="width:100%;height:300px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;color:white;font-weight:bold;cursor:pointer;user-select:none;margin:24px 0" data-i18n-game="clickSpeed.clickToStart">클릭해서 시작!</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="clickSpeed.clicks">클릭 수</div><div id="clicks" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="clickSpeed.cps">CPS</div><div id="cps" class="stat-value">0.0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="clickSpeed.bestCps">최고 CPS</div><div id="best-cps" class="stat-value">0.0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var clickTimer=document.getElementById('click-timer'),clickArea=document.getElementById('click-area'),clicksEl=document.getElementById('clicks'),cpsEl=document.getElementById('cps'),bestCpsEl=document.getElementById('best-cps'),clicks=0,timeLeft=10,started=false,bestCps=0,interval=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('click-speed','cps');if(saved!==null){bestCps=saved;bestCpsEl.textContent=saved.toFixed(1);}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('click-speed','cps');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var d=new Date(h.date);var dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+(typeof h.value==='number'?h.value.toFixed(1):h.value)+' CPS</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      clickArea.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.clickSpeed;if(!started){started=true;clicks=0;timeLeft=10;clickArea.textContent=txt.clicking;clickArea.style.background='linear-gradient(135deg,#667eea 0%,#764ba2 100%)';interval=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){timeLeft=0;clearInterval(interval);started=false;var finalCps=parseFloat((clicks/10).toFixed(1));cpsEl.textContent=finalCps.toFixed(1);window.GameRecord.save('click-speed','cps',finalCps);if(finalCps>bestCps){bestCps=finalCps;bestCpsEl.textContent=bestCps.toFixed(1);}if(historyVisible)renderHistory();clickArea.textContent=txt.complete;clickArea.style.background='linear-gradient(135deg,#f093fb 0%,#f5576c 100%)';}clickTimer.textContent=timeLeft.toFixed(1);},100);}if(started&&timeLeft>0){clicks++;clicksEl.textContent=clicks;}});
    </script>
  `;
  return gameHTML;
};
