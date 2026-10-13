
(()=>{
'use strict';
const logoSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="woA" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#53d8ff"/><stop offset="1" stop-color="#1264ee"/></linearGradient><linearGradient id="woB" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d49cff"/><stop offset="1" stop-color="#6043e8"/></linearGradient><linearGradient id="woC" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffcd7d"/><stop offset="1" stop-color="#ed629b"/></linearGradient></defs><path d="M8 39 24 49 56 29 56 40 24 59 8 49Z" fill="url(#woA)"/><path d="M12 17q0-6 6-4l20 12q4 2 4 8v11L12 26Z" fill="url(#woA)"/><path d="M26 9q0-6 6-3l19 12q4 3 4 8v9L26 18Z" fill="url(#woB)"/><path d="M40 4q0-5 5-2l12 8q4 3 4 8v13L40 17Z" fill="url(#woC)"/><path d="M8 39q-4-4 0-8t8-1l22 13-14 9Z" fill="url(#woA)"/></svg>`;
function setLogo(){document.querySelectorAll('.brand .mark').forEach(el=>{if(el.dataset.woNewLogo)return;el.dataset.woNewLogo='1';el.innerHTML=logoSvg});let icon=document.querySelector('link[rel="icon"]');if(!icon){icon=document.createElement('link');icon.rel='icon';document.head.append(icon)}icon.href='data:image/svg+xml,'+encodeURIComponent(logoSvg.replace(' aria-hidden="true"',''));}
setLogo();
// The dashboard is a projection of the canonical stored collections, never a separate cache.
const coreRenderQuick=window.renderQuick;
window.renderQuick=function(){coreRenderQuick();const s=window.WeekOSVerification?.state();if(!s)return;
const day=todayISO(),weekday=iranNow().getDay();
const cls=(s.classes||[]).filter(c=>Number(c.day)===weekday).sort((a,b)=>Number(a.start)-Number(b.start));
const clsBox=document.getElementById('quickClasses');
if(clsBox){clsBox.innerHTML=cls.length?cls.map(c=>{const co=(s.courses||[]).find(x=>x.id===c.courseId)||{};return `<div class="classrow" data-wo-class="${esc(c.id)}"><i class="dot" style="background:var(--accent)"></i><div><strong>${esc(co.name||c.title||'Unnamed class')}</strong><small>${fmtHour(c.start)}–${fmtHour(c.end)} · ${esc(c.room||co.room||'')}</small></div></div>`}).join(''):'<div class="empty" style="padding:16px">No university classes scheduled today.</div>';clsBox.querySelectorAll('[data-wo-class]').forEach(el=>el.addEventListener('click',()=>openClass(el.dataset.woClass)));}
// Today's Tasks includes dated activities, in addition to tasks and recurring classes.
const taskBox=document.getElementById('quickTasks');if(!taskBox)return;
const activities=(s.activities||[]).filter(a=>a.date===day);
activities.forEach(a=>{const row=document.createElement('div');row.className='woTodayItem';const status=a.status==='completed'?'Completed':a.status==='not_completed'?'Not completed':'Unmarked';row.innerHTML=`<div><strong><span class="woKind">ACTIVITY</span>${esc(a.title||'Activity')}</strong><small>${esc(a.start||a.time||'')} · ${status}</small></div><div class="woStatusButtons"><button type="button" data-choice="completed" aria-label="Complete activity">✓</button><button type="button" data-choice="not_completed" aria-label="Mark activity not completed">✕</button><button type="button" data-choice="pending" aria-label="Clear activity status">–</button></div>`;row.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{a.status=b.dataset.choice;save()});taskBox.append(row)});
};
// Save once, render every dependent projection once; no forced reloads.
const priorSave=window.save;
window.save=function(){const result=priorSave();if(result===false)return false;try{window.renderQuick();if(typeof renderStatus==='function')renderStatus();if(typeof renderDashboardCounts==='function')renderDashboardCounts();}catch(err){console.error('Dashboard synchronization error',err);toast('Saved, but a dashboard view could not update');return false}return true};
// Limit wheel distance for coarse mouse wheels, while preserving precision touchpad deltas.
const calendar=document.querySelector('#today .calendar');
if(calendar){const findScroll=()=>[calendar,...calendar.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+60&&getComputedStyle(e).overflowY!=='hidden');
let scrollEl=findScroll();if(!scrollEl){calendar.style.maxHeight='min(70vh,720px)';calendar.style.overflowY='auto';scrollEl=calendar;}scrollEl.classList.add('wo-scroll-viewport');
scrollEl.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;const max=scrollEl.scrollHeight-scrollEl.clientHeight;if(max<=0)return;let delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?scrollEl.clientHeight:1);if(Math.abs(delta)<16)return;const limited=Math.sign(delta)*Math.min(Math.abs(delta)*.42,72);const atTop=scrollEl.scrollTop<=0&&limited<0,atBottom=scrollEl.scrollTop>=max-1&&limited>0;if(atTop||atBottom)return;e.preventDefault();scrollEl.scrollTop+=limited;},{passive:false});}
})();
