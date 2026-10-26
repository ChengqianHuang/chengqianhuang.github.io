import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createEngine,aimDirection} from './engine.mjs';
import {createWorld} from './world.mjs';
import {LEVELS,MATERIALS,AMMO,readSave} from './levels.mjs';

const $=id=>document.getElementById(id),canvas=$('scene'),stage=$('site'),reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
let renderer,camera,controls,world,engine,phase='loading',index=0,ammo='breaker',muted=false,slow=false,autoSlow=0,quality='high',last=0,accumulator=0,noticeTime=0,audio,aimHit=null,pointerDown=null,frames=0,fpsTime=0,hudTime=0,recording=[],recordStep=0,recordingShot=false,replayTime=0,returnPhase='play',resultShown=false;
let save={};try{save=readSave(localStorage.getItem('demolition-records-v1'));}catch{}
const requested=new URL(location.href).searchParams.get('level');if(requested&&LEVELS.some(l=>l.id===requested))index=LEVELS.findIndex(l=>l.id===requested);
const raycaster=new T.Raycaster(),pointer=new T.Vector2(),homePosition=new T.Vector3(),homeTarget=new T.Vector3();
function overlay(id){for(const name of ['loading','menu','pause','results','failure'])$(name).hidden=name!==id;}
function focus(id){requestAnimationFrame(()=>$(id).focus({preventScroll:true}));}
function notice(text,seconds=2.5){$('notice').textContent=text;$('notice').hidden=false;noticeTime=seconds;}
function resize(){if(!renderer)return;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='high'?1.5:1));renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();}
function setQuality(){quality=$('quality').value;renderer.shadowMap.enabled=quality==='high';world.sun.castShadow=quality==='high';resize();}
function home(){const height=Math.max(...engine.level.buildings.map(b=>b.floors))*2.9,scale=height<8?.76:height<11?.9:1;homeTarget.set(0,height*.39,0);homePosition.set(22*scale,(height*.65+11)*scale,29*scale);camera.position.copy(homePosition);controls.target.copy(homeTarget);controls.update();}
function menuLabels(){
  const l=LEVELS[index];$('job-number').textContent=l.sandbox?'FREE PLAY':`CONTRACT ${String(index+1).padStart(2,'0')}`;$('job-title').textContent=l.name;$('job-hint').textContent=l.hint;
  $('job-ammo').textContent=l.sandbox?'不限弹药':`${l.ammo} 发`;$('job-goal').textContent=l.sandbox?'随便拆':`${Math.round(l.goal*100)}% 降到黄线下`;$('job-stars').textContent=l.sandbox?'':save[l.id]?'★'.repeat(save[l.id])+'☆'.repeat(3-save[l.id]):'尚未完成';
  document.querySelectorAll('.level-button').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.querySelector('i').textContent=save[LEVELS[i].id]?'★'.repeat(save[LEVELS[i].id]):'';});
  $('hud-number').textContent=$('job-number').textContent;$('hud-title').textContent=l.name;$('hud-goal').textContent=l.sandbox?'自由拆楼 · 无限弹药':`验收线 ${l.line.toFixed(1)} 米 · 留意底层支撑`;
  $('goal-marker').textContent=l.sandbox?'自由':`目标 ${Math.round(l.goal*100)}%`;$('play-hint').textContent=l.protect?'蓝色小屋需要保留':'先打底层，等它倒下来';
}
function resetAim(){
  const candidates=engine.blocks.filter(e=>e.role==='column'&&e.anchor).sort((a,b)=>b.z-a.z||Math.abs(a.x)-Math.abs(b.x)),target=candidates[0];
  aimHit=target?{point:new T.Vector3(target.x,target.y,target.z),object:{userData:{block:target}}}:null;
  $('aim-label').textContent=target?`${MATERIALS[target.kind].name} · 支撑柱 · 点击开炮`:'点击建筑上的位置开炮';
}
function loadLevel(next,toMenu=true){
  index=next;engine.load(LEVELS[index]);world.reset(engine);world.sync(engine.snapshot());world.showEffects(true);home();resetAim();
  recording=[];recordingShot=false;recordStep=0;autoSlow=0;accumulator=0;resultShown=false;noticeTime=0;$('notice').hidden=true;$('replay-banner').hidden=true;menuLabels();
  const url=new URL(location.href);url.searchParams.set('level',LEVELS[index].id);history.replaceState(null,'',url);
  if(toMenu){phase='menu';overlay('menu');$('hud').hidden=true;controls.enabled=false;audio?.mute(true);focus('start');}else start();
  updateHud();
}
function start(){phase='play';overlay(null);$('hud').hidden=false;controls.enabled=true;canvas.focus({preventScroll:true});audio??=createAudio();audio?.ctx.resume();audio?.mute(muted);notice(LEVELS[index].hint,4);last=performance.now();accumulator=0;}
function pause(){if(phase==='replay'){endReplay();if(phase!=='play')return;}if(phase!=='play')return;phase='paused';overlay('pause');controls.enabled=false;audio?.mute(true);focus('resume');}
function resume(){if(phase!=='paused')return;phase='play';overlay(null);controls.enabled=true;last=performance.now();accumulator=0;audio?.mute(muted);canvas.focus({preventScroll:true});}
function updateHud(){
  if(!engine)return;const s=engine.stats,l=LEVELS[index];$('progress').textContent=`${Math.round(s.progress*100)}%`;$('progress-fill').style.width=`${s.progress*100}%`;
  $('ammo-left').textContent=l.sandbox?'∞':s.left;$('shot-status').textContent=s.cooldown>0?'装填中…':s.left===0?'等待验收':s.shots?'看准再补一炮':'寻找底层支撑';
  $('fire').disabled=phase!=='play'||!engine.canFire();$('replay').disabled=!['play','result','paused'].includes(phase)||recording.length<8;$('slow').disabled=phase!=='play';
  $('protected-status').hidden=!l.protect;if(l.protect){$('protected-status').textContent=`小屋完好度 ${Math.ceil(s.health)}% · 至少 ${l.protect.min}%`;$('protected-status').style.color=s.health<80?'#ffb79a':'#b9ddc1';}
}
function updateAim(event){
  const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(world.pickables,false)[0];aimHit=hit||null;
  const e=hit?.object.userData.block;$('aim-label').textContent=hit?.object.userData.protected?'保护目标 · 请避开这间小屋':e?`${MATERIALS[e.kind].name}${e.role==='column'?' · 支撑柱':''} · 点击开炮`:'点击建筑上的位置开炮';world.aim(hit,camera);
}
function fire(){
  if(phase!=='play')return;if(!engine.canFire()){if(!engine.stats.left)notice('弹药用完了，等待现场落定。');return;}
  if(!aimHit){notice('先把准星移到建筑上。');return;}
  const target=aimHit.point,origin=camera.position.clone();origin.addScaledVector(new T.Vector3().subVectors(target,origin).normalize(),2.3);
  if(engine.fire(origin,aimDirection(origin,target),ammo)){recording=[{time:0,state:engine.snapshot()}];recordingShot=true;recordStep=0;audio?.play('shot');canvas.focus({preventScroll:true});updateHud();}
}
function showResult(){
  const s=engine.stats,r=s.result;if(!r||resultShown)return;resultShown=true;phase='result';overlay('results');controls.enabled=false;audio?.mute(true);
  $('result-title').textContent=r.win?'这单，收工。':'这单得返工';$('result-label').textContent=r.win?'CONTRACT COMPLETE':'TRY ANOTHER ANGLE';$('result-stars').textContent=r.win?'★'.repeat(r.stars)+'☆'.repeat(3-r.stars):'↺';
  $('result-description').textContent=r.reason+(r.win?'。下一栋等着你。':'。试试换个角度，优先处理底层支撑。');$('result-progress').textContent=`${Math.round(s.progress*100)}%`;$('result-shots').textContent=`${s.shots} / ${engine.level.ammo}`;$('result-health').textContent=engine.level.protect?`${Math.ceil(s.health)}%`:'—';
  $('next').hidden=!r.win;$('next').textContent=index===5?'去自由拆楼场 →':'下一单 →';$('result-replay').disabled=recording.length<8;
  if(r.win){save[engine.level.id]=Math.max(save[engine.level.id]||0,r.stars);try{localStorage.setItem('demolition-records-v1',JSON.stringify(save));}catch{}menuLabels();}focus(r.win?'next':'retry');updateHud();
}
function beginReplay(){if(recording.length<8||!['play','result','paused'].includes(phase))return;returnPhase=phase;phase='replay';overlay(null);$('hud').hidden=true;$('replay-banner').hidden=false;controls.enabled=true;replayTime=0;world.showEffects(false);audio?.mute(true);updateHud();focus('end-replay');}
function endReplay(){if(phase!=='replay')return;phase=returnPhase;$('replay-banner').hidden=true;$('hud').hidden=false;overlay(phase==='result'?'results':phase==='paused'?'pause':null);controls.enabled=phase==='play';world.showEffects(true);world.sync(engine.snapshot());last=performance.now();accumulator=0;audio?.mute(muted||phase!=='play');updateHud();if(phase==='play')canvas.focus({preventScroll:true});else focus(phase==='paused'?'resume':'result-replay');}
function toggleSlow(){if(phase!=='play')return;slow=!slow;$('slow').textContent=slow?'慢动作：0.35×':'慢动作：关';$('slow').setAttribute('aria-pressed',String(slow));}
function createAudio(){
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;const ctx=new Audio(),master=ctx.createGain();master.gain.value=muted?0:.2;master.connect(ctx.destination);
  const buffer=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  let lastSound=0;
  return {ctx,mute(value){master.gain.setTargetAtTime(value?0:.2,ctx.currentTime,.04);},play(kind){
    if(muted)return;const now=ctx.currentTime;if(kind!=='shot'&&now-lastSound<.07)return;lastSound=now;
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type='lowpass';filter.frequency.value=kind==='glass'?4500:kind==='shot'?1000:650;gain.gain.setValueAtTime(kind==='shot'?.9:.5,now);gain.gain.exponentialRampToValueAtTime(.001,now+.55);src.connect(filter);filter.connect(gain);gain.connect(master);src.start();src.stop(now+.6);src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect();};
    if(kind==='shot'||kind==='impact'){const osc=ctx.createOscillator(),g=ctx.createGain();osc.frequency.setValueAtTime(110,now);osc.frequency.exponentialRampToValueAtTime(30,now+.3);g.gain.setValueAtTime(.6,now);g.gain.exponentialRampToValueAtTime(.001,now+.4);osc.connect(g);g.connect(master);osc.start();osc.stop(now+.45);osc.onended=()=>{osc.disconnect();g.disconnect();};}
  }};
}
function frame(now){
  if(phase==='failed')return;const dt=Math.min(.08,(now-last)/1000||1/60);last=now;noticeTime=Math.max(0,noticeTime-dt);if(!noticeTime)$('notice').hidden=true;autoSlow=Math.max(0,autoSlow-dt);
  if(phase==='play'){
    accumulator+=dt*(slow?.35:autoSlow>0?.25:1);let steps=0;
    while(accumulator>=1/60&&steps++<5&&phase==='play'){
      engine.step(1/60);accumulator-=1/60;
      if(recordingShot&&++recordStep%3===0){recording.push({time:recordStep/60,state:engine.snapshot()});if(recordStep>=600)recordingShot=false;}
      for(const event of engine.takeEvents()){world.emit(event);if(event.type==='impact'){audio?.play('impact');if(event.last&&!reduced){autoSlow=2.5;notice('最后一炮 · 慢动作',2.5);}}else if(event.type==='break')audio?.play(event.kind);}
      if(engine.stats.result)showResult();
    }
    world.sync(engine.snapshot());world.update(dt*(slow?.35:autoSlow>0?.25:1));world.aim(aimHit,camera);
  }else if(phase==='replay'){
    replayTime+=dt*.5;const startTime=recording[0].time,t=startTime+replayTime,i=Math.max(0,recording.findLastIndex(f=>f.time<=t)),entry=recording[i],next=recording[i+1]||entry,mix=next.time>entry.time?Math.min(1,(t-entry.time)/(next.time-entry.time)):0;world.sync(entry.state,next.state,mix);if(t>=recording.at(-1).time)endReplay();
  }else if(phase==='menu'&&!reduced){const angle=Math.sin(now*.00012)*.04;camera.position.copy(homePosition).applyAxisAngle(new T.Vector3(0,1,0),angle);camera.lookAt(homeTarget);}
  if(controls.enabled)controls.update();
  const shake=world.shake&&!reduced&&phase==='play'?world.shake:0,ox=camera.position.x,oy=camera.position.y;if(shake){camera.position.x+=(Math.random()-.5)*shake*.25;camera.position.y+=(Math.random()-.5)*shake*.15;}
  renderer.render(world.scene,camera);camera.position.x=ox;camera.position.y=oy;
  hudTime+=dt;if(hudTime>.1){hudTime=0;updateHud();}frames++;fpsTime+=dt;if(fpsTime>=1){$('fps').textContent=`${Math.round(frames/fpsTime)} FPS`;frames=0;fpsTime=0;}requestAnimationFrame(frame);
}
async function init(){try{
  for(const [i,l]of LEVELS.entries()){const button=document.createElement('button');button.className='level-button';button.setAttribute('aria-pressed','false');button.innerHTML=`<span>${l.sandbox?'∞':String(i+1).padStart(2,'0')}</span><div><b>${l.name}</b><small>${l.tag}</small></div><i></i>`;button.addEventListener('click',()=>loadLevel(i));$('level-list').append(button);}
  renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  camera=new T.PerspectiveCamera(44,1,.1,220);controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=12;controls.maxDistance=58;controls.maxPolarAngle=Math.PI/2-.08;controls.minPolarAngle=.2;controls.enablePan=false;controls.enabled=false;resize();
  engine=await createEngine({locateFile:name=>`/demolition/dist/${name}`});$('load-message').textContent='布置施工现场…';world=await createWorld(renderer);loadLevel(index);last=performance.now();requestAnimationFrame(frame);
}catch(error){console.error(error);phase='failed';overlay('failure');}}

$('start').addEventListener('click',start);$('pause-button').addEventListener('click',pause);$('resume').addEventListener('click',resume);
for(const id of ['restart','retry'])$(id).addEventListener('click',()=>loadLevel(index,false));
for(const id of ['menu-button','result-menu'])$(id).addEventListener('click',()=>loadLevel(index));
$('next').addEventListener('click',()=>loadLevel(Math.min(6,index+1),false));$('home-view').addEventListener('click',()=>{home();resetAim();});$('fire').addEventListener('click',fire);
for(const id of ['replay','result-replay'])$(id).addEventListener('click',beginReplay);$('end-replay').addEventListener('click',endReplay);$('slow').addEventListener('click',toggleSlow);
$('quality').addEventListener('change',()=>{if(world)setQuality();});$('reload').addEventListener('click',()=>location.reload());
$('sound').addEventListener('click',()=>{muted=!muted;$('sound').textContent=muted?'声音：关':'声音：开';$('sound').setAttribute('aria-pressed',String(!muted));audio?.mute(muted||phase!=='play');});
function chooseAmmo(value){ammo=value;document.querySelectorAll('[data-ammo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ammo===value)));}
document.querySelectorAll('[data-ammo]').forEach(b=>b.addEventListener('click',()=>{chooseAmmo(b.dataset.ammo);canvas.focus({preventScroll:true});}));
const touches=new Set();
canvas.addEventListener('pointerdown',e=>{touches.add(e.pointerId);if(phase==='play')pointerDown=touches.size===1?{x:e.clientX,y:e.clientY,id:e.pointerId}:null;});
canvas.addEventListener('pointermove',e=>{if(pointerDown&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>=5)pointerDown.dragged=true;if(phase==='play'&&!e.buttons)updateAim(e);});
canvas.addEventListener('pointerup',e=>{touches.delete(e.pointerId);if(phase==='play'&&pointerDown?.id===e.pointerId&&!pointerDown.dragged&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)<5){updateAim(e);fire();}pointerDown=null;});
canvas.addEventListener('pointercancel',e=>{touches.delete(e.pointerId);pointerDown=null;});canvas.addEventListener('contextmenu',e=>e.preventDefault());
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{notice('当前浏览器未开启全屏，可直接使用窗口游玩。');}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏';resize();});window.addEventListener('resize',resize);
window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){if(phase==='replay')endReplay();else if(phase==='paused')resume();else pause();return;}
  if(phase!=='play'||['BUTTON','SELECT','A'].includes(e.target.tagName))return;
  if(['Space','KeyR','KeyC','Digit1','Digit2','KeyT'].includes(e.code))e.preventDefault();if(e.repeat)return;
  if(e.code==='Space')fire();if(e.code==='KeyR')loadLevel(index,false);if(e.code==='KeyC'){home();resetAim();}if(e.code==='Digit1')chooseAmmo('breaker');if(e.code==='Digit2')chooseAmmo('blast');if(e.code==='KeyT')toggleSlow();
});
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
stage.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const panel=stage.querySelector('.modal:not([hidden])');if(!panel)return;const list=[...panel.querySelectorAll('button:not([hidden]):not(:disabled),a')],first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();phase='failed';overlay('failure');$('failure-message').textContent='显卡连接中断，请刷新游戏。';});
init();
