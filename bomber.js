import {BomberGame,STEP,DIRS} from './bomber-engine.mjs?v=1';
import {drawBoard,COLORS,WIDTH,HEIGHT} from './bomber-art.mjs?v=1';
const $=id=>document.getElementById(`bomber-${id}`),canvas=$('canvas'),ctx=canvas.getContext('2d'),machine=$('machine'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const keys=new Map(),touches=new Map();let bomb1=false,bomb2=false,frameID=0,last=0,acc=0,sound=false,audio=null,lastTone=0,notice='',noticeUntil=0,signature='';
const names=()=>game.mode==='duo'?['1P','2P','电脑 A','电脑 B']:['你','电脑 A','电脑 B','电脑 C'];
function beep(type){if(!sound)return;try{audio||=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});if(audio.currentTime-lastTone<.035)return;lastTone=audio.currentTime;const o=audio.createOscillator(),g=audio.createGain();o.type=type==='blast'?'triangle':'sine';o.frequency.setValueAtTime(({place:330,blast:110,pickup:780,out:190,finish:960,wall:90})[type]||200,audio.currentTime);o.frequency.exponentialRampToValueAtTime(type==='finish'?520:70,audio.currentTime+.18);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.21);o.onended=()=>{o.disconnect();g.disconnect();};}catch{}}
const game=new BomberGame({emit:e=>{beep(e.type);if(e.type==='out'){notice=`${names()[e.id]}已出局`;noticeUntil=game.time+3;$('status').textContent=notice;}if(e.type==='pickup'&&e.id===0){notice=({bomb:'炸弹数量 +1',fire:'爆炸火力 +1',speed:'移动速度提升'})[e.kind];noticeUntil=game.time+2;$('status').textContent=notice;}}});
function clear(){keys.clear();touches.clear();bomb1=bomb2=false;document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
function paint(){drawBoard(ctx,game,{reduced:reduced.matches});}
function update(){
 const t=Math.max(0,Math.ceil(120-game.time)),p=game.players[0],n=names(),stats=`${n[0]}：炸弹 ${p.capacity} · 火力 ${p.range} · 速度 ${1+Math.round((p.speed-3.7)/.35)}`;
 const hint=noticeUntil>game.time?notice:!p.alive&&game.mode==='solo'?'你已出局 · 观战中，可点重开再来':game.time>=90?'正在缩圈！向场地中央移动':game.time>=86?'即将缩圈，远离场地外围':'炸弹约 2 秒后爆炸，记得转弯躲避';
 const s=[t,stats,hint,game.state,game.mode,game.round,...game.scores,...game.players.map(p=>p.alive)].join('|');if(s===signature)return;signature=s;
 $('clock').textContent=`${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;$('round').textContent=`第 ${game.round} 局 · 先赢两局`;$('stats').textContent=stats;$('hint').textContent=hint;
 for(const [side,ids]of [['left',[0,2]],['right',[1,3]]])$('teams-'+side).innerHTML=ids.map(id=>`<div class="bomber-team ${game.players[id].alive?'':'out'}" aria-label="${n[id]}，${game.scores[id]} 胜${game.players[id].alive?'':'，已出局'}"><span class="bomber-chip" style="--color:${COLORS[id]}"></span><span class="name">${n[id]}</span><strong>${game.scores[id]}</strong></div>`).join('');
 $('pause').disabled=!['playing','paused'].includes(game.state);$('pause').textContent=game.state==='paused'?'继续':'暂停';$('restart').disabled=game.state==='ready';
 $('help').textContent=game.mode==='duo'?'1P：WASD 移动 / F 放弹 · 2P：方向键移动 / Enter 放弹 · Esc 暂停':'方向键 / WASD 移动 · Space / J 放炸弹 · Esc 暂停';
 for(const b of document.querySelectorAll('[data-dir],#bomber-drop'))b.disabled=game.state!=='playing'||!game.players[0].alive;
}
function overlay(){
 cancelAnimationFrame(frameID);frameID=0;clear();const finished=game.state==='finished',r=game.result;
 let title='炸弹竞技场',description=game.mode==='duo'?'两位玩家共用键盘，与两个电脑同场对战。1P 用 WASD / F，2P 用方向键 / Enter。':'你是左上角的白色小人。炸开木箱、拾取道具，躲开十字火焰，成为最后站着的人。',button='开始对战';
 if(game.state==='paused'){title='暂停中';description='时间和炸弹都已暂停，准备好再继续。';button='继续对战';}
 if(finished){title=r.winner===null?'平局':`${names()[r.winner]}${r.match?'赢得本场':'拿下这一局'}`;description=r.match?'率先赢得两局！再开一场，换个场地试试。':r.winner===null?'没有人幸存。下一局重新争夺胜利。':`当前比分 ${game.scores.join(' : ')}。率先赢得两局即可获胜。`;button=r.match?'再来一场':'下一局';}
 $('message').textContent=title;$('description').textContent=description;$('start').textContent=button;$('overlay').hidden=false;$('status').textContent=`${title}。${description}`;update();paint();if(game.state==='paused'&&!machine.classList.contains('is-expanded'))machine.scrollIntoView({block:'start',behavior:'instant'});
}
function begin(){if(game.state==='finished'){if(game.result.match)game.reset();else game.next();}if(game.state==='paused')game.state='playing';game.start();clear();$('overlay').hidden=true;notice='';noticeUntil=0;last=acc=0;update();if(!machine.classList.contains('is-expanded'))machine.scrollIntoView({block:'start',behavior:'instant'});canvas.focus({preventScroll:true});cancelAnimationFrame(frameID);frameID=requestAnimationFrame(frame);}
function pause(){if(game.state!=='playing')return;game.state='paused';overlay();}
function direction(id){const options=id===1?[['ArrowUp',0],['ArrowRight',1],['ArrowDown',2],['ArrowLeft',3]]:game.mode==='duo'?[['w',0],['d',1],['s',2],['a',3]]:[['w',0],['d',1],['s',2],['a',3],['ArrowUp',0],['ArrowRight',1],['ArrowDown',2],['ArrowLeft',3]];const pressed=options.filter(([k])=>keys.has(k)).sort((a,b)=>keys.get(b[0])-keys.get(a[0]));if(id===0&&touches.size){const d=[...touches.values()].at(-1);return DIRS[d];}return pressed.length?DIRS[pressed[0][1]]:null;}
function frame(now){frameID=0;if(game.state!=='playing')return;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;acc+=dt;
 while(acc>=STEP&&game.state==='playing'){game.step(STEP,{0:{dir:direction(0),bomb:bomb1},1:{dir:direction(1),bomb:bomb2}});bomb1=bomb2=false;acc-=STEP;}
 update();paint();if(game.state==='playing')frameID=requestAnimationFrame(frame);else overlay();}
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!r.width)return;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(canvas.width/WIDTH,0,0,canvas.height/HEIGHT,0,0);ctx.imageSmoothingEnabled=false;paint();}
const controlKeys=new Set(['w','a','s','d','ArrowUp','ArrowRight','ArrowDown','ArrowLeft',' ','j','f','Enter','Escape']);
machine.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(!controlKeys.has(k)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.target.closest('button,select')&&[' ','Enter'].includes(k))return;e.preventDefault();if(k==='Escape'){if(!e.repeat)game.state==='paused'?begin():pause();return;}if(game.state!=='playing')return;if(!e.repeat)keys.set(k,performance.now());if(!e.repeat){if(game.mode==='duo'){if(k==='f')bomb1=true;if(k==='Enter')bomb2=true;}else if(k===' '||k==='j'||k==='f')bomb1=true;}});
machine.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(controlKeys.has(k))keys.delete(k);});
canvas.addEventListener('pointerdown',()=>canvas.focus({preventScroll:true}));
function nudge(d){const a=game.players[0];if(game.state!=='playing'||!a.alive||a.travel)return;const x=Math.round(a.x)+DIRS[d][0],y=Math.round(a.y)+DIRS[d][1];if(game.pass(x,y,a)){a.dir=d;a.travel={sx:a.x,sy:a.y,x,y,t:0};}}
for(const b of document.querySelectorAll('[data-dir]')){b.addEventListener('pointerdown',e=>{if(game.state!=='playing'||e.button>0)return;e.preventDefault();b.setPointerCapture(e.pointerId);const d=['up','right','down','left'].indexOf(b.dataset.dir);touches.set(e.pointerId,d);nudge(d);b.classList.add('held');});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{touches.delete(e.pointerId);b.classList.remove('held');});b.addEventListener('click',e=>{if(e.detail===0)nudge(['up','right','down','left'].indexOf(b.dataset.dir));});}
$('drop').addEventListener('pointerdown',e=>{if(game.state==='playing'){e.preventDefault();bomb1=true;}});$('drop').addEventListener('click',e=>{if(e.detail===0)bomb1=true;});
for(const b of document.querySelectorAll('.bomber-touch button'))b.addEventListener('contextmenu',e=>e.preventDefault());
$('start').addEventListener('click',begin);$('pause').addEventListener('click',()=>game.state==='paused'?begin():pause());$('restart').addEventListener('click',()=>{game.reset();begin();});
for(const id of ['mode','arena'])$(id).addEventListener('change',()=>{game.reset({mode:$('mode').value,arena:$('arena').value});signature='';overlay();});
$('sound').addEventListener('click',()=>{sound=!sound;$('sound').textContent=sound?'音效开':'音效关';$('sound').setAttribute('aria-pressed',String(sound));if(sound)beep('pickup');});
let previousOverflow='';
$('fullscreen').addEventListener('click',()=>{const expanded=machine.classList.toggle('is-expanded');if(expanded){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}else document.body.style.overflow=previousOverflow;$('fullscreen').textContent=expanded?'退出全屏':'全屏';clear();resize();});
addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});machine.addEventListener('focusout',()=>queueMicrotask(()=>{if(!machine.contains(document.activeElement))pause();}));new IntersectionObserver(es=>{if(es[0].intersectionRatio<.08)pause();},{threshold:[0,.08]}).observe(canvas);new ResizeObserver(resize).observe(canvas);reduced.addEventListener('change',paint);update();resize();overlay();
