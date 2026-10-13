
(()=>{
const root=document.documentElement;
function hexToRgb(hex){let h=(hex||'#1688ff').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');let n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function accentTokens(){let a=state.settings.accent||'#1688ff',rgb=hexToRgb(a),lum=(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])/255;root.style.setProperty('--accent',a);root.style.setProperty('--blue',a);root.style.setProperty('--accent-contrast',lum>.62?'#07111b':'#ffffff')}
const _applyTheme=applyTheme;applyTheme=function(){_applyTheme();accentTokens()};accentTokens();
// Keep calendar density controlled instead of shrinking arbitrary descendants.
const _renderCalendar=renderCalendar;renderCalendar=function(){_renderCalendar();let g=$('#calendarGrid');if(g&&state.settings.density==='compact'){let start=+state.settings.calendarStart||9,end=+state.settings.calendarEnd||18;g.style.minHeight=Math.max(396,(end-start)*44)+'px'}};
const TOUR_KEY=KEY+'-tutorialCompleted';
const steps=[
{title:'Welcome to WeekOS',text:"Let's take a quick tour so you know where everything is."},
{sel:'[data-page="today"]',page:'today',title:'Today',text:'Today shows your classes, activities, tasks, and important events for the current day.'},
{sel:'[data-page="week"]',title:'Week',text:'Week gives you the complete weekly timetable and lets you see how your week is organized.'},
{sel:'[data-page="tasks"]',title:'Tasks',text:'Use Tasks to manage things you need to complete.'},
{sel:'[data-page="activities"]',title:'Activities',text:'Personal Activities are things such as language classes, gym sessions, meetings, and other events you add yourself.'},
{sel:'[data-page="study"]',title:'Study',text:'Use Study to plan and track study sessions.'},
{sel:'[data-page="deadlines"]',title:'Deadlines',text:'Keep track of upcoming and overdue deadlines.'},
{sel:'#calendarGrid',page:'today',title:'Calendar',text:'Your classes and activities appear here according to their exact date and time.'},
{sel:'#nextName',page:'today',title:'Now & Next',text:"This area tells you what's happening now and what's coming next."},
{sel:'#profileQuick',title:'Profile',text:'Your profile contains your account information and access to Settings.'},
{sel:'.settingGroup',page:'settings',title:'Settings',text:'Settings lets you customize appearance, time display, calendar behavior, density, accent color, and other preferences.'},
{sel:'[data-add]',page:'tasks',title:'Add items',text:'Use Add controls to create tasks, activities, study sessions, deadlines, courses, classes, and other supported items.'}
];
let idx=0,overlay;
function ensureOverlay(){if(overlay)return;overlay=document.createElement('div');overlay.className='tourOverlay';overlay.innerHTML='<div class="tourDim"></div><div class="tourSpot"></div><div class="tourCard"><h3></h3><p></p><div class="tourMeta"><small class="tourCount"></small><div class="tourTrack"><i></i></div></div><div class="tourActions"><button class="btn skip">Skip Tour</button><button class="btn back">Back</button><button class="btn primary next">Next</button></div></div>';document.body.appendChild(overlay);overlay.querySelector('.skip').onclick=()=>finishTour();overlay.querySelector('.back').onclick=()=>{if(idx>0){idx--;paintTour()}};overlay.querySelector('.next').onclick=()=>{if(idx===steps.length-1)finishTour();else{idx++;paintTour()}};window.addEventListener('resize',()=>overlay.classList.contains('show')&&paintTour(true));window.addEventListener('scroll',()=>overlay.classList.contains('show')&&paintTour(true),true)}
function finishTour(){localStorage.setItem(TOUR_KEY,'true');overlay?.classList.remove('show');document.querySelectorAll('.tourTarget').forEach(x=>x.classList.remove('tourTarget'))}
function paintTour(repositionOnly=false){ensureOverlay();let st=steps[idx];if(st.page&&page!==st.page)showPage(st.page);requestAnimationFrame(()=>{document.querySelectorAll('.tourTarget').forEach(x=>x.classList.remove('tourTarget'));let el=st.sel?document.querySelector(st.sel):null,spot=overlay.querySelector('.tourSpot'),card=overlay.querySelector('.tourCard');overlay.classList.toggle('tourWelcome',!el);overlay.classList.add('show');if(el){el.classList.add('tourTarget');el.scrollIntoView({block:'nearest',inline:'nearest'});let r=el.getBoundingClientRect(),pad=7;spot.style.left=(r.left-pad)+'px';spot.style.top=(r.top-pad)+'px';spot.style.width=(r.width+pad*2)+'px';spot.style.height=(r.height+pad*2)+'px';let cw=Math.min(360,innerWidth-28),left=Math.max(14,Math.min(innerWidth-cw-14,r.left+r.width/2-cw/2)),below=r.bottom+16,top=below+250<innerHeight?below:Math.max(14,r.top-230);card.style.left=left+'px';card.style.top=top+'px';card.style.transform='none'}else{card.style.left='50%';card.style.top='50%';card.style.transform='translate(-50%,-50%)'}if(!repositionOnly){card.querySelector('h3').textContent=st.title;card.querySelector('p').textContent=st.text;card.querySelector('.tourCount').textContent=(idx+1)+' / '+steps.length;card.querySelector('.tourTrack i').style.width=((idx+1)/steps.length*100)+'%';card.querySelector('.back').disabled=idx===0;card.querySelector('.next').textContent=idx===steps.length-1?'Finish':'Next'}})}
window.startWeekOSTour=function(){idx=0;paintTour()};
function installReplay(){if(page!=='settings'||$('#replayTutorial'))return;let groups=$$('.settingGroup'),host=groups[groups.length-1];if(!host)return;let row=document.createElement('div');row.className='settingsrow';row.innerHTML='<div><b>Replay Tutorial</b><small style="display:block">Start the interactive WeekOS walkthrough again.</small></div><div><button class="btn" id="replayTutorial">Replay Tutorial</button></div>';host.appendChild(row);$('#replayTutorial').onclick=()=>{localStorage.removeItem(TOUR_KEY);startWeekOSTour()}}
const _showPage=showPage;showPage=function(name){_showPage(name);installReplay()};if(page==='settings')installReplay();
const form=$('#onboardForm');if(form)form.addEventListener('submit',()=>{if(!localStorage.getItem(TOUR_KEY))setTimeout(()=>startWeekOSTour(),180)});
// Existing profiles from earlier builds should not be interrupted automatically; truly new profiles get the tour after setup.
})();
