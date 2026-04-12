'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('word-puzzle');
  var gameHTML = `
    <h1 data-game-title="word-puzzle">📝 ${title.ko}</h1>
    ${getGameTitleScript('word-puzzle', '📝')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="wordPuzzle.desc">주어진 글자들로 2글자 이상의 단어를 만드세요!</p>
      <div id="word-timer" style="font-size:36px;font-weight:bold;color:#e74c3c;margin:16px 0">60</div>
      <div id="word-letters" style="font-size:48px;font-weight:bold;letter-spacing:12px;color:#333;margin:24px 0"></div>
      <input type="text" id="word-input" data-i18n-game-placeholder="wordPuzzle.placeholder" placeholder="단어 입력" style="font-size:24px;text-align:center;width:300px" disabled>
      <button id="word-submit" class="btn btn-success" style="font-size:18px;padding:12px 32px;margin:16px 8px" disabled data-i18n-game="wordPuzzle.submit">제출</button>
      <button id="word-start" class="btn btn-primary" style="font-size:18px;padding:12px 32px;margin:16px 8px" data-i18n-game="wordPuzzle.start">시작하기</button>
      <div id="word-feedback" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div id="word-list" style="margin:24px 0;min-height:100px">
        <div style="color:#666;font-size:14px" data-i18n-game="wordPuzzle.displayHere">만든 단어들이 여기에 표시됩니다</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="wordPuzzle.wordCount">단어 수</div><div id="round-words" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="wordPuzzle.score">점수</div><div id="score" class="stat-value">0</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="wordPuzzle.bestScore">최고 점수</div><div id="best-score" class="stat-value">0</div></div>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      function getWordData(){var lang=window.currentLang||'ko';return window.i18n[lang].games.wordPuzzle.wordData||window.i18n.ko.games.wordPuzzle.wordData;}
      var wordLetters=document.getElementById('word-letters'),wordTimer=document.getElementById('word-timer'),wordInput=document.getElementById('word-input'),wordSubmit=document.getElementById('word-submit'),wordStart=document.getElementById('word-start'),wordFeedback=document.getElementById('word-feedback'),wordList=document.getElementById('word-list'),roundWordsEl=document.getElementById('round-words'),scoreEl=document.getElementById('score'),bestScoreEl=document.getElementById('best-score'),currentSet=null,foundWords=[],score=0,bestScore=0,timeLeft=60,timerInterval=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('word-puzzle','score');if(saved!==null){bestScore=saved;bestScoreEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('word-puzzle','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function startRound(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.wordPuzzle;var wordData=getWordData();var idx=Math.floor(Math.random()*wordData.length);currentSet=wordData[idx];wordLetters.textContent=currentSet.letters.split('').join(' ');foundWords=[];score=0;timeLeft=60;wordTimer.textContent=timeLeft;wordList.innerHTML='<div style="color:#666;font-size:14px">'+txt.makeWords+'</div>';roundWordsEl.textContent='0';scoreEl.textContent='0';wordFeedback.textContent='';wordInput.value='';wordInput.disabled=false;wordSubmit.disabled=false;wordStart.disabled=true;wordStart.textContent=txt.newRound;wordInput.focus();timerInterval=setInterval(function(){timeLeft--;wordTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);timerInterval=null;wordInput.disabled=true;wordSubmit.disabled=true;wordStart.disabled=false;var wpIsNew=window.GameRecord.save('word-puzzle','score',score);if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}var lang=window.currentLang||'ko';var shtxt=lang==='ko'?'📝 단어 퍼즐 '+foundWords.length+'개 단어 / '+score+'점! 너도 해봐!':lang==='ja'?'📝 ワードパズル'+foundWords.length+'語/'+score+'点！あなたも挑戦！':'📝 Found '+foundWords.length+' words, scored '+score+' in word puzzle! Beat me!';window._shareResult={title:shtxt,text:shtxt,url:window.location.href};if(historyVisible)renderHistory();var wpMsg=foundWords.length>=10?txt.msg1:foundWords.length>=7?txt.msg2:foundWords.length>=5?txt.msg3:foundWords.length>=3?txt.msg4:txt.msg5;wordFeedback.textContent=txt.timeUp+foundWords.length+txt.words+score+txt.pointsText+wpMsg;if(wpIsNew)wordFeedback.textContent+=(window.i18n[lang].newRecord||' 🎉 신기록!');wordFeedback.style.color='#e74c3c';wordStart.style.display='inline-block';}},1000);}
      function submitWord(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.wordPuzzle;var word=wordInput.value.trim().toUpperCase();var letters=currentSet.letters.toUpperCase();var validWords=currentSet.words.map(function(w){return w.toUpperCase();});if(word.length<2){wordFeedback.textContent=txt.tooShort;wordFeedback.style.color='#e74c3c';return;}var valid=true;var letterCount={};for(var i=0;i<letters.length;i++){var c=letters[i];letterCount[c]=(letterCount[c]||0)+1;}for(var i=0;i<word.length;i++){var c=word[i];if(!letterCount[c]||letterCount[c]<=0){valid=false;break;}letterCount[c]--;}if(!valid){wordFeedback.textContent=txt.useGiven;wordFeedback.style.color='#e74c3c';return;}if(foundWords.indexOf(word)!==-1){wordFeedback.textContent=txt.alreadyUsed;wordFeedback.style.color='#f39c12';return;}if(validWords.indexOf(word)===-1){wordFeedback.textContent=txt.invalid;wordFeedback.style.color='#e74c3c';return;}var points=word.length;score+=points;foundWords.push(word);roundWordsEl.textContent=foundWords.length;scoreEl.textContent=score;wordFeedback.textContent=txt.plusPoints+points+txt.pointsText;wordFeedback.style.color='#27ae60';var wordDiv='<div style="display:inline-block;background:#e3f2fd;padding:8px 16px;border-radius:8px;margin:4px;font-weight:bold;color:#1976d2">'+word+' (+'+points+')</div>';if(wordList.querySelector('div').textContent.includes(txt.makeWords)){wordList.innerHTML=wordDiv;}else{wordList.innerHTML+=wordDiv;}wordInput.value='';wordInput.focus();}
      wordStart.addEventListener('click',startRound);
      wordSubmit.addEventListener('click',submitWord);
      wordInput.addEventListener('keypress',function(e){if(e.key==='Enter')submitWord();});
    </script>
  `;
  return gameHTML;
};
