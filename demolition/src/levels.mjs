export const MATERIALS={
  wood:{name:'木梁',color:0xb88750,hp:44,density:65},
  brick:{name:'砖墙',color:0xb56e4b,hp:52,density:150},
  concrete:{name:'混凝土',color:0xb5b4a5,hp:75,density:210},
  steel:{name:'钢架',color:0x55686a,hp:125,density:170},
  glass:{name:'玻璃',color:0x7bb5ba,hp:12,density:30},
  barrel:{name:'爆破桶',color:0xd7a32e,hp:15,density:60},
};
export const AMMO={
  breaker:{name:'破拆弹',radius:3.2,damage:155,force:16,color:0xf3c96b},
  blast:{name:'爆破弹',radius:4.8,damage:112,force:23,color:0xe77f43},
};
export const LEVELS=[
  {id:'first-job',name:'第一单生意',tag:'木架 / 入门',hint:'先瞄准底层木柱。支撑一断，楼上会跟着下来。',ammo:4,goal:.72,line:2.5,buildings:[{x:0,z:0,floors:2,bays:2,material:'wood'}]},
  {id:'brickworks',name:'旧砖厂',tag:'砖墙 / 承重',hint:'砖墙挡住了后面的柱子。换个角度，把底层两侧都打开。',ammo:5,goal:.76,line:2.8,buildings:[{x:0,z:0,floors:3,bays:3,material:'brick'}]},
  {id:'twins',name:'双塔作业',tag:'双塔 / 分配弹药',hint:'两栋都要拆。别把弹药全交在一边。',ammo:6,goal:.78,line:2.8,buildings:[{x:-4.7,z:0,floors:4,bays:1,material:'concrete'},{x:4.7,z:0,floors:3,bays:1,material:'brick'}]},
  {id:'steel-yard',name:'钢架仓库',tag:'钢架 / 连锁爆破',hint:'钢柱比较硬。黄色爆破桶能帮你打开底层结构。',ammo:5,goal:.76,line:2.8,barrels:[[-2.2,.6,1.5],[2.2,.6,-1.5]],buildings:[{x:0,z:0,floors:3,bays:3,material:'steel'}]},
  {id:'good-neighbor',name:'邻里关系',tag:'保护目标 / 控制方向',hint:'右边的蓝色小屋要留下。爆破弹范围大，破拆弹更容易控制。',ammo:5,goal:.78,line:2.8,protect:{x:8.5,z:1,w:3.4,d:4.2,min:65},buildings:[{x:-1.6,z:0,floors:4,bays:2,material:'brick'}]},
  {id:'last-contract',name:'最后一栋',tag:'高层 / 精准拆除',hint:'先拆底层两端，再处理剩余支撑。留意左后方的小屋。',ammo:6,goal:.82,line:3.2,protect:{x:-9,z:-3,w:3.4,d:4.2,min:65},buildings:[{x:0,z:0,floors:5,bays:3,material:'concrete'}]},
  {id:'sandbox',name:'自由拆楼场',tag:'自由模式 / 无限弹药',hint:'不限弹药，不算输赢。试试从顶层打起，再换个方向拆底层。',ammo:Infinity,goal:1,line:2.8,sandbox:true,barrels:[[0,.6,0]],buildings:[{x:0,z:0,floors:5,bays:3,material:'brick'}]},
];
export function makeBlueprint(level){
  const blocks=[];
  const add=(kind,x,y,z,sx,sy,sz,supports=[],extra={})=>{const id=blocks.length;blocks.push({id,kind,x,y,z,sx,sy,sz,supports,...extra});return id;};
  for(const building of level.buildings){
    const {x:ox,z:oz,floors,bays,material}=building,span=2.8,depth=3.6;let previous=[];
    for(let floor=0;floor<floors;floor++){
      const base=floor*2.9,posts=[];
      for(let col=0;col<=bays;col++)for(let side=0;side<2;side++){
        const x=ox+(col-bays/2)*span,z=oz+(side-.5)*depth,index=col*2+side;
        posts[index]=add(material==='brick'?'concrete':material,x,base+1.35,z,.42,2.7,.42,floor?[previous[index]]:[],{anchor:floor===0,role:'column'});
      }
      const next=[];
      for(let col=0;col<=bays;col++)for(let side=0;side<2;side++){
        const index=col*2+side,x=ox+(col-bays/2)*span,z=oz+(side-.5)*depth;
        next[index]=add(material==='wood'?'wood':'concrete',x,base+2.82,z,1.35,.24,1.7,[posts[index]],{role:'cap'});
      }
      for(let col=0;col<bays;col++){
        const x=ox+(col+.5-bays/2)*span;
        for(let side=0;side<2;side++){
          const z=oz+(side-.5)*depth,parents=[posts[col*2+side],posts[(col+1)*2+side]];
          add(material==='wood'?'wood':'concrete',x,base+2.82,z,1.4,.24,1.7,parents,{role:'floor'});
          add(material,x,base+.45,z,2.2,.82,.22,parents,{role:'wall'});
          for(const paneX of [-1,1])for(const paneY of [-1,1])add('glass',x+paneX*.47,base+1.65+paneY*.34,z,.91,.65,.10,parents,{role:'window'});
          add(material==='wood'?'wood':'steel',x,base+2.5,z,2.4,.18,.23,parents,{role:'lintel'});
        }
        add(material==='wood'?'wood':'concrete',x,base+2.82,oz,2.7,.24,1.9,[posts[col*2],posts[(col+1)*2],posts[col*2+1],posts[(col+1)*2+1]],{role:'floor'});
      }
      for(let col=0;col<=bays;col++)add(material,ox+(col-bays/2)*span,base+1.35,oz,.22,2.55,2.8,[posts[col*2],posts[col*2+1]],{role:'wall'});
      previous=next;
    }
    // A visible rooftop water tank makes the last falling pieces easy to follow.
    add('steel',ox,floors*2.9+.55,oz,1.5,1.05,1.5,previous.slice(Math.floor(previous.length/2)-1,Math.floor(previous.length/2)+1),{role:'tank'});
  }
  for(const p of level.barrels||[])add('barrel',...p,.75,1.2,.75,[],{anchor:true,role:'barrel'});
  return blocks;
}
export function starsFor(level,shots,health){return Math.max(1,3-(shots>Math.ceil(level.ammo*.6)?1:0)-(level.protect&&health<90?1:0));}
export function readSave(raw){
  let data;try{data=JSON.parse(raw||'{}');}catch{}const save={};
  for(const level of LEVELS)if(Number.isInteger(data?.[level.id])&&data[level.id]>=1&&data[level.id]<=3)save[level.id]=data[level.id];
  return save;
}
