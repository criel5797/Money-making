'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('visual-memory');
  var gameHTML = `
    <h1 data-game-title="visual-memory">👁️ ${title.ko}</h1>
    ${getGameTitleScript('visual-memory', '👁️')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="visualMemory.desc">깜빡이는 타일의 위치를 기억하고 클릭하세요!</p>
      <div id="vm-container" style="display:inline-block;margin:24px auto">
        <div id="vm-grid" style="display:grid;gap:8px;justify-content:center"></div>
      </div>
      <button id="vm-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="visualMemory.start">시작하기</button>
      <div id="vm-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="vm-lives" style="margin:12px 0;font-size:24px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="visualMemory.currentLevel">현재 단계</div><div id="vm-level" class="stat-value">1</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="visualMemory.bestLevel">최고 단계</div><div id="vm-best" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var vmGrid=document.getElementById('vm-grid'),vmStart=document.getElementById('vm-start'),vmResult=document.getElementById('vm-result'),vmLevelEl=document.getElementById('vm-level'),vmBestEl=document.getElementById('vm-best'),vmLivesEl=document.getElementById('vm-lives');
      var level=1,bestLevel=0,lives=3,pattern=[],playerClicks=0,correctClicks=0,gridSize=3,tilesCount=3,playing=false,showingPattern=false;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('visual-memory','level');if(saved!==null){bestLevel=saved;vmBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('visual-memory','level');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">Lv.'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function updateLives(){vmLivesEl.textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);}

      function calculateGrid(){
        if(level<=3){gridSize=3;tilesCount=3;}
        else if(level<=5){gridSize=3;tilesCount=4;}
        else if(level<=7){gridSize=4;tilesCount=5;}
        else if(level<=10){gridSize=4;tilesCount=6;}
        else if(level<=13){gridSize=5;tilesCount=7;}
        else if(level<=16){gridSize=5;tilesCount=8;}
        else{gridSize=6;tilesCount=Math.min(9+Math.floor((level-17)/2),15);}
      }

      function createGrid(){
        vmGrid.innerHTML='';
        calculateGrid();
        var tileSize=Math.min(80,Math.floor(300/gridSize));
        vmGrid.style.gridTemplateColumns='repeat('+gridSize+','+tileSize+'px)';
        for(var i=0;i<gridSize*gridSize;i++){
          var tile=document.createElement('div');
          tile.style.cssText='width:'+tileSize+'px;height:'+tileSize+'px;background:#3498db;border-radius:8px;cursor:pointer;transition:all 0.3s';
          tile.dataset.index=i;
          tile.addEventListener('click',handleTileClick);
          vmGrid.appendChild(tile);
        }
      }

      function getCompletedLevel(){return Math.max(level-1,0);}

      function handleTileClick(e){
        if(!playing||showingPattern)return;
        var idx=parseInt(e.target.dataset.index);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.visualMemory;

        if(e.target.dataset.clicked==='true')return;
        e.target.dataset.clicked='true';
        playerClicks++;

        if(pattern.includes(idx)){
          e.target.style.background='#f1c40f';
          correctClicks++;
          if(correctClicks===pattern.length){
            var completedLevel=level;
            playing=false;
            level++;vmLevelEl.textContent=level;
            if(completedLevel>bestLevel){bestLevel=completedLevel;vmBestEl.textContent=bestLevel;window.GameRecord.save('visual-memory','level',bestLevel);}
            vmResult.textContent=txt.correct;vmResult.style.color='#27ae60';
            setTimeout(startRound,1000);
          }
        }else{
          e.target.style.background='#e74c3c';
          playing=false;
          lives--;updateLives();
          if(lives<=0){
            var finalLevel=getCompletedLevel();
            var vmLang=window.currentLang||'ko';var vmTxt2=window.i18n[vmLang].games.visualMemory;var vmMsg=finalLevel>=10?vmTxt2.msg1:finalLevel>=7?vmTxt2.msg2:finalLevel>=5?vmTxt2.msg3:finalLevel>=3?vmTxt2.msg4:vmTxt2.msg5;
            vmResult.textContent=txt.gameOver+' '+txt.finalLevel+finalLevel+vmMsg;vmResult.style.color='#e74c3c';
            window.GameRecord.save('visual-memory','level',finalLevel);if(historyVisible)renderHistory();var vmSharePerc=finalLevel>=10?' 상위 1%!':finalLevel>=7?' 상위 5%!':finalLevel>=5?' 상위 20%!':'';var vmShareMsg=vmLang==='ko'?'👁️ 시각 기억력 레벨 '+finalLevel+' 달성!'+vmSharePerc+' 너도 도전해봐!':vmLang==='ja'?'👁️ 視覚メモリ レベル'+finalLevel+'達成！'+(finalLevel>=5?' 上位20%！':'')+' あなたも挑戦！':'👁️ Visual memory level '+finalLevel+'!'+(finalLevel>=7?' Top 5%!':'')+' Can you beat it?';window._shareResult={title:vmShareMsg,text:vmShareMsg,url:window.location.href};
            vmStart.style.display='inline-block';
          }else{
            vmResult.textContent=txt.wrong;vmResult.style.color='#e74c3c';
            setTimeout(startRound,1000);
          }
        }
      }

      function startRound(){
        createGrid();
        playerClicks=0;correctClicks=0;
        showingPattern=true;
        pattern=[];
        var indices=[];for(var i=0;i<gridSize*gridSize;i++)indices.push(i);
        for(var i=indices.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=indices[i];indices[i]=indices[j];indices[j]=t;}
        pattern=indices.slice(0,tilesCount);
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.visualMemory;
        vmResult.textContent=txt.remember;vmResult.style.color='#3498db';
        var tiles=vmGrid.querySelectorAll('div');
        pattern.forEach(function(idx){tiles[idx].style.background='#f1c40f';});
        setTimeout(function(){
          tiles.forEach(function(t){t.style.background='#3498db';t.dataset.clicked='false';});
          vmResult.textContent=txt.clickNow;showingPattern=false;
        },1000+level*100);
      }

      vmStart.addEventListener('click',function(){
        vmStart.style.display='none';level=1;lives=3;
        vmLevelEl.textContent=level;updateLives();showingPattern=false;playing=true;startRound();
      });
    </script>
  `;
  return gameHTML;
};
