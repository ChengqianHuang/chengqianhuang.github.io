// Replay data has no physics bodies and cannot affect checkpoint validation.
export const GHOST_KEY='harbor-rush-ghost-v1';
const MAX=6002,STEP=.1;
export const eligibleGhostRun=({mode,demoRun=false,penalty=0})=>mode==='trial'&&!demoRun&&penalty===0;
const finite=n=>Number.isFinite(n);
const round=(n,p=1000)=>Math.round(n*p)/p||0;
export function routeSignature(track){let hash=2166136261;const text=JSON.stringify([track.id,round(track.LENGTH),track.samples.filter((_,i)=>i%24===0).map(p=>[round(p.x),round(p.y||0),round(p.z)])]);for(const ch of text)hash=Math.imul(hash^ch.charCodeAt(0),16777619);return (hash>>>0).toString(16);}
export function createRecorder(track,car){const r={v:1,track:track.id,route:routeSignature(track),time:0,samples:[],gates:[null],invalid:false};recordFrame(r,0,car,0,true);return r;}
export function recordFrame(r,time,car,passed,force=false){
 if(r.invalid)return;
 if(time>600){r.invalid=true;r.invalidReason='limit';return;}
 if(!finite(time)||!Number.isInteger(passed)||passed<0||passed>25){r.invalid=true;return;}
 const last=r.samples.at(-1);
 if(last&&time<last[0]-.00051){r.invalid=true;return;}
 if(passed>0&&r.gates[passed]==null)r.gates[passed]=time;
 if(!force&&last&&time-last[0]<STEP-1e-6)return;
 const sample=[time,car.x,car.y,car.z,car.q.x,car.q.y,car.q.z,car.q.w,car.wheels?.[0]?.steer||0,car.wheels?.[0]?.rotation||0,passed];
 if(!sample.every(finite)){r.invalid=true;return;}
 if(last&&Math.hypot(sample[1]-last[1],sample[2]-last[2],sample[3]-last[3])>100*(time-last[0])+2){r.invalid=true;return;}
 const packed=sample.map((v,i)=>round(v,i>=4&&i<=7?100000:1000));
 if(last&&packed[0]===last[0])r.samples[r.samples.length-1]=packed;else r.samples.push(packed);
 if(r.samples.length>MAX){r.invalid=true;r.samples=[];}
}
export function finishRecording(r,progress,time,car){
 if(!r||r.invalid||!progress.finished||progress.passed!==25)return null;
 recordFrame(r,time,car,25,true);r.time=time;
 if(r.invalid)return null;
 return {v:1,track:r.track,route:r.route,time:round(time),samples:r.samples,gates:r.gates.map(t=>t==null?null:round(t))};
}
export function validGhost(g,track){
 if(!g||g.v!==1||g.track!==track.id||g.route!==routeSignature(track)||!finite(g.time)||g.time<=0||g.time>600||!Array.isArray(g.samples)||g.samples.length<2||g.samples.length>MAX||!Array.isArray(g.gates)||g.gates.length!==26)return false;
 let previous=-1,passed=0;
 for(const p of g.samples){if(!Array.isArray(p)||p.length!==11||!p.every(finite)||p[0]<=previous||p[0]>g.time+.002||p.slice(1,4).some(v=>Math.abs(v)>100000)||!Number.isInteger(p[10])||p[10]<passed||p[10]>25)return false;const q=Math.hypot(...p.slice(4,8));if(q<.95||q>1.05)return false;previous=p[0];passed=p[10];}
 if(g.samples[0][0]!==0||g.samples[0][10]!==0||g.samples.at(-1)[10]!==25||Math.abs(g.samples.at(-1)[0]-g.time)>.002)return false;
 let prev=0;for(let i=1;i<=25;i++){const t=g.gates[i];if(!finite(t)||t<prev||t>g.time+.002)return false;prev=t;}
 return true;
}
export function readGhosts(raw,tracks){let data;try{data=JSON.parse(raw);}catch{return {};}
 const out={};for(const t of tracks)if(validGhost(data?.[t.id],t))out[t.id]=data[t.id];return out;
}
export function sampleGhost(g,t){
 if(!g||t<0||t>g.time)return null;const a=g.samples;let lo=0,hi=a.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(a[mid][0]<=t)lo=mid;else hi=mid;}
 const p=a[lo],q=a[hi],f=Math.max(0,Math.min(1,(t-p[0])/(q[0]-p[0]))),v=p.map((n,i)=>n+(q[i]-n)*f);
 const dot=p.slice(4,8).reduce((s,n,i)=>s+n*q[i+4],0),sign=dot<0?-1:1;
 const quat=p.slice(4,8).map((n,i)=>n+(q[i+4]*sign-n)*f),len=Math.hypot(...quat);return {x:v[1],y:v[2],z:v[3],q:{x:quat[0]/len,y:quat[1]/len,z:quat[2]/len,w:quat[3]/len},wheels:Array.from({length:4},(_,i)=>({length:.35,steer:i<2?v[8]:0,rotation:v[9]})),input:{}};
}
export function sectorDifferences(g,current){let from=1;const out=[];for(const to of [7,13,19,25]){if(current[to]!=null&&current[from]!=null)out.push({sector:out.length+1,delta:(current[to]-current[from])-(g.gates[to]-g.gates[from])});from=to;}return out;}
