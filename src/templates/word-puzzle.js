'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('word-puzzle');
  var gameHTML = `
    <h1>📝 ${title.ko}</h1>
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
      var wordData=[
        {letters:'가나다라마',words:['가나다','나라','다람','라마','가다','나다','다가','마라','나가','가마','다라','마나']},
        {letters:'사랑행복기',words:['사랑','행복','복사','사기','행사','복기','기사','랑기','사행']},
        {letters:'친구가족집',words:['친구','가족','친가','구가','가구','친족','족구','집구','구족']},
        {letters:'학교공부책',words:['학교','공부','학부','교부','책상','부교','학책','교책','부책','공교','공학']},
        {letters:'음악노래춤',words:['음악','노래','춤','악기','노음','래음','음노','악노','악춤']},
        {letters:'여행바다산',words:['여행','바다','산','행바','다산','여산','바행','산행','여다','다행']},
        {letters:'요리음식맛',words:['요리','음식','맛','식요','리음','맛있','식음','요음','리맛','식맛']},
        {letters:'운동건강몸',words:['운동','건강','몸','동강','강몸','운강','건몸','동몸','운건','강동']},
        {letters:'게임놀이재',words:['게임','놀이','재미','놀재','임재','게재','이재','게놀','임이','놀임']},
        {letters:'꽃나무풀밭',words:['꽃','나무','풀','밭','꽃밭','나풀','풀밭','무풀','나밭','꽃풀']},
        {letters:'하늘구름달',words:['하늘','구름','달','늘구','름달','하구','달구','하늘구','늘름','구달']},
        {letters:'강물고기낚',words:['강물','고기','낚시','물고','기낚','강고','물기','낚물','고물','강기']},
        {letters:'책가방연필',words:['책','가방','연필','책방','방연','필가','가연','책필','방필','연가']},
        {letters:'컴퓨터게임',words:['컴퓨터','게임','퓨터','컴게','터게','컴임','퓨임','터임','게터']},
        {letters:'밥국물반찬',words:['밥','국물','반찬','물반','찬국','밥국','반국','밥물','찬밥','국반']}
      ];
      var wordLetters=document.getElementById('word-letters'),wordTimer=document.getElementById('word-timer'),wordInput=document.getElementById('word-input'),wordSubmit=document.getElementById('word-submit'),wordStart=document.getElementById('word-start'),wordFeedback=document.getElementById('word-feedback'),wordList=document.getElementById('word-list'),roundWordsEl=document.getElementById('round-words'),scoreEl=document.getElementById('score'),bestScoreEl=document.getElementById('best-score'),currentSet=null,foundWords=[],score=0,bestScore=0,timeLeft=60,timerInterval=null;
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;
      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('word-puzzle','score');if(saved!==null){bestScore=saved;bestScoreEl.textContent=saved;}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('word-puzzle','score');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var d=new Date(h.date);var dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);
      function startRound(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.wordPuzzle;var idx=Math.floor(Math.random()*wordData.length);currentSet=wordData[idx];wordLetters.textContent=currentSet.letters.split('').join(' ');foundWords=[];score=0;timeLeft=60;wordList.innerHTML='<div style="color:#666;font-size:14px">'+txt.makeWords+'</div>';roundWordsEl.textContent='0';scoreEl.textContent='0';wordFeedback.textContent='';wordInput.value='';wordInput.disabled=false;wordSubmit.disabled=false;wordStart.textContent=txt.newRound;wordInput.focus();timerInterval=setInterval(function(){timeLeft--;wordTimer.textContent=timeLeft;if(timeLeft<=0){clearInterval(timerInterval);wordInput.disabled=true;wordSubmit.disabled=true;window.GameRecord.save('word-puzzle','score',score);if(score>bestScore){bestScore=score;bestScoreEl.textContent=bestScore;}if(historyVisible)renderHistory();wordFeedback.textContent=txt.timeUp+foundWords.length+txt.words+score+txt.pointsText;wordFeedback.style.color='#e74c3c';wordStart.style.display='inline-block';}},1000);}
      function submitWord(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.wordPuzzle;var word=wordInput.value.trim();if(word.length<2){wordFeedback.textContent=txt.tooShort;wordFeedback.style.color='#e74c3c';return;}var valid=true;var letterCount={};for(var i=0;i<currentSet.letters.length;i++){var c=currentSet.letters[i];letterCount[c]=(letterCount[c]||0)+1;}for(var i=0;i<word.length;i++){var c=word[i];if(!letterCount[c]||letterCount[c]<=0){valid=false;break;}letterCount[c]--;}if(!valid){wordFeedback.textContent=txt.useGiven;wordFeedback.style.color='#e74c3c';return;}if(foundWords.indexOf(word)!==-1){wordFeedback.textContent=txt.alreadyUsed;wordFeedback.style.color='#f39c12';return;}if(currentSet.words.indexOf(word)===-1){wordFeedback.textContent=txt.invalid;wordFeedback.style.color='#e74c3c';return;}var points=word.length;score+=points;foundWords.push(word);roundWordsEl.textContent=foundWords.length;scoreEl.textContent=score;wordFeedback.textContent=txt.plusPoints+points+txt.pointsText;wordFeedback.style.color='#27ae60';var wordDiv='<div style="display:inline-block;background:#e3f2fd;padding:8px 16px;border-radius:8px;margin:4px;font-weight:bold;color:#1976d2">'+word+' (+'+points+')</div>';if(wordList.querySelector('div').textContent.includes(txt.makeWords)){wordList.innerHTML=wordDiv;}else{wordList.innerHTML+=wordDiv;}wordInput.value='';wordInput.focus();}
      wordStart.addEventListener('click',startRound);
      wordSubmit.addEventListener('click',submitWord);
      wordInput.addEventListener('keypress',function(e){if(e.key==='Enter')submitWord();});
    </script>
  `;
  return gameHTML;
};
