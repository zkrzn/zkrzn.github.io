(function () {
  var STORAGE_KEY = 'site-theme';

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return null;
  }

  function getEffectiveTheme() {
    return getSavedTheme() || getSystemTheme();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateIcon(theme);
    try { document.documentElement.dispatchEvent(new Event('themechange')); } catch (e) {}
  }

  function updateIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('title', 'Switch to light mode');
    } else {
      icon.className = 'fa-solid fa-moon';
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('title', 'Switch to dark mode');
    }
  }

  // Wire up the toggle button once the DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    updateIcon(document.documentElement.getAttribute('data-theme') || getEffectiveTheme());
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || getEffectiveTheme();
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Listen for system preference changes (if user hasn't set an override)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
        if (!getSavedTheme()) {
          var newTheme = e.matches ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          updateIcon(newTheme);
        }
      });
    }
  });
})();
