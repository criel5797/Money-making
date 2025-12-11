'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('typing-speed');
  var gameHTML = `
    <h1>⌨️ ${title.ko}</h1>
    ${getGameTitleScript('typing-speed', '⌨️')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="typing.desc">아래 문장을 빠르고 정확하게 타이핑하세요!</p>
      <div id="target-text" style="font-size:20px;padding:24px;background:#f8f9fa;border-radius:8px;margin:24px 0;line-height:1.8;font-family:monospace"></div>
      <textarea id="typing-input" data-i18n-game-placeholder="typing.placeholder" placeholder="여기에 입력하세요..." style="height:120px;font-size:18px;resize:none;font-family:monospace" disabled></textarea>
      <button id="typing-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px;margin-top:16px" data-i18n-game="typing.start">시작하기</button>
      <div id="typing-result" style="margin:16px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.wpm">WPM</div><div id="wpm" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.accuracyLabel">정확도</div><div id="accuracy" class="stat-value">-</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="typing.bestWpm">최고 WPM</div><div id="best-wpm" class="stat-value">0</div></div>
      </div>
    </div>
    <script>
      var texts=['빠른 갈색 여우가 게으른 개를 뛰어넘는다','인생은 자전거를 타는 것과 같다','꿈을 이루는 비결은 시작하는 것이다','성공은 매일의 작은 노력이 쌓여 만들어진다','오늘 할 수 있는 일을 내일로 미루지 마라','천 리 길도 한 걸음부터 시작한다','실패는 성공의 어머니이다','시간은 금이다 낭비하지 말자','노력은 결코 배신하지 않는다','인내는 쓰지만 그 열매는 달다','최선을 다하면 후회가 없다','행복은 마음먹기에 달려있다','건강이 최고의 재산이다','웃는 얼굴에 침 못 뱉는다','백문이 불여일견이다','가는 말이 고와야 오는 말이 곱다','지금 이 순간을 소중히 여기자','배움에는 끝이 없다','긍정적인 생각이 긍정적인 결과를 만든다','하루하루 최선을 다하며 살자','모든 것은 마음먹기에 달려있다','작은 것에 감사하는 마음을 가지자','함께하면 더 큰 힘이 된다','꾸준함이 재능을 이긴다','변화는 항상 지금 이 순간부터 시작된다'];
      var targetText=document.getElementById('target-text'),typingInput=document.getElementById('typing-input'),typingStart=document.getElementById('typing-start'),typingResult=document.getElementById('typing-result'),wpmEl=document.getElementById('wpm'),accuracyEl=document.getElementById('accuracy'),bestWpmEl=document.getElementById('best-wpm'),startTime=0,bestWpm=0,currentText='',errors=0;
      function startTyping(){currentText=texts[Math.floor(Math.random()*texts.length)];targetText.innerHTML=currentText;typingInput.value='';errors=0;typingInput.disabled=false;typingInput.focus();typingStart.style.display='none';typingResult.textContent='';wpmEl.textContent='0';accuracyEl.textContent='100%';startTime=Date.now();}
      function updateDisplay(){var typed=typingInput.value;var html='';errors=0;for(var i=0;i<currentText.length;i++){if(i<typed.length){if(typed[i]===currentText[i]){html+='<span style="color:#27ae60;background:#d4edda">'+currentText[i]+'</span>';}else{html+='<span style="color:#e74c3c;background:#f8d7da;text-decoration:underline">'+currentText[i]+'</span>';errors++;}}else if(i===typed.length){html+='<span style="background:#fff3cd">'+currentText[i]+'</span>';}else{html+='<span style="color:#666">'+currentText[i]+'</span>';}}targetText.innerHTML=html;var elapsed=(Date.now()-startTime)/1000/60;if(elapsed>0){var wpm=Math.round((typed.length/5)/elapsed);wpmEl.textContent=wpm;}var acc=typed.length>0?Math.round(((typed.length-errors)/typed.length)*100):100;accuracyEl.textContent=acc+'%';}
      typingStart.addEventListener('click',startTyping);
      typingInput.addEventListener('input',function(){updateDisplay();if(typingInput.value===currentText){var elapsed=(Date.now()-startTime)/1000/60;var wpm=Math.round(currentText.length/5/elapsed);wpmEl.textContent=wpm;var finalAcc=Math.round(((currentText.length-errors)/currentText.length)*100);accuracyEl.textContent=finalAcc+'%';typingResult.textContent=window.i18n[window.currentLang].games.typing.complete+wpm+window.i18n[window.currentLang].games.typing.accuracy+finalAcc+'%';typingResult.style.color='#27ae60';if(wpm>bestWpm){bestWpm=wpm;bestWpmEl.textContent=wpm;}typingInput.disabled=true;typingStart.style.display='inline-block';}});
    </script>
  `;
  return gameHTML;
};
