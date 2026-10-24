import {N,CELLS,AXES,inside,winningLine} from './gomoku-engine.mjs?v=1';
const WIN=1_000_000_000;
const OPEN_THREES=['001110','011100','010110','011010'];
function containsCenter(line,pattern){let from=0,index;while((index=line.indexOf(pattern,from))!==-1){if(index<=5&&index+pattern.length>5)return true;from=index+1;}return false;}
// Evaluate a hypothetical stone by independent axes; do not count the same threat twice.
export function threat(board,index,side){
 if(board[index])return 0;const x=index%N,y=Math.floor(index/N);let fours=0,openFours=0,threes=0,small=0;
 for(const [dx,dy]of AXES){let line='';for(let t=-5;t<=5;t++){const xx=x+dx*t,yy=y+dy*t;line+=t===0?'1':!inside(xx,yy)?'2':board[yy*N+xx]===side?'1':board[yy*N+xx]===0?'0':'2';}
  if(containsCenter(line,'11111'))return WIN;
  const wins=new Set();for(let s=1;s<=5;s++){const w=line.slice(s,s+5);if(!w.includes('2')&&w.split('1').length===5)wins.add(s+w.indexOf('0'));}
  if(wins.size>=2){openFours++;fours++;}else if(wins.size===1)fours++;
  if(!wins.size&&OPEN_THREES.some(p=>containsCenter(line,p)))threes++;
  if(containsCenter(line,'0110')||containsCenter(line,'01010')||containsCenter(line,'010010'))small+=900;
  if(containsCenter(line,'21110')||containsCenter(line,'01112'))small+=1800;
 }
 if(openFours)return 24_000_000+fours*20000+threes*1000;
 if(fours>=2)return 20_000_000+threes*1000;
 if(fours&&threes)return 12_000_000+threes*1000;
 if(threes>=2)return 5_000_000+small;
 return fours*450_000+threes*70_000+small+24-(Math.abs(x-7)+Math.abs(y-7));
}
function moves(board,side,limit=12){
 const nearby=new Set();for(let i=0;i<CELLS;i++)if(board[i]){const x=i%N,y=Math.floor(i/N);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(inside(xx,yy)&&!board[yy*N+xx])nearby.add(yy*N+xx);}}
 if(!nearby.size)return[{index:112,attack:24,defense:24,score:24}];
 const all=[...nearby].map(index=>{const attack=threat(board,index,side),defense=threat(board,index,3-side);return{index,attack,defense,score:Math.max(attack,defense*.96)+Math.min(attack,defense)*.12};});
 const wins=all.filter(m=>m.attack>=WIN);if(wins.length)return wins.sort((a,b)=>b.score-a.score);
 const blocks=all.filter(m=>m.defense>=WIN);if(blocks.length)return blocks.sort((a,b)=>b.attack-a.attack);
 all.sort((a,b)=>b.score-a.score||a.index-b.index);return all.slice(0,limit);
}
export function chooseMove(input,side=2,{difficulty='standard',timeLimit,now=()=>performance.now()}={}){
 const board=Int8Array.from(input);if(board.length!==CELLS||!board.some(v=>v===0))return{index:-1,depth:0,nodes:0};
 const config=({casual:{depth:1,width:7,ms:90},standard:{depth:3,width:9,ms:500},challenge:{depth:5,width:12,ms:1500}})[difficulty]||{depth:3,width:9,ms:500};
 const deadline=now()+(timeLimit??config.ms);let nodes=0,stopped=false;
 const root=moves(board,side,config.width);if(root[0]?.attack>=WIN||root[0]?.defense>=WIN||!board.some(v=>v!==0))return{index:root[0]?.index??-1,depth:1,nodes:1};
 let best=root[0].index,completed=0;
 function search(turn,depth,alpha,beta,ply,extension=0){
  nodes++;if(now()>deadline){stopped=true;return 0;}
  const options=moves(board,turn,depth>1?config.width:8);if(!options.length)return 0;
  if(options[0].attack>=WIN)return WIN-ply*10000;
  if(options.length>1&&options[0].defense>=WIN)return -WIN+(ply+1)*10000;
  if(depth<=0){
   // Extend forced replies rather than cutting off just before a forced win/loss.
   if(options[0].defense>=WIN&&extension<3)return descend(options.slice(0,1),turn,0,alpha,beta,ply,extension+1);
   const own=Math.max(...options.map(m=>m.attack)),opponent=Math.max(...options.map(m=>m.defense));return own-opponent*1.08;
  }
  return descend(options,turn,depth,alpha,beta,ply,extension);
 }
 function descend(options,turn,depth,alpha,beta,ply,extension){let value=-Infinity;
  for(const m of options){if(now()>deadline){stopped=true;break;}board[m.index]=turn;const score=-search(3-turn,depth-1,-beta,-alpha,ply+1,extension);board[m.index]=0;if(stopped)break;value=Math.max(value,score);alpha=Math.max(alpha,score);if(alpha>=beta)break;}
  return value===-Infinity?0:value;
 }
 for(let depth=1;depth<=config.depth;depth++){
  let candidate=best,score=-Infinity,alpha=-Infinity;const ordered=[...root].sort((a,b)=>(b.index===best)-(a.index===best)||b.score-a.score);
  for(const m of ordered){if(now()>deadline){stopped=true;break;}board[m.index]=side;const value=-search(3-side,depth-1,-Infinity,-alpha,1);board[m.index]=0;if(stopped)break;if(value>score){score=value;candidate=m.index;}alpha=Math.max(alpha,value);}
  if(stopped)break;best=candidate;completed=depth;if(score>WIN*.8)break;
 }
 return{index:best,depth:completed,nodes};
}
