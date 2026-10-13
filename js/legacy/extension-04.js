
(()=>{
// Tehran civil-date helpers: avoid converting a Tehran calendar date through the device timezone/UTC.
window.todayISO=function(){const p=iranParts();return `${p.year}-${p.month}-${p.day}`};
window.iso=function(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
// Keep the Today page anchored to the real Tehran date whenever it is opened.
const prevShowPage=showPage;showPage=function(name){if(name==='today')weekOffset=0;prevShowPage(name)};
// Make both search containers explicit responsive targets.
const localSearch=document.querySelector('.search2');if(localSearch)localSearch.id='search2';
// Professional inline SVG navigation icon system.
const iconMap={"today":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 11.5 12 4l9 7.5\"/><path d=\"M5.5 10.5V20h13v-9.5M9.5 20v-6h5v6\"/></svg>","week":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M8 3v4M16 3v4M3 10h18M7 14h3M14 14h3M7 18h3\"/></svg>","tasks":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"m8 10 2 2 4-4M8 16h8\"/></svg>","activities":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 12h4l2.2-5 4.2 10 2.1-5H21\"/></svg>","study":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 5.5A3.5 3.5 0 0 1 7.5 4H12v16H7.5A3.5 3.5 0 0 0 4 21.5zM20 5.5A3.5 3.5 0 0 0 16.5 4H12v16h4.5a3.5 3.5 0 0 1 3.5 1.5z\"/></svg>","deadlines":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"13\" r=\"8\"/><path d=\"M12 9v5l3 2M9 3h6\"/></svg>","review":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 19V9M10 19V5M16 19v-7M22 19H2\"/></svg>","history":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 12a9 9 0 1 0 3-6.7L3 8\"/><path d=\"M3 3v5h5M12 7v5l3 2\"/></svg>","courses":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m2 9 10-5 10 5-10 5zM6 11.5V16c3 2 9 2 12 0v-4.5M22 9v6\"/></svg>","classes":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 8h10M7 12h10M7 16h6\"/></svg>","attendance":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20c0-4 2.5-6 6-6 2 0 3.7.7 4.8 2M16 18l2 2 4-5\"/></svg>","semester":"<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 3h14v18H5zM8 7h8M8 11h8M8 15h5\"/></svg>"};
document.querySelectorAll('#nav button[data-page]').forEach(btn=>{const i=btn.querySelector('.ico'),svg=iconMap[btn.dataset.page];if(i&&svg)i.innerHTML=svg});
document.querySelectorAll('.mobilebar button[data-mpage]').forEach(btn=>{const key=btn.dataset.mpage,svg=iconMap[key];if(svg){const label=btn.textContent.trim().split(/\s+/).pop();btn.innerHTML=svg+'<span>'+label+'</span>'}});
// Replay is an action, not a passive setting: leave Settings and restart at step 1.
function polishReplay(){const b=document.querySelector('#replayTutorial');if(!b)return;b.textContent='Start Tutorial';b.onclick=()=>{localStorage.removeItem(KEY+'-tutorialCompleted');showPage('today');setTimeout(()=>window.startWeekOSTour&&window.startWeekOSTour(),80)}}
const oldShow=showPage;showPage=function(name){oldShow(name);if(name==='settings')requestAnimationFrame(polishReplay)};if(page==='settings')polishReplay();
// Refresh date-sensitive UI after Tehran midnight without requiring navigation/reload.
let lastToday=todayISO();setInterval(()=>{const now=todayISO();if(now!==lastToday){lastToday=now;if(page==='today'){weekOffset=0;renderAll()}else renderHeader()}},15000);
})();
