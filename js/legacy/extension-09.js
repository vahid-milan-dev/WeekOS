
(function(){
const detected=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch(e){return'UTC'}};
const zones=['auto','Europe/Berlin','Europe/London','America/New_York','America/Los_Angeles','Asia/Tokyo','Asia/Tehran','Asia/Dubai','Asia/Kolkata','Australia/Sydney','UTC'];
function tz(){return state?.settings?.timeZone&&state.settings.timeZone!=='auto'?state.settings.timeZone:detected()}
window.weekosTimeZone=tz;
window.currentDate=()=>{let p=new Intl.DateTimeFormat('en-CA',{timeZone:tz(),year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),o=Object.fromEntries(p.map(x=>[x.type,x.value]));return `${o.year}-${o.month}-${o.day}`};
function ui(){
 if(!state?.settings)return;if(!state.settings.timeZone)state.settings.timeZone='auto';
 document.querySelectorAll('*').forEach(e=>{if(!e.children.length&&/^IRAN TIME$/i.test(e.textContent.trim()))e.textContent='LOCAL TIME'});
 ['page-settings','page-profile'].forEach(id=>{let p=document.getElementById(id);if(!p||p.querySelector('.tz-final'))return;let d=document.createElement('div');d.className='coursecard tz-final';d.innerHTML='<div class="sectionlabel"><div><b>Time Zone</b><small>Used for current time, Today, calendar dates and reminders.</small></div></div><div class="field"><label>Time Zone</label><select></select></div>';let q=d.querySelector('select');q.innerHTML=zones.map(z=>`<option value="${z}">${z==='auto'?'Automatically detect ('+detected()+')':z}</option>`).join('');q.value=state.settings.timeZone;q.onchange=()=>{state.settings.timeZone=q.value;save();renderAll();};p.appendChild(d)})
}
const ra=window.renderAll;if(ra)window.renderAll=function(){ra();setTimeout(ui,0)};setTimeout(ui,0)
})();
