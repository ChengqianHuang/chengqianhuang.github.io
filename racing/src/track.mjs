import { CatmullRomCurve3, Vector3 } from 'three';

export const GATES = 24;
export const wrap = n => ((n % 1) + 1) % 1;
export const deltaU = (to, from) => ((to - from + 1.5) % 1) - .5;
const definitions = [
  {
    id: 'harbor', name: '港区环线', label: 'HARBOR / 01', style: '均衡', width: 14, pace: 1,
    description: '穿过货柜与吊机，直道外侧有一段小跳台。', ground: [380, 260],
    points: [[-65,60],[15,60],[95,60],[135,25],[130,-25],[90,-70],[25,-70],[-30,-40],[-80,-65],[-130,-35],[-135,20]],
    ramp: {x:-20,z:65.2}, props: Array.from({length:12},(_,i)=>({x:32+i*2.4,y:.5,z:65.8})),
  },
  {
    id: 'coast', name: '海堤高速', label: 'COAST / 02', style: '高速', width: 16, pace: 1.15,
    description: '沿着海堤拉高车速，在灯塔前的大弯收住油门。', ground: [480, 300],
    points: [[-95,50],[15,50],[135,50],[180,15],[175,-50],[120,-98],[30,-105],[-75,-100],[-160,-55],[-170,10]],
    props: [],
  },
  {
    id: 'oldtown', name: '旧城连弯', label: 'OLD TOWN / 03', style: '技术', width: 12, pace: .82, tension: .6,
    description: '连续变向接紧弯，提前刹车，留意出弯的位置。', ground: [380, 300],
    points: [[-75,75],[10,75],[95,75],[135,40],[135,-15],[90,-40],[30,-10],[-10,-25],[0,-75],[-55,-100],[-120,-80],[-145,-25],[-140,35]],
    props: [],
  },
];

export function createTrack(definition) {
  const curve=new CatmullRomCurve3(definition.points.map(([x,z])=>new Vector3(x,0,z)),true,'catmullrom',definition.tension??.35);
  curve.arcLengthDivisions=3000;
  const LENGTH=curve.getLength(), WIDTH=definition.width;
  function sample(u,offset=0) {
    const p=curve.getPointAt(wrap(u)),t=curve.getTangentAt(wrap(u));
    return {x:p.x+t.z*offset,z:p.z-t.x*offset,tx:t.x,tz:t.z,yaw:Math.atan2(t.x,t.z)};
  }
  const samples=Array.from({length:720},(_,i)=>sample(i/720));
  const bounds={minX:Math.min(...samples.map(p=>p.x)),maxX:Math.max(...samples.map(p=>p.x)),minZ:Math.min(...samples.map(p=>p.z)),maxZ:Math.max(...samples.map(p=>p.z))};
  function project(p,width=220,height=140,padding=17) {
    const scale=Math.min((width-2*padding)/(bounds.maxX-bounds.minX),(height-2*padding)/(bounds.maxZ-bounds.minZ));
    return [width/2+(p.x-(bounds.minX+bounds.maxX)/2)*scale,height/2+(p.z-(bounds.minZ+bounds.maxZ)/2)*scale];
  }
  function nearest(x,z) {
    let best=Infinity,index=0;
    for(let i=0;i<samples.length;i++){const p=samples[i],d=(p.x-x)**2+(p.z-z)**2;if(d<best){best=d;index=i;}}
    return {u:index/samples.length,distance:Math.sqrt(best),...samples[index]};
  }
  const barriers=[];
  for(let i=0;i<Math.ceil(LENGTH/4);i++)for(const side of [-1,1]){
    const p=sample(i/Math.ceil(LENGTH/4),side*(WIDTH/2+1.2));
    barriers.push({...p,side,length:LENGTH/Math.ceil(LENGTH/4)+.15});
  }
  const grid=(index=0)=>sample(-.012-Math.floor(index/2)*.011,index%2===0?-2.2:2.2);
  function aiInput(car,index=0) {
    const n=nearest(car.x,car.z),speed=Math.abs(car.speed),pace=definition.pace;
    const look=7+speed*.55,target=sample(n.u+look/LENGTH,(index-1)*2.5);
    const angle=Math.atan2(target.x-car.x,target.z-car.z);
    const error=Math.atan2(Math.sin(angle-car.yaw),Math.cos(angle-car.yaw));
    const ahead=sample(n.u+(look+19)/LENGTH),here=sample(n.u+5/LENGTH);
    const bend=Math.abs(Math.atan2(Math.sin(ahead.yaw-here.yaw),Math.cos(ahead.yaw-here.yaw)));
    const targetSpeed=Math.max(8*pace,Math.min((32-index*.8)*pace,(29-bend*15)*pace));
    return {throttle:speed<targetSpeed?1:.1,brake:speed>targetSpeed+1?Math.min(1,(speed-targetSpeed)/5):0,steer:Math.max(-1,Math.min(1,-error*1.65)),handbrake:0};
  }
  function createProgress(p=grid()) {return {next:0,passed:0,lap:0,last:nearest(p.x,p.z).u,travel:0,lapStart:0,lapTimes:[],finished:false,total:0};}
  function updateProgress(state,position,time,totalLaps=3) {
    if(state.finished)return null;
    const n=nearest(position.x,position.z),step=deltaU(n.u,state.last);state.last=n.u;
    // Every gate must be taken in order; reverse driving and teleports earn no progress.
    if(Math.abs(step)>.04||n.distance>WIDTH/2+2)return null;
    state.travel+=step;const gate=state.next/GATES;
    const before=deltaU(gate,wrap(n.u-step)),after=deltaU(gate,n.u);
    if(step>0&&before>=0&&after<=0&&Math.abs(before)<.05){
      state.next=(state.next+1)%GATES;state.passed++;
      if(state.next===1){
        if(state.lap>0)state.lapTimes.push(time-state.lapStart);
        state.lapStart=time;state.lap++;
        if(state.lap>totalLaps){state.finished=true;state.total=time;return 'finish';}
        return 'lap';
      }
    }
    return null;
  }
  function recoverPoint(state){const u=wrap((state.next-1)/GATES+.003);return {...sample(u),u};}
  return {...definition,curve,LENGTH,WIDTH,samples,bounds,barriers,sample,nearest,project,grid,aiInput,createProgress,updateProgress,recoverPoint};
}
export const TRACKS=definitions.map(createTrack);
export const getTrack=id=>TRACKS.find(t=>t.id===id)||TRACKS[0];
// Default aliases preserve the original harbor physics fixtures.
export const {curve,LENGTH,WIDTH,sample,samples,barriers,grid,nearest,aiInput,createProgress,updateProgress,recoverPoint}=TRACKS[0];
export function formatTime(seconds){
  if(!Number.isFinite(seconds))return '—:——.——';
  const n=Math.max(0,Math.floor(seconds*100));
  return `${Math.floor(n/6000)}:${String(Math.floor(n/100)%60).padStart(2,'0')}.${String(n%100).padStart(2,'0')}`;
}
