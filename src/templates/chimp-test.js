'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('chimp-test');
  var gameHTML = `
    <h1 data-game-title="chimp-test">🐵 ${title.ko}</h1>
    ${getGameTitleScript('chimp-test', '🐵')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="chimp.desc">숫자가 나타나면 순서대로 클릭하세요. 클릭 시 숫자가 사라집니다!</p>
      <div id="chimp-container" style="display:inline-block;margin:24px auto;position:relative">
        <div id="chimp-grid" style="display:grid;grid-template-columns:repeat(8,50px);gap:4px;min-height:250px"></div>
      </div>
      <button id="chimp-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="chimp.start">시작하기</button>
      <div id="chimp-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="chimp-strikes" style="margin:12px 0;font-size:20px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="chimp.numbers">숫자 개수</div><div id="chimp-level" class="stat-value">4</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="chimp.bestLevel">최고 기록</div><div id="chimp-best" class="stat-value">4</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var chimpGrid=document.getElementById('chimp-grid'),chimpStart=document.getElementById('chimp-start'),chimpResult=document.getElementById('chimp-result');
      var chimpLevelEl=document.getElementById('chimp-level'),chimpBestEl=document.getElementById('chimp-best'),chimpStrikesEl=document.getElementById('chimp-strikes');
      var level=4,bestLevel=4,strikes=0,maxStrikes=3,currentNum=1,numbers=[],tiles=[],playing=false,numbersHidden=false;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('chimp-test','level');if(saved!==null){bestLevel=saved;chimpBestEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('chimp-test','level');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function updateStrikes(){chimpStrikesEl.textContent='⭕'.repeat(maxStrikes-strikes)+'❌'.repeat(strikes);}

      function createGrid(){
        chimpGrid.innerHTML='';tiles=[];
        var gridCols=8,gridRows=5,totalCells=gridCols*gridRows;
        var positions=[];for(var i=0;i<totalCells;i++)positions.push(i);
        for(var i=positions.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=positions[i];positions[i]=positions[j];positions[j]=t;}
        numbers=positions.slice(0,level);
        for(var i=0;i<totalCells;i++){
          var tile=document.createElement('div');
          tile.style.cssText='width:50px;height:50px;background:#e0e0e0;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;cursor:pointer;transition:all 0.2s';
          tile.dataset.index=i;
          var numIndex=numbers.indexOf(i);
          if(numIndex!==-1){
            tile.dataset.number=numIndex+1;
            tile.textContent=numIndex+1;
            tile.style.background='#3498db';tile.style.color='white';
          }
          tile.addEventListener('click',handleTileClick);
          chimpGrid.appendChild(tile);
          tiles.push(tile);
        }
      }

      function handleTileClick(e){
        if(!playing)return;
        var tile=e.target;
        var num=parseInt(tile.dataset.number);
        if(!num)return;

        if(!numbersHidden&&currentNum===1){
          tiles.forEach(function(t){if(t.dataset.number)t.textContent='';});
          numbersHidden=true;
        }

        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.chimp;

        if(num===currentNum){
          tile.style.background='#27ae60';tile.style.pointerEvents='none';
          currentNum++;
          if(currentNum>level){
            level++;chimpLevelEl.textContent=level;
            if(level>bestLevel){bestLevel=level;chimpBestEl.textContent=bestLevel;window.GameRecord.save('chimp-test','level',bestLevel);}
            chimpResult.textContent=txt.correct;chimpResult.style.color='#27ae60';
            setTimeout(startRound,1000);
          }
        }else{
          tile.style.background='#e74c3c';
          strikes++;updateStrikes();
          if(strikes>=maxStrikes){
            playing=false;
            chimpResult.textContent=txt.gameOver+' '+txt.finalLevel+level;chimpResult.style.color='#e74c3c';
            window.GameRecord.save('chimp-test','level',level);if(historyVisible)renderHistory();
            chimpStart.style.display='inline-block';
          }else{
            chimpResult.textContent=txt.wrong+' ('+strikes+'/'+maxStrikes+')';chimpResult.style.color='#e74c3c';
            setTimeout(startRound,1000);
          }
        }
      }

      function startRound(){
        currentNum=1;numbersHidden=false;createGrid();
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.chimp;
        chimpResult.textContent=txt.clickNumbers;chimpResult.style.color='#3498db';
      }

      chimpStart.addEventListener('click',function(){
        chimpStart.style.display='none';level=4;strikes=0;
        chimpLevelEl.textContent=level;updateStrikes();playing=true;startRound();
      });
    </script>
  `;
  return gameHTML;
};
