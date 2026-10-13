/* WeekOS weekly metrics: one source of truth for scheduled task/activity occurrences.
   Classic script, compatible with file://; no network, modules or build tools. */
(function(global){
'use strict';
function localDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function weekday(date){return new Date(date+'T12:00:00').getDay()}
function isScheduled(item,date){
 if(!item||!item.id)return false;
 const start=item.date||item.startDate;
 const rule=String(item.recurrence||item.repeat||item.frequency||'none').toLowerCase();
 if(!rule||rule==='none'||rule==='once')return start===date;
 if(start&&date<start)return false;
 if(item.until&&date>item.until)return false;
 const days=item.days||item.weekdays;
 if(Array.isArray(days)&&days.length)return days.some(d=>Number(d)===weekday(date)||String(d).toLowerCase()===['sun','mon','tue','wed','thu','fri','sat'][weekday(date)]);
 if(rule==='daily'||rule==='everyday')return true;
 if(rule==='weekly')return !!start&&weekday(start)===weekday(date);
 if(rule==='monthly')return !!start&&start.slice(8,10)===date.slice(8,10);
 return start===date;
}
function occurrenceStatus(state,item,date){
 const rule=String(item.recurrence||item.repeat||item.frequency||'none').toLowerCase();
 if(rule!=='none'&&rule!=='once')return (state.taskOccurrences||{})[date+'|'+item.id]||'pending';
 return item.status||'pending';
}
function calculate(state,weekStart){
 const seen=new Set(),occurrences=[];
 for(let day=0;day<7;day++){
  const d=new Date(weekStart.getFullYear(),weekStart.getMonth(),weekStart.getDate()+day),date=localDate(d);
  for(const [kind,items] of [['task',state.tasks||[]],['activity',state.activities||[]]]){
   for(const item of items){
    if(!isScheduled(item,date))continue;
    const key=kind+'|'+item.id+'|'+date;if(seen.has(key))continue;seen.add(key);
    occurrences.push({kind,id:item.id,date,status:occurrenceStatus(state,item,date)});
   }
  }
 }
 const completed=occurrences.filter(x=>x.status==='completed').length,total=occurrences.length;
 return {completed,total,percentage:total?Math.round(completed/total*100):0,occurrences};
}
function refresh(){
 try{
  if(typeof state==='undefined'||typeof startOfWeek!=='function')return;
  const metric=calculate(state,startOfWeek());
  const percentage=metric.percentage+'%';
  const number=document.getElementById('weekProgress');if(number)number.textContent=percentage;
  const bar=document.getElementById('weekProgressBar');if(bar){bar.style.width=percentage;bar.setAttribute('aria-valuenow',String(metric.percentage));}
  document.querySelectorAll('.weekProgressLabel b').forEach(x=>x.textContent=percentage);
  global.WeekOSWeeklyProgress.last=metric;
 }catch(error){console.error('Weekly progress render failed',error)}
}
global.WeekOSWeeklyProgress={calculate,isScheduled,occurrenceStatus,refresh,last:null};
if(typeof renderProgress==='function')renderProgress=refresh;
if(typeof renderHeader==='function'){
 const originalHeader=renderHeader;
 renderHeader=function(){originalHeader();refresh()};
}
if(typeof renderAll==='function'){
 const originalAll=renderAll;
 renderAll=function(){const result=originalAll.apply(this,arguments);refresh();return result};
}
if(typeof save==='function'){
 const originalSave=save;
 global.save=function(){const result=originalSave.apply(this,arguments);if(result!==false)refresh();return result};
}
refresh();
})(window);
