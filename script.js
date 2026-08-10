/* EDITABLE WEDDING DETAILS */
let musicOn=false;
const suppliedSong=new Audio('assets/background-music.mp4');suppliedSong.loop=true;suppliedSong.preload='auto';suppliedSong.volume=.42;suppliedSong.load();
function updateSongControl(){const state=musicOn?'sound on':'sound off';$('soundToggle').innerHTML=`<span>♪</span><i>${state}</i>`;$('soundToggle').setAttribute('aria-label',musicOn?'Turn background music off':'Turn background music on')}
startMusic=function(){if(musicOn)return;musicOn=true;updateSongControl();const play=()=>{const playback=suppliedSong.play();if(playback)playback.catch(()=>{musicOn=false;updateSongControl()})};if(suppliedSong.readyState>=2)play();else suppliedSong.addEventListener('canplay',play,{once:true})};
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

// Scroll-driven dance video: continuous rAF + smoothed seeking for mobile.
const coupleStory=$('coupleStory');
if(coupleStory&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
const isTouch=matchMedia('(hover: none) and (pointer: coarse)').matches;
const danceHost=coupleStory.querySelector('.couple-sticky');
const danceVideo=document.createElement('video');
danceVideo.className='couple-dance-video';
danceVideo.id='coupleDanceVideo';
danceVideo.muted=true;
danceVideo.playsInline=true;
danceVideo.preload='auto';
danceVideo.setAttribute('playsinline','');
danceVideo.setAttribute('webkit-playsinline','');
danceVideo.setAttribute('aria-label','Scroll-driven wedding dance animation');
const danceSource=document.createElement('source');
danceSource.src='assets/couple-dance.mp4';
danceSource.type='video/mp4';
danceVideo.append(danceSource);
danceHost.prepend(danceVideo);

let danceReady=false,duration=0,visible=false,rafId=0,smoothTime=0,scrollTravel=1;
const lerp=isTouch?0.28:0.42;
const seekGap=isTouch?0.035:0.018;

const viewportHeight=()=>(window.visualViewport&&window.visualViewport.height)||innerHeight;

const refreshLayout=()=>{
scrollTravel=Math.max(1,coupleStory.offsetHeight-viewportHeight());
};

const scrollProgress=()=>{
const rect=coupleStory.getBoundingClientRect();
return Math.max(0,Math.min(1,-rect.top/scrollTravel));
};

const applySeek=time=>{
if(!Number.isFinite(time))return;
try{
if(typeof danceVideo.fastSeek==='function')danceVideo.fastSeek(time);
else danceVideo.currentTime=time;
}catch{}
};

const tick=()=>{
rafId=0;
if(!visible||!danceReady)return;
const target=scrollProgress()*duration;
smoothTime+= (target-smoothTime)*lerp;
if(Math.abs(danceVideo.currentTime-smoothTime)>seekGap)applySeek(smoothTime);
rafId=requestAnimationFrame(tick);
};

const startLoop=()=>{
if(!rafId&&visible&&danceReady)rafId=requestAnimationFrame(tick);
};

const stopLoop=()=>{
if(rafId){cancelAnimationFrame(rafId);rafId=0;}
};

new IntersectionObserver(([entry])=>{
visible=entry.isIntersecting;
if(visible){refreshLayout();startLoop();}
else stopLoop();
},{rootMargin:'15% 0px',threshold:0}).observe(coupleStory);

const onLayout=()=>{
refreshLayout();
smoothTime=scrollProgress()*duration;
applySeek(smoothTime);
startLoop();
};

danceVideo.addEventListener('loadedmetadata',()=>{
duration=danceVideo.duration;
danceReady=Number.isFinite(duration)&&duration>0;
danceVideo.pause();
refreshLayout();
smoothTime=0;
applySeek(0);
startLoop();
},{once:true});

danceVideo.addEventListener('canplaythrough',()=>danceVideo.pause(),{once:true});
danceVideo.addEventListener('loadeddata',()=>danceVideo.pause());

addEventListener('scroll',startLoop,{passive:true});
addEventListener('resize',onLayout,{passive:true});
if(window.visualViewport)visualViewport.addEventListener('resize',onLayout,{passive:true});

danceVideo.load();
}

