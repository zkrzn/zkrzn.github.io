(function () {
  var STORAGE_KEY = 'site-theme';
  var DEFAULT_THEME = 'dark';

  function getSavedTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return DEFAULT_THEME;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    updateIcon(theme);
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
    updateIcon(document.documentElement.getAttribute('data-theme') || DEFAULT_THEME);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  });
})();
