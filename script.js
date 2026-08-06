/* EDITABLE WEDDING DETAILS */
const suppliedSong=new Audio('assets/background-music.mp3');suppliedSong.loop=true;suppliedSong.preload='metadata';suppliedSong.volume=.42;
function updateSongControl(){const state=musicOn?'sound on':'sound off';$('soundToggle').innerHTML=`<span>♪</span><i>${state}</i>`;$('soundToggle').setAttribute('aria-label',musicOn?'Turn background music off':'Turn background music on')}
startMusic=function(){if(musicOn)return;const playback=suppliedSong.play();musicOn=true;updateSongControl();if(playback)playback.catch(()=>{musicOn=false;updateSongControl()})};
document.body.classList.add('intro-active');
const wedding = {
  bride: 'Dr Noora Fathima', groom: 'Dr Ifsul Hashim',
  brideParents: 'Mr. Azadali & Mrs. Famitha Azadali', groomParents: 'Mr. Muhammed Hashim & Mrs. Saheera Beegum',
  date: '2026-09-19T16:00:00+05:30',
  nikkah: '4:00 PM', reception: '6:00 – 9:00 PM',
  venue: 'Malabar Marina Convention Center',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Malabar+Marina+Convention+Center'
};
const eventDate = new Date(wedding.date);
const $ = id => document.getElementById(id);
$('soundToggle').addEventListener('click',event=>{event.stopImmediatePropagation();if(musicOn){suppliedSong.pause();musicOn=false;updateSongControl()}else startMusic()},true);
$('brideName').textContent = wedding.bride; $('groomName').textContent = wedding.groom;
$('brideParents').textContent = wedding.brideParents; $('groomParents').textContent = wedding.groomParents;
$('nikkahTime').textContent = wedding.nikkah; $('receptionTime').textContent = wedding.reception;
$('venueName').innerHTML = wedding.venue.replace(' Convention ', '<br />Convention ');
$('mapButton').href = wedding.mapUrl;
const format = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(eventDate);
$('venueDate').textContent = eventDate.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
$('venueTime').textContent = 'Reception · ' + wedding.reception;
$('dayName').textContent = eventDate.toLocaleDateString('en-GB',{weekday:'long'}); $('dateNumber').textContent = eventDate.getDate();
$('monthName').textContent = eventDate.toLocaleDateString('en-GB',{month:'long'}); $('year').textContent = eventDate.getFullYear();

function tick(){const diff=Math.max(0,eventDate-Date.now());const values=[Math.floor(diff/864e5),Math.floor(diff/36e5)%24,Math.floor(diff/6e4)%60,Math.floor(diff/1e3)%60];$('countdown').innerHTML=values.map((v,i)=>`<div><b>${String(v).padStart(2,'0')}</b><span>${['days','hours','mins','secs'][i]}</span></div>`).join('')}; tick(); setInterval(tick,1000);

const cover=$('cover'); let introState='ready';
function finishIntro(){introState='complete';cover.classList.add('complete');$('invitation').setAttribute('aria-hidden','false');document.body.classList.remove('intro-active');setTimeout(()=>cover.remove(),650)}
function openInvitation(){if(introState!=='ready')return;introState='opening';cover.classList.add('opening');startMusic();if(matchMedia('(prefers-reduced-motion: reduce)').matches){setTimeout(finishIntro,220);return}setTimeout(()=>{introState='card-rising';cover.classList.add('card-rising')},420);setTimeout(()=>{introState='transitioning';cover.classList.add('transitioning');$('invitation').setAttribute('aria-hidden','false')},1680);setTimeout(finishIntro,2800)}
$('openButton').addEventListener('click',openInvitation);

// Scratch card
const canvas=$('scratchCanvas'),ctx=canvas.getContext('2d'); let scratched=false, drawing=false, last;
function paint(){const r=canvas.getBoundingClientRect(), d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;ctx.scale(d,d);const grad=ctx.createLinearGradient(0,0,r.width,r.height);grad.addColorStop(0,'#f2d18a');grad.addColorStop(.45,'#a76d2f');grad.addColorStop(1,'#e8bd66');ctx.fillStyle=grad;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='rgba(255,255,255,.2)';for(let i=0;i<90;i++){ctx.beginPath();ctx.arc(Math.random()*r.width,Math.random()*r.height,Math.random()*1.5+.2,0,7);ctx.fill()}}
function point(e){const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:p.clientX-r.left,y:p.clientY-r.top}}
function scratch(e){if(!drawing)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation='destination-out';ctx.lineWidth=42;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;if(!scratched&&clearAmount()>38)reveal()}
function clearAmount(){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let n=0;for(let i=3;i<d.length;i+=120)n+=d[i]<80;return n/(d.length/120)*100}
function reveal(){scratched=true;canvas.style.transition='opacity .7s';canvas.style.opacity='0';$('scratchLabel').style.opacity='0';$('scratchHint').textContent='The date is saved in our hearts.';setTimeout(()=>canvas.remove(),750);petals()}
['pointerdown'].forEach(n=>canvas.addEventListener(n,e=>{drawing=true;last=point(e);scratch(e)}));['pointermove'].forEach(n=>canvas.addEventListener(n,scratch));['pointerup','pointerleave','pointercancel'].forEach(n=>canvas.addEventListener(n,()=>drawing=false));paint();addEventListener('resize',()=>{if(!scratched)paint()});
function petals(){for(let i=0;i<28;i++){const p=document.createElement('i');p.className='petal';p.style.left=(35+Math.random()*30)+'vw';p.style.top=(-10-Math.random()*15)+'px';p.style.setProperty('--x',(-180+Math.random()*360)+'px');p.style.animationDelay=(Math.random()*.8)+'s';document.body.append(p);setTimeout(()=>p.remove(),3300)}}

// Soft ambient wedding chime, enabled only after the invitation is opened.
let audio, musicOn=false, musicTimer; function tone(freq,when,duration,volume){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(volume,when+.08);g.gain.exponentialRampToValueAtTime(.001,when+duration);o.connect(g).connect(audio.destination);o.start(when);o.stop(when+duration+.1)}function playLoop(){if(!musicOn)return;const t=audio.currentTime;[261.6,329.6,392,329.6].forEach((f,i)=>tone(f,t+i*1.1,1.4,.025));musicTimer=setTimeout(playLoop,4600)}function startMusic(){if(musicOn)return;audio=new (window.AudioContext||window.webkitAudioContext)();musicOn=true;$('soundToggle').innerHTML='<span>♪</span><i>sound on</i>';playLoop()}$('soundToggle').addEventListener('click',()=>{if(!musicOn){startMusic()}else{musicOn=false;clearTimeout(musicTimer);$('soundToggle').innerHTML='<span>♪</span><i>sound off</i>'}});
