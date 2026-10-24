export const COLS=13, ROWS=11, FUSE=2.35, FIRE=.62, STEP=1/60;
export const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
export const key=(x,y)=>`${x},${y}`;
const cell=a=>[Math.round(a.x),Math.round(a.y)];
const distance=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
export class BomberGame {
  constructor({random=Math.random,emit=()=>{}}={}){this.random=random;this.emit=emit;this.scores=[0,0,0,0];this.round=1;this.reset();}
  reset({mode=this.mode||'solo',arena=this.arena||'garden',match=true}={}){
    this.mode=mode;this.arena=arena;if(match){this.scores=[0,0,0,0];this.round=1;}
    this.state='ready';this.time=0;this.result=null;this.bombs=[];this.flames=[];this.items=[];this.pending=[];this.events=[];this.collapse=0;
    this.grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>x===0||y===0||x===COLS-1||y===ROWS-1||x%2===0&&y%2===0?1:0));
    const spawns=[[1,1],[11,9],[11,1],[1,9]];
    for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++)if(!this.grid[y][x]&&!spawns.some(p=>distance(p,[x,y])<=2)&&this.random()<.70)this.grid[y][x]=2;
    this.players=spawns.map(([x,y],id)=>({id,x,y,alive:true,human:id===0||mode==='duo'&&id===1,range:2,capacity:1,speed:3.7,dir:2,travel:null,bombQueue:0,think:0,goal:null,cooldown:0,steps:0,eliminated:0}));
  }
  start(){if(this.state==='ready')this.state='playing';}
  next(){this.round++;this.reset({match:false});this.start();}
  tile(x,y){return this.grid[y]?.[x]??1;}
  bombAt(x,y){return this.bombs.find(b=>b.x===x&&b.y===y);}
  pass(x,y,a){if(this.tile(x,y))return false;const b=this.bombAt(x,y);return !b||b.pass.has(a.id);}
  ray(x,y,range,blocked=null){const out=[[x,y]];for(const [dx,dy]of DIRS)for(let n=1;n<=range;n++){const nx=x+dx*n,ny=y+dy*n,t=this.tile(nx,ny);if(t===1||blocked?.has(key(nx,ny)))break;out.push([nx,ny]);if(t===2||this.bombAt(nx,ny))break;}return out;}
  place(a){
    if(!a.alive||this.state!=='playing'||this.bombs.filter(b=>b.owner===a.id).length>=a.capacity)return false;
    const [x,y]=cell(a);if(this.tile(x,y)||this.bombAt(x,y))return false;
    const b={x,y,owner:a.id,range:a.range,timer:FUSE,age:0,pass:new Set(this.players.filter(p=>p.alive&&Math.abs(p.x-x)<.7&&Math.abs(p.y-y)<.7).map(p=>p.id))};
    this.bombs.push(b);this.emit({type:'place',x,y});return true;
  }
  danger(extra=null){
    const bombs=extra?[...this.bombs,extra]:this.bombs, times=bombs.map(b=>b.timer),map=new Map();
    const rays=bombs.map(b=>this.ray(b.x,b.y,b.range));
    for(let i=0;i<bombs.length;i++)for(let j=0;j<bombs.length;j++)if(i!==j&&rays[i].some(c=>c[0]===bombs[j].x&&c[1]===bombs[j].y))times[j]=Math.min(times[j],times[i]);
    // Iterate again so a chain propagates regardless of insertion order.
    for(let n=0;n<bombs.length;n++)for(let i=0;i<bombs.length;i++)for(let j=0;j<bombs.length;j++)if(times[j]>times[i]&&rays[i].some(c=>c[0]===bombs[j].x&&c[1]===bombs[j].y))times[j]=times[i];
    const add=(x,y,start,end)=>{const k=key(x,y);if(!map.has(k))map.set(k,[]);map.get(k).push([start,end]);};
    bombs.forEach((b,i)=>rays[i].forEach(([x,y])=>add(x,y,times[i],times[i]+FIRE)));
    this.flames.forEach(f=>add(f.x,f.y,0,f.ttl));return map;
  }
  unsafe(map,x,y,start=0,end=start+.2){return(map.get(key(x,y))||[]).some(([a,b])=>start<b&&end>a);}
  escape(a,extra=null){
    const danger=this.danger(extra),start=cell(a),dt=1/a.speed,queue=[{p:start,t:0,first:null}],seen=new Set();
    for(let head=0;head<queue.length&&head<900;head++){
      const node=queue[head],{p,t}=node,k=`${key(...p)}:${Math.round(t/dt)}`;if(seen.has(k))continue;seen.add(k);
      if(node.first&&!this.unsafe(danger,...p,t,Math.max(FUSE+FIRE+.1,t+.6)))return node.first;
      if(t>3)continue;
      for(const d of [...DIRS,[0,0]]){const q=[p[0]+d[0],p[1]+d[1]],arrival=t+dt;
        if(this.tile(...q))continue;const bomb=this.bombAt(...q);if(bomb&&!(q[0]===start[0]&&q[1]===start[1]))continue;
        if(extra&&q[0]===extra.x&&q[1]===extra.y&&distance(p,start)>0)continue;
        if(this.unsafe(danger,...p,t,arrival-.04)||this.unsafe(danger,...q,t+.05,arrival+.15))continue;
        queue.push({p:q,t:arrival,first:node.first||d});
      }
    }return null;
  }
  bot(a){
    const [x,y]=cell(a),danger=this.danger();
    if(this.unsafe(danger,x,y,0,1.35)){const d=this.escape(a);return{dir:d};}
    const crates=DIRS.some(([dx,dy])=>this.tile(x+dx,y+dy)===2);
    const target=this.players.some(p=>p.alive&&p!==a&&distance(cell(p),[x,y])>0&&this.ray(x,y,a.range).some(c=>distance(c,cell(p))===0));
    if(a.cooldown<=0&&(crates||target)&&!this.bombAt(x,y)){
      const d=this.escape(a,{x,y,range:a.range,timer:FUSE});
      if(d&&this.place(a)){a.cooldown=2.8;return{dir:d};}
    }
    // Breadth first search for supplies, destructible walls, and rival lanes.
    const queue=[{p:[x,y],first:null,depth:0}],seen=new Set([key(x,y)]),candidates=[];
    for(let head=0;head<queue.length;head++){
      const {p,first,depth}=queue[head];if(depth>8)continue;
      if(first){const item=this.items.some(i=>distance([i.x,i.y],p)===0),wall=DIRS.some(([dx,dy])=>this.tile(p[0]+dx,p[1]+dy)===2);
        const enemyDistance=Math.min(...this.players.filter(p=>p.alive&&p!==a).map(e=>distance(cell(e),p)));
        if(item||wall||enemyDistance<=2)candidates.push({dir:first,score:(item?18:wall?9:4)-depth*.8+this.random()*3});}
      for(const d of DIRS){const q=[p[0]+d[0],p[1]+d[1]],k=key(...q);if(seen.has(k)||!this.pass(...q,a)||this.unsafe(danger,...q,0,depth/a.speed+.7))continue;seen.add(k);queue.push({p:q,first:first||d,depth:depth+1});}
    }
    candidates.sort((a,b)=>b.score-a.score);return{dir:candidates[0]?.dir||null};
  }
  detonate(b,blocked){
    if(!this.bombs.includes(b))return;
    const cells=this.ray(b.x,b.y,b.range,blocked);this.bombs.splice(this.bombs.indexOf(b),1);this.emit({type:'blast',x:b.x,y:b.y});
    for(const [x,y]of cells){
      if(blocked.has(key(x,y)))continue;
      const crate=this.tile(x,y)===2;if(crate){blocked.add(key(x,y));this.grid[y][x]=0;
        if(this.random()<.47)this.pending.push({x,y,kind:['bomb','fire','speed'][Math.floor(this.random()*3)],ttl:FIRE+.06});
        this.emit({type:'crate',x,y});}
      this.items=this.items.filter(i=>i.x!==x||i.y!==y);
      this.flames.push({x,y,ttl:FIRE,owner:b.owner,core:x===b.x&&y===b.y});
      const other=this.bombAt(x,y);if(other)this.detonate(other,blocked);
    }
  }
  kill(a,owner=null){if(!a.alive)return;a.alive=false;a.travel=null;a.eliminated=this.time;this.emit({type:'out',id:a.id,x:a.x,y:a.y,owner});}
  dropWalls(){
    const ring=[];for(let layer=1;layer<=4;layer++){for(let x=layer;x<COLS-layer;x++)ring.push([x,layer]);for(let y=layer+1;y<ROWS-layer;y++)ring.push([COLS-layer-1,y]);for(let x=COLS-layer-2;x>=layer;x--)ring.push([x,ROWS-layer-1]);for(let y=ROWS-layer-2;y>layer;y--)ring.push([layer,y]);}
    while(this.collapse<ring.length&&this.time>=90+this.collapse*.38){const [x,y]=ring[this.collapse++];this.grid[y][x]=1;this.items=this.items.filter(i=>i.x!==x||i.y!==y);this.pending=this.pending.filter(i=>i.x!==x||i.y!==y);
      this.bombs=this.bombs.filter(b=>b.x!==x||b.y!==y);this.flames=this.flames.filter(f=>f.x!==x||f.y!==y);
      for(const a of this.players)if(a.alive&&Math.abs(a.x-x)<.72&&Math.abs(a.y-y)<.72)this.kill(a);this.emit({type:'wall',x,y});}
  }
  step(dt,inputs={}){
    if(this.state!=='playing')return;dt=Math.min(dt,.05);this.time+=dt;
    this.flames.forEach(f=>f.ttl-=dt);this.flames=this.flames.filter(f=>f.ttl>0);
    this.pending.forEach(p=>p.ttl-=dt);for(const p of this.pending)if(p.ttl<=0&&this.tile(p.x,p.y)===0&&!this.flames.some(f=>f.x===p.x&&f.y===p.y))this.items.push({...p});this.pending=this.pending.filter(p=>p.ttl>0);
    const blocked=new Set();for(const b of [...this.bombs]){b.timer-=dt;b.age+=dt;if(b.timer<=0)this.detonate(b,blocked);}
    const hurt=()=>{for(const a of this.players)if(a.alive){const fire=this.flames.find(f=>Math.abs(f.x-a.x)<.69&&Math.abs(f.y-a.y)<.69);if(fire)this.kill(a,fire.owner);}};hurt();
    for(const a of this.players){if(!a.alive)continue;a.cooldown=Math.max(0,a.cooldown-dt);const input=inputs[a.id]||{};
      if(input.bomb)a.bombQueue=.23;else a.bombQueue=Math.max(0,a.bombQueue-dt);
      if(a.bombQueue>0){if(this.place(a))a.bombQueue=0;}
      a.think=Math.max(0,a.think-dt);
      if(a.human&&a.travel&&input.dir){const t=a.travel;if(input.dir[0]===t.sx-t.x&&input.dir[1]===t.sy-t.y){[t.sx,t.x]=[t.x,t.sx];[t.sy,t.y]=[t.y,t.sy];t.t=1-t.t;a.dir=DIRS.findIndex(d=>d[0]===input.dir[0]&&d[1]===input.dir[1]);}}
      if(!a.travel&&(a.human||a.think<=0)){const command=a.human?input:this.bot(a),d=command.dir;if(!a.human)a.think=.14;
        if(d&&(d[0]||d[1])){const nx=Math.round(a.x)+d[0],ny=Math.round(a.y)+d[1];if(this.pass(nx,ny,a)){a.dir=DIRS.findIndex(v=>v[0]===d[0]&&v[1]===d[1]);a.travel={sx:a.x,sy:a.y,x:nx,y:ny,t:0};}}
      }
      if(a.travel){const t=a.travel;t.t=Math.min(1,t.t+dt*a.speed);a.x=t.sx+(t.x-t.sx)*t.t;a.y=t.sy+(t.y-t.sy)*t.t;a.steps+=dt*a.speed;if(t.t>=1){a.x=t.x;a.y=t.y;a.travel=null;}}
      for(const b of this.bombs)if(Math.abs(a.x-b.x)>.72||Math.abs(a.y-b.y)>.72)b.pass.delete(a.id);
      const item=this.items.find(i=>Math.abs(i.x-a.x)<.4&&Math.abs(i.y-a.y)<.4);if(item){if(item.kind==='bomb')a.capacity=Math.min(4,a.capacity+1);if(item.kind==='fire')a.range=Math.min(6,a.range+1);if(item.kind==='speed')a.speed=Math.min(5.2,a.speed+.35);this.items.splice(this.items.indexOf(item),1);this.emit({type:'pickup',id:a.id,kind:item.kind,x:a.x,y:a.y});}
    }
    hurt();if(this.time>=90)this.dropWalls();
    const alive=this.players.filter(p=>p.alive);if(alive.length<=1||this.time>=120){const winner=alive.length===1?alive[0].id:null;if(winner!==null)this.scores[winner]++;this.result={winner,match:winner!==null&&this.scores[winner]>=2};this.state='finished';this.emit({type:'finish',winner});}
  }
}
