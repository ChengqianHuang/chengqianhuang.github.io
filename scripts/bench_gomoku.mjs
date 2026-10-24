// Usage: node scripts/bench_gomoku.mjs /absolute/path/to/previous-ai.mjs [milliseconds=250]
// Give both engines the same wall-clock budget and swap colours for each opening.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {chooseMove} from '../gomoku-ai.mjs';
import {GomokuGame, coordinate} from '../gomoku-engine.mjs';
const source = process.argv[2];
if (!source) throw new Error('Pass a baseline AI module exporting chooseMove');
const {chooseMove: baseline} = await import(pathToFileURL(source));
const timeLimit = Number(process.argv[3] || 250);
const openings = [[112], [112, 96, 113, 97], [112, 97, 128, 111, 126, 114], [112, 113, 96, 128, 97, 111]];
const results = {newWins: 0, oldWins: 0, draws: 0, unfinished: 0};
for (const [openingIndex, opening] of openings.entries()) for (const newSide of [1, 2]) {
  const game = new GomokuGame();
  for (const index of opening) assert.ok(game.play(index));
  const moves = [], records = [];
  let newNodes = 0, oldNodes = 0;
  while (!game.winner && !game.draw && game.history.length < 120) {
    const fresh = game.turn === newSide, engine = fresh ? chooseMove : baseline;
    const started = performance.now();
    const result = engine(game.board, game.turn, {difficulty: 'challenge', timeLimit});
    assert.ok(game.play(result.index), `Illegal move ${result.index}`);
    const elapsed = Math.round(performance.now() - started);
    moves.push(coordinate(result.index));
    records.push({index: result.index, fresh, depth: result.depth, nodes: result.nodes, elapsed, proof: result.proof});
    if (fresh) newNodes += result.nodes; else oldNodes += result.nodes;
  }
  const outcome = game.winner ? game.winner === newSide ? 'newWins' : 'oldWins' : game.draw ? 'draws' : 'unfinished';
  results[outcome]++;
  console.log(JSON.stringify({opening: openingIndex + 1, newSide, outcome, plies: game.history.length, newNodes, oldNodes, moves, records}));
}
console.log(JSON.stringify({timeLimit, ...results}));
