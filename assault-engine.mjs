export const W = 960, H = 540, WORLD = 5260, FLOOR = 454, STEP = 1 / 120;
export const ZOOM = 1.8, VIEW_W = W / ZOOM, VIEW_TOP = FLOOR + 64 - H / ZOOM;
export const GAPS = [[1110, 1190], [2450, 2540], [3590, 3680]];
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// Swept segment against an expanded rectangle; fast shots cannot skip a target.
export function segmentHit(x, y, nx, ny, box, padding = 0) {
  let near = 0, far = 1;
  for (const [start, delta, min, max] of [[x, nx - x, box.x - padding, box.x + box.w + padding], [y, ny - y, box.y - padding, box.y + box.h + padding]]) {
    if (Math.abs(delta) < .00001) { if (start < min || start > max) return null; continue; }
    const t1 = (min - start) / delta, t2 = (max - start) / delta;
    near = Math.max(near, Math.min(t1, t2)); far = Math.min(far, Math.max(t1, t2));
    if (near > far) return null;
  }
  return near;
}

export class AssaultGame {
  constructor({ random = Math.random, emit = () => {} } = {}) { this.random = random; this.emit = emit; this.reset(); }
  reset() {
    this.mode = 'ready'; this.time = 0; this.score = 0; this.lives = 3; this.deaths = 0; this.hits = 0;
    this.checkpoint = 0; this.combo = 0; this.comboTime = 0; this.camera = 0;
    this.bullets = []; this.grenades = []; this.supplies = [];
    this.solids = [];
    let from = 0;
    for (const [start, end] of [...GAPS, [WORLD, WORLD]]) {
      this.solids.push({ x: from, y: FLOOR, w: start - from, h: 150, oneWay: false }); from = end;
    }
    for (const [x, y, w] of [[390, 380, 190], [760, 332, 150], [1270, 375, 190], [1640, 310, 160], [2050, 375, 170], [2730, 370, 180], [3090, 308, 170], [3310, 378, 170], [3840, 365, 190]]) {
      this.solids.push({ x, y, w, h: 16, oneWay: true });
    }
    this.enemies = [];
    const add = (type, x, floor = FLOOR) => this.enemies.push({ type, x, origin: x, y: floor - (type === 'turret' ? 30 : type === 'drone' ? 24 : 40),
      baseY: floor - 24, w: type === 'turret' ? 34 : type === 'drone' ? 36 : 24, h: type === 'turret' ? 30 : type === 'drone' ? 24 : 40,
      hp: type === 'turret' ? 8 : type === 'elite' ? 5 : 3, maxHp: type === 'turret' ? 8 : type === 'elite' ? 5 : 3,
      timer: .9 + this.random() * .5, direction: -1, scored: false, flash: 0, floor });
    for (const x of [510, 720, 1340, 1530, 2040, 2310, 2760, 3010, 3390, 3820, 4110]) add('soldier', x);
    add('elite', 1780); add('elite', 3220); add('elite', 4300);
    add('turret', 930); add('turret', 1390, 375); add('turret', 2170, 375); add('turret', 3180, 308); add('turret', 3960);
    add('drone', 1880, 305); add('drone', 2900, 300); add('drone', 3740, 300);
    this.crates = [[310,'spread'], [1020,'health'], [1740,'rapid'], [2280,'health'], [2640,'spread'], [3480,'health'], [4240,'health'], [4480,'rapid']]
      .map(([x, kind]) => ({ x, y: FLOOR - 32, w: 32, h: 32, hp: 2, kind, opened: false }));
    this.boss = { x: 4660, y: FLOOR - 112, w: 152, h: 112, hp: 200, maxHp: 200, active: false, timer: 1.6, pattern: 0, flash: 0 };
    this.player = { x: 90, y: FLOOR - 40, w: 24, h: 40, vx: 0, vy: 0, facing: 1, hp: 5, grounded: true,
      invincible: 0, weapon: 'rifle', weaponTime: 0, grenades: 3, shot: 0, throwTime: 0, muzzle: 0, coyote: .1, jumpBuffer: 0 };
    this.aim = { x: 1, y: 0 };
  }

  start() {
    if (['ready', 'lost', 'won'].includes(this.mode)) this.reset();
    else if (this.mode === 'life') this.respawn();
    this.mode = 'playing';
  }
  respawn() {
    const x = this.checkpoint || 90;
    Object.assign(this.player, { x, y: FLOOR - 40, vx: 0, vy: 0, hp: 5, grounded: true, invincible: 2,
      facing: 1, weapon: 'rifle', weaponTime: 0, grenades: 3, shot: 0, throwTime: 0, muzzle: 0, jumpBuffer: 0, coyote: .1 });
    this.bullets = []; this.grenades = []; this.supplies = []; this.combo = 0;
    this.camera = clamp(x - VIEW_W * .35, 0, WORLD - VIEW_W);
    for (const enemy of this.enemies) if (enemy.origin >= x - 50) {
      enemy.x = enemy.origin; enemy.hp = enemy.maxHp; enemy.timer = 1.2; enemy.flash = 0;
    }
    for (const crate of this.crates) if (crate.x >= x - 50) { crate.hp = 2; crate.opened = false; }
    Object.assign(this.boss, { hp: this.boss.maxHp, active: false, timer: 1.6, pattern: 0, flash: 0 });
  }
  get zone() { return this.boss.active ? '首领战 · 注意蓄力和地面冲击波' : this.player.x >= 2200 ? '工业走廊' : '废墟入口'; }
  get progress() { return this.mode === 'won' ? 100 : Math.min(95, Math.round(this.player.x / 5150 * 100)); }
  get grade() { return this.deaths === 0 && this.hits <= 1 && this.time < 100 ? 'S' : this.deaths === 0 ? 'A' : this.deaths <= 1 ? 'B' : 'C'; }

  movePlayer(dt) {
    const p = this.player;
    p.x += p.vx * dt;
    p.x = clamp(p.x, this.boss.active ? 4400 : 0, WORLD - p.w - 10);
    const oldFeet = p.y + p.h;
    p.vy += 1500 * dt; p.y += p.vy * dt; p.grounded = false;
    for (const platform of this.solids) {
      if (p.vy >= 0 && oldFeet <= platform.y + 1 && p.y + p.h >= platform.y && p.x + p.w > platform.x && p.x < platform.x + platform.w) {
        p.y = platform.y - p.h; p.vy = 0; p.grounded = true;
      }
    }
    if (p.grounded) p.coyote = .1;
    if (p.y > H + 70) this.loseLife();
  }
  damagePlayer(amount = 1) {
    const p = this.player;
    if (this.mode !== 'playing' || p.invincible > 0) return;
    p.hp = Math.max(0, p.hp - amount); p.invincible = 1.15; this.hits++;
    this.score = Math.max(0, this.score - 50); this.combo = 0;
    this.emit({ type: 'hurt', x: p.x + 12, y: p.y + 20 });
    if (p.hp === 0) this.loseLife();
  }
  loseLife() {
    if (this.mode !== 'playing') return;
    this.lives--; this.deaths++; this.score = Math.max(0, this.score - 500);
    this.mode = this.lives > 0 ? 'life' : 'lost';
    this.emit({ type: 'death', x: this.player.x + 12, y: this.player.y + 20 });
  }
  hitEnemy(enemy, damage) {
    if (enemy.hp <= 0) return;
    enemy.hp = Math.max(0, enemy.hp - damage); enemy.flash = .08;
    this.emit({ type: 'hit', x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2 });
    if (enemy.hp > 0) return;
    this.emit({ type: 'explosion', x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2 });
    if (enemy === this.boss) {
      this.score += 3000 + Math.max(0, 12000 - Math.floor(this.time * 35));
      this.mode = 'won'; this.emit({ type: 'win' }); return;
    }
    if (!enemy.scored) {
      this.combo++; this.comboTime = 3;
      const points = (enemy.type === 'turret' ? 220 : enemy.type === 'elite' ? 180 : 120) * Math.min(3, 1 + Math.floor(this.combo / 4));
      this.score += points; enemy.scored = true;
      this.emit({ type: 'points', x: enemy.x + 12, y: enemy.y, text: `+${points}` });
    }
  }
  openCrate(crate) {
    if (crate.opened) return;
    crate.opened = true;
    this.supplies.push({ x: crate.x + 3, y: crate.y + 5, w: 28, h: 28, kind: crate.kind });
    this.emit({ type: 'crate', x: crate.x + 16, y: crate.y + 16 });
  }
  collectSupply(supply) {
    const p = this.player;
    if (supply.kind === 'health') p.hp = Math.min(5, p.hp + 2);
    else { p.weapon = supply.kind; p.weaponTime = supply.kind === 'spread' ? 16 : 18; p.grenades = Math.min(5, p.grenades + 1); }
    this.emit({ type: 'supply', x: supply.x + 14, y: supply.y, text: supply.kind === 'health' ? '生命 +2' : supply.kind === 'spread' ? '散射枪' : '机枪' });
  }
  fire(up) {
    const p = this.player;
    if (p.shot > 0) return;
    let vx = p.facing, vy = 0;
    if (up) { vx = Math.abs(p.vx) > 30 ? p.facing * .707 : 0; vy = Math.abs(p.vx) > 30 ? -.707 : -1; }
    else {
      // A small vertical correction keeps touch controls usable against drones.
      const candidates = [...this.enemies, ...(this.boss.active ? [this.boss] : [])].filter(e => e.hp > 0 &&
        (e.x + e.w / 2 - p.x) * p.facing > 35 && Math.abs(e.x - p.x) < 620 && Math.abs(e.y + e.h / 2 - p.y - 17) < 165);
      candidates.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
      if (candidates.length) {
        const target = candidates[0];
        const angle = clamp(Math.atan2(target.y + target.h / 2 - p.y - 17, Math.abs(target.x + target.w / 2 - p.x)), -.4, .4);
        vx = Math.cos(angle) * p.facing; vy = Math.sin(angle);
      }
    }
    this.aim = { x: vx, y: vy };
    for (const offset of p.weapon === 'spread' ? [-.16, 0, .16] : [0]) {
      const angle = Math.atan2(vy, vx) + offset;
      this.bullets.push({ x: p.x + 12 + vx * 18, y: p.y + 17 + vy * 8, vx: Math.cos(angle) * 850, vy: Math.sin(angle) * 850, ttl: 1.15, team: 'player', damage: 1 });
    }
    p.shot = p.weapon === 'rapid' ? .075 : p.weapon === 'spread' ? .21 : .16; p.muzzle = .055;
    this.emit({ type: 'shot' });
  }
  enemyFire(enemy, count = 1, speed = 210) {
    const p = this.player;
    const x = enemy === this.boss ? enemy.x - 58 : enemy.x + enemy.w / 2;
    const y = enemy === this.boss ? enemy.y + 26 : enemy.y + (enemy.type === 'turret' ? 10 : 17);
    const angle = Math.atan2(p.y + p.h / 2 - y, p.x + 12 - x);
    for (let i = 0; i < count; i++) {
      const a = angle + (i - (count - 1) / 2) * .13;
      this.bullets.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, ttl: 3, team: 'enemy', damage: 1 });
    }
  }
  throwGrenade() {
    const p = this.player;
    if (!p.grenades || p.throwTime > 0) return;
    p.grenades--; p.throwTime = .45;
    this.grenades.push({ x: p.x + 12, y: p.y + 10, vx: p.facing * 310, vy: -330, fuse: 1.05 });
    this.emit({ type: 'throw' });
  }
  explode(grenade) {
    this.emit({ type: 'blast', x: grenade.x, y: grenade.y });
    for (const enemy of [...this.enemies, ...(this.boss.active ? [this.boss] : [])]) {
      const dx = Math.max(enemy.x - grenade.x, 0, grenade.x - enemy.x - enemy.w);
      const dy = Math.max(enemy.y - grenade.y, 0, grenade.y - enemy.y - enemy.h);
      if (dx * dx + dy * dy < 125 ** 2) this.hitEnemy(enemy, enemy === this.boss ? 18 : 10);
    }
    for (const crate of this.crates) if (Math.abs(crate.x + 16 - grenade.x) < 115 && Math.abs(crate.y + 16 - grenade.y) < 115) { crate.hp = 0; this.openCrate(crate); }
  }

  step(dt, input = {}) {
    if (this.mode !== 'playing') return;
    this.time += dt;
    const p = this.player;
    p.invincible = Math.max(0, p.invincible - dt); p.shot = Math.max(0, p.shot - dt);
    p.throwTime = Math.max(0, p.throwTime - dt); p.muzzle = Math.max(0, p.muzzle - dt);
    p.weaponTime = Math.max(0, p.weaponTime - dt); if (!p.weaponTime) p.weapon = 'rifle';
    p.coyote = Math.max(0, p.coyote - dt); p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    this.comboTime = Math.max(0, this.comboTime - dt); if (!this.comboTime) this.combo = 0;
    const move = clamp(Number(input.move) || 0, -1, 1);
    p.vx += (move * 240 - p.vx) * Math.min(1, dt * 18);
    if (move) { p.facing = move; if (!input.fire) this.aim = { x: move, y: 0 }; }
    if (input.jumpPressed) p.jumpBuffer = .12;
    if (p.jumpBuffer > 0 && p.coyote > 0) { p.vy = -575; p.grounded = false; p.coyote = 0; p.jumpBuffer = 0; this.emit({ type: 'jump' }); }
    if (!input.jump && p.vy < -230) p.vy += 1000 * dt;
    this.movePlayer(dt);
    if (this.mode !== 'playing') return;
    this.camera += (clamp(p.x - VIEW_W * .38, 0, WORLD - VIEW_W) - this.camera) * Math.min(1, dt * 7);
    for (const checkpoint of [2200, 4200]) if (p.x >= checkpoint && this.checkpoint < checkpoint) {
      this.checkpoint = checkpoint; this.emit({ type: 'checkpoint', text: '检查点已激活' });
    }
    if (p.x >= 4500 && !this.boss.active) { this.boss.active = true; this.emit({ type: 'boss', text: '装甲车来袭' }); }
    if (input.fire) this.fire(input.up);
    if (input.grenadePressed) this.throwGrenade();

    for (const enemy of this.enemies) {
      enemy.flash = Math.max(0, enemy.flash - dt);
      if (enemy.hp <= 0 || enemy.x < this.camera - 80 || enemy.x > this.camera + VIEW_W + 20) continue;
      enemy.direction = p.x < enemy.x ? -1 : 1;
      if (enemy.type === 'drone') { enemy.x = enemy.origin + Math.sin(this.time * 1.2) * 35; enemy.y = enemy.baseY + Math.sin(this.time * 2) * 24; }
      else if (enemy.type !== 'turret') enemy.x = enemy.origin + Math.sin(this.time * .9 + enemy.origin) * 27;
      enemy.timer -= dt;
      if (enemy.timer <= 0) { this.enemyFire(enemy, enemy.type === 'elite' || enemy.type === 'turret' ? 3 : 1, enemy.type === 'drone' ? 180 : 210); enemy.timer = enemy.type === 'soldier' ? 1.5 : 1.85; }
      if (overlaps(p, enemy)) this.damagePlayer();
    }
    if (this.mode !== 'playing') return;
    const boss = this.boss;
    boss.flash = Math.max(0, boss.flash - dt);
    if (boss.active && boss.hp > 0) {
      boss.timer -= dt;
      if (boss.timer <= 0) {
        boss.pattern++;
        if (boss.pattern % 3 === 0) {
          for (const delay of [0, 70]) this.bullets.push({ x: boss.x - delay, y: FLOOR - 9, vx: -255, vy: 0, ttl: 3.5, team: 'enemy', damage: 1, wave: true });
        } else this.enemyFire(boss, boss.hp < 55 ? 7 : 5, boss.hp < 55 ? 230 : 200);
        boss.timer = boss.hp < 55 ? 1.3 : 1.9; this.emit({ type: 'bossShot' });
      }
      if (overlaps(p, boss)) this.damagePlayer(2);
    }
    if (this.mode !== 'playing') return;

    for (const bullet of this.bullets) {
      const nx = bullet.x + bullet.vx * dt, ny = bullet.y + bullet.vy * dt;
      bullet.ttl -= dt;
      if (bullet.team === 'player') {
        let closest = 2, target = null, type = '';
        const consider = (box, kind, padding = 2) => {
          const t = segmentHit(bullet.x, bullet.y, nx, ny, box, padding);
          if (t !== null && t < closest) { closest = t; target = box; type = kind; }
        };
        for (const enemy of this.enemies) if (enemy.hp > 0) consider(enemy, 'enemy');
        if (boss.active && boss.hp > 0) consider(boss, 'enemy');
        for (const crate of this.crates) if (crate.hp > 0) consider(crate, 'crate');
        for (const platform of this.solids) consider(platform, 'solid', 0);
        if (target) {
          bullet.ttl = 0;
          if (type === 'enemy') this.hitEnemy(target, bullet.damage);
          else if (type === 'crate') { target.hp--; if (target.hp <= 0) this.openCrate(target); }
        }
      } else {
        if (segmentHit(bullet.x, bullet.y, nx, ny, p, 2) !== null) { bullet.ttl = 0; this.damagePlayer(bullet.damage); }
        else if (!bullet.wave && this.solids.some(platform => segmentHit(bullet.x, bullet.y, nx, ny, platform) !== null)) bullet.ttl = 0;
      }
      bullet.x = nx; bullet.y = ny;
      if (this.mode !== 'playing') return;
    }
    this.bullets = this.bullets.filter(b => b.ttl > 0 && b.x > -30 && b.x < WORLD + 30 && b.y > -100 && b.y < H + 50);
    for (const grenade of this.grenades) {
      const oldY = grenade.y; grenade.vy += 900 * dt; grenade.x += grenade.vx * dt; grenade.y += grenade.vy * dt; grenade.fuse -= dt;
      for (const platform of this.solids) if (grenade.vy > 0 && oldY <= platform.y && grenade.y >= platform.y && grenade.x >= platform.x && grenade.x <= platform.x + platform.w) {
        grenade.y = platform.y - 3; grenade.vy *= -.22; grenade.vx *= .65;
      }
      if (grenade.fuse <= 0) this.explode(grenade);
    }
    this.grenades = this.grenades.filter(g => g.fuse > 0 && g.y < H + 80);
    this.supplies = this.supplies.filter(supply => { if (overlaps(p, supply)) { this.collectSupply(supply); return false; } return true; });
  }
}
