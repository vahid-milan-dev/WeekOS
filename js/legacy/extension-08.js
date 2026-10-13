
(()=>{
 const baseShowPage=showPage;
 window.showPage=function(name){
   if(name!=='profile') return baseShowPage(name);
   page='profile';
   $$('#nav button').forEach(b=>b.classList.toggle('active',false));
   $('#today').classList.remove('active');$('#generic').classList.add('active');
   pageHead('Profile','Manage your identity and profile picture.');
   const n=state.profile.name||'';
   $('#genericBody').innerHTML=`<div class="coursecard profilePage"><div class="profileCard"><div class="profileAvatarLarge" id="profilePageAvatar">${state.profile.photo?`<img src="${state.profile.photo}" alt="Profile picture">`:esc((n||'?').slice(0,1).toUpperCase())}</div><div class="profileFields"><label>Name<input id="profilePageName" value="${esc(n)}" placeholder="Your name"></label><div class="profileActions"><button class="btn" id="profilePagePhoto">Choose profile picture</button>${state.profile.photo?'<button class="btn" id="profilePageRemove">Remove picture</button>':''}</div><input id="profilePageFile" type="file" accept="image/*" hidden><small style="color:var(--muted)">Profile changes are saved immediately and appear throughout WeekOS.</small></div></div></div>`;
   const nameInput=$('#profilePageName');nameInput.oninput=()=>{state.profile.name=nameInput.value.trim();save();renderProfile();renderHeader();syncProfileMenu()};
   const file=$('#profilePageFile');$('#profilePagePhoto').onclick=()=>file.click();file.onchange=()=>{const f=file.files&&file.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.profile.photo=r.result;save();renderProfile();syncProfileMenu();showPage('profile')};r.readAsDataURL(f)};
   const rem=$('#profilePageRemove');if(rem)rem.onclick=()=>{state.profile.photo='';save();renderProfile();syncProfileMenu();showPage('profile')};
 };
 // Rebind the existing profile-menu destination after the wrapper is installed.
 const profileItem=$('#menuProfile');if(profileItem)profileItem.onclick=()=>{$('#profileMenu')?.classList.remove('show');showPage('profile')};
})();
