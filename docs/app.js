'use strict';
const audio=document.getElementById('ambient-audio');
const audioToggle=document.getElementById('audio-toggle');
const audioLabel=document.getElementById('audio-label');
const audioSettings=document.getElementById('audio-settings');
const volume=document.getElementById('audio-volume');
const volumeValue=document.getElementById('volume-value');
audio.volume=0.12;
function audioState(playing){audioToggle.setAttribute('aria-pressed',String(playing));audioToggle.setAttribute('aria-label',tr(playing?'Pausar música suave':'Activar música suave'));audioLabel.textContent=tr(playing?'Música: suave':'Música: apagada');audioSettings.hidden=!playing;}
audioToggle.addEventListener('click',async()=>{if(!audio.paused){audio.pause();audioState(false);return;}try{await audio.play();audioState(true);}catch{audioLabel.textContent=tr('Reintentar música');audioToggle.setAttribute('aria-label',tr('Reintentar reproducción de música'));}});
volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;volumeValue.textContent=volume.value+' %';});
audio.addEventListener('pause',()=>audioState(false));
document.getElementById('pause-audio').addEventListener('click',()=>audio.pause());
// Al volver a la pestaña, el usuario decide si quiere reanudar la música.
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!audio.paused)audio.pause();});
const shots=[{id:'coliseo',title:'Combate · interfaz 0.1.7',note:'Captura preparada con el motor del juego, sin acontecimientos de la historia.',alt:'Kael, Mira y Dorian frente a goblins.'},{id:'forja',title:'Aldenbrock · armas para el grupo',note:'Exploración · captura del juego',alt:'Catálogo de armas de la forja de Aldenbrock, con precios y bonificaciones.'},{id:'bestiario',title:'Diario de campo · Goblin Ratero',note:'Bestiario real · demo 0.1.7',alt:'Boceto y observaciones del Goblin Ratero.'},{id:'mapa',title:'Mapa continental · Aldenbrock',note:'Exploración · captura del juego',alt:'Mapa continental centrado en la plaza, con los caminos visitados de Aldenbrock.'}];
let currentShot=0;
const dialog=document.getElementById('lightbox');
const dialogImg=document.getElementById('lightbox-image');
function renderShot(index){currentShot=(index+shots.length)%shots.length;const shot=shots[currentShot];dialogImg.src='assets/'+shot.id+'.webp';dialogImg.alt=tr(shot.alt);document.getElementById('lightbox-title').textContent=tr(shot.title);document.getElementById('lightbox-note').textContent=tr(shot.note);}
document.querySelectorAll('[data-shot]').forEach(button=>button.addEventListener('click',()=>{renderShot(shots.findIndex(shot=>shot.id===button.dataset.shot));dialog.showModal();document.body.classList.add('dialog-open');}));
document.getElementById('close-lightbox').addEventListener('click',()=>dialog.close());
document.getElementById('previous-shot').addEventListener('click',()=>renderShot(currentShot-1));
document.getElementById('next-shot').addEventListener('click',()=>renderShot(currentShot+1));
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();renderShot(currentShot+1);}else if(event.key==='ArrowLeft'){event.preventDefault();renderShot(currentShot-1);}});
document.addEventListener('languagechange',()=>{audioState(!audio.paused);if(dialog.open)renderShot(currentShot);});

// Circular, manual carousel: no autoplay and no story revelations.
const characterCards=[...document.querySelectorAll('[data-character]')];
let firstCharacter=0;
function characterCount(){return innerWidth<=650?1:innerWidth<=1050?2:4;}
function showCharacters(){
 const count=characterCount();characterCards.forEach(card=>card.hidden=true);
 for(let n=0;n<count;n++){const i=(firstCharacter+n)%characterCards.length;const card=characterCards[i];card.hidden=false;card.style.order=n;}

}
function moveCharacters(delta){firstCharacter=(firstCharacter+delta+characterCards.length)%characterCards.length;showCharacters();}
let hoverDelay=null,hoverRepeat=null;
function stopCharacterHover(){clearTimeout(hoverDelay);clearInterval(hoverRepeat);hoverDelay=hoverRepeat=null;}
for(const [id,delta] of [['characters-prev',-1],['characters-next',1]]){
 const control=document.getElementById(id);
 control.addEventListener('click',()=>{stopCharacterHover();moveCharacters(delta);});
 control.addEventListener('pointerenter',event=>{
  if(event.pointerType!=='mouse')return;
  stopCharacterHover();hoverDelay=setTimeout(()=>{moveCharacters(delta);hoverRepeat=setInterval(()=>moveCharacters(delta),1600);},350);
 });
 control.addEventListener('pointerleave',stopCharacterHover);
 control.addEventListener('blur',stopCharacterHover);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCharacterHover();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')stopCharacterHover();});
document.getElementById('character-track').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();moveCharacters(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveCharacters(-1);}});
let swipeStart=null;const track=document.getElementById('character-track');
track.addEventListener('touchstart',e=>swipeStart=e.touches[0].clientX,{passive:true});
track.addEventListener('touchend',e=>{if(swipeStart!==null){const d=e.changedTouches[0].clientX-swipeStart;if(Math.abs(d)>55)moveCharacters(d<0?1:-1);swipeStart=null;}},{passive:true});
window.addEventListener('resize',showCharacters);showCharacters();
// Load the game only after a deliberate click; pause the landing page music.
const startGame=document.getElementById('start-game');const gameShell=document.getElementById('game-shell');const fullscreenGame=document.getElementById('fullscreen-game');
startGame.addEventListener('click',()=>{
 if(document.getElementById('game-frame'))return;
 audio.pause();
 const frame=document.createElement('iframe');frame.id='game-frame';frame.title='Braviestale · demo 0.1.8';frame.src='jugar/';frame.allow='fullscreen; autoplay';frame.setAttribute('allowfullscreen','');
 gameShell.replaceChildren(frame);fullscreenGame.disabled=false;startGame.disabled=true;startGame.textContent=tr('Juego iniciado');
 document.getElementById('web-status').textContent=tr('Cargando el juego. Espera al menú Nueva partida; el progreso aparece dentro del reproductor.');
});
fullscreenGame.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(gameShell.requestFullscreen)await gameShell.requestFullscreen();else window.open('jugar/','_blank','noopener');}catch{document.getElementById('web-status').textContent=tr('Usa Abrir en una pestaña aparte si tu navegador no permite pantalla completa.');}});
document.addEventListener('languagechange',()=>{showCharacters();if(startGame.disabled){startGame.textContent=tr('Juego iniciado');document.getElementById('web-status').textContent=tr('Cargando el juego. Espera al menú Nueva partida; el progreso aparece dentro del reproductor.');}});
