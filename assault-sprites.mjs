// Original pixel artwork. Coordinates stay in world pixels; the renderer owns camera/zoom.
const INK = '#14252b';
const px = (ctx, x, y, w, h, color) => { ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h))); };
function polygon(ctx, points, color) {
  // Rasterize sloping edges in whole pixels, including rotated limbs and armour bevels.
  const top=Math.ceil(Math.min(...points.map(p=>p[1]))),bottom=Math.ceil(Math.max(...points.map(p=>p[1])));
  ctx.fillStyle=color;
  for(let y=top;y<bottom;y++){
    const hits=[];
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[j],b=points[i],scan=y+.5;
      if((a[1]<=scan&&b[1]>scan)||(b[1]<=scan&&a[1]>scan))hits.push(a[0]+(scan-a[1])*(b[0]-a[0])/(b[1]-a[1]));
    }
    hits.sort((a,b)=>a-b);
    for(let i=0;i+1<hits.length;i+=2){const x=Math.ceil(hits[i]);ctx.fillRect(x,y,Math.max(1,Math.ceil(hits[i+1])-x),1);}
  }
}
function disc(ctx,x,y,r,color){ctx.fillStyle=color;for(let dy=-r;dy<=r;dy++){const span=Math.floor(Math.sqrt(r*r-dy*dy));ctx.fillRect(Math.round(x)-span,Math.round(y)+dy,span*2+1,1);}}
function segment(ctx, a, b, width, color) {
  const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,nx=-dy/len*width/2,ny=dx/len*width/2;
  polygon(ctx,[[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],color);
}
function bolt(ctx,x,y){px(ctx,x,y,2,2,'#192e31');px(ctx,x,y,1,1,'#d0c49a');}
function vent(ctx,x,y,count,color='#223b3b'){for(let i=0;i<count;i++)px(ctx,x+i*4,y,2,7,color);}
function flash(ctx,x,y,time,vertical=false){
  ctx.save();ctx.translate(Math.round(x),Math.round(y));if(vertical)ctx.rotate(-Math.PI/2);
  const n=Math.floor(time*70)%2;
  polygon(ctx,[[0,-2],[4,-4],[3,-1],[10+n*3,-2],[7,0],[11,2],[4,2],[2,4],[0,2]],'#db693d');
  polygon(ctx,[[0,-1],[4,-2],[3,0],[9+n*2,0],[4,1],[3,2],[0,1]],'#ffd17b');px(ctx,0,-1,4,2,'#fff2c0');ctx.restore();
}
const HERO={line:INK,cloth:'#73846b',light:'#a8b08a',deep:'#445851',pants:'#3a4c53',knee:'#61716d',boot:'#283237',skin:'#dba674',skinLight:'#f3cd96',skinDark:'#a7674d',hair:'#493b30',band:'#d86244',bandLight:'#f5985d',metal:'#718687'};
const TROOPER={line:INK,cloth:'#718071',light:'#a8ac82',deep:'#43564d',pants:'#4b5d53',knee:'#79836b',boot:'#253435',skin:'#c69c73',skinLight:'#e2c28c',skinDark:'#8b6650',hair:'#303c36',band:'#687c69',bandLight:'#a0af87',metal:'#7a8b86'};
const ELITE={...TROOPER,cloth:'#925e4f',light:'#c98d65',deep:'#624947',pants:'#4a4e51',knee:'#777364',band:'#805347',bandLight:'#be8661'};
// [front knee x/y, front ankle x/y, rear knee x/y, rear ankle x/y]
const WALK=[
  [6,-8,10,-2,-6,-8,-9,-3], [7,-7,8,-1,-4,-8,-8,-5],
  [4,-8,3,-1,-1,-9,-5,-7], [0,-9,-3,-3,4,-7,5,-1],
  [-5,-8,-9,-3,6,-8,10,-2],[-4,-8,-8,-5,7,-7,8,-1],
  [-1,-9,-5,-7,4,-8,3,-1],[4,-7,5,-1,0,-9,-3,-3],
];
function leg(ctx, hip, knee, ankle, p, rear=false){
  segment(ctx,hip,knee,7,p.line);segment(ctx,knee,ankle,6,p.line);
  segment(ctx,[hip[0],hip[1]],[knee[0],knee[1]],5,rear?p.deep:p.pants);
  segment(ctx,knee,ankle,4,rear?p.pants:p.deep);
  px(ctx,knee[0]-2,knee[1]-2,4,3,rear?p.pants:p.knee);px(ctx,knee[0]-1,knee[1]-2,2,1,p.light);
  polygon(ctx,[[ankle[0]-3,ankle[1]-3],[ankle[0]+2,ankle[1]-3],[ankle[0]+3,ankle[1]-1],[ankle[0]+5,ankle[1]],[ankle[0]+5,ankle[1]+2],[ankle[0]-3,ankle[1]+2]],p.line);
  px(ctx,ankle[0]-2,ankle[1]-2,4,3,p.boot);px(ctx,ankle[0]+2,ankle[1],2,1,'#69716c');px(ctx,ankle[0]-2,ankle[1]+2,7,1,'#101f26');
}
export function drawSoldier(ctx,actor,{player=false,time=0,aim={x:1,y:0},reduced=false}={}){
  const original=player?HERO:actor.type==='elite'?ELITE:TROOPER;
  const hurt=(player?actor.invincible>0:actor.flash>0)&&(!reduced?Math.floor(time*15)%2===0:true);
  const p=hurt?{...original,light:'#efdfb1',cloth:'#aaa891',skinLight:'#fff1c4'}:original;
  const dir=(player?actor.facing:actor.direction)||1;
  const moving=player?Math.abs(actor.vx)>30:Math.abs(Math.cos(time*.9+(actor.origin||actor.x)))>.25;
  const jumping=player&&actor.grounded===false;
  const phase=Math.floor(time*(player?15:8)+(player?0:(actor.origin||actor.x)*.07))%8;
  const stride=moving?WALK[phase]:[3,-8,3,-2,-4,-8,-5,-2];
  const pose=jumping?[6,-13,3,-6,-5,-10,-9,-7]:stride;
  const bob=!reduced&&moving&&!jumping&&[1,2,5,6].includes(phase)?1:0;
  ctx.save();ctx.translate(Math.round(actor.x+actor.w/2),Math.round(actor.y+actor.h));ctx.scale(dir,1);
  // Far limbs and the backpack are silhouettes behind the torso.
  leg(ctx,[-3,-16],pose.slice(4,6),pose.slice(6,8),p,true);
  polygon(ctx,[[-10,-29+bob],[-5,-29+bob],[-3,-25+bob],[-5,-16+bob],[-10,-16+bob],[-12,-19+bob],[-12,-26+bob]],p.line);
  px(ctx,-11,-26+bob,6,9,p.deep);px(ctx,-10,-26+bob,3,7,p.cloth);px(ctx,-10,-28+bob,4,2,p.light);px(ctx,-11,-22+bob,5,1,p.line);px(ctx,-10,-19+bob,2,2,'#9b9b75');
  leg(ctx,[2,-16],pose.slice(0,2),pose.slice(2,4),p);
  polygon(ctx,[[-5,-29+bob],[4,-30+bob],[8,-26+bob],[7,-16+bob],[4,-13+bob],[-6,-14+bob],[-8,-23+bob]],p.line);
  polygon(ctx,[[-4,-28+bob],[3,-28+bob],[6,-25+bob],[5,-17+bob],[-5,-16+bob],[-6,-24+bob]],p.cloth);
  px(ctx,-4,-27+bob,4,9,p.light);px(ctx,1,-27+bob,3,10,p.deep);px(ctx,-6,-25+bob,2,9,p.deep);
  // Harness, chest buckle, ammunition pockets and belt.
  px(ctx,-3,-28+bob,2,12,'#c3b68c');px(ctx,-2,-25+bob,1,6,'#e0d0a0');px(ctx,-4,-24+bob,4,2,'#4e5c53');px(ctx,-2,-24+bob,1,1,'#f1d39d');
  px(ctx,2,-21+bob,4,4,p.line);px(ctx,3,-21+bob,3,3,p.deep);px(ctx,3,-21+bob,2,1,p.light);
  px(ctx,-6,-16+bob,12,3,p.line);px(ctx,-5,-16+bob,3,2,'#8e8265');px(ctx,0,-16+bob,3,2,'#c7b383');px(ctx,1,-16+bob,1,1,'#f1dab0');
  px(ctx,-6,-15+bob,3,5,p.deep);px(ctx,-6,-15+bob,3,1,p.light);
  // Neck and a deliberately asymmetric face keep the side profile readable at 1×.
  px(ctx,-1,-32+bob,5,5,p.line);px(ctx,0,-32+bob,4,4,p.skinDark);px(ctx,2,-32+bob,2,3,p.skin);
  polygon(ctx,[[-5,-40+bob],[0,-43+bob],[6,-41+bob],[8,-37+bob],[7,-35+bob],[9,-34+bob],[7,-32+bob],[6,-29+bob],[0,-29+bob],[-4,-32+bob],[-6,-36+bob]],p.line);
  polygon(ctx,[[-3,-39+bob],[4,-40+bob],[6,-38+bob],[6,-35+bob],[8,-34+bob],[6,-33+bob],[5,-30+bob],[0,-30+bob],[-3,-33+bob]],p.skin);
  px(ctx,2,-38+bob,3,3,p.skinLight);px(ctx,5,-35+bob,2,2,p.skinLight);px(ctx,1,-31+bob,4,1,p.skinDark);px(ctx,0,-33+bob,2,2,p.skinDark);
  px(ctx,5,-36+bob,2,1,p.line);px(ctx,5,-37+bob,2,1,p.hair);px(ctx,-3,-35+bob,2,3,p.skinDark);px(ctx,-2,-35+bob,1,2,p.skinLight);
  if(player){
    polygon(ctx,[[-5,-40+bob],[-1,-43+bob],[4,-42+bob],[7,-40+bob],[7,-38+bob],[2,-39+bob],[0,-36+bob],[-2,-36+bob],[-3,-33+bob],[-5,-35+bob]],p.hair);
    px(ctx,-3,-41+bob,5,1,'#746047');px(ctx,0,-42+bob,2,1,'#99805a');px(ctx,-5,-38+bob,12,2,p.band);px(ctx,-4,-38+bob,8,1,p.bandLight);
    const flutter=!reduced&&moving?phase%3:1;
    polygon(ctx,[[-5,-37+bob],[-10,-38+bob],[-14,-36-flutter+bob],[-10,-35+bob],[-6,-35+bob]],p.band);
    px(ctx,-11,-37+bob,4,1,p.bandLight);px(ctx,-8,-35+bob,2,4,p.band);px(ctx,-9,-32+bob,3,1,p.bandLight);
  }else{
    polygon(ctx,[[-6,-39+bob],[-3,-43+bob],[3,-43+bob],[7,-40+bob],[8,-36+bob],[-7,-36+bob]],p.line);
    polygon(ctx,[[-5,-39+bob],[-2,-42+bob],[3,-42+bob],[6,-39+bob],[7,-37+bob],[-5,-37+bob]],p.band);
    px(ctx,-2,-41+bob,5,1,p.bandLight);px(ctx,-4,-39+bob,2,2,p.light);px(ctx,-6,-37+bob,14,1,p.bandLight);px(ctx,-4,-35+bob,2,6,p.deep);
    if(actor.type==='elite'){px(ctx,3,-40+bob,2,2,'#e2b56f');px(ctx,3,-35+bob,4,2,'#334952');px(ctx,4,-35+bob,2,1,'#e9b58a');}
  }
  const aimY=player?aim.y:0,aimX=player?Math.abs(aim.x):1;
  const len=Math.hypot(aimX,aimY)||1,ux=aimX/len,uy=aimY/len;
  // The muzzle matches the engine's (centre + aim.x * 18, y + 17 + aim.y * 8).
  const muzzle=[18*ux,-23+8*uy],rear=[muzzle[0]-22*ux,muzzle[1]-22*uy];
  const normal=[-uy,ux],gun=(along,across)=>[rear[0]+ux*along+normal[0]*across,rear[1]+uy*along+normal[1]*across];
  const gpoly=(a,b,c,d,color)=>polygon(ctx,[gun(a,b),gun(c,b),gun(c,d),gun(a,d)],color);
  const recoil=player&&actor.muzzle>0?1:0;
  const grip=gun(8-recoil,2),support=gun(15-recoil,2),elbow=[4,-20+bob];
  segment(ctx,[-2,-26+bob],[-3,-21+bob],6,p.line);segment(ctx,[-3,-21+bob],support,5,p.line);segment(ctx,[-3,-21+bob],support,3,p.skinDark);
  gpoly(-2,-2,6,3,p.line);gpoly(-1,-1,4,2,player?'#816e50':p.deep);gpoly(0,-1,3,0,'#b09c74');
  gpoly(4,-3,16,2,p.line);gpoly(5,-2,15,1,p.metal);gpoly(6,-2,14,-1,'#b5c3b4');gpoly(8,1,11,5,p.line);gpoly(9,2,11,4,'#5a706d');
  gpoly(16,-2,22,1,p.line);gpoly(16,-1,21,0,'#b3bca3');gpoly(20,-3,21,-2,p.line);gpoly(8,-4,12,-3,p.line);gpoly(6,0,10,1,'#31484a');
  if(player&&actor.weapon==='spread'){gpoly(12,0,21,2,'#b48b58');gpoly(13,0,20,1,'#ead09a');}
  if(player&&actor.weapon==='rapid'){gpoly(8,2,13,5,'#7a8263');gpoly(9,2,12,3,'#d1b77c');gpoly(18,-3,22,1,'#899995');}
  // Near shoulder cap, forearm and the hand that closes around the trigger.
  segment(ctx,[2,-27+bob],elbow,7,p.line);segment(ctx,elbow,grip,5,p.line);
  segment(ctx,[2,-26+bob],elbow,5,p.skinDark);segment(ctx,[3,-25+bob],elbow,3,p.skin);
  segment(ctx,elbow,grip,3,p.skin);px(ctx,grip[0]-1,grip[1]-1,3,2,p.skinLight);
  polygon(ctx,[[-1,-29+bob],[3,-29+bob],[6,-26+bob],[5,-23+bob],[0,-24+bob],[-2,-26+bob]],p.line);
  px(ctx,-1,-28+bob,5,3,p.light);px(ctx,0,-28+bob,3,1,player?'#d9cc9e':p.bandLight);px(ctx,2,-25+bob,3,1,p.deep);
  if(player&&actor.muzzle>0){ctx.save();ctx.translate(Math.round(muzzle[0]),Math.round(muzzle[1]));ctx.rotate(Math.atan2(uy,ux));flash(ctx,0,0,time);ctx.restore();}
  if(!player&&actor.timer>(actor.type==='elite'?1.79:1.44))flash(ctx,muzzle[0],muzzle[1],time);
  ctx.restore();
}

function drawTurret(ctx,a,{time,reduced}){
  ctx.save();ctx.translate(Math.round(a.x+a.w/2),Math.round(a.y+a.h));ctx.scale(a.direction||-1,1);
  const light=a.flash>0?'#e6d3a0':'#b0b091',body=a.flash>0?'#c4bca0':'#788a78';
  // Splayed feet, a rotating bearing, sloped housing and a vented barrel.
  polygon(ctx,[[-13,-9],[-19,-3],[-19,0],[-10,0],[-7,-6]],INK);polygon(ctx,[[10,-9],[18,-4],[20,0],[10,0],[6,-6]],INK);
  px(ctx,-17,-3,9,2,'#556e64');px(ctx,10,-3,8,2,'#748573');px(ctx,-13,-8,26,5,'#243c3e');px(ctx,-10,-9,20,2,'#b2ab83');
  polygon(ctx,[[-13,-24],[-8,-30],[6,-30],[13,-24],[14,-11],[8,-7],[-10,-7],[-15,-12]],INK);
  polygon(ctx,[[-12,-23],[-7,-28],[6,-28],[12,-23],[12,-13],[7,-10],[-10,-10],[-13,-14]],body);
  polygon(ctx,[[-11,-23],[-6,-27],[5,-27],[10,-23]],light);px(ctx,-12,-22,23,1,'#c7c5a0');
  px(ctx,-11,-20,6,8,'#3d5752');vent(ctx,-10,-19,2);px(ctx,-3,-18,9,7,'#435f5c');px(ctx,-2,-17,6,3,'#22383d');
  px(ctx,-1,-17,4,2,a.timer<.4?'#ffc977':'#c77c58');px(ctx,0,-17,2,1,'#ffe0a0');
  disc(ctx,8,-20,6,INK);disc(ctx,8,-20,4,'#5b7770');disc(ctx,8,-20,2,light);
  px(ctx,9,-23,19,7,INK);px(ctx,10,-22,17,4,'#546e68');px(ctx,11,-22,16,1,'#b9c0a1');px(ctx,25,-24,5,9,INK);px(ctx,26,-23,3,7,'#8b9d86');
  for(let i=0;i<3;i++)px(ctx,13+i*4,-20,2,2,'#243d40');
  bolt(ctx,-10,-12);bolt(ctx,8,-12);px(ctx,-5,-25,3,1,'#ecd3a2');
  if(a.timer<.3){px(ctx,-1,-19,4,1,'#ffd297');if(!reduced&&Math.floor(time*12)%2)px(ctx,-2,-20,6,1,'#f6a15d');}
  if(a.timer>1.79)flash(ctx,30,-20,time);ctx.restore();
}
function drawDrone(ctx,a,{time,reduced}){
  ctx.save();ctx.translate(Math.round(a.x),Math.round(a.y));
  // Twin counter-rotating rotors are distinct from the grounded weapon silhouettes.
  const rotation=reduced?0:Math.floor(time*32)%3;
  px(ctx,1,7,34,4,INK);px(ctx,2,7,32,1,'#8eaaa1');
  for(const x of [1,34]){
    px(ctx,x-1,-2,3,10,INK);px(ctx,x,-1,1,7,'#a2b6a3');
    const blade=[12,8,4][rotation];px(ctx,x-blade,-3,blade*2+1,2,'#233a40');px(ctx,x-blade+1,-3,blade-2,1,'#9fae9e');px(ctx,x-3,-4,7,2,'#607c75');
    px(ctx,x-3,4,7,5,'#1b343b');px(ctx,x-2,4,5,3,'#7f998b');px(ctx,x-2,4,4,1,'#c5c6a3');
  }
  const body=a.flash>0?'#d7d9b6':'#708e85';
  polygon(ctx,[[9,5],[25,5],[31,10],[30,18],[25,22],[10,22],[5,17],[5,10]],INK);
  polygon(ctx,[[10,6],[24,6],[29,11],[28,17],[24,20],[11,20],[7,16],[7,10]],body);
  polygon(ctx,[[11,6],[23,6],[27,10],[9,10]],'#aec0a6');px(ctx,11,7,11,1,'#d5d8b6');px(ctx,8,11,19,1,'#405e5b');
  px(ctx,8,13,5,4,'#324f50');px(ctx,23,13,4,4,'#324f50');px(ctx,9,13,3,1,'#9eb19c');
  disc(ctx,18,16,6,INK);disc(ctx,18,16,4,'#8d6952');disc(ctx,18,16,3,a.timer<.4?'#ffd384':'#d7955d');px(ctx,17,14,2,2,'#ffe3a2');px(ctx,19,18,2,1,'#9d6044');
  px(ctx,9,21,3,3,'#314d4b');px(ctx,24,21,3,3,'#314d4b');px(ctx,8,24,6,2,INK);px(ctx,23,24,6,2,INK);
  bolt(ctx,9,9);bolt(ctx,24,9);px(ctx,15,3,6,2,'#384e4b');px(ctx,16,2,4,1,'#bd9e67');
  ctx.restore();
}
export function drawEnemy(ctx,actor,{time=0,reduced=false}={}){
  if(actor.type==='turret')drawTurret(ctx,actor,{time,reduced});
  else if(actor.type==='drone')drawDrone(ctx,actor,{time,reduced});
  else drawSoldier(ctx,actor,{time,reduced});
}
export function drawBoss(ctx,boss,{time=0,reduced=false}={}){
  if(boss.hp<=0)return;
  ctx.save();ctx.translate(Math.round(boss.x),Math.round(boss.y));
  const damaged=boss.hp/boss.maxHp<.55,charge=boss.active&&boss.timer<.55;
  const base=boss.flash>0?'#bdc4a5':'#6f8371',light=boss.flash>0?'#e5d9ae':'#b2b68b';
  // Rear machinery, tall exhaust stacks, antenna and the split running gear.
  px(ctx,132,24,12,43,INK);px(ctx,134,24,8,35,'#435959');px(ctx,134,24,3,32,'#7f9390');
  px(ctx,131,23,14,4,'#a8ac8a');px(ctx,134,30,8,2,'#263c40');px(ctx,134,35,8,2,'#263c40');px(ctx,138,17,5,7,'#273d3e');
  px(ctx,110,-13,1,29,'#233f43');px(ctx,109,-16,3,3,'#b4c5a4');px(ctx,106,7,8,6,'#263d3e');
  polygon(ctx,[[-3,82],[8,76],[140,76],[157,86],[160,103],[151,113],[7,113],[-9,103],[-9,91]],INK);
  polygon(ctx,[[1,86],[11,82],[138,82],[152,89],[155,100],[147,108],[8,108],[-4,101],[-4,92]],'#334d4a');
  // Individual tread links and hubs produce a mechanical silhouette without a black rectangle.
  const tread=reduced?0:Math.floor(time*4)%7;
  for(let x=4;x<149;x+=9){px(ctx,x+tread-4,82,7,3,'#596c5d');px(ctx,x+tread-4,109,7,3,'#72806a');px(ctx,x+tread-3,110,5,1,'#a0a383');}
  for(const x of [-6,153]){px(ctx,x,90,4,7,'#627669');px(ctx,x,99,4,6,'#54685b');}
  for(let i=0;i<6;i++){
    const x=13+i*25;disc(ctx,x,96,11,INK);disc(ctx,x,96,9,'#738473');disc(ctx,x,96,7,'#3c5651');disc(ctx,x,96,4,'#9ba187');disc(ctx,x,96,2,'#233e40');
    px(ctx,x-6,90,5,1,'#c0bc93');px(ctx,x+4,99,2,3,'#263e3d');bolt(ctx,x-5,96);
  }
  polygon(ctx,[[6,35],[122,32],[145,44],[158,66],[152,86],[4,87],[-9,72],[-7,49]],INK);
  polygon(ctx,[[8,38],[120,35],[142,47],[154,66],[149,81],[7,82],[-5,70],[-3,50]],base);
  polygon(ctx,[[8,38],[119,35],[133,42],[6,45],[-2,50]],light);
  polygon(ctx,[[4,47],[133,44],[144,54],[3,57],[-4,68],[-3,50]],'#88997c');
  polygon(ctx,[[6,59],[144,55],[151,66],[145,79],[9,79],[-2,70]],'#49675c');
  px(ctx,9,57,127,2,'#c6bd8f');px(ctx,10,60,125,2,'#283f40');
  // Front glacis plates, tow hooks and a small hazard stripe.
  polygon(ctx,[[6,64],[33,64],[36,76],[7,76]],'#81917a');px(ctx,11,66,18,2,'#bfc19a');px(ctx,11,72,19,2,'#334d48');
  for(const x of [13,122]){px(ctx,x,78,7,7,INK);px(ctx,x+1,79,5,4,'#a0a78a');px(ctx,x+2,80,3,2,'#243f40');}
  px(ctx,108,64,29,12,'#2b4645');vent(ctx,110,65,6,'#91a18c');px(ctx,110,73,24,1,'#142d33');
  px(ctx,48,65,34,12,'#5e7968');px(ctx,50,66,28,1,'#9baa86');px(ctx,56,69,13,3,'#c4b78b');px(ctx,58,69,3,3,'#485f52');px(ctx,64,69,3,3,'#485f52');
  for(const [x,y]of [[6,49],[31,49],[92,47],[128,48],[9,75],[40,76],[92,75],[143,74]])bolt(ctx,x,y);
  // Offset, bevelled turret with a mantlet; barrel muzzle aligns with the attack direction.
  polygon(ctx,[[30,1],[96,1],[117,13],[124,35],[111,44],[20,44],[14,34],[16,14]],INK);
  polygon(ctx,[[31,4],[95,4],[114,15],[119,33],[109,40],[22,40],[18,32],[20,15]],base);
  polygon(ctx,[[31,4],[94,4],[105,11],[29,12],[20,17]],light);
  polygon(ctx,[[30,14],[106,13],[114,20],[114,32],[103,36],[29,36]],'#8f9d7c');
  px(ctx,31,15,70,1,'#c5c4a0');px(ctx,97,17,12,16,'#5a7466');vent(ctx,98,19,3,'#324e47');
  px(ctx,49,0,34,5,'#2a4342');px(ctx,52,-3,28,4,'#748974');px(ctx,54,-3,24,1,'#c0c29c');px(ctx,60,-6,13,3,'#243d40');px(ctx,62,-5,9,1,'#839f91');
  // Observation glass and warm targeting lamp remain identifiable against the armour.
  px(ctx,52,19,28,12,INK);px(ctx,54,20,24,8,'#344e50');px(ctx,55,21,21,2,charge?'#ffe1a0':'#9bb8a5');px(ctx,56,24,18,1,charge?'#f7b367':'#587c77');px(ctx,63,20,2,8,'#203c40');
  px(ctx,84,24,5,5,'#283f40');px(ctx,85,25,3,3,charge?'#ffcd7c':'#bc875d');
  disc(ctx,25,26,13,INK);disc(ctx,25,26,11,'#536e63');disc(ctx,25,26,8,'#98a68a');disc(ctx,25,26,5,'#344d49');
  px(ctx,-43,19,68,14,INK);px(ctx,-41,21,65,9,'#5e7770');px(ctx,-39,21,58,2,'#b6bda0');px(ctx,-40,28,60,2,'#324e4b');
  for(const x of [-28,-7,13]){px(ctx,x,18,5,16,'#2b4443');px(ctx,x+1,19,3,13,'#81978a');px(ctx,x+1,19,3,2,'#c6c7a3');}
  polygon(ctx,[[-54,17],[-43,17],[-39,20],[-39,32],[-43,36],[-54,36],[-58,32],[-58,21]],INK);
  polygon(ctx,[[-53,19],[-44,19],[-42,22],[-42,31],[-45,33],[-53,33],[-55,30],[-55,22]],'#8c9c82');px(ctx,-55,22,5,9,'#233c40');px(ctx,-54,23,2,7,'#101f29');px(ctx,-52,20,7,1,'#d0cb9e');
  bolt(ctx,34,32);bolt(ctx,89,32);bolt(ctx,34,8);bolt(ctx,91,8);
  // Hand-placed wear, scratches and chipped edges, never random frame-to-frame noise.
  for(const [x,y,w]of [[37,19,5],[42,33,7],[88,8,4],[19,54,8],[77,47,6],[132,56,5],[90,70,6],[30,41,3]]){px(ctx,x,y,w,1,'#c1b990');px(ctx,x+1,y+1,Math.max(1,w-2),1,'#415c52');}
  if(damaged){
    polygon(ctx,[[111,44],[119,46],[116,51],[122,54],[117,60],[121,67],[110,65],[105,55]],'#293e3e');
    px(ctx,112,49,4,2,'#bc7750');px(ctx,115,58,3,2,'#e5a95e');px(ctx,111,61,2,2,'#e9bc75');
    const phase=reduced?0:Math.floor(time*7)%3;
    for(let i=0;i<3;i++){const x=139+((i+phase)%3)*3,y=13-i*8-phase;disc(ctx,x,y,4+i,'#435651');px(ctx,x-1,y-2,3,2,'#6c7c68');}
    px(ctx,137,20,5,3,'#d58b50');px(ctx,139,18,2,4,'#efbd6c');
  }
  if(charge){
    const p=reduced?1:.5+(Math.sin(time*24)+1)*.25;
    ctx.globalAlpha=p;px(ctx,-57,21,3,11,'#f7b267');px(ctx,-58,23,1,7,'#ffe8a9');px(ctx,83,23,7,1,'#f4bb6b');ctx.globalAlpha=1;
  }
  if(boss.active&&boss.pattern>0&&boss.timer>(boss.hp<55?1.24:1.84)){ctx.save();ctx.translate(-58,26);ctx.scale(-2,2);flash(ctx,0,0,time);ctx.restore();}
  ctx.restore();
}
