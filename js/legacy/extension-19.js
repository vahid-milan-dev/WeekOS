
(function(){
'use strict';
const allowed=['Breakfast','Lunch','Dinner'];
const hhmm=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
const clockField=(key,label,value)=>{const v=hhmm.test(value||'')?value:'12:00',parts=v.split(':');return `<div class="field"><label>${label}</label><div class="woTime24"><div class="woClockPart"><label>Hour (00–23)</label><select name="${key}Hour">${Array.from({length:24},(_,i)=>{const n=String(i).padStart(2,'0');return `<option value="${n}" ${n===parts[0]?'selected':''}>${n}</option>`}).join('')}</select></div><div class="woClockPart"><label>Minute (00–59)</label><select name="${key}Minute">${Array.from({length:60},(_,i)=>{const n=String(i).padStart(2,'0');return `<option value="${n}" ${n===parts[1]?'selected':''}>${n}</option>`}).join('')}</select></div></div></div>`};
mealForm=function(id){
 const existing=(state.meals||[]).find(x=>x.id===id);
 const m=existing||{title:'Breakfast',start:'12:00',end:'12:30',days:[0,1,2,3,4,5,6]};
 const choices=`<div class="field"><label>Meal Name</label><select name="title" required>${allowed.map(x=>`<option value="${x}" ${x===m.title?'selected':''}>${x}</option>`).join('')}</select></div>`;
 const days=`<div class="field woWide"><label>Days of week</label><div>${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((x,i)=>`<label style="margin-right:10px"><input type="checkbox" name="day${i}" ${(m.days||[]).includes(i)?'checked':''}> ${x}</label>`).join('')}</div></div>`;
 modal(id?'Edit Meal':'Add Meal',choices+clockField('start','Start Time',m.start)+clockField('end','End Time',m.end)+days,fd=>{
  const start=fd.startHour+':'+fd.startMinute,end=fd.endHour+':'+fd.endMinute;
  if(!allowed.includes(fd.title)||!hhmm.test(start)||!hhmm.test(end))return 'Choose a valid meal and 24-hour time.';
  if(end<=start)return 'End time must be after start time.';
  const selected=[0,1,2,3,4,5,6].filter(i=>fd['day'+i]);if(!selected.length)return 'Choose at least one day.';
  const target=(state.meals||[]).find(x=>x.title===fd.title)||existing;
  const item={id:target?.id||id||uid('meal'),title:fd.title,start,end,days:selected,enabled:true};
  if(target)Object.assign(target,item);else state.meals.push(item);
  state.meals=state.meals.filter((x,i,a)=>allowed.includes(x.title)&&a.findIndex(y=>y.title===x.title)===i);
  return null;
 });
};
// The original code saved localStorage before rebuilding dependent views; centralize
// invalidation so all existing render paths receive the new state on the same turn.
let rendering=false,pending=false;
function sync(){if(rendering){pending=true;return}rendering=true;try{
 applyTheme();renderAll();
 if(page==='meals'||page==='themes'){renderCustom(page)}
 else if(page!=='today'){showPage(page)}
 renderProfile();
 if(typeof updateClockLine==='function')updateClockLine();
}finally{rendering=false;if(pending){pending=false;queueMicrotask(sync)}}}
const persist=save;
save=function(){persist();sync()};
// Fix a second root cause: the custom modal's success handler previously
// rerendered only the calendar and the custom page, leaving generic views stale.
const originalModal=modal;
modal=function(title,fields,done){originalModal(title,fields,done);const form=document.querySelector('#entityForm');form.onsubmit=function(e){e.preventDefault();const fd=Object.fromEntries(new FormData(form).entries());let err;try{err=done(fd)}catch(ex){err=ex.message||'Could not save';console.error(ex)}if(err){document.querySelector('#formErr').textContent=err;return}closeModal();save()};};
// Changes performed outside save() can still request a synchronized render.
window.WeekOSSync=sync;
window.WeekOSTestAPI={addMeal:(title,start,end)=>{if(!allowed.includes(title)||!hhmm.test(start)||!hhmm.test(end)||end<=start)throw Error('Invalid meal');const existing=state.meals.find(x=>x.title===title);if(existing)Object.assign(existing,{start,end,enabled:true,days:[0,1,2,3,4,5,6]});else state.meals.push({id:uid('meal'),title,start,end,days:[0,1,2,3,4,5,6],enabled:true});save()},removeMeal:title=>{state.meals=state.meals.filter(x=>x.title!==title);save()}};
})();
