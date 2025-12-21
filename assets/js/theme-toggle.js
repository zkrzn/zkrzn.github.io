(function(){
  // Force site to dark-only theme
  try{ document.documentElement.setAttribute('data-theme','dark'); }catch(e){}
  try{ localStorage.setItem('site-theme','dark'); }catch(e){}
})();
