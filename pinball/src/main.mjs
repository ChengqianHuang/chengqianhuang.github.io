import {createGame,startGame,advance,tableStatus} from './physics.mjs';
import {TableView} from './art.mjs';
import {MechanicalAudio} from './audio.mjs';
const $=id=>document.getElementById(id),canvas=$('table');
const game=createGame(),audio=new MechanicalAudio(),input={left:false,right:false,launch:false,nudge:false};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let view,last=performance.now(),lastEvent=null,best=0,finished=false,returnFocus=null;
try{best=Math.max(0,Number(localStorage.getItem('brass-pinball-best-v1'))||0);}catch{}
const format=n=>Math.floor(n).toLocaleString('en-US');$('best').textContent=format(best);
function clearInput(){for(const k of Object.keys(input))input[k]=false;game.charging=false;game.charge=0;document.querySelectorAll('.pressed').forEach(el=>el.classList.remove('pressed'));}
function begin(){audio.wake();audio.last=-1;startGame(game);finished=false;lastEvent=null;$('modal').hidden=true;$('start').hidden=true;$('pause').hidden=false;$('modal-help').hidden=true;$('restart').textContent='重新开一局';releaseAll();canvas.focus();updateUI();}
function pause(on=true){if(game.status!=='playing'||game.paused===on)return;game.paused=on;releaseAll();$('modal').hidden=!on;
  if(on){returnFocus=document.activeElement;$('modal-title').textContent='歇一会儿';$('modal-tag').textContent='INTERMISSION';$('modal-text').textContent='钢珠和计时都已暂停。';$('resume').hidden=false;$('resume').textContent='继续玩 →';$('modal-help').hidden=false;$('resume').focus();}
  else{(returnFocus?.isConnected?returnFocus:canvas).focus();last=performance.now();}}
$('start').onclick=begin;$('restart').onclick=begin;$('resume').onclick=()=>{if(game.status==='playing')pause(false);else{$('modal').hidden=true;$('help').focus();}};
$('help').onclick=()=>{if(game.status==='over')return;if(game.status==='playing')pause();else{$('modal').hidden=false;$('resume').hidden=false;$('resume').textContent='知道了';$('restart').textContent='开一局';}
  $('modal-title').textContent='先接球，再开机关';$('modal-tag').textContent='HOW TO PLAY';$('modal-text').textContent='按住空格或发射按钮蓄力，到绿区后松开。';$('modal-help').hidden=false;$('resume').focus();};$('pause').onclick=()=>pause();
$('sound').onclick=()=>{audio.enabled=!audio.enabled;audio.wake();$('sound').textContent=`声音 ${audio.enabled?'开':'关'}`;$('sound').setAttribute('aria-pressed',String(audio.enabled));};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('game').requestFullscreen();}catch{$('notice').textContent='当前浏览器不支持全屏';}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏 ↙':'全屏 ↗';view?.resize();});
const keys={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'launch',KeyW:'nudge',ArrowUp:'nudge'};
const keySet=new Set(),pointers=new Map(),tapUntil=new Map(),pendingTap=new Set();
function sync(){const now=performance.now();for(const k of Object.keys(input))input[k]=[...keySet].some(code=>keys[code]===k)||[...pointers.values()].includes(k)||(tapUntil.get(k)||0)>now||pendingTap.has(k);}
function releaseAll(){keySet.clear();pointers.clear();tapUntil.clear();pendingTap.clear();clearInput();}
window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();if(game.status==='playing')pause(!game.paused);else if(game.status==='ready'&&!$('modal').hidden){$('modal').hidden=true;$('help').focus();}return;}
  if(e.code==='Tab'&&!$('modal').hidden){const buttons=[...$('modal').querySelectorAll('button')].filter(b=>!b.hidden);const first=buttons[0],end=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}return;}
  if(!keys[e.code]||game.status!=='playing'||game.paused)return;
  // Space retains normal activation when a UI button has keyboard focus.
  if(e.code==='Space'&&document.activeElement?.tagName==='BUTTON')return;
  e.preventDefault();audio.wake();keySet.add(e.code);if(!e.repeat){tapUntil.set(keys[e.code],performance.now()+40);pendingTap.add(keys[e.code]);}sync();
});
window.addEventListener('keyup',e=>{if(keys[e.code]){keySet.delete(e.code);sync();}});
for(const el of document.querySelectorAll('[data-input]')){
  el.addEventListener('pointerdown',e=>{if(game.status!=='playing'||game.paused)return;e.preventDefault();audio.wake();el.setPointerCapture(e.pointerId);pointers.set(e.pointerId,el.dataset.input);tapUntil.set(el.dataset.input,performance.now()+40);pendingTap.add(el.dataset.input);el.classList.add('pressed');sync();canvas.focus();});
  const release=e=>{pointers.delete(e.pointerId);el.classList.remove('pressed');sync();};
  el.addEventListener('pointerup',release);el.addEventListener('pointercancel',e=>{const action=pointers.get(e.pointerId);tapUntil.delete(action);pendingTap.delete(action);if(action==='launch'){game.charging=false;game.charge=0;}release(e);});el.addEventListener('lostpointercapture',release);
  // Keyboard and assistive-technology click fallback; pointer play uses press/release above.
  el.addEventListener('click',e=>{if(e.detail!==0||game.status!=='playing'||game.paused)return;audio.wake();const action=el.dataset.input;tapUntil.set(action,performance.now()+(action==='launch'?450:80));pendingTap.add(action);sync();});
}
window.addEventListener('blur',()=>{releaseAll();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseAll();pause();}});
document.addEventListener('themechange',()=>view?.setTheme(document.documentElement.dataset.theme==='dark'));
function updateUI(){
  $('pause').disabled=game.status!=='playing';$('help').disabled=game.status==='over';
  $('score').textContent=Math.floor(game.score).toLocaleString('en-US',{minimumIntegerDigits:6});$('ball-label').textContent=game.status==='ready'?'3 BALLS':`BALL ${game.ballNumber} / 3`;
  $('target-progress').textContent=game.targets.map(t=>t?'●':'○').join(' ');$('ramp-progress').textContent=game.armed?'● READY':'↗';
  const stateInfo=tableStatus(game);
  $('mission-hint').textContent=stateInfo.objective;document.querySelector('.mission').dataset.ready=String(game.armed);
  $('combo-label').textContent=stateInfo.combo?`×${stateInfo.combo}`:'—';$('combo-fill').style.width=`${stateInfo.combo?Math.max(0,1-(game.time-game.lastBumper)/2)*100:0}%`;
  $('nudge-dots').textContent=[0,1,2].map(i=>i<stateInfo.stress?'●':'○').join(' ');$('nudge-label').textContent=stateInfo.nudge;
  $('nudge-status').dataset.warning=String(stateInfo.stress>=2||stateInfo.tilted);
  const lane=game.balls.some(b=>b.lane);
  document.querySelector('.table-wrap').dataset.lane=String(lane||game.status==='ready');$('nudge-status').hidden=lane||game.status!=='playing';$('charge-track').hidden=!lane;
  $('charge-track').dataset.ready=String(game.charge>=.3);
  for(const key of ['left','right'])$(key).classList.toggle('pressed',!!input[key]&&!stateInfo.tilted);
  $('launch').classList.toggle('pressed',!!input[lane?'launch':'nudge']);$('launch').disabled=game.status!=='playing'||game.paused;
  $('launch').dataset.input=lane?'launch':'nudge';$('center-key').textContent=lane||game.status==='ready'?'Space':'W';
  $('launch').setAttribute('aria-label',lane?'按住蓄力，松开发射':'轻推桌面，六秒内三次会停机');
  $('left').disabled=$('right').disabled=game.status!=='playing'||game.paused;
  $('launch-label').textContent=game.status==='ready'?'先开一局':lane?(game.charging?(game.charge<.3?'再蓄一点':'松开发射'):'按住 · 发射'):'轻推桌面';
  $('charge-fill').style.width=`${game.charge*100}%`;
  const state=game.tilt>0?`停机 ${Math.ceil(game.tilt)} 秒`:game.time<game.saveUntil?`救球保护 ${Math.ceil(game.saveUntil-game.time)} 秒`:game.multiball?'MULTIBALL / 三球齐发':game.status==='ready'?'每局三颗球 · 挡板接球':'左右挡板接球，别让钢珠漏下去。';
  $('state-label').textContent=state;
  const notice=game.status==='ready'?'开一局 · 右挡板打铜靶，左挡板打轨道':game.tilt>0?'晃台过度 · 等待挡板恢复':lane?(game.charging?(game.charge<.3?'再蓄一点，进入绿区后松开':'现在松开即可发射'):innerWidth<=800?'按住中间按钮蓄力，松开发射':'按住空格蓄力，松开发射'):game.noticeUntil>game.time?game.notice:stateInfo.objective;
  if($('notice').textContent!==notice)$('notice').textContent=notice;
  if(game.status==='over'&&!finished){finished=true;const record=game.score>best;best=Math.max(best,game.score);try{localStorage.setItem('brass-pinball-best-v1',String(best));}catch{}
    $('best').textContent=format(best);$('modal-tag').textContent=record?'NEW PERSONAL BEST':'END OF GAME';$('modal-title').textContent=format(game.score)+' 分';$('modal-text').textContent=`${record?'刷新了个人纪录。':'三颗球打完了。'}\n弹簧鼓 ${game.hits} 次 · 轨道 ${game.ramps} 次`;$('resume').hidden=true;$('modal-help').hidden=true;$('modal').hidden=false;$('restart').focus();releaseAll();}
}
try{
  view=new TableView(canvas);view.setTheme(document.documentElement.dataset.theme==='dark');$('loading').hidden=true;
  const ro=new ResizeObserver(()=>view.resize());ro.observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();pause();$('loading').hidden=false;$('loading').textContent='画面连接中断，请刷新页面恢复。';});
  let uiClock=0;
  function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(game.status==='playing'&&!game.paused)sync();advance(game,input,dt);pendingTap.clear();
    const fresh=lastEvent?game.events.slice(game.events.indexOf(lastEvent)+1):game.events;
    for(const e of fresh)audio.play(e);audio.update(game);lastEvent=game.events.at(-1)||null;
    view.render(game,dt,reduced.matches);uiClock+=dt;if(uiClock>.05){updateUI();uiClock=0;}
    requestAnimationFrame(frame);
  }
  updateUI();requestAnimationFrame(frame);
}catch(error){console.error(error);$('loading').textContent='弹珠台需要支持 WebGL 2 的浏览器。请更新浏览器后重试，或返回全部游戏。';$('start').disabled=true;}
