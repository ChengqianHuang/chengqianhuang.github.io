import assert from 'node:assert/strict';
import { move, canMove, addRandomTile } from '../game-2048-engine.mjs';

const row = values => [...values, ...Array(12).fill(0)];
for (const [input, expected, score] of [
  [[2, 2, 2, 2], [4, 4, 0, 0], 8],
  [[2, 2, 4, 0], [4, 4, 0, 0], 4],
  [[4, 4, 8, 8], [8, 16, 0, 0], 24],
  [[2, 0, 2, 2], [4, 2, 0, 0], 4],
  [[1024, 1024, 0, 0], [2048, 0, 0, 0], 2048],
]) {
  const result = move(row(input), 'left');
  assert.deepEqual(result.board, row(expected));
  assert.equal(result.score, score);
}
assert.deepEqual(move(row([2, 2, 2, 0]), 'right').board, row([0, 0, 2, 4]));
const column = [2, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0];
assert.deepEqual(move(column, 'up').board, [4, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
assert.deepEqual(move(column, 'down').board, [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 8, 0, 0, 0]);
assert.equal(move(row([4, 2, 0, 0]), 'left').changed, false);

const blocked = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
assert.equal(canMove(blocked), false);
assert.equal(canMove([...blocked.slice(0, 15), 0]), true);
assert.equal(canMove([2, 2, ...blocked.slice(2)]), true);
assert.equal(canMove([2, 4, 2, 4, 2, ...blocked.slice(5)]), true);
assert.equal(addRandomTile(blocked).index, -1);

let seed = 2048;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const sum = board => board.reduce((total, value) => total + value, 0);
let turns = 0;
for (let game = 0; game < 30; game++) {
  let board = addRandomTile(addRandomTile(Array(16).fill(0), random).board, random).board;
  for (let turn = 0; turn < 300 && canMove(board); turn++) {
    const original = [...board];
    const result = move(board, ['left', 'up', 'right', 'down'][Math.floor(random() * 4)]);
    assert.deepEqual(board, original, 'Planning a move must not mutate the undo board');
    assert.equal(sum(result.board), sum(board), 'Merges conserve the total value');
    assert.equal(result.transitions.length, board.filter(Boolean).length);
    assert.equal(result.score, result.merges.reduce((score, index) => score + result.board[index], 0));
    if (result.changed) {
      const spawned = addRandomTile(result.board, random);
      assert.equal(result.board[spawned.index], 0);
      assert.ok([2, 4].includes(spawned.board[spawned.index]));
      assert.equal(spawned.board.filter(Boolean).length, result.board.filter(Boolean).length + 1);
      assert.equal(sum(spawned.board) - sum(board), spawned.board[spawned.index]);
      board = spawned.board;
      turns++;
    }
  }
}
console.log(`2048 rules passed: merge order, four directions, win tile, blocked boards, ${turns} simulated turns.`);
