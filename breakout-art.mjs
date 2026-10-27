// Presentation only: never changes the simulation, collision bounds or score.
import {W,H,WALL,R,POWERS} from './breakout-engine.mjs?v=2';
export const STAGES = [
  {name:'COPPER WORKS', ink:'#eaa87a', cool:'#75c7bd', top:'#1d3039', bottom:'#0a141e'},
  {name:'TIDAL ARRAY', ink:'#8acfc9', cool:'#adc5dc', top:'#153e46', bottom:'#091a29'},
  {name:'AMBER VAULT', ink:'#e2be72', cool:'#9cbbb0', top:'#37352e', bottom:'#141d24'},
  {name:'TWIN REACTORS', ink:'#a6c9e5', cool:'#75bba9', top:'#263e52', bottom:'#0d1926'},
  {name:'CHECKER WORKS', ink:'#e3a98f', cool:'#83b4ad', top:'#3b3031', bottom:'#151e29'},
  {name:'THE ARCH', ink:'#aecbb5', cool:'#e4b782', top:'#263e38', bottom:'#101d23'},
  {name:'IRON KEEP', ink:'#c3cbd3', cool:'#d69a75', top:'#303a46', bottom:'#111a25'},
  {name:'LAST LIGHT', ink:'#efb16f', cool:'#83cfca', top:'#3d3330', bottom:'#111c28'},
];
const TAU=Math.PI*2;
export function createBreakoutArt(ctx,reduced){
  let bits=[],rings=[],labels=[],trails=new Map(),shocks=[],shake=0,kick=0,clock=0,backdrop=null,backdropLevel=0;
  const round=(x,y,w,h,r=4)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
  function burst(e,count,large=false){
    if(reduced.matches)return;
    for(let i=0;i<count;i++){
      const a=Math.random()*TAU,s=45+Math.random()*(large?220:150);
      bits.push({x:e.x+(Math.random()-.5)*30,y:e.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-35,age:0,life:.35+Math.random()*.4,size:large?3+Math.random()*7:1+Math.random()*4,a,spin:(Math.random()-.5)*12,color:e.color||'#f3c485',chip:i%3===0});
    }
    if(bits.length>300)bits.splice(0,bits.length-300);
  }
  function impact(e){
    if(e.type==='brick'||e.type==='armor'){
      burst(e,e.type==='brick'?19:7,e.type==='brick');
      if(!reduced.matches){rings.push({x:e.x,y:e.y,age:0,size:28,color:e.color});shake=Math.max(shake,e.type==='brick'?1.5:.7);}
      if(e.type==='brick'&&!reduced.matches)labels.push({x:e.x,y:e.y,age:0,text:e.multiplier>1?`+${e.points}  ×${e.multiplier}`:`+${e.points}`,color:e.multiplier>1?'#ffe1a4':'#e5f1f3'});
    }else if(e.type==='paddle'){
      kick=1;burst(e,10);if(!reduced.matches)rings.push({x:e.x,y:e.y,age:0,size:23,color:'#b0f2e5'});
    }else if(e.type==='wall'){
      if(!reduced.matches)shocks.push({x:e.x,y:e.y,age:0});
    }else if(e.type==='explosion'||e.type==='save'){
      burst(e,38,true);if(!reduced.matches){rings.push({x:e.x,y:e.y,age:0,size:110,color:e.color});shake=4;}
    }else if(e.type==='power'){
      const p=POWERS[e.kind];burst({...e,color:p.color},25,true);if(!reduced.matches)labels.push({x:e.x,y:e.y-20,age:0,text:p.label,color:p.color});
    }
    labels=labels.slice(-12);rings=rings.slice(-20);shocks=shocks.slice(-12);
  }
  function background(level){
    if(backdrop&&backdropLevel===level)return;
    backdropLevel=level;backdrop=document.createElement('canvas');backdrop.width=W*2;backdrop.height=H*2;
    const b=backdrop.getContext('2d');b.scale(2,2);const s=STAGES[level-1];
    let g=b.createLinearGradient(0,0,W,H);g.addColorStop(0,s.top);g.addColorStop(1,s.bottom);b.fillStyle=g;b.fillRect(0,0,W,H);
    g=b.createRadialGradient(W*.5,0,10,W*.5,100,410);g.addColorStop(0,s.ink+'18');g.addColorStop(1,s.ink+'00');b.fillStyle=g;b.fillRect(0,0,W,H);
    b.strokeStyle='#bfdae407';b.lineWidth=.65;
    for(let x=40;x<W;x+=24){b.beginPath();b.moveTo(x,24);b.lineTo(x,H);b.stroke();}
    for(let y=24;y<H;y+=24){b.beginPath();b.moveTo(24,y);b.lineTo(W-24,y);b.stroke();}
    // Recessed playing surface, metal rails and discrete calibration marks.
    b.strokeStyle='#0007';b.lineWidth=9;b.beginPath();b.moveTo(21,H-17);b.lineTo(21,21);b.lineTo(W-21,21);b.lineTo(W-21,H-17);b.stroke();
    b.strokeStyle='#65818b';b.lineWidth=2;b.beginPath();b.moveTo(WALL,H-23);b.lineTo(WALL,WALL);b.lineTo(W-WALL,WALL);b.lineTo(W-WALL,H-23);b.stroke();
    b.strokeStyle=s.cool+'55';b.lineWidth=1;b.beginPath();b.moveTo(27,H-24);b.lineTo(27,27);b.lineTo(W-27,27);b.lineTo(W-27,H-24);b.stroke();
    for(let y=40;y<H-30;y+=12){b.fillStyle=y%48===40?s.ink+'aa':'#8ba8b34d';b.fillRect(14,y,y%48===40?6:3,1);b.fillRect(W-20,y,y%48===40?6:3,1);}
    b.font='8px monospace';b.fillStyle='#a0b9c466';b.textAlign='left';b.fillText(s.name,37,16);b.textAlign='right';b.fillText('SECTOR '+String(level).padStart(2,'0'),W-37,16);
    b.strokeStyle='#f0a37235';b.setLineDash([3,5]);b.beginPath();b.moveTo(36,H-16);b.lineTo(W-36,H-16);b.stroke();b.setLineDash([]);
    b.fillStyle='#b7c8ce28';b.textAlign='center';b.font='8px monospace';b.fillText('RETURN ZONE',W/2,H-6);
  }
  function brick(b){
    const color=b.type==='bomb'?'#ee9b6d':b.color;
    ctx.fillStyle='#02070d88';round(b.x+1,b.y+5,b.w,b.h,3);ctx.fill();
    ctx.fillStyle='#0b141b';round(b.x-1,b.y-1,b.w+2,b.h+3,4);ctx.fill();
    let g=ctx.createLinearGradient(0,b.y,0,b.y+b.h);g.addColorStop(0,color);g.addColorStop(.35,color);g.addColorStop(1,'#30444c');ctx.fillStyle=g;round(b.x,b.y,b.w,b.h,3);ctx.fill();
    ctx.fillStyle='#fff5';round(b.x+2,b.y+1,b.w-4,1.5,1);ctx.fill();
    ctx.fillStyle='#ffffff12';ctx.fillRect(b.x+4,b.y+4,b.w-8,6);
    ctx.fillStyle='#06101d65';ctx.fillRect(b.x+3,b.y+b.h-3,b.w-6,2);
    ctx.strokeStyle='#ffffff12';ctx.lineWidth=.5;for(let x=b.x+8;x<b.x+b.w-4;x+=6){ctx.beginPath();ctx.moveTo(x,b.y+3);ctx.lineTo(x-3,b.y+b.h-4);ctx.stroke();}
    ctx.fillStyle='#172c38a0';ctx.fillRect(b.x+4,b.y+8,2,4);ctx.fillRect(b.x+b.w-6,b.y+8,2,4);
    if(b.type==='armor'){
      ctx.strokeStyle='#eef7edb0';ctx.lineWidth=1;round(b.x+2,b.y+2,b.w-4,b.h-4,2);ctx.stroke();
      for(let i=0;i<b.maxHp;i++){ctx.fillStyle=i<b.hp?'#f5f1d8':'#203743';ctx.fillRect(b.x+b.w/2+(i-(b.maxHp-1)/2)*7-2,b.y+9,4,3);}
      if(b.hp<b.maxHp){ctx.strokeStyle='#142631cc';ctx.beginPath();ctx.moveTo(b.x+b.w*.6,b.y+2);ctx.lineTo(b.x+b.w*.49,b.y+9);ctx.lineTo(b.x+b.w*.59,b.y+12);ctx.lineTo(b.x+b.w*.45,b.y+b.h);ctx.stroke();}
    }else if(b.type==='bomb'){
      ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.rotate(Math.PI/4);ctx.fillStyle='#32251e';ctx.fillRect(-4,-4,8,8);ctx.strokeStyle='#ffe9c9';ctx.strokeRect(-4,-4,8,8);ctx.restore();
    }else if(b.power){ctx.fillStyle='#18303dbb';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(POWERS[b.power].icon,b.x+b.w/2,b.y+15);}
    if(b.flash>0){ctx.globalAlpha=Math.min(.9,b.flash/.09);ctx.fillStyle='#fff5d8';round(b.x,b.y,b.w,b.h,3);ctx.fill();ctx.globalAlpha=1;}
  }
  function draw(game,dt=0){
    clock+=dt;shake=Math.max(0,shake-dt*24);kick=Math.max(0,kick-dt*7);
    for(const p of bits){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=230*dt;p.a+=p.spin*dt;}
    for(const p of [...rings,...labels,...shocks])p.age+=dt;
    bits=bits.filter(p=>p.age<p.life);rings=rings.filter(p=>p.age<.4);labels=labels.filter(p=>p.age<.7);shocks=shocks.filter(p=>p.age<.25);
    background(game.level);ctx.clearRect(0,0,W,H);ctx.drawImage(backdrop,0,0,W,H);ctx.save();
    if(!reduced.matches&&shake>0)ctx.translate(Math.sin(clock*173)*shake,Math.cos(clock*127)*shake*.6);
    const s=STAGES[game.level-1];
    // Quiet field markings leave the ball and power capsules easy to track.
    ctx.strokeStyle=s.cool+'12';ctx.lineWidth=1;ctx.beginPath();ctx.arc(W/2,300,57,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(W/2,300,63,Math.PI*.05,Math.PI*.95);ctx.stroke();
    ctx.fillStyle=s.cool+'2a';ctx.font='600 10px monospace';ctx.textAlign='center';ctx.fillText('BREAK / '+String(game.level).padStart(2,'0'),W/2,304);
    for(const b of game.bricks)if(b.hp>0)brick(b);
    if(game.combo>=3){ctx.textAlign='right';ctx.fillStyle=s.ink+'cc';ctx.font='600 27px monospace';ctx.fillText(String(game.combo).padStart(2,'0'),W-43,303);ctx.font='8px monospace';ctx.fillStyle='#b8cbd599';ctx.fillText('CHAIN',W-43,317);}
    for(const e of shocks){ctx.globalAlpha=1-e.age/.25;ctx.fillStyle=s.cool;ctx.shadowColor=s.cool;ctx.shadowBlur=15;round(e.x<40?21:e.x>W-40?W-24:e.x-15,e.y<40?21:e.y-15,e.y<40?30:3,e.y<40?3:30,2);ctx.fill();ctx.shadowBlur=0;}ctx.globalAlpha=1;
    if(game.shield){ctx.strokeStyle='#8edbf2';ctx.shadowColor='#71c7db';ctx.shadowBlur=12;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(WALL,H-15);ctx.lineTo(W-WALL,H-15);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#83d3ed15';ctx.fillRect(WALL,H-24,W-WALL*2,14);}
    for(const d of game.drops){const p=POWERS[d.kind];ctx.shadowColor=p.color;ctx.shadowBlur=10;ctx.fillStyle='#142631';round(d.x-20,d.y-11,40,22,5);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=p.color;ctx.fillRect(d.x-17,d.y-7,2,14);ctx.fillRect(d.x+15,d.y-7,2,14);ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.fillText(p.icon,d.x,d.y+5);}
    for(const e of rings){ctx.globalAlpha=(1-e.age/.4)**2;ctx.strokeStyle=e.color;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x,e.y,4+e.age*e.size*5,2+e.age*e.size*2,0,0,TAU);ctx.stroke();}ctx.globalAlpha=1;
    for(const p of bits){ctx.save();ctx.globalAlpha=Math.min(1,(1-p.age/p.life)*1.6);ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/3,p.size,p.size*.65);if(p.chip){ctx.fillStyle='#fffc';ctx.fillRect(-p.size/2,-p.size/3,p.size,1);}ctx.restore();}
    for(const key of trails.keys())if(!game.balls.includes(key))trails.delete(key);
    for(const ball of game.balls){
      let trail=trails.get(ball);if(!trail){trail=[];trails.set(ball,trail);}if(dt>0&&!reduced.matches){trail.push({x:ball.x,y:ball.y});if(trail.length>14)trail.shift();}
      if(!reduced.matches){for(let i=1;i<trail.length;i++){ctx.globalAlpha=i/trail.length*.35;ctx.strokeStyle=s.ink;ctx.lineWidth=R*1.3*i/trail.length;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(trail[i-1].x,trail[i-1].y);ctx.lineTo(trail[i].x,trail[i].y);ctx.stroke();}ctx.globalAlpha=1;ctx.shadowColor=s.ink;ctx.shadowBlur=17;}
      const g=ctx.createRadialGradient(ball.x-2,ball.y-3,1,ball.x,ball.y,R);g.addColorStop(0,'#fff');g.addColorStop(.4,'#fff3d0');g.addColorStop(1,s.ink);ctx.fillStyle=g;ctx.beginPath();ctx.arc(ball.x,ball.y,R,0,TAU);ctx.fill();ctx.shadowBlur=0;
    }
    const p=game.paddle,x=p.x-p.w/2,y=p.y;ctx.fillStyle='#0008';round(x+1,y+5,p.w,p.h,5);ctx.fill();
    const metal=ctx.createLinearGradient(0,y,0,y+p.h);metal.addColorStop(0,'#d8e8ea');metal.addColorStop(.3,'#5b7b89');metal.addColorStop(.6,'#213543');metal.addColorStop(1,'#8aa1a7');ctx.fillStyle=metal;round(x,y,p.w,p.h,5);ctx.fill();
    ctx.fillStyle=game.wideTime>0?'#b9f8dc':s.cool;ctx.shadowColor=s.cool;ctx.shadowBlur=kick*14+3;round(x+13,y+2,p.w-26,3,1.5);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle=s.ink;round(x+1,y+1,9,p.h-2,3);ctx.fill();round(x+p.w-10,y+1,9,p.h-2,3);ctx.fill();ctx.fillStyle='#b7d2d9';ctx.fillRect(p.x-6,y+8,12,1);
    for(const l of labels){ctx.globalAlpha=Math.max(0,1-l.age/.7);ctx.fillStyle=l.color;ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText(l.text,l.x,l.y-9-l.age*40);}ctx.globalAlpha=1;ctx.restore();
  }
  function clear(){bits=[];rings=[];labels=[];shocks=[];trails.clear();shake=0;kick=0;}
  return {draw,impact,clear};
}
