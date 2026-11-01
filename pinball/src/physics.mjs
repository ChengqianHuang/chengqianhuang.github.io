// Table units are shared by physics and the 3D scene. y runs downhill.
export const STEP = 1 / 240;
export const RADIUS = .19;
export const BUMPERS = [{x:3.05,y:4.6,r:.57},{x:6.25,y:4.9,r:.57},{x:4.65,y:6.9,r:.62}];
export const GEARS = [{x:4.65,y:9.65,r:.49,h:.4,teeth:14},{x:5.48,y:9.9,r:.34,h:.18,teeth:11},{x:3.95,y:10.15,r:.3,h:.16,teeth:10},{x:1.2,y:1.4,r:.45,h:.18,teeth:14}];
export const TARGETS = [{x:1.25,y:7.1},{x:1.25,y:8.3},{x:1.25,y:9.5}];
export const RAMP = [
  {x:7.65,y:11.3,z:0},{x:7.8,y:8.5,z:.75},{x:7.5,y:4.2,z:1.45},
  {x:6.7,y:2.0,z:1.6},{x:4.7,y:1.8,z:1.65},{x:2.4,y:3.5,z:1.45},
  {x:1.75,y:6.1,z:1.15},{x:2.1,y:10.2,z:.7},{x:2.65,y:12.7,z:0}
];
export const WALLS = [
  [.55,13,.55,2.2], [.55,2.2,1.2,.95], [1.2,.95,2.5,.55],
  [2.5,.55,7.6,.55], [7.6,.55,8.8,1.05], [8.8,1.05,9.55,2.2],
  [9.55,2.2,9.55,17.1], [8.85,3.0,8.85,17.1],
  [.55,13,2.8,15.2], [8.85,13,7,15.2],
  [1.15,11.1,2.65,13.4], [2.65,13.4,1.65,13.0], [1.65,13,1.15,11.1],
  [8.25,11.1,7.15,13.4], [7.15,13.4,8.0,13], [8.0,13,8.25,11.1]
].map((p,i)=>({ax:p[0],ay:p[1],bx:p[2],by:p[3],r:.09,sling:i>=10}));
export const PIVOTS = [{x:2.8,y:15.2,rest:.46,up:-.55},{x:7,y:15.2,rest:Math.PI-.46,up:Math.PI+.55}];
export const FLIPPER_LENGTH = 1.92;
export const FLIPPER_RADIUS = .16;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rampPoint(t) {
  const n=RAMP.length-1, u=clamp(t,0,1)*n,i=Math.min(n-1,Math.floor(u)), f=u-i;
  // Cubic interpolation follows the same visible rail used by the renderer.
  const a=RAMP[Math.max(0,i-1)],b=RAMP[i],c=RAMP[i+1],d=RAMP[Math.min(n,i+2)];
  const out={};
  for(const k of ['x','y','z']) out[k]=.5*((2*b[k])+(-a[k]+c[k])*f+(2*a[k]-5*b[k]+4*c[k]-d[k])*f*f+(-a[k]+3*b[k]-3*c[k]+d[k])*f*f*f);
  return out;
}
export function flipperSegment(f,i) {
  const p=PIVOTS[i];return {ax:p.x,ay:p.y,bx:p.x+Math.cos(f.angle)*FLIPPER_LENGTH,by:p.y+Math.sin(f.angle)*FLIPPER_LENGTH,r:FLIPPER_RADIUS};
}
export function createGame() {
  return {status:'ready',paused:false,time:0,score:0,ballNumber:1,balls:[],nextId:0,
    flippers:PIVOTS.map(p=>({angle:p.rest,omega:0})),targets:[false,false,false],
    hits:0,ramps:0,multiballs:0,multiball:false,armed:false,saveUntil:0,tilt:0,nudges:[],
    events:[],notice:'按住空格蓄力，松开发射',noticeUntil:999,gear:0,lastBumper:-9,combo:0,
    charge:0,charging:false,lastNudge:false,accumulator:0};
}
function event(g,type,x=4.9,y=9,value=0){g.events.push({type,x,y,value,time:g.time});if(g.events.length>80)g.events.shift();}
function say(g,text,seconds=3){g.notice=text;g.noticeUntil=g.time+seconds;}
function ball(g,x,y,vx=0,vy=0){return {id:g.nextId++,x,y,vx,vy,r:RADIUS,z:0,ramp:null,cooldowns:{},lane:false};}
export function startGame(g) {
  Object.assign(g,createGame());g.status='playing';serve(g);
}
function serve(g){const b=ball(g,9.2,16.1);b.lane=true;g.balls.push(b);g.charge=0;}
function addScore(g,n){g.score+=Math.round(n);}
export function launch(g,power=.8){
  if(g.status!=='playing'||g.paused)return false;
  const b=g.balls.find(b=>b.lane);if(!b)return false;
  b.lane=false;b.vy=-(22+clamp(power,0,1)*9);g.saveUntil=g.time+10;
  g.charge=0;g.charging=false;event(g,'launch',b.x,b.y);say(g,'击落左侧三枚铜靶，点亮右侧轨道',5);return true;
}
function contact(b,s,restitution=.78,kick=0,surface={x:0,y:0}){
  const dx=s.bx-s.ax,dy=s.by-s.ay,len=dx*dx+dy*dy;
  const t=len?clamp(((b.x-s.ax)*dx+(b.y-s.ay)*dy)/len,0,1):0;
  const x=s.ax+dx*t,y=s.ay+dy*t,ox=b.x-x,oy=b.y-y,dist=Math.hypot(ox,oy),r=b.r+s.r;
  if(dist>=r)return false;
  const nx=dist>1e-8?ox/dist:0,ny=dist>1e-8?oy/dist:-1;
  b.x=x+nx*(r+.0001);b.y=y+ny*(r+.0001);
  const speed=(b.vx-surface.x)*nx+(b.vy-surface.y)*ny;
  if(speed<0){b.vx-=(1+restitution)*speed*nx;b.vy-=(1+restitution)*speed*ny;
    b.vx+=kick*nx;b.vy+=kick*ny;return {speed:-speed,x,y};}
  return false;
}
function circle(b,x,y,r,restitution,kick=0){return contact(b,{ax:x,ay:y,bx:x,by:y,r},restitution,kick);}
function hitReady(b,key,time,delay=.16){if((b.cooldowns[key]??-999)>time)return false;b.cooldowns[key]=time+delay;return true;}
function updateBall(g,b,dt){
  if(b.lane)return;
  if(b.ramp!==null){
    b.ramp+=dt/2.2;const p=rampPoint(b.ramp);Object.assign(b,{x:p.x,y:p.y,z:p.z});
    if(b.ramp>=1){b.ramp=null;b.z=0;b.vx=3;b.vy=8;}
    return;
  }
  b.vy+=10.7*dt;b.vx*=Math.exp(-.025*dt);b.vy*=Math.exp(-.025*dt);
  const speed=Math.hypot(b.vx,b.vy);if(speed>36){b.vx*=36/speed;b.vy*=36/speed;}
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  for(const wall of WALLS){const h=contact(b,wall,wall.sling?.85:.75,wall.sling?5:0);
    if(h&&h.speed>1&&hitReady(b,`w${WALLS.indexOf(wall)}`,g.time)){
      event(g,wall.sling?'sling':'rail',h.x,h.y,h.speed);if(wall.sling)addScore(g,50);
    }}
  for(let i=0;i<g.flippers.length;i++){
    const f=g.flippers[i],s=flipperSegment(f,i);
    // Moving rigid surface velocity = omega cross radius. It supplies the shot energy.
    const sx=-f.omega*(b.y-s.ay),sy=f.omega*(b.x-s.ax);
    const h=contact(b,s,.62,0,{x:sx,y:sy});
    if(h&&h.speed>1&&hitReady(b,`f${i}`,g.time,.09))event(g,'flipper',b.x,b.y,h.speed);
  }
  for(let i=0;i<BUMPERS.length;i++){
    const p=BUMPERS[i],h=circle(b,p.x,p.y,p.r,.9,5.5);
    if(h&&hitReady(b,`b${i}`,g.time)){
      g.combo=g.time-g.lastBumper<2?Math.min(5,g.combo+1):1;g.lastBumper=g.time;
      const score=150*g.combo;g.hits++;g.gear+=.3;addScore(g,score);event(g,'bumper',p.x,p.y,score);
      if(g.combo>=3)say(g,`${g.combo} 连击 · +${score}`,1.2);
    }
  }
  for(let i=0;i<TARGETS.length;i++){
    if(g.targets[i])continue;const p=TARGETS[i];
    const h=contact(b,{ax:p.x,ay:p.y-.34,bx:p.x,by:p.y+.34,r:.13},.85,2);
    if(h&&hitReady(b,`t${i}`,g.time)){g.targets[i]=true;addScore(g,500);event(g,'target',p.x,p.y,500);
      if(g.targets.every(Boolean)){g.armed=true;addScore(g,1000);say(g,'轨道已开启 · 打入右侧入口，启动三球！',5);event(g,'armed');}
    }
  }
  for(let i=0;i<GEARS.length;i++){const p=GEARS[i],h=circle(b,p.x,p.y,p.r,.8,2.5);
    if(h&&hitReady(b,`gear${i}`,g.time)){g.gear+=h.speed*.12;addScore(g,100);event(g,'gear',p.x,p.y,100);}}
  // Raised rail entry is accessible only from below, avoiding phantom captures through its sides.
  if(g.armed&&b.vy< -3&&b.y<11.65&&b.y>10.9&&Math.abs(b.x-7.65)<.45){
    b.ramp=0;b.vx=b.vy=0;g.ramps++;g.armed=false;g.targets=[false,false,false];
    addScore(g,3000);event(g,'ramp',b.x,b.y,3000);
    if(!g.multiball){
      g.multiball=true;g.multiballs++;g.saveUntil=g.time+12;
      g.balls.push(ball(g,3.8,3,-4,3),ball(g,5.8,3,4,3));
      say(g,'三球齐发 · 12 秒救球保护',5);event(g,'multiball');
    }else{addScore(g,5000);say(g,'轨道大奖 · +8,000',3);}
  }else if(!g.armed){const h=contact(b,{ax:7.22,ay:11.05,bx:8.08,by:11.05,r:.12},.8);
    if(h&&hitReady(b,'gate',g.time))event(g,'rail',b.x,b.y,3);}
  // A weak launch rolls back into the shooter lane and can be retried, without losing a ball.
  if(b.x>8.98&&b.y>16.1&&b.vy>0){b.lane=true;b.y=16.1;b.vx=b.vy=0;say(g,'再蓄一点力，松开发射',3);}
}
function fixedStep(g,input,dt){
  g.time+=dt;g.tilt=Math.max(0,g.tilt-dt);
  for(let i=0;i<2;i++){
    const f=g.flippers[i],p=PIVOTS[i],pressed=(i===0?input.left:input.right)&&g.tilt===0;
    const target=pressed?p.up:p.rest,delta=clamp(target-f.angle,-(pressed?15:9)*dt,(pressed?15:9)*dt);
    f.omega=delta/dt;f.angle+=delta;
  }
  if(input.launch&&g.balls.some(b=>b.lane)){g.charging=true;g.charge=Math.min(1,g.charge+dt*.9);}
  else if(g.charging)launch(g,g.charge);
  if(input.nudge&&!g.lastNudge){
    g.nudges=g.nudges.filter(t=>g.time-t<6);g.nudges.push(g.time);
    if(g.nudges.length>=3){g.tilt=3;g.saveUntil=0;say(g,'晃台过度 · 挡板停机 3 秒',3);event(g,'tilt');}
    else{for(const b of g.balls)if(!b.lane&&b.ramp===null){b.vy-=3.5;b.vx+=(b.x<4.9?1.5:-1.5);}event(g,'nudge');say(g,'轻推一下 · 连续晃台会停机',2);}
  }
  g.lastNudge=!!input.nudge;
  for(const b of [...g.balls])updateBall(g,b,dt);
  // Pairwise steel-ball contacts during multiball; equal masses exchange normal velocity.
  for(let i=0;i<g.balls.length;i++)for(let j=i+1;j<g.balls.length;j++){
    const a=g.balls[i],b=g.balls[j];if(a.lane||b.lane||a.ramp!==null||b.ramp!==null)continue;
    const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),min=a.r+b.r;
    if(d>0&&d<min){const nx=dx/d,ny=dy/d,depth=(min-d)/2;a.x-=nx*depth;a.y-=ny*depth;b.x+=nx*depth;b.y+=ny*depth;
      const v=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(v<0){a.vx+=.92*v*nx;a.vy+=.92*v*ny;b.vx-=.92*v*nx;b.vy-=.92*v*ny;}}
  }
  // Cap after moving-surface and ball-pair impulses as well as before integration.
  for(const b of g.balls){const speed=Math.hypot(b.vx,b.vy);if(speed>36){b.vx*=36/speed;b.vy*=36/speed;}}
  const drained=g.balls.filter(b=>b.y>17.6&&!b.lane&&b.ramp===null);
  for(const b of drained){g.balls.splice(g.balls.indexOf(b),1);event(g,'drain');
    if(g.time<g.saveUntil){g.balls.push(ball(g,5,2.3,-3,3));say(g,'救球保护 · 继续！',2);event(g,'save');}}
  if(g.multiball&&g.balls.length<2)g.multiball=false;
  if(!g.balls.length){
    if(g.ballNumber>=3){g.status='over';say(g,'本局结束',999);event(g,'over',0,0,g.score);}
    else{g.ballNumber++;serve(g);say(g,`第 ${g.ballNumber} 颗球 · 按住空格，松开发射`,999);}
  }
}
export function advance(g,input={},seconds=STEP){
  if(g.status!=='playing'||g.paused)return;
  g.accumulator+=Math.min(.1,Math.max(0,seconds));
  while(g.accumulator+1e-10>=STEP&&g.status==='playing'){
    g.accumulator-=STEP;fixedStep(g,input,STEP);
  }
}
