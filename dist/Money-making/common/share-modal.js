(function() {
  'use strict';

  // Share Modal Component
  // Usage: window.openShareModal({ title: '제목', text: '공유할 텍스트', url: 'https://...' });

  var modalId = 'share-modal-container';
  var isInitialized = false;

  var i18nTexts = {
    ko: {
      title: '공유하기',
      twitter: 'X (트위터)',
      facebook: '페이스북',
      copyLink: '링크 복사',
      copied: '복사 완료! 친구에게 공유해보세요 🎉',
      close: '닫기'
    },
    en: {
      title: 'Share',
      twitter: 'X (Twitter)',
      facebook: 'Facebook',
      copyLink: 'Copy Link',
      copied: 'Copied! Share with friends 🎉',
      close: 'Close'
    },
    ja: {
      title: '共有',
      twitter: 'X (Twitter)',
      facebook: 'Facebook',
      copyLink: 'リンクをコピー',
      copied: 'コピー完了！友達にシェアしよう 🎉',
      close: '閉じる'
    }
  };

  function getLang() {
    return window.currentLang || 'ko';
  }

  function t(key) {
    var lang = getLang();
    return (i18nTexts[lang] && i18nTexts[lang][key]) || i18nTexts.ko[key] || key;
  }

  function createModalHTML() {
    return `
      <div id="${modalId}" class="share-modal-overlay" style="display:none;">
        <div class="share-modal-content">
          <div class="share-modal-header">
            <h3 class="share-modal-title">${t('title')}</h3>
            <button class="share-modal-close" onclick="window.closeShareModal()">&times;</button>
          </div>
          <div class="share-modal-body">
            <div class="share-modal-buttons">
              <button class="share-btn-item share-btn-twitter" onclick="window._shareVia('twitter')">
                <span class="share-btn-icon">𝕏</span>
                <span class="share-btn-label">${t('twitter')}</span>
              </button>
              <button class="share-btn-item share-btn-facebook" onclick="window._shareVia('facebook')">
                <span class="share-btn-icon">f</span>
                <span class="share-btn-label">${t('facebook')}</span>
              </button>
              <button class="share-btn-item share-btn-copy" onclick="window._shareVia('copy')">
                <span class="share-btn-icon">📋</span>
                <span class="share-btn-label">${t('copyLink')}</span>
              </button>
            </div>
          </div>
          <div class="share-modal-toast" id="share-modal-toast"></div>
        </div>
      </div>
      <style>
        .share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .share-modal-overlay.show {
          opacity: 1;
        }
        .share-modal-content {
          background: #fff;
          border-radius: 16px;
          width: 90%;
          max-width: 360px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          transform: translateY(20px);
          transition: transform 0.2s ease;
        }
        .share-modal-overlay.show .share-modal-content {
          transform: translateY(0);
        }
        .share-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .share-modal-title {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }
        .share-modal-close {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: #999;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .share-modal-close:hover {
          color: #333;
        }
        .share-modal-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .share-btn-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 8px;
        }
        .share-btn-item:hover {
          transform: translateY(-2px);
        }
        .share-btn-icon {
          font-size: 1.8rem;
          line-height: 1;
        }
        .share-btn-label {
          font-size: 0.85rem;
          font-weight: 500;
        }
        .share-btn-twitter {
          background: #000;
          color: #fff;
        }
        .share-btn-twitter:hover {
          background: #333;
        }
        .share-btn-facebook {
          background: #1877F2;
          color: #fff;
        }
        .share-btn-facebook:hover {
          background: #166FE5;
        }
        .share-btn-facebook .share-btn-icon {
          font-family: Georgia, serif;
          font-weight: bold;
        }
        .share-btn-copy {
          background: #6B7280;
          color: #fff;
        }
        .share-btn-copy:hover {
          background: #4B5563;
        }
        .share-modal-toast {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          opacity: 0;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .share-modal-toast.show {
          bottom: 20px;
          opacity: 1;
        }
        @media (max-width: 400px) {
          .share-modal-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
          .share-btn-item {
            padding: 14px 10px;
          }
        }
      </style>
    `;
  }

  function initModal() {
    if (isInitialized) return;

    var container = document.createElement('div');
    container.innerHTML = createModalHTML();
    document.body.appendChild(container);
    isInitialized = true;

    // Close on overlay click
    var overlay = document.getElementById(modalId);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        window.closeShareModal();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.style.display !== 'none') {
        window.closeShareModal();
      }
    });
  }

  var currentShareData = {};

  window.openShareModal = function(options) {
    initModal();

    currentShareData = {
      title: options.title || document.title,
      text: options.text || '',
      url: options.url || window.location.href
    };

    var overlay = document.getElementById(modalId);
    overlay.style.display = 'flex';

    // Update labels for current language
    overlay.querySelector('.share-modal-title').textContent = t('title');
    overlay.querySelectorAll('.share-btn-label').forEach(function(el, i) {
      var keys = ['twitter', 'facebook', 'copyLink'];
      el.textContent = t(keys[i]);
    });

    setTimeout(function() {
      overlay.classList.add('show');
    }, 10);
  };

  window.closeShareModal = function() {
    var overlay = document.getElementById(modalId);
    if (!overlay) return;

    overlay.classList.remove('show');
    setTimeout(function() {
      overlay.style.display = 'none';
    }, 200);
  };

  function showToast(message) {
    var toast = document.getElementById('share-modal-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2000);
  }

  window._shareVia = function(platform) {
    var data = currentShareData;
    var shareText = data.text + '\n\n👉 ' + data.url;
    var encodedText = encodeURIComponent(data.text + '\n\n👉');
    var encodedUrl = encodeURIComponent(data.url);

    switch(platform) {
      case 'twitter':
        var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;

      case 'facebook':
        var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&quote=' + encodeURIComponent(data.text);
        window.open(fbUrl, '_blank', 'width=600,height=400');
        break;

      case 'copy':
        navigator.clipboard.writeText(shareText).then(function() {
          showToast(t('copied'));
        }).catch(function() {
          // Fallback for older browsers
          var textarea = document.createElement('textarea');
          textarea.value = shareText;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast(t('copied'));
        });
        return; // Don't close modal for copy
    }

    window.closeShareModal();
  };

  // Legacy support: also provide shareResult function that tools can override
  // Or tools can call openShareModal directly
})();
