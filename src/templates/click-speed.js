'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('click-speed');
  var gameHTML = `
    <h1>👆 ${title.ko}</h1>
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
    </div>
    <script>
      var clickTimer=document.getElementById('click-timer'),clickArea=document.getElementById('click-area'),clicksEl=document.getElementById('clicks'),cpsEl=document.getElementById('cps'),bestCpsEl=document.getElementById('best-cps'),clicks=0,timeLeft=10,started=false,bestCps=0,interval=null;
      clickArea.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.clickSpeed;if(!started){started=true;clicks=0;timeLeft=10;clickArea.textContent=txt.clicking;interval=setInterval(function(){timeLeft-=0.1;if(timeLeft<=0){timeLeft=0;clearInterval(interval);started=false;var finalCps=(clicks/10).toFixed(1);cpsEl.textContent=finalCps;if(parseFloat(finalCps)>bestCps){bestCps=parseFloat(finalCps);bestCpsEl.textContent=bestCps.toFixed(1);}clickArea.textContent=txt.complete;clickArea.style.background='linear-gradient(135deg,#f093fb 0%,#f5576c 100%)';}clickTimer.textContent=timeLeft.toFixed(1);},100);}if(started&&timeLeft>0){clicks++;clicksEl.textContent=clicks;}});
    </script>
  `;
  return gameHTML;
};
