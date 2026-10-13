
(function(){
'use strict';
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
function effectiveTZ(){try{return window.weekosTimeZone?window.weekosTimeZone():(state?.settings?.timeZone&&state.settings.timeZone!=='auto'?state.settings.timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone)}catch(e){return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}}
function partsNow(){const a=new Intl.DateTimeFormat('en-CA',{timeZone:effectiveTZ(),year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());return Object.fromEntries(a.map(x=>[x.type,x.value]))}
function keyNow(){const p=partsNow();return `${p.year}-${p.month}-${p.day}`}
function parseKey(k){const [y,m,d]=String(k).split('-').map(Number);return new Date(Date.UTC(y,m-1,d))}
function key(d){return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`}
function monday(d){const x=new Date(d),n=(x.getUTCDay()+6)%7;x.setUTCDate(x.getUTCDate()-n);return x}
function weekDiff(a,b){return Math.round((monday(parseKey(a))-monday(parseKey(b)))/604800000)}
function isoWeek(k){const d=parseKey(k);d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()+3-((d.getUTCDay()+6)%7));const w1=new Date(Date.UTC(d.getUTCFullYear(),0,4));return 1+Math.round(((d-w1)/86400000-3+((w1.getUTCDay()+6)%7))/7)}
function monthCells(y,m){const first=new Date(Date.UTC(y,m,1)),start=monday(first);return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setUTCDate(start.getUTCDate()+i);return d})}
function eventCount(k){
 let n=0;['tasks','activities','study','deadlines'].forEach(type=>(state?.[type]||[]).forEach(x=>{if((x.date||x.due||'').slice(0,10)===k)n++}));
 (state?.classes||[]).forEach(x=>{if((x.date||'').slice(0,10)===k)n++}); return n
}
const now=partsNow();let browseYear=+now.year,browseMonth=+now.month-1;
function mount(){
 const side=document.querySelector('.sidebar'); if(!side||side.querySelector('.calendarExplorer'))return;
 const host=document.createElement('div');host.className='calendarExplorer';
 const collapsed=localStorage.getItem('weekos-calendar-collapsed')==='1';
 host.innerHTML=`<button class="calExplorerHead"><span>Calendar</span><span class="chev">${collapsed?'▸':'▾'}</span></button><div class="calExplorerBody${collapsed?' collapsed':''}"><div class="calYearRow"><button class="prevY" aria-label="Previous year">‹</button><div class="calYear"></div><button class="nextY" aria-label="Next year">›</button></div><div class="calMonths"></div><button class="calTodayBtn">Today</button></div>`;
 const bottom=side.querySelector('.sidebarBottom'); side.insertBefore(host,bottom||null);
 host.querySelector('.calExplorerHead').onclick=()=>{const b=host.querySelector('.calExplorerBody');b.classList.toggle('collapsed');host.querySelector('.chev').textContent=b.classList.contains('collapsed')?'▸':'▾';localStorage.setItem('weekos-calendar-collapsed',b.classList.contains('collapsed')?'1':'0')};
 host.querySelector('.prevY').onclick=()=>{browseYear--;paint()};
 host.querySelector('.nextY').onclick=()=>{browseYear++;paint()};
 host.querySelector('.calTodayBtn').onclick=()=>{const p=partsNow();browseYear=+p.year;browseMonth=+p.month-1;goDate(keyNow());paint()};
 paint();
}
function paint(){
 const host=document.querySelector('.calendarExplorer');if(!host)return;
 host.querySelector('.calYear').textContent=browseYear;
 const p=partsNow(),currentY=+p.year,currentM=+p.month-1;
 host.querySelector('.calMonths').innerHTML=MONTHS.map((x,i)=>`<button class="calMonth${browseYear===currentY&&i===currentM?' current':''}${browseYear===browseYear&&i===browseMonth?' selected':''}" data-m="${i}">${x}</button>`).join('');
 host.querySelectorAll('.calMonth').forEach(b=>b.onclick=()=>{browseMonth=+b.dataset.m;paint();openMonth(browseYear,browseMonth)});
}
function ensureOverlay(){
 let o=document.querySelector('.monthOverlay');if(o)return o;
 o=document.createElement('div');o.className='monthOverlay';o.innerHTML=`<div class="monthDialog" role="dialog" aria-modal="true"><div class="monthTop"><button class="mprev">‹</button><h3></h3><button class="mnext">›</button><button class="mclose">Close</button></div><div class="monthGrid"></div></div>`;
 document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')});o.querySelector('.mclose').onclick=()=>o.classList.remove('open');
 o.querySelector('.mprev').onclick=()=>{browseMonth--;if(browseMonth<0){browseMonth=11;browseYear--}paint();openMonth(browseYear,browseMonth)};
 o.querySelector('.mnext').onclick=()=>{browseMonth++;if(browseMonth>11){browseMonth=0;browseYear++}paint();openMonth(browseYear,browseMonth)};
 return o
}
function openMonth(y,m){
 const o=ensureOverlay(),g=o.querySelector('.monthGrid'),today=keyNow();o.querySelector('h3').textContent=`${MONTH_NAMES[m]} ${y}`;
 const selected=(typeof selectedDate!=='undefined'&&selectedDate)||today;
 g.innerHTML=DOW.map(x=>`<div class="monthDow">${x}</div>`).join('')+monthCells(y,m).map(d=>{const k=key(d),n=eventCount(k);return `<button class="monthDay${d.getUTCMonth()!==m?' other':''}${k===today?' today':''}${k===selected?' selected':''}" data-date="${k}"><span>${d.getUTCDate()}</span>${n?`<span class="count">${n} item${n===1?'':'s'}</span>`:''}</button>`}).join('');
 g.querySelectorAll('.monthDay').forEach(b=>b.onclick=()=>{o.classList.remove('open');goDate(b.dataset.date)});
 o.classList.add('open')
}
function goDate(k){
 const today=keyNow();try{if(typeof selectedDate!=='undefined')selectedDate=k}catch(e){}
 try{if(typeof selectedDateISO!=='undefined')selectedDateISO=k}catch(e){}
 if(typeof weekOffset!=='undefined')weekOffset=weekDiff(k,today);
 try{page='today'}catch(e){};document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.querySelector('#page-today')?.classList.add('active');
 document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page==='today'));
 try{renderAll()}catch(e){try{renderCalendar();renderHeader()}catch(_){}}
}
window.WeekOSDate={
 timezone:effectiveTZ,today:keyNow,parse:parseKey,key,isoWeek,monthCells,weekDiff,
 openMonth:(y,m)=>{browseYear=y;browseMonth=m;paint();openMonth(y,m)},goDate
};
window.currentDate=keyNow;
const oldHeader=window.renderHeader;if(oldHeader)window.renderHeader=function(){oldHeader();mount();paint()};
setTimeout(()=>{mount();paint()},0);
let last=keyNow();setInterval(()=>{const n=keyNow();if(n!==last){last=n;paint();try{renderAll()}catch(e){}}},30000);
})();
