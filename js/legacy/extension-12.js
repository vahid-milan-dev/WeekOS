
(function(){
const SVG={
 tasks:'<svg class="dashSvg" viewBox="0 0 24 24"><path d="M9 11l2 2 4-4"/><path d="M5 4h14v16H5z"/><path d="M8 4V2m8 2V2"/></svg>',
 activities:'<svg class="dashSvg" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>',
 deadlines:'<svg class="dashSvg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>',
 progress:'<svg class="dashSvg" viewBox="0 0 24 24"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg>'
};
function icons(){
 const pairs=[[/✓/,'tasks'],[/activity/i,'activities'],[/deadline/i,'deadlines']];
 document.querySelectorAll('.statIcon,.cardIcon,.metricIcon,[class*="icon"]').forEach(el=>{if(el.querySelector('svg'))return;let t=(el.textContent||'').trim();for(const [rx,k] of pairs)if(rx.test(t)){el.innerHTML=SVG[k];break}});
 const wc=document.querySelector('.weekcard');if(wc&&!wc.querySelector('.dashSvg')){let i=document.createElement('span');i.innerHTML=SVG.progress;let row=wc.querySelector('.row');if(row)row.prepend(i)}
}
function pnow(){let tz=window.WeekOSDate?.timezone?.()||Intl.DateTimeFormat().resolvedOptions().timeZone;let a=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return Object.fromEntries(a.map(x=>[x.type,x.value]))}
function dateKey(d){return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`}
function mini(y,m){
 let f=new Date(Date.UTC(y,m,1)),start=new Date(f),shift=(f.getUTCDay()+6)%7;start.setUTCDate(1-shift);let today=window.WeekOSDate?.today?.()||'',sel=(typeof selectedDate!=='undefined'&&selectedDate)||today,s='';
 for(let i=0;i<42;i++){let d=new Date(start);d.setUTCDate(start.getUTCDate()+i);let k=dateKey(d);s+=`<span class="${d.getUTCMonth()!==m?'out ':''}${k===today?'today ':''}${k===sel?'selected':''}" data-date="${k}">${d.getUTCDate()}</span>`}return s
}
function calendarPage(){
 let page=document.querySelector('#page-calendar');if(!page){page=document.createElement('section');page.id='page-calendar';page.className='page';let main=document.querySelector('main')||document.querySelector('.content');if(main)main.appendChild(page)}
 if(!page)return;
 let n=pnow(),year=+(page.dataset.year||n.year),currentY=+n.year,currentM=+n.month-1;
 page.dataset.year=year;page.innerHTML=`<div class="pagehead"><div><h1>Calendar</h1><p>View and navigate through your calendar by month and year.</p></div></div><div class="calendarPageNative"><div class="calendarPageTop"><button data-y="-1" class="calendarIconButton" aria-label="Previous year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg></button><h2>${year}</h2><button data-y="1" class="calendarIconButton" aria-label="Next year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg></button></div><div class="yearMonths">${Array.from({length:12},(_,m)=>`<div class="yearMonth ${year===currentY&&m===currentM?'current':''}" data-month="${m}"><h3>${new Intl.DateTimeFormat('en',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,m,1)))}</h3><div class="miniWeek">${['M','T','W','T','F','S','S'].map(x=>`<span>${x}</span>`).join('')}</div><div class="miniDays">${mini(year,m)}</div></div>`).join('')}</div><div class="calendarPageActions"><button class="calendarPageToday"><svg class="calendarNavIcon calendarTodayIcon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><circle cx="12" cy="15" r="2"/></svg><span>Today</span></button></div></div>`;
 page.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{page.dataset.year=year+(+b.dataset.y);calendarPage()});
 page.querySelectorAll('.yearMonth').forEach(c=>c.onclick=e=>{let m=+c.dataset.month;if(e.target.dataset.date){window.WeekOSDate?.goDate?.(e.target.dataset.date)}else window.WeekOSDate?.openMonth?.(year,m)});
 page.querySelector('.calendarPageToday').onclick=()=>{let p=pnow();page.dataset.year=p.year;calendarPage();window.WeekOSDate?.goDate?.(`${p.year}-${p.month}-${p.day}`)}
}
const oldShow=window.showPage;if(oldShow)window.showPage=function(p,...a){let r=oldShow.call(this,p,...a);if(p==='calendar')setTimeout(calendarPage,0);setTimeout(icons,0);return r};
document.querySelectorAll('[data-page="calendar"]').forEach(x=>x.addEventListener('click',()=>setTimeout(calendarPage,0)));
setTimeout(()=>{calendarPage();icons()},0);
})();
