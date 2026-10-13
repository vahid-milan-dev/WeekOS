
(function(){
const icons={
 tasks:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
 activities:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
 deadlines:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/><circle cx="16" cy="15" r="2"/></svg>',
 progress:'<svg viewBox="0 0 24 24"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg>'
};
function replaceDashboardIcons(){
 const cards=[...document.querySelectorAll('.statcard,.statCard,.metric,.metricCard')];
 const map=[['task','tasks'],['activit','activities'],['deadline','deadlines'],['progress','progress']];
 cards.forEach(c=>{let t=(c.textContent||'').toLowerCase(),type=map.find(x=>t.includes(x[0]))?.[1];if(!type)return;let h=c.querySelector('.statIcon,.cardIcon,.metricIcon,.icon');if(!h){h=document.createElement('span');h.className='dashboardStatIcon';c.prepend(h)}h.innerHTML=icons[type]});
 let w=document.querySelector('.weekcard');if(w){let h=w.querySelector('.weekIcon')||w.querySelector('.dashboardStatIcon');if(!h){h=document.createElement('span');h.className='dashboardStatIcon';w.prepend(h)}h.innerHTML=icons.progress}
}
function zone(){return window.WeekOSDate?.timezone?.()||window.weekosTimeZone?.()||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}
function now(){let a=new Intl.DateTimeFormat('en-CA',{timeZone:zone(),year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return Object.fromEntries(a.map(x=>[x.type,x.value]))}
function dk(d){return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`}
function items(k){let a=[];[['tasks','Task'],['activities','Activity'],['study','Study'],['deadlines','Deadline'],['classes','Class']].forEach(([n,t])=>(state?.[n]||[]).forEach(x=>{if(String(x.date||x.due||'').slice(0,10)===k)a.push({...x,_type:t})}));return a}
function cells(y,m){let f=new Date(Date.UTC(y,m,1)),s=new Date(f);s.setUTCDate(1-((f.getUTCDay()+6)%7));return Array.from({length:42},(_,i)=>{let d=new Date(s);d.setUTCDate(s.getUTCDate()+i);return d})}
function pageEl(){let p=document.getElementById('page-calendar');if(!p){p=document.createElement('section');p.id='page-calendar';p.className='page';(document.querySelector('main')||document.querySelector('.content')||document.body).appendChild(p)}return p}
function draw(){
 let p=pageEl(),n=now(),today=`${n.year}-${n.month}-${n.day}`,y=+(p.dataset.year||n.year),sel=p.dataset.selected||today;
 let months=Array.from({length:12},(_,m)=>new Intl.DateTimeFormat('en-US',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(y,m,1))));
 p.innerHTML=`<div class="pagehead"><div><h1>Calendar</h1><p>View and navigate through your calendar by month and year.</p></div></div><div class="calendarPageNative"><div class="calendarPageTop"><button class="yp calendarIconButton" aria-label="Previous year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg></button><h2>${y}</h2><button class="yn calendarIconButton" aria-label="Next year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg></button></div><div class="yearMonths">${months.map((nm,m)=>{let cs=cells(y,m),total=cs.filter(d=>d.getUTCMonth()===m).reduce((z,d)=>z+items(dk(d)).length,0);return `<article class="yearMonth ${y==+n.year&&m==+n.month-1?'current':''}"><h3>${nm} ${y}</h3><div class="miniWeek">${['M','T','W','T','F','S','S'].map(x=>`<span>${x}</span>`).join('')}</div><div class="miniDays">${cs.map(d=>{let k=dk(d),ct=items(k).length;return `<button data-date="${k}" class="${d.getUTCMonth()!==m?'out ':''}${k===today?'today ':''}${k===sel?'selected ':''}${ct?'hasEvents':''}">${d.getUTCDate()}</button>`}).join('')}</div><div class="monthEventTotal">${total?total+' event'+(total===1?'':'s'):'No events'}</div></article>`}).join('')}</div><div class="calendarPageActions"><button class="calendarPageToday"><svg class="calendarNavIcon calendarTodayIcon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><circle cx="12" cy="15" r="2"/></svg><span>Today</span></button></div><div class="selectedDayPanel"></div></div>`;
 p.querySelector('.yp').onclick=()=>{p.dataset.year=y-1;draw()};p.querySelector('.yn').onclick=()=>{p.dataset.year=y+1;draw()};p.querySelector('.calendarPageToday').onclick=()=>{p.dataset.year=n.year;p.dataset.selected=today;draw()};
 p.querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{p.dataset.selected=b.dataset.date;draw()});
 let its=items(sel),title=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(sel+'T00:00:00Z')),panel=p.querySelector('.selectedDayPanel');
 panel.innerHTML=`<h3>${title}${sel===today?' · Today':''}</h3>`+(its.length?its.map(x=>`<div class="selectedEvent"><b>${x.title||x.name||'Untitled'}</b><span>${x.start||x.time||''}${x.end?' – '+x.end:''}</span><span>${x._type}</span></div>`).join(''):'<div class="selectedEmpty">No events scheduled for this day.</div>')
}
function openCalendar(){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));let p=pageEl();p.classList.add('active');try{page='calendar'}catch(e){};document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page==='calendar'));draw()}
document.addEventListener('click',e=>{if(e.target.closest('[data-page="calendar"]')){e.preventDefault();e.stopImmediatePropagation();openCalendar()}},true);
const oldRA=window.renderAll;if(oldRA)window.renderAll=function(){let r=oldRA.apply(this,arguments);setTimeout(()=>{replaceDashboardIcons();if(typeof page!=='undefined'&&page==='calendar')draw()},0);return r};
setTimeout(()=>{replaceDashboardIcons();if(typeof page!=='undefined'&&page==='calendar')openCalendar()},0);
window.openWeekOSCalendar=openCalendar;
})();
