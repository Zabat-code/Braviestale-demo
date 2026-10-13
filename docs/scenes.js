'use strict';
(() => {
 const section=document.getElementById('escenas'),track=document.getElementById('scene-track');
 const cards=[...track.querySelectorAll('[data-scene-card]')],captions=[...document.querySelectorAll('[data-scene-caption]')];
 const originalLabels=cards.map(card=>card.querySelector('button').getAttribute('aria-label'));
 let selected=0,touchStart=null,swiped=false;
 function showScene(next){
  selected=(next+cards.length)%cards.length;
  section.dataset.scene=cards[selected].dataset.sceneCard;
  cards.forEach((card,i)=>{
   let offset=(i-selected+cards.length)%cards.length;
   if(offset>cards.length/2)offset-=cards.length;
   card.dataset.position=offset===0?'active':offset===1?'next':offset===-1?'previous':'back';
   card.inert=Math.abs(offset)>1;
   card.setAttribute('aria-hidden',String(Math.abs(offset)>1));
   const button=card.querySelector('button');
   button.setAttribute('aria-label',i===selected?tr(originalLabels[i]):tr('Ver escena')+' · '+tr(cards[i].getAttribute('aria-label')));
   button.setAttribute('aria-current',String(i===selected));
  });
  captions.forEach((caption,i)=>caption.hidden=i!==selected);
 }
 cards.forEach((card,i)=>card.addEventListener('click',event=>{
  if(swiped){event.preventDefault();event.stopImmediatePropagation();swiped=false;return;}
  if(i!==selected){event.preventDefault();event.stopImmediatePropagation();showScene(i);}
 },true));
 track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showScene(selected+(event.key==='ArrowRight'?1:-1));}});
 track.addEventListener('touchstart',event=>{swiped=false;touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 track.addEventListener('touchend',event=>{if(!touchStart)return;const x=event.changedTouches[0].clientX-touchStart.x,y=event.changedTouches[0].clientY-touchStart.y;if(Math.abs(x)>45&&Math.abs(x)>Math.abs(y)){swiped=true;showScene(selected+(x<0?1:-1));}touchStart=null;},{passive:true});
 document.addEventListener('languagechange',()=>showScene(selected));
 showScene(0);
})();
// One deliberate wheel movement advances a full-screen section.
// Long, expanded content and the game keep their normal scrolling.
(() => {
 const sections=[...document.querySelectorAll('main>section')];
 let accumulated=0,direction=0,locked=false,resetTimer=null,unlockTimer=null;
 window.addEventListener('wheel',event=>{
  if(!matchMedia('(pointer:fine)').matches||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||document.querySelector('dialog[open]')||event.target.closest('iframe,input,textarea,select'))return;
  const center=innerHeight/2;
  const index=sections.findIndex(section=>{const r=section.getBoundingClientRect();return r.top<=center&&r.bottom>center;});
  if(index<0)return;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(!delta)return;
  const sign=Math.sign(delta),rect=sections[index].getBoundingClientRect();
  if(!locked&&rect.height>innerHeight+4&&((sign>0&&rect.bottom>innerHeight+4)||(sign<0&&rect.top< -4)))return;
  const next=index+sign;
  if(next<0||next>=sections.length)return;
  event.preventDefault();
  if(locked)return;
  if(direction!==sign)accumulated=0;
  direction=sign;accumulated+=Math.abs(delta);
  clearTimeout(resetTimer);resetTimer=setTimeout(()=>accumulated=0,220);
  if(accumulated<36)return;
  accumulated=0;locked=true;
  sections[next].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
  clearTimeout(unlockTimer);unlockTimer=setTimeout(()=>locked=false,1100);
 },{passive:false});
})();
