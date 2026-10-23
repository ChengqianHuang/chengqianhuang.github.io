import { AssaultGame, W, H, FLOOR, GAPS, STEP, ZOOM, VIEW_W, VIEW_TOP } from './assault-engine.mjs?v=2';
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
function background(){
  const gradient=ctx.createLinearGradient(0,0,0,H);gradient.addColorStop(0,'#112f3e');gradient.addColorStop(.7,'#62765e');gradient.addColorStop(1,'#c2a16c');ctx.fillStyle=gradient;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#dfc58c';ctx.beginPath();ctx.arc(740-game.camera*.045,105,44,0,Math.PI*2);ctx.fill();
  const offset=(game.camera*.12)%360;
  for(let i=-1;i<4;i++){
    const x=i*360-offset;ctx.fillStyle='#304d4d';ctx.beginPath();ctx.moveTo(x-30,330);ctx.lineTo(x+80,180);ctx.lineTo(x+145,250);ctx.lineTo(x+230,155);ctx.lineTo(x+390,330);ctx.fill();
  }
  const near=(game.camera*.3)%420;
  for(let i=-1;i<4;i++){
    const x=i*420-near;rect(x,260,108,194,'#284444');rect(x+7,251,96,9,'#355453');rect(x+135,315,145,139,'#304b48');rect(x+160,250,16,65,'#304b48');
    rect(x+300,285,92,169,'#29423f');rect(x+323,225,17,60,'#29423f');
    for(let floor=0;floor<4;floor++)for(let window=0;window<4;window++)rect(x+13+window*22,278+floor*34,9,14,(floor+window)%3===0?'#a49460':'#426057');
    rect(x+148,338,115,3,'#587064');rect(x+310,310,72,3,'#587064');
  }
}
function soldier(actor,player=false){
  if(player&&actor.invincible>0&&!reduced.matches&&Math.floor(game.time*14)%2===0)return;
  const moving=player?Math.abs(actor.vx)>35:actor.type==='soldier'||actor.type==='elite';
  const stride=moving?Math.sin(game.time*15+actor.x*.03)*2:0;
  const facing=player?actor.facing:actor.direction;
  ctx.save();ctx.translate(Math.round(actor.x+actor.w/2),Math.round(actor.y+actor.h));ctx.scale(facing*2,2);
  const uniform=player?'#8fa16a':actor.type==='elite'?'#a66e4f':'#827c5a',dark=player?'#43584a':'#504a3b';
  rect(-5,-20,9,4,player?'#445e50':'#4e5141');rect(-4,-16,8,6,'#d8b18a');rect(2,-15,2,2,'#233d3c');
  rect(-6,-18,12,2,player?'#e9ab69':'#b9ad76');rect(-5,-10,10,7,uniform);rect(-7,-11,3,8,dark);rect(-3,-9,2,5,'#c1b483');
  rect(-4,-4+stride,3,4-stride,dark);rect(1,-4-stride,3,4+stride,dark);rect(-5,-1+stride,5,2,'#202f2c');rect(1,-1-stride,5,2,'#202f2c');
  ctx.save();ctx.translate(2,-11);
  if(player)ctx.rotate(Math.atan2(game.aim.y,Math.abs(game.aim.x)));
  rect(0,-1,11,3,'#263d3b');rect(4,-2,5,2,'#899b8d');rect(-1,0,4,2,'#d8b18a');
  if(player&&actor.muzzle>0){rect(12,-3,5,6,'#ffd887');rect(16,-1,4,2,'#fff5c1');}
  ctx.restore();ctx.restore();
}
function enemy(actor){
  if(actor.type==='turret'){
    rect(actor.x-3,actor.y+22,40,8,'#233b37');rect(actor.x+3,actor.y+8,28,17,'#7b8a6a');rect(actor.x+7,actor.y+3,20,9,'#9da87c');
    rect(actor.x+(actor.direction<0?-11:20),actor.y+7,25,7,'#445a4c');rect(actor.x+12,actor.y+11,7,5,actor.timer<.3?'#ffd183':'#cc9460');
  }else if(actor.type==='drone'){
    rect(actor.x+3,actor.y+6,30,15,'#6c8580');rect(actor.x+8,actor.y+3,20,7,'#a6b6a1');rect(actor.x+13,actor.y+14,9,5,'#e8b16d');
    rect(actor.x-6,actor.y,48,3,'#263d3b');rect(actor.x+13,actor.y-3,9,3,'#a6b6a1');rect(actor.x+6,actor.y+21,4,5,'#283e3a');rect(actor.x+25,actor.y+21,4,5,'#283e3a');
  }else soldier(actor);
  if(actor.flash>0){ctx.globalAlpha=.6;rect(actor.x,actor.y,actor.w,actor.h,'#ffe7a1');ctx.globalAlpha=1;}
}
function boss(){
  const b=game.boss;if(b.hp<=0)return;const x=b.x,y=b.y;
  rect(x-8,y+83,166,29,'#203734');rect(x+2,y+87,146,22,'#344b40');
  for(let i=0;i<6;i++){ctx.fillStyle='#7b8564';ctx.beginPath();ctx.arc(x+12+i*25,y+98,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#2c4239';ctx.beginPath();ctx.arc(x+12+i*25,y+98,4,0,Math.PI*2);ctx.fill();}
  rect(x-3,y+40,158,47,'#71835c');rect(x+8,y+33,135,8,'#a4ae77');rect(x+20,y+6,104,36,'#8a9667');rect(x+34,y,76,7,'#b3b984');
  rect(x+1,y+51,145,7,'#b0a476');rect(x+10,y+65,24,15,'#344e3c');rect(x+47,y+65,85,15,'#566e4c');
  rect(x-48,y+20,85,13,'#344b40');rect(x-53,y+18,12,17,'#7c8e6e');rect(x-49,y+22,6,8,'#1f3430');
  rect(x+54,y+11,29,14,b.active&&b.timer<.55?'#ffd383':'#32483d');rect(x+59,y+15,19,3,'#d7b77f');
  for(const off of [12,39,112,138]){rect(x+off,y+44,3,3,'#c1c390');rect(x+off,y+81,3,3,'#344a3b');}
  if(b.active&&b.timer<.55){ctx.globalAlpha=.35+(Math.sin(game.time*22)+1)*.2;rect(x-55,y+16,18,21,'#f9ab62');ctx.globalAlpha=1;}
  if(b.flash>0){ctx.globalAlpha=.35;rect(x,y,152,90,'#fff0bf');ctx.globalAlpha=1;}
}
function draw(){
  ctx.clearRect(0,0,W,H);background();ctx.save();
  const camera=Math.round(game.camera);ctx.scale(ZOOM,ZOOM);ctx.translate(-camera,-VIEW_TOP);
  if(shake>0&&!reduced.matches)ctx.translate((Math.random()-.5)*5,(Math.random()-.5)*4);
  for(const platform of game.solids){
    if(platform.x+platform.w<camera||platform.x>camera+VIEW_W)continue;
    rect(platform.x,platform.y,platform.w,platform.h,platform.oneWay?'#314c43':'#263e37');rect(platform.x,platform.y,platform.w,5,platform.oneWay?'#8b9b71':'#93a072');
    rect(platform.x,platform.y+5,platform.w,4,'#566b4e');
    for(let x=platform.x+9;x<platform.x+platform.w;x+=24){rect(x,platform.y+10,9,3,'#415846');if(!platform.oneWay)rect(x+8,platform.y+29,11,4,'#334b3b');}
    if(platform.oneWay){rect(platform.x+12,platform.y+16,6,FLOOR-platform.y-16,'#263f37');rect(platform.x+platform.w-18,platform.y+16,6,FLOOR-platform.y-16,'#263f37');}
  }
  for(const [start,end]of GAPS){rect(start,FLOOR+9,end-start,90,'#132d2d');for(let x=start;x<end;x+=18){rect(x,FLOOR+10,8,3,'#b97951');}rect(start-22,FLOOR-32,3,32,'#9c9f75');rect(start-20,FLOOR-32,14,11,'#e2af63');}
  for(const checkpoint of [2200,4200]){rect(checkpoint-8,FLOOR-78,4,78,'#b4b88e');rect(checkpoint-4,FLOOR-76,40,22,game.checkpoint>=checkpoint?'#8ecaae':'#637c67');rect(checkpoint+3,FLOOR-70,22,4,'#d8e7b2');}
  for(const crate of game.crates){if(crate.hp<=0)continue;rect(crate.x,crate.y,32,32,'#5f5940');rect(crate.x+2,crate.y+2,28,28,'#a38c58');rect(crate.x+5,crate.y+5,22,22,'#796e47');rect(crate.x+4,crate.y+13,24,5,'#c2a66e');rect(crate.x+13,crate.y+4,5,24,'#c2a66e');}
  for(const supply of game.supplies){const y=supply.y+Math.sin(game.time*5)*3;rect(supply.x-2,y-2,32,32,'#314f43');rect(supply.x,y,28,28,supply.kind==='health'?'#9bc6a2':'#edc77c');text(supply.kind==='health'?'+':supply.kind==='spread'?'S':'H',supply.x+14,y+21,21,'#263d35','center');}
  for(const actor of game.enemies)if(actor.hp>0&&actor.x>camera-80&&actor.x<camera+VIEW_W+80)enemy(actor);
  boss();soldier(game.player,true);
  for(const bullet of game.bullets){
    if(bullet.wave){rect(bullet.x-8,bullet.y-8,19,12,'#f3ac69');rect(bullet.x-4,bullet.y-13,9,8,'#ffe1a0');}
    else {ctx.strokeStyle=bullet.team==='player'?'#fff0a4':'#f0a26b';ctx.lineWidth=bullet.team==='player'?3:5;ctx.beginPath();ctx.moveTo(bullet.x-bullet.vx*.012,bullet.y-bullet.vy*.012);ctx.lineTo(bullet.x,bullet.y);ctx.stroke();}
  }
  for(const grenade of game.grenades){rect(grenade.x-4,grenade.y-4,9,9,'#b9cc92');rect(grenade.x-1,grenade.y-7,4,4,'#f5d27d');}
  for(const blast of blasts){const radius=(blast.big?26:12)+blast.age*(blast.big?150:75);ctx.globalAlpha=Math.max(0,1-blast.age/.5);ctx.fillStyle=blast.age<.15?'#ffe7a0':'#dba46b';ctx.beginPath();ctx.arc(blast.x,blast.y,radius,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  if(!reduced.matches)for(const p of particles){ctx.globalAlpha=1-p.age/.65;rect(p.x,p.y,4,4,p.color);}
  ctx.globalAlpha=1;
  for(const label of labels){ctx.globalAlpha=Math.max(0,1-label.age/.9);text(label.text,label.x,label.y-label.age*28,16,label.color,'center');}ctx.globalAlpha=1;ctx.restore();
  if(game.boss.active&&game.boss.hp>0){rect(190,20,580,28,'#132b2ce6');rect(198,28,564,12,'#344b41');rect(198,28,564*game.boss.hp/game.boss.maxHp,12,'#e1a071');text('装甲车',W/2,17,13,'#fff0bd','center');}
  if(banner&&banner.age<2){ctx.globalAlpha=Math.min(1,banner.age*6,Math.max(0,(2-banner.age)*3));rect(W/2-160,78,320,43,'#1b3837e8');text(banner.text,W/2,107,21,'#f6e7b4','center');ctx.globalAlpha=1;}
  ctx.fillStyle='#0c20250b';for(let y=0;y<H;y+=4)ctx.fillRect(0,y,W,1);
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
