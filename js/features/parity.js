(()=>{
'use strict';
// Identical functionality for both editions; only the initial data and storage key differ.
const previousFields=fieldsFor;
fieldsFor=function(kind,obj={}){
 const html=previousFields(kind,obj);
 if(kind==='class' && !state.courses.length){
  return `<div class="field"><label>Course name</label><input name="woNewCourseName" required placeholder="e.g. Mathematics"></div>`+html;
 }
 return html;
};
const entityForm=document.getElementById('entityForm');
// Capture submit before the legacy handler, creating the required course first.
// A class with no course cannot be rendered/editable in the empty public edition.
entityForm.addEventListener('submit',function(event){
 if(!modalCtx || modalCtx.kind!=='class')return;
 const nameField=entityForm.querySelector('[name="woNewCourseName"]');
 if(!nameField)return;
 const name=nameField.value.trim();
 if(!name){event.preventDefault();event.stopImmediatePropagation();document.getElementById('formErr').textContent='Course name is required.';return;}
 const courseId=uid('course');
 state.courses.push({id:courseId,name,professor:'',room:'',meeting:'',notes:'',color:'blue'});
 const select=entityForm.querySelector('[name="courseId"]');
 if(select){const option=document.createElement('option');option.value=courseId;option.textContent=name;option.selected=true;select.appendChild(option);}
 },true);
// Meal blocks on the weekly schedule must behave like other clickable entries.
const calendar=document.getElementById('calendarGrid');
calendar?.addEventListener('click',event=>{
 const el=event.target.closest('.woMeal');
 if(!el || !calendar.contains(el))return;
 event.preventDefault();event.stopImmediatePropagation();
 const meal=state.meals.find(m=>m.id===el.dataset.mealId);
 if(!meal)return;
 const drawer=document.getElementById('drawer');
 if(!drawer)return;
 drawerCtx={kind:'meal',id:meal.id};
 document.getElementById('dTitle').textContent=meal.title;
 document.getElementById('dGrid').innerHTML=`<span>Time</span><b>${esc(meal.start)}–${esc(meal.end)}</b><span>Days</span><b>${(meal.days||[]).map(i=>['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]).join(', ')}</b>`;
 document.getElementById('drawerAttendance').style.display='none';
 document.getElementById('dNotes').value='';
 document.getElementById('dJoin').style.display='none';
 document.getElementById('drawerActions').innerHTML='<button class="btn" data-meal-action="edit">Edit</button><button class="btn danger" data-meal-action="delete">Delete</button>';
 document.querySelector('[data-meal-action="edit"]').onclick=()=>{closeDrawer();mealForm(meal.id)};
 document.querySelector('[data-meal-action="delete"]').onclick=()=>{if(!confirm('Delete this meal?'))return;state.meals=state.meals.filter(m=>m.id!==meal.id);closeDrawer();save()};
 showDrawer();
 },true);
// Annotate the actual rendered blocks with stable IDs after every calendar render.
const previousCalendar=renderCalendar;
renderCalendar=function(){previousCalendar();const meals=state.meals||[],ds=weekDates();
 document.querySelectorAll('#calendarGrid .woMeal').forEach(el=>{
  const text=el.textContent||'';
  const title=meals.find(m=>text===m.title || text.startsWith(m.title+' · '));
  if(title)el.dataset.mealId=title.id;
 });
};
// No reload: redraw immediately using the same rendering path as Personal.
renderCalendar();
})();