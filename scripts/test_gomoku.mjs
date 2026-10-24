import assert from 'node:assert/strict';
import {GomokuGame,CELLS,winningLine,coordinate} from '../gomoku-engine.mjs';
import {chooseMove,threat} from '../gomoku-ai.mjs';
const at=(x,y)=>y*15+x;
const board=(stones)=>{const b=new Int8Array(CELLS);for(const [x,y,s]of stones)b[at(x,y)]=s;return b;};
for(const [dx,dy]of [[1,0],[0,1],[1,1],[1,-1]]){const b=new Int8Array(CELLS);for(let i=0;i<6;i++)b[at(3+dx*i,8+dy*i)]=1;assert.ok(winningLine(b,at(3,8)));}
const edge=board([[13,0,1],[14,0,1],[0,1,1],[1,1,1],[2,1,1]]);assert.equal(winningLine(edge,at(0,1)),null,'Rows must not wrap at board edges');
const g=new GomokuGame();assert.equal(g.play(-1),false);assert.ok(g.play(112));assert.equal(g.play(112),false);g.play(113);assert.ok(g.undoToHuman(1));assert.equal(g.history.length,0);g.play(112);assert.equal(g.undoToHuman(2),false);g.play(113);g.play(114);g.undoToHuman(2);assert.equal(g.history.length,1);assert.equal(g.turn,2);assert.equal(coordinate(112),'H8');
const fixtures=[
 {name:'take own win before blocking',stones:[[4,7,2],[5,7,2],[6,7,2],[7,7,2],[8,3,1],[8,4,1],[8,5,1],[8,6,1]],ok:[at(3,7),at(8,7)]},
 {name:'block a closed four',stones:[[3,7,2],[4,7,1],[5,7,1],[6,7,1],[7,7,1]],ok:[at(8,7)]},
 {name:'block a broken four',stones:[[3,7,2],[4,7,1],[5,7,1],[7,7,1],[8,7,1]],ok:[at(6,7)]},
 {name:'finish a broken four',stones:[[4,7,2],[5,7,2],[7,7,2],[8,7,2]],ok:[at(6,7)]},
 {name:'block on board edge',stones:[[0,0,1],[1,0,1],[2,0,1],[3,0,1]],ok:[at(4,0)]},
];
for(const level of ['casual','standard','challenge'])for(const f of fixtures){const b=board(f.stones),before=Array.from(b),r=chooseMove(b,2,{difficulty:level});assert.ok(f.ok.includes(r.index),`${level}: ${f.name}: ${coordinate(r.index)}`);assert.deepEqual(Array.from(b),before,'Search must not mutate the live board');}
const fork=board([[6,7,2],[8,7,2],[7,6,2],[7,8,2],[5,5,1],[9,9,1]]);assert.ok(threat(fork,112,2)>4e6);const answer=chooseMove(fork,2,{difficulty:'challenge',timeLimit:300});assert.equal(answer.index,112,'Find a double live-three attack');
const open=board([[7,7,1],[8,8,2],[6,8,1],[7,8,2],[5,7,1],[8,7,2]]);const started=performance.now(),r=chooseMove(open,2,{difficulty:'challenge',timeLimit:250});assert.ok(r.index>=0&&!open[r.index]);assert.ok(performance.now()-started<600,'Search must honor its time budget');
assert.equal(chooseMove(new Int8Array(CELLS).fill(1),2).index,-1);assert.equal(chooseMove(new Int8Array(CELLS),1).index,112);
console.log(`Gomoku passed: lines, edges, overlines, occupied cells, undo, win/block/gap tactics at all levels, forks, immutable search, timed search (${r.depth} completed plies).`);

// A fork is slower than the opponent's open-four attack: defend the live three.
const counterAttack = board([[6,7,2],[8,7,2],[7,6,2],[7,8,2],[4,3,1],[5,3,1],[6,3,1]]);
const defensive = chooseMove(counterAttack,2,{difficulty:'challenge',timeLimit:500});
assert.ok([at(3,3),at(7,3)].includes(defensive.index),'Do not play a double three while allowing an immediate open four');
const sealed = board([[4,7,2],[5,7,1],[7,7,1],[8,7,2]]);
assert.ok(threat(sealed,at(6,7),1)<15000,'A three sealed at both ends is not a live three');

const winningMoves = (b,side) => {
 const result=[];
 for(let i=0;i<CELLS;i++)if(!b[i]){b[i]=side;if(winningLine(b,i))result.push(i);b[i]=0;}
 return result;
};
// Verify certificates against the actual game rules, independently of the AI's
// pattern table. Every reply is forced, ending in two wins or a completed five.
function verifyProof(initial,side,line){
 const b=Int8Array.from(initial);
 for(let step=0;step<line.length;step+=2){
  const attack=line[step];assert.equal(b[attack],0);b[attack]=side;
  if(winningLine(b,attack)){assert.equal(step,line.length-1);return;}
  assert.equal(winningMoves(b,3-side).length,0,'Defender can counter-win: invalid proof');
  const wins=winningMoves(b,side);assert.ok(wins.length>0,'Every attack must force a reply');
  const reply=line[step+1];assert.ok(wins.includes(reply));assert.equal(b[reply],0);b[reply]=3-side;
  assert.equal(winningLine(b,reply),null);
  if(wins.length>1){assert.equal(step,line.length-3);assert.ok(wins.includes(line[step+2]));}
 }
 assert.fail('Proof did not end in five');
}
const combinations=[
 [112,82,111,98,66,114,130,96,97,110,68,83,65,67,81,113,33,49,51,84,36,21,35],
 [112,113,96,128,97,111,127,142,98,99,140,84,82,67,124,110,114,66,94,95,109,139,108,156],
];
let longest=0;
for(const sequence of combinations)for(let symmetry=0;symmetry<8;symmetry++){
 const transform=index=>{let x=index%15,y=Math.floor(index/15);if(symmetry&4)x=14-x;for(let n=0;n<(symmetry&3);n++)[x,y]=[14-y,x];return at(x,y);};
 const game=new GomokuGame();for(const index of sequence){assert.equal(game.winner,0);assert.ok(game.play(transform(index)));}
 const before=Array.from(game.board),result=chooseMove(game.board,game.turn,{difficulty:'challenge',timeLimit:500});
 assert.ok(result.proof,'Find continuous-four combinations in all eight board orientations');
 assert.equal(result.index,result.proof[0]);verifyProof(game.board,game.turn,result.proof);
 assert.deepEqual(Array.from(game.board),before);longest=Math.max(longest,result.proof.length);
}
// Force timeout mid-search and verify that unwinding leaves the input untouched.
const quiet=board([[7,7,1],[8,8,2],[6,8,1],[9,6,2]]),before=Array.from(quiet);let ticks=0;
const interrupted=chooseMove(quiet,1,{difficulty:'challenge',timeLimit:20,now:()=>ticks++});
assert.ok(interrupted.index>=0&&!quiet[interrupted.index]);assert.deepEqual(Array.from(quiet),before);
assert.ok(ticks<30,'Timeout must unwind promptly');
assert.equal(chooseMove(new Int8Array(224),1).index,-1);
console.log(`Stronger AI passed: counter-threat defense, sealed patterns, ${combinations.length*8} independently verified forcing lines (up to ${longest} plies), timeout recovery.`);

const underPressure=new GomokuGame();
for(const index of [112,113,96,128,97,111,98])underPressure.play(index);
const resistance=chooseMove(underPressure.board,2,{difficulty:'challenge',timeLimit:500});
assert.ok([95,99].includes(resistance.index),'Even a losing position must block the immediate open-four attack');
const sharedDefense=board([[6,7,2],[8,7,2],[7,6,2],[7,8,2],[4,3,1],[5,3,1],[7,3,1],[3,4,1],[3,5,1],[3,6,1]]);
assert.equal(chooseMove(sharedDefense,2,{difficulty:'challenge',timeLimit:500}).index,at(3,3),'Use the shared endpoint to defend a broken three and a crossing live three');
console.log('Defensive regression passed: resist forced loss and cover intersecting threats.');
