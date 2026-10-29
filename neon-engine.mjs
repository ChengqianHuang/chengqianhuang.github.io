export const WIDTH = 1600;
export const HEIGHT = 900;
export const STEP = 1 / 120;
export const TAU = Math.PI * 2;

export const ENEMY = Object.freeze({
  chaser: { hp: 24, r: 17, score: 100, color: '#38f8ff' },
  drifter: { hp: 36, r: 20, score: 140, color: '#ff3fd8' },
  splitter: { hp: 72, r: 27, score: 240, color: '#ffad33' },
  shard: { hp: 12, r: 10, score: 45, color: '#ffe66d' },
  orbiter: { hp: 58, r: 22, score: 260, color: '#6dff8f' },
  sniper: { hp: 64, r: 23, score: 320, color: '#a778ff' },
  gravity: { hp: 130, r: 32, score: 480, color: '#4878ff' },
  boss: { hp: 2600, r: 76, score: 12000, color: '#ff376f' }
});

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const length = (x, y) => Math.hypot(x, y);
const norm = (x, y) => {
  const l = Math.hypot(x, y);
  return l > 0.0001 ? [x / l, y / l, l] : [0, 0, 0];
};
const distance2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

export class NeonGame {
  constructor({ random = Math.random, emit = () => {}, mode = 'standard' } = {}) {
    this.random = random;
    this.emit = emit;
    this.mode = mode;
    this.reset({ mode });
  }

  reset({ mode = this.mode } = {}) {
    this.mode = mode;
    this.state = 'ready';
    this.time = 0;
    this.score = 0;
    this.kills = 0;
    this.combo = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.wave = 1;
    this.nextSpawn = 0.6;
    this.bossSpawned = false;
    this.result = null;
    this.nextID = 1;
    this.player = {
      x: WIDTH / 2, y: HEIGHT * 0.62, vx: 0, vy: 0,
      r: 15, angle: -Math.PI / 2, hp: 100, maxHp: 100,
      energy: 0, fireCooldown: 0, dashCooldown: 0, dashTime: 0,
      invulnerable: 0, hit: 0
    };
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.pickups = [];
    this.hazards = [];
  }

  start() {
    if (this.state !== 'ready') return;
    this.state = 'playing';
    this.emit({ type: 'wave', wave: this.mode === 'boss' ? 0 : 1, x: WIDTH / 2, y: HEIGHT / 2 });
  }

  spawnEnemy(kind, x, y, options = {}) {
    const spec = ENEMY[kind];
    if (!spec) throw new Error(`Unknown enemy: ${kind}`);
    const a = this.random() * TAU;
    const enemy = {
      id: this.nextID++, kind, x, y,
      vx: options.vx ?? Math.cos(a) * 80,
      vy: options.vy ?? Math.sin(a) * 80,
      r: spec.r, hp: spec.hp, maxHp: spec.hp,
      score: spec.score, color: spec.color,
      age: 0, angle: a, cooldown: 0.7 + this.random(),
      hit: 0, phase: 1, attack: 1, summon: 3,
      laser: 2.5, spiral: 0, windup: 0,
      ...options
    };
    this.enemies.push(enemy);
    return enemy;
  }

  spawnAtEdge(kind) {
    const side = Math.floor(this.random() * 4);
    const pad = 55;
    const x = side === 0 ? -pad : side === 1 ? WIDTH + pad : this.random() * WIDTH;
    const y = side === 2 ? -pad : side === 3 ? HEIGHT + pad : this.random() * HEIGHT;
    const enemy = this.spawnEnemy(kind, x, y);
    this.emit({ type: 'spawn', x, y, kind, color: enemy.color });
    return enemy;
  }

  spawnBoss() {
    if (this.bossSpawned) return null;
    this.bossSpawned = true;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      this.emit({ type: 'explosion', x: e.x, y: e.y, color: e.color, size: 0.7, kind: e.kind });
    }
    this.enemies.length = 0;
    this.enemyBullets.length = 0;
    this.hazards.length = 0;
    const boss = this.spawnEnemy('boss', WIDTH / 2, -100, { vx: 0, vy: 0 });
    this.emit({ type: 'bossSpawn', x: boss.x, y: boss.y, color: boss.color });
    return boss;
  }

  fireBullet(x, y, angle, friendly, speed, damage, color, radius = 5) {
    const bullet = {
      x, y, px: x, py: y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      r: radius, damage, color, life: friendly ? 1.7 : 7,
      friendly
    };
    (friendly ? this.bullets : this.enemyBullets).push(bullet);
    return bullet;
  }

  radial(x, y, count, speed, offset = 0, damage = 9) {
    for (let i = 0; i < count; i++) {
      this.fireBullet(x, y, offset + i * TAU / count, false, speed, damage, '#ff4fa3', 6);
    }
  }

  killEnemy(index, award = true) {
    if (this.state !== 'playing') return;
    const e = this.enemies[index];
    if (!e) return;
    this.enemies.splice(index, 1);
    this.emit({ type: 'explosion', x: e.x, y: e.y, color: e.color, size: e.kind === 'boss' ? 5 : e.r / 18, kind: e.kind });
    if (award) {
      this.kills++;
      this.combo++;
      this.comboTimer = 3.2;
      this.multiplier = Math.min(8, 1 + Math.floor(this.combo / 5));
      this.score += e.score * this.multiplier;
    }
    if (e.kind === 'splitter') {
      for (let i = 0; i < 3; i++) {
        const a = i * TAU / 3 + this.random();
        this.spawnEnemy('shard', e.x + Math.cos(a) * 25, e.y + Math.sin(a) * 25, {
          vx: Math.cos(a) * 260, vy: Math.sin(a) * 260
        });
      }
    }
    if (e.kind === 'gravity') this.radial(e.x, e.y, 14, 180, this.random() * TAU, 8);
    if (e.kind === 'boss') {
      this.enemyBullets.length = 0;
      this.hazards.length = 0;
      this.state = 'victory';
      this.result = { score: this.score, time: this.time, kills: this.kills };
      this.emit({ type: 'victory', x: e.x, y: e.y });
      return;
    }
    const drops = e.kind === 'gravity' ? 5 : this.random() < 0.3 ? 2 : 1;
    for (let i = 0; i < drops; i++) {
      const a = this.random() * TAU;
      this.pickups.push({
        x: e.x, y: e.y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120,
        r: 7, kind: this.random() < 0.055 ? 'health' : 'energy', life: 12,
        value: 8, angle: a
      });
    }
  }

  damagePlayer(amount) {
    const p = this.player;
    if (this.state !== 'playing' || p.invulnerable > 0 || p.dashTime > 0) return false;
    p.hp = Math.max(0, p.hp - amount);
    p.invulnerable = 0.85;
    p.hit = 0.35;
    this.combo = 0;
    this.multiplier = 1;
    this.comboTimer = 0;
    this.emit({ type: 'playerHit', x: p.x, y: p.y, damage: amount });
    if (p.hp <= 0) {
      this.state = 'gameover';
      this.result = { score: this.score, time: this.time, kills: this.kills };
      this.emit({ type: 'explosion', x: p.x, y: p.y, color: '#63f7ff', size: 3.5, kind: 'player' });
      this.emit({ type: 'gameover' });
    }
    return true;
  }

  pulse() {
    const p = this.player;
    if (p.energy < 100 || this.state !== 'playing') return false;
    p.energy = 0;
    p.invulnerable = Math.max(p.invulnerable, 0.65);
    this.enemyBullets.length = 0;
    this.hazards.length = 0;
    this.emit({ type: 'pulse', x: p.x, y: p.y });
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.hp -= e.kind === 'boss' ? 120 : 95;
      e.hit = 0.18;
      if (e.hp <= 0) this.killEnemy(i);
    }
    return true;
  }

  updatePlayer(dt, input) {
    const p = this.player;
    p.fireCooldown -= dt;
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    p.dashTime = Math.max(0, p.dashTime - dt);
    p.invulnerable = Math.max(0, p.invulnerable - dt);
    p.hit = Math.max(0, p.hit - dt);
    let [mx, my] = norm(input.moveX || 0, input.moveY || 0);
    const [ax, ay, al] = norm(input.aimX || 0, input.aimY || 0);
    if (al > 0.1) p.angle = Math.atan2(ay, ax);
    if (input.dash && p.dashCooldown <= 0) {
      if (!mx && !my) [mx, my] = [Math.cos(p.angle), Math.sin(p.angle)];
      p.dashTime = 0.19;
      p.dashCooldown = 1.25;
      p.invulnerable = Math.max(p.invulnerable, 0.24);
      p.vx = mx * 1280;
      p.vy = my * 1280;
      this.emit({ type: 'dash', x: p.x, y: p.y, angle: Math.atan2(my, mx) });
    }
    if (input.pulse) this.pulse();
    if (p.dashTime <= 0) {
      const speed = 390;
      const responsiveness = 1 - Math.exp(-dt * 13);
      p.vx += (mx * speed - p.vx) * responsiveness;
      p.vy += (my * speed - p.vy) * responsiveness;
    }
    p.x = clamp(p.x + p.vx * dt, p.r + 8, WIDTH - p.r - 8);
    p.y = clamp(p.y + p.vy * dt, p.r + 8, HEIGHT - p.r - 8);
    if (input.fire && p.fireCooldown <= 0) {
      const level = this.multiplier >= 8 ? 3 : this.multiplier >= 4 ? 2 : 1;
      for (let i = 0; i < level; i++) {
        const spread = (i - (level - 1) / 2) * 0.09;
        const a = p.angle + spread;
        this.fireBullet(
          p.x + Math.cos(a) * 24, p.y + Math.sin(a) * 24,
          a, true, 1040, this.mode === 'boss' ? 15 : 13, '#7dfbff', 4
        );
      }
      p.fireCooldown = 0.082;
      p.vx -= Math.cos(p.angle) * 5;
      p.vy -= Math.sin(p.angle) * 5;
      this.emit({ type: 'shot', x: p.x + Math.cos(p.angle) * 25, y: p.y + Math.sin(p.angle) * 25, angle: p.angle });
    }
  }

  updateEnemy(e, dt) {
    const p = this.player;
    const [dx, dy, d] = norm(p.x - e.x, p.y - e.y);
    e.age += dt;
    e.hit = Math.max(0, e.hit - dt);
    e.cooldown -= dt;
    const steer = (tx, ty, accel, max) => {
      e.vx += tx * accel * dt;
      e.vy += ty * accel * dt;
      const [nx, ny, speed] = norm(e.vx, e.vy);
      if (speed > max) { e.vx = nx * max; e.vy = ny * max; }
    };
    if (e.kind === 'chaser' || e.kind === 'shard') {
      steer(dx, dy, e.kind === 'shard' ? 650 : 410, e.kind === 'shard' ? 285 : 190);
    } else if (e.kind === 'splitter') {
      steer(dx, dy, 260, 105);
    } else if (e.kind === 'drifter') {
      const [nx, ny, speed] = norm(e.vx, e.vy);
      if (speed < 170) { e.vx = nx * 210; e.vy = ny * 210; }
    } else if (e.kind === 'orbiter') {
      const radial = clamp((d - 270) / 120, -1, 1);
      steer(dx * radial - dy * 0.9, dy * radial + dx * 0.9, 390, 215);
      if (e.cooldown <= 0 && d < 720) {
        this.fireBullet(e.x, e.y, Math.atan2(dy, dx), false, 320, 9, '#75ffad');
        e.cooldown = 1.65;
      }
    } else if (e.kind === 'sniper') {
      const radial = d < 390 ? -1 : d > 560 ? 1 : 0;
      steer(dx * radial - dy * 0.25, dy * radial + dx * 0.25, 310, 160);
      if (e.windup > 0) {
        e.windup -= dt;
        if (e.windup <= 0) {
          for (let i = -1; i <= 1; i++) this.fireBullet(e.x, e.y, Math.atan2(dy, dx) + i * 0.055, false, 610, 13, '#bd8cff', 5);
          this.emit({ type: 'sniper', x: e.x, y: e.y });
          e.cooldown = 2.5;
        }
      } else if (e.cooldown <= 0 && d < 900) {
        e.windup = 0.75;
        this.emit({ type: 'telegraph', x: e.x, y: e.y, tx: p.x, ty: p.y, color: e.color });
      }
    } else if (e.kind === 'gravity') {
      steer(dx, dy, 160, 85);
      if (d < 390 && d > 1) {
        const pull = (1 - d / 390) * 270;
        p.vx -= dx * pull * dt;
        p.vy -= dy * pull * dt;
      }
      if (e.cooldown <= 0) {
        this.radial(e.x, e.y, 10, 175, e.age * 0.4, 8);
        e.cooldown = 3.1;
      }
    } else if (e.kind === 'boss') {
      this.updateBoss(e, dt, dx, dy, d);
    }
    if (e.kind !== 'boss') {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      const pad = e.r + 5;
      if (e.kind === 'drifter') {
        if (e.x < pad || e.x > WIDTH - pad) e.vx *= -1;
        if (e.y < pad || e.y > HEIGHT - pad) e.vy *= -1;
        e.x = clamp(e.x, pad, WIDTH - pad);
        e.y = clamp(e.y, pad, HEIGHT - pad);
      } else if (e.age > 1.5) {
        e.x = clamp(e.x, pad, WIDTH - pad);
        e.y = clamp(e.y, pad, HEIGHT - pad);
      }
    }
    e.angle += dt * ({ chaser: 2.2, drifter: -1.6, splitter: 1.1, shard: 4, orbiter: -2.8, sniper: 0.5, gravity: 0.8, boss: 0.25 }[e.kind] || 1);
  }

  updateBoss(e, dt, dx, dy) {
    const targetX = WIDTH / 2 + Math.cos(e.age * 0.37) * 280;
    const targetY = HEIGHT * 0.32 + Math.sin(e.age * 0.53) * 105;
    e.vx += (targetX - e.x) * dt * 2.1;
    e.vy += (targetY - e.y) * dt * 2.1;
    e.vx *= Math.exp(-dt * 2.4);
    e.vy *= Math.exp(-dt * 2.4);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    const nextPhase = e.hp <= e.maxHp / 3 ? 3 : e.hp <= e.maxHp * 2 / 3 ? 2 : 1;
    if (nextPhase !== e.phase) {
      e.phase = nextPhase;
      e.attack = 0.8;
      e.laser = 1.5;
      this.enemyBullets.length = 0;
      this.hazards.length = 0;
      this.emit({ type: 'bossPhase', phase: e.phase, x: e.x, y: e.y });
      this.pickups.push({ x: e.x, y: e.y + 80, vx: 0, vy: 80, r: 9, kind: 'health', life: 15, value: 25, angle: 0 });
    }
    e.attack -= dt;
    e.summon -= dt;
    e.laser -= dt;
    if (e.phase === 1 && e.attack <= 0) {
      this.radial(e.x, e.y, 18, 225, e.age * 0.35, 10);
      for (let i = -1; i <= 1; i++) this.fireBullet(e.x, e.y, Math.atan2(dy, dx) + i * 0.13, false, 390, 12, '#ffcc55');
      e.attack = 1.45;
    } else if (e.phase === 2) {
      if (e.attack <= 0) {
        for (let arm = 0; arm < 3; arm++) this.fireBullet(e.x, e.y, e.spiral + arm * TAU / 3, false, 265, 9, '#ff55d7');
        e.spiral += 0.31;
        e.attack = 0.105;
      }
      if (e.summon <= 0) {
        const count = Math.min(3, Math.max(0, 60 - this.enemies.length));
        for (let i = 0; i < count; i++) this.spawnEnemy('chaser', e.x + (i - (count - 1) / 2) * 70, e.y + 90);
        e.summon = 4.2;
        if (count) this.emit({ type: 'spawn', x: e.x, y: e.y, kind: 'chaser', color: '#38f8ff' });
      }
    } else if (e.phase === 3) {
      if (e.attack <= 0) {
        this.radial(e.x, e.y, 24, 290, e.age * 0.7, 11);
        e.attack = 0.82;
      }
      if (e.laser <= 0) {
        const a = Math.atan2(dy, dx);
        this.hazards.push({ x: e.x, y: e.y, angle: a, length: 1900, width: 28, telegraph: 1.05, active: 0.72 });
        e.laser = 3.15;
        this.emit({ type: 'laser', x: e.x, y: e.y, angle: a });
      }
      if (e.summon <= 0) {
        const count = Math.min(2, Math.max(0, 60 - this.enemies.length));
        if (count) this.spawnEnemy('orbiter', e.x - 90, e.y + 70);
        if (count > 1) this.spawnEnemy('orbiter', e.x + 90, e.y + 70);
        e.summon = 5;
      }
    }
  }

  updateHazards(dt) {
    const p = this.player;
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      if (h.telegraph > 0) h.telegraph -= dt;
      else h.active -= dt;
      if (h.telegraph <= 0 && h.active > 0) {
        const vx = p.x - h.x, vy = p.y - h.y;
        const c = Math.cos(h.angle), s = Math.sin(h.angle);
        const along = vx * c + vy * s;
        const across = Math.abs(vx * s - vy * c);
        if (along > 0 && along < h.length && across < h.width + p.r) this.damagePlayer(24);
      }
      if (h.active <= 0) this.hazards.splice(i, 1);
    }
  }

  updateBullets(dt) {
    const groups = [this.bullets, this.enemyBullets];
    for (const group of groups) {
      for (let i = group.length - 1; i >= 0; i--) {
        const b = group[i];
        b.px = b.x; b.py = b.y;
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        if (b.life <= 0 || b.x < -100 || b.x > WIDTH + 100 || b.y < -100 || b.y > HEIGHT + 100) group.splice(i, 1);
      }
    }
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      let hit = false;
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const e = this.enemies[j];
        if (distance2(b, e) < (b.r + e.r) ** 2) {
          e.hp -= b.damage;
          e.hit = 0.09;
          this.emit({ type: 'hit', x: b.x, y: b.y, color: e.color });
          if (e.hp <= 0) this.killEnemy(j);
          hit = true;
          break;
        }
      }
      if (hit) this.bullets.splice(i, 1);
    }
    const p = this.player;
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      if (distance2(b, p) < (b.r + p.r) ** 2) {
        if (this.damagePlayer(b.damage)) this.enemyBullets.splice(i, 1);
      }
    }
  }

  updatePickups(dt) {
    const p = this.player;
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const item = this.pickups[i];
      item.life -= dt;
      item.angle += dt * 3;
      const [dx, dy, d] = norm(p.x - item.x, p.y - item.y);
      if (d < 230) {
        const pull = 900 * (1 - d / 260) + 180;
        item.vx += dx * pull * dt;
        item.vy += dy * pull * dt;
      }
      item.vx *= Math.exp(-dt * 2.3);
      item.vy *= Math.exp(-dt * 2.3);
      item.x += item.vx * dt;
      item.y += item.vy * dt;
      if (d < p.r + 17) {
        if (item.kind === 'health') p.hp = Math.min(p.maxHp, p.hp + item.value);
        else p.energy = Math.min(100, p.energy + item.value);
        this.score += 25 * this.multiplier;
        this.emit({ type: 'pickup', x: item.x, y: item.y, kind: item.kind });
        this.pickups.splice(i, 1);
      } else if (item.life <= 0) this.pickups.splice(i, 1);
    }
  }

  updateDirector() {
    if (this.mode === 'boss') {
      if (!this.bossSpawned && this.time >= 2) this.spawnBoss();
      return;
    }
    if (!this.bossSpawned && this.time >= 60) {
      this.spawnBoss();
      return;
    }
    if (this.bossSpawned) return;
    const wave = this.time >= 40 ? 3 : this.time >= 20 ? 2 : 1;
    if (wave !== this.wave) {
      this.wave = wave;
      this.emit({ type: 'wave', wave, x: WIDTH / 2, y: HEIGHT / 2 });
    }
    if (this.time < this.nextSpawn || this.enemies.length > 65) return;
    const pools = [
      ['chaser', 'chaser', 'drifter'],
      ['chaser', 'drifter', 'splitter', 'orbiter'],
      ['chaser', 'drifter', 'splitter', 'orbiter', 'sniper', 'gravity']
    ];
    const pool = pools[this.wave - 1];
    this.spawnAtEdge(pool[Math.floor(this.random() * pool.length)]);
    const interval = [0.82, 0.61, 0.43][this.wave - 1];
    this.nextSpawn = this.time + interval * (0.75 + this.random() * 0.5);
  }

  step(dt, input = {}) {
    if (this.state !== 'playing') return;
    this.time += dt;
    this.updateDirector();
    this.updatePlayer(dt, input);
    if (this.state !== 'playing') return;
    for (const e of this.enemies) this.updateEnemy(e, dt);
    for (let i = 0; i < this.enemies.length; i++) {
      const a = this.enemies[i];
      for (let j = i + 1; j < this.enemies.length; j++) {
        const b = this.enemies[j];
        const [dx, dy, d] = norm(b.x - a.x, b.y - a.y);
        const overlap = (a.r + b.r) * 0.72 - d;
        if (overlap > 0 && d > 0) {
          a.x -= dx * overlap * 0.08; a.y -= dy * overlap * 0.08;
          b.x += dx * overlap * 0.08; b.y += dy * overlap * 0.08;
        }
      }
      if (distance2(a, this.player) < (a.r + this.player.r) ** 2) {
        this.damagePlayer(a.kind === 'boss' ? 28 : a.kind === 'gravity' ? 20 : 14);
        if (this.state !== 'playing') return;
      }
    }
    this.updateHazards(dt);
    if (this.state !== 'playing') return;
    this.updateBullets(dt);
    if (this.state !== 'playing') return;
    this.updatePickups(dt);
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) { this.combo = 0; this.multiplier = 1; }
    }
  }
}
