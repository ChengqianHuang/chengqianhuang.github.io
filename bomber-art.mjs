export const SIZE=40, WIDTH=520, HEIGHT=440;
export const COLORS=['#f6eee0','#76c9d5','#eaa080','#b4cc86'];
const themes={garden:{floor:'#527868',alt:'#557d6b',edge:'#2f4f4a',wall:'#6d8890',wallLight:'#acc3be',brick:'#aa805a',brickLight:'#d4b480'},dock:{floor:'#506c7a',alt:'#557482',edge:'#293f51',wall:'#6c8598',wallLight:'#b3c9d1',brick:'#b28861',brickLight:'#d9bb88'},forge:{floor:'#716560',alt:'#796c63',edge:'#453e43',wall:'#81868a',wallLight:'#bdc1b5',brick:'#ad7757',brickLight:'#dfb27b'}};
const r=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function disc(c,x,y,radius,color){c.fillStyle=color;c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.fill();}
function pixelRound(c,x,y,w,h,color){r(c,x+3,y,w-6,h,color);r(c,x,y+3,w,h-6,color);}
export function drawBomber(c,a,time=0,reduced=false){
  const x=(a.x+.5)*40,y=(a.y+.5)*40,bob=!reduced&&a.travel?Math.sin(a.steps*9)*1.4:0, stride=a.travel?Math.sin(a.steps*9)*3:0;
  c.save();c.translate(Math.round(x),Math.round(y));
  c.globalAlpha=.22;pixelRound(c,-12,9,24,7,'#122c34');c.globalAlpha=1;
  const color=COLORS[a.id];
  // Boots and gloves frame a rounded helmet, with a small gold belt buckle.
  pixelRound(c,-10,4+stride,8,9,'#25394e');pixelRound(c,2,4-stride,8,9,'#25394e');
  pixelRound(c,-10,5+stride,7,6,'#e49bab');pixelRound(c,3,5-stride,7,6,'#e49bab');
  pixelRound(c,-9,-5+bob,18,14,'#25394e');pixelRound(c,-7,-5+bob,14,12,color);r(c,-7,3+bob,14,3,'#444561');r(c,-2,3+bob,4,3,'#f4c978');r(c,-1,3+bob,2,1,'#fff0b2');
  for(const dx of [-13,9]){pixelRound(c,dx,-3-bob,6,8,'#273b4b');pixelRound(c,dx+1,-2-bob,5,6,'#eaaaaf');r(c,dx+2,-2-bob,3,2,'#ffd3c5');}
  pixelRound(c,-14,-24+bob,28,23,'#263c4c');pixelRound(c,-12,-24+bob,24,21,color);r(c,-9,-23+bob,16,2,'#fff6d7');r(c,10,-19+bob,2,13,'#9aaeb1');
  pixelRound(c,-10,-17+bob,20,13,'#998471');pixelRound(c,-9,-17+bob,18,11,'#f3c99c');r(c,-7,-16+bob,13,2,'#ffdfb4');
  if(a.dir===0){r(c,-8,-15+bob,16,7,'#d5e0d4');r(c,-5,-13+bob,10,2,'#a2b9b6');}else{const look=a.dir===1?1:a.dir===3?-1:0;r(c,-5+look,-14+bob,2,6,'#28384b');r(c,3+look,-14+bob,2,6,'#28384b');r(c,-6+look,-15+bob,4,1,'#624e57');r(c,2+look,-15+bob,4,1,'#624e57');}
  r(c,-2,-28+bob,4,5,'#293d4b');disc(c,0,-29+bob,4,'#edb0b4');r(c,-2,-32+bob,3,2,'#ffe1c7');
  c.restore();
}
export function drawBomb(c,b,time=0,reduced=false){
  const x=(b.x+.5)*40,y=(b.y+.5)*40,urgent=b.timer<.75,pulse=reduced?0:Math.sin(time*(urgent?29:9))*1.1;
  c.save();c.translate(x,y);c.globalAlpha=.3;pixelRound(c,-13,9,26,6,'#152b31');c.globalAlpha=1;
  disc(c,0,1,12+pulse,'#192939');disc(c,-1,-1,10+pulse,urgent?'#775350':'#344759');disc(c,-4,-5,4,'#6d8491');r(c,-6,-7,3,2,'#bed4cc');r(c,-6,8,12,2,'#101f2e');
  r(c,0,-13,5,5,'#b38d60');r(c,3,-17,3,6,'#e9bd7e');r(c,5,-18,5,2,'#7f644f');
  const f=reduced?2:Math.floor(time*20)%3; r(c,8,-20,2,5,'#ffd38a');r(c,6,-18,6,2,'#fff0bd');if(f)r(c,10,-22,2,2,'#f39467');c.restore();
}
export function drawBoard(c,g,{time=g.time,reduced=false}={}){
  const p=themes[g.arena]||themes.garden;c.clearRect(0,0,WIDTH,HEIGHT);
  for(let y=0;y<11;y++)for(let x=0;x<13;x++){
    const px=x*40,py=y*40,t=g.grid[y][x];r(c,px,py,40,40,(x+y)%2?p.floor:p.alt);
    if(!t){r(c,px,py,40,1,'#ffffff06');r(c,px+7+(x*7+y*11)%21,py+7+(x*3+y*7)%24,2,2,'#a6c19430');if((x+y)%4===1){r(c,px+27,py+24,1,5,'#2e544c');r(c,px+25,py+26,5,1,'#648b69');}}
    if(t===1){r(c,px,py,40,40,p.edge);pixelRound(c,px+2,py+1,36,35,'#344b56');pixelRound(c,px+3,py+1,34,29,p.wall);r(c,px+6,py+2,28,3,p.wallLight);r(c,px+4,py+5,3,21,'#8ca8a5');r(c,px+5,py+29,30,3,'#435c69');r(c,px+10,py+11,20,2,'#ffffff12');for(const dx of [7,30]){r(c,px+dx,py+7,2,2,'#3e5965');r(c,px+dx,py+6,1,1,'#d0d5ba');}}
    if(t===2){r(c,px+1,py+4,38,35,'#354b49');r(c,px+2,py+1,36,33,p.brick);r(c,px+3,py+1,34,3,p.brickLight);r(c,px+3,py+5,3,26,'#ddba7f');r(c,px+33,py+5,4,28,'#795d48');
      for(let n=0;n<3;n++){r(c,px+7,py+7+n*8,25,6,'#987451');r(c,px+7,py+7+n*8,25,1,'#b99562');r(c,px+10+(x+y+n)%3*5,py+10+n*8,10,1,'#806347');}
      r(c,px+4,py+15,31,4,'#d2aa70');r(c,px+16,py+4,5,28,'#d3b17c');for(const dx of [5,32])for(const dy of [5,29])r(c,px+dx,py+dy,2,2,'#574d40');}
  }
  if(g.time>=86&&g.time<90){c.globalAlpha=reduced?.3:.18+Math.sin(time*7)*.12;r(c,40,40,440,3,'#ffd080');r(c,40,397,440,3,'#ffd080');r(c,40,40,3,360,'#ffd080');r(c,477,40,3,360,'#ffd080');c.globalAlpha=1;}
  for(const i of g.items){const x=i.x*40+7,y=i.y*40+5+(reduced?0:Math.sin(time*4)*1.5);pixelRound(c,x-1,y,28,29,'#263e4a');pixelRound(c,x,y-1,26,26,i.kind==='fire'?'#f3c181':i.kind==='speed'?'#9cd5bc':'#add1dd');r(c,x+3,y+1,20,2,'#fff0bd');
    if(i.kind==='bomb'){drawBomb(c,{x:i.x,y:i.y,timer:3},0,true);}else if(i.kind==='fire'){r(c,x+10,y+5,5,16,'#bf684c');r(c,x+6,y+11,13,10,'#d98450');r(c,x+10,y+13,5,8,'#fff1a3');r(c,x+13,y+4,3,5,'#e7a764');}else{r(c,x+7,y+6,7,13,'#3f6e6e');r(c,x+7,y+16,14,6,'#3f6e6e');r(c,x+8,y+7,5,2,'#d8f1cf');r(c,x+7,y+21,14,2,'#e6eaca');}}
  for(const b of g.bombs)drawBomb(c,b,time,reduced);
  for(const a of [...g.players].sort((a,b)=>a.y-b.y))if(a.alive)drawBomber(c,a,time,reduced);
  // Warm, clearly bounded cross flames. No whole-screen flashing.
  for(const f of g.flames){const x=f.x*40,y=f.y*40,t=f.ttl/.62,shrink=reduced?0:Math.round((1-t)*3);pixelRound(c,x+2+shrink,y+2+shrink,36-shrink*2,36-shrink*2,'#d2744d');pixelRound(c,x+5+shrink,y+5+shrink,30-shrink*2,30-shrink*2,'#f5b966');pixelRound(c,x+10,y+10,20,20,'#ffe2a0');r(c,x+17,y+6,6,28,'#fff0ba');r(c,x+6,y+17,28,6,'#fff0ba');}
}
