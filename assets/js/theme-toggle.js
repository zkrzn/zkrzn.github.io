(function(){
  const key = 'site-theme';
  const root = document.documentElement;
  function setTheme(t){
    root.setAttribute('data-theme', t);
    try{ localStorage.setItem(key, t); }catch(e){}
    const btn = document.querySelector('.theme-toggle');
    if(btn) btn.setAttribute('aria-pressed', t === 'dark');
  }
  function init(){
    const saved = (function(){ try{ return localStorage.getItem(key); }catch(e){ return null; }})();
    if(saved) return setTheme(saved);
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return setTheme('dark');
    setTheme('light');
  }
  window.toggleSiteTheme = function(){
    const current = root.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }
  init();
})();
