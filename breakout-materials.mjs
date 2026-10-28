// Surface details stay inside the simulation's rectangles; shadows are decorative.
const palettes={
  1:['#cf9268','#86b7b1','#c4bd91','#84a1b6'],
  2:['#97aebc','#c3c9c1','#7d98aa','#b5a17b'],
  3:['#d8b36e','#88aba3','#c9c4aa','#819ba4'],
  4:['#91c5af','#accdbd','#82aea7','#c5c4a0'],
  6:['#929da5','#a49a88','#82969b','#b2a58c'],
  7:['#bb9476','#97a5a8','#beac8a','#81969b'],
  8:['#a6c9c2','#ddba82','#acc1c8','#b1bdac'],
};
function shape(c,x,y,w,h,r=3){c.beginPath();c.roundRect(x,y,w,h,r);}
function poly(c,points,color){c.beginPath();for(const [i,p]of points.entries())i?c.lineTo(...p):c.moveTo(...p);c.closePath();c.fillStyle=color;c.fill();}
export function drawMaterialBody(c,b,level){
 const {x,y,w,h}=b,row=Math.max(0,Math.round((b.baseY-48)/29));
 const color=b.type==='bomb'?'#e9a16b':b.type==='switch'?'#8dc6b5':b.type==='core'?'#ddbd8f':palettes[level]?.[row%4]||b.color;
 c.save();
 c.fillStyle='#02070dbb';shape(c,x+1,y+4,w,h);c.fill();
 c.fillStyle='#10232c';shape(c,x-1,y-1,w+2,h+2);c.fill();
 const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,color);g.addColorStop(.12,color);g.addColorStop(.55,level===6?'#4b5355':'#3b5058');g.addColorStop(1,color);c.fillStyle=g;shape(c,x,y,w,h);c.fill();
 if(level===6&&b.type!=='bomb'){
  // Clipped facets provide rock texture without suggesting different collision bounds.
  c.save();c.clip();
  poly(c,[[x,y],[x+w*.38,y+1],[x+w*.62,y+h*.45],[x+7,y+h-2]],'#d0c7b94d');
  poly(c,[[x+w*.38,y+1],[x+w-3,y+2],[x+w-8,y+h-2],[x+w*.62,y+h*.45]],'#273c4599');
  poly(c,[[x+7,y+h-2],[x+w*.62,y+h*.45],[x+w-8,y+h-2]],'#b8a08355');
  c.strokeStyle='#d5b78388';c.lineWidth=.7;c.beginPath();c.moveTo(x+9,y+3);c.lineTo(x+22,y+8);c.lineTo(x+20,y+14);c.lineTo(x+33,y+h-3);c.stroke();
  for(let i=0;i<11;i++){c.fillStyle=i%2?'#e5d4b340':'#152a3660';c.fillRect(x+3+(i*17)%Math.max(1,w-6),y+3+(i*7)%Math.max(1,h-6),1.5,1);}
  c.restore();
 }else if(level===1||level===3){
  // Ribbed cargo containers, with corner castings and a recessed shipping latch.
  c.fillStyle='#112d354d';c.fillRect(x+5,y+4,w-10,h-8);
  for(let i=9;i<w-6;i+=7){c.fillStyle='#071c3055';c.fillRect(x+i,y+4,2,h-8);c.fillStyle='#e8eadb55';c.fillRect(x+i+2,y+4,1,h-8);}
  for(const xx of [x+2,x+w-5])for(const yy of [y+2,y+h-5]){c.fillStyle='#1c303b';c.fillRect(xx,yy,3,3);c.fillStyle='#d7d9bf99';c.fillRect(xx,yy,3,1);}
  if(level===3){c.fillStyle='#192f37';c.fillRect(x+w/2-8,y+h-7,16,4);c.fillStyle='#d4bb81';for(let i=0;i<3;i++)c.fillRect(x+w/2-6+i*5,y+h-6,2,2);}
 }else if(level===4){
  c.fillStyle='#174340';shape(c,x+4,y+3,w-8,h-6,2);c.fill();
  c.strokeStyle='#bddbba88';c.lineWidth=1;
  for(const side of [-1,1]){c.beginPath();c.moveTo(x+w/2+side*5,y+5);c.lineTo(x+w/2+side*14,y+5);c.lineTo(x+w/2+side*20,y+h-5);c.stroke();}
  c.fillStyle='#bce8c6';c.fillRect(x+w/2-2,y+4,4,h-8);
 }else{
  // Machined plates: chamfer, inset, brush grain and steel screw heads.
  c.fillStyle='#071c3033';shape(c,x+5,y+3,w-10,h-6,2);c.fill();
  c.strokeStyle='#edf2ea20';c.lineWidth=.5;for(let i=4;i<h-3;i+=3){c.beginPath();c.moveTo(x+7,y+i);c.lineTo(x+w-7,y+i);c.stroke();}
  for(const xx of [x+3,x+w-5]){c.fillStyle='#172b35';c.fillRect(xx,y+5,2,h-10);c.fillStyle='#ced4c7';c.fillRect(xx,y+5,2,1);}
  if(level===7){for(let i=0;i<3;i++){c.fillStyle=i%2?'#3d4140':'#d1b07a';c.fillRect(x+8+i*4,y+h-5,3,2);}}
 }
 if(b.type==='bomb'){
  c.fillStyle='#7c382b';shape(c,x+6,y+4,w-12,h-8,2);c.fill();
  for(const xx of [x+10,x+w-13]){c.fillStyle='#e9b677';c.fillRect(xx,y+3,3,h-6);}
 }
 c.fillStyle='#f6f3df77';c.fillRect(x+4,y+1,w-8,1);
 c.fillStyle='#071923aa';c.fillRect(x+3,y+h-2,w-6,1);
 c.restore();
}
export function drawSteelBarrier(c,b){
 const {x,y,w,h}=b;c.save();c.fillStyle='#000a';shape(c,x,y+4,w,h,2);c.fill();
 const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#d2d9d5');g.addColorStop(.25,'#738693');g.addColorStop(.5,'#203441');g.addColorStop(1,'#8e9ba0');c.fillStyle=g;shape(c,x,y,w,h,2);c.fill();
 c.fillStyle='#152a35';c.fillRect(x+8,y+4,w-16,h-8);
 for(let xx=x+13;xx<x+w-9;xx+=13){c.fillStyle='#92a6af66';c.fillRect(xx,y+5,5,1);}
 for(const xx of [x+3,x+w-6]){c.fillStyle='#d9d8bf';c.fillRect(xx,y+4,3,h-8);c.fillStyle='#142833';c.fillRect(xx+1,y+6,1,2);}
 if(b.flash>0){c.fillStyle='#edfff199';c.fillRect(x,y,w,h);}c.restore();
}
