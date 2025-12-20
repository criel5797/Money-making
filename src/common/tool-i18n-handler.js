(function() {
  'use strict';

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
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyI18n);
  } else {
    applyI18n();
  }
})();
