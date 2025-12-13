'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('math-quiz');
  var gameHTML = `
    <h1 data-game-title="math-quiz">🔢 ${title.ko}</h1>
    ${getGameTitleScript('math-quiz', '🔢')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="math.desc">수학 문제를 빠르게 풀어보세요!</p>
      <div id="timer" style="font-size:48px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="math-question" style="font-size:48px;font-weight:bold;color:#333;margin:32px 0;min-height:60px"></div>
      <input type="number" id="math-input" data-i18n-game-placeholder="math.placeholder" placeholder="답 입력" style="font-size:32px;text-align:center;width:200px" disabled>
      <button id="math-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="math.start">시작하기</button>
      <div id="math-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="math.correctLabel">맞춘 문제</div><div id="correct" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="math.bestLabel">최고 기록</div><div id="best-correct" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var timerEl=document.getElementById('timer'),mathQuestion=document.getElementById('math-question'),mathInput=document.getElementById('math-input'),mathStart=document.getElementById('math-start'),mathResult=document.getElementById('math-result'),correctEl=document.getElementById('correct'),bestCorrectEl=document.getElementById('best-correct'),timeLeft=60,correct=0,bestCorrect=0,currentAnswer=0,timerInterval=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('math-quiz','correct');if(saved!==null){bestCorrect=saved;bestCorrectEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('math-quiz','correct');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var d=new Date(h.date);var dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function generateQuestion(){var a=Math.floor(Math.random()*20)+1;var b=Math.floor(Math.random()*20)+1;var ops=['+','-','×'];var op=ops[Math.floor(Math.random()*ops.length)];if(op==='+'){currentAnswer=a+b;mathQuestion.textContent=a+' + '+b+' = ?';}else if(op==='-'){if(a<b){var temp=a;a=b;b=temp;}currentAnswer=a-b;mathQuestion.textContent=a+' - '+b+' = ?';}else{currentAnswer=a*b;mathQuestion.textContent=a+' × '+b+' = ?';}}
      function startGame(){timeLeft=60;correct=0;correctEl.textContent=correct;mathInput.disabled=false;mathInput.value='';mathInput.focus();mathStart.style.display='none';mathResult.textContent='';generateQuestion();timerInterval=setInterval(function(){timeLeft--;timerEl.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);mathInput.disabled=true;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.math;mathQuestion.textContent=txt.timeUp;window.GameRecord.save('math-quiz','correct',correct);if(correct>bestCorrect){bestCorrect=correct;bestCorrectEl.textContent=bestCorrect;}mathResult.textContent=txt.totalCorrect+correct+txt.problems;mathResult.style.color='#0a66c2';if(historyVisible)renderHistory();mathStart.style.display='inline-block';}},1000);}
      function checkAnswer(){var userAnswer=parseInt(mathInput.value);var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.math;if(isNaN(userAnswer)){mathResult.textContent=txt.enterNumber;mathResult.style.color='#f39c12';return;}if(userAnswer===currentAnswer){correct++;correctEl.textContent=correct;mathResult.textContent=txt.correct;mathResult.style.color='#27ae60';mathInput.value='';setTimeout(generateQuestion,300);}else{mathResult.textContent=txt.wrong+currentAnswer;mathResult.style.color='#e74c3c';setTimeout(function(){mathInput.value='';generateQuestion();mathResult.textContent='';},1500);}}
      mathStart.addEventListener('click',startGame);
      mathInput.addEventListener('keypress',function(e){if(e.key==='Enter')checkAnswer();});
    </script>
  `;
  return gameHTML;
};
