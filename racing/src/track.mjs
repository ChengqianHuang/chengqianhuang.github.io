import { CatmullRomCurve3, Vector3 } from 'three';

export const WIDTH = 14;
export const GATES = 24;
export const curve = new CatmullRomCurve3([
  [-65,60],[15,60],[95,60],[135,25],[130,-25],[90,-70],
  [25,-70],[-30,-40],[-80,-65],[-130,-35],[-135,20],
].map(([x,z])=>new Vector3(x,0,z)), true, 'catmullrom', .35);
curve.arcLengthDivisions = 3000;
export const LENGTH = curve.getLength();
export const wrap = n => ((n%1)+1)%1;
export function sample(u, offset=0) {
  const p=curve.getPointAt(wrap(u)), t=curve.getTangentAt(wrap(u));
  return {x:p.x+t.z*offset, z:p.z-t.x*offset, tx:t.x,tz:t.z,yaw:Math.atan2(t.x,t.z)};
}
export const samples = Array.from({length:720},(_,i)=>sample(i/720));
export function nearest(x,z) {
  let best=Infinity, index=0;
  for(let i=0;i<samples.length;i++) { const p=samples[i], d=(p.x-x)**2+(p.z-z)**2; if(d<best){best=d;index=i;} }
  return {u:index/samples.length,distance:Math.sqrt(best),...samples[index]};
}
export function deltaU(to,from) {return ((to-from+1.5)%1)-.5;}
export const barriers = [];
for(let i=0;i<Math.ceil(LENGTH/4);i++) for(const side of [-1,1]) {
  const p=sample(i/Math.ceil(LENGTH/4),side*(WIDTH/2+1.2));
  barriers.push({...p,side,length:LENGTH/Math.ceil(LENGTH/4)+.15});
}
export function grid(index=0) {return sample(-.012-Math.floor(index/2)*.011,index%2===0?-2.2:2.2);}

export function aiInput(car, index=0) {
  const n=nearest(car.x,car.z), speed=Math.abs(car.speed);
  const look=7+speed*.55, target=sample(n.u+look/LENGTH, (index-1)*2.5);
  const angle=Math.atan2(target.x-car.x,target.z-car.z);
  const error=Math.atan2(Math.sin(angle-car.yaw),Math.cos(angle-car.yaw));
  const ahead=sample(n.u+(look+19)/LENGTH), here=sample(n.u+5/LENGTH);
  const bend=Math.abs(Math.atan2(Math.sin(ahead.yaw-here.yaw),Math.cos(ahead.yaw-here.yaw)));
  const targetSpeed=Math.max(11,Math.min(32-index*.8,29-bend*15));
  return {throttle:speed<targetSpeed?1:.1,brake:speed>targetSpeed+1?Math.min(1,(speed-targetSpeed)/5):0,
    steer:Math.max(-1,Math.min(1,-error*1.65)),handbrake:0};
}

export function createProgress(p=grid()) {
  return {next:0,passed:0,lap:0,last:nearest(p.x,p.z).u,travel:0,lapStart:0,lapTimes:[],finished:false,total:0};
}
export function updateProgress(state,position,time,totalLaps=3) {
  if(state.finished) return null;
  const n=nearest(position.x,position.z), step=deltaU(n.u,state.last);
  state.last=n.u;
  // Reject teleports and off-course gate crossings. Every gate must be taken in order.
  if(Math.abs(step)>.04 || n.distance>WIDTH/2+2) return null;
  state.travel+=step;
  const gate=state.next/GATES;
  const before=deltaU(gate,wrap(n.u-step)),after=deltaU(gate,n.u);
  if(step>0 && before>=0 && after<=0 && Math.abs(before)<.05) {
    state.next=(state.next+1)%GATES;
    state.passed++;
    if(state.next===1) {
      if(state.lap>0) state.lapTimes.push(time-state.lapStart);
      state.lapStart=time; state.lap++;
      if(state.lap>totalLaps) {state.finished=true;state.total=time;return 'finish';}
      return 'lap';
    }
  }
  return null;
}
export function recoverPoint(state) {
  const u=wrap((state.next-1)/GATES+.003);
  return {...sample(u),u};
}
export function formatTime(seconds) {
  if(!Number.isFinite(seconds))return '—:——.——';
  const n=Math.max(0,Math.floor(seconds*100));
  return `${Math.floor(n/6000)}:${String(Math.floor(n/100)%60).padStart(2,'0')}.${String(n%100).padStart(2,'0')}`;
}
