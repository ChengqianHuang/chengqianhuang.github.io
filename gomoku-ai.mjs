import {N, CELLS, AXES, inside} from './gomoku-engine.mjs?v=1';

const WIN = 1_000_000_000, FORCED = 20_000_000, FOUR_THREE = 12_000_000;
const DOUBLE_THREE = 5_000_000, FOUR = 100_000, THREE = 15_000;
const MATE = 100_000_000, INF = MATE * 2, TIMEOUT = Symbol('search deadline');
const CONFIG = {
  casual: {depth: 2, width: 8, ms: 140, vcf: 0},
  standard: {depth: 8, width: 14, ms: 900, vcf: 13},
  challenge: {depth: 12, width: 20, ms: 2800, vcf: 21},
};

// Each axis has eight neighbours and an implicit stone at its centre.
// The 3^8 lookup replaces strings and pattern matching inside the search.
const POW = Array.from({length: 8}, (_, i) => 3 ** i);
const OFFSETS = [-4, -3, -2, -1, 1, 2, 3, 4];
const LINE = new Uint8Array(6561);
const FIVE = 1, OPEN_FOUR = 2, CLOSED_FOUR = 4, OPEN_THREE = 8;
const CLOSED_THREE = 16, OPEN_TWO = 32, CLOSED_TWO = 64;

function winningPoints(line, anchor = -1) {
  let points = 0;
  for (let start = 0; start <= 4; start++) {
    if (anchor >= 0 && (anchor < start || anchor > start + 4)) continue;
    let stones = 0, blank = -1;
    for (let j = start; j < start + 5; j++) {
      if (line[j] === 2) { stones = -9; break; }
      if (line[j] === 1) stones++; else blank = j;
    }
    if (stones === 4) points |= 1 << blank;
  }
  return points;
}

for (let code = 0; code < LINE.length; code++) {
  const line = new Uint8Array(9); line[4] = 1;
  let rest = code;
  for (let k = 0; k < 8; k++) { line[OFFSETS[k] + 4] = rest % 3; rest = Math.floor(rest / 3); }
  let bits = 0;
  for (let start = 0; start <= 4; start++) {
    let count = 0;
    for (let j = start; j < start + 5; j++) {
      if (line[j] === 2) { count = -9; break; }
      count += line[j];
    }
    if (count === 5) bits |= FIVE;
    else if (count === 3) bits |= CLOSED_THREE;
    else if (count === 2) bits |= CLOSED_TWO;
  }
  const wins = winningPoints(line);
  if (wins) bits |= (wins & (wins - 1)) ? OPEN_FOUR : CLOSED_FOUR;
  if (!(bits & (FIVE | OPEN_FOUR | CLOSED_FOUR))) {
    for (let j = 0; j < 9; j++) if (!line[j]) {
      line[j] = 1;
      const next = winningPoints(line, j);
      line[j] = 0;
      if (next & (next - 1)) { bits |= OPEN_THREE; break; }
    }
    const text = Array.from(line).join('');
    for (const pattern of ['001100', '001010', '010100', '010010', '011000', '000110']) {
      let at = text.indexOf(pattern);
      while (at !== -1) {
        if (at <= 4 && at + pattern.length > 4) bits |= OPEN_TWO;
        at = text.indexOf(pattern, at + 1);
      }
    }
  }
  LINE[code] = bits;
}

function combine(codes, offset, index) {
  let fours = 0, threes = 0, small = 0, open = false;
  for (let axis = 0; axis < 4; axis++) {
    const bits = LINE[codes[offset + axis]];
    if (bits & FIVE) return WIN;
    if (bits & OPEN_FOUR) open = true;
    if (bits & (OPEN_FOUR | CLOSED_FOUR)) fours++;
    else if (bits & OPEN_THREE) threes++;
    else if (bits & CLOSED_THREE) small += 1800;
    else if (bits & OPEN_TWO) small += 400;
    else if (bits & CLOSED_TWO) small += 40;
  }
  if (open || fours >= 2) return FORCED + fours * 1000 + threes * 100;
  if (fours && threes) return FOUR_THREE + threes * 1000 + small;
  if (threes >= 2) return DOUBLE_THREE + small;
  return fours * FOUR + threes * THREE + small + 24 - Math.abs(index % N - 7) - Math.abs(Math.floor(index / N) - 7);
}

const RAYS = [], AFFECTED = [], NEAR = [];
for (let i = 0; i < CELLS; i++) {
  const x = i % N, y = Math.floor(i / N);
  RAYS[i] = AXES.map(([dx, dy]) => OFFSETS.map(d => inside(x + dx * d, y + dy * d) ? (y + dy * d) * N + x + dx * d : -1));
  AFFECTED[i] = []; NEAR[i] = [];
  for (let axis = 0; axis < 4; axis++) for (let k = 0; k < 8; k++) {
    const target = RAYS[i][axis][k];
    if (target >= 0) AFFECTED[i].push([target, axis, POW[7 - k]]);
  }
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    if ((dx || dy) && inside(x + dx, y + dy)) NEAR[i].push((y + dy) * N + x + dx);
  }
}

// Two independent hashes, plus side to move, identify transpositions.
let seed = 0x472ad91b;
function random32() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; }
const HASH_A = Array.from({length: 3}, () => Uint32Array.from({length: CELLS}, random32));
const HASH_B = Array.from({length: 3}, () => Uint32Array.from({length: CELLS}, random32));

class Position {
  constructor(input) {
    this.board = Int8Array.from(input);
    this.codes = [null, new Uint16Array(CELLS * 4), new Uint16Array(CELLS * 4)];
    this.scores = [null, new Int32Array(CELLS), new Int32Array(CELLS)];
    this.near = new Uint8Array(CELLS);
    this.count = 0; this.hashA = 0; this.hashB = 0;
    for (let i = 0; i < CELLS; i++) {
      const stone = this.board[i];
      if (stone) {
        this.count++; this.hashA ^= HASH_A[stone][i]; this.hashB ^= HASH_B[stone][i];
        for (const target of NEAR[i]) this.near[target]++;
      }
      for (let side = 1; side <= 2; side++) {
        for (let axis = 0; axis < 4; axis++) {
          let code = 0;
          for (let k = 0; k < 8; k++) {
            const target = RAYS[i][axis][k], value = target < 0 ? 2 : this.board[target] === side ? 1 : this.board[target] ? 2 : 0;
            code += value * POW[k];
          }
          this.codes[side][i * 4 + axis] = code;
        }
        this.scores[side][i] = stone ? 0 : combine(this.codes[side], i * 4, i);
      }
    }
  }
  key(side) { return `${this.hashA},${this.hashB},${side}`; }
  change(index, side, delta) {
    this.board[index] = delta > 0 ? side : 0;
    this.count += delta;
    this.hashA ^= HASH_A[side][index]; this.hashB ^= HASH_B[side][index];
    for (const target of NEAR[index]) this.near[target] += delta;
    for (const [target, axis, power] of AFFECTED[index]) {
      for (let player = 1; player <= 2; player++) {
        this.codes[player][target * 4 + axis] += delta * power * (side === player ? 1 : 2);
        this.scores[player][target] = this.board[target] ? 0 : combine(this.codes[player], target * 4, target);
      }
    }
    for (let player = 1; player <= 2; player++) this.scores[player][index] = delta > 0 ? 0 : combine(this.codes[player], index * 4, index);
  }
  candidates(side) {
    const result = [], attack = this.scores[side], defense = this.scores[3 - side];
    for (let index = 0; index < CELLS; index++) if (!this.board[index] && this.near[index]) {
      const a = attack[index], d = defense[index];
      result.push({index, attack: a, defense: d, score: Math.max(a, d * .96) + Math.min(a, d) * .16});
    }
    result.sort((a, b) => b.score - a.score || a.index - b.index);
    return result;
  }
}

export function threat(board, index, side) {
  if (index < 0 || index >= CELLS || board[index]) return 0;
  const codes = new Uint16Array(4);
  for (let axis = 0; axis < 4; axis++) for (let k = 0; k < 8; k++) {
    const target = RAYS[index][axis][k], value = target < 0 ? 2 : board[target] === side ? 1 : board[target] ? 2 : 0;
    codes[axis] += value * POW[k];
  }
  return combine(codes, 0, index);
}

export function chooseMove(input, side = 2, {difficulty = 'standard', timeLimit, now = () => performance.now()} = {}) {
  const started = now(), config = CONFIG[difficulty] || CONFIG.standard;
  const budget = Math.max(1, timeLimit ?? config.ms), deadline = started + budget;
  if (input.length !== CELLS || (side !== 1 && side !== 2) || input.some(v => v !== 0 && v !== 1 && v !== 2)) return {index: -1, depth: 0, nodes: 0};
  const pos = new Position(input);
  if (pos.count === CELLS) return {index: -1, depth: 0, nodes: 0};
  if (!pos.count) return {index: 112, depth: 0, nodes: 0};
  let nodes = 0, completed = 0, hits = 0, stopAt = deadline;
  const table = new Map(), proofTable = new Map();
  const killers = [], history = [null, new Int32Array(CELLS), new Int32Array(CELLS)];
  const visit = () => { nodes++; if (now() >= stopAt) throw TIMEOUT; };
  const pack = (score, ply) => score > MATE - 1000 ? score + ply : score < -MATE + 1000 ? score - ply : score;
  const unpack = (score, ply) => score > MATE - 1000 ? score - ply : score < -MATE + 1000 ? score + ply : score;

  function forced(options) {
    return {wins: options.filter(m => m.attack >= WIN), blocks: options.filter(m => m.defense >= WIN)};
  }

  // VCF proof: every attack makes a four. A single reply must block it;
  // two winning endpoints prove mate only if the defender cannot win now.
  // Unknown/timeout is never treated as a proven win.
  function continuousFour(turn, remaining) {
    visit();
    const key = pos.key(turn), cached = proofTable.get(key);
    if (cached && cached.remaining >= remaining) return cached.line;
    const options = pos.candidates(turn), {wins, blocks} = forced(options);
    if (wins.length) return [wins[0].index];
    if (remaining < 3 || blocks.length > 1) return null;
    const attacks = options.filter(m => m.attack >= FOUR && (!blocks.length || m.index === blocks[0].index));
    for (const move of attacks) {
      pos.change(move.index, turn, 1);
      try {
        const replies = pos.candidates(3 - turn), response = forced(replies);
        if (response.wins.length) continue;
        if (response.blocks.length >= 2) return [move.index, response.blocks[0].index, response.blocks[1].index];
        if (response.blocks.length !== 1) continue;
        const block = response.blocks[0].index;
        pos.change(block, 3 - turn, 1);
        let tail;
        try { tail = continuousFour(turn, remaining - 2); }
        finally { pos.change(block, 3 - turn, -1); }
        if (tail) return [move.index, block, ...tail];
      } finally { pos.change(move.index, turn, -1); }
    }
    proofTable.set(key, {remaining, line: null});
    return null;
  }

  function evaluate(turn) {
    let first = 0, second = 0, enemyFirst = 0, enemySecond = 0, sum = 0, enemySum = 0;
    for (let i = 0; i < CELLS; i++) if (pos.near[i] && !pos.board[i]) {
      const own = pos.scores[turn][i], enemy = pos.scores[3 - turn][i];
      if (own > first) { second = first; first = own; } else if (own > second) second = own;
      if (enemy > enemyFirst) { enemySecond = enemyFirst; enemyFirst = enemy; } else if (enemy > enemySecond) enemySecond = enemy;
      sum += Math.min(own, THREE); enemySum += Math.min(enemy, THREE);
    }
    return Math.round(first + second * .3 + sum * .08 - enemyFirst * 1.06 - enemySecond * .32 - enemySum * .09);
  }

  function ordered(options, turn, width, ply, preferred) {
    const selected = options.filter((m, i) => i < width || m.attack >= FOUR || m.defense >= FOUR || m.index === preferred);
    const rank = m => m.index === preferred ? INF * 4 : m.score + (killers[ply]?.includes(m.index) ? 400 : 0) + history[turn][m.index] * .05;
    selected.sort((a, b) => rank(b) - rank(a) || a.index - b.index);
    return selected;
  }

  function quiescence(turn, alpha, beta, ply, remaining) {
    visit();
    if (pos.count === CELLS) return 0;
    const options = pos.candidates(turn), {wins, blocks} = forced(options);
    if (wins.length) return MATE - ply - 1;
    if (blocks.length > 1) return -MATE + ply + 2;
    if (!blocks.length && options.some(m => m.attack >= FORCED)) return MATE - ply - 3;
    if (remaining <= 0) return evaluate(turn);
    const danger = blocks.length || options.some(m => m.defense >= FORCED);
    let value = danger ? -INF : evaluate(turn);
    if (!danger) { if (value >= beta) return value; alpha = Math.max(alpha, value); }
    // Against a broken three, blocking an endpoint can be as good as filling
    // the gap. Keep those closed-four defense squares in the extension too.
    const tactical = blocks.length ? blocks : options.filter(m => m.attack >= FOUR || danger && m.defense >= FOUR);
    if (!tactical.length) return evaluate(turn);
    for (const move of tactical) {
      pos.change(move.index, turn, 1);
      let score;
      try { score = -quiescence(3 - turn, -beta, -alpha, ply + 1, remaining - 1); }
      finally { pos.change(move.index, turn, -1); }
      value = Math.max(value, score); alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    }
    return value;
  }

  function search(turn, depth, alpha, beta, ply) {
    visit();
    if (pos.count === CELLS) return 0;
    if (depth <= 0) return quiescence(turn, alpha, beta, ply, config.vcf ? 10 : 2);
    const key = pos.key(turn), entry = table.get(key), originalAlpha = alpha;
    if (entry && entry.depth >= depth) {
      const score = unpack(entry.score, ply);
      if (entry.flag === 'exact' || entry.flag === 'lower' && score >= beta || entry.flag === 'upper' && score <= alpha) { hits++; return score; }
    }
    const options = pos.candidates(turn), {wins, blocks} = forced(options);
    if (wins.length) return MATE - ply - 1;
    if (blocks.length > 1) return -MATE + ply + 2;
    if (!blocks.length && options.some(m => m.attack >= FORCED)) return MATE - ply - 3;
    const moves = blocks.length ? blocks : ordered(options, turn, Math.max(8, config.width - (ply > 2 ? 6 : 2)), ply, entry?.best);
    let value = -INF, best = moves[0]?.index ?? -1;
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      pos.change(move.index, turn, 1);
      let score;
      try {
        // Search the principal variation in full; re-search improving bounds.
        score = i === 0 ? -search(3 - turn, depth - 1, -beta, -alpha, ply + 1) : -search(3 - turn, depth - 1, -alpha - 1, -alpha, ply + 1);
        if (i && score > alpha && score < beta) score = -search(3 - turn, depth - 1, -beta, -alpha, ply + 1);
      } finally { pos.change(move.index, turn, -1); }
      if (score > value) { value = score; best = move.index; }
      alpha = Math.max(alpha, score);
      if (alpha >= beta) {
        history[turn][move.index] += depth * depth;
        killers[ply] = [move.index, killers[ply]?.[0]].slice(0, 2);
        break;
      }
    }
    if (table.size > 60000) table.clear();
    table.set(key, {depth, score: pack(value, ply), best, flag: value <= originalAlpha ? 'upper' : value >= beta ? 'lower' : 'exact'});
    return value === -INF ? 0 : value;
  }

  const all = pos.candidates(side), immediate = forced(all);
  const obvious = immediate.wins[0] || immediate.blocks[0] || all.find(m => m.attack >= FORCED);
  if (obvious) return {index: obvious.index, depth: 1, nodes: 1};
  let root = ordered(all, side, config.width + 4, 0, -1);
  let best = root[0].index, bestScore = -INF;
  if (config.vcf) {
    stopAt = Math.min(deadline, started + budget * .2);
    let line = null;
    try { line = continuousFour(side, config.vcf); }
    catch (error) { if (error !== TIMEOUT) throw error; }
    if (line) return {index: line[0], depth: line.length, nodes, proof: line, ttHits: hits};
    // Check defenses against a proven enemy sequence beyond the normal horizon.
    // Unknown defenses remain eligible; only actual proofs mark a losing move.
    stopAt = Math.min(deadline, started + budget * .35);
    try {
      const enemyLine = continuousFour(3 - side, config.vcf);
      if (enemyLine) {
        for (const index of enemyLine) if (!pos.board[index] && !root.some(m => m.index === index)) root.push(all.find(m => m.index === index));
        root = root.filter(Boolean);
        for (const move of root) {
          pos.change(move.index, side, 1);
          try { const loss = continuousFour(3 - side, config.vcf); move.lossIn = loss ? loss.length + 1 : 0; }
          finally { pos.change(move.index, side, -1); }
        }
      }
    } catch (error) { if (error !== TIMEOUT) throw error; }
    root.sort((a, b) => Number(Boolean(a.lossIn)) - Number(Boolean(b.lossIn)) || b.score - a.score);
    best = root[0].index;
  }
  stopAt = deadline;
  for (let depth = 1; depth <= config.depth; depth++) {
    let candidate = best, value = -INF, alpha = -INF;
    const moves = [...root].sort((a, b) => Number(Boolean(a.lossIn)) - Number(Boolean(b.lossIn)) || Number(b.index === best) - Number(a.index === best) || b.score - a.score);
    try {
      for (const move of moves) {
        visit();
        pos.change(move.index, side, 1);
        let score;
        try { score = move.lossIn ? -MATE + move.lossIn : -search(3 - side, depth - 1, -INF, -alpha, 1); }
        finally { pos.change(move.index, side, -1); }
        if (score > value) { value = score; candidate = move.index; }
        alpha = Math.max(alpha, score);
      }
    } catch (error) { if (error !== TIMEOUT) throw error; break; }
    best = candidate; bestScore = value; completed = depth;
    if (Math.abs(value) > MATE - 1000) break;
  }
  return {index: best, depth: completed, nodes, ttHits: hits, score: bestScore};
}
