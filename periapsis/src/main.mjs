import {COURSES,RECORD_KEY,courseById,createFlight,stepFlight,pilotInput,clamp,stars,readRecords,saveRecord} from './flight.mjs';
import {createWorld} from './world.mjs';

const $=id=>document.getElementById(id),stage=$('flight-stage'),canvas=$('flight-canvas'),keys=new Set();
let course=courseById(new URL(location.href).searchParams.get('course')),flight=createFlight(course),world,phase='loading',demo=false,practice=false,records={},sound=null,muted=false,accumulator=0,last=0,visualTime=0,toastTime=0,uiTime=0,frameCount=0,frameStart=0;
let mouse={x:0,y:0,active:false},touch={x:0,y:0,active:false,boost:false,brake:false},mouseAnchor=null;
try{records=readRecords(localStorage.getItem(RECORD_KEY));}catch{}
function text(id,value){value=String(value);if($(id).textContent!==value)$(id).textContent=value;}
function overlay(id){for(const key of ['loading','menu','pause','result','failure'])$(key).hidden=key!==id;}
function focus(id){requestAnimationFrame(()=>$(id).focus({preventScroll:true}));}
function clearInput(){keys.clear();mouse.active=false;mouse.x=mouse.y=0;touch={x:0,y:0,active:false,boost:false,brake:false};$('aim').hidden=true;$('touch-stick').querySelector('i').style.transform='';mouseAnchor=null;}
function notice(message,seconds=1.7){text('toast',message);$('toast').hidden=false;toastTime=seconds;}
function selectCourse(id){
  course=courseById(id);flight=createFlight(course);world?.setCourse(flight.course);
  const url=new URL(location.href);url.searchParams.set('course',course.id);history.replaceState(null,'',url);
  document.querySelectorAll('.course-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.course===course.id)));
  text('course-description',course.description);text('route-label',course.label);text('route-title',course.name);
  text('record',records[course.id]?`本机最佳 ${records[course.id].score.toLocaleString()} · ${'★'.repeat(records[course.id].stars)}`:`本航线需穿过 ${course.required} / ${course.gates} 个环`);
  document.querySelector('.ship-caption strong').textContent=`下一站，${course.name}。`;
}
function createSound(){
  const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;const ctx=new Audio(),master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  const low=ctx.createOscillator(),upper=ctx.createOscillator(),filter=ctx.createBiquadFilter(),engine=ctx.createGain();low.type='sawtooth';upper.type='sine';low.frequency.value=43;upper.frequency.value=86;filter.type='lowpass';filter.frequency.value=200;engine.gain.value=.12;low.connect(filter);upper.connect(filter);filter.connect(engine);engine.connect(master);low.start();upper.start();
  const buffer=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),values=buffer.getChannelData(0);for(let i=0;i<values.length;i++)values[i]=Math.random()*2-1;
  const noise=ctx.createBufferSource(),nf=ctx.createBiquadFilter(),ng=ctx.createGain();noise.buffer=buffer;noise.loop=true;nf.type='bandpass';nf.frequency.value=300;nf.Q.value=.4;ng.gain.value=.035;noise.connect(nf);nf.connect(ng);ng.connect(master);noise.start();
  return {ctx,update(active,f){const t=ctx.currentTime;master.gain.setTargetAtTime(active&&!muted?.35:0,t,.15);low.frequency.setTargetAtTime(32+f.speed*.17,t,.1);upper.frequency.setTargetAtTime(64+f.speed*.34,t,.1);filter.frequency.setTargetAtTime(f.boosting?550:200,t,.15);ng.gain.setTargetAtTime(f.boosting?.08:.025,t,.2);},ping(type,combo=0){if(muted)return;const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;const hit=type==='hit';o.type=hit?'sawtooth':'sine';o.frequency.setValueAtTime(hit?95:440+Math.min(combo,10)*55,t);o.frequency.exponentialRampToValueAtTime(hit?25:880+Math.min(combo,10)*55,t+.22);g.gain.setValueAtTime(hit?.25:.2,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g);g.connect(master);o.start();o.stop(t+.4);}};
}
function touchLayout(){return matchMedia('(max-width:800px),(pointer:coarse)').matches;}
function updateControlHint(){document.querySelector('.controls-hint').textContent=touchLayout()?'左下方向盘转向 · 右下加速 / 减速':'鼠标 / WASD 转向 · Shift 加速 · 空格减速';}
function start(isDemo=false){
  flight=createFlight(course);world.setCourse(flight.course);stage.scrollIntoView({block:'start',behavior:'instant'});phase='flight';demo=isDemo;practice=isDemo;clearInput();overlay(null);$('hud').hidden=false;$('demo-banner').hidden=!demo;text('demo-banner','自动试飞 · 移动鼠标或按方向键接管');accumulator=0;last=performance.now();
  sound??=createSound();sound?.ctx.resume();notice(demo?'自动驾驶中，随时可以接管':touchLayout()?'左下方向盘转向 · 右下加速 / 减速':'金色环是当前目标 · Shift 加速，空格减速',4);focus('flight-canvas');updateHUD();
}
function pause(){if(phase!=='flight')return;phase='paused';clearInput();overlay('pause');focus('resume');sound?.update(false,flight);}
function resume(){if(phase!=='paused')return;phase='flight';overlay(null);accumulator=0;last=performance.now();focus('flight-canvas');sound?.ctx.resume();}
function menu(shouldFocus=true){stage.scrollIntoView({block:'start',behavior:'instant'});phase='menu';clearInput();demo=false;practice=false;$('hud').hidden=true;overlay('menu');selectCourse(course.id);if(shouldFocus)focus('start');sound?.update(false,flight);}
function takeover(){if(!demo)return;demo=false;$('demo-banner').hidden=false;text('demo-banner','试飞接管 · 本次不计入纪录');notice('已接管飞船',2);}
function finish(){
  updateHUD();phase='result';clearInput();overlay('result');$('waypoint').hidden=true;const success=flight.status==='finished';
  text('result-label',practice?'TEST FLIGHT':success?'ROUTE COMPLETE':'FLIGHT ENDED');text('result-title',success?'航线完成':flight.reason);text('result-stars',success?'★'.repeat(stars(flight))+'☆'.repeat(3-stars(flight)):'');
  const record=!practice&&saveRecord(records,flight);if(record)try{localStorage.setItem(RECORD_KEY,JSON.stringify(records));}catch{}
  text('result-note',practice?'试飞不计入纪录。可以重飞，自己完成这条航线。':success?(record?'刷新本机纪录。':'航线完成。')+` 用时 ${flight.time.toFixed(1)} 秒，擦身飞行 ${flight.nearMisses} 次。`:`已飞行 ${Math.min(100,Math.floor(flight.s/flight.course.end*100))}% · 试试提前减速，稳稳穿环。`);
  text('result-score',flight.score.toLocaleString());text('result-gates',`${flight.passed} / ${course.gates}`);text('result-combo',`×${flight.bestCombo}`);$('next-course').hidden=!success||course===COURSES.at(-1);focus('again');
}
function input(){
  if(demo)return pilotInput(flight);
  let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),y=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
  if(touch.active){x=touch.x;y=touch.y;}else if(mouse.active&&!x&&!y){x=mouse.x;y=mouse.y;}
  return {x,y,boost:keys.has('ShiftLeft')||keys.has('ShiftRight')||touch.boost,brake:keys.has('Space')||touch.brake};
}
function updateHUD(){
  text('time-left',Math.max(0,course.limit-flight.time-flight.penalty).toFixed(1));text('gate-count',`${flight.passed} / ${course.gates} 环 · 至少 ${course.required}`);text('speed',Math.round(flight.speed));text('score',flight.score.toLocaleString());text('combo',`连击 ×${flight.combo}`);text('heat-value',`${Math.round(flight.heat*100)}%`);text('shield-value',`${Math.round(flight.shield)}%`);text('boost-label',flight.locked?'冷却中':flight.boosting?'加速':input().brake?'减速':'巡航');
  $('heat').style.width=`${flight.heat*100}%`;$('heat').style.background=flight.locked?'#eb785e':'#ddb281';$('shield').style.width=`${flight.shield}%`;$('route-progress').style.width=`${Math.min(100,flight.s/flight.course.end*100)}%`;
  $('flight-hint').hidden=flight.time>12||demo;
}
function events(){
  for(const e of flight.events){
    if(e.type==='gate'){world.burst(e);sound?.ping('gate',flight.combo);notice(`${e.perfect?'完美穿环':'穿环'} +${e.points}　/　连击 ×${flight.combo}`,1.1);}
    if(e.type==='miss')notice('漏环 · 罚时 +2 秒',1.4);
    if(e.type==='hit'){sound?.ping('hit');notice('碰撞 · 护盾受损',1.4);}
    if(e.type==='near'){sound?.ping('gate',2);notice('擦身飞行 +80',1.1);}
    if(e.type==='overheat')notice('引擎过热 · 松开加速，等待冷却',2);
    if(e.type==='cooled')notice('引擎已冷却',1.1);
  }
}
function frame(now){
  requestAnimationFrame(frame);frameCount++;if(now-frameStart>1000){text('performance',`${Math.round(frameCount*1000/(now-frameStart))} FPS · 可在顶部切换画质`);frameCount=0;frameStart=now;}const dt=Math.min(.05,(now-last)/1000||0);last=now;if(!world)return;
  const active=phase==='flight';if(active||phase==='menu')visualTime+=dt;
  if(active){accumulator+=dt;while(accumulator>=1/60&&phase==='flight'){stepFlight(flight,input(),1/60);events();accumulator-=1/60;if(flight.status!=='flying')finish();}toastTime-=dt;if(toastTime<=0)$('toast').hidden=true;uiTime+=dt;if(uiTime>.08){updateHUD();uiTime=0;}}
  sound?.update(phase==='flight',flight);
  const marker=world.update(flight,active||phase==='menu'?dt:0,visualTime,phase==='menu'?'menu':'flight');
  $('waypoint').hidden=!marker||phase!=='flight';if(marker&&phase==='flight'){
    const w=stage.clientWidth,h=stage.clientHeight,off=marker.x<35||marker.x>w-35||marker.y<110||marker.y>h-80;
    $('waypoint').style.left=`${clamp(marker.x,35,w-35)}px`;$('waypoint').style.top=`${clamp(marker.y,110,h-80)}px`;
    text('waypoint-label',`${off?(marker.x<35?'← ':marker.x>w-35?'→ ':marker.y<110?'↑ ':'↓ '):''}${String(marker.index).padStart(2,'0')} / ${marker.distance} m`);
  }
}

COURSES.forEach((c,i)=>{const b=document.createElement('button');b.className='course-button';b.dataset.course=c.id;b.setAttribute('aria-pressed','false');b.innerHTML=`<span>0${i+1} / ${c.tag||(i?'进阶':'入门')}</span><strong>${c.name}</strong>`;b.addEventListener('click',()=>{selectCourse(c.id);focus('start');});$('course-list').append(b);});
$('start').addEventListener('click',()=>start());$('demo').addEventListener('click',()=>start(true));$('pause-button').addEventListener('click',pause);$('resume').addEventListener('click',resume);$('restart').addEventListener('click',()=>start());$('menu-button').addEventListener('click',menu);$('again').addEventListener('click',()=>start());$('result-menu').addEventListener('click',menu);$('next-course').addEventListener('click',()=>{selectCourse(COURSES[Math.min(COURSES.indexOf(course)+1,COURSES.length-1)].id);start();});
$('sound').addEventListener('click',()=>{muted=!muted;$('sound').setAttribute('aria-pressed',String(muted));text('sound',muted?'声音：关':'声音：开');sound?.ctx.resume();});
$('quality').addEventListener('change',e=>world?.setQuality(e.target.value));$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await stage.requestFullscreen();}catch{notice('当前浏览器不支持全屏',2);}});
document.addEventListener('keydown',e=>{
  if(e.code==='Tab'&&['paused','result'].includes(phase)){const modal=$(phase==='paused'?'pause':'result'),items=[...modal.querySelectorAll('button:not([hidden]),a')],first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}return;}
  if(e.code==='Escape'){if(phase==='flight')pause();else if(phase==='paused')resume();return;}
  if(e.target.closest('button,a,select,input,textarea'))return;
  if(phase==='flight'&&['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','KeyR'].includes(e.code)){
    e.preventDefault();if(e.code==='KeyR'){if(!e.repeat)start();return;}keys.add(e.code);takeover();mouse.active=false;$('aim').hidden=true;
  }
});document.addEventListener('keyup',e=>keys.delete(e.code));
canvas.addEventListener('pointermove',e=>{
  if(phase!=='flight'||e.pointerType==='touch')return;const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
  if(demo){if(!mouseAnchor){mouseAnchor={x,y};return;}if(Math.hypot(mouseAnchor.x-x,mouseAnchor.y-y)>12)takeover();else return;}
  const axis=v=>Math.abs(v)<.075?0:clamp(v,-1,1);mouse={x:axis((x/rect.width-.5)*3),y:axis((.5-y/rect.height)*3),active:true};$('aim').hidden=false;$('aim').style.left=`${x}px`;$('aim').style.top=`${y}px`;
});canvas.addEventListener('pointerleave',()=>{mouse.active=false;$('aim').hidden=true;});canvas.addEventListener('pointerdown',()=>{if(phase==='flight')canvas.focus({preventScroll:true});});
const stick=$('touch-stick');let stickId=null;
function moveStick(e){if(e.pointerId!==stickId)return;const b=stick.getBoundingClientRect();touch.x=clamp((e.clientX-b.left-b.width/2)/(b.width*.32),-1,1);touch.y=clamp((b.height/2-e.clientY+b.top)/(b.height*.32),-1,1);stick.querySelector('i').style.transform=`translate(${touch.x*b.width*.22}px,${-touch.y*b.height*.22}px)`;}
stick.addEventListener('pointerdown',e=>{if(phase!=='flight')return;e.preventDefault();takeover();stickId=e.pointerId;stick.setPointerCapture(stickId);touch.active=true;moveStick(e);});stick.addEventListener('pointermove',moveStick);for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,()=>{stickId=null;touch.active=false;touch.x=touch.y=0;stick.querySelector('i').style.transform='';});
for(const action of ['boost','brake']){const b=$(`touch-${action}`);b.addEventListener('pointerdown',e=>{if(phase!=='flight')return;e.preventDefault();takeover();touch[action]=true;b.setPointerCapture(e.pointerId);});for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>touch[action]=false);}
window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('resize',()=>{world?.resize();updateControlHint();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();text('failure-message','图形上下文中断，请刷新页面后重试，或切换到流畅画质。');phase='failed';overlay('failure');});
try{world=await createWorld(canvas);selectCourse(course.id);world.resize();updateControlHint();menu(false);requestAnimationFrame(frame);}catch(error){console.error(error);text('failure-message','图形初始化或本站素材加载失败。请刷新重试，并确认浏览器支持 WebGL 2、已开启硬件加速。');overlay('failure');phase='failed';}
