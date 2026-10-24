// Hand-drawn, deterministic pixel scenery. Static layers are painted once;
// gameplay silhouettes and walkable ledges remain brighter than the scenery.
const palette = {
  ink: '#192f34', deep: '#253c40', steel: '#456064', edge: '#8b9790',
  moss: '#64765a', copper: '#a17d57', gold: '#d6b578', light: '#e0cba0',
};
const terrainCache = new WeakMap();
let scenery;
const R = (c,x,y,w,h,color) => { c.fillStyle=color; c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h)); };
function polygon(c,points,color) {
  c.fillStyle=color; c.beginPath(); points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y))); c.closePath(); c.fill();
}
function line(c,points,color,width=1) {
  c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x)+.5,Math.round(y)+.5):c.moveTo(Math.round(x)+.5,Math.round(y)+.5));c.stroke();
}
function rng(seed) { let n=seed|0;return ()=>{n=(Math.imul(n,1664525)+1013904223)|0;return (n>>>0)/4294967296;}; }
function surface(width,height) {
  const canvas=typeof OffscreenCanvas==='function'?new OffscreenCanvas(width,height):Object.assign(document.createElement('canvas'),{width,height});
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;return {canvas,c};
}
function cloud(c,x,y,w,shade='#b8b4a0') {
  polygon(c,[[x,y+13],[x+17,y+13],[x+17,y+7],[x+37,y+7],[x+37,y],[x+65,y],[x+65,y+4],[x+w*.66,y+4],[x+w*.66,y+10],[x+w-19,y+10],[x+w-19,y+15],[x+w,y+15],[x+w,y+21],[x+27,y+21],[x+27,y+18],[x,y+18]],shade);
  R(c,x+24,y+18,w-30,2,'#bca98a');R(c,x+48,y+22,w-76,1,'#d8bc8e');
}
function windowGrid(c,x,y,cols,rows,random,scale=1) {
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++) {
    const wx=x+col*16*scale,wy=y+row*24*scale,lit=random()>.7;
    R(c,wx-1,wy-1,10*scale,15*scale,'#364c4c');R(c,wx,wy,8*scale,12*scale,lit?'#b09d73':'#60716b');
    R(c,wx,wy+1,7*scale,2*scale,lit?'#c3ad80':'#7a8375');R(c,wx+3*scale,wy,1,12*scale,'#485a55');R(c,wx,wy+6*scale,8*scale,1,'#485a55');
    if(random()>.7)R(c,wx,wy+8*scale,3*scale,4*scale,'#344a49');
  }
}
function ruin(c,x,y,w,h,seed) {
  const random=rng(seed);
  polygon(c,[[x,y+12],[x+15,y+12],[x+15,y],[x+w*.45,y],[x+w*.45,y+17],[x+w*.62,y+17],[x+w*.62,y+7],[x+w-9,y+7],[x+w-9,y+24],[x+w,y+24],[x+w,y+h],[x,y+h]],'#4b605c');
  R(c,x+6,y+20,w-12,h-20,'#50645e');R(c,x+6,y+20,4,h-20,'#788074');R(c,x+w-10,y+24,6,h-24,'#344c4c');
  for(let yy=y+46;yy<y+h;yy+=26){R(c,x+5,yy,w-11,3,'#3e5652');R(c,x+6,yy+3,w-14,1,'#6f7a69');}
  windowGrid(c,x+19,y+29,Math.max(1,Math.floor((w-30)/16)),Math.max(1,Math.floor((h-36)/24)),random);
  polygon(c,[[x+w*.55,y+8],[x+w*.57,y+45],[x+w*.49,y+56],[x+w*.57,y+81],[x+w*.55,y+105],[x+w*.62,y+78],[x+w*.55,y+55],[x+w*.62,y+44]],'#334d4c');
  for(let i=0;i<Math.floor(w/7);i++){const xx=x+7+i*7;R(c,xx,y+9+(i%3)*4,2,12+random()*9,'#4f5d55');}
  R(c,x-4,y+h-7,w+11,7,'#344d4b');
}
function crane(c,x,y,w,h,color='#3c5758') {
  R(c,x,y,8,h,color);R(c,x+45,y+24,6,h-24,color);
  polygon(c,[[x-26,y+8],[x+w,y-31],[x+w,y-21],[x-26,y+20]],color);
  line(c,[[x+4,y],[x+w*.68,y-24],[x+48,y+42],[x+4,y]],color,3);
  for(let n=0;n<5;n++)line(c,[[x,y+n*h/5],[x+48,y+(n+1)*h/5],[x,y+(n+1)*h/5]],color,2);
  R(c,x-29,y+9,51,19,color);R(c,x-22,y+13,18,6,'#748079');R(c,x+w-18,y-22,2,h*.58,color);
  line(c,[[x+w-22,y-22+h*.58],[x+w-22,y-16+h*.58],[x+w-15,y-16+h*.58],[x+w-12,y-20+h*.58]],color,2);
  R(c,x-12,y+h-5,80,5,color);
}
function factory(c,x,y,w,h,seed) {
  const random=rng(seed);
  R(c,x,y+26,w,h-26,'#425b58');R(c,x+7,y+29,w-14,h-29,'#4e665e');
  polygon(c,[[x-8,y+26],[x+28,y+4],[x+28,y+26],[x+67,y+4],[x+67,y+26],[x+106,y+4],[x+106,y+26],[x+w,y+26]],'#587066');
  for(let i=0;i<3;i++){polygon(c,[[x+3+i*39,y+23],[x+25+i*39,y+11],[x+25+i*39,y+23]],'#87907b');R(c,x+17+i*39,y+18,2,6,'#445c58');}
  for(let xx=x+6;xx<x+w-5;xx+=10){R(c,xx,y+32,1,h-32,'#65756a');R(c,xx+2,y+32,2,h-32,'#455d58');}
  R(c,x-5,y+26,w+10,4,'#8b8a70');R(c,x,y+30,w,3,'#354f4f');
  windowGrid(c,x+13,y+45,Math.floor((w-20)/16),2,random);
  R(c,x+15,y+h-66,w*.4,66,'#304c4b');R(c,x+18,y+h-62,w*.4-6,61,'#3d5752');
  for(let yy=y+h-58;yy<y+h;yy+=6)R(c,x+19,yy,w*.4-8,1,'#59685a');
  R(c,x+w-42,y+33,3,h-33,'#9a9070');R(c,x+w-29,y+33,3,h-33,'#65796b');
  for(let yy=y+37;yy<y+h;yy+=8)R(c,x+w-41,yy,14,2,'#78836e');
}
function tank(c,x,y,w,h) {
  polygon(c,[[x,y+11],[x+7,y+4],[x+19,y],[x+w-19,y],[x+w-7,y+4],[x+w,y+11],[x+w,y+h],[x,y+h]],'#556e66');
  R(c,x+4,y+13,w-8,h-13,'#617970');R(c,x+10,y+12,9,h-14,'#7b8775');R(c,x+w-15,y+12,11,h-12,'#435e5a');
  for(const yy of [y+13,y+h*.48,y+h-12]){R(c,x-2,yy,w+4,3,'#8b9178');R(c,x-2,yy+3,w+4,2,'#3d5956');}
  R(c,x+w*.5,y-7,5,8,'#748776');R(c,x+w*.5-3,y-10,11,3,'#8d9276');
  R(c,x+w-9,y+21,1,h-24,'#9a997b');R(c,x+w-20,y+21,1,h-24,'#8a9278');for(let yy=y+23;yy<y+h-4;yy+=8)R(c,x+w-20,yy,12,1,'#9a997b');
}
function chimney(c,x,y,h) {
  polygon(c,[[x,y],[x+16,y],[x+23,y+h],[x-8,y+h]],'#536b63');
  R(c,x+2,y+3,4,h-3,'#798675');
  for(let yy=y+18;yy<y+h;yy+=29)R(c,x-2-(yy-y)*.04,yy,19+(yy-y)*.1,7,'#876f57');
  R(c,x-3,y-3,22,5,'#91a08a');R(c,x,y-1,17,3,'#445e59');
}
function base(c,x,y) {
  // A long armored hangar gives the final arena a distinct silhouette.
  polygon(c,[[x,y+42],[x+54,y],[x+360,y],[x+414,y+42],[x+414,430],[x,430]],'#344f50');
  polygon(c,[[x+18,y+44],[x+63,y+11],[x+351,y+11],[x+396,y+44],[x+396,430],[x+18,430]],'#4b6460');
  for(let n=0;n<7;n++){const xx=x+37+n*54;R(c,xx,y+45,5,183,'#6e7d6c');R(c,xx+5,y+45,4,183,'#2e4b4c');}
  R(c,x+82,y+57,250,174,'#243f44');R(c,x+88,y+63,238,168,'#3b5352');
  for(let yy=y+68;yy<430;yy+=12){R(c,x+89,yy,236,2,'#586b60');R(c,x+89,yy+3,236,2,'#2d494b');}
  R(c,x+192,y+64,5,166,'#263f44');R(c,x+213,y+64,2,166,'#637364');
  R(c,x+142,y+26,130,19,'#314a4c');R(c,x+147,y+30,119,2,'#93a07e');
  // Large stencil identifier, made from pixels rather than a font.
  for(const [ox,oy,ww,hh]of [[0,0,8,2],[0,2,2,8],[6,2,2,8],[0,10,8,2],[13,0,7,2],[18,2,2,3],[13,5,7,2],[13,7,2,3],[13,10,7,2]])R(c,x+185+ox,y+30+oy,ww,hh,'#b1aa81');
  for(const xx of [x+26,x+374]){R(c,xx,y+47,13,6,'#caac72');R(c,xx+3,y+53,7,3,'#887e59');}
  R(c,x+27,y-20,3,40,'#63776a');R(c,x+15,y-11,28,2,'#8c9478');R(c,x+21,y-15,15,2,'#8c9478');
}
function buildScenery() {
  const sky=surface(960,540),s=sky.c;
  const g=s.createLinearGradient(0,0,0,470);g.addColorStop(0,'#344f60');g.addColorStop(.42,'#809391');g.addColorStop(.78,'#c6b593');g.addColorStop(1,'#a6a789');s.fillStyle=g;s.fillRect(0,0,960,540);
  // A restrained, banded sunset, partially hidden by cloud, instead of a giant disk.
  polygon(s,[[720,74],[735,63],[761,63],[776,74],[780,90],[774,107],[760,116],[737,116],[722,107],[716,91]],'#d8c49a');
  R(s,716,85,65,3,'#c6b697');R(s,718,98,60,3,'#c6b697');R(s,727,109,45,2,'#c6b697');
  cloud(s,30,47,228,'#9daaa5');cloud(s,367,92,261,'#adb5a6');cloud(s,663,99,220,'#b9baa6');cloud(s,151,145,221,'#c5bba0');
  R(s,0,203,960,2,'#b8b59e');R(s,111,180,321,1,'#ccc0a0');R(s,535,166,349,1,'#c6bba0');
  const far=surface(1800,540),f=far.c;
  const rand=rng(821);let ridge=[[0,540],[0,251]],xx=0;
  while(xx<1800){xx+=35+Math.floor(rand()*55);ridge.push([xx,190+Math.floor(rand()*73)]);}ridge.push([1800,540]);polygon(f,ridge,'#81928a');
  ridge=[[0,540],[0,324]];xx=0;while(xx<1800){xx+=27+Math.floor(rand()*40);ridge.push([xx,258+Math.floor(rand()*51)]);}ridge.push([1800,540]);polygon(f,ridge,'#6b827c');
  for(let i=0;i<23;i++){const x=i*80+rand()*20,h=20+rand()*49;R(f,x,355-h,31+rand()*26,h+185,'#627d77');if(i%4===0){R(f,x+13,321-h,4,35,'#627d77');R(f,x+7,321-h,17,2,'#819286');}}
  crane(f,390,237,170,155,'#617c77');crane(f,1210,258,220,160,'#607a74');
  const city=surface(6400,540),c=city.c;
  // The opening has irregular damaged facades and a broken elevated railway.
  ruin(c,-48,230,171,207,31);ruin(c,174,174,139,262,52);ruin(c,337,260,122,174,71);
  R(c,132,310,6,126,'#4d665f');R(c,138,310,23,5,'#788574');R(c,157,310,4,12,'#4d665f');
  line(c,[[138,282],[206,297],[274,298],[334,287]],'#586f65',2);
  ruin(c,545,217,114,219,83);ruin(c,695,251,190,185,98);
  // A snapped rail bridge and its trusses are seen through the first gap.
  R(c,967,354,210,8,'#4d6560');R(c,967,362,210,5,'#73806b');
  for(let x=977;x<1170;x+=48)line(c,[[x,361],[x+22,394],[x+44,361]],'#4a635d',4);
  R(c,989,370,10,70,'#4b635c');R(c,1134,370,10,70,'#4b635c');
  crane(c,1090,207,212,229);ruin(c,1330,225,141,211,122);factory(c,1525,290,190,145,132);
  // Storage vessels and sawtooth roofs gradually replace the old town.
  tank(c,1780,254,89,181);chimney(c,1928,155,280);factory(c,1965,249,247,186,47);
  tank(c,2257,273,96,162);tank(c,2356,236,104,199);chimney(c,2496,184,251);
  factory(c,2565,223,222,212,47);crane(c,2788,154,266,280,'#395858');
  tank(c,3070,279,77,156);tank(c,3150,279,77,156);factory(c,3285,262,184,173,76);
  R(c,2858,320,358,10,'#607569');R(c,2858,330,358,3,'#364f4e');for(let x=2864;x<3210;x+=50){R(c,x,313,4,123,'#435f59');R(c,x,307,52,2,'#7b8771');}
  // The final area opens up around a heavy hangar, cooling fins and communications.
  tank(c,3545,255,115,180);chimney(c,3701,201,234);factory(c,3780,270,170,165,82);
  base(c,4110,203);base(c,4610,218);
  R(c,4015,198,8,237,'#49645e');line(c,[[4019,197],[3980,168],[3975,140],[4019,165],[4058,143],[4055,169],[4019,197]],'#768679',3);
  for(let x=5050;x<6100;x+=190)factory(c,x,260+(x%3)*13,145,175-(x%3)*13,x);
  // Haze softens the foot of all structures, leaving the playable silhouettes clear.
  const haze=c.createLinearGradient(0,335,0,465);haze.addColorStop(0,'#7e937600');haze.addColorStop(.7,'#72867565');haze.addColorStop(1,'#597668cc');c.fillStyle=haze;c.fillRect(0,335,6400,205);
  return {sky:sky.canvas,far:far.canvas,city:city.canvas};
}

export function drawBackdrop(ctx,{camera=0,time=0,reduced=false,width=960,height=540}={}) {
  scenery ||= buildScenery();ctx.save();ctx.scale(width/960,height/540);
  ctx.drawImage(scenery.sky,0,0);
  ctx.drawImage(scenery.far,-Math.round(camera*.15),0);
  ctx.drawImage(scenery.city,-Math.round(camera*.9),0);
  // Thin smoke ribbons drift above only the authored chimney landmarks.
  const now=reduced?0:time;
  for(const [x,y]of [[1936,153],[2504,182],[3709,199]]) {
    const sx=x-camera*.9;if(sx< -100||sx>1060)continue;
    for(let i=0;i<5;i++){const drift=Math.sin(now*.36+i*.8)*5;ctx.globalAlpha=.09+(4-i)*.022;R(ctx,sx+i*10+drift,y-i*12-7,20+i*8,7+i*2,'#bcc2ad');}
  }
  ctx.globalAlpha=.065;
  polygon(ctx,[[725,123],[753,130],[506,446],[394,446]],'#f7d999');
  polygon(ctx,[[791,135],[805,143],[671,446],[615,446]],'#f7d999');
  ctx.restore();
}
function grass(c,x,y,seed,color='#687b54') {
  const r=rng(seed);for(let i=0;i<7;i++){const h=2+Math.floor(r()*5);R(c,x+i*2,y-h,1,h,color);if(i%3===0)R(c,x+i*2-1,y-h,2,1,'#8a9261');}
}
function paintGround(c,p,floor) {
  const random=rng(p.x+81),industrial=p.x>1800,baseColor=industrial?'#354845':'#3c4e44';
  R(c,0,0,p.w,p.h,baseColor);
  // Horizontal cap makes the exact collision edge legible at every display size.
  R(c,0,0,p.w,2,'#c3bc8b');R(c,0,2,p.w,4,'#78856a');R(c,0,6,p.w,3,'#354d43');
  for(let row=0;row<6;row++)for(let x=-18+(row%2)*24;x<p.w;x+=47) {
    const y=12+row*22,tone=random();
    R(c,x+1,y,44,19,tone>.65?'#53604b':tone>.3?'#485845':'#42523f');
    R(c,x+1,y,44,1,'#657157');R(c,x+1,y+18,44,1,'#2b423a');R(c,x+43,y+2,2,17,'#31453b');
    if(tone>.62){line(c,[[x+13,y+2],[x+16,y+7],[x+12,y+10],[x+15,y+15]],'#30463b');R(c,x+7,y+12,5,1,'#737957');}
    if(random()>.55)R(c,x+3+random()*27,y+5+random()*7,4+random()*7,2,'#5d6950');
  }
  // Recessed service conduit runs through the lower face, with sleeves and clips.
  R(c,0,52,p.w,11,'#263e39');R(c,0,54,p.w,5,'#647365');R(c,0,54,p.w,1,'#8a8b6d');R(c,0,59,p.w,2,'#3a5147');
  for(let x=18;x<p.w;x+=89){R(c,x,52,4,10,'#96a084');R(c,x-2,51,8,2,'#30483d');}
  for(let x=9;x<p.w;x+=63){const wide=12+Math.floor(random()*18);R(c,x,3,wide,2,'#a2a77c');R(c,x+5,9,wide*.7,3,'#506d4b');if(random()>.45){R(c,x+10,10,5,13,'#45643e');R(c,x+7,13,10,3,'#516d46');}}
  // Shadows are concentrated at the bottom rather than muddying the playable edge.
  const fade=c.createLinearGradient(0,64,0,130);fade.addColorStop(0,'#1a343100');fade.addColorStop(1,'#142e2ddb');c.fillStyle=fade;c.fillRect(0,64,p.w,p.h-64);
}
function paintPlatform(c,p,floor) {
  const support=floor-p.y;
  for(const x of [12,p.w-20]) {
    R(c,x,16,7,support-16,'#263f3b');R(c,x,17,2,support-18,'#5e7360');R(c,x-4,support-7,15,7,'#314b40');
  }
  line(c,[[17,24],[p.w-17,Math.min(support-7,81)],[p.w-17,24],[17,Math.min(support-7,81)]],'#3d594a',3);
  R(c,0,0,p.w,3,'#c0bc90');R(c,0,3,p.w,5,'#76866b');R(c,0,8,p.w,6,'#3f584b');R(c,2,14,p.w-4,2,'#203b35');
  for(let x=7;x<p.w-7;x+=23){R(c,x,4,12,3,'#b2a363');R(c,x+2,4,3,3,'#3a5145');R(c,x,10,2,2,'#9ca88b');R(c,x+12,10,2,2,'#9ca88b');}
  for(const x of [0,p.w-5]){R(c,x,3,5,11,'#8a9273');R(c,x+1,6,2,2,'#d1c492');R(c,x+1,11,2,2,'#314d40');}
}
export function drawTerrain(ctx,{solids=[],gaps=[],camera=0,viewWidth=534,floor=454}={}) {
  for(const p of solids) {
    if(p.x+p.w<camera-24||p.x>camera+viewWidth+24)continue;
    let layer=terrainCache.get(p);
    if(!layer){const height=p.oneWay?floor-p.y+1:p.h;const made=surface(Math.ceil(p.w),Math.ceil(height));p.oneWay?paintPlatform(made.c,p,floor):paintGround(made.c,p,floor);layer=made.canvas;terrainCache.set(p,layer);}
    ctx.drawImage(layer,p.x,p.y);
    if(!p.oneWay)for(let x=Math.ceil(Math.max(p.x+20,camera)/87)*87;x<Math.min(p.x+p.w-12,camera+viewWidth);x+=87)grass(ctx,x,p.y,x);
  }
  for(const [start,end]of gaps) {
    if(end<camera-30||start>camera+viewWidth+30)continue;
    R(ctx,start,floor+10,end-start,110,'#152e2e');
    // Broken beams hang downward; nothing suggests a solid bridge across the pit.
    polygon(ctx,[[start,floor+10],[start+14,floor+13],[start+24,floor+29],[start+14,floor+26],[start,floor+19]],'#73806b');
    polygon(ctx,[[end,floor+11],[end-19,floor+15],[end-10,floor+29],[end-7,floor+23],[end,floor+21]],'#526b59');
    line(ctx,[[start+4,floor+21],[start+12,floor+41],[start+19,floor+43]],'#8d8b6b',2);
    for(const x of [start-16,end+3]){R(ctx,x,floor,13,3,'#c5ad67');R(ctx,x+3,floor,3,3,'#3b5143');R(ctx,x+9,floor,3,3,'#3b5143');}
    R(ctx,start-21,floor-21,2,21,'#7f8970');R(ctx,start-25,floor-24,11,10,'#d2ad65');R(ctx,start-20,floor-22,2,4,'#394b3c');R(ctx,start-20,floor-17,2,1,'#394b3c');
  }
}
function sandbags(ctx,x,y,n) {
  for(let row=0;row<2;row++)for(let i=0;i<n-row;i++){const xx=x+i*13+row*7,yy=y-row*6;R(ctx,xx,yy,12,5,'#5a6952');R(ctx,xx+1,yy,10,1,'#869076');R(ctx,xx+1,yy+4,10,1,'#354d40');R(ctx,xx+9,yy+1,1,3,'#6c785b');}
}
export function drawWorldDetails(ctx,{camera=0,viewWidth=534,floor=454,time=0,reduced=false,checkpoint=0}={}) {
  ctx.save();
  // Authored ground-level dressing stays low and muted behind the combatants.
  for(const [x,kind]of [[24,'wire'],[185,'rubble'],[615,'wire'],[978,'rubble'],[1230,'wire'],[1495,'rubble'],[1875,'pipe'],[2320,'pipe'],[2675,'wire'],[2990,'pipe'],[3440,'rubble'],[3795,'pipe'],[4050,'wire'],[4380,'rubble'],[4880,'wire']]) {
    if(x<camera-90||x>camera+viewWidth+30)continue;
    if(kind==='rubble') {
      polygon(ctx,[[x,floor],[x+8,floor-7],[x+20,floor-5],[x+24,floor-13],[x+35,floor-10],[x+42,floor-4],[x+60,floor-4],[x+65,floor]],'#53624c');
      R(ctx,x+25,floor-12,10,3,'#7e8161');R(ctx,x+7,floor-6,9,2,'#818361');grass(ctx,x+45,floor,x);
    }else if(kind==='wire') {
      for(let i=0;i<3;i++){R(ctx,x+i*29,floor-31,2,31,'#4a6556');R(ctx,x+i*29-2,floor-32,6,2,'#8a9275');}
      line(ctx,[[x,floor-25],[x+29,floor-22],[x+58,floor-25]],'#71806a');line(ctx,[[x,floor-14],[x+29,floor-13],[x+58,floor-14]],'#4b6955');
      for(let i=0;i<5;i++)line(ctx,[[x+5+i*11,floor-29],[x+9+i*11,floor-20]],'#657a61');
    }else {
      R(ctx,x,floor-10,72,8,'#3b574b');R(ctx,x+2,floor-10,68,2,'#76846a');R(ctx,x+12,floor-13,5,14,'#4d6652');R(ctx,x+55,floor-13,5,14,'#4d6652');R(ctx,x+13,floor-12,2,3,'#939775');
    }
  }
  for(const x of [2130,4140,4990]){if(x<camera-70||x>camera+viewWidth)continue;sandbags(ctx,x,floor-5,4);}
  for(const flag of [2200,4200]) {
    if(flag<camera-70||flag>camera+viewWidth+20)continue;
    const active=checkpoint>=flag,wave=reduced?0:Math.round(Math.sin(time*4)*2);
    R(ctx,flag-11,floor-3,12,3,'#30483e');R(ctx,flag-8,floor-78,3,77,'#8e9e84');R(ctx,flag-8,floor-78,1,73,'#c0c4a1');
    polygon(ctx,[[flag-5,floor-76],[flag+14,floor-75+wave],[flag+32,floor-76],[flag+32,floor-57],[flag+14,floor-55+wave],[flag-5,floor-57]],active?'#80bca1':'#567762');
    R(ctx,flag-5,floor-75,2,18,active?'#b8d7ac':'#899d79');R(ctx,flag+7,floor-70+wave,3,11,active?'#dcdfb0':'#a6b38e');R(ctx,flag+3,floor-66+wave,11,3,active?'#dcdfb0':'#a6b38e');
  }
  ctx.restore();
}
