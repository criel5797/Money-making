'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('aim-trainer');
  var gameHTML = `
    <h1>🎯 ${title.ko}</h1>
    ${getGameTitleScript('aim-trainer', '🎯')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="aim.desc">30초 동안 나타나는 원을 빠르게 클릭하세요!</p>
      <div id="aim-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">30</div>
      <div id="aim-area" style="width:100%;height:400px;background:#f8f9fa;border-radius:12px;position:relative;cursor:crosshair;margin:24px 0;display:flex;align-items:center;justify-content:center;font-size:24px;color:#666" data-i18n-game="aim.clickToStart">클릭해서 시작</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="aim.hitsLabel">명중</div><div id="hits" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="aim.accuracy">정확도</div><div id="aim-accuracy" class="stat-value">0%</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="aim.bestHits">최고 점수</div><div id="best-hits" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var aimTimer=document.getElementById('aim-timer'),aimArea=document.getElementById('aim-area'),hitsEl=document.getElementById('hits'),aimAccuracyEl=document.getElementById('aim-accuracy'),bestHitsEl=document.getElementById('best-hits'),hits=0,misses=0,timeLeft=30,started=false,bestHits=0,interval=null,target=null,countdown=null;
      function createTarget(){if(target)target.remove();target=document.createElement('div');var size=Math.random()*30+50;var maxX=aimArea.offsetWidth-size-10;var maxY=aimArea.offsetHeight-size-10;var x=Math.max(10,Math.random()*maxX);var y=Math.max(10,Math.random()*maxY);target.style.cssText='position:absolute;width:'+size+'px;height:'+size+'px;background:#e74c3c;border-radius:50%;cursor:pointer;transition:transform 0.1s;box-shadow:0 2px 8px rgba(231,76,60,0.4)';target.style.left=x+'px';target.style.top=y+'px';target.addEventListener('mouseenter',function(){this.style.transform='scale(1.1)';});target.addEventListener('mouseleave',function(){this.style.transform='scale(1)';});target.addEventListener('click',function(e){e.stopPropagation();hits++;hitsEl.textContent=hits;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';this.style.background='#27ae60';this.style.transform='scale(0)';setTimeout(createTarget,100);});aimArea.appendChild(target);}
      function startCountdown(){countdown=3;aimArea.innerHTML='<div style="font-size:72px;font-weight:bold;color:#667eea">'+countdown+'</div>';var countInterval=setInterval(function(){countdown--;if(countdown>0){aimArea.innerHTML='<div style="font-size:72px;font-weight:bold;color:#667eea">'+countdown+'</div>';}else{clearInterval(countInterval);aimArea.textContent='';started=true;hits=0;misses=0;timeLeft=30;hitsEl.textContent=hits;aimAccuracyEl.textContent='0%';createTarget();interval=setInterval(function(){timeLeft--;aimTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(interval);started=false;if(target)target.remove();if(hits>bestHits){bestHits=hits;bestHitsEl.textContent=bestHits;}var acc=hits+misses>0?Math.round(hits/(hits+misses)*100):0;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.aim;aimArea.innerHTML='<span style="font-size:24px;color:#666">'+txt.complete+hits+txt.hits+acc+'%)'+txt.clickAgain+'</span>';}},1000);}},1000);}
      aimArea.addEventListener('click',function(e){if(e.target!==aimArea)return;if(!started&&!countdown){startCountdown();}else if(started){misses++;aimAccuracyEl.textContent=Math.round(hits/(hits+misses)*100)+'%';var missIndicator=document.createElement('div');var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.aim;missIndicator.textContent=txt.miss;missIndicator.style.cssText='position:absolute;left:'+e.offsetX+'px;top:'+e.offsetY+'px;color:#e74c3c;font-weight:bold;font-size:20px;pointer-events:none;animation:fadeOut 0.5s forwards';aimArea.appendChild(missIndicator);setTimeout(function(){missIndicator.remove();},500);}});
    </script>
  `;
  return gameHTML;
};
