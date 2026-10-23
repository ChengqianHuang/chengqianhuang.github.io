// Pure board rules, shared by the game and its regression checks.
export function move(board, direction) {
  if (!['left', 'right', 'up', 'down'].includes(direction)) throw new Error('Unknown direction');
  const next = Array(16).fill(0);
  const transitions = [];
  const merges = [];
  let score = 0;
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, offset) => {
      if (direction === 'left') return line * 4 + offset;
      if (direction === 'right') return line * 4 + 3 - offset;
      if (direction === 'up') return offset * 4 + line;
      return (3 - offset) * 4 + line;
    });
    const tiles = indices.filter(index => board[index]).map(index => ({ index, value: board[index] }));
    let destination = 0;
    for (let source = 0; source < tiles.length; source++) {
      const tile = tiles[source];
      const target = indices[destination++];
      transitions.push({ from: tile.index, to: target });
      if (tiles[source + 1]?.value === tile.value) {
        transitions.push({ from: tiles[++source].index, to: target });
        next[target] = tile.value * 2;
        score += next[target];
        merges.push(target);
      } else next[target] = tile.value;
    }
  }
  return { board: next, score, transitions, merges, changed: next.some((value, index) => value !== board[index]) };
}

export function addRandomTile(board, random = Math.random) {
  const empty = board.flatMap((value, index) => value === 0 ? [index] : []);
  if (!empty.length) return { board: [...board], index: -1 };
  const index = empty[Math.floor(random() * empty.length)];
  const next = [...board];
  next[index] = random() < .9 ? 2 : 4;
  return { board: next, index };
}

export function canMove(board) {
  if (board.includes(0)) return true;
  return board.some((value, index) =>
    (index % 4 < 3 && value === board[index + 1]) ||
    (index < 12 && value === board[index + 4]));
}
