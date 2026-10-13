/* Five canonical per-occurrence class attendance statuses, shared across views. */
(function(){
'use strict';
const OPTIONS=['Attended','Online','Absent','Not Held','Not Yet'];
const oldOpenClass=window.openClass;
window.openClass=function(id){
 const result=oldOpenClass.apply(this,arguments);
 const c=state.classes.find(x=>String(x.id)===String(id));
 const buttons=document.getElementById('attendBtns');
 if(!c||!buttons)return result;
 const date=todayISO();
 buttons.innerHTML=OPTIONS.map(value=>`<button type="button" data-attendance-value="${value}" class="${attendanceFor(c,date)===value?'sel':''}" aria-pressed="${attendanceFor(c,date)===value}">${value}</button>`).join('');
 buttons.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  state.attendance=state.attendance||{};
  state.attendance[attendanceKey(c,date)]=button.dataset.attendanceValue;
  save();renderAll();window.openClass(id);
 }));
 return result;
};
const oldRenderStatus=window.renderStatus;
window.renderStatus=function(){
 const result=oldRenderStatus.apply(this,arguments);
 const labels={sAtt:'Attended',sOn:'Online',sAbs:'Absent',sHeld:'Not Held',sYet:'Not Yet'};
 const classes=typeof todayClasses==='function'?todayClasses():[];
 for(const [id,status] of Object.entries(labels)){
  const node=document.getElementById(id);
  if(node)node.textContent=classes.filter(c=>attendanceFor(c,todayISO())===status).length;
 }
 return result;
};
// Startup always begins on Today; do not overwrite profile, attendance or other persisted data.
try{page='today';weekOffset=0;showPage('today');}catch(error){console.warn('Today startup:',error)}
window.WeekOSAttendance={options:OPTIONS.slice(),set(id,date,value){
 if(!OPTIONS.includes(value))throw Error('Invalid attendance status');
 const c=state.classes.find(x=>String(x.id)===String(id));if(!c)throw Error('Class not found');
 state.attendance=state.attendance||{};state.attendance[attendanceKey(c,date)]=value;
 save();renderAll();return attendanceFor(c,date);
}};
})();
