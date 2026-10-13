
(function(){
'use strict';
// Symbol is a pair of interlocking orbital paths and a small focus point; no letters.
const mark=document.querySelector('.mark');if(mark)mark.innerHTML='<svg viewBox="0 0 40 40" aria-label="WeekOS orbital emblem" role="img"><defs><linearGradient id="woOrbit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#76d8ff"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs><path d="M20 3 34 11 34 28 20 37 6 28 6 11Z" fill="none" stroke="url(#woOrbit)" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 23C17 8 29 9 31 15S24 32 11 28" fill="none" stroke="url(#woOrbit)" stroke-width="3" stroke-linecap="round"/><circle cx="23" cy="19" r="4" fill="var(--accent)"/><circle cx="31" cy="15" r="2" fill="#c5f5ff"/></svg>';
// Remove any legacy music navigation/player if a previous build injected it.
document.querySelectorAll('[data-page="music"],[data-wo*="music"],#woPlayer,.woPlayerUI').forEach(el=>el.remove());
const originalRender=renderCalendar;
renderCalendar=function(){originalRender();const grid=document.querySelector('#calendarGrid');if(!grid)return;
// A stable full-day canvas: all elements share the same 50px/hour scale.
grid.style.height='1200px';grid.style.minHeight='1200px';
grid.querySelectorAll('.hline,.tlabel').forEach(el=>el.remove());
for(let hour=0;hour<=24;hour++){const line=document.createElement('div');line.className='hline';line.style.top=(hour*50)+'px';grid.appendChild(line);const label=document.createElement('div');label.className='tlabel';label.style.top=(hour*50)+'px';label.textContent=String(hour).padStart(2,'0')+':00';grid.appendChild(label)}
const ds=weekDates(),cols=ds.length;
grid.querySelectorAll('.event').forEach(el=>{const event=occurrences().find(x=>x.kind===el.dataset.kind&&x.id===el.dataset.id);if(event){el.style.top=(event.start*50+3)+'px';el.style.height=Math.max(22,(event.end-event.start)*50-6)+'px'}});
grid.querySelectorAll('.lunch,.woMeal').forEach(el=>el.remove());
(state.meals||[]).forEach(meal=>{const a=parseTime(meal.start),b=parseTime(meal.end);if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a||!['Breakfast','Lunch','Dinner'].includes(meal.title)||meal.enabled===false)return;ds.forEach((d,i)=>{if(!(meal.days||[]).includes(d.getDay()))return;const el=document.createElement('div');el.className='woMeal';el.style.left=`calc(50px + (100% - 50px)*${i}/${cols} + 3px)`;el.style.right='auto';el.style.width=`calc((100% - 50px)/${cols} - 6px)`;el.style.top=(a*50+2)+'px';el.style.height=Math.max(18,(b-a)*50-4)+'px';el.textContent=meal.title+' · '+meal.start+'–'+meal.end;grid.appendChild(el)})});
updateNow();};
function updateNow(){const grid=document.querySelector('#calendarGrid');if(!grid)return;grid.querySelectorAll('.nowline,.woNow').forEach(x=>x.remove());if(weekOffset!==0)return;const ds=weekDates(),now=new Date(),tz=window.WeekOSDate?.timezone?.()||Intl.DateTimeFormat().resolvedOptions().timeZone;const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));if(!ds.some(d=>iso(d)===`${parts.year}-${parts.month}-${parts.day}`))return;const h=+parts.hour+(+parts.minute)/60+(+parts.second)/3600;const el=document.createElement('div');el.className='woNow';el.style.cssText=`position:absolute;left:50px;right:0;top:${h*50}px;border-top:2px solid var(--accent)`;grid.appendChild(el)}
setInterval(updateNow,1000);
// Clicking a blank cell starts an activity with the selected day and time.
document.querySelector('#calendarGrid')?.addEventListener('click',function(e){if(e.target.closest('.event,.woMeal,.tlabel'))return;const rect=this.getBoundingClientRect();const x=e.clientX-rect.left,y=e.clientY-rect.top;if(x<50||y<0||y>1200)return;const ds=weekDates();const i=Math.min(ds.length-1,Math.max(0,Math.floor((x-50)/(rect.width-50)*ds.length)));const minutes=Math.min(1439,Math.max(0,Math.floor(y/50*60/15)*15));const start=String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');openForm('activity');const form=document.querySelector('#formGrid');if(!form)return;const date=form.querySelector('[name="date"]'),time=form.querySelector('[name="start"]'),end=form.querySelector('[name="end"]');if(date)date.value=iso(ds[i]);if(time)time.value=start;if(end)end.value=String(Math.min(23,Math.floor((minutes+60)/60))).padStart(2,'0')+':'+String((minutes+60)%60).padStart(2,'0');});
// Meal selection and upsert are handled in the canonical mealForm above.
const oldSave=save;save=function(){oldSave();try{renderCalendar();if(page==='meals')renderCustom('meals')}catch(err){console.error('Meal schedule synchronization failed',err)}};
// Custom themes cannot be overridden by the base Light/Dark selector.
document.addEventListener('change',e=>{const target=e.target;if(!target.matches('select'))return;const val=String(target.value).toLowerCase();if(val!=='light'&&val!=='dark')return;const theme=state.settings.woTheme||'dark';if(theme==='dark')return;const selected=target.closest('.settingsrow,.field');if(!selected||!/theme|appearance|mode/i.test(selected.textContent))return;target.value=state.settings.theme||'dark';toast('You are currently using a custom theme. To switch between Light and Dark mode, please select the Original WeekOS theme first.');},true);
renderCalendar();
})();
