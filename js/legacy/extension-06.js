
(()=>{
/* One source of truth for civil calendar dates. Date-only keys never pass through local time or toISOString(). */
const TEHRAN_TZ='Asia/Tehran';
const tehranPartsNow=()=>Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TEHRAN_TZ,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(new Date()).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
const currentDate=()=>{const p=tehranPartsNow();return `${p.year}-${p.month}-${p.day}`};
const parseCivil=key=>{const [y,m,d]=key.split('-').map(Number);return new Date(Date.UTC(y,m-1,d))};
const civilKey=d=>`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
const civilText=(d,o)=>new Intl.DateTimeFormat('en-US',{...o,timeZone:'UTC'}).format(d);
const currentCivil=()=>parseCivil(currentDate());
function visibleCivilWeek(){const base=currentCivil(),dow=base.getUTCDay(),startDow=(state.settings.showWeekends&&state.settings.firstDay==='sunday')?0:1,diff=(dow-startDow+7)%7,start=new Date(base);start.setUTCDate(base.getUTCDate()-diff+weekOffset*7);const n=state.settings.showWeekends?7:5;return Array.from({length:n},(_,i)=>{const d=new Date(start);d.setUTCDate(start.getUTCDate()+i);return d})}
/* Selection is separate from Today. */
let selectedDate=currentDate();
const previousShow=showPage;
showPage=function(name){if(name==='today'){weekOffset=0;selectedDate=currentDate()}previousShow(name)};
renderCalendar=function(){
 ensurePolishState();const dates=visibleCivilWeek(),today=currentDate(),cols=dates.length,ch=$('#calHead');
 ch.style.gridTemplateColumns=`50px repeat(${cols},1fr)`;
 ch.innerHTML='<div class="corner"></div>'+dates.map(d=>{const key=civilKey(d),isToday=key===today,isSelected=key===selectedDate;return `<div class="day${isToday?' today':''}${isSelected?' selected':''}" data-date="${key}" data-today="${isToday?'true':'false'}" aria-current="${isToday?'date':'false'}"><span>${civilText(d,{weekday:'short'})}<br><small>${civilText(d,{month:'short',day:'numeric'})}</small></span></div>`}).join('');
 ch.querySelectorAll('.day').forEach(el=>el.onclick=()=>{selectedDate=el.dataset.date;renderCalendar()});
 const g=$('#calendarGrid'),start=+state.settings.calendarStart||9,end0=+state.settings.calendarEnd||18,end=end0<=start?start+9:end0,H=Math.max(state.settings.density==='compact'?396:450,(end-start)*(state.settings.density==='compact'?44:50)),pos=t=>(t-start)/(end-start)*H;g.style.height=H+'px';let html='';
 for(let h=Math.ceil(start);h<=Math.floor(end);h++){const y=pos(h);html+=`<div class="hline" style="top:${y}px"></div><div class="tlabel" style="top:${y}px">${fmtHour(h)}</div>`}
 for(let i=1;i<cols;i++)html+=`<div class="vline" style="left:calc(50px + (100% - 50px)*${i}/${cols})"></div>`;
 if(state.settings.showLunch&&13>=start&&14<=end)html+=`<div class="lunch" style="top:${pos(13)}px;height:${pos(14)-pos(13)}px">Lunch Break · ${fmtHour(13)} - ${fmtHour(14)}</div>`;
 const dayIndex=new Map(dates.map((d,i)=>[d.getUTCDay(),i])),todayDow=currentCivil().getUTCDay();
 let ev=occurrences().filter(e=>calFilter==='all'||(calFilter==='university'&&e.kind==='class')||(calFilter==='personal'&&e.kind!=='class')).filter(e=>state.settings.showUniversity||e.kind!=='class').filter(e=>state.settings.showPersonal||e.kind==='class').filter(e=>dayIndex.has(e.day)).filter(e=>e.end>start&&e.start<end);
 ev.forEach(e=>{const col=dayIndex.get(e.day),top=pos(Math.max(e.start,start))+3,h=Math.max(26,pos(Math.min(e.end,end))-pos(Math.max(e.start,start))-6),left=`calc(50px + (100% - 50px)*${col}/${cols} + 4px)`,w=`calc((100% - 50px)/${cols} - 8px)`,secondary=(page==='today'&&state.settings.focusToday&&e.day!==todayDow)?' secondary':'';html+=`<div class="event ${esc(e.color)}${secondary}" data-kind="${e.kind}" data-id="${esc(e.id)}" style="top:${top}px;height:${h}px;left:${left};width:${w}"><strong>${esc(e.title)}</strong><span>${fmtHour(e.start)} - ${fmtHour(e.end)}</span><span>${esc(e.sub)}</span><span>${esc(e.room)}</span><span class="pill">${e.kind==='class'?'University':e.kind[0].toUpperCase()+e.kind.slice(1)}</span></div>`});
 const ip=iranParts(),now=+ip.hour+(+ip.minute)/60;if(now>=start&&now<=end)html+=`<div class="nowline" style="top:${pos(now)}px"></div>`;g.innerHTML=html;g.querySelectorAll('.event').forEach(e=>e.onclick=()=>openEntity(e.dataset.kind,e.dataset.id));
};
/* Complete 13-step real-DOM tutorial. */
const TOUR_KEY_FINAL=KEY+'-tutorialCompleted';
const tour=[
 {title:'Welcome to WeekOS',text:'WeekOS brings your schedule, tasks, study, deadlines, and weekly progress into one workspace.'},
 {sel:'[data-page="today"]',page:'today',title:'Today',text:"Today focuses on the actual current Tehran date, today's schedule, tasks, and what comes next."},
 {sel:'[data-page="week"]',page:'week',title:'Week',text:'Week gives you the weekly overview and lets you move between independent weeks.'},
 {sel:'[data-page="tasks"]',page:'tasks',title:'Tasks',text:'Create, schedule, edit, complete, and organize the work you need to finish.'},
 {sel:'[data-page="activities"]',page:'activities',title:'Activities',text:'Plan personal activities and recurring events alongside your academic schedule.'},
 {sel:'[data-page="study"]',page:'study',title:'Study',text:'Plan study sessions and keep track of focused study time.'},
 {sel:'[data-page="deadlines"]',page:'deadlines',title:'Deadlines',text:'Track upcoming, overdue, and completed deadlines.'},
 {sel:'#calendarGrid',page:'today',title:"Calendar / Today's Schedule",text:'Events are positioned by their real day, start time, end time, and duration.'},
 {sel:'#globalSearch',page:'today',title:'Search',text:'Use global search to find courses, classes, tasks, activities, study sessions, deadlines, and notes.'},
 {sel:'[data-add]',page:'tasks',title:'Add / Create',text:'Use the Add action on each section to create new WeekOS items.'},
 {sel:'#profileQuick',page:'today',title:'Profile',text:'Open your profile to manage your identity, avatar, theme shortcuts, and Settings access.'},
 {sel:'.settingGroup',page:'settings',title:'Settings',text:'Customize theme, time, calendar behavior, density, accent color, reminders, data, and help.'},
 {sel:'[data-page="history"]',page:'history',title:'History & Review',text:'History preserves previous weeks, while Review summarizes your activity and progress.'}
];
let ti=0,ov=null;
function ensureTour(){if(ov)return;ov=document.createElement('div');ov.className='tourOverlay';ov.innerHTML='<div class="tourDim"></div><div class="tourSpot"></div><div class="tourCard"><h3></h3><p></p><div class="tourMeta"><small class="tourCount"></small><div class="tourTrack"><i></i></div></div><div class="tourActions"><button class="btn skip">Skip Tutorial</button><button class="btn back">Back</button><button class="btn primary next">Next</button></div></div>';document.body.appendChild(ov);ov.querySelector('.skip').onclick=finish;ov.querySelector('.back').onclick=()=>{if(ti){ti--;paint()}};ov.querySelector('.next').onclick=()=>ti===tour.length-1?finish():(ti++,paint());addEventListener('resize',()=>ov.classList.contains('show')&&paint(true));addEventListener('scroll',()=>ov.classList.contains('show')&&paint(true),true)}
function finish(){localStorage.setItem(TOUR_KEY_FINAL,'true');ov?.classList.remove('show');document.querySelectorAll('.tourTarget').forEach(x=>x.classList.remove('tourTarget'))}
function paint(reposition=false){ensureTour();const st=tour[ti];if(st.page&&page!==st.page)showPage(st.page);requestAnimationFrame(()=>{document.querySelectorAll('.tourTarget').forEach(x=>x.classList.remove('tourTarget'));const el=st.sel?document.querySelector(st.sel):null,spot=ov.querySelector('.tourSpot'),card=ov.querySelector('.tourCard');ov.classList.toggle('tourWelcome',!el);ov.classList.add('show');if(el){el.classList.add('tourTarget');el.scrollIntoView({block:'nearest',inline:'nearest'});requestAnimationFrame(()=>{const r=el.getBoundingClientRect(),pad=7,cw=Math.min(360,innerWidth-28),ch=Math.min(card.offsetHeight||230,innerHeight-28);spot.style.left=Math.max(4,r.left-pad)+'px';spot.style.top=Math.max(4,r.top-pad)+'px';spot.style.width=Math.max(0,Math.min(innerWidth-Math.max(4,r.left-pad)-4,r.width+pad*2))+'px';spot.style.height=Math.max(0,Math.min(innerHeight-Math.max(4,r.top-pad)-4,r.height+pad*2))+'px';card.style.left=Math.max(14,Math.min(innerWidth-cw-14,r.left+r.width/2-cw/2))+'px';const below=r.bottom+14,above=r.top-ch-14;card.style.top=((below+ch<=innerHeight-14)?below:(above>=14?above:Math.max(14,(innerHeight-ch)/2)))+'px';card.style.transform='none'})}else{card.style.left='50%';card.style.top='50%';card.style.transform='translate(-50%,-50%)'}if(!reposition){card.querySelector('h3').textContent=st.title;card.querySelector('p').textContent=st.text;card.querySelector('.tourCount').textContent=`Step ${ti+1} of ${tour.length}`;card.querySelector('.tourTrack i').style.width=((ti+1)/tour.length*100)+'%';card.querySelector('.back').disabled=ti===0;card.querySelector('.next').textContent=ti===tour.length-1?'Finish':'Next'}})}
window.startWeekOSTour=()=>{ti=0;showPage('today');setTimeout(()=>paint(),30)};
function wireReplay(){const b=document.querySelector('#replayTutorial');if(!b)return;b.textContent='Replay Tutorial';b.onclick=()=>{localStorage.removeItem(TOUR_KEY_FINAL);window.startWeekOSTour()}}
const showWrapped=showPage;showPage=function(name){showWrapped(name);if(name==='settings')requestAnimationFrame(wireReplay)};if(page==='settings')wireReplay();
/* New-profile onboarding starts the same tutorial. Capture submit so it survives other handlers. */
const onboarding=document.querySelector('#onboardForm');if(onboarding)onboarding.addEventListener('submit',()=>{if(!localStorage.getItem(TOUR_KEY_FINAL))setTimeout(()=>window.startWeekOSTour(),220)},true);
/* Midnight in Tehran moves Today automatically. Selection only follows when the Today page is active. */
let lastCurrent=currentDate();setInterval(()=>{const next=currentDate();if(next!==lastCurrent){lastCurrent=next;if(page==='today'){weekOffset=0;selectedDate=next;renderAll()}else renderHeader()}},5000);
/* Small debug surface for deterministic rendered verification; no UI. */
window.__weekosDateState=()=>({currentDate:currentDate(),selectedDate,headers:[...document.querySelectorAll('#calHead .day')].map(x=>({date:x.dataset.date,today:x.dataset.today,classes:x.className}))});
})();
