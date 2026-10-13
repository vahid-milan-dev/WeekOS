
(function(){
function ensurePage(){
 let p=document.getElementById('page-calendar');
 if(!p){p=document.createElement('section');p.id='page-calendar';p.className='page';(document.querySelector('main')||document.querySelector('.content')||document.body).appendChild(p)}
 return p
}
function tz(){return window.WeekOSDate?.timezone?.()||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}
function nowParts(){let a=new Intl.DateTimeFormat('en-CA',{timeZone:tz(),year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return Object.fromEntries(a.map(x=>[x.type,x.value]))}
function key(d){return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`}
function allItemsFor(k){
 let a=[];[['tasks','Task'],['activities','Activity'],['study','Study'],['deadlines','Deadline'],['classes','Class']].forEach(([n,t])=>(state?.[n]||[]).forEach(x=>{if(String(x.date||x.due||'').slice(0,10)===k)a.push({...x,_type:t})}));return a
}
function monthCells(y,m){let f=new Date(Date.UTC(y,m,1)),s=new Date(f),n=(f.getUTCDay()+6)%7;s.setUTCDate(1-n);return Array.from({length:42},(_,i)=>{let d=new Date(s);d.setUTCDate(s.getUTCDate()+i);return d})}
function renderCalendarPage(){
 let p=ensurePage(),np=nowParts(),today=`${np.year}-${np.month}-${np.day}`,year=+(p.dataset.year||np.year),selected=p.dataset.selected||today;
 const names=Array.from({length:12},(_,m)=>new Intl.DateTimeFormat('en',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,m,1))));
 p.innerHTML=`<div class="pagehead"><div><h1>Calendar</h1><p>View and navigate through your calendar by month and year.</p></div></div>
 <div class="calendarPageNative"><div class="calendarPageTop"><button class="cyPrev calendarIconButton" aria-label="Previous year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg></button><h2>${year}</h2><button class="cyNext calendarIconButton" aria-label="Next year"><svg class="calendarNavIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg></button></div>
 <div class="yearMonths">${names.map((name,m)=>{let cells=monthCells(year,m),total=cells.filter(d=>d.getUTCMonth()===m).reduce((n,d)=>n+allItemsFor(key(d)).length,0);return `<article class="yearMonth ${year==+np.year&&m==+np.month-1?'current':''}" data-month="${m}"><h3>${name} ${year}</h3><div class="miniWeek">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=>`<span>${x[0]}</span>`).join('')}</div><div class="miniDays">${cells.map(d=>{let k=key(d),count=allItemsFor(k).length;return `<button type="button" data-date="${k}" class="${d.getUTCMonth()!==m?'out ':''}${k===today?'today ':''}${k===selected?'selected':''}" title="${count?count+' events':'No events'}">${d.getUTCDate()}${count?'<i></i>':''}</button>`}).join('')}</div><div class="monthEventTotal">${total?total+' event'+(total===1?'':'s'):'No events'}</div></article>`}).join('')}</div>
 <div class="calendarPageActions"><button class="calendarPageToday"><svg class="calendarNavIcon calendarTodayIcon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><circle cx="12" cy="15" r="2"/></svg><span>Today</span></button></div><div class="selectedDayPanel"></div></div>`;
 p.querySelector('.cyPrev').onclick=()=>{p.dataset.year=year-1;renderCalendarPage()};p.querySelector('.cyNext').onclick=()=>{p.dataset.year=year+1;renderCalendarPage()};
 p.querySelector('.calendarPageToday').onclick=()=>{p.dataset.year=np.year;p.dataset.selected=today;renderCalendarPage()};
 p.querySelectorAll('[data-date]').forEach(b=>b.onclick=e=>{e.stopPropagation();p.dataset.selected=b.dataset.date;renderCalendarPage()});
 let items=allItemsFor(selected),panel=p.querySelector('.selectedDayPanel'),dt=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(selected+'T00:00:00Z'));
 panel.innerHTML=`<h3>${dt}${selected===today?' · Today':''}</h3>`+(items.length?items.map(x=>`<div class="selectedEvent"><b>${x.title||x.name||'Untitled'}</b><span>${x.start||x.time||''}${x.end?' – '+x.end:''}</span><span>${x._type}</span></div>`).join(''):`<div class="selectedEmpty">No events scheduled for this day.</div>`);
}
window.renderCalendarPage=renderCalendarPage;
function activate(){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));let p=ensurePage();p.classList.add('active');
 try{page='calendar'}catch(e){};document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page==='calendar'));renderCalendarPage()
}
document.addEventListener('click',e=>{let a=e.target.closest('[data-page="calendar"]');if(a){e.preventDefault();e.stopImmediatePropagation();activate()}},true);
setTimeout(()=>{document.querySelectorAll('[data-page="calendar"]').forEach(x=>x.onclick=activate);if((typeof page!=='undefined'&&page==='calendar'))activate()},0);
})();
