(function() {
  'use strict';

  // Global translation function that tools can use
  window.t = function(key, fallback) {
    if (!window.toolI18n || !window.currentLang) return fallback || key;
    var lang = window.currentLang;
    var val = key.split('.').reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, window.toolI18n);
    if (val && typeof val === 'object' && val[lang]) return val[lang];
    return fallback || key;
  };

  // Global function to get translation for a Korean text
  window.tKo = function(koreanText) {
    if (!window.toolI18n || !window.currentLang || window.currentLang === 'ko') return koreanText;
    var textMap = window._i18nTextMap;
    if (!textMap) return koreanText;
    return textMap[koreanText] || koreanText;
  };

  function applyI18n() {
    if (!window.toolI18n || !window.currentLang) return;

    var lang = window.currentLang;
    var data = window.toolI18n; // This tool's specific translations

    // Helper to get nested value
    function getValue(obj, path) {
      return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
      }, obj);
    }

    // Build a text replacement map from the i18n data
    // This maps Korean text to the appropriate language text
    var textReplacements = {};

    function buildReplacementMap(obj, prefix) {
      if (!obj || typeof obj !== 'object') return;

      Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        if (val && typeof val === 'object') {
          // Check if this is a translation object (has 'ko', 'en', 'ja' keys)
          if (val.ko !== undefined && (val.en !== undefined || val.ja !== undefined)) {
            var koText = val.ko;
            var targetText = val[lang] || val.ko;
            if (koText && targetText && koText !== targetText) {
              textReplacements[koText] = targetText;
            }
          } else {
            // Recurse into nested objects
            buildReplacementMap(val, prefix ? prefix + '.' + key : key);
          }
        }
      });
    }

    buildReplacementMap(data, '');

    // Store text map globally for tKo function
    window._i18nTextMap = textReplacements;

    // Apply to elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var translation = getValue(data, key);

      if (translation && translation[lang]) {
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'placeholder')) {
          el.placeholder = translation[lang];
        } else {
          el.textContent = translation[lang];
        }
      }
    });

    // Apply to elements with data-i18n-html (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      var translation = getValue(data, key);
      if (translation && translation[lang]) {
        el.innerHTML = translation[lang];
      }
    });

    // Apply to elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var translation = getValue(data, key);
      if (translation && translation[lang]) {
        el.placeholder = translation[lang];
      }
    });

    // Update title
    if (data.meta && data.meta.title && data.meta.title[lang]) {
      document.title = data.meta.title[lang];
    }

    // If we have text replacements and language is not Korean, do text replacement
    if (lang !== 'ko' && Object.keys(textReplacements).length > 0) {
      replaceTextContent(textReplacements);
    }
  }

  // Replace text content throughout the page
  function replaceTextContent(replacements) {
    var sortedKeys = Object.keys(replacements).sort(function(a, b) {
      return b.length - a.length; // Longer strings first
    });

    // Process text nodes
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    var nodesToModify = [];
    var node;
    while (node = walker.nextNode()) {
      if (node.nodeValue && node.nodeValue.trim()) {
        nodesToModify.push(node);
      }
    }

    nodesToModify.forEach(function(textNode) {
      var text = textNode.nodeValue;
      var modified = false;

      sortedKeys.forEach(function(koreanText) {
        if (text.indexOf(koreanText) !== -1) {
          text = text.split(koreanText).join(replacements[koreanText]);
          modified = true;
        }
      });

      if (modified) {
        textNode.nodeValue = text;
      }
    });

    // Process placeholder attributes
    document.querySelectorAll('[placeholder]').forEach(function(el) {
      var placeholder = el.getAttribute('placeholder');
      sortedKeys.forEach(function(koreanText) {
        if (placeholder.indexOf(koreanText) !== -1) {
          placeholder = placeholder.split(koreanText).join(replacements[koreanText]);
        }
      });
      el.setAttribute('placeholder', placeholder);
    });

    // Process title attributes
    document.querySelectorAll('[title]').forEach(function(el) {
      var title = el.getAttribute('title');
      sortedKeys.forEach(function(koreanText) {
        if (title.indexOf(koreanText) !== -1) {
          title = title.split(koreanText).join(replacements[koreanText]);
        }
      });
      el.setAttribute('title', title);
    });

    // Process button values
    document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(function(el) {
      if (el.value) {
        var value = el.value;
        sortedKeys.forEach(function(koreanText) {
          if (value.indexOf(koreanText) !== -1) {
            value = value.split(koreanText).join(replacements[koreanText]);
          }
        });
        el.value = value;
      }
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyI18n);
  } else {
    applyI18n();
  }

  // Global helper to create share modal compatible shareResult
  // Tools can call: window.shareWithModal(title, text)
  window.shareWithModal = function(title, text) {
    if (window.openShareModal) {
      window.openShareModal({
        title: title || document.title,
        text: text || '',
        url: window.location.href
      });
    } else {
      // Fallback if share-modal.js not loaded
      var shareText = text + '\n\n' + window.location.href;
      navigator.clipboard.writeText(shareText).then(function() {
        alert('클립보드에 복사되었습니다!');
      });
    }
  };
})();
