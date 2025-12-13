'use strict';

// 공통 CSS 스타일 (모바일 최적화 강화)
var styles = `
@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;margin:0;padding:0;min-height:100vh;background:linear-gradient(-45deg,#667eea,#764ba2,#f093fb,#4facfe);background-size:400% 400%;animation:gradient 15s ease infinite;overflow-x:hidden;-webkit-tap-highlight-color:transparent}
.container{max-width:1200px;margin:0 auto;padding:24px;animation:fadeIn 0.8s ease-out}
h1{font-size:clamp(28px,5vw,56px);margin:32px 0 16px;text-align:center;color:#fff;font-weight:900;text-shadow:0 4px 12px rgba(0,0,0,0.2);letter-spacing:-1px;animation:fadeIn 1s ease-out}
h2{font-size:28px;margin:24px 0;color:#fff;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,0.15)}
h3{font-size:22px;margin:16px 0;color:#fff;font-weight:600}
p{color:#fff;font-size:18px;text-shadow:0 2px 4px rgba(0,0,0,0.1)}
a{color:#fff;text-decoration:none;transition:all 0.3s}
a:hover{opacity:0.8}
a:focus,button:focus,input:focus{outline:2px solid #fff;outline-offset:2px}
.skip-link{position:absolute;top:-40px;left:0;background:#667eea;color:#fff;padding:8px 16px;z-index:1000;border-radius:0 0 8px 0}
.skip-link:focus{top:0}
.game-card{background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-radius:24px;padding:32px;margin:16px 0;box-shadow:0 8px 32px rgba(0,0,0,0.1);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);border:1px solid rgba(255,255,255,0.3);position:relative;overflow:hidden;animation:fadeIn 0.6s ease-out backwards}
.game-card::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(255,255,255,0.1),transparent);pointer-events:none}
.game-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 16px 48px rgba(0,0,0,0.15)}
.game-card:nth-child(1){animation-delay:0.1s}.game-card:nth-child(2){animation-delay:0.2s}.game-card:nth-child(3){animation-delay:0.3s}.game-card:nth-child(4){animation-delay:0.4s}.game-card:nth-child(5){animation-delay:0.5s}.game-card:nth-child(6){animation-delay:0.6s}.game-card:nth-child(7){animation-delay:0.7s}.game-card:nth-child(8){animation-delay:0.8s}.game-card:nth-child(9){animation-delay:0.9s}.game-card:nth-child(10){animation-delay:1s}
.game-emoji{font-size:64px;margin:16px 0;text-align:center;animation:bounce 2s ease-in-out infinite;display:inline-block}
.game-card:hover .game-emoji{animation:pulse 0.6s ease-in-out}
.game-title{font-size:28px;font-weight:800;margin:16px 0;color:#1a1a1a;text-align:center}
.game-description{color:#555;margin:12px 0;text-align:center;font-size:15px;line-height:1.6}
.game-category{display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;margin:8px 0;font-weight:600;box-shadow:0 2px 8px rgba(102,126,234,0.3);text-transform:uppercase;letter-spacing:0.5px}
.play-btn{display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:14px 40px;border-radius:50px;margin:16px 0;font-size:18px;font-weight:700;cursor:pointer;border:none;transition:all 0.3s;text-align:center;box-shadow:0 4px 15px rgba(102,126,234,0.4);position:relative;overflow:hidden;min-height:48px;min-width:48px;touch-action:manipulation}
.play-btn::before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transition:left 0.5s}
.play-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(102,126,234,0.5)}.play-btn:hover::before{left:100%}
.play-btn:active{transform:translateY(0)}
.btn{padding:14px 28px;font-size:16px;font-weight:700;border:none;border-radius:12px;cursor:pointer;transition:all 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.1);min-height:48px;min-width:48px;touch-action:manipulation}
.btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(102,126,234,0.4)}
.btn-success{background:linear-gradient(135deg,#11998e,#38ef7d);color:#fff}.btn-success:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(56,239,125,0.4)}
.btn-danger{background:linear-gradient(135deg,#eb3349,#f45c43);color:#fff}.btn-danger:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(235,51,73,0.4)}
input,textarea{padding:14px;font-size:16px;border:2px solid rgba(255,255,255,0.3);border-radius:12px;width:100%;box-sizing:border-box;margin:8px 0;background:rgba(255,255,255,0.9);transition:all 0.3s}
input:focus,textarea:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.2);background:#fff}
footer{color:rgba(255,255,255,0.9);margin:48px 0 24px;text-align:center;font-size:14px;text-shadow:0 2px 4px rgba(0,0,0,0.1)}
footer a{color:#fff;font-weight:600}
footer nav{margin-top:16px;display:flex;justify-content:center;gap:16px;flex-wrap:wrap}
.placeholder{height:90px;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border:2px dashed rgba(102,126,234,0.3);display:flex;align-items:center;justify-content:center;color:#666;font-size:13px;border-radius:16px;margin:24px 0}
nav{text-align:center;margin:24px 0;padding:16px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border-radius:16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.1)}
nav a{margin:0 8px;font-size:16px;font-weight:600;color:#fff;padding:8px 16px;border-radius:8px;transition:all 0.3s}
nav a:hover{background:rgba(255,255,255,0.2)}
.lang-switcher{display:flex;gap:8px}
.lang-btn{background:rgba(255,255,255,0.2);border:none;color:#fff;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;font-size:14px;min-height:44px;min-width:44px;touch-action:manipulation}
.lang-btn:hover{background:rgba(255,255,255,0.3)}
.lang-btn.active{background:rgba(255,255,255,0.4);box-shadow:0 2px 8px rgba(0,0,0,0.2)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin:32px 0}
.stat-box{background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85));backdrop-filter:blur(10px);padding:24px;border-radius:16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.08);border:1px solid rgba(255,255,255,0.3)}
.stat-label{font-size:14px;color:#666;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.stat-value{font-size:40px;font-weight:900;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-top:8px}
.header-section{text-align:center;margin-bottom:48px;padding:32px 0}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
@media(max-width:1024px){.container{padding:20px}.game-card{padding:24px}}
@media(max-width:768px){.grid{grid-template-columns:1fr;gap:16px}h1{font-size:28px}.game-emoji{font-size:48px}nav{flex-direction:column;gap:12px}.stat-box{padding:16px}.stat-value{font-size:32px}.game-card{padding:20px}}
@media(max-width:480px){.container{padding:12px}h1{font-size:24px}.game-title{font-size:22px}.play-btn{padding:12px 32px;font-size:16px;width:100%}.btn{padding:12px 20px;font-size:14px}.lang-btn{padding:6px 12px;font-size:12px}.stat-box{padding:12px}.stat-value{font-size:28px}.stat-label{font-size:12px}}
@media(hover:none){.game-card:hover{transform:none}.play-btn:hover{transform:none}.btn:hover{transform:none}}
`;

// 게임 기록 저장/불러오기 유틸리티 스크립트
function getGameRecordScript() {
  return `
window.formatDateTime=function(dateStr){
  var d=new Date(dateStr);
  var locale=window.currentLang==='ko'?'ko-KR':window.currentLang==='ja'?'ja-JP':'en-US';
  return d.toLocaleDateString(locale)+' '+d.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'});
};
window.GameRecord={
  save:function(gameId,recordType,value,timestamp){
    var key='game_'+gameId+'_'+recordType;
    var history=this.getHistory(gameId,recordType);
    history.push({value:value,date:timestamp||new Date().toISOString()});
    if(history.length>20)history=history.slice(-20);
    localStorage.setItem(key+'_history',JSON.stringify(history));
    var best=this.getBest(gameId,recordType);
    var isHigherBetter=this.isHigherBetter(recordType);
    if(best===null||(isHigherBetter?value>best:value<best)){
      localStorage.setItem(key+'_best',value.toString());
      return true;
    }
    return false;
  },
  getBest:function(gameId,recordType){
    var key='game_'+gameId+'_'+recordType+'_best';
    var val=localStorage.getItem(key);
    return val===null?null:parseFloat(val);
  },
  getHistory:function(gameId,recordType){
    var key='game_'+gameId+'_'+recordType+'_history';
    var data=localStorage.getItem(key);
    return data?JSON.parse(data):[];
  },
  isHigherBetter:function(recordType){
    var lowerBetter=['reactionTime'];
    return lowerBetter.indexOf(recordType)===-1;
  },
  formatValue:function(value,recordType){
    if(recordType==='reactionTime')return value+'ms';
    if(recordType==='wpm'||recordType==='cps')return value.toFixed?value.toFixed(1):value;
    if(recordType==='accuracy')return value+'%';
    return value.toString();
  }
};
`;
}

// 공통 i18n 스크립트
function getI18nScript(i18nData) {
  return getGameRecordScript() + `
var i18nData=${JSON.stringify(i18nData)};
var currentLang=localStorage.getItem("lang")||navigator.language.split("-")[0]||"ko";
if(!i18nData[currentLang])currentLang="ko";
window.i18n=i18nData;
window.currentLang=currentLang;
function setLanguage(lang){
  if(!i18nData[lang])return;
  currentLang=lang;
  window.currentLang=lang;
  localStorage.setItem("lang",lang);
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var key=el.getAttribute("data-i18n");
    if(i18nData[lang][key])el.textContent=i18nData[lang][key];
  });
  document.querySelectorAll("[data-i18n-key]").forEach(function(el){
    var key=el.getAttribute("data-i18n-key");
    if(i18nData[lang][key]){
      el.textContent=i18nData[lang][key];
      document.title=i18nData[lang][key];
    }
  });
  document.querySelectorAll("[data-i18n-game]").forEach(function(el){
    var key=el.getAttribute("data-i18n-game");
    var keys=key.split(".");
    if(keys.length===2&&i18nData[lang].games[keys[0]]&&i18nData[lang].games[keys[0]][keys[1]]){
      var value=i18nData[lang].games[keys[0]][keys[1]];
      if(el.tagName==="P"||el.tagName==="DIV"||el.tagName==="BUTTON"||el.tagName==="SPAN"){
        el.innerHTML=value;
      }else{
        el.textContent=value;
      }
    }
  });
  document.querySelectorAll("[data-i18n-game-placeholder]").forEach(function(el){
    var key=el.getAttribute("data-i18n-game-placeholder");
    var keys=key.split(".");
    if(keys.length===2&&i18nData[lang].games[keys[0]]&&i18nData[lang].games[keys[0]][keys[1]]){
      el.placeholder=i18nData[lang].games[keys[0]][keys[1]];
    }
  });
  document.querySelectorAll(".lang-btn").forEach(function(btn){
    btn.classList.toggle("active",btn.getAttribute("data-lang")===lang);
  });
  var h1=document.querySelector("h1[data-game-title]");
  if(h1&&window.gameTitle&&window.gameTitle[lang]){
    h1.textContent=window.titleEmoji+" "+window.gameTitle[lang];
  }
}
document.querySelectorAll(".lang-btn").forEach(function(btn){
  btn.addEventListener("click",function(){
    setLanguage(this.getAttribute("data-lang"));
  });
});
setLanguage(currentLang);
`;
}

// HTML 레이아웃 생성 함수
function createLayout(options) {
  var title = options.title;
  var description = options.description || title + ' - 무료 미니게임 모음집';
  var pathname = options.pathname;
  var body = options.body;
  var includeAdScript = options.includeAdScript || false;
  var adsClient = options.adsClient || '';
  var basePath = options.basePath || '';
  var baseUrl = options.baseUrl || 'https://instaidea.org';
  var i18nData = options.i18nData;
  var ogImage = options.ogImage || baseUrl + '/og-image.png';

  var adsScript = '';
  if (includeAdScript && adsClient) {
    adsScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + adsClient + '" crossorigin="anonymous"></script>';
  }

  var canonical = baseUrl + pathname;
  var href = function(p) { return basePath + p; };

  var adsPlaceholder = adsClient
    ? (
      '<ins class="adsbygoogle" style="display:block;margin:24px 0" data-ad-format="auto" data-full-width-responsive="true"></ins>' +
      '<script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>'
    )
    : '<div class="placeholder" data-i18n="adPlaceholder">AdSense 승인 후 광고가 표시됩니다</div>';

  var html =
    '<!doctype html><html lang="ko"><head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<title data-i18n-key="siteTitle">' + title + '</title>' +
    '<meta name="description" content="' + description + '">' +

    // Open Graph 메타태그
    '<meta property="og:type" content="website">' +
    '<meta property="og:url" content="' + canonical + '">' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="og:description" content="' + description + '">' +
    '<meta property="og:image" content="' + ogImage + '">' +
    '<meta property="og:locale" content="ko_KR">' +
    '<meta property="og:locale:alternate" content="en_US">' +
    '<meta property="og:locale:alternate" content="ja_JP">' +
    '<meta property="og:site_name" content="Mini Game Collection">' +

    // Twitter Card 메타태그
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + title + '">' +
    '<meta name="twitter:description" content="' + description + '">' +
    '<meta name="twitter:image" content="' + ogImage + '">' +

    // 추가 SEO 메타태그
    '<link rel="canonical" href="' + canonical + '">' +
    '<meta name="robots" content="index,follow,max-image-preview:large">' +
    '<meta name="theme-color" content="#667eea">' +
    '<meta name="apple-mobile-web-app-capable" content="yes">' +
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' +

    // Favicon
    '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">' +
    '<link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>">' +

    adsScript +
    '<style>' + styles + '</style>' +
    '</head><body>' +
    '<a href="#main-content" class="skip-link">Skip to main content</a>' +
    '<div class="container">' +
    '<nav role="navigation" aria-label="Main navigation">' +
    '<a href="' + href('/') + '" data-i18n="home" aria-label="Go to home page">🏠 홈</a>' +
    '<div class="lang-switcher" role="group" aria-label="Language selection">' +
    '<button class="lang-btn" data-lang="ko" aria-label="한국어로 변경">한국어</button>' +
    '<button class="lang-btn" data-lang="en" aria-label="Change to English">English</button>' +
    '<button class="lang-btn" data-lang="ja" aria-label="日本語に変更">日本語</button>' +
    '</div>' +
    '</nav>' +
    '<main id="main-content" role="main">' +
    body +
    '</main>' +
    '<div class="ad" role="complementary" aria-label="Advertisement">' + adsPlaceholder + '</div>' +
    '<footer role="contentinfo">' +
    '<p>© ' + (new Date().getFullYear()) + ' Fun Mini Games</p>' +
    '<nav aria-label="Footer navigation">' +
    '<a href="' + href('/') + '" data-i18n="footer">전체 게임 보기</a>' +
    '<a href="' + href('/privacy/') + '">Privacy Policy</a>' +
    '</nav>' +
    '</footer>' +
    '</div>' +
    '<script>' + getI18nScript(i18nData) + '</script>' +
    '</body></html>';

  return html;
}

module.exports = {
  createLayout: createLayout,
  styles: styles
};
