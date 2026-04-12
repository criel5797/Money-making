'use strict';

module.exports = function(options) {
  var getGameTitle = options.getGameTitle;
  var getGameTitleScript = options.getGameTitleScript;

  var title = getGameTitle('hearing-test');
  var gameHTML = `
    <h1 data-game-title="hearing-test">👂 ${title.ko}</h1>
    ${getGameTitleScript('hearing-test', '👂')}
    <div class="game-card" style="text-align:center">
      <p style="color:#666" data-i18n-game="hearing.desc">소리가 들리면 버튼을 누르세요. 주파수가 점점 높아집니다!</p>
      <div id="hearing-display" style="font-size:48px;font-weight:bold;margin:40px 0;color:#667eea">
        <span id="freq-display">--</span> Hz
      </div>
      <div id="hearing-visual" style="width:200px;height:200px;margin:0 auto 30px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;transition:all 0.3s">
        <span style="font-size:60px">🔊</span>
      </div>
      <button id="hearing-start" class="btn btn-primary" style="font-size:18px;padding:16px 48px" data-i18n-game="hearing.start">테스트 시작</button>
      <button id="hearing-btn" class="btn btn-primary" style="font-size:18px;padding:20px 60px;display:none;background:#27ae60" data-i18n-game="hearing.canHear">들려요!</button>
      <div id="hearing-result" style="margin:20px 0;font-size:18px;font-weight:bold;min-height:30px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
        <div class="stat-box"><div class="stat-label" data-i18n-game="hearing.currentFreq">현재 주파수</div><div id="current-freq" class="stat-value">--</div></div>
        <div class="stat-box"><div class="stat-label" data-i18n-game="hearing.maxFreq">최고 주파수</div><div id="max-freq" class="stat-value">--</div></div>
      </div>
      <div style="margin-top:20px;padding:15px;background:rgba(102,126,234,0.1);border-radius:12px;text-align:left">
        <p style="font-size:14px;color:#666;margin:0" data-i18n-game="hearing.note">※ 헤드폰 사용을 권장합니다. 볼륨을 적당히 조절하세요.</p>
      </div>
      <button id="history-btn" class="btn btn-primary" style="margin-top:24px;font-size:14px;padding:10px 20px" data-i18n-game="history.showHistory">기록 보기</button>
      <div id="history-panel" style="display:none;margin-top:16px;padding:16px;background:#f8f9fa;border-radius:12px;text-align:left">
        <h3 style="color:#333;margin:0 0 12px 0" data-i18n-game="history.recentRecords">최근 기록</h3>
        <div id="history-list" style="max-height:200px;overflow-y:auto"></div>
      </div>
    </div>
    <script>
      var audioCtx=null,oscillator=null,currentFreq=1000,maxHeard=0,playing=false,testInterval=null;
      var startBtn=document.getElementById('hearing-start'),hearBtn=document.getElementById('hearing-btn'),freqDisplay=document.getElementById('freq-display');
      var currentFreqEl=document.getElementById('current-freq'),maxFreqEl=document.getElementById('max-freq'),resultEl=document.getElementById('hearing-result');
      var visualEl=document.getElementById('hearing-visual');
      var historyBtn=document.getElementById('history-btn'),historyPanel=document.getElementById('history-panel'),historyList=document.getElementById('history-list'),historyVisible=false;

      function loadSavedBest(){if(!window.GameRecord)return;var saved=window.GameRecord.getBest('hearing-test','freq');if(saved!==null){maxFreqEl.textContent=saved+'Hz';}}
      function renderHistory(){if(!window.GameRecord)return;var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;var history=window.GameRecord.getHistory('hearing-test','freq');if(history.length===0){historyList.innerHTML='<p style="color:#666;margin:0">'+txt.noHistory+'</p>';return;}var html='<table style="width:100%;border-collapse:collapse;font-size:14px">';html+='<tr style="border-bottom:1px solid #ddd"><th style="padding:8px;text-align:left">'+txt.date+'</th><th style="padding:8px;text-align:right">'+txt.result+'</th></tr>';for(var i=history.length-1;i>=0;i--){var h=history[i];var dateStr=window.formatDateTime(h.date);html+='<tr style="border-bottom:1px solid #eee"><td style="padding:8px;color:#666">'+dateStr+'</td><td style="padding:8px;text-align:right;font-weight:bold;color:#667eea">'+h.value+'Hz</td></tr>';}html+='</table>';historyList.innerHTML=html;}
      historyBtn.addEventListener('click',function(){var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.history;historyVisible=!historyVisible;historyPanel.style.display=historyVisible?'block':'none';historyBtn.textContent=historyVisible?txt.hideHistory:txt.showHistory;if(historyVisible)renderHistory();});
      window.addEventListener('load',loadSavedBest);

      function playTone(freq){
        if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
        if(oscillator){oscillator.stop();oscillator.disconnect();}
        oscillator=audioCtx.createOscillator();
        var gainNode=audioCtx.createGain();
        oscillator.connect(gainNode);gainNode.connect(audioCtx.destination);
        oscillator.frequency.value=freq;
        gainNode.gain.value=0.3;
        oscillator.start();
        visualEl.style.transform='scale(1.1)';
        setTimeout(function(){visualEl.style.transform='scale(1)';},200);
      }

      function stopTone(){if(oscillator){oscillator.stop();oscillator.disconnect();oscillator=null;}}

      function startTest(){
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.hearing;
        currentFreq=1000;maxHeard=0;playing=true;
        startBtn.style.display='none';hearBtn.style.display='inline-block';
        resultEl.textContent=txt.listen||'소리에 집중하세요...';resultEl.style.color='#667eea';
        playTone(currentFreq);
        freqDisplay.textContent=currentFreq;currentFreqEl.textContent=currentFreq+'Hz';
        testInterval=setInterval(function(){
          if(!playing)return;
          currentFreq+=500;
          if(currentFreq>20000){endTest();return;}
          freqDisplay.textContent=currentFreq;currentFreqEl.textContent=currentFreq+'Hz';
          playTone(currentFreq);
        },2000);
      }

      function heardSound(){
        maxHeard=currentFreq;
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.hearing;
        resultEl.textContent=txt.heard+' '+currentFreq+'Hz';resultEl.style.color='#27ae60';
      }

      function endTest(){
        playing=false;clearInterval(testInterval);stopTone();
        hearBtn.style.display='none';startBtn.style.display='inline-block';
        var lang=window.currentLang||'ko';var txt=window.i18n[lang].games.hearing;
        var rating='';
        if(maxHeard>=15000)rating=txt.excellent||'훌륭함';
        else if(maxHeard>=12000)rating=txt.good||'좋음';
        else if(maxHeard>=8000)rating=txt.normal||'보통';
        else rating=txt.belowNormal||'평균 이하';
        resultEl.innerHTML=txt.complete+' <strong>'+maxHeard+'Hz</strong> ('+rating+')';resultEl.style.color='#667eea';
        maxFreqEl.textContent=maxHeard+'Hz';
        window.GameRecord.save('hearing-test','freq',maxHeard);if(historyVisible)renderHistory();var lang=window.currentLang||'ko';var freqK=(maxHeard/1000).toFixed(1);var shtxt=lang==='ko'?'👂 내 청력: '+freqK+'kHz까지 들려! 너는?':lang==='ja'?'👂 聴力テスト: '+freqK+'kHzまで聞こえた！あなたは？':'👂 I can hear up to '+freqK+'kHz! How about you?';window._shareResult={title:shtxt,text:shtxt,url:window.location.href};
      }

      startBtn.addEventListener('click',startTest);
      hearBtn.addEventListener('click',heardSound);
    </script>
  `;
  return gameHTML;
};
