// Special targets share their outline with the physics engine.
import {brickPolygon,coreRadius,POWERS} from './breakout-engine.mjs?v=4';
const TAU=Math.PI*2;
function polygon(c,points){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();}
function circle(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);}
function flash(c,b,path){if(b.flash>0){c.globalAlpha=b.flash/.09*.8;c.fillStyle='#fff5df';path();c.fill();c.globalAlpha=1;}}
export function drawCrystal(c,b){
  const points=brickPolygon(b),x=b.x+b.w*.5,y=b.y+b.h*.58;
  c.save();
  c.shadowColor='#020b14';c.shadowBlur=5;c.shadowOffsetY=4;
  polygon(c,points);c.fillStyle='#112a36';c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  const g=c.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);
  g.addColorStop(0,'#effff2');g.addColorStop(.22,b.color);g.addColorStop(.54,'#315d6a');g.addColorStop(1,'#143b49');
  c.fillStyle=g;polygon(c,points);c.fill();
  // Each facet terminates at the same physical perimeter, including chipped tips.
  points.forEach((p,i)=>{
    const next=points[(i+1)%points.length];polygon(c,[p,next,{x,y}]);
    c.fillStyle=['#e7fff044','#ffffff0a','#031b3d66','#061a2d77','#8ce7e933','#ffffff30'][i];c.fill();
    c.strokeStyle='#c9f6f332';c.lineWidth=.7;c.stroke();
  });
  polygon(c,points);c.strokeStyle=b.color;c.lineWidth=1.2;c.stroke();
  c.save();polygon(c,points);c.clip();
  if(b.hp<3){
    c.strokeStyle='#091d2e';c.lineWidth=2;c.beginPath();c.moveTo(b.x+b.w*.3,b.y+b.h*.2);c.lineTo(x-5,y-8);c.lineTo(x+4,y);c.lineTo(x-4,b.y+b.h);c.stroke();
    c.strokeStyle='#edfff5aa';c.lineWidth=.65;c.stroke();
  }
  if(b.hp===1){c.beginPath();c.moveTo(x,y);c.lineTo(x+9,y-2);c.lineTo(b.x+b.w,y+9);c.stroke();}
  c.restore();
  c.fillStyle='#ddfff0';circle(c,x,y,1.5);c.fill();
  if(b.power){c.fillStyle='#f7fff4';c.font='bold 10px system-ui';c.textAlign='center';c.fillText(POWERS[b.power].icon,x,y+12);}
  flash(c,b,()=>polygon(c,points));c.restore();
}
export function drawBarrel(c,b,t){
  c.save();const points=brickPolygon(b);polygon(c,points);
  const g=c.createLinearGradient(b.x,0,b.x+b.w,0);g.addColorStop(0,'#6a3727');g.addColorStop(.3,'#edac69');g.addColorStop(.65,'#a85a37');g.addColorStop(1,'#422c29');
  c.fillStyle=g;c.fill();c.strokeStyle='#f4c38b';c.lineWidth=1;c.stroke();
  c.save();c.clip();
  c.fillStyle='#253e46';for(const y of [b.y+5,b.y+b.h-8]){c.fillRect(b.x,y,b.w,3);c.fillStyle='#b7b6a1';c.fillRect(b.x,y, b.w,1);c.fillStyle='#253e46';}
  c.fillStyle='#392f29';c.fillRect(b.x+6,b.y+11,b.w-12,11);
  c.fillStyle='#ffdd8e';polygon(c,[{x:b.x+12,y:b.y+12},{x:b.x+17,y:b.y+21},{x:b.x+7,y:b.y+21}]);c.fill();
  c.fillStyle='#6b3826';c.fillRect(b.x+11.5,b.y+15,1,3);
  c.fillStyle=Math.sin(t*5+b.y)>.2?'#ffe0aa':'#b94f31';circle(c,b.x+b.w/2,b.y+3,1.5);c.fill();c.restore();
  if(b.power){c.fillStyle='#f3efd9';c.font='bold 8px system-ui';c.textAlign='center';c.fillText(POWERS[b.power].icon,b.x+b.w/2,b.y+b.h-3);}
  flash(c,b,()=>polygon(c,points));c.restore();
}
export function drawGenerator(c,b){
  c.save();const points=brickPolygon(b),x=b.x+b.w/2,y=b.y+b.h/2;
  polygon(c,points);const g=c.createLinearGradient(b.x,b.y,b.x+b.w,b.y+b.h);g.addColorStop(0,'#ccddd2');g.addColorStop(.3,'#536e71');g.addColorStop(.6,'#213943');g.addColorStop(1,'#81928a');c.fillStyle=g;c.fill();c.strokeStyle='#becfc1';c.lineWidth=1;c.stroke();
  circle(c,x,y,17);c.fillStyle='#071f2a';c.fill();
  for(let i=0;i<8;i++){const a=i*TAU/8;c.strokeStyle='#8ab5a1';c.lineWidth=3;c.beginPath();c.moveTo(x+Math.cos(a)*12,y+Math.sin(a)*12);c.lineTo(x+Math.cos(a)*16,y+Math.sin(a)*16);c.stroke();}
  for(let i=0;i<2;i++){c.strokeStyle=i<b.hp?'#a0f3d1':'#304c4c';c.lineWidth=3;c.beginPath();c.arc(x,y,8,i*Math.PI+.2,(i+1)*Math.PI-.2);c.stroke();}
  circle(c,x,y,3);c.fillStyle='#ddffdc';c.fill();
  if(b.hp===1){c.strokeStyle='#051925';c.lineWidth=2;c.beginPath();c.moveTo(b.x+9,b.y);c.lineTo(x-6,y-8);c.lineTo(x-13,y+4);c.stroke();}
  flash(c,b,()=>polygon(c,points));c.restore();
}
export function drawCore(c,b,game,reduced){
  const x=b.x+b.w/2,y=b.y+b.h/2,r=coreRadius(b),locked=game.isProtected(b),t=reduced?0:game.stageTime;
  c.save();circle(c,x,y,r);c.fillStyle='#122833';c.shadowColor='#000';c.shadowBlur=8;c.shadowOffsetY=4;c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  const metal=c.createLinearGradient(x-r,y-r,x+r,y+r);metal.addColorStop(0,'#dee1cb');metal.addColorStop(.3,'#718486');metal.addColorStop(.6,'#233b46');metal.addColorStop(1,'#ab9e80');
  c.strokeStyle=metal;c.lineWidth=4;circle(c,x,y,r-2);c.stroke();
  circle(c,x,y,r-6);c.fillStyle='#081d29';c.fill();
  // Nine independent plates get knocked out one at a time, then the ring contracts.
  c.save();c.translate(x,y);c.rotate(t*(.28+game.bossPhase*.12));
  for(let i=0;i<9;i++){
    const a=i*TAU/9+.045,z=(i+1)*TAU/9-.045;
    c.beginPath();c.arc(0,0,r-5,a,z);c.arc(0,0,r-14,z,a,true);c.closePath();
    const plate=c.createLinearGradient(-r,-r,r,r);plate.addColorStop(0,'#d6cdb2');plate.addColorStop(.32,'#879291');plate.addColorStop(.5,'#3f5962');plate.addColorStop(1,'#253c47');
    c.fillStyle=i<b.hp?plate:'#24353b';c.fill();c.strokeStyle=i<b.hp?'#d0bd98':'#40565b';c.lineWidth=.7;c.stroke();
    if(i<b.hp){const mid=(a+z)/2;c.fillStyle='#dce6d5';circle(c,Math.cos(mid)*(r-9),Math.sin(mid)*(r-9),1.3);c.fill();c.strokeStyle=locked?'#93e3d1':'#ffbc76';c.lineWidth=2;c.beginPath();c.arc(0,0,r-9,a+.07,z-.07);c.stroke();}
  }
  c.restore();
  const glow=c.createRadialGradient(x-3,y-3,1,x,y,r-17);glow.addColorStop(0,locked?'#d7ffed':'#fff3ba');glow.addColorStop(.3,locked?'#5ba694':'#f4b65b');glow.addColorStop(1,locked?'#102f37':'#702e23');
  circle(c,x,y,r-17);c.fillStyle=glow;c.fill();
  if(locked){
    // Closed iris; all six shutters retract when both generators are destroyed.
    for(let i=0;i<6;i++){
      c.save();c.translate(x,y);c.rotate(i*TAU/6+t*.12);c.beginPath();c.moveTo(0,0);c.lineTo(r-17,-4);c.arc(0,0,r-16,0,TAU/6);c.closePath();const shutter=c.createLinearGradient(0,-r,r,r);shutter.addColorStop(0,'#aabdb5');shutter.addColorStop(.4,'#536d76');shutter.addColorStop(.65,'#203a48');shutter.addColorStop(1,'#718582');c.fillStyle=shutter;c.fill();c.strokeStyle='#a1bcb0';c.lineWidth=.7;c.stroke();c.restore();
    }
    circle(c,x,y,4);c.fillStyle='#b6eed9';c.fill();
  }else{
    c.strokeStyle='#ffedba';c.lineWidth=1.5;circle(c,x,y,r-19);c.stroke();
    c.save();c.translate(x,y);c.rotate(-t*.8);c.strokeStyle='#fff2c8';c.strokeRect(-6,-6,12,12);c.restore();
  }
  c.strokeStyle=locked?'#8bdac7':'#f8b36b';c.lineWidth=1;circle(c,x,y,r);c.stroke();
  flash(c,b,()=>circle(c,x,y,r));c.restore();
}
export function drawVeins(c,game){
  c.save();c.lineWidth=1.5;
  for(let vein=0;vein<3;vein++){
    const barrels=game.bricks.filter(b=>b.shape==='barrel'&&b.vein===vein);
    for(let i=1;i<barrels.length;i++){
      const a=barrels[i-1],b=barrels[i];c.strokeStyle=a.hp&&b.hp?'#e9a568aa':'#5b504066';
      c.beginPath();c.moveTo(a.x+a.w/2,a.y+a.h);c.lineTo(b.x+b.w/2,b.y);c.stroke();
    }
  }c.restore();
}
