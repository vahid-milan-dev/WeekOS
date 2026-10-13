/* Today progress: projection of the same scheduled occurrences used by Today's Tasks.
   No network, imports, reloads, or separately persisted counters. */
(function(global){
'use strict';
function dateISO(){return typeof todayISO==='function'?todayISO():new Date().toLocaleDateString('en-CA')}
function scheduled(item,date){
 if(global.WeekOSDashboardStatus&&typeof global.WeekOSDashboardStatus.scheduled==='function')
  return global.WeekOSDashboardStatus.scheduled(item,date);
 if(global.WeekOSWeeklyProgress&&typeof global.WeekOSWeeklyProgress.isScheduled==='function')
  return global.WeekOSWeeklyProgress.isScheduled(item,date);
 return (item.date||item.startDate)===date;
}
function status(item,date,kind){
 if(global.WeekOSCompactToday&&typeof global.WeekOSCompactToday.statusFor==='function')
  return global.WeekOSCompactToday.statusFor(kind,item,date);
 const rule=String(item.recurrence||item.repeat||item.frequency||'none').toLowerCase();
 if(rule!=='none'&&rule!=='once')return (state.taskOccurrences||{})[date+'|'+item.id]||'pending';
 return item.status||'pending';
}
function metrics(s,date){
 const seen=new Set(),items=[];
 for(const [kind,collection] of [['task',s.tasks||[]],['activity',s.activities||[]]]){
  for(const item of collection){
   if(!item||!scheduled(item,date))continue;
   const key=kind+'|'+String(item.id??'')+'|'+date;
   if(seen.has(key))continue;
   seen.add(key);
   items.push({kind,item,status:status(item,date,kind)});
  }
 }
 const completed=items.filter(x=>x.status==='completed'||x.status===true).length;
 return {total:items.length,completed,percentage:items.length?Math.round(completed/items.length*100):0,items};
}
function durationMinutes(x){
 if(Number.isFinite(Number(x.actualMinutes)))return Math.max(0,Number(x.actualMinutes));
 if(Number.isFinite(Number(x.actualDuration)))return Math.max(0,Number(x.actualDuration));
 if(Number.isFinite(Number(x.duration))&&String(x.status).toLowerCase()==='completed')return Math.max(0,Number(x.duration));
 if(!x.start||!x.end)return 0;
 const toMinutes=t=>{const m=String(t).match(/^(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):NaN};
 const start=toMinutes(x.start),end=toMinutes(x.end);
 return Number.isFinite(start)&&Number.isFinite(end)?Math.max(0,end-start):0;
}
function studyMinutes(s,date){
 const seen=new Set();
 return (s.study||[]).reduce((sum,x,index)=>{
  if(!x||(x.date||x.day)!==date)return sum;
  const id=String(x.id??index);if(seen.has(id))return sum;seen.add(id);
  if(x.isBreak===true||x.type==='break'||x.kind==='break')return sum;
  const completed=x.status==='completed'||x.completed===true||x.status==='done';
  // Scheduled sessions do not become completed merely because their end time has passed.
  if(!completed)return sum;
  return sum+durationMinutes(x);
 },0);
}
function formatMinutes(value){const m=Math.round(value);return m>=60?(Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'')):m+'m'}
function ensure(){
 let pct=document.getElementById('dailyPct');
 if(pct)return pct;
 const stats=document.querySelector('.stats');
 if(!stats)return null;
 const card=stats.querySelector('.todayProgressStat')||stats.querySelectorAll('.stat')[2];
 if(!card)return null;
 card.classList.add('todayProgressStat');
 card.innerHTML='<div class="bigico" aria-hidden="true">◷</div><div style="min-width:0;flex:1"><label>TODAY\'S PROGRESS</label><b id="dailyPct">0% Complete</b><div class="progress"><i id="dailyBar" style="width:0%"></i></div><div class="progressMeta"><span id="dailyTasks">0 / 0 Tasks</span><span id="dailyStudy">0m Studied</span></div></div>';
 return document.getElementById('dailyPct');
}
function render(){
 try{
  if(typeof state==='undefined')return;
  const pct=ensure();if(!pct)return;
  const m=metrics(state,dateISO()),minutes=studyMinutes(state,dateISO());
  pct.textContent=m.percentage+'% Complete';
  const bar=document.getElementById('dailyBar');
  if(bar){bar.style.width=m.percentage+'%';bar.setAttribute('aria-valuenow',String(m.percentage));}
  const count=document.getElementById('dailyTasks');if(count)count.textContent=m.completed+' / '+m.total+' Tasks';
  const study=document.getElementById('dailyStudy');if(study)study.textContent=formatMinutes(minutes)+' Studied';
  global.WeekOSTodayProgress.last={...m,studyMinutes:minutes};
 }catch(err){console.error('Today progress update failed',err)}
}
global.WeekOSTodayProgress={metrics,studyMinutes,formatMinutes,render,last:null};
const previousSave=global.save;
if(typeof previousSave==='function')global.save=function(){const result=previousSave.apply(this,arguments);render();return result};
const previousQuick=global.renderQuick;
if(typeof previousQuick==='function')global.renderQuick=function(){const result=previousQuick.apply(this,arguments);render();return result};
const previousToday=global.renderToday;
if(typeof previousToday==='function')global.renderToday=function(){const result=previousToday.apply(this,arguments);render();return result};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});
else render();
})(window);
