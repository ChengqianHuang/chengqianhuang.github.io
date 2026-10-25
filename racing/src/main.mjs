import * as T from 'three';
import {createPhysics} from './physics.mjs';
import {createWorld} from './world.mjs';
import {createCar} from './car.mjs';
import {createTireSmoke} from './effects.mjs';
import {grid,sample,samples,nearest,aiInput,createProgress,updateProgress,recoverPoint,formatTime,LENGTH,WIDTH,deltaU} from './track.mjs';

const $=id=>document.getElementById(id),canvas=$('race-canvas'),stage=$('race-stage');
const keys=new Set(),colors=[0xe9a62e,0x3e8f91,0xc54d36,0xe4ddc3];
let physics,world,renderer,scene,camera,models=[],states=[],phase='loading',previousPhase='race',mode='race',clock=0,countdown=3,accumulator=0,lastFrame=0,camMode=0,sound,muted=false,penalty=0,noticeTime=0,quality='high',frames=0,frameTime=0,aiStuck=[0,0,0,0],demo=false,demoRun=false,smoke;
const cameraTarget=new T.Vector3(),cameraPosition=new T.Vector3(),forward=new T.Vector3(),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let bests={};try{const saved=JSON.parse(localStorage.getItem('harbor-rush-records-v1')||'{}');for(const key of ['race','trial'])if(Number.isFinite(saved?.[key])&&saved[key]>0)bests[key]=saved[key];}catch{}
function setNotice(message){if($('notice').textContent!==message)$('notice').textContent=message;}
function notice(message,seconds=2){setNotice(message);noticeTime=seconds;}
function loading(message){$('loading-label').textContent=message;}
function overlay(id){for(const name of ['loading','menu','pause','results','failure'])$(name).hidden=name!==id;}
function focusButton(id){requestAnimationFrame(()=>$(id).focus({preventScroll:true}));}
function clearInput(){keys.clear();document.querySelectorAll('[data-drive]').forEach(b=>b.classList.remove('pressed'));}
function updateBest(){const b=bests[mode];$('record').textContent=b?`本机最佳 ${formatTime(b)}`:'跑完一场，留下你的第一个纪录';}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='high'?1.5:1));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
function setQuality(value){quality=value;renderer.shadowMap.enabled=value==='high';world.sun.castShadow=value==='high';resize();}

function createAudio(){
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;
  const ctx=new Audio(),master=ctx.createGain();master.gain.value=.12;master.connect(ctx.destination);
  const engine=ctx.createOscillator(),engine2=ctx.createOscillator(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
  engine.type='sawtooth';engine2.type='triangle';filter.type='lowpass';filter.frequency.value=520;gain.gain.value=.3;engine.connect(filter);engine2.connect(filter);filter.connect(gain);gain.connect(master);engine.start();engine2.start();
  const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  const noise=ctx.createBufferSource(),skid=ctx.createGain(),band=ctx.createBiquadFilter();noise.buffer=buffer;noise.loop=true;band.type='bandpass';band.frequency.value=1200;band.Q.value=.8;noise.connect(band);band.connect(skid);skid.connect(master);skid.gain.value=0;noise.start();
  return {ctx,update(car,active){const t=ctx.currentTime,rpm=car.controller.GetEngine().GetCurrentRPM();master.gain.setTargetAtTime(muted||!active?0:.12,t,.1);engine.frequency.setTargetAtTime(27+rpm/45,t,.07);engine2.frequency.setTargetAtTime(13+rpm/90,t,.07);filter.frequency.setTargetAtTime(250+rpm*.16,t,.1);gain.gain.setTargetAtTime(.22+Math.abs(car.input.throttle||0)*.15,t,.1);skid.gain.setTargetAtTime(car.velocity>8&&(car.input.handbrake||Math.abs(car.steer)>.28)?Math.min(.5,car.velocity/90):0,t,.07);},ping(freq=600){if(muted)return;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;g.gain.setValueAtTime(.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+.2);}};
}

function start(isDemo=false){
  demo=isDemo===true;demoRun=demo;clearInput();mode=demo?'trial':$('mode').value;penalty=0;clock=0;countdown=3;accumulator=0;aiStuck.fill(0);
  physics.cars.forEach((car,i)=>{physics.reset(car,grid(i));states[i]=createProgress(grid(i));models[i].root.visible=mode==='race'||i===0;});
  // In time trial the other cars are parked outside the course, with no invisible obstacles.
  if(mode==='trial')physics.cars.slice(1).forEach((car,i)=>physics.reset(car,{x:165+i*5,z:110,yaw:0}));
  physics.resetProps();phase='countdown';overlay(null);$('hud').hidden=false;$('race-tools').hidden=false;$('touch-controls').hidden=false;
  $('countdown').hidden=false;$('countdown').textContent='3';$('race-position').hidden=mode!=='race';
  cameraPosition.copy(new T.Vector3(physics.cars[0].x-8,4,physics.cars[0].z+2));
  sound??=createAudio();sound?.ctx.resume();canvas.focus({preventScroll:true});notice(demo?'示范驾驶 · 按 WASD 或方向键随时接管':'起跑后按 W 或 ↑ 加速',3);
}
function pause(){if(!['race','countdown'].includes(phase))return;previousPhase=phase;phase='paused';clearInput();overlay('pause');$('countdown').hidden=true;focusButton('resume');}
function resume(){if(phase!=='paused')return;phase=previousPhase;overlay(null);$('countdown').hidden=phase!=='countdown';lastFrame=performance.now();accumulator=0;canvas.focus({preventScroll:true});}
function menu(){phase='menu';clearInput();overlay('menu');$('hud').hidden=true;$('race-tools').hidden=true;$('touch-controls').hidden=true;$('countdown').hidden=true;updateBest();focusButton('start');}
function recover(index=0){const state=states[index],p=recoverPoint(state);physics.reset(physics.cars[index],p);state.last=p.u;aiStuck[index]=0;if(index===0){penalty+=3;notice('车辆已回到赛道 · 用时 +3 秒',3);}}
function finish(){
  const total=clock+penalty,ranking=rank(),last=bests[mode];phase='finished';overlay('results');$('countdown').hidden=true;
  $('result-title').textContent=demo?'示范结束':mode==='race'?`第 ${ranking} 名冲线`:'计时完成';$('result-time').textContent=formatTime(total);
  const laps=states[0].lapTimes;$('result-laps').textContent=laps.map((t,i)=>`第 ${i+1} 圈 ${formatTime(t)}`).join('　/　');
  const record=!last||total<last;$('result-note').textContent=demoRun?'示范与接管体验圈不计入纪录。':(record?'刷新本机纪录':'本机纪录 '+formatTime(last))+(penalty?` · 回正罚时 ${penalty} 秒`:'');
  if(record&&!demoRun){bests[mode]=total;try{localStorage.setItem('harbor-rush-records-v1',JSON.stringify(bests));}catch{}}
  focusButton('again');
}
function rank(){const score=i=>states[i].passed+Math.max(-.99,Math.min(.99,deltaU(nearest(physics.cars[i].x,physics.cars[i].z).u,((states[i].next-1+24)%24)/24)*24));return 1+states.slice(1).filter((s,i)=>s.finished||score(i+1)>score(0)).length;}
function playerInput(){return {throttle:(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0),steer:(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),handbrake:keys.has('Space')?1:0,brake:0};}
function simulate(dt){
  if(phase==='countdown'){
    const before=Math.ceil(countdown);countdown-=dt;physics.step(dt,physics.cars.map(()=>({brake:1,handbrake:1})));
    if(Math.ceil(countdown)!==before)sound?.ping(countdown<=0?880:500);
    const label=String(Math.max(1,Math.ceil(countdown)));if($('countdown').textContent!==label)$('countdown').textContent=label;
    if(countdown<=0){phase='race';$('countdown').textContent='GO';notice('出发！',1);}
  }else if(phase==='race'){
    clock+=dt;const inputs=[demo?aiInput(physics.cars[0],1):playerInput(),...physics.cars.slice(1).map((c,i)=>mode==='race'?aiInput(c,i):{brake:1})];
    physics.step(dt,inputs);
    physics.cars.forEach((car,i)=>{
      if(i&&mode==='trial')return;
      const event=updateProgress(states[i],car,clock,mode==='race'?3:1);
      if(i===0&&event==='finish')finish();
      else if(i===0&&event==='lap'&&states[0].lap>1){notice(`第 ${states[0].lap-1} 圈 ${formatTime(states[0].lapTimes.at(-1))}`,3);sound?.ping(800);}
      if(i>0){aiStuck[i]=car.velocity<2?aiStuck[i]+dt:0;if(aiStuck[i]>4||car.y< -4||car.upright<.2)recover(i);}
      else if(car.y< -5){recover(0);}
    });
    $('countdown').hidden=clock>1;
  }
}

function updateCamera(dt,time){
  const car=physics.cars[0],p=new T.Vector3(car.x,car.y,car.z);forward.set(Math.sin(car.yaw),0,Math.cos(car.yaw));
  if(['menu','loading'].includes(phase)){
    const angle=-.82+(reduceMotion?0:Math.sin(time*.055)*.08);const offset=new T.Vector3(Math.sin(car.yaw+angle)*8.3,2.9,Math.cos(car.yaw+angle)*8.3);
    camera.position.copy(p).add(offset);camera.lookAt(p.clone().add(new T.Vector3(0,.45,0)));camera.fov=51;
  }else if(camMode===1){camera.position.copy(p).addScaledVector(forward,1.2);camera.position.y+=1.3;camera.lookAt(p.clone().addScaledVector(forward,30).add(new T.Vector3(0,.9,0)));camera.fov=74;
  }else{
    const v=car.velocity,offset=forward.clone().multiplyScalar(-(6.8+Math.min(v*.025,1.0)));offset.y=2.85;
    cameraPosition.lerp(p.clone().add(offset),1-Math.exp(-dt*12));camera.position.copy(cameraPosition);
    cameraTarget.copy(p).addScaledVector(forward,5.5);cameraTarget.y+=.65;camera.lookAt(cameraTarget);camera.fov=62+Math.min(v*.22,9);
  }
  camera.updateProjectionMatrix();
}
const map=$('map'),mapCtx=map.getContext('2d');
function minimap(){
  const ctx=mapCtx;ctx.clearRect(0,0,220,140);ctx.lineJoin='round';ctx.lineCap='round';
  const point=p=>[110+p.x*.62,71+p.z*.62];ctx.beginPath();samples.forEach((p,i)=>{const [x,y]=point(p);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.strokeStyle='#e5e3cb30';ctx.lineWidth=10;ctx.stroke();ctx.strokeStyle='#e5e3cb90';ctx.lineWidth=2;ctx.stroke();
  const gate=point(sample(states[0].next/24));ctx.beginPath();ctx.arc(...gate,5,0,Math.PI*2);ctx.strokeStyle='#efc26a';ctx.lineWidth=2;ctx.stroke();
  physics.cars.forEach((c,i)=>{if(mode==='trial'&&i)return;const [x,y]=point(c);ctx.fillStyle=['#ffd17c','#67cfcb','#f98267','#e3e1ce'][i];ctx.beginPath();ctx.arc(x,y,i===0?4.5:3.2,0,Math.PI*2);ctx.fill();if(i===0){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}});
}
function hud(dt){
  const car=physics.cars[0],state=states[0];$('speed').textContent=String(Math.round(Math.abs(car.speed)*3.6));
  const gear=car.controller.GetTransmission().GetCurrentGear();$('gear').textContent=gear<0?'R':gear===0?'N':gear;
  $('time').textContent=formatTime(clock+penalty);$('lap').textContent=`${Math.max(1,Math.min(mode==='race'?3:1,state.lap))} / ${mode==='race'?3:1}`;$('position').textContent=`${rank()} / 4`;
  $('rpm-fill').style.transform=`scaleX(${Math.min(1,car.controller.GetEngine().GetCurrentRPM()/7000)})`;
  noticeTime=Math.max(0,noticeTime-dt);if(noticeTime===0&&phase==='race'){
    const n=nearest(car.x,car.z),facing=Math.cos(car.yaw-n.yaw);
    setNotice(demo?'示范驾驶 · 按 WASD 或方向键随时接管':car.upright<.4?'翻车了 · 按 R 回到赛道':facing< -.4&&car.velocity>3?'逆行 · 请沿赛道方向行驶':Math.abs(car.speed)<.6&&clock>8?'W 加速 · S 刹车 / 倒车 · R 回正':'');
  }
  minimap();sound?.update(car,phase==='race'||phase==='countdown');
}

function makeSkids(){
  const capacity=1800,positions=new Float32Array(capacity*18),g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(positions,3));
  const mesh=new T.Mesh(g,new T.MeshBasicMaterial({color:0x0d1514,transparent:true,opacity:.24,depthWrite:false,side:T.DoubleSide}));mesh.frustumCulled=false;scene.add(mesh);let cursor=0;const prev=[];
  return car=>{const active=phase==='race'&&car.velocity>9&&(car.input.handbrake||Math.abs(car.steer)>.24),fx=Math.sin(car.yaw),fz=Math.cos(car.yaw);
    for(let side=0;side<2;side++){const s=side?1:-1,p={x:car.x-fx*1.48+fz*s,z:car.z-fz*1.48-fx*s};const old=prev[side];
      if(active&&old&&car.y<1.25&&Math.hypot(p.x-old.x,p.z-old.z)<3){const dx=fz*.13,dz=-fx*.13,vertices=[old.x-dx,.041,old.z-dz,old.x+dx,.041,old.z+dz,p.x-dx,.041,p.z-dz,p.x-dx,.041,p.z-dz,old.x+dx,.041,old.z+dz,p.x+dx,.041,p.z+dz];positions.set(vertices,(cursor++%capacity)*18);g.attributes.position.needsUpdate=true;}
      prev[side]=p;
    }
  };
}
let skids;
function frame(now){
  if(phase==='failed')return;
  const dt=Math.min(.10,(now-lastFrame)/1000||1/60);lastFrame=now;
  if(['race','countdown'].includes(phase)){accumulator+=dt;let steps=0;while(accumulator>=1/60&&steps<6){simulate(1/60);accumulator-=1/60;steps++;}}
  const time=now/1000;physics.cars.forEach((car,i)=>models[i].update(car));
  world.update(time,physics.cars[0],states[0].next);world.gate.visible=['race','countdown'].includes(phase);
  updateCamera(dt,time);hud(dt);skids(physics.cars[0]);smoke(phase==='race'?dt:0,physics.cars[0],phase==='race');renderer.render(scene,camera);
  frames++;frameTime+=dt;if(frameTime>=1){$('fps').textContent=`${Math.round(frames/frameTime)} FPS`;frames=0;frameTime=0;}
  requestAnimationFrame(frame);
}
async function init(){try{
  renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  scene=new T.Scene();camera=new T.PerspectiveCamera(60,1,.1,1600);resize();loading('正在加载车辆物理…');
  physics=await createPhysics({locateFile:name=>`/racing/dist/${name}`});
  physics.cars.length=0;for(let i=0;i<4;i++){physics.addCar(grid(i));states.push(createProgress(grid(i)));}
  world=await createWorld(scene,renderer,physics,loading);
  models=colors.map((color,i)=>{const m=createCar(color,['07','12','23','41'][i]);scene.add(m.root);return m;});
  for(let f=0;f<90;f++)physics.step(1/60,physics.cars.map(()=>({brake:1})));
  skids=makeSkids();smoke=createTireSmoke(scene);menu();lastFrame=performance.now();requestAnimationFrame(frame);
}catch(error){console.error(error);phase='failed';overlay('failure');$('failure-detail').textContent='画面未能加载。请刷新重试，或使用开启硬件加速的新版浏览器。';}}

$('start').addEventListener('click',start);$('again').addEventListener('click',start);$('resume').addEventListener('click',resume);$('pause-button').addEventListener('click',pause);
$('demo').addEventListener('click',()=>start(true));
for(const id of ['back-menu','result-menu'])$(id).addEventListener('click',menu);
$('restart').addEventListener('click',start);$('retry').addEventListener('click',()=>location.reload());$('reset-button').addEventListener('click',()=>{if(phase==='race')recover();canvas.focus();});
$('mode').addEventListener('change',()=>{mode=$('mode').value;updateBest();$('mode-description').textContent=mode==='race'?'和三辆电脑车跑三圈，先冲线的赢。':'独自跑一整圈，挑战自己的最快时间。';});
$('quality').addEventListener('change',e=>{if(world)setQuality(e.target.value);});
function toggleSound(){muted=!muted;$('sound-button').textContent=muted?'声音：关':'声音：开';$('sound-button').setAttribute('aria-pressed',String(!muted));}
$('sound-button').addEventListener('click',toggleSound);
$('camera-button').addEventListener('click',()=>{camMode=1-camMode;$('camera-button').textContent=camMode?'视角：车头':'视角：追尾';canvas.focus();});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{notice('当前浏览器未开启全屏，可使用窗口游玩');}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏';resize();});
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);
const driveKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){if(phase==='paused')resume();else pause();return;}
  if(!['race','countdown'].includes(phase))return;
  if(driveKeys.includes(e.code)){e.preventDefault();keys.add(e.code);if(demo){demo=false;notice('已接管赛车',2);}}if(e.repeat)return;
  if(e.code==='KeyR'&&phase==='race')recover();if(e.code==='KeyC')$('camera-button').click();if(e.code==='KeyF')$('fullscreen').click();
});window.addEventListener('keyup',e=>keys.delete(e.code));
document.querySelectorAll('[data-drive]').forEach(button=>{
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.drive);button.classList.add('pressed');if(demo){demo=false;notice('已接管赛车',2);}});
  const release=()=>{keys.delete(button.dataset.drive);button.classList.remove('pressed');};button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();phase='failed';clearInput();sound?.update(physics.cars[0],false);overlay('failure');$('failure-detail').textContent='显卡连接中断，请刷新游戏。';});
// Keep the keyboard inside modal controls while racing is paused.
stage.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const panel=stage.querySelector('.overlay.modal:not([hidden])');if(!panel)return;const list=[...panel.querySelectorAll('button,select,a[href]')],first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
init();
