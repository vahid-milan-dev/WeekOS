
(function(){
 const calendarPage=()=>document.getElementById('page-calendar');
 const previousShowPage=window.showPage;
 if(typeof previousShowPage==='function'){
   window.showPage=function(name){
     if(name==='calendar'){
       if(typeof window.openWeekOSCalendar==='function'){window.openWeekOSCalendar();return}
     }else{
       const cp=calendarPage();if(cp)cp.classList.remove('active');
     }
     return previousShowPage.apply(this,arguments);
   };
 }
 document.querySelectorAll('#nav [data-page]').forEach(btn=>{
   btn.onclick=function(){
     const name=this.dataset.page;
     if(name==='calendar'){window.openWeekOSCalendar?.()}
     else window.showPage?.(name);
   };
 });
 document.querySelectorAll('[data-mpage]').forEach(btn=>{btn.onclick=function(){window.showPage?.(this.dataset.mpage)}});
})();
