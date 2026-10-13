(()=>{
'use strict';
// One transaction path for local persistence and all dependent projections.
const previousSave=window.save;
let busy=false,again=false;
function redraw(){
 if(busy){again=true;return true}
 busy=true;
 try{
  applyTheme();renderAll();
  if(page==='meals'||page==='themes')renderCustom(page);
  else if(page!=='today')showPage(page);
  renderProfile();
  if(typeof onboardingCheck==='function')onboardingCheck();
  return true;
 }catch(error){console.error('WeekOS redraw failed',error);toast('View update failed: '+error.message);return false}
 finally{busy=false;if(again){again=false;queueMicrotask(redraw)}}
}
window.save=function(){
 try{
  snapshotWeek();
  const serialized=JSON.stringify(state);
  localStorage.setItem(KEY,serialized);
  if(localStorage.getItem(KEY)!==serialized)throw Error('Local storage verification failed');
 }catch(error){console.error('WeekOS persistence failed',error);toast('Save failed: '+error.message);return false}
 const ok=redraw();if(ok)toast('Saved successfully');return ok;
};
window.WeekOSSync=redraw;
// The legacy custom modal tried to render every page through renderCustom(),
// even on the dashboard; its own handler is replaced by a single save transaction.
const oldModal=window.modal;
window.modal=function(title,fields,done){
 oldModal(title,fields,done);
 const form=document.querySelector('#entityForm');
 form.onsubmit=function(e){
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  let error;
  try{error=done(data)}catch(ex){error=ex.message;console.error(ex)}
  if(error){document.querySelector('#formErr').textContent=error;return}
  closeModal();window.save();
 };
};
})();