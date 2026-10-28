// Scenery is an observer of game time and mechanism state, never a collision source.
export const SCENES=[
 {name:'DEPARTURE HARBOR',ink:'#edbe8b',cool:'#85d9ca',top:'#264958',bottom:'#0d2837'},
 {name:'STEEL CORRIDOR',ink:'#d4b08a',cool:'#b1c5ce',top:'#303c49',bottom:'#111c29'},
 {name:'TRANSIT RAILS',ink:'#e7bd69',cool:'#8fcac2',top:'#374546',bottom:'#12282c'},
 {name:'TWIN POWER STATION',ink:'#b4dcd2',cool:'#7ce1c6',top:'#173b3c',bottom:'#091f2d'},
 {name:'TIDAL LOCK',ink:'#b6ddec',cool:'#64d1d5',top:'#134659',bottom:'#062233'},
 {name:'FUSE MINE',ink:'#f0ad70',cool:'#cfb894',top:'#493a32',bottom:'#1d2428'},
 {name:'SINKING FOUNDRY',ink:'#e7a26c',cool:'#a6bec6',top:'#483b33',bottom:'#201d24'},
 {name:'REACTOR HEART',ink:'#ffc18b',cool:'#7edacb',top:'#332c2c',bottom:'#0b1823'},
];
const TAU=Math.PI*2;
function path(c,points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function line(c,points,color,width=1){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function circle(c,x,y,r,fill,stroke,width=1){c.beginPath();c.arc(x,y,r,0,TAU);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color.slice(0,7)+'00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function panel(c,x,y,w,h,color='#263b44'){c.fillStyle=color;c.fillRect(x,y,w,h);c.strokeStyle='#9eb6bb25';c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);}
function fan(c,x,y,r,t=0){circle(c,x,y,r,'#0c1c27','#6f8a964d',3);circle(c,x,y,r-5,null,'#708c9740');c.save();c.translate(x,y);c.rotate(t);for(let i=0;i<8;i++){c.rotate(TAU/8);path(c,[[4,-3],[r-8,-8],[r-11,4],[8,6]],'#54717d50');}c.restore();circle(c,x,y,6,'#253f4c','#829aa250');}
export function paintScenery(c,level){
 c.save();c.beginPath();c.rect(28,28,664,384);c.clip();
 if(level===1){
  glow(c,534,105,130,'#e3b98630');circle(c,534,105,21,'#e0bc8c45');
  // The skyline and crane booms sit across the horizon; reflections live below it.
  path(c,[[28,224],[112,194],[185,208],[255,178],[330,198],[439,188],[543,213],[692,191],[692,440],[28,440]],'#163646');
  c.fillStyle='#0d2b3c';c.fillRect(28,249,664,191);
  for(let i=0;i<13;i++){const x=39+i*53,h=17+(i*31)%45;panel(c,x,238-h,37,h,'#1b3440');}
  for(const [x,dir] of [[122,1],[595,-1]]){line(c,[[x,250],[x,144],[x+dir*100,168]],'#0b2535',7);line(c,[[x,144],[x+dir*39,112],[x+dir*100,168],[x,168]],'#37616a',2);line(c,[[x+dir*84,165],[x+dir*84,225]],'#627a764a');}
  line(c,[[28,251],[692,251]],'#7aa6a64d',2);
  for(let i=0;i<25;i++){const y=257+i*7;line(c,[[30+(i*43)%250,y],[310+(i*61)%350,y]],i%3?'#4b7a8730':'#9db2a330');}
  for(const x of [53,624]){panel(c,x,325,43,70,'#1a3540');for(let j=0;j<5;j++)line(c,[[x+6+j*7,329],[x+6+j*7,391]],'#6b92932e');}
 }else if(level===2){
  // Nested structural frames make a deep, square industrial tunnel.
  for(let i=0;i<6;i++){const k=i*23;path(c,[[28+k,28+k*.48],[692-k,28+k*.48],[692-k,412-k*.37],[28+k,412-k*.37]],i%2?'#25313d':'#1c2935','#84929b25');}
  path(c,[[155,91],[565,91],[565,354],[155,354]],'#111e2b','#708a9830');
  for(const x of [62,658]){line(c,[[x,32],[x,412]],'#080f18',15);line(c,[[x-2,32],[x-2,412]],'#59758260',4);for(let y=52;y<410;y+=49)panel(c,x-10,y,20,7,'#4b5d6655');}
  for(const y of [60,380]){panel(c,35,y,650,12,'#3a4246');for(let x=38;x<681;x+=25)path(c,[[x,y],[x+9,y],[x+21,y+12],[x+12,y+12]],'#ad91684d');}
  fan(c,112,293,43);fan(c,608,293,43);panel(c,238,283,244,52,'#1d2c38');
  for(let x=250;x<475;x+=12)panel(c,x,290,4,38,'#42617240');
 }else if(level===3){
  for(let x=-300;x<1000;x+=100)line(c,[[360+(x-360)*.25,186],[x,440]],'#75938723');
  for(let y=205;y<440;y+=28)line(c,[[28,y],[692,y]],'#7c9d8b25');
  for(let r=0;r<4;r++){const y=49+r*39;panel(c,54,y,612,31,'#0a2029');line(c,[[58,y+3],[662,y+3]],'#a2b8ab50',2);line(c,[[58,y+28],[662,y+28]],'#6f847b55',2);for(let x=63;x<665;x+=18)circle(c,x,y+16,8,'#36515750','#69887530');}
  for(const x of [80,640]){panel(c,x-9,225,18,165,'#1f333b');panel(c,x-22,254,44,18,'#4d635d');line(c,[[x,270],[x+30*(x<360?1:-1),306],[x+30*(x<360?1:-1),340]],'#65776d50',12);circle(c,x,263,12,'#536e68','#b1c5ad40');}
  panel(c,258,269,204,67,'#1b383c');for(let i=0;i<8;i++)panel(c,270+i*24,280,16,43,'#4f79722b');
 }else if(level===4){
  // Two generators, independent conduit banks, and a central shield projector.
  for(const x of [97,623]){glow(c,x,281,100,'#57bda225');panel(c,x-42,228,84,147,'#163c40');circle(c,x,282,32,'#102c36','#83d4bf50',4);circle(c,x,282,22,null,'#71cbb73b',4);for(let y=325;y<365;y+=8)panel(c,x-27,y,54,3,'#739e9040');line(c,[[x,228],[x,195],[360,195],[360,152]],'#477b7255',4);}
  circle(c,360,297,70,'#122c36','#5aa38e33',3);circle(c,360,297,49,null,'#77bca338',2);
  for(let i=0;i<12;i++){const a=i*TAU/12;line(c,[[360+Math.cos(a)*54,297+Math.sin(a)*54],[360+Math.cos(a)*66,297+Math.sin(a)*66]],'#8fc8b43d',3);}
  line(c,[[172,400],[172,234],[248,234]],'#4b8d7c33',4);line(c,[[548,400],[548,234],[472,234]],'#4b8d7c33',4);
 }else if(level===5){
  // A circular pressure window, ocean floor silhouettes and heavy locking ribs.
  circle(c,360,232,227,'#102e3c','#537d8555',12);circle(c,360,232,211,'#0b374a','#8aacab35',3);
  const water=c.createLinearGradient(0,35,0,425);water.addColorStop(0,'#215a6970');water.addColorStop(1,'#06202caa');c.fillStyle=water;c.fillRect(75,32,570,390);
  for(let i=0;i<6;i++)path(c,[[180+i*75,28],[195+i*75,28],[87+i*72,412],[30+i*72,412]],'#83c9cd09');
  path(c,[[28,376],[95,344],[166,363],[238,335],[321,359],[431,342],[497,361],[598,330],[692,369],[692,440],[28,440]],'#0a2633');
  for(let i=0;i<16;i++){const x=45+i*43,y=370+(i%3)*13;line(c,[[x,y+35],[x-6,y],[x+3,y-16]],'#205465',3);line(c,[[x-5,y+8],[x+10,y-5]],'#205465',2);}
  for(const x of [57,663]){panel(c,x-10,32,20,381,'#34515b');for(let y=45;y<415;y+=38)circle(c,x,y,3,'#a1bab870');}
  for(let i=0;i<14;i++){const a=i*TAU/14;circle(c,360+Math.cos(a)*220,232+Math.sin(a)*220,4,'#c4d6ce55');}
 }else if(level===6){
  // Faceted rock silhouettes frame the ore. The center remains clear for tracking the ball.
  for(let layer=0;layer<3;layer++){
    const left=[[28,28]];for(let y=28;y<=440;y+=28)left.push([30+layer*19+((y*17+layer*37)%73),y]);left.push([28,440]);path(c,left,['#151c22','#303031','#494039'][layer]);
    const right=left.map(([x,y])=>[720-x,y]);path(c,right,['#151c22','#303031','#494039'][layer]);
  }
  for(let i=0;i<13;i++){const x=30+i*53;path(c,[[x,28],[x+38,28],[x+12,64+(i*19)%53]],'#62504550');}
  for(let i=0;i<11;i++){const x=50+i*59,y=373+(i*23)%37;path(c,[[x-19,440],[x,y-23],[x+12,y],[x+30,440]],'#5b443544','#ac7a4855');}
  glow(c,145,313,95,'#e4a45f2b');glow(c,577,325,85,'#e4a45f22');
  for(const x of [145,577]){panel(c,x-3,283,6,35,'#72523c');glow(c,x,289,24,'#f6ac5855');circle(c,x,289,4,'#e9b47b');}
  line(c,[[240,440],[299,253],[421,253],[480,440]],'#8d765050',4);for(let y=276;y<440;y+=23)line(c,[[290-(y-276)*.29,y],[430+(y-276)*.29,y]],'#62503e75',6);
 }else if(level===7){
  for(const x of [60,660]){panel(c,x-17,28,34,384,'#182731');for(let y=38;y<412;y+=16)panel(c,x-10,y,20,5,'#7b8c8d3d');}
  for(const x of [132,588]){panel(c,x-14,28,28,184,'#152732');panel(c,x-7,28,14,200,'#7b87805c');}
  for(let i=0;i<7;i++){const y=240+i*26;line(c,[[32,y],[688,y]],'#8f715128');}
  panel(c,178,286,364,91,'#151e26');for(let x=193;x<533;x+=23)panel(c,x,295,8,74,'#95644444');
  glow(c,360,365,180,'#d37e4726');path(c,[[28,403],[692,403],[692,440],[28,440]],'#55382860');
  for(let x=32;x<690;x+=35)path(c,[[x,404],[x+13,404],[x+30,427],[x+17,427]],'#d0a35a48');
 }else{
  // Large concentric reactor assembly and eight radial cooling conduits.
  glow(c,360,208,245,'#d68b5728');
  for(let i=0;i<8;i++){const a=i*TAU/8;line(c,[[360+Math.cos(a)*88,208+Math.sin(a)*88],[360+Math.cos(a)*320,208+Math.sin(a)*320]],'#46626c50',15);line(c,[[360+Math.cos(a)*125,208+Math.sin(a)*125],[360+Math.cos(a)*310,208+Math.sin(a)*310]],'#bd956933',3);}
  for(const [r,w] of [[189,12],[164,3],[139,17],[115,3]])circle(c,360,208,r,null,'#7886873d',w);
  circle(c,360,208,94,'#14232c','#cfa06b40',3);circle(c,360,208,76,null,'#bb7f523d',10);
  for(let i=0;i<36;i++){const a=i*TAU/36;line(c,[[360+Math.cos(a)*171,208+Math.sin(a)*171],[360+Math.cos(a)*182,208+Math.sin(a)*182]],'#b4aea34a',3);}
  for(const x of [52,638]){panel(c,x,280,30,99,'#354449');for(let y=289;y<373;y+=13)panel(c,x+5,y,20,4,'#90b8b44d');}
 }
 c.restore();
}
export function paintAtmosphere(c,game,reduced){
 const t=reduced?0:game.stageTime;
 c.save();c.beginPath();c.rect(28,28,664,384);c.clip();
 if(game.level===1){
  c.globalAlpha=.25;for(let i=0;i<12;i++){const y=266+i*10,x=370+Math.sin(t*.5+i)*30;line(c,[[x-i*4,y],[x+25+i*3,y]],'#c9c4a3',1);}
 }else if(game.level===3){
  for(let r=0;r<4;r++)for(let i=0;i<22;i++){const x=57+((i*27+t*30*(r%2?-1:1))%594+594)%594;line(c,[[x,79+r*39],[x+6,76+r*39]],'#b9c59d44');}
 }else if(game.level===4){
  for(const x of [97,623]){
   const source=game.bricks.find(b=>b.type==='switch'&&(x<360?b.baseX<360:b.baseX>360));
   const powered=source?.hp>0;
   circle(c,x,282,15,powered?'#5bc2a340':'#253c3c');
   if(powered){glow(c,x,282,34,'#7ad5a82d');line(c,[[x,233],[x,195],[360,195],[360,175]],'#7fdcc477',1);}
  }
 }else if(game.level===5){
  // Slow light transmission across the glass, with tiny suspended particles.
  for(let i=0;i<3;i++){
    const x=110+i*94+Math.sin(t*.19+i)*13;
    const light=c.createLinearGradient(x,30,x+80,385);light.addColorStop(0,'#b1eeec0d');light.addColorStop(1,'#8ddad100');
    path(c,[[x,28],[x+18,28],[x+145,390],[x+76,390]],light);
  }
  for(let i=0;i<22;i++){
    const x=48+(i*73)%620+Math.sin(t*.27+i)*7,y=410-((i*47+t*(3+i%3))%370),r=.5+(i%4)*.35;
    circle(c,x,y,r,'#c4eeeb'+(i%3?'24':'45'));
    if(i%6===0){circle(c,x,y,2.2,null,'#b7e5e72b');circle(c,x-.7,y-.8,.5,'#e1ffff66');}
  }
  // A small school stays in the distant lower water, away from the target rows.
  for(let i=0;i<6;i++){
    const x=110+((t*3+i*19)%460),y=285+Math.sin(i*2+t*.23)*9;
    c.fillStyle='#062b3870';c.beginPath();c.ellipse(x,y,3.5,1.2,-.12,0,TAU);c.fill();
    path(c,[[x-3,y],[x-6,y-2],[x-6,y+2]],'#062b3870');
  }
 }else if(game.level===6){
  for(let i=0;i<10;i++){const x=90+(i*67)%570,y=410-((t*7+i*31)%300);circle(c,x,y,1,'#f4c48d26');}
 }else if(game.level===7){
  const descent=Math.min(6,Math.floor(game.stageTime/18))*18;
  panel(c,94,30+descent,532,12,'#88735450');for(let x=100;x<620;x+=26)path(c,[[x,31+descent],[x+8,31+descent],[x+18,41+descent],[x+10,41+descent]],'#deb47745');
 }else if(game.level===8){
  c.save();c.translate(360,208);c.rotate(t*.08);c.strokeStyle=game.switchesLeft?'#74caba44':'#f6b57677';c.lineWidth=4;
  for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,125,i*TAU/3,i*TAU/3+1);c.stroke();}c.restore();
  glow(c,360,208,72,game.switchesLeft?'#56bfa52e':'#efa36338');
 }
 c.restore();
}
