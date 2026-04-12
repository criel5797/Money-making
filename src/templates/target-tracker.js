'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('target-tracker');
  var gameHTML = `
    <h1 data-game-title="target-tracker">🎯 ${title.ko}</h1>
    ${getGameTitleScript('target-tracker', '🎯')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="tracker.desc">움직이는 목표물을 따라가며 클릭하세요!</p>
      <div id="tracker-timer" style="font-size:24px;font-weight:bold;color:#667eea;margin:15px 0">30s</div>
      <div id="tracker-area" style="width:100%;max-width:400px;height:300px;margin:20px auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;position:relative;overflow:hidden;cursor:crosshair">
        <div id="tracker-target" style="width:50px;height:50px;background:radial-gradient(circle,#f1c40f,#e67e22);border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:all 0.1s linear;box-shadow:0 0 20px rgba(241,196,15,0.5)"></div>
      </div>
      <button id="tracker-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px" data-i18n-game="tracker.start">시작하기</button>
      <div id="tracker-result" style="margin:20px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="tracker.hits">명중</div><div id="tracker-hits" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="tracker.accuracy">정확도</div><div id="tracker-acc" class="stat-value">0%</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="tracker.best">최고점</div><div id="tracker-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var trackerArea=document.getElementById('tracker-area'),trackerTarget=document.getElementById('tracker-target'),trackerStart=document.getElementById('tracker-start');
      var trackerResult=document.getElementById('tracker-result'),trackerTimerEl=document.getElementById('tracker-timer');
      var trackerHitsEl=document.getElementById('tracker-hits'),trackerAccEl=document.getElementById('tracker-acc'),trackerBestEl=document.getElementById('tracker-best');
      var hits=0,clicks=0,bestScore=0,playing=false,gameTimer=null,moveInterval=null,timeLeft=30;
      var targetX=175,targetY=125,velocityX=3,velocityY=2;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('target-tracker','hits');if(saved!==null){bestScore=saved;trackerBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('target-tracker','hits');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function moveTarget(){
        var areaW=trackerArea.offsetWidth,areaH=trackerArea.offsetHeight;
        targetX+=velocityX;targetY+=velocityY;
        if(targetX<=25||targetX>=areaW-25){velocityX*=-1;targetX=Math.max(25,Math.min(areaW-25,targetX));}
        if(targetY<=25||targetY>=areaH-25){velocityY*=-1;targetY=Math.max(25,Math.min(areaH-25,targetY));}
        trackerTarget.style.left=targetX+'px';trackerTarget.style.top=targetY+'px';
      }

      function increaseSpeed(){
        var speed=3+hits*0.2;
        var angle=Math.random()*Math.PI*2;
        velocityX=Math.cos(angle)*speed;
        velocityY=Math.sin(angle)*speed;
      }

      trackerArea.addEventListener('click',function(e){
        if(!playing)return;
        clicks++;
        var rect=trackerArea.getBoundingClientRect();
        var clickX=e.clientX-rect.left,clickY=e.clientY-rect.top;
        var dist=Math.sqrt(Math.pow(clickX-targetX,2)+Math.pow(clickY-targetY,2));
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.tracker;
        if(dist<=35){
          hits++;trackerHitsEl.textContent=hits;
          trackerTarget.style.transform='translate(-50%,-50%) scale(1.3)';
          setTimeout(function(){trackerTarget.style.transform='translate(-50%,-50%) scale(1)';},100);
          trackerResult.textContent=txt.hit;trackerResult.style.color='#27ae60';
          increaseSpeed();
        }else{
          trackerResult.textContent=txt.miss;trackerResult.style.color='#e74c3c';
        }
        trackerAccEl.textContent=Math.round(hits/clicks*100)+'%';
      });

      function endGame(){
        playing=false;clearInterval(gameTimer);clearInterval(moveInterval);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.tracker;
        var acc=clicks>0?Math.round(hits/clicks*100):0;
        var tMsg=hits>=30?txt.msg1:hits>=20?txt.msg2:hits>=15?txt.msg3:hits>=10?txt.msg4:txt.msg5;trackerResult.textContent=txt.complete+' '+hits+txt.hitsText+' ('+acc+'%)'+tMsg;trackerResult.style.color='#667eea';
        if(hits>bestScore){bestScore=hits;trackerBestEl.textContent=bestScore;}
        window.GameRecord.save('target-tracker','hits',hits);if(historyVisible)renderHistory();var tLang=lang||'ko';var tSharePerc=hits>=30?' 상위 1%!':hits>=20?' 상위 5%!':hits>=15?' 상위 20%!':'';var tShareMsg=tLang==='ko'?'🎯 타겟 트래커 '+hits+'회 명중! 정확도 '+acc+'%!'+tSharePerc+' 너도 해봐!':tLang==='ja'?'🎯 ターゲット'+hits+'回ヒット！精度'+acc+'%！'+(hits>=15?' 上位20%！':'')+' あなたも挑戦！':'🎯 Target tracker: '+hits+' hits! Accuracy '+acc+'%!'+(hits>=20?' Top 5%!':'')+' Can you beat it?';window._shareResult={title:tShareMsg,text:tShareMsg,url:window.location.href};
        trackerStart.style.display='inline-block';
      }

      function startGame(){
        hits=0;clicks=0;timeLeft=30;playing=true;
        targetX=trackerArea.offsetWidth/2;targetY=trackerArea.offsetHeight/2;
        velocityX=3;velocityY=2;
        trackerHitsEl.textContent='0';trackerAccEl.textContent='0%';trackerTimerEl.textContent='30s';
        trackerStart.style.display='none';trackerResult.textContent='';
        moveInterval=setInterval(moveTarget,16);
        gameTimer=setInterval(function(){
          timeLeft--;trackerTimerEl.textContent=timeLeft+'s';
          if(timeLeft<=0)endGame();
        },1000);
      }

      trackerStart.addEventListener('click',startGame);
    </script>
  `;
  return gameHTML;
};
