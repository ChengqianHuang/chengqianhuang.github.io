import { AssaultGame, W, H, FLOOR, GAPS, STEP, ZOOM, VIEW_W, VIEW_TOP } from './assault-engine.mjs?v=3';
import { drawSoldier, drawEnemy, drawBoss } from './assault-sprites.mjs?v=1';
import { drawBackdrop, drawTerrain, drawWorldDetails } from './assault-environment.mjs?v=1';
const canvas = document.getElementById('assault-canvas');
const ctx = canvas.getContext('2d');
const machine = document.getElementById('assault-machine');
const ui = {};
for (const name of ['overlay','message','description','start','pause','restart','sound','fullscreen','health','lives','score','best','weapon','grenades','zone','time','status','progress']) ui[name] = document.getElementById(`assault-${name}`);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const keys = new Set(), touches = new Map();
let queuedJump = false, queuedGrenade = false, firePulse = 0, movePulse = 0, pulseUntil = 0;
let frameId = 0, last = 0, accumulator = 0, particles = [], labels = [], blasts = [], shake = 0, banner = null;
let best = 0, soundOn = false, audio = null, lastTone = -1, lastUI = '';
try { best = Math.max(0, Number(localStorage.getItem('pixel-assault-best-v1')) || 0); soundOn = localStorage.getItem('pixel-assault-sound-v1') === 'on'; } catch {}
const timeText = seconds => `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${Math.floor(seconds % 60).toString().padStart(2,'0')}`;
function unlockAudio() {
  if (!soundOn) return;
  try { const Context = window.AudioContext || window.webkitAudioContext; if (Context) { audio ||= new Context(); audio.resume().catch(() => {}); } } catch {}
}
function tone(kind) {
  if (!soundOn || !audio || audio.state !== 'running' || audio.currentTime - lastTone < .045) return;
  lastTone = audio.currentTime;
  const oscillator = audio.createOscillator(), gain = audio.createGain();
  const frequency = { shot:480, jump:280, hit:210, explosion:110, blast:65, hurt:140, supply:780, checkpoint:950, bossShot:95, win:1100 }[kind] || 320;
  oscillator.type = ['blast','explosion','shot'].includes(kind) ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * .45, audio.currentTime + .13);
  gain.gain.setValueAtTime(kind === 'shot' ? .018 : .035, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .15);
  oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + .16);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function burst(x, y, color, count) {
  if (reduced.matches) return;
  for (let i = 0; i < count; i++) { const angle = Math.random() * Math.PI * 2, speed = 35 + Math.random() * 170;
    particles.push({ x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, color, age:0 }); }
  if (particles.length > 180) particles.splice(0, particles.length - 180);
}
function effect(event) {
  tone(event.type);
  if (event.type === 'hit') burst(event.x,event.y,'#ffdc84',4);
  if (event.type === 'crate') burst(event.x,event.y,'#c6a46d',12);
  if (['explosion','death','blast'].includes(event.type)) {
    burst(event.x,event.y,'#f4ad61',event.type === 'blast' ? 32 : 17);
    blasts.push({ x:event.x,y:event.y,age:0,big:event.type === 'blast' });
    if (!reduced.matches) shake = event.type === 'blast' ? .18 : .08;
  }
  if (event.type === 'hurt') { if (!reduced.matches) shake = .12; burst(event.x,event.y,'#faf1c2',10); }
  if (event.text) {
    if (['checkpoint','boss'].includes(event.type)) { banner = { text:event.text, age:0 }; ui.status.textContent = event.text; }
    else { labels.push({ x:event.x,y:event.y,age:0,text:event.text,color:event.type === 'supply' ? '#b8ead1' : '#f9dca5' }); if(event.type === 'supply') ui.status.textContent=event.text; }
  }
  if (labels.length > 8) labels.shift();
}
const game = new AssaultGame({ emit:effect });
function clearInput() { keys.clear(); touches.clear(); queuedJump = false; queuedGrenade = false; firePulse = 0; movePulse = 0; document.querySelectorAll('[data-action]').forEach(b => b.classList.remove('held')); }
function updateUI() {
  if (game.score > best) { best=game.score; try { localStorage.setItem('pixel-assault-best-v1',String(best)); } catch {} }
  const p=game.player;
  const weapon=p.weapon === 'rifle' ? '步枪' : `${p.weapon === 'spread' ? '散射枪' : '机枪'} ${Math.ceil(p.weaponTime)}s`;
  const signature=[p.hp,game.lives,game.score,best,weapon,p.grenades,game.zone,Math.floor(game.time),game.mode,game.progress].join('/');
  if(signature===lastUI)return; lastUI=signature;
  ui.health.textContent='♥'.repeat(p.hp)+'♡'.repeat(5-p.hp); ui.health.setAttribute('aria-label',`生命 ${p.hp} / 5`);
  ui.lives.textContent=`${game.lives} 次机会`; ui.score.textContent=String(game.score).padStart(5,'0'); ui.best.textContent=String(best).padStart(5,'0');
  ui.weapon.textContent=weapon; ui.grenades.textContent=`手雷 ×${p.grenades}`; ui.zone.textContent=game.zone; ui.time.textContent=timeText(game.time);
  ui.progress.style.width=`${game.progress}%`; ui.progress.parentElement.setAttribute('aria-valuenow',String(game.progress));
  ui.pause.disabled=!['playing','paused'].includes(game.mode); ui.pause.textContent=game.mode==='paused'?'继续':'暂停'; ui.restart.disabled=game.mode==='ready';
  document.querySelectorAll('[data-action]').forEach(button=>{button.disabled=game.mode!=='playing';});
}
function showOverlay(automatic=false) {
  const messages={
    ready:['像素突围','推进战线，拿下关底装甲车。移动时也能开火，路上记得打开补给箱。','开始突围'],
    paused:['暂停中',automatic?'游戏已自动暂停，回来后继续。':'准备好后，继续刚才的战斗。','继续突围'],
    life:['从检查点继续',`还剩 ${game.lives} 次机会。生命和手雷会补满。`,'继续突围'],
    lost:['任务失败',`得分 ${game.score}，推进了 ${game.progress}%。再试一次，注意躲开弹道和断桥。`,'重新出发'],
    won:['任务完成',`评级 ${game.grade} · ${timeText(game.time)} · ${game.score} 分。少受伤、快速通关，可以冲击 S 评级。`,'再挑战一次'],
  };
  const message=messages[game.mode]; if(!message)return;
  cancelAnimationFrame(frameId); frameId=0; clearInput();
  [ui.message.textContent,ui.description.textContent,ui.start.textContent]=message; ui.overlay.hidden=false;
  updateUI(); ui.status.textContent=`${message[0]}。${message[1]}`; draw();
}
function begin(){
  unlockAudio();
  const entering=game.mode!=='paused';
  if(entering){particles=[];labels=[];blasts=[];banner=null;shake=0;}
  game.start(); clearInput(); ui.overlay.hidden=true; last=0;accumulator=0;updateUI();
  if(!document.fullscreenElement)machine.scrollIntoView({block:'start',behavior:'instant'});
  canvas.focus({preventScroll:true});cancelAnimationFrame(frameId);frameId=requestAnimationFrame(frame);
}
function pause(automatic=false){if(game.mode!=='playing')return;game.mode='paused';showOverlay(automatic);}
function input(){
  const held=new Set(touches.values());
  return {move:Number(keys.has('ArrowRight')||keys.has('d')||held.has('right'))-Number(keys.has('ArrowLeft')||keys.has('a')||held.has('left')) || (performance.now()<pulseUntil?movePulse:0),
    fire:keys.has('j')||held.has('fire')||performance.now()<firePulse,
    jump:keys.has('k')||keys.has(' ')||held.has('jump'),up:keys.has('ArrowUp')||keys.has('w'),jumpPressed:queuedJump,grenadePressed:queuedGrenade};
}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function text(value,x,y,size=14,color='#e6efdc',align='left'){ctx.fillStyle=color;ctx.font=`600 ${size}px ui-monospace, Menlo, monospace`;ctx.textAlign=align;ctx.fillText(value,Math.round(x),Math.round(y));}
function drawCrate(crate) {
  const {x,y}=crate;
  rect(x-1,y+2,34,30,'#16252a'); rect(x,y,32,30,'#8c7252');
  rect(x+2,y+2,28,26,'#bba173'); rect(x+4,y+4,24,23,'#685b46');
  for(let n=0;n<3;n++){rect(x+5,y+5+n*7,22,5,'#8c7957');rect(x+6,y+5+n*7,20,1,'#a18c62');}
  rect(x+2,y+1,3,29,'#d0b989');rect(x+27,y+1,3,29,'#d0b989');
  rect(x+1,y+12,30,5,'#30423d'); rect(x+4,y+13,24,1,'#67796a');
  for(const dx of [3,28])for(const dy of [3,14,27])rect(x+dx,y+dy,1,1,'#edf0c6');
  rect(x+10,y+8,12,13,'#e5c794');text(crate.kind==='health'?'+':crate.kind==='spread'?'S':'H',x+16,y+18,10,'#3d4035','center');
  if(crate.hp===1){rect(x+10,y+18,2,6,'#352e27');rect(x+11,y+23,5,2,'#352e27');}
}
function drawSupply(supply) {
  const x=supply.x,y=supply.y+(reduced.matches?0:Math.sin(game.time*5)*2);
  const health=supply.kind==='health', color=health?'#8ddfc8':'#ffc077';
  rect(x-3,y-3,34,34,'#14272b');rect(x-2,y-2,32,32,color);rect(x,y,28,28,'#294346');
  rect(x+1,y+1,26,1,'#718e7d');rect(x+2,y+24,24,2,'#172e35');
  if(health){rect(x+11,y+6,6,17,'#c5f0d9');rect(x+6,y+11,16,6,'#c5f0d9');}
  else {rect(x+4,y+8,20,5,color);rect(x+7,y+13,5,7,color);rect(x+13,y+13,4,4,'#9e9a77');rect(x+20,y+7,3,1,'#f4e8c9');}
  rect(x-6,y+10,2,8,color);rect(x+32,y+10,2,8,color);
}
function drawBlast(blast) {
  const life=Math.max(0,1-blast.age/.5), radius=(blast.big?15:7)+(reduced.matches?0:blast.age*(blast.big?100:45));
  ctx.save();ctx.translate(Math.round(blast.x),Math.round(blast.y));
  for(let n=0;n<7;n++){
    const angle=n*2.399, distance=radius*(.55+(n%3)*.15), size=Math.max(3,Math.round(radius*(.4+(n%2)*.13)));
    const x=Math.round(Math.cos(angle)*distance/2)*2,y=Math.round(Math.sin(angle)*distance/2)*2;
    ctx.globalAlpha=life*.65;rect(x-size,y-size,size*2,size*2,'#4c4a40');
    ctx.globalAlpha=life;rect(x-size*.7,y-size*.8,size*1.4,size*1.3,'#ce7047');
    rect(x-size*.5,y-size*.6,size,size,'#f8b65f');rect(x-size*.3,y-size*.5,size*.6,size*.65,'#fff1bf');
  }
  if(blast.age<.1){rect(-radius*.6,-2,radius*1.2,4,'#fff9d5');rect(-2,-radius*.6,4,radius*1.2,'#fff9d5');}
  ctx.restore();
}
function draw(){
  ctx.clearRect(0,0,W,H);drawBackdrop(ctx,{camera:game.camera,time:game.time,reduced:reduced.matches,width:W,height:H});ctx.save();
  const camera=Math.round(game.camera);ctx.scale(ZOOM,ZOOM);ctx.translate(-camera,-VIEW_TOP);
  if(shake>0&&!reduced.matches)ctx.translate((Math.random()-.5)*5,(Math.random()-.5)*4);
  drawWorldDetails(ctx,{camera,viewWidth:VIEW_W,floor:FLOOR,time:game.time,reduced:reduced.matches,checkpoint:game.checkpoint});
  drawTerrain(ctx,{solids:game.solids,gaps:GAPS,camera,viewWidth:VIEW_W,floor:FLOOR,time:game.time,reduced:reduced.matches});
  for(const crate of game.crates)if(crate.hp>0&&crate.x>camera-40&&crate.x<camera+VIEW_W+40)drawCrate(crate);
  for(const supply of game.supplies)drawSupply(supply);
  for(const actor of game.enemies)if(actor.hp>0&&actor.x>camera-80&&actor.x<camera+VIEW_W+80)drawEnemy(ctx,actor,{time:game.time,reduced:reduced.matches});
  if(game.boss.x-65<camera+VIEW_W&&game.boss.x+game.boss.w>camera)drawBoss(ctx,game.boss,{time:game.time,reduced:reduced.matches});
  drawSoldier(ctx,game.player,{player:true,time:game.time,aim:game.aim,reduced:reduced.matches});
  for(const bullet of game.bullets){
    if(bullet.wave){rect(bullet.x-8,bullet.y-8,19,12,'#f3ac69');rect(bullet.x-4,bullet.y-13,9,8,'#ffe1a0');}
    else {ctx.strokeStyle=bullet.team==='player'?'#ffe8a6':'#ee794b';ctx.lineWidth=bullet.team==='player'?2:5;ctx.beginPath();ctx.moveTo(bullet.x-bullet.vx*.012,bullet.y-bullet.vy*.012);ctx.lineTo(bullet.x,bullet.y);ctx.stroke();rect(bullet.x-1,bullet.y-1,3,3,bullet.team==='player'?'#fff9d4':'#fff2bd');}
  }
  for(const grenade of game.grenades){const x=grenade.x,y=grenade.y;rect(x-4,y-3,8,7,'#172e30');rect(x-3,y-4,6,9,'#537760');rect(x-2,y-3,3,7,'#b3c78b');rect(x-3,y,6,1,'#324e40');rect(x-1,y-6,4,2,'#e7bb7e');}
  for(const blast of blasts)drawBlast(blast);
  if(!reduced.matches)for(const p of particles){ctx.globalAlpha=1-p.age/.65;rect(p.x,p.y,p.age<.2?3:2,p.age<.2?3:2,p.color);}
  ctx.globalAlpha=1;
  for(const label of labels){ctx.globalAlpha=Math.max(0,1-label.age/.9);text(label.text,label.x,label.y-label.age*28,12,label.color,'center');}ctx.globalAlpha=1;ctx.restore();
  if(game.boss.active&&game.boss.hp>0){rect(190,20,580,28,'#132b2ce6');rect(198,28,564,12,'#344b41');rect(198,28,564*game.boss.hp/game.boss.maxHp,12,'#e1a071');text('装甲车',W/2,17,13,'#fff0bd','center');}
  if(banner&&banner.age<2){ctx.globalAlpha=Math.min(1,banner.age*6,Math.max(0,(2-banner.age)*3));rect(W/2-160,78,320,43,'#1b3837e8');text(banner.text,W/2,107,21,'#f6e7b4','center');ctx.globalAlpha=1;}

}
function frame(now){
  frameId=0;if(game.mode!=='playing')return;
  const elapsed=last?Math.min((now-last)/1000,.05):0;last=now;accumulator+=elapsed;
  while(accumulator>=STEP&&game.mode==='playing'){game.step(STEP,input());queuedJump=false;queuedGrenade=false;accumulator-=STEP;}
  for(const p of particles){p.age+=elapsed;p.x+=p.vx*elapsed;p.y+=p.vy*elapsed;p.vy+=280*elapsed;}
  for(const label of labels)label.age+=elapsed;for(const blast of blasts)blast.age+=elapsed;if(banner)banner.age+=elapsed;
  particles=particles.filter(p=>p.age<.65);labels=labels.filter(p=>p.age<.9);blasts=blasts.filter(p=>p.age<.5);shake=Math.max(0,shake-elapsed);
  updateUI();draw();if(game.mode==='playing')frameId=requestAnimationFrame(frame);else showOverlay();
}
function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.imageSmoothingEnabled=false;draw();}
const gameKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','a','d','w','j','k','l',' ','Escape']);
machine.addEventListener('keydown',event=>{
  const key=event.key.length===1?event.key.toLowerCase():event.key;if(!gameKeys.has(key)||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.target.closest('button')&&[' ','Escape'].includes(key)){if(key==='Escape'){event.preventDefault();if(!event.repeat)game.mode==='paused'?begin():pause();}return;}
  event.preventDefault();if(key==='Escape'){if(!event.repeat)game.mode==='paused'?begin():pause();return;}
  if(game.mode!=='playing')return;keys.add(key);if(!event.repeat&&key==='j')firePulse=performance.now()+110;if(!event.repeat&&(key==='k'||key===' '))queuedJump=true;if(!event.repeat&&key==='l')queuedGrenade=true;
});
machine.addEventListener('keyup',event=>{const key=event.key.length===1?event.key.toLowerCase():event.key;if(!gameKeys.has(key))return;if(!(event.target.closest('button')&&key===' '))event.preventDefault();keys.delete(key);});
canvas.addEventListener('pointerdown',()=>{canvas.focus({preventScroll:true});});
for(const button of document.querySelectorAll('[data-action]')){
  button.addEventListener('pointerdown',event=>{if(game.mode!=='playing'||event.button>0)return;event.preventDefault();button.setPointerCapture(event.pointerId);touches.set(event.pointerId,button.dataset.action);button.classList.add('held');if(button.dataset.action==='fire')firePulse=performance.now()+130;if(button.dataset.action==='jump')queuedJump=true;if(button.dataset.action==='grenade')queuedGrenade=true;});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,event=>{touches.delete(event.pointerId);button.classList.remove('held');});
  button.addEventListener('contextmenu',event=>event.preventDefault());
  button.addEventListener('click',event=>{if(event.detail!==0||game.mode!=='playing')return;const action=button.dataset.action;if(action==='fire')firePulse=performance.now()+200;else if(action==='jump')queuedJump=true;else if(action==='grenade')queuedGrenade=true;else{movePulse=action==='left'?-1:1;pulseUntil=performance.now()+220;}});
}
machine.addEventListener('focusout',event=>{if(event.relatedTarget&&machine.contains(event.relatedTarget))return;queueMicrotask(()=>{if(!machine.contains(document.activeElement))pause(true);});});
ui.start.addEventListener('click',begin);ui.pause.addEventListener('click',()=>game.mode==='paused'?begin():pause());ui.restart.addEventListener('click',()=>{game.mode='ready';begin();});
function updateSound(){ui.sound.textContent=soundOn?'音效开':'音效关';ui.sound.setAttribute('aria-label',soundOn?'关闭音效':'开启音效');ui.sound.setAttribute('aria-pressed',String(soundOn));}
ui.sound.addEventListener('click',()=>{soundOn=!soundOn;unlockAudio();updateSound();try{localStorage.setItem('pixel-assault-sound-v1',soundOn?'on':'off');}catch{}});
if(!machine.requestFullscreen)ui.fullscreen.hidden=true;
ui.fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await machine.requestFullscreen();}catch{ui.status.textContent='当前浏览器暂不支持全屏，可以横屏游玩。';}});
document.addEventListener('fullscreenchange',()=>{ui.fullscreen.textContent=document.fullscreenElement?'退出全屏':'全屏';resize();});
addEventListener('blur',()=>pause(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
new IntersectionObserver(entries=>{if(entries[0].intersectionRatio<.08)pause(true);},{threshold:[0,.08]}).observe(canvas);
new ResizeObserver(resize).observe(canvas);reduced.addEventListener('change',()=>{particles=[];labels=[];blasts=[];shake=0;draw();});
updateSound();updateUI();resize();
