/* Progressive enhancement; no modules, fetch, or hosting requirements. */
(function(){
 'use strict';
 function init(){
  const sidebar=document.querySelector('.sidebar'), bar=document.querySelector('.mobilebar');
  if(!sidebar||!bar||document.getElementById('woMobileMenu'))return;
  const shade=document.createElement('div');
  shade.className='wo-mobile-shade';shade.id='woMobileShade';
  shade.setAttribute('aria-hidden','true');document.body.appendChild(shade);
  const close=document.createElement('button');
  close.type='button';close.className='wo-sidebar-close';
  close.innerHTML='<span>WeekOS · Navigation</span><span aria-hidden="true">✕</span>';
  close.setAttribute('aria-label','Close navigation');sidebar.insertBefore(close,sidebar.firstChild);
  const menu=document.createElement('button');
  menu.type='button';menu.className='wo-menu-button';menu.id='woMobileMenu';
  menu.setAttribute('aria-label','Open all pages');menu.setAttribute('aria-controls','nav');
  menu.setAttribute('aria-expanded','false');
  menu.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>More</span>';
  bar.appendChild(menu);
  function toggle(open){
   const enabled=!!open&&matchMedia('(max-width:780px)').matches;
   document.body.classList.toggle('wo-nav-open',enabled);
   menu.setAttribute('aria-expanded',String(enabled));
   shade.setAttribute('aria-hidden',String(!enabled));
   if(enabled)close.focus();else if(document.activeElement===close)menu.focus();
  }
  menu.addEventListener('click',()=>toggle(!document.body.classList.contains('wo-nav-open')));
  close.addEventListener('click',()=>toggle(false));
  shade.addEventListener('click',()=>toggle(false));
  sidebar.addEventListener('click',e=>{if(e.target.closest('[data-page]'))toggle(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
  window.addEventListener('resize',()=>{if(innerWidth>780)toggle(false)},{passive:true});
  // Mobile bar keeps its original Today/Week/Classes/etc buttons.
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
