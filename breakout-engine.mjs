export const W = 720, H = 440, WALL = 24, R = 8;
export const STEP = 1 / 240;
export const COLORS = ['#f4ab73', '#eac66c', '#7ccbbb', '#87b5dc', '#d7d1ad', '#dc9674'];
export const POWERS = {
  wide: { label: '加长挡板', icon: '↔', color: '#7cdbc1' },
  multi: { label: '三球', icon: '3', color: '#f5c76a' },
  shield: { label: '护底', icon: '▰', color: '#8ec9ed' },
};
export const LEVELS = [
  { name: '热身', rows: 4, keep: () => true },
  { name: '回廊', rows: 5, keep: (r, c) => r % 2 === 0 || c % 3 !== 1 },
  { name: '菱形', rows: 5, keep: (r, c) => Math.abs(c - 4) + Math.abs(r - 2) <= 4 },
  { name: '双塔', rows: 6, keep: (r, c) => c < 3 || c > 5 || r === 2 },
  { name: '棋盘', rows: 6, keep: (r, c) => (r + c) % 2 === 0 || r === 5 },
  { name: '拱门', rows: 6, keep: (r, c) => r < 2 ? c >= 2 - r && c <= 6 + r : c < 2 || c > 6 || r === 5 },
  { name: '要塞', rows: 6, keep: (r, c) => r === 0 || r === 5 || c === 0 || c === 8 || (r === 2 && c % 2 === 0) },
  { name: '终局', rows: 6, keep: () => true },
];
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function steer(ball, speed = Math.hypot(ball.vx, ball.vy)) {
  let vx = ball.vx, vy = ball.vy;
  if (Math.abs(vy) < speed * .28) vy = (vy < 0 ? -1 : 1) * speed * .28;
  if (Math.abs(vx) < speed * .1) vx = (vx < 0 ? -1 : 1) * speed * .1;
  const scale = speed / Math.hypot(vx, vy);
  ball.vx = vx * scale;
  ball.vy = vy * scale;
}

export class BreakoutGame {
  constructor({ random = Math.random, emit = () => {} } = {}) {
    this.random = random;
    this.emit = emit;
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.time = 0;
    this.paddle = { x: W / 2, target: W / 2, y: 398, w: 128, h: 12, vx: 0 };
    this.makeBricks();
    this.serve();
    this.mode = 'ready';
  }

  makeBricks() {
    const layout = LEVELS[this.level - 1];
    const cols = 9, gap = 8, width = (W - 2 * (WALL + 12) - gap * (cols - 1)) / cols;
    this.bricks = [];
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!layout.keep(row, col)) continue;
        const bomb = this.level >= 2 && (row * 3 + col + this.level) % 13 === 0;
        const armor = !bomb && this.level >= 2 && (row + col + this.level) % 4 === 0;
        const hp = armor ? this.level >= 7 && row === 0 ? 3 : 2 : 1;
        this.bricks.push({ x: WALL + 12 + col * (width + gap), y: 48 + row * 29,
          w: width, h: 21, hp, maxHp: hp, type: bomb ? 'bomb' : armor ? 'armor' : 'normal',
          color: COLORS[(row + this.level - 1) % COLORS.length], power: null, flash: 0 });
      }
    }
    // Spread one of each capsule through every level, including an early drop.
    [this.bricks.length - 5, Math.floor(this.bricks.length / 2), 3].forEach((index, i) => {
      this.bricks[index].power = ['wide', 'multi', 'shield'][(i + this.level - 1) % 3];
    });
  }

  serve() {
    this.wideTime = 0;
    this.shield = 0;
    this.combo = 0;
    this.drops = [];
    this.paddle.w = 128;
    this.paddle.x = this.paddle.target = W / 2;
    const speed = 265 + (this.level - 1) * 13;
    const vx = speed * (.28 + this.random() * .16) * (this.random() < .5 ? -1 : 1);
    this.balls = [{ x: W / 2, y: this.paddle.y - R - 2, vx, vy: -Math.sqrt(speed ** 2 - vx ** 2), trail: [] }];
  }

  start() {
    if (['ready', 'lost', 'won'].includes(this.mode)) this.reset();
    else if (this.mode === 'level') {
      this.level++;
      this.makeBricks();
      this.serve();
    }
    this.mode = 'playing';
  }

  get remaining() { return this.bricks.filter(brick => brick.hp > 0).length; }

  activatePower(kind) {
    if (kind === 'wide') {
      this.wideTime = 14;
      this.paddle.w = 180;
      this.paddle.x = clamp(this.paddle.x, WALL + 90, W - WALL - 90);
      this.paddle.target = clamp(this.paddle.target, WALL + 90, W - WALL - 90);
    } else if (kind === 'shield') this.shield = 1;
    else if (kind === 'multi' && this.balls.length) {
      const source = this.balls[0];
      for (const angle of [-.45, .45]) {
        if (this.balls.length >= 3) break;
        const ball = { x: source.x, y: source.y, vx: source.vx * Math.cos(angle) - source.vy * Math.sin(angle),
          vy: source.vx * Math.sin(angle) + source.vy * Math.cos(angle), trail: [] };
        steer(ball);
        this.balls.push(ball);
      }
    }
    this.emit({ type: 'power', kind, x: this.paddle.x, y: this.paddle.y - 20 });
  }

  damageBrick(brick, damage = 1) {
    if (brick.hp <= 0) return;
    brick.hp = Math.max(0, brick.hp - damage);
    brick.flash = .09;
    const x = brick.x + brick.w / 2, y = brick.y + brick.h / 2;
    if (brick.hp > 0) {
      this.score += 5;
      this.emit({ type: 'armor', x, y, color: brick.color });
      return;
    }
    this.combo++;
    const multiplier = Math.min(5, 1 + Math.floor((this.combo - 1) / 3));
    const points = (15 + this.level * 5) * multiplier;
    this.score += points;
    this.emit({ type: 'brick', x, y, color: brick.color, points, combo: this.combo, multiplier });
    if (brick.power) this.drops.push({ x, y, kind: brick.power });
    if (brick.type === 'bomb') {
      this.emit({ type: 'explosion', x, y, color: '#f0ad73' });
      for (const neighbor of this.bricks) {
        if (neighbor.hp <= 0) continue;
        const dx = Math.abs(neighbor.x - brick.x), dy = Math.abs(neighbor.y - brick.y);
        if ((dx < brick.w + 10 && dy < 3) || (dy < brick.h + 10 && dx < 3)) this.damageBrick(neighbor, 2);
      }
    }
  }

  collideBrick(ball, brick, nx, ny, penetration) {
    ball.x += nx * (penetration + .05);
    ball.y += ny * (penetration + .05);
    const dot = ball.vx * nx + ball.vy * ny;
    if (dot < 0) { ball.vx -= 2 * dot * nx; ball.vy -= 2 * dot * ny; }
    steer(ball, Math.min(415 + this.level * 14, Math.hypot(ball.vx, ball.vy) + 2));
    this.damageBrick(brick);
  }

  step(dt, direction = 0) {
    if (this.mode !== 'playing') return;
    this.time += dt;
    this.wideTime = Math.max(0, this.wideTime - dt);
    this.paddle.w = this.wideTime > 0 ? 180 : 128;
    const p = this.paddle;
    const oldPaddle = p.x;
    if (direction) p.target = p.x + direction * 650 * dt;
    p.target = clamp(p.target, WALL + p.w / 2, W - WALL - p.w / 2);
    p.x = clamp(direction ? p.target : p.x + (p.target - p.x) * Math.min(1, dt * 34), WALL + p.w / 2, W - WALL - p.w / 2);
    p.vx = (p.x - oldPaddle) / dt;
    for (const brick of this.bricks) brick.flash = Math.max(0, brick.flash - dt);

    for (const ball of this.balls) {
      const oldX = ball.x, oldY = ball.y;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      if (ball.x < WALL + R) { ball.x = WALL + R; ball.vx = Math.abs(ball.vx); }
      if (ball.x > W - WALL - R) { ball.x = W - WALL - R; ball.vx = -Math.abs(ball.vx); }
      if (ball.y < WALL + R) { ball.y = WALL + R; ball.vy = Math.abs(ball.vy); }

      // Interpolate the crossing of the paddle top, including fast or dropped frames.
      if (ball.vy > 0 && oldY + R <= p.y && ball.y + R >= p.y) {
        const t = (p.y - R - oldY) / (ball.y - oldY);
        const crossing = oldX + (ball.x - oldX) * t;
        if (crossing >= p.x - p.w / 2 - R && crossing <= p.x + p.w / 2 + R) {
          const speed = Math.hypot(ball.vx, ball.vy);
          const offset = clamp((crossing - p.x) / (p.w / 2), -1, 1);
          const angle = clamp(offset * 1.08 + clamp(p.vx / 650, -1, 1) * .1, -1.12, 1.12);
          const sign = ball.vx < 0 ? -1 : 1;
          ball.x = crossing;
          ball.y = p.y - R;
          ball.vx = Math.sin(angle) * speed;
          if (Math.abs(ball.vx) < speed * .12) ball.vx = sign * speed * .12;
          ball.vy = -Math.sqrt(speed ** 2 - ball.vx ** 2);
          this.combo = 0;
          this.emit({ type: 'paddle', x: crossing, y: p.y, color: '#7ccbbb' });
        }
      }
      if (this.shield && ball.vy > 0 && oldY + R <= H - 15 && ball.y + R >= H - 15) {
        this.shield = 0;
        ball.y = H - 15 - R;
        ball.vy = -Math.abs(ball.vy);
        this.emit({ type: 'save', x: ball.x, y: H - 15, color: '#8ec9ed' });
      }
      for (const brick of this.bricks) {
        if (brick.hp <= 0) continue;
        const dx = ball.x - clamp(ball.x, brick.x, brick.x + brick.w);
        const dy = ball.y - clamp(ball.y, brick.y, brick.y + brick.h);
        const d2 = dx * dx + dy * dy;
        if (d2 >= R * R) continue;
        if (d2 > 0) {
          const distance = Math.sqrt(d2);
          this.collideBrick(ball, brick, dx / distance, dy / distance, R - distance);
        } else {
          const sides = [{ d: ball.x - brick.x, nx: -1, ny: 0 }, { d: brick.x + brick.w - ball.x, nx: 1, ny: 0 },
            { d: ball.y - brick.y, nx: 0, ny: -1 }, { d: brick.y + brick.h - ball.y, nx: 0, ny: 1 }];
          const side = sides.reduce((a, b) => a.d < b.d ? a : b);
          this.collideBrick(ball, brick, side.nx, side.ny, R + side.d);
        }
        break;
      }
    }
    if (!this.remaining) {
      this.score += this.level * 100;
      this.lives = Math.min(5, this.lives + 1);
      this.mode = this.level === LEVELS.length ? 'won' : 'level';
      this.emit({ type: 'clear' });
      return;
    }
    this.balls = this.balls.filter(ball => ball.y <= H + R);
    if (!this.balls.length) {
      this.lives--;
      if (this.lives <= 0) this.mode = 'lost';
      else { this.serve(); this.mode = 'life'; }
      this.emit({ type: 'miss' });
      return;
    }
    this.drops = this.drops.filter(drop => {
      const oldY = drop.y;
      drop.y += 98 * dt;
      if (oldY - 12 <= p.y + p.h && drop.y + 12 >= p.y && Math.abs(drop.x - p.x) <= p.w / 2 + 21) {
        this.activatePower(drop.kind);
        return false;
      }
      return drop.y < H + 24;
    });
  }
}
