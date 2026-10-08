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
const shots=[{id:'coliseo',title:'Coliseo · Kael, Mira y Wren contra Gorrak',note:'Combate por turnos · captura del juego',alt:'Gorrak frente al equipo de Kael, Mira y Wren en el Coliseo.'},{id:'puerto',title:'Ballenar de noche · Kael y Mira',note:'Confesión puesta en escena para esta presentación.',alt:'Kael le dice a Mira que quiere estar con ella en el muelle de Ballenar.'},{id:'bestiario',title:'Diario de campo · Goblin Ratero',note:'El cuaderno de Kael, con citas de Mira y Dorian. Vista de presentación.',alt:'Boceto del Goblin Ratero y comentarios del equipo.'},{id:'mapa',title:'Mapa de Aldenbrock',note:'Exploración · captura del juego',alt:'Mapa del pueblo de Aldenbrock y sus caminos.'}];
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
// La revisión local ofrece los paquetes reales; GitHub Pages usa Releases.
if(['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname)){
 const files={windows:'Braviestale-demo-20261007-v013-win.zip',linux:'Braviestale-demo-20261007-v013-linux64.tar.bz2'};
 document.querySelectorAll('.download-link').forEach(link=>{link.href='downloads/'+files[link.dataset.platform];link.setAttribute('download',files[link.dataset.platform]);});
}

document.addEventListener('languagechange',()=>{audioState(!audio.paused);if(dialog.open)renderShot(currentShot);});
