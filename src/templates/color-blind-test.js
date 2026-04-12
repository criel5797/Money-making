'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('color-blind-test');
  var gameHTML = `
    <h1 data-game-title="color-blind-test">🎨 ${title.ko}</h1>
    ${getGameTitleScript('color-blind-test', '🎨')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="colorBlind.desc">다른 색깔의 타일을 찾아 클릭하세요!</p>
      <div id="cb-timer" style="font-size:24px;font-weight:bold;color:#667eea;margin:15px 0">30s</div>
      <div id="cb-grid" style="display:grid;gap:6px;justify-content:center;margin:20px auto;max-width:350px"></div>
      <button id="cb-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px" data-i18n-game="colorBlind.start">시작하기</button>
      <div id="cb-result" style="margin:20px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorBlind.level">레벨</div><div id="cb-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorBlind.score">점수</div><div id="cb-score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="colorBlind.best">최고점</div><div id="cb-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var cbGrid=document.getElementById('cb-grid'),cbStart=document.getElementById('cb-start'),cbResult=document.getElementById('cb-result');
      var cbLevelEl=document.getElementById('cb-level'),cbScoreEl=document.getElementById('cb-score'),cbBestEl=document.getElementById('cb-best'),cbTimerEl=document.getElementById('cb-timer');
      var level=1,score=0,bestScore=0,playing=false,timer=null,timeLeft=30,differentIndex=-1;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('color-blind-test','score');if(saved!==null){bestScore=saved;cbBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('color-blind-test','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function getGridSize(){if(level<=3)return 2;if(level<=6)return 3;if(level<=10)return 4;if(level<=15)return 5;return 6;}
      function getColorDiff(){return Math.max(5,50-level*3);}

      function generateColors(){
        var h=Math.floor(Math.random()*360);
        var s=50+Math.floor(Math.random()*30);
        var l=40+Math.floor(Math.random()*20);
        var diff=getColorDiff();
        var base='hsl('+h+','+s+'%,'+l+'%)';
        var diffL=Math.min(90,l+diff);
        var different='hsl('+h+','+s+'%,'+diffL+'%)';
        return {base:base,different:different};
      }

      function createGrid(){
        cbGrid.innerHTML='';
        var size=getGridSize();
        var tileSize=Math.floor(280/size);
        cbGrid.style.gridTemplateColumns='repeat('+size+','+tileSize+'px)';
        var total=size*size;
        differentIndex=Math.floor(Math.random()*total);
        var colors=generateColors();
        for(var i=0;i<total;i++){
          var tile=document.createElement('div');
          tile.style.cssText='width:'+tileSize+'px;height:'+tileSize+'px;border-radius:8px;cursor:pointer;transition:transform 0.2s';
          tile.style.background=i===differentIndex?colors.different:colors.base;
          tile.dataset.index=i;
          tile.addEventListener('click',handleClick);
          cbGrid.appendChild(tile);
        }
      }

      function handleClick(e){
        if(!playing)return;
        var idx=parseInt(e.target.dataset.index);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.colorBlind;
        if(idx===differentIndex){
          score+=level*10;level++;
          cbScoreEl.textContent=score;cbLevelEl.textContent=level;
          cbResult.textContent=txt.correct;cbResult.style.color='#27ae60';
          createGrid();
        }else{
          e.target.style.transform='scale(0.9)';
          setTimeout(function(){e.target.style.transform='scale(1)';},200);
          cbResult.textContent=txt.wrong;cbResult.style.color='#e74c3c';
        }
      }

      function endGame(){
        playing=false;clearInterval(timer);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.colorBlind;
        var cbMsg=score>=20?txt.msg1:score>=15?txt.msg2:score>=10?txt.msg3:score>=7?txt.msg4:score>=4?txt.msg5:txt.msg6;cbResult.textContent=txt.timeUp+' '+txt.finalScore+score+cbMsg;cbResult.style.color='#667eea';
        if(score>bestScore){bestScore=score;cbBestEl.textContent=bestScore;}
        window.GameRecord.save('color-blind-test','score',score);if(historyVisible)renderHistory();var lang=window.currentLang||'ko';var shtxt=lang==='ko'?'👁️ 색맹 테스트 '+score+'점! 내 색각은?':lang==='ja'?'👁️ 色覚テスト'+score+'点！あなたも試して！':'👁️ Scored '+score+' on color vision test! How is yours?';window._shareResult={title:shtxt,text:shtxt,url:window.location.href};
        cbStart.style.display='inline-block';
      }

      function startGame(){
        level=1;score=0;timeLeft=30;playing=true;
        cbLevelEl.textContent='1';cbScoreEl.textContent='0';cbTimerEl.textContent='30s';
        cbStart.style.display='none';cbResult.textContent='';
        createGrid();
        timer=setInterval(function(){
          timeLeft--;cbTimerEl.textContent=timeLeft+'s';
          if(timeLeft<=0)endGame();
        },1000);
      }

      cbStart.addEventListener('click',startGame);
    </script>
  `;
  return gameHTML;
};
