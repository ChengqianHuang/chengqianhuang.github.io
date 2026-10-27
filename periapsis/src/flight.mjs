export const RECORD_KEY='periapsis-records-v1';
export const COURSES=[
  {id:'daybreak',name:'晨昏线',label:'01 / TERMINATOR',description:'沿着蓝色行星的晨昏线，穿过第一座轨道站。',gates:18,spacing:250,speed:85,limit:82,seed:721,amplitude:19,vertical:10,rocks:82,required:13,planet:0},
  {id:'belt',name:'碎星带',label:'02 / THE BELT',description:'碎石之间的窄航道。看准下一个环，再推满引擎。',gates:23,spacing:240,speed:94,limit:90,seed:1428,amplitude:27,vertical:16,rocks:145,required:18,planet:1},
  {id:'nightfall',name:'日蚀航路',label:'03 / ECLIPSE RUN',description:'穿过行星暗面与双环空间站，完成最后一次高速进近。',gates:27,spacing:230,speed:101,limit:96,seed:3710,amplitude:31,vertical:19,rocks:185,required:22,planet:2},
  {id:'polar-spiral',name:'极地回旋',label:'04 / POLAR SPIRAL',tag:'回旋',description:'沿极地螺旋航道上下回旋，连续穿过三座轨道站。',gates:24,spacing:235,speed:97,limit:94,seed:4821,amplitude:29,vertical:20,rocks:155,required:20,planet:0,profile:'spiral',period:410,planetTilt:.78,planetRotation:.3,stationFractions:[.22,.52,.82]},
  {id:'switchback',name:'折线穿梭',label:'05 / SWITCHBACK',tag:'转向',description:'左右交替的窄环阵列。提前转向，必要时减速对准。',gates:28,spacing:220,speed:104,limit:98,seed:5917,amplitude:33,vertical:12,rocks:195,required:24,planet:1,profile:'slalom',period:330,gateRadius:11,planetTilt:-.55,planetRotation:2.9,stationFractions:[.3,.7]},
  {id:'dawn-sprint',name:'黎明冲刺',label:'06 / DAWN SPRINT',tag:'挑战',description:'短环组与长加速段交替。管理热量，穿过最后的精度环。',gates:32,spacing:220,gaps:[180,220,340,180,200,300],speed:114,limit:104,seed:6703,amplitude:29,vertical:20,rocks:215,required:28,planet:0,profile:'sprint',period:440,gateRadius:10.5,planetTilt:.2,planetRotation:3.6,stationFractions:[.2,.5,.84]}
];
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function courseById(id){return COURSES.find(c=>c.id===id)||COURSES[0];}
export function pathAt(c,s){
  if(c.profile==='spiral')return {x:Math.sin(s/c.period)*c.amplitude,y:Math.cos(s/c.period)*c.vertical};
  if(c.profile==='slalom')return {x:Math.sin(s/c.period)*c.amplitude,y:Math.sin(s/510+.2)*c.vertical};
  if(c.profile==='sprint')return {x:Math.sin(s/c.period)*c.amplitude+Math.sin(s/230)*4,y:Math.sin(s/500+.3)*c.vertical};
  return {x:Math.sin(s/510)*c.amplitude+Math.sin(s/1110)*5,y:Math.sin(s/670+.4)*c.vertical+Math.sin(s/290)*3};
}
export function makeCourse(c){
  let distance=220;
  const random=rng(c.seed),gates=Array.from({length:c.gates},(_,i)=>{
    if(i)distance+=c.gaps?c.gaps[(i-1)%c.gaps.length]:c.spacing;
    return {i,s:distance,...pathAt(c,distance),radius:c.gateRadius??12};
  });
  const end=gates.at(-1).s+180,rocks=[];
  for(let i=0;i<c.rocks;i++){
    const s=300+random()*(end-400),p=pathAt(c,s),angle=random()*Math.PI*2,radius=2.5+random()*5;
    // Every contract has a physically clear central flight path, including the complete gate aperture.
    const offset=18+radius+random()*42;
    rocks.push({id:i,s,x:p.x+Math.cos(angle)*offset,y:p.y+Math.sin(angle)*offset,radius,angle:random()*6.28,spin:(random()-.5)*.12});
  }
  const stations=c.stationFractions?c.stationFractions.map(fraction=>fraction*end):[1250,end-450];
  return {config:c,gates,rocks,end,stations};
}
export function createFlight(c=COURSES[0]){
  return {course:makeCourse(c),s:0,x:0,y:4,vx:0,vy:0,speed:c.speed,time:0,shield:100,heat:0,locked:false,boosting:false,next:0,passed:0,missed:0,combo:0,bestCombo:0,score:0,nearMisses:0,invincible:0,collided:new Set(),near:new Set(),status:'flying',events:[],flash:0,penalty:0};
}
export function pilotInput(f){
  const gate=f.course.gates[f.next],p=gate||pathAt(f.course.config,f.s+150);
  return {targetX:p.x,targetY:p.y,boost:f.heat<.7};
}
export function stepFlight(f,input={},dt=1/60){
  if(f.status!=='flying')return;
  dt=clamp(dt,0,.05);if(!dt)return;
  f.events=[];f.time+=dt;f.invincible=Math.max(0,f.invincible-dt);f.flash=Math.max(0,f.flash-dt*2);
  const previous={x:f.x,y:f.y,s:f.s};
  if(f.locked&&f.heat<=.25){f.locked=false;f.events.push({type:'cooled'});}
  f.boosting=!!input.boost&&!f.locked&&!input.brake;
  f.heat=clamp(f.heat+dt*(f.boosting?.23:-.15),0,1);
  if(f.heat>=1&&!f.locked){f.locked=true;f.boosting=false;f.events.push({type:'overheat'});}
  const cruise=f.course.config.speed,targetSpeed=cruise*(input.brake?.58:f.boosting?1.75:1);
  f.speed+=(targetSpeed-f.speed)*(1-Math.exp(-dt*2.8));
  const tx=Number.isFinite(input.targetX)?clamp(input.targetX,-58,58):f.x+(input.x||0)*24;
  const ty=Number.isFinite(input.targetY)?clamp(input.targetY,-36,36):f.y+(input.y||0)*24;
  f.vx+=(clamp((tx-f.x)*3.8,-42,42)-f.vx)*(1-Math.exp(-dt*6));
  f.vy+=(clamp((ty-f.y)*3.8,-32,32)-f.vy)*(1-Math.exp(-dt*6));
  f.x=clamp(f.x+f.vx*dt,-58,58);f.y=clamp(f.y+f.vy*dt,-36,36);f.s+=f.speed*dt;
  for(const rock of f.course.rocks){
    if(rock.s<previous.s-rock.radius-5||rock.s>f.s+rock.radius+5)continue;
    const dx=f.x-previous.x,dy=f.y-previous.y,dz=f.s-previous.s;
    const den=dx*dx+dy*dy+dz*dz;
    const t=den?clamp(((rock.x-previous.x)*dx+(rock.y-previous.y)*dy+(rock.s-previous.s)*dz)/den,0,1):0;
    const distance=Math.hypot(previous.x+t*dx-rock.x,previous.y+t*dy-rock.y,previous.s+t*dz-rock.s);
    if(distance<rock.radius+1.5&&!f.collided.has(rock.id)){
      f.collided.add(rock.id);
      if(f.invincible<=0){f.shield=Math.max(0,f.shield-28);f.invincible=1.1;f.speed*=.65;f.combo=0;f.flash=1;f.events.push({type:'hit'});}
    }else if(distance<rock.radius+5&&f.s>rock.s&&!f.near.has(rock.id)&&!f.collided.has(rock.id)){
      f.near.add(rock.id);f.nearMisses++;f.score+=80;f.events.push({type:'near'});
    }
  }
  while(f.next<f.course.gates.length&&f.s>=f.course.gates[f.next].s){
    const g=f.course.gates[f.next],t=clamp((g.s-previous.s)/(f.s-previous.s||1),0,1),distance=Math.hypot(previous.x+(f.x-previous.x)*t-g.x,previous.y+(f.y-previous.y)*t-g.y);
    if(distance<=g.radius-1.3){
      const perfect=distance<4.5;f.passed++;f.combo++;f.bestCombo=Math.max(f.bestCombo,f.combo);
      const points=(perfect?250:150)+Math.min(f.combo,10)*25+(f.boosting?100:0);f.score+=points;
      f.shield=Math.min(100,f.shield+3);f.events.push({type:'gate',perfect,points,index:f.next,x:g.x,y:g.y,s:g.s});
    }else{
      f.missed++;f.combo=0;f.penalty+=2;f.events.push({type:'miss',index:f.next});
      // A close miss strikes the physical ring; a wide miss only loses points and time.
      if(distance<g.radius+2&&f.invincible<=0){f.shield=Math.max(0,f.shield-15);f.invincible=.6;f.flash=.6;}
    }
    f.next++;
  }
  if(f.shield<=0){f.status='failed';f.reason='飞船护盾耗尽';}
  else if(f.time+f.penalty>=f.course.config.limit){f.status='failed';f.reason='航行时间用尽';}
  else if(f.s>=f.course.end){
    f.status=f.passed>=f.course.config.required?'finished':'failed';
    f.reason=f.status==='finished'?'航线完成':`穿环不足：需要 ${f.course.config.required} 个`;
    if(f.status==='finished')f.score+=Math.round(f.shield*10+Math.max(0,f.course.config.limit-f.time-f.penalty)*30);
  }
}
export function stars(f){if(f.status!=='finished')return 0;return f.passed===f.course.config.gates&&f.shield>=85?3:f.passed/f.course.config.gates>=.85&&f.shield>=50?2:1;}
export function readRecords(raw){
  const out={};try{const obj=JSON.parse(raw||'{}');for(const c of COURSES){const v=obj[c.id];if(v&&Number.isInteger(v.score)&&v.score>=0&&v.score<1000000&&Number.isInteger(v.stars)&&v.stars>=1&&v.stars<=3&&Number.isFinite(v.time)&&v.time>0&&v.time<c.limit)out[c.id]={score:v.score,stars:v.stars,time:v.time};}}catch{}return out;
}
export function saveRecord(records,f){
  if(f.status!=='finished')return false;const id=f.course.config.id,old=records[id];if(old&&old.score>=f.score)return false;
  records[id]={score:f.score,stars:stars(f),time:f.time};return true;
}
