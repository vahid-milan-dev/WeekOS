
(()=>{
/* Release pass: keep one English sidebar utility label and a compact, semantic week card. */
const bottom=document.querySelector('.sidebarBottom');
if(bottom){const label=bottom.querySelector('.bottomLabel');if(label)label.textContent='Overview';const row=bottom.querySelector('.weekcard .row');if(row){const old=row.querySelector('span');if(old){old.className='weekIcon';old.removeAttribute('style');old.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/><path d="M12 8v4l3 2"/></svg>'}}}
/* Upgrade the existing motivational card without adding a new dashboard section. */
const quote=document.querySelector('.quote');if(quote)quote.innerHTML='<span class="quoteIcon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.6 4.5L18 9l-4.4 1.5L12 15l-1.6-4.5L6 9l4.4-1.5z"/><path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg></span><strong>Small steps every day</strong><span>lead to big results.</span>';
/* Override header range with the exact civil week currently being viewed. */
const releaseHeader=renderHeader;renderHeader=function(){releaseHeader();if(typeof visibleCivilWeek==='function'){const ds=visibleCivilWeek(),a=ds[0],b=ds[ds.length-1];const f=d=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).format(d);const wn=document.querySelector('#weekNo'),wr=document.querySelector('#weekRange');if(wn)wn.textContent='Week '+getWeek(new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate())));if(wr)wr.textContent=f(a)+' – '+f(b)}};
/* Decorate the calendar grid using the SAME currentDate source of truth as the header. */
const releaseCalendar=renderCalendar;renderCalendar=function(){releaseCalendar();const g=document.querySelector('#calendarGrid');if(!g||typeof visibleCivilWeek!=='function'||typeof currentDate!=='function')return;const ds=visibleCivilWeek(),today=currentDate(),idx=ds.findIndex(d=>civilKey(d)===today);if(page==='today'&&state.settings.focusToday&&idx>=0){const shade=document.createElement('div');shade.className='todayColumn';shade.setAttribute('aria-hidden','true');shade.style.left=`calc(50px + (100% - 50px)*${idx}/${ds.length})`;shade.style.width=`calc((100% - 50px)/${ds.length})`;g.prepend(shade)}};
/* Repaint immediately so the release styles and civil-week range are visible. */
renderHeader();renderCalendar();
})();
