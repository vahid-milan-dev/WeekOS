/* Dashboard status projection: single canonical source for tasks, activities and classes. */
(function(){
'use strict';
function scheduled(item,date){
 if(item.date===date)return true;
 const rule=String(item.recurrence||item.repeat||item.frequency||'').toLowerCase();
 if(!rule||rule==='none'||rule==='once')return false;
 const start=item.date||item.startDate;
 if(start&&date<start)return false;
 if(item.until&&date>item.until)return false;
 const weekday=new Date(date+'T12:00:00').getDay();
 const days=item.days||item.weekdays;
 if(Array.isArray(days))return days.some(x=>Number(x)===weekday||String(x).toLowerCase()===['sun','mon','tue','wed','thu','fri','sat'][weekday]);
 if(rule==='daily'||rule==='everyday')return true;
 if(rule==='weekly'&&start)return new Date(start+'T12:00:00').getDay()===weekday;
 if(rule==='monthly'&&start)return start.slice(8,10)===date.slice(8,10);
 return false;
}
function rowsFor(date){
 const weekday=new Date(date+'T12:00:00').getDay(),rows=[];
 for(const t of state.tasks||[])if(scheduled(t,date))rows.push({kind:'task',item:t});
 for(const a of state.activities||[])if(scheduled(a,date))rows.push({kind:'activity',item:a});
 for(const c of state.classes||[])if(Number(c.day)===weekday)rows.push({kind:'class',item:c});
 return rows.sort((a,b)=>Number(a.kind==='class'?a.item.start:parseTime(a.item.start||a.item.time)||0)-Number(b.kind==='class'?b.item.start:parseTime(b.item.start||b.item.time)||0));
}
function taskStatus(item,date){
 const rule=item.recurrence||item.repeat||item.frequency;
 if(rule&&rule!=='none'&&rule!=='once')return (state.taskOccurrences||{})[date+'|'+item.id]||'pending';
 return item.status||'pending';
}
function setTaskStatus(item,date,value){
 const rule=item.recurrence||item.repeat||item.frequency;
 if(rule&&rule!=='none'&&rule!=='once'){
  state.taskOccurrences=state.taskOccurrences||{};
  if(value==='pending')delete state.taskOccurrences[date+'|'+item.id];
  else state.taskOccurrences[date+'|'+item.id]=value;
 }else item.status=value;
}
function renderDashboardStatuses(){
 const host=document.getElementById('quickTasks');if(!host)return;
 const date=todayISO(),rows=rowsFor(date);
 host.innerHTML=rows.length?rows.map(({kind,item})=>{
  const isClass=kind==='class',value=isClass?attendanceFor(item,date):taskStatus(item,date);
  const yes=isClass?value==='Attended':value==='completed',no=isClass?value==='Absent':value==='not_completed'||value==='absent';
  const title=isClass?course(item.courseId).name:item.title;
  const start=isClass?fmtHour(item.start):item.start||item.time||'';
  const end=isClass?fmtHour(item.end):item.end||'';
  const label=isClass?(value==='Not Yet Recorded'?'Not Yet':value):(yes?'Completed':no?'Not completed':'Unmarked');
  return `<div class="woTodayItem" data-status-kind="${kind}" data-status-id="${esc(String(item.id))}"><div class="woTaskOpen" role="button" tabindex="0"><strong><span class="woKind">${isClass?'CLASS':kind==='task'?'TASK':'ACTIVITY'}</span>${esc(title||'Untitled')}</strong><small>${esc(String(start))}${end?'–'+esc(String(end)):''} · ${label}</small></div><div class="woStatusButtons">${isClass?['Attended','Online','Absent','Not Held','Not Yet'].map(option=>`<button type="button" class="woAttendanceChoice" data-status-choice="${option}" aria-label="${option}" aria-pressed="${value===option}">${option}</button>`).join(''):`<button type="button" data-status-choice="yes" aria-label="Completed" aria-pressed="${yes}">✓</button><button type="button" data-status-choice="no" aria-label="Not completed" aria-pressed="${no}">✕</button><button type="button" data-status-choice="clear" aria-label="Unmarked" aria-pressed="${!yes&&!no}">○</button>`}</div></div>`;
 }).join(''):'<div style="padding:15px;color:var(--muted)">No tasks, activities or classes scheduled today.</div>';
 const count=document.getElementById('taskCount');if(count)count.textContent=rows.filter(({kind,item})=>kind!=='class'&&taskStatus(item,date)!=='completed').length;
 host.querySelectorAll('[data-status-choice]').forEach(button=>button.addEventListener('click',function(e){
  e.stopPropagation();const row=button.closest('[data-status-kind]');const kind=row.dataset.statusKind,id=row.dataset.statusId;
  const items=kind==='class'?state.classes:kind==='task'?state.tasks:state.activities;
  const item=(items||[]).find(x=>String(x.id)===id);if(!item)return;
  const choice=button.dataset.statusChoice;
  if(kind==='class'){
   state.attendance=state.attendance||{};
   const key=attendanceKey(item,date);
   state.attendance[key]=choice;
  }else setTaskStatus(item,date,choice==='yes'?'completed':choice==='no'?'not_completed':'pending');
  save();renderDashboardStatuses();if(typeof renderStatus==='function')renderStatus();
 }));
 host.querySelectorAll('.woTaskOpen').forEach(el=>{
  const open=()=>{const row=el.closest('[data-status-kind]');openEntity(row.dataset.statusKind,row.dataset.statusId)};
  el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
 });
}
// Existing renderQuick is retained for classes and dashboard decorations, but its legacy
// quickTasks projection is overwritten by the canonical projection every time.
const oldQuick=window.renderQuick;
window.renderQuick=function(){if(typeof oldQuick==='function')oldQuick();renderDashboardStatuses();};
renderTasks=renderDashboardStatuses;
const oldSave=window.save;
window.save=function(){const result=oldSave();renderDashboardStatuses();if(typeof renderStatus==='function')renderStatus();return result;};
window.WeekOSDashboardStatus={rowsFor,render:renderDashboardStatuses};
renderDashboardStatuses();
})();
