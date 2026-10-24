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
