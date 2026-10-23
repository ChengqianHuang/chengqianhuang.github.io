import { move, addRandomTile, canMove } from './game-2048-engine.mjs?v=1';

const boardElement = document.getElementById('puzzle-board');
const machine = document.querySelector('.puzzle-machine');
const tilesElement = document.getElementById('puzzle-tiles');
const overlay = document.getElementById('puzzle-overlay');
const status = document.getElementById('puzzle-status');
const undoButton = document.getElementById('puzzle-undo');
const restartButton = document.getElementById('puzzle-restart');
const continueButton = document.getElementById('puzzle-continue');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const storageKey = 'blog-2048-v1';
const bestKey = 'blog-2048-best';
let state;
let previous = null;
let best = 0;
let finishPending = null;
let timer = 0;
let pointer = null;

function validState(value) {
  return value && Array.isArray(value.board) && value.board.length === 16 &&
    value.board.some(tile => tile > 0) && value.board.every(tile => Number.isInteger(tile) &&
      (tile === 0 || (tile >= 2 && tile <= 2 ** 30 && Number.isInteger(Math.log2(tile))))) &&
    Number.isSafeInteger(value.score) && value.score >= 0 && typeof value.continued === 'boolean';
}

function save() {
  best = Math.max(best, state.score);
  try {
    localStorage.setItem(storageKey, JSON.stringify({ state, previous }));
    localStorage.setItem(bestKey, String(best));
  } catch { /* A full or unavailable storage must not interrupt play. */ }
}

function freshBoard() {
  return addRandomTile(addRandomTile(Array(16).fill(0)).board).board;
}

function focusBoard() { boardElement.focus({ preventScroll: true }); }

function render({ spawned = -1, merges = [] } = {}) {
  const oldOverlay = !overlay.hidden;
  const won = !state.continued && state.board.some(value => value >= 2048);
  const lost = !canMove(state.board);
  tilesElement.replaceChildren();
  state.board.forEach((value, index) => {
    document.getElementById(`puzzle-cell-${index}`).setAttribute('aria-label',
      `第 ${Math.floor(index / 4) + 1} 行，第 ${index % 4 + 1} 列：${value || '空'}`);
    if (!value) return;
    const tile = document.createElement('div');
    tile.className = `number-tile${index === spawned ? ' born' : ''}${merges.includes(index) ? ' merged' : ''}`;
    tile.dataset.index = String(index);
    tile.dataset.value = String(value);
    tile.dataset.digits = String(String(value).length);
    tile.style.setProperty('--x', index % 4);
    tile.style.setProperty('--y', Math.floor(index / 4));
    const face = document.createElement('span');
    face.textContent = String(value);
    tile.append(face);
    tilesElement.append(tile);
  });
  document.getElementById('puzzle-score').textContent = state.score.toLocaleString('zh-CN');
  document.getElementById('puzzle-best').textContent = best.toLocaleString('zh-CN');
  undoButton.disabled = !previous;
  restartButton.disabled = false;
  overlay.hidden = !won && !lost;
  if (!overlay.hidden) {
    document.getElementById('puzzle-message').textContent = won ? '2048，合出来了！' : '棋盘满了';
    document.getElementById('puzzle-description').textContent = won
      ? '可以继续，看看还能合到多少。'
      : previous ? '试试撤回一步，或重新开一局。' : '再来一局，换个思路。';
    continueButton.hidden = !won;
    if (!oldOverlay) (won ? continueButton : document.getElementById('puzzle-again')).focus({ preventScroll: true });
  }
}

function newGame() {
  if (finishPending) finishPending();
  state = { board: freshBoard(), score: 0, continued: false };
  previous = null;
  save();
  render();
  document.getElementById('puzzle-gain').textContent = '';
  status.textContent = '新的一局。使用方向键或在棋盘上滑动。';
  focusBoard();
}

function play(direction) {
  if (finishPending || !overlay.hidden) return;
  const result = move(state.board, direction);
  if (!result.changed) {
    status.textContent = '这个方向不能移动，试试其他方向。';
    return;
  }
  previous = { ...state, board: [...state.board] };
  undoButton.disabled = true;
  restartButton.disabled = true;
  for (const transition of result.transitions) {
    const tile = tilesElement.querySelector(`[data-index="${transition.from}"]`);
    tile.style.setProperty('--x', transition.to % 4);
    tile.style.setProperty('--y', Math.floor(transition.to / 4));
  }
  finishPending = () => {
    if (!finishPending) return;
    clearTimeout(timer);
    finishPending = null;
    const spawned = addRandomTile(result.board);
    state = { ...state, board: spawned.board, score: state.score + result.score };
    save();
    render({ spawned: spawned.index, merges: result.merges });
    const gain = document.getElementById('puzzle-gain');
    gain.textContent = result.score ? `+${result.score}` : '';
    gain.classList.remove('rise');
    if (result.score) requestAnimationFrame(() => gain.classList.add('rise'));
    status.textContent = `${result.score ? `合并获得 ${result.score} 分。` : '已移动。'}当前 ${state.score} 分。${!canMove(state.board) ? '棋盘已满，没有可移动的位置。' : ''}`;
  };
  if (reducedMotion.matches) finishPending();
  else timer = setTimeout(() => finishPending?.(), 125);
}

function undo() {
  if (!previous || finishPending) return;
  state = previous;
  previous = null;
  save();
  render();
  document.getElementById('puzzle-gain').textContent = '';
  status.textContent = '已撤回一步。';
  focusBoard();
}

machine.addEventListener('keydown', event => {
  const direction = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[event.key];
  if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
  event.preventDefault();
  play(direction);
});
boardElement.addEventListener('pointerdown', event => {
  if ((event.pointerType === 'mouse' && event.button !== 0) || pointer || finishPending || !overlay.hidden) return;
  pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  boardElement.setPointerCapture(event.pointerId);
  focusBoard();
});
boardElement.addEventListener('pointerup', event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  const dx = event.clientX - pointer.x;
  const dy = event.clientY - pointer.y;
  pointer = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  play(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
});
for (const type of ['pointercancel', 'lostpointercapture']) {
  boardElement.addEventListener(type, () => { pointer = null; });
}
undoButton.addEventListener('click', undo);
restartButton.addEventListener('click', newGame);
document.getElementById('puzzle-again').addEventListener('click', newGame);
continueButton.addEventListener('click', () => {
  state.continued = true;
  save();
  render();
  focusBoard();
});
addEventListener('pagehide', () => finishPending?.());
document.addEventListener('visibilitychange', () => { if (document.hidden) finishPending?.(); });

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  const savedBest = Number(localStorage.getItem(bestKey));
  if (Number.isSafeInteger(savedBest) && savedBest >= 0) best = savedBest;
  if (validState(saved?.state)) {
    state = saved.state;
    if (validState(saved.previous)) previous = saved.previous;
  }
} catch { /* Start fresh when saved data is inaccessible or invalid. */ }
if (!state) state = { board: freshBoard(), score: 0, continued: false };
save();
render();
if (overlay.hidden) focusBoard();
